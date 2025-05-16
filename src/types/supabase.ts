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
      },
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
          birth_year: number | null
          birth_month: number | null
          birth_day: number | null
          division: string | null
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
          birth_year?: number | null
          birth_month?: number | null
          birth_day?: number | null
          division?: string | null
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
          birth_year?: number | null
          birth_month?: number | null
          birth_day?: number | null
          division?: string | null
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
      },
      posts: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          shares: number | null
          sport: string | null
          hashtags: string[] | null
          content: string | null
          image_url: string | null
          video_url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          shares?: number | null
          sport?: string | null
          hashtags?: string[] | null
          content?: string | null
          image_url?: string | null
          video_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          shares?: number | null
          sport?: string | null
          hashtags?: string[] | null
          content?: string | null
          image_url?: string | null
          video_url?: string | null
        }
        Relationships: []
      },
      likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
        Relationships: []
      },
      comments: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
          updated_at: string
          content: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
          updated_at?: string
          content: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
          updated_at?: string
          content?: string
        }
        Relationships: []
      },
      bookmarks: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
        Relationships: []
      },
      message_requests: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          created_at: string
          updated_at: string
          status: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          created_at?: string
          updated_at?: string
          status?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          created_at?: string
          updated_at?: string
          status?: string
        }
        Relationships: []
      },
      sportslinked: {
        Row: {
          id: number
          created_at: string
          content: string | null
        }
        Insert: {
          id: number
          created_at?: string
          content?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          content?: string | null
        }
        Relationships: []
      },
      conversations: {
        Row: {
          id: string;
          user1_id: string;
          user2_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user1_id: string;
          user2_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user1_id?: string;
          user2_id?: string;
          created_at?: string;
        };
        Relationships: [];
      },
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          text?: string;
          created_at?: string;
        };
        Relationships: [];
      },
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
