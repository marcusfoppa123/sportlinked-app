
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../client';

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
