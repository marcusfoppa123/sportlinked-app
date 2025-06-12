
import { supabase } from '../client';

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
