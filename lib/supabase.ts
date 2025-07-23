import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { Database } from '@/types/database';

const supabaseUrl = 'https://hxrybzrfjrotgzlarxzf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4cnlienJmanJvdGd6bGFyeHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NjgwNDMsImV4cCI6MjA2NjU0NDA0M30.Ni_qP5hpz89QUnZ9wDlePocL2PPIC2e0vGcdfUl33Dg';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Reduce auth refresh frequency to prevent race conditions
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
  global: {
    headers: {
      'X-Client-Info': `restroom-finder-${Platform.OS}`,
    },
  },
  // Add retry logic for network requests
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});