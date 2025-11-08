import { createClient, SupabaseClient } from '@supabase/supabase-js'

// This variable will hold the single instance of the Supabase client.
let supabase: SupabaseClient | null
let hasWarnedAboutEnv = false

/**
 * Safely creates and returns a singleton instance of the Supabase client.
 * This function ensures the client is only ever created in a browser environment.
 */
export function getSupabaseClient(): SupabaseClient | null {
  // If the client hasn't been created yet...
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Ensure environment variables are set.
    if (!supabaseUrl || !supabaseAnonKey) {
      if (!hasWarnedAboutEnv) {
        console.warn(
          'Supabase client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable authentication.',
        )
        hasWarnedAboutEnv = true
      }
      return null
    }

    // Create the client. This part of the code will only ever run in the browser.
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabase
}
