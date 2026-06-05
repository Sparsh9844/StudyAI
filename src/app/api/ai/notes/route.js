import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { groqConfig } from '@/lib/groq-config'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const isDev = process.env.NODE_ENV === 'development'

export async function POST(req) {
  try {
    const { topic, subject } = await req.json()

    if (!topic || !subject) {
      return NextResponse.json({ notes: 'Both topic and subject are required.' }, { status: 400 })
    }

    if (isDev) {
      console.log('[Notes API] Request:', { model: groqConfig.model, topic, subject })
    }

    const prompt = `Generate comprehensive study notes for the topic "${topic}" in the subject "${subject}". Include: key concepts, important points, formulas if applicable, and a summary. Format with clear headings and bullet points.`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert tutor generating clear, structured study notes.' },
        { role: 'user', content: prompt },
      ],
      model: groqConfig.model,
      temperature: 0.5,
      max_tokens: 4096,
    })

    const notes = completion.choices[0]?.message?.content

    if (isDev) {
      console.log('[Notes API] Response:', {
        model: completion.model,
        usage: completion.usage,
        notesLength: notes?.length,
      })
    }

    return NextResponse.json({ notes: notes || 'Unable to generate notes.' })
  } catch (error) {
    const msg = error.message || 'Unknown error'
    console.error('[Notes API] Error:', error)
    return NextResponse.json({ notes: 'Error generating notes.', error: msg }, { status: 500 })
  }
}
