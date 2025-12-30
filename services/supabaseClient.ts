import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tqaywufkzmbnlefgwetk.supabase.co';
const supabaseKey = 'sb_publishable_6KXCe7swFb22nxDsn0PwRA_n42kM4K3';

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export const isCloudConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseKey && supabase);
};