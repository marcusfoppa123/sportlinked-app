
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '@/types/supabase';

// Initialize the Supabase client
const supabaseUrl = 'https://tanfwjpaukclrgiugafk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhbmZ3anBhdWtjbHJnaXVnYWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3Mjg1MzcsImV4cCI6MjA2MDMwNDUzN30.xxlUor0cSLAWiYee1B54P57SVUT6GFoGiRO7tHHgmsk';
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Function to follow a user
export const followUser = async (followerId: string, followingId: string) => {
  try {
    const { data, error } = await supabase
      .from('followers')
      .insert([
        { follower_id: followerId, following_id: followingId }
      ]);

    if (error) {
      console.error("Error following user:", error);
      return { success: false, error };
    }

    // Optimistically update the follower count for the followed user
    await incrementFollowers(followingId);

    // Optimistically update the following count for the current user
    await incrementFollowing(followerId);

    return { success: true, data };
  } catch (error) {
    console.error("Error following user:", error);
    return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

// Function to unfollow a user
export const unfollowUser = async (followerId: string, followingId: string) => {
  try {
    const { data, error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) {
      console.error("Error unfollowing user:", error);
      return { success: false, error };
    }

    // Optimistically update the follower count for the followed user
    await decrementFollowers(followingId);

    // Optimistically update the following count for the current user
    await decrementFollowing(followerId);

    return { success: true, data };
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

// Function to check if a user is following another user
export const checkIfUserIsFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) {
      console.error("Error checking follow status:", error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
};

// Helper function to increment followers count
const incrementFollowers = async (userId: string) => {
  try {
    // First, get the current followers count
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('followers')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching profile for follower increment:", fetchError);
      return;
    }
    
    // Calculate the new count and update
    const newCount = (profile?.followers || 0) + 1;
    
    const { error } = await supabase
      .from('profiles')
      .update({ followers: newCount })
      .eq('id', userId);
      
    if (error) {
      console.error("Error incrementing followers:", error);
    }
  } catch (error) {
    console.error("Error incrementing followers:", error);
  }
};

// Helper function to decrement followers count
const decrementFollowers = async (userId: string) => {
  try {
    // First, get the current followers count
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('followers')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching profile for follower decrement:", fetchError);
      return;
    }
    
    // Calculate the new count and update (ensure it doesn't go below 0)
    const newCount = Math.max((profile?.followers || 0) - 1, 0);
    
    const { error } = await supabase
      .from('profiles')
      .update({ followers: newCount })
      .eq('id', userId);
      
    if (error) {
      console.error("Error decrementing followers:", error);
    }
  } catch (error) {
    console.error("Error decrementing followers:", error);
  }
};

// Helper function to increment following count
const incrementFollowing = async (userId: string) => {
  try {
    // First, get the current following count
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('following')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching profile for following increment:", fetchError);
      return;
    }
    
    // Calculate the new count and update
    const newCount = (profile?.following || 0) + 1;
    
    const { error } = await supabase
      .from('profiles')
      .update({ following: newCount })
      .eq('id', userId);
      
    if (error) {
      console.error("Error incrementing following:", error);
    }
  } catch (error) {
    console.error("Error incrementing following:", error);
  }
};

// Helper function to decrement following count
const decrementFollowing = async (userId: string) => {
  try {
    // First, get the current following count
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('following')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching profile for following decrement:", fetchError);
      return;
    }
    
    // Calculate the new count and update (ensure it doesn't go below 0)
    const newCount = Math.max((profile?.following || 0) - 1, 0);
    
    const { error } = await supabase
      .from('profiles')
      .update({ following: newCount })
      .eq('id', userId);
      
    if (error) {
      console.error("Error decrementing following:", error);
    }
  } catch (error) {
    console.error("Error decrementing following:", error);
  }
};

// ------------------------
// Messages & Conversations
// ------------------------
export const checkMutualFollow = async (user1Id: string, user2Id: string): Promise<boolean> => {
  // Check if both users follow each other (mutual follow)
  const { data: follows1, error: error1 } = await supabase
    .from('followers')
    .select('*')
    .eq('follower_id', user1Id)
    .eq('following_id', user2Id);

  const { data: follows2, error: error2 } = await supabase
    .from('followers')
    .select('*')
    .eq('follower_id', user2Id)
    .eq('following_id', user1Id);

  if (error1 || error2) {
    console.error("Error checking mutual follow:", error1 || error2);
    return false;
  }

  return follows1?.length > 0 && follows2?.length > 0;
};

export const createConversationIfNotExists = async (user1Id: string, user2Id: string): Promise<{id: string} | null> => {
  try {
    // Check if a conversation already exists between these users
    const { data: existingConvo, error: searchError } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
      .maybeSingle();
    
    if (searchError) throw searchError;
    
    // If conversation exists, return it
    if (existingConvo) return existingConvo;
    
    // Create a new conversation
    const { data: newConvo, error: createError } = await supabase
      .from('conversations')
      .insert({
        user1_id: user1Id,
        user2_id: user2Id
      })
      .select('*')
      .single();
    
    if (createError) throw createError;
    
    return newConvo;
  } catch (error) {
    console.error("Error creating conversation:", error);
    return null;
  }
};

export const getUserConversations = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return { data: null, error };
  }
};

export const getConversationMessages = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { data: null, error };
  }
};

export const sendMessage = async (conversationId: string, senderId: string, text: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        text: text
      });
      
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error("Error sending message:", error);
    return { data: null, error };
  }
};

export const searchProfilesAndHashtags = async (query: string) => {
  if (!query.trim()) return { profiles: [], hashtags: [] };
  
  try {
    // Search profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
      .limit(5);
    
    if (profileError) throw profileError;
    
    // Search hashtags from posts
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('hashtags')
      .filter('hashtags', 'cs', `{${query}}`)
      .limit(10);
    
    if (postsError) throw postsError;
    
    // Extract unique hashtags
    const hashtags = Array.from(
      new Set(
        postsData
          ?.flatMap(post => post.hashtags)
          ?.filter(tag => tag?.toLowerCase().includes(query.toLowerCase())) || []
      )
    ) as string[];
    
    return { profiles: profileData || [], hashtags };
  } catch (error) {
    console.error("Search error:", error);
    return { profiles: [], hashtags: [] };
  }
};

export const getPostsByHashtag = async (hashtag: string) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .filter('hashtags', 'cs', `{${hashtag}}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching hashtag posts:", error);
    return [];
  }
};
