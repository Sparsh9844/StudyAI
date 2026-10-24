// ── Cookie / storage consent ──────────────────────────────────
// The user's choice decides where the Supabase auth session lives:
//   accepted            → localStorage + httpOnly server cookie
//                         (stays signed in across browser restarts)
//   declined / not set  → sessionStorage
//                         (signed out when the browser is closed)
// Storing the choice itself is strictly necessary, so it always persists.
const CONSENT_KEY = 'studyai-cookie-consent'

// Prefix of every key the Supabase client writes (see lib/supabase.js)
const AUTH_KEY_PREFIX = 'studyai-auth'

export function getConsent() {
  try { return localStorage.getItem(CONSENT_KEY) } catch { return null }
}

export const isRemembered = () => getConsent() === 'accepted'

// [where to write, where else an older copy may live]
function stores() {
  return isRemembered() ? [localStorage, sessionStorage] : [sessionStorage, localStorage]
}

export function setConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value)
    // Move any existing auth keys to the storage the new choice uses
    const [target, source] = stores()
    for (const key of Object.keys(source)) {
      if (!key.startsWith(AUTH_KEY_PREFIX)) continue
      target.setItem(key, source.getItem(key))
      source.removeItem(key)
    }
  } catch { /* storage unavailable — nothing to migrate */ }
}

// Storage adapter handed to the Supabase client
export const authStorage = {
  getItem(key) {
    try {
      const [primary, other] = stores()
      return primary.getItem(key) ?? other.getItem(key)
    } catch { return null }
  },
  setItem(key, value) {
    try {
      const [primary, other] = stores()
      primary.setItem(key, value)
      other.removeItem(key)
    } catch { /* ignore */ }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    } catch { /* ignore */ }
  },
}
