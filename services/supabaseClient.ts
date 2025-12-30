import { createClient } from '@supabase/supabase-js';

// Prefer Vite-provided env vars. Do NOT keep production credentials in source.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const isCloudConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseKey && supabase);
};