import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function getGroqChatCompletion(messages) {
  return groq.chat.completions.create({
    messages,
    model: 'llama3-70b-8192',
    temperature: 0.7,
    max_tokens: 4096,
  })
}

export default groq
