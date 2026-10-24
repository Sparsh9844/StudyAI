import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { authStorage } from '@/lib/consent'

// Singleton — one client for the lifetime of the SPA.
let supabaseClient = null

export function createClient() {
  if (supabaseClient) return supabaseClient

  const url = import.meta.env.NEXT_PUBLIC_SUPABASE_URL
  const key = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error(
      '[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
    )
    return null
  }

  supabaseClient = createSupabaseClient(url, key, {
    auth: {
      // Persist the session in localStorage so the user stays logged in
      // across page refreshes and browser restarts.
      persistSession: true,

      // Automatically refresh the JWT before it expires (every ~55 min).
      // Without this the session silently expires and the user gets kicked out.
      autoRefreshToken: true,

      // Detect the session from the URL hash after OAuth redirects.
      detectSessionInUrl: true,

      // Namespace to avoid collisions if multiple Supabase projects ever run
      // on the same domain.
      storageKey: 'studyai-auth',

      // localStorage or sessionStorage depending on cookie consent
      storage: authStorage,
    },
  })

  return supabaseClient
}

