
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";
import { Database } from '@/types/supabase';

// Initialize Supabase client
const supabaseUrl = 'https://tanfwjpaukclrgiugafk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhbmZ3anBhdWtjbHJnaXVnYWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3Mjg1MzcsImV4cCI6MjA2MDMwNDUzN30.xxlUor0cSLAWiYee1B54P57SVUT6GFoGiRO7tHHgmsk';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Function to check if a user is following another user
export const checkIfUserIsFollowing = async (userId: string, targetUserId: string): Promise<boolean> => {
  if (!userId || !targetUserId) return false;
  
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', userId)
      .eq('following_id', targetUserId)
      .maybeSingle();
      
    if (error) throw error;
    return !!data;
  } catch (err) {
    console.error('Error checking follow status:', err);
    return false;
  }
};

// Function to follow a user
export const followUser = async (currentUserId: string, targetUserId: string) => {
  if (!currentUserId || !targetUserId) {
    return { success: false, error: { message: "Invalid user IDs" } };
  }
  
  try {
    const { data, error } = await supabase
      .from('followers')
      .insert({
        follower_id: currentUserId,
        following_id: targetUserId
      });
      
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error following user:', err);
    return { success: false, error: err };
  }
};

// Function to unfollow a user
export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
  if (!currentUserId || !targetUserId) {
    return { success: false, error: { message: "Invalid user IDs" } };
  }
  
  try {
    const { data, error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', currentUserId)
      .eq('following_id', targetUserId);
      
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error unfollowing user:', err);
    return { success: false, error: err };
  }
};

// Function to check if two users follow each other (mutual follow)
export const checkMutualFollow = async (user1Id: string, user2Id: string): Promise<boolean> => {
  if (!user1Id || !user2Id) return false;
  
  try {
    // Check if user1 follows user2
    const follows1 = await checkIfUserIsFollowing(user1Id, user2Id);
    
    // Check if user2 follows user1
    const follows2 = await checkIfUserIsFollowing(user2Id, user1Id);
    
    return follows1 && follows2;
  } catch (err) {
    console.error('Error checking mutual follow:', err);
    return false;
  }
};

// Function to create a conversation if one doesn't already exist
export const createConversationIfNotExists = async (user1Id: string, user2Id: string) => {
  if (!user1Id || !user2Id) {
    return { success: false, error: { message: "Invalid user IDs" } };
  }
  
  try {
    // Check if conversation already exists
    const { data: existingConversation, error: existingError } = await supabase
      .from('conversations')
      .select('id')
      .or(`user1_id.eq.${user1Id},user2_id.eq.${user1Id}`)
      .or(`user1_id.eq.${user2Id},user2_id.eq.${user2Id}`)
      .maybeSingle();
      
    if (existingError) throw existingError;
    
    // If conversation exists, return it
    if (existingConversation) {
      return { success: true, data: existingConversation, isNew: false };
    }
    
    // Create new conversation
    const { data: newConversation, error: createError } = await supabase
      .from('conversations')
      .insert({
        user1_id: user1Id,
        user2_id: user2Id
      })
      .select('id')
      .single();
      
    if (createError) throw createError;
    
    return { success: true, data: newConversation, isNew: true };
  } catch (err) {
    console.error('Error creating conversation:', err);
    return { success: false, error: err };
  }
};

// Get a user's conversations
export const getUserConversations = async (userId: string) => {
  if (!userId) return { data: null, error: "User ID is required" };
  
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id,
        user1_id,
        user2_id,
        created_at,
        profiles!conversations_user1_id_fkey (id, full_name, username, avatar_url, role),
        profiles!conversations_user2_id_fkey (id, full_name, username, avatar_url, role)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Format the conversations data
    const formattedData = data.map((conversation) => {
      const otherUser = conversation.user1_id === userId
        ? conversation.profiles.find((p: any) => p.id === conversation.user2_id)
        : conversation.profiles.find((p: any) => p.id === conversation.user1_id);
        
      return {
        id: conversation.id,
        otherUser: otherUser || { id: "unknown", full_name: "Unknown User" },
        created_at: conversation.created_at
      };
    });
    
    return { data: formattedData, error: null };
  } catch (err) {
    console.error('Error getting conversations:', err);
    return { data: null, error: err };
  }
};

