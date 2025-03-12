-- Create tables
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role TEXT CHECK (role IN ('user', 'creator', 'admin')) DEFAULT 'user',
  creator_status TEXT CHECK (creator_status IN ('pending', 'approved', 'rejected')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  thumbnail TEXT,
  file_url TEXT,
  file_name TEXT,
  file_type TEXT,
  file_size BIGINT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE creator_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  portfolio_url TEXT,
  experience TEXT,
  application_text TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('completed', 'pending', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create view for resources with creator info
CREATE VIEW resource_with_creator AS
SELECT 
  r.id,
  r.title,
  r.description,
  r.price,
  r.category,
  r.creator_id,
  p.name as creator_name,
  r.tags,
  r.thumbnail,
  r.file_url,
  r.status,
  r.created_at,
  r.downloads,
  r.views,
  r.featured
FROM resources r
LEFT JOIN profiles p ON r.creator_id = p.id;

-- Create functions for analytics
CREATE OR REPLACE FUNCTION increment_resource_views(resource_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE resources
  SET views = views + 1
  WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_resource_downloads(resource_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE resources
  SET downloads = downloads + 1
  WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql;

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
CREATE POLICY "Approved resources are viewable by everyone"
  ON resources FOR SELECT
  USING (status = 'approved' OR creator_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Creators can insert their own resources"
  ON resources FOR INSERT
  WITH CHECK (creator_id = auth.uid() AND 
              EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('creator', 'admin')));

CREATE POLICY "Creators can update their own resources"
  ON resources FOR UPDATE
  USING (creator_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Creators can delete their own resources"
  ON resources FOR DELETE
  USING (creator_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create policies for creator applications
CREATE POLICY "Users can view their own applications"
  ON creator_applications FOR SELECT
  USING (user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can insert their own applications"
  ON creator_applications FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create policies for purchases
CREATE POLICY "Users can view their own purchases"
  ON purchases FOR SELECT
  USING (user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') OR
         EXISTS (SELECT 1 FROM resources WHERE id = resource_id AND creator_id = auth.uid()));

CREATE POLICY "Users can insert their own purchases"
  ON purchases FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create policies for analytics events
CREATE POLICY "Analytics events are insertable by authenticated users"
  ON analytics_events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own analytics events"
  ON analytics_events FOR SELECT
  USING (user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') OR
         EXISTS (SELECT 1 FROM resources WHERE id = resource_id AND creator_id = auth.uid()));

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_resources_modtime
BEFORE UPDATE ON resources
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_creator_applications_modtime
BEFORE UPDATE ON creator_applications
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

