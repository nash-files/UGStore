import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { Database } from '@/types/supabase'

export async function getServerSession() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  return session
}

export async function getServerUser() {
  const session = await getServerSession()
  
  if (!session?.user) {
    return null
  }
  
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })
  
  // Get user profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()
  
  // Merge profile data with user
  return {
    ...session.user,
    role: profile?.role || 'user',
    creatorStatus: profile?.creator_status,
    name: profile?.name,
    avatarUrl: profile?.avatar_url
  }
}

export async function requireAuth(allowedRoles: string[] = ['user', 'creator', 'admin']) {
  const user = await getServerUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const userRole = user.role || 'user'
  
  if (!allowedRoles.includes(userRole)) {
    redirect('/unauthorized')
  }
  
  return user
}