// Get messages for a conversation
export const getConversationMessages = async (conversationId: string) => {
  if (!conversationId) return { data: null, error: "Conversation ID is required" };
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        conversation_id,
        sender_id,
        text,
        created_at,
        profiles (id, full_name, username, avatar_url, role)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    return { data, error: null };
  } catch (err) {
    console.error('Error getting messages:', err);
    return { data: null, error: err };
  }
};

// Send a message
export const sendMessage = async (conversationId: string, senderId: string, text: string) => {
  if (!conversationId || !senderId || !text.trim()) {
    return { success: false, error: "Missing required information" };
  }
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        text: text.trim()
      })
      .select('*')
      .single();
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (err) {
    console.error('Error sending message:', err);
    return { success: false, error: err };
  }
};

// Function to search profiles and hashtags
export const searchProfilesAndHashtags = async (query: string) => {
  const searchTerm = query.toLowerCase();
  console.log('Performing search for:', searchTerm);
  
  try {
    // Search profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url, role')
      .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
      .limit(5);

    if (profilesError) {
      console.error('Profile search error:', profilesError);
      return { profiles: [], hashtags: [] };
    }
    
    console.log('Found profiles:', profiles?.length || 0);

    // Search posts for hashtags in the hashtags array column
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('hashtags')
      .not('hashtags', 'is', null)  // Only include posts with non-null hashtags
      .limit(50);  // Get more posts to find more unique hashtags

    if (postsError) {
      console.error('Hashtag search error:', postsError);
      return { profiles: profiles || [], hashtags: [] };
    }
    
    console.log('Searching through posts for hashtags:', posts?.length || 0);

    // Extract and filter unique hashtags from all posts
    const allHashtags = posts?.reduce((acc: string[], post) => {
      if (Array.isArray(post.hashtags)) {
        return [...acc, ...post.hashtags];
      }
      return acc;
    }, []) || [];
    
    // Filter hashtags that match the search term and make them unique
    const hashtags = Array.from(new Set(
      allHashtags.filter(tag => 
        tag && typeof tag === 'string' && tag.toLowerCase().includes(searchTerm)
      )
    )) as string[];
    
    console.log('Found matching hashtags:', hashtags.length);
    console.log('Hashtags:', hashtags);

    return {
      profiles: profiles || [],
      hashtags: hashtags
    };
  } catch (err) {
    console.error('Exception in searchProfilesAndHashtags:', err);
    return { profiles: [], hashtags: [] };
  }
};

// Function to get posts by hashtag
export const getPostsByHashtag = async (hashtag: string) => {
  if (!hashtag) return [];
  
  const cleanHashtag = hashtag.replace(/^#/, '').toLowerCase();
  console.log(`Getting posts with hashtag: ${cleanHashtag}`);
  
  try {
    // Get posts with the hashtag
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .containedBy('hashtags', [cleanHashtag])
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching posts by hashtag:', error);
      return [];
    }
    
    console.log(`Found ${posts?.length || 0} posts with hashtag #${cleanHashtag}`);
    
    if (!posts || posts.length === 0) return [];
    
    // Get user info for each post
    const postsWithUserInfo = await Promise.all(
      posts.map(async (post) => {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', post.user_id)
          .maybeSingle();
          
        // Get like count
        const { count: likesCount } = await supabase
          .from('likes')
          .select('id', { count: 'exact' })
          .eq('post_id', post.id);
          
        // Get comment count
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('id', { count: 'exact' })
          .eq('post_id', post.id);
          
        return {
          ...post,
          user: {
            id: profile?.id || post.user_id,
            name: profile?.full_name || profile?.username || 'Unknown User',
            role: profile?.role || 'athlete',
            profilePic: profile?.avatar_url
          },
          content: {
            text: post.content,
            image: post.image_url,
            video: post.video_url
          },
          stats: {
            likes: likesCount || 0,
            comments: commentsCount || 0,
            shares: post.shares || 0
          }
        };
      })
    );
    
    return postsWithUserInfo;
  } catch (err) {
    console.error('Error in getPostsByHashtag:', err);
    return [];
  }
};
