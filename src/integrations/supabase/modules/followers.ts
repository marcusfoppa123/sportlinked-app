
import { supabase } from '../client';

// Follow a user
export const followUser = async (followerId: string, followingId: string) => {
  try {
    // Insert the follow relationship
    const { data: followData, error: followError } = await supabase
      .from('followers')
      .insert({
        follower_id: followerId,
        following_id: followingId
      });
      
    if (followError) throw followError;
    
    // Update the followers count for the followed user
    const { data: followedUserData, error: followedCountError } = await supabase
      .from('profiles')
      .select('followers')
      .eq('id', followingId)
      .single();
      
    if (followedCountError) throw followedCountError;
    
    const newFollowersCount = (followedUserData.followers || 0) + 1;
    const { error: updateFollowedError } = await supabase
      .from('profiles')
      .update({ followers: newFollowersCount })
      .eq('id', followingId);
      
    if (updateFollowedError) throw updateFollowedError;
    
    // Update the following count for the follower user
    const { data: followerUserData, error: followerCountError } = await supabase
      .from('profiles')
      .select('following')
      .eq('id', followerId)
      .single();
      
    if (followerCountError) throw followerCountError;
    
    const newFollowingCount = (followerUserData.following || 0) + 1;
    const { error: updateFollowerError } = await supabase
      .from('profiles')
      .update({ following: newFollowingCount })
      .eq('id', followerId);
      
    if (updateFollowerError) throw updateFollowerError;
    
    return { data: followData, error: null };
  } catch (error) {
    console.error("Error following user:", error);
    return { data: null, error };
  }
};

// Unfollow a user
export const unfollowUser = async (followerId: string, followingId: string) => {
  try {
    // Delete the follow relationship
    const { data: unfollowData, error: unfollowError } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);
      
    if (unfollowError) throw unfollowError;
    
    // Update the followers count for the unfollowed user
    const { data: followedUserData, error: followedCountError } = await supabase
      .from('profiles')
      .select('followers')
      .eq('id', followingId)
      .single();
      
    if (followedCountError) throw followedCountError;
    
    const newFollowersCount = Math.max(0, (followedUserData.followers || 0) - 1);
    const { error: updateFollowedError } = await supabase
      .from('profiles')
      .update({ followers: newFollowersCount })
      .eq('id', followingId);
      
    if (updateFollowedError) throw updateFollowedError;
    
    // Update the following count for the follower user
    const { data: followerUserData, error: followerCountError } = await supabase
      .from('profiles')
      .select('following')
      .eq('id', followerId)
      .single();
      
    if (followerCountError) throw followerCountError;
    
    const newFollowingCount = Math.max(0, (followerUserData.following || 0) - 1);
    const { error: updateFollowerError } = await supabase
      .from('profiles')
      .update({ following: newFollowingCount })
      .eq('id', followerId);
      
    if (updateFollowerError) throw updateFollowerError;
    
    return { data: unfollowData, error: null };
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return { data: null, error };
  }
};

// Check if a user is following another user
export const checkIfFollowing = async (followerId: string, followingId: string) => {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId);
      
    if (error) throw error;
    
    // Return true if there's a record, false if not
    return { data: data && data.length > 0, error: null };
  } catch (error) {
    console.error("Error checking if following:", error);
    return { data: false, error };
  }
};

// Get all followers for a user
export const getFollowers = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        follower_id,
        profiles:follower_id (
          id,
          full_name,
          avatar_url,
          role
        )
      `)
      .eq('following_id', userId);
      
    if (error) throw error;
    
    return { data: data?.map(item => item.profiles) || [], error: null };
  } catch (error) {
    console.error("Error fetching followers:", error);
    return { data: [], error };
  }
};

// Get all users that a user is following
export const getFollowing = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        following_id,
        profiles:following_id (
          id,
          full_name,
          avatar_url,
          role
        )
      `)
      .eq('follower_id', userId);
      
    if (error) throw error;
    
    return { data: data?.map(item => item.profiles) || [], error: null };
  } catch (error) {
    console.error("Error fetching following:", error);
    return { data: [], error };
  }
};
