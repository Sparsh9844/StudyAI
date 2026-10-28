// ── Per-account progress storage ──────────────────────────────
// Same getItem/setItem shape as localStorage, but every key is scoped to
// the signed-in user, so different accounts on one browser never see each
// other's progress. AuthProvider keeps the current user id in sync.
let currentUserId = null

export function setStorageUser(id) {
  currentUserId = id ?? null
}

// Keys that used to be stored globally (before accounts were separated)
const LEGACY_KEYS = new Set([
  'dsa-sheet-solved',
  'core-cs-done',
  'aptitude-kit-state',
  'studyai-flashcards',
  'studyai-interview-tracker',
])

const scoped = key => `studyai:${currentUserId}:${key}`

export const userStorage = {
  getItem(key) {
    if (!currentUserId) return null
    const value = localStorage.getItem(scoped(key))
    if (value !== null) return value

    // One-time migration: progress saved before this change is handed to
    // the first account that opens it on this browser, then removed.
    if (LEGACY_KEYS.has(key)) {
      const legacy = localStorage.getItem(key)
      if (legacy !== null) {
        localStorage.setItem(scoped(key), legacy)
        localStorage.removeItem(key)
        return legacy
      }
    }
    return null
  },

  setItem(key, value) {
    if (currentUserId) localStorage.setItem(scoped(key), value)
  },
}
