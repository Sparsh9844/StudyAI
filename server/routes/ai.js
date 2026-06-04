const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post('/study-plan', async (req, res) => {
  try {
    const { subjects, days } = req.body
    const prompt = `Create a ${days}-day study plan for: ${JSON.stringify(subjects)}. Return JSON array with day, subject, topics_to_cover array, hours, focus_area.`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Return ONLY valid JSON array.' },
        { role: 'user', content: prompt },
      ],
      model: 'llama3-70b-8192',
      temperature: 0.7,
      max_tokens: 8192,
    })

    const content = completion.choices[0]?.message?.content || '[]'
    const cleaned = content.replace(/```json?/g, '').replace(/```/g, '').trim()
    res.json({ plan: JSON.parse(cleaned) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert AI study assistant.' },
        ...messages,
      ],
      model: 'llama3-70b-8192',
      temperature: 0.7,
      max_tokens: 4096,
    })
    res.json({ reply: completion.choices[0]?.message?.content })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
