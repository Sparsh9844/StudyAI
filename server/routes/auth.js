const express = require('express')
const router = express.Router()
const supabase = require('../services/supabase')

router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  })
  if (error) return res.status(400).json({ error: error.message })
  res.json({ data })
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return res.status(400).json({ error: error.message })
  res.json({ data })
})

router.post('/signout', async (req, res) => {
  const { error } = await supabase.auth.signOut()
  if (error) return res.status(400).json({ error: error.message })
  res.json({ success: true })
})

module.exports = router
