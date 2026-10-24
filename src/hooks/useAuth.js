import { createContext, useContext, useEffect, useState } from 'react'
import { loadSupabase } from '@/lib/supabase-lazy'
import { authStorage, isRemembered } from '@/lib/consent'
import {
  hasServerSession, syncServerSession, clearServerSession, restoreServerSession,
} from '@/services/session'

const AuthContext = createContext({ user: null, loading: true })

// Must match `storageKey` in lib/supabase.js
const STORAGE_KEY = 'studyai-auth'

// ── Read the persisted session without loading the Supabase SDK ──
// Lets the first render know who the user is, so protected pages paint
// immediately instead of waiting for the SDK chunk to download.
function readCachedUser() {
  try {
    const raw = authStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    // Ignore tokens that have already expired; the SDK will refresh them.
    if (!session?.user || !session.expires_at || session.expires_at * 1000 < Date.now()) return null
    return session.user
  } catch {
    return null
  }
}

// An expired session may still be refreshable, an auth redirect carries
// tokens in the URL hash, and the server may hold a remembered session —
// in all of these cases wait for the SDK to resolve them.
function safeHasStoredSession() {
  if (window.location.hash.includes('access_token')) return true
  if (isRemembered() && hasServerSession()) return true
  return !!authStorage.getItem(STORAGE_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(readCachedUser)
  // Only block rendering when we have no cached answer yet
  const [loading, setLoading] = useState(() => user === null && !!safeHasStoredSession())

  useEffect(() => {
    let subscription
    let cancelled = false

    loadSupabase().then(supabase => {
      if (cancelled) return
      if (!supabase) {
        setLoading(false)
        return
      }

      // ── 1. Read the session from browser storage (no network call) ──
      // If there is none but the user opted in to being remembered,
      // ask the server to restore it from its httpOnly cookie.
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (!session && isRemembered() && hasServerSession()) {
          const tokens = await restoreServerSession()
          if (tokens) {
            const { data: restored } = await supabase.auth.setSession(tokens)
            session = restored?.session ?? null
          }
        }
        if (cancelled) return
        setUser(session?.user ?? null)
        setLoading(false)
      }).catch(() => {
        if (cancelled) return
        setUser(null)
        setLoading(false)
      })

      // ── 2. Keep state in sync with any auth event ─────────────────
      // SIGNED_IN  → user logged in or token refreshed
      // SIGNED_OUT → user logged out or token expired
      // TOKEN_REFRESHED → silent background refresh succeeded
      // Supabase rotates refresh tokens, so the server cookie is updated
      // on every sign-in/refresh to keep its copy valid.
      const { data } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ?? null)

          if (event === 'SIGNED_OUT') {
            clearServerSession()
          } else if (session && isRemembered() && (
            event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' ||
            (event === 'INITIAL_SESSION' && !hasServerSession())
          )) {
            syncServerSession(session)
          }
        }
      )
      subscription = data?.subscription
    }).catch(() => {
      if (!cancelled) setLoading(false)
    })

    return () => {
      cancelled = true
      subscription?.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
