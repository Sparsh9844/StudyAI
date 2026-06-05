const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')
const { GROQ_MODEL, GROQ_MAX_TOKENS, GROQ_TEMPERATURE } = require('../services/groq-config')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const isDev = process.env.NODE_ENV === 'development'

router.post('/study-plan', async (req, res) => {
  try {
    const { subjects, days } = req.body

    if (isDev) {
      console.log('[Server Groq] Study plan request:', { subjectsCount: subjects?.length, days })
    }

    const prompt = `Create a ${days}-day study plan for: ${JSON.stringify(subjects)}. Return JSON array with day, subject, topics_to_cover array, hours, focus_area.`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a precise study planner. Return ONLY valid JSON array.' },
        { role: 'user', content: prompt },
      ],
      model: GROQ_MODEL,
      temperature: GROQ_TEMPERATURE,
      max_tokens: GROQ_MAX_TOKENS,
    })

    const content = completion.choices[0]?.message?.content || '[]'
    const cleaned = content.replace(/```json?/g, '').replace(/```/g, '').trim()
    const plan = JSON.parse(cleaned)

    if (isDev) {
      console.log('[Server Groq] Plan generated:', { daysCount: plan.length })
    }

    res.json({ plan })
  } catch (error) {
    const msg = error.message || 'Unknown error'
    console.error('[Server Groq] Error:', msg)
    res.status(500).json({ error: msg })
  }
})

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body

    if (isDev) {
      console.log('[Server Groq] Chat request:', { messageCount: messages?.length })
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert AI study assistant.' },
        ...messages,
      ],
      model: GROQ_MODEL,
      temperature: GROQ_TEMPERATURE,
      max_tokens: 4096,
    })

    res.json({ reply: completion.choices[0]?.message?.content })
  } catch (error) {
    const msg = error.message || 'Unknown error'
    console.error('[Server Groq] Chat error:', msg)
    res.status(500).json({ error: msg })
  }
})

module.exports = router
