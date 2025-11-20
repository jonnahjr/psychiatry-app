import { createClient } from '@supabase/supabase-js';
import { mockDb } from '../services/mockDatabase';

const supabaseUrl = process.env.SUPABASE_URL || 'your_supabase_url_here';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'your_supabase_key_here';

// Check if we have valid Supabase credentials
const hasValidSupabaseUrl = supabaseUrl && supabaseUrl.startsWith('http') && !supabaseUrl.includes('your_supabase_url_here');
const hasValidSupabaseKey = supabaseKey && !supabaseKey.includes('your_supabase_key_here');

let supabase: any;

if (hasValidSupabaseUrl && hasValidSupabaseKey) {
  // Use real Supabase
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Using Supabase database');
} else {
  // Use mock database for demo
  supabase = mockDb;
  console.log('🧪 Using mock database for demo (configure SUPABASE_URL and SUPABASE_ANON_KEY for production)');
}

export { supabase };

// Test connection
export const testConnection = async () => {
  try {
    // If using the mock DB, call its single() path
    if (supabase === mockDb) {
      const { data, error } = await supabase.from('users').select().single();
      if (error) {
        console.error('Supabase (mock) connection error:', error);
        return false;
      }
      console.log('Supabase (mock) connected successfully');
      return true;
    }

    // Real Supabase client - do a lightweight select to confirm connectivity
    // Try a minimal select. The supabase client may return { data, error }
    const res: any = await supabase.from('users').select('id');
    const data = res?.data;
    const error = res?.error;

    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }

    console.log('Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
};