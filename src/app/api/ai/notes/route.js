import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req) {
  try {
    const { topic, subject } = await req.json()

    const prompt = `Generate comprehensive study notes for the topic "${topic}" in the subject "${subject}". Include: key concepts, important points, formulas if applicable, and a summary. Format with clear headings and bullet points.`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert tutor generating clear, structured study notes.' },
        { role: 'user', content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 4096,
    })

    const notes = completion.choices[0]?.message?.content || 'Unable to generate notes.'

    return NextResponse.json({ notes })
  } catch (error) {
    console.error('Notes API error:', error)
    return NextResponse.json({ notes: 'Error generating notes.', error: error.message }, { status: 500 })
  }
}
