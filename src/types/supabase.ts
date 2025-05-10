export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      followers: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          username: string | null
          avatar_url: string | null
          role: string | null
          bio: string | null
          location: string | null
          sport: string | null
          position: string | null
          experience: string | null
          team_size: string | null
          founded_year: string | null
          home_venue: string | null
          phone: string | null
          website: string | null
          connections: number | null
          posts: number | null
          offers: number | null
          ppg: number | null
          apg: number | null
          rpg: number | null
          games: number | null
          win_percentage: number | null
          followers: number | null
          following: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          role?: string | null
          bio?: string | null
          location?: string | null
          sport?: string | null
          position?: string | null
          experience?: string | null
          team_size?: string | null
          founded_year?: string | null
          home_venue?: string | null
          phone?: string | null
          website?: string | null
          connections?: number | null
          posts?: number | null
          offers?: number | null
          ppg?: number | null
          apg?: number | null
          rpg?: number | null
          games?: number | null
          win_percentage?: number | null
          followers?: number | null
          following?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          role?: string | null
          bio?: string | null
          location?: string | null
          sport?: string | null
          position?: string | null
          experience?: string | null
          team_size?: string | null
          founded_year?: string | null
          home_venue?: string | null
          phone?: string | null
          website?: string | null
          connections?: number | null
          posts?: number | null
          offers?: number | null
          ppg?: number | null
          apg?: number | null
          rpg?: number | null
          games?: number | null
          win_percentage?: number | null
          followers?: number | null
          following?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
  }
} 