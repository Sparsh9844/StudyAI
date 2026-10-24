// Dynamic entry to the Supabase client. Importing this file costs
// nothing up front; the SDK chunk is fetched on first call and cached.
let clientPromise = null

export function loadSupabase() {
  if (!clientPromise) {
    clientPromise = import('@/lib/supabase').then(m => m.createClient())
  }
  return clientPromise
}
