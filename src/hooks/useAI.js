'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getGroqChatCompletion } from '@/lib/groq'

export function useAI() {
  const [loading, setLoading] = useState(false)

  const generatePlan = async (subjects, days) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects, days }),
      })
      const data = await response.json()
      return data.plan
    } catch {
      toast.error('Failed to generate study plan')
      return null
    } finally {
      setLoading(false)
    }
  }

  const chat = async (messages) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      })
      const data = await response.json()
      return data.reply
    } catch {
      toast.error('Failed to get AI response')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { generatePlan, chat, loading }
}
