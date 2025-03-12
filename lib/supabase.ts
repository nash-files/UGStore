import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kxzexmqtwjjpdmqqlfde.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4emV4bXF0d2pqcGRtcXFsZmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODE1NTksImV4cCI6MjA1NzA1NzU1OX0.jxDTuQ45jpsTYSV5_m-kQDmiBz9pv76GhHIwyVWpqeQ"

// Create client with type safety
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: isBrowser, // Don't persist session in SSR
    autoRefreshToken: isBrowser, // Only refresh token in browser
    detectSessionInUrl: isBrowser, // Detect session in URL only in browser
  },
  global: {
    headers: {
      "x-application-name": "resource-marketplace",
    },
  },
})

// Create a server-side only client for server components
export const createServerSupabaseClient = () => {
  // Note: This requires the SUPABASE_SERVICE_ROLE_KEY environment variable
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kxzexmqtwjjpdmqqlfde.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          "x-application-name": "resource-marketplace-server",
        },
      },
    },
  )
}

