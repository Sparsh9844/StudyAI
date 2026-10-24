import { loadSupabase } from '@/lib/supabase-lazy'

// All /api/* requests are proxied to Express by Vite in development.
// In production the SPA and API share one domain, so calls are
// same-origin in both cases — no absolute URL needed.
export const API_BASE = ''

// JSON headers plus the signed-in user's access token, which the
// server requires on protected routes (e.g. /api/ai/*).
export async function authHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  const supabase = await loadSupabase()
  const { data } = await supabase?.auth.getSession() ?? {}
  if (data?.session) headers.Authorization = `Bearer ${data.session.access_token}`
  return headers
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...(await authHeaders()), ...options.headers },
  })
  return res.json()
}
