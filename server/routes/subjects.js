const express = require('express')
const router = express.Router()
const supabase = require('../services/supabase')

router.get('/', async (req, res) => {
  const { user_id } = req.query
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
  if (error) return res.status(400).json({ error: error.message })
  res.json({ data })
})

router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('subjects').insert(req.body).select().single()
  if (error) return res.status(400).json({ error: error.message })
  res.json({ data })
})

router.put('/:id', async (req, res) => {
  const { data, error } = await supabase.from('subjects').update(req.body).eq('id', req.params.id).select().single()
  if (error) return res.status(400).json({ error: error.message })
  res.json({ data })
})

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('subjects').delete().eq('id', req.params.id)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ success: true })
})

module.exports = router
