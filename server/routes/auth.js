const express = require('express')
const router = express.Router()
const { createAuthClient } = require('../services/supabase')

// ── "Remember me" session cookie ──────────────────────────────
// Holds the user's Supabase refresh token so the server can sign them
// back in on a later visit. Only set when the user accepted cookies.
const isProd = process.env.NODE_ENV === 'production'
const REFRESH_COOKIE = 'studyai-refresh'
const FLAG_COOKIE    = 'studyai-remembered'   // readable hint for the client
const MAX_AGE        = 30 * 24 * 60 * 60 * 1000 // 30 days

const refreshCookieOpts = { httpOnly: true,  secure: isProd, sameSite: 'lax', path: '/api/auth' }
const flagCookieOpts    = { httpOnly: false, secure: isProd, sameSite: 'lax', path: '/' }

function readCookie(req, name) {
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=')
    if (i > 0 && part.slice(0, i).trim() === name) {
      return decodeURIComponent(part.slice(i + 1).trim())
    }
  }
  return null
}

function setSessionCookies(res, refreshToken) {
  res.cookie(REFRESH_COOKIE, refreshToken, { ...refreshCookieOpts, maxAge: MAX_AGE })
  res.cookie(FLAG_COOKIE, '1', { ...flagCookieOpts, maxAge: MAX_AGE })
}

function clearSessionCookies(res) {
  res.clearCookie(REFRESH_COOKIE, refreshCookieOpts)
  res.clearCookie(FLAG_COOKIE, flagCookieOpts)
}

// Reject cross-site requests to the cookie endpoints. In development the
// Vite proxy rewrites Host, so the check only applies in production.
function sameOrigin(req, res, next) {
  const origin = req.get('origin')
  if (isProd && origin && new URL(origin).host !== req.get('host')) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  res.set('Cache-Control', 'no-store')
  next()
}

// Save (or rotate) the remembered session after sign-in / token refresh
router.post('/session', sameOrigin, async (req, res) => {
  const { access_token, refresh_token } = req.body || {}
  if (!access_token || !refresh_token) {
    return res.status(400).json({ error: 'access_token and refresh_token are required' })
  }
  // Only remember tokens that belong to a real, current session
  const { data, error } = await createAuthClient().auth.getUser(access_token)
  if (error || !data?.user) return res.status(401).json({ error: 'Invalid session' })

  setSessionCookies(res, refresh_token)
  res.json({ success: true })
})

// Exchange the remembered refresh token for a fresh session
router.post('/restore', sameOrigin, async (req, res) => {
  const refresh_token = readCookie(req, REFRESH_COOKIE)
  if (!refresh_token) {
    clearSessionCookies(res)
    return res.status(401).json({ error: 'No saved session' })
  }

  const { data, error } = await createAuthClient().auth.refreshSession({ refresh_token })
  if (error || !data?.session) {
    clearSessionCookies(res)
    return res.status(401).json({ error: 'Saved session expired' })
  }

  // Supabase rotates refresh tokens — store the new one
  setSessionCookies(res, data.session.refresh_token)
  res.json({
    access_token:  data.session.access_token,
    refresh_token: data.session.refresh_token,
  })
})

// Forget the remembered session (sign out / consent declined)
router.delete('/session', sameOrigin, (_req, res) => {
  clearSessionCookies(res)
  res.json({ success: true })
})

module.exports = router
