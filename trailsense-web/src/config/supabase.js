import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Pengecekan perlengkapan wajib sebelum merender
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Kunci API Supabase belum dimasukkan ke dalam .env!');
  console.log("URL SUPABASE:", import.meta.env.VITE_SUPABASE_URL);
  console.log("ANON KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);