import { loadSupabase } from '@/lib/supabase-lazy'
import { clearServerSession } from '@/services/session'

// Where the confirmation email link lands. With the URL allowed under
// Supabase → Authentication → URL Configuration → Redirect URLs, the link
// signs the user in and opens the dashboard directly; otherwise Supabase
// falls back to the Site URL.
const confirmRedirect = () => `${window.location.origin}/dashboard`

export async function signUp(email, password, name) {
  const supabase = await loadSupabase()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name }, emailRedirectTo: confirmRedirect() },
  })

  // With email confirmation on, Supabase returns no session and leaves any
  // previously signed-in account active — the app would keep showing that
  // person. End it here (this device only) so the new account starts clean.
  if (!error && !data?.session) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) await signOut({ scope: 'local' })
  }
  return { data, error }
}

export async function resendConfirmation(email) {
  const supabase = await loadSupabase()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: confirmRedirect() },
  })
  return { error }
}

export async function signIn(email, password) {
  const supabase = await loadSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

// scope 'global' (default) ends every session of this user;
// 'local' only signs out this browser.
export async function signOut({ scope = 'global' } = {}) {
  const supabase = await loadSupabase()
  const [{ error }] = await Promise.all([
    supabase.auth.signOut({ scope }),
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
