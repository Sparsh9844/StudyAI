import { loadSupabase } from '@/lib/supabase-lazy'
import { clearServerSession } from '@/services/session'

export async function signUp(email, password, name) {
  const supabase = await loadSupabase()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  })
  return { data, error }
}

export async function signIn(email, password) {
  const supabase = await loadSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  const supabase = await loadSupabase()
  const [{ error }] = await Promise.all([
    supabase.auth.signOut(),
    clearServerSession(),
  ])
  return { error }
}

// Emails a link that opens /auth/reset-password with a recovery session.
// The URL must be listed under Supabase → Authentication → URL Configuration → Redirect URLs.
export async function requestPasswordReset(email) {
  const supabase = await loadSupabase()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  return { error }
}

export async function updatePassword(password) {
  const supabase = await loadSupabase()
  const { data, error } = await supabase.auth.updateUser({ password })
  return { data, error }
}

export async function getCurrentUser() {
  const supabase = await loadSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const supabase = await loadSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
