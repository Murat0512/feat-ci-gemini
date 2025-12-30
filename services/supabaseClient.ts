
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.45.0';

// Finalized project URL provided by the user
const supabaseUrl = 'https://tqaywufkzmbnlefgwetk.supabase.co';

// Finalized Anon Key provided by the user
const supabaseKey = 'sb_publishable_6KXCe7swFb22nxDsn0PwRA_n42kM4K3';

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

/**
 * Helper to check if cloud features are currently available.
 * The system automatically switches from 'Sovereign' to 'Cloud' mode based on this.
 */
export const isCloudConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseKey && supabase);
};
