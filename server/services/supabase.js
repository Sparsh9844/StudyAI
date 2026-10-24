const { createClient } = require('@supabase/supabase-js')

// Anon-key client for auth operations (verifying and refreshing user
// sessions). A fresh client is created per request so one user's session
// can never leak into another request. Database access stays in the
// browser, where Supabase Row Level Security applies.
function createAuthClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
  )
}

module.exports = { createAuthClient }
