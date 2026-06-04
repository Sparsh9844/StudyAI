import { createBrowserClient } from '@supabase/ssr'

let supabaseClient = null

export function createClient() {
  if (supabaseClient) return supabaseClient
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !url.startsWith('http')) {
    if (typeof window === 'undefined') return null
    throw new Error('Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.')
  }
  
  supabaseClient = createBrowserClient(url, key)
  return supabaseClient
}
