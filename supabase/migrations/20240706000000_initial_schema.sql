-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role TEXT DEFAULT 'user',
  creator_status TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  thumbnail TEXT,
  file_url TEXT,
  file_name TEXT,
  file_type TEXT,
  file_size BIGINT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  downloads INT DEFAULT 0,
  views INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE
);

-- Create creator applications table
CREATE TABLE IF NOT EXISTS creator_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  portfolio_url TEXT,
  experience TEXT,
  application_text TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for resources
CREATE POLICY "Published resources are viewable by everyone"
  ON resources FOR SELECT
  USING (status = 'published');

CREATE POLICY "Creators can view all their resources"
  ON resources FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can insert their own resources"
  ON resources FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can update their own resources"
  ON resources FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can delete their own resources"
  ON resources FOR DELETE
  USING (creator_id = auth.uid());

-- Create policies for creator applications
CREATE POLICY "Users can view their own applications"
  ON creator_applications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own applications"
  ON creator_applications FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create policies for purchases
CREATE POLICY "Users can view their own purchases"
  ON purchases FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Creators can view purchases of their resources"
  ON purchases FOR SELECT
  USING (
    resource_id IN (
      SELECT id FROM resources WHERE creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own purchases"
  ON purchases FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create policies for analytics events
CREATE POLICY "Analytics events are insertable by authenticated users"
  ON analytics_events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_applications_updated_at
  BEFORE UPDATE ON creator_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, created_at, updated_at)
  VALUES (new.id, new.raw_user_meta_data->>'name', 
          COALESCE(new.raw_user_meta_data->>'role', 'user'),
          now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create a profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

