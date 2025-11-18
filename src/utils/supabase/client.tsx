import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Store the client in globalThis to ensure true singleton across hot reloads
declare global {
  var supabaseClient: SupabaseClient | undefined;
}

// Create a singleton Supabase client instance
// Using storage key to prevent multiple instances warning
export const supabase = globalThis.supabaseClient ?? createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      storageKey: 'gopay-auth-token',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

if (!globalThis.supabaseClient) {
  globalThis.supabaseClient = supabase;
}