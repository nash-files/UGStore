"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Session, User, AuthError } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type UserRole = "user" | "creator" | "admin"

type AuthUser = User & {
  role?: UserRole
  creatorStatus?: "pending" | "approved" | "rejected"
  name?: string
  avatarUrl?: string
}

type AuthContextType = {
  user: AuthUser | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateUserProfile: (data: any) => Promise<{ error: any }>
  applyForCreator: (data: any) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      setIsLoading(true)

      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting auth session:", error)
          return
        }

        setSession(data.session)

        if (data.session?.user) {
          setUser(data.session.user as AuthUser)
        }
      } catch (error) {
        console.error("Unexpected error during auth initialization:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser((session?.user as AuthUser) || null)

      // Refresh the page on sign in or sign out to ensure
      // data is properly fetched after auth state change
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // Get user profile data when user changes
  useEffect(() => {
    async function getUserProfile() {
      if (!user?.id) return

      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching user profile:", error)
          return
        }

        if (data) {
          // Merge profile data with user
          setUser((prev) => ({
            ...prev!,
            role: data.role || "user",
            creatorStatus: data.creator_status,
            name: data.name,
            avatarUrl: data.avatar_url,
          }))
        }
      } catch (error) {
        console.error("Error in getUserProfile:", error)
      }
    }

    if (user?.id) {
      getUserProfile()
    }
  }, [user?.id])

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      })

      if (error) {
        return { error }
      }

      // Create profile record
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            name,
            role,
            creator_status: role === "creator" ? "pending" : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        if (profileError) {
          return { error: profileError }
        }
      }

      return { error: null }
    } catch (error) {
      console.error("Unexpected error during sign up:", error)
      return { error: error as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return { error }
    } catch (error) {
      console.error("Unexpected error during sign in:", error)
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (error) {
      console.error("Error resetting password:", error)
      return { error: error as AuthError }
    }
  }

  const updateUserProfile = async (data: any) => {
    try {
      if (!user?.id) return { error: "No user logged in" }

      // Update auth metadata if name is included
      if (data.name) {
        const { error: authUpdateError } = await supabase.auth.updateUser({
          data: { name: data.name },
        })

        if (authUpdateError) {
          console.error("Error updating auth user data:", authUpdateError)
        }
      }

      // Update profile record
      const { error } = await supabase
        .from("profiles")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      return { error }
    } catch (error) {
      console.error("Error updating user profile:", error)
      return { error }
    }
  }

  const applyForCreator = async (data: any) => {
    try {
      if (!user?.id) return { error: "No user logged in" }

      // Update profile to set role to creator and status to pending
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: "creator",
          creator_status: "pending",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (profileError) {
        return { error: profileError }
      }

      // Insert creator application
      const { error } = await supabase.from("creator_applications").insert([
        {
          user_id: user.id,
          ...data,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      return { error }
    } catch (error) {
      console.error("Error applying for creator:", error)
      return { error }
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUserProfile,
    applyForCreator,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

