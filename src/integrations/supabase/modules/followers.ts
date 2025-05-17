
import { supabase } from '../client';
import { toast } from 'sonner';

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
export const incrementFollowers = async (userId: string) => {
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
export const decrementFollowers = async (userId: string) => {
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
export const incrementFollowing = async (userId: string) => {
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
export const decrementFollowing = async (userId: string) => {
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
