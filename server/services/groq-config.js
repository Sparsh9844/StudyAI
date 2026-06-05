const GROQ_MODEL = process.env.NEXT_PUBLIC_GROQ_MODEL || 'llama-3.3-70b-versatile'
const GROQ_MAX_TOKENS = parseInt(process.env.NEXT_PUBLIC_GROQ_MAX_TOKENS || '8192', 10)
const GROQ_TEMPERATURE = parseFloat(process.env.NEXT_PUBLIC_GROQ_TEMPERATURE || '0.7')

module.exports = {
  GROQ_MODEL,
  GROQ_MAX_TOKENS,
  GROQ_TEMPERATURE,
}
