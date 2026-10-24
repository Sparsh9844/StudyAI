import { useState } from 'react'
import toast from 'react-hot-toast'
import { apiFetch } from '@/lib/api'

export function useAI() {
  const [loading, setLoading] = useState(false)

  const generatePlan = async (subjectIds, days) => {
    setLoading(true)
    try {
      const data = await apiFetch('/api/ai/study-plan', {
        method: 'POST',
        body: JSON.stringify({ subjectIds, days }),
      })
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
      const data = await apiFetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ messages }),
      })
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
