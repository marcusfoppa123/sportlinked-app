import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { toast } from "sonner";

export type UserRole = "athlete" | "scout" | "team" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePic?: string;
  profileBgColor?: string;
  bio?: string;
  location?: string;
  sport?: string;
  position?: string;
  experience?: string;
  teamSize?: string;
  foundedYear?: string;
  homeVenue?: string;
  phone?: string;
  website?: string;
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
  division?: string;
  // Stats
  connections?: number;
  posts?: number;
  offers?: number;
  // Athlete stats
  goals?: number;
  assists?: number;
  matches?: number;
  winPercentage?: number;
  cleanSheets?: number;
  // Social
  followers?: number;
  following?: number;
  // Scout fields
  scoutType?: string;
  scoutTeam?: string;
  scoutSport?: string;
  scoutYearsExperience?: number;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: UserRole) => void;
  updateUserProfile: (updatedProfile: Partial<User>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth and fetch initial session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession);
        setSession(newSession);
        setSupabaseUser(newSession?.user ?? null);
        
        // Only fetch profile if we have a user
        if (newSession?.user) {
          // Use setTimeout to prevent potential recursive calls
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setSupabaseUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        fetchUserProfile(initialSession.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        
        // If profile doesn't exist yet, create it with the role from user metadata
        if (error.code === "PGRST116") {
          if (supabaseUser?.user_metadata?.role) {
            const newProfile = {
              id: userId,
              role: supabaseUser.user_metadata.role as UserRole,
              full_name: supabaseUser.user_metadata.full_name || '',
              followers: 0,
              following: 0
            };
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(newProfile);
              
            if (!insertError) {
              // Retry fetching the profile
              fetchUserProfile(userId);
            }
          }
        }
        return;
      }

      if (data) {
        // Ensure followers and following counts are valid numbers and never negative
        const followers = Math.max(0, data.followers || 0);
        const following = Math.max(0, data.following || 0);
        
        // If the database values are negative, update them to zero
        if (data.followers < 0 || data.following < 0) {
          await supabase
            .from('profiles')
            .update({ 
              followers: followers, 
              following: following
            })
            .eq('id', userId);
        }
        
        // Map the database profile to our User interface
        const profileData = data as any;
        setUser({
          id: profileData.id,
          name: profileData.full_name || profileData.username || 'Unknown User',
          email: supabaseUser?.email || '',
          role: (profileData.role as UserRole) || 'athlete',
          profilePic: profileData.avatar_url,
          bio: profileData.bio,
          location: profileData.location,
          sport: profileData.sport,
          position: profileData.position,
          experience: profileData.experience,
          teamSize: profileData.team_size,
          foundedYear: profileData.founded_year,
          homeVenue: profileData.home_venue,
          phone: profileData.phone,
          website: profileData.website,
          birthYear: profileData.birth_year,
          birthMonth: profileData.birth_month,
          birthDay: profileData.birth_day,
          division: profileData.division,
          connections: profileData.connections,
          posts: profileData.posts,
          offers: profileData.offers,
          goals: profileData.goals,
          assists: profileData.assists,
          matches: profileData.matches,
          winPercentage: profileData.win_percentage,
          cleanSheets: profileData.clean_sheets,
          followers: Math.max(0, data.followers || 0),
          following: Math.max(0, data.following || 0),
          scoutType: profileData.scout_type,
          scoutTeam: profileData.scout_team,
          scoutSport: profileData.scout_sport,
          scoutYearsExperience: profileData.scout_years_experience,
        });
      }
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
    }
  };

  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Fetch user profile is handled by onAuthStateChange
      toast.success("Logged in successfully");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    
    try {
      // Directly attempt registration - Supabase will handle duplicate emails
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role
          }
        }
      });
      
      if (error) {
        // Check for specific error types directly from Supabase's response
        if (error.message?.includes('User already registered') || 
            error.message?.includes('email already in use')) {
          toast.error('An account with this email already exists.');
        } else {
          toast.error(error.message || 'Registration failed. Please try again.');
        }
        throw error;
      }
      
      if (!data.user) {
        toast.error('Registration failed. Please try again.');
        throw new Error('No user data returned');
      }

      // Create profile if registration was successful
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          full_name: name,
          role: role,
          followers: 0,
          following: 0
        });
        
      if (profileError) {
        console.error("Error creating profile:", profileError);
        toast.error("Account created but profile setup failed. Please try logging in.");
        throw profileError;
      }
      
      toast.success("Account created successfully! Please check your email for verification.");
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all auth state
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  const setRole = (role: UserRole) => {
    console.log("Setting role in AuthContext:", role);
    setUser(prevUser => {
      if (!prevUser) {
        return { 
          id: '', 
          name: '', 
          email: '', 
          role 
        };
      }
      
      return { ...prevUser, role };
    });
    
    if (user && user.id && supabaseUser) {
      updateUserProfile({ role });
    }
  };

  const updateUserProfile = async (updatedProfile: Partial<User>) => {
    if (!supabaseUser) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    try {
      // Ensure we have a valid user ID
      const userId = supabaseUser.id;
      if (!userId) {
        toast.error("Invalid user ID");
        return;
      }
      
      // Map our User interface fields to database column names
      const dbProfile: any = {};
      
      if (updatedProfile.name) dbProfile.full_name = updatedProfile.name;
      if (updatedProfile.role) dbProfile.role = updatedProfile.role;
      if (updatedProfile.profilePic) dbProfile.avatar_url = updatedProfile.profilePic;
      if (updatedProfile.bio) dbProfile.bio = updatedProfile.bio;
      if (updatedProfile.location) dbProfile.location = updatedProfile.location;
      if (updatedProfile.sport) dbProfile.sport = updatedProfile.sport;
      if (updatedProfile.position) dbProfile.position = updatedProfile.position;
      if (updatedProfile.experience) dbProfile.experience = updatedProfile.experience;
      if (updatedProfile.teamSize) dbProfile.team_size = updatedProfile.teamSize;
      if (updatedProfile.foundedYear) dbProfile.founded_year = updatedProfile.foundedYear;
      if (updatedProfile.homeVenue) dbProfile.home_venue = updatedProfile.homeVenue;
      if (updatedProfile.phone) dbProfile.phone = updatedProfile.phone;
      if (updatedProfile.website) dbProfile.website = updatedProfile.website;
      if (updatedProfile.birthYear) dbProfile.birth_year = updatedProfile.birthYear;
      if (updatedProfile.birthMonth) dbProfile.birth_month = updatedProfile.birthMonth;
      if (updatedProfile.birthDay) dbProfile.birth_day = updatedProfile.birthDay;
      if (updatedProfile.division) dbProfile.division = updatedProfile.division;
      if (updatedProfile.connections !== undefined) dbProfile.connections = updatedProfile.connections;
      if (updatedProfile.posts !== undefined) dbProfile.posts = updatedProfile.posts;
      if (updatedProfile.offers !== undefined) dbProfile.offers = updatedProfile.offers;
      if (updatedProfile.goals !== undefined) dbProfile.goals = updatedProfile.goals;
      if (updatedProfile.assists !== undefined) dbProfile.assists = updatedProfile.assists;
      if (updatedProfile.matches !== undefined) dbProfile.matches = updatedProfile.matches;
      if (updatedProfile.winPercentage !== undefined) dbProfile.win_percentage = updatedProfile.winPercentage;
      if (updatedProfile.cleanSheets !== undefined) dbProfile.clean_sheets = updatedProfile.cleanSheets;
      if (updatedProfile.followers !== undefined) dbProfile.followers = updatedProfile.followers;
      if (updatedProfile.following !== undefined) dbProfile.following = updatedProfile.following;
      if (updatedProfile.scoutType) dbProfile.scout_type = updatedProfile.scoutType;
      if (updatedProfile.scoutTeam) dbProfile.scout_team = updatedProfile.scoutTeam;
      if (updatedProfile.scoutSport) dbProfile.scout_sport = updatedProfile.scoutSport;
      if (updatedProfile.scoutYearsExperience !== undefined) dbProfile.scout_years_experience = updatedProfile.scoutYearsExperience;
      
      // Add updated_at timestamp
      dbProfile.updated_at = new Date().toISOString();
      
      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
        
      if (checkError && checkError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            ...dbProfile,
            id: userId,
            role: updatedProfile.role || user?.role || 'athlete'
          });
          
        if (insertError) throw insertError;
      } else {
        // Profile exists, update it
        const { error: updateError } = await supabase
          .from('profiles')
          .update(dbProfile)
          .eq('id', userId);
          
        if (updateError) throw updateError;
      }
      
      // Update the local user state
      setUser(prev => prev ? { ...prev, ...updatedProfile } : null);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // Improve the refresh function for user profile
  const refreshUserProfile = async () => {
    if (supabaseUser?.id) {
      await fetchUserProfile(supabaseUser.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        isAuthenticated: !!session && !!supabaseUser,
        isLoading,
        login,
        register,
        logout,
        setRole,
        updateUserProfile,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
