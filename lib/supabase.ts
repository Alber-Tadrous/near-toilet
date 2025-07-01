import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = 'https://hxrybzrfjrotgzlarxzf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4cnlienJmanJvdGd6bGFyeHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NjgwNDMsImV4cCI6MjA2NjU0NDA0M30.Ni_qP5hpz89QUnZ9wDlePocL2PPIC2e0vGcdfUl33Dg';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);