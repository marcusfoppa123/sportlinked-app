
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Initialize the Supabase client
const supabaseUrl = 'https://tanfwjpaukclrgiugafk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhbmZ3anBhdWtjbHJnaXVnYWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3Mjg1MzcsImV4cCI6MjA2MDMwNDUzN30.xxlUor0cSLAWiYee1B54P57SVUT6GFoGiRO7tHHgmsk';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export specific functions from modules
export * from './modules/followers';

// Export renamed functions from conversations to avoid conflicts
export { 
  createConversationIfNotExists,
  getUserConversations,
  // Renamed to avoid conflict with followers.ts
  checkMutualFollow as checkMutualFollowForMessages 
} from './modules/conversations';

export * from './modules/messages';
export * from './modules/search';
export * from './modules/athleteFilters';
