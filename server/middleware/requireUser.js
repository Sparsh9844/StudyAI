const { createAuthClient } = require('../services/supabase')

// Rejects requests without a valid Supabase access token
// (`Authorization: Bearer <token>`). On success sets `req.user`.
async function requireUser(req, res, next) {
  const match = /^Bearer (.+)$/.exec(req.get('authorization') || '')
  if (!match) return res.status(401).json({ error: 'Sign in required' })

  try {
    const { data, error } = await createAuthClient().auth.getUser(match[1])
    if (error || !data?.user) return res.status(401).json({ error: 'Session expired — please sign in again' })
    req.user = data.user
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = requireUser
