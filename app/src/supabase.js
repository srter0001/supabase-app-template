import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'x'; //backup
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'x'; //backup

export const supabase = createClient(supabaseUrl, supabaseKey);
