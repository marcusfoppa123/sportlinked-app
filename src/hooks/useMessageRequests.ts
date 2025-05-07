import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface MessageRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export function useMessageRequests() {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<MessageRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<MessageRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMessageRequests();
    }
  }, [user]);

  const fetchMessageRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch pending requests (where user is the receiver)
      const { data: pending, error: pendingError } = await supabase
        .from('message_requests')
        .select('*')
        .eq('receiver_id', user?.id)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      // Fetch sent requests (where user is the sender)
      const { data: sent, error: sentError } = await supabase
        .from('message_requests')
        .select('*')
        .eq('sender_id', user?.id)
        .eq('status', 'pending');

      if (sentError) throw sentError;

      setPendingRequests(pending || []);
      setSentRequests(sent || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const sendMessageRequest = async (receiverId: string) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('message_requests')
        .insert([
          {
            sender_id: user?.id,
            receiver_id: receiverId,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setSentRequests(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message request');
      throw err;
    }
  };

  const respondToRequest = async (requestId: string, accept: boolean) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('message_requests')
        .update({ status: accept ? 'accepted' : 'rejected' })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;

      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to respond to request');
      throw err;
    }
  };

  return {
    pendingRequests,
    sentRequests,
    loading,
    error,
    sendMessageRequest,
    respondToRequest,
    refreshRequests: fetchMessageRequests
  };
} 