export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          role: string | null
          creator_status: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          role?: string | null
          creator_status?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          role?: string | null
          creator_status?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          category: string
          creator_id: string
          tags: string[]
          thumbnail: string | null
          file_url: string | null
          file_name: string | null
          file_type: string | null
          file_size: number | null
          status: string
          created_at: string
          updated_at: string
          downloads: number
          views: number
          featured: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          category: string
          creator_id: string
          tags?: string[]
          thumbnail?: string | null
          file_url?: string | null
          file_name?: string | null
          file_type?: string | null
          file_size?: number | null
          status?: string
          created_at?: string
          updated_at?: string
          downloads?: number
          views?: number
          featured?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          category?: string
          creator_id?: string
          tags?: string[]
          thumbnail?: string | null
          file_url?: string | null
          file_name?: string | null
          file_type?: string | null
          file_size?: number | null
          status?: string
          created_at?: string
          updated_at?: string
          downloads?: number
          views?: number
          featured?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "resources_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_applications: {
        Row: {
          id: string
          user_id: string
          portfolio_url: string | null
          experience: string | null
          application_text: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          portfolio_url?: string | null
          experience?: string | null
          application_text?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          portfolio_url?: string | null
          experience?: string | null
          application_text?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_applications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          resource_id: string
          amount: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resource_id: string
          amount: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resource_id?: string
          amount?: number
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_resource_id_fkey"
            columns: ["resource_id"]
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          id: string
          event_type: string
          user_id: string | null
          resource_id: string | null
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          user_id?: string | null
          resource_id?: string | null
          data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          user_id?: string | null
          resource_id?: string | null
          data?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_resource_id_fkey"
            columns: ["resource_id"]
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

