// ── Server-side "remember me" session ─────────────────────────
// The Express server keeps the Supabase refresh token in an httpOnly
// cookie (only when the user accepted cookies), so a returning user can
// be signed back in even if the browser's local session is gone.

// Readable companion cookie set by the server — tells us a saved
// session exists without exposing the token to JavaScript.
const FLAG_COOKIE = 'studyai-remembered=1'

export const hasServerSession = () => document.cookie.split('; ').includes(FLAG_COOKIE)

export async function syncServerSession(session) {
  try {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token:  session.access_token,
        refresh_token: session.refresh_token,
      }),
    })
  } catch { /* offline — the next token refresh will retry */ }
}

export async function clearServerSession() {
  try {
    await fetch('/api/auth/session', { method: 'DELETE' })
  } catch { /* ignore */ }
}

// Returns { access_token, refresh_token } or null
export async function restoreServerSession() {
  try {
    const res = await fetch('/api/auth/restore', { method: 'POST' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
