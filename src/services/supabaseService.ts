import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is not defined in environment variables.');
  // Em um ambiente de produção, você pode querer lançar um erro ou lidar com isso de forma mais robusta.
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);