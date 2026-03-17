import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERRO: Variáveis do Supabase não encontradas. Verifique as Secrets no GitHub ou o arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
