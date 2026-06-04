const express = require('express')
const router = express.Router()
const supabase = require('../services/supabase')

router.get('/', async (req, res) => {
  const { subject_id } = req.query
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('subject_id', subject_id)
    .order('created_at', { ascending: true })
  if (error) return res.status(400).json({ error: error.message })
  res.json({ data })
})

router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('topics').insert(req.body).select().single()
  if (error) return res.status(400).json({ error: error.message })
  res.json({ data })
})

router.put('/:id', async (req, res) => {
  const { data, error } = await supabase.from('topics').update(req.body).eq('id', req.params.id).select().single()
  if (error) return res.status(400).json({ error: error.message })
  res.json({ data })
})

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('topics').delete().eq('id', req.params.id)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ success: true })
})

module.exports = router
