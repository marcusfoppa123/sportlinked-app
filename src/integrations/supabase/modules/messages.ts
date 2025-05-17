
import { supabase } from '../client';

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
