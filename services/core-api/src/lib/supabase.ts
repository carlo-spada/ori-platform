import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from the .env file in the same directory
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Role Key are required for core-api.');
}

// Create and export the server-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    // This tells the client to act as a server and not use browser storage.
    persistSession: false,
    autoRefreshToken: false,
  }
});
