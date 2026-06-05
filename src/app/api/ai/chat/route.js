import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { groqConfig } from '@/lib/groq-config'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const isDev = process.env.NODE_ENV === 'development'

export async function POST(req) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ reply: 'No message provided.' }, { status: 400 })
    }

    if (isDev) {
      console.log('[Chat API] Request:', {
        model: groqConfig.model,
        messageCount: messages.length,
        lastUserMsg: messages.filter(m => m.role === 'user').slice(-1)[0]?.content?.slice(0, 100),
      })
    }

    const systemMessage = {
      role: 'system',
      content: 'You are an expert AI study assistant helping students. You can help with study planning, concept explanations, doubt solving, and study tips. Be clear, concise, and encouraging. Use markdown for formatting.',
    }

    const completion = await groq.chat.completions.create({
      messages: [systemMessage, ...messages],
      model: groqConfig.model,
      temperature: groqConfig.temperature,
      max_tokens: 4096,
    })

    const reply = completion.choices[0]?.message?.content

    if (isDev) {
      console.log('[Chat API] Response:', {
        model: completion.model,
        usage: completion.usage,
        finishReason: completion.choices?.[0]?.finish_reason,
        replyLength: reply?.length,
      })
    }

    return NextResponse.json({ reply: reply || 'I apologize, but I was unable to process that request.' })
  } catch (error) {
    const msg = error.message || 'Unknown error'
    console.error('[Chat API] Error:', error)
    return NextResponse.json({ reply: 'Sorry, I encountered an error. Please try again.', error: msg }, { status: 500 })
  }
}
