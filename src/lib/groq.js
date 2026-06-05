import Groq from 'groq-sdk'
import { groqConfig } from './groq-config'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function getGroqChatCompletion(messages, options = {}) {
  const isDev = process.env.NODE_ENV === 'development'

  const requestPayload = {
    messages,
    model: options.model || groqConfig.model,
    temperature: options.temperature ?? groqConfig.temperature,
    max_tokens: options.maxTokens || groqConfig.maxTokens,
  }

  if (isDev) {
    console.log('[Groq Request]', JSON.stringify({
      model: requestPayload.model,
      messages: messages.map(m => ({ role: m.role, contentLength: m.content?.length })),
      temperature: requestPayload.temperature,
      max_tokens: requestPayload.maxTokens,
    }, null, 2))
  }

  try {
    const response = await groq.chat.completions.create(requestPayload)

    if (isDev) {
      console.log('[Groq Response]', JSON.stringify({
        model: response.model,
        usage: response.usage,
        finishReason: response.choices?.[0]?.finish_reason,
        contentLength: response.choices?.[0]?.message?.content?.length,
      }, null, 2))
    }

    return response
  } catch (error) {
    const errorInfo = {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
    }

    if (isDev) {
      console.error('[Groq Error]', JSON.stringify(errorInfo, null, 2))
    }

    throw new Error(`Groq API error (${errorInfo.code || 'unknown'}): ${errorInfo.message}`)
  }
}

export default groq
