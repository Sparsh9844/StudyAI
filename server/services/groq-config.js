// Use qwen/qwen3.8-27b — available on the free tier, strong reasoning,
// good for study assistance. Falls back to env override if set.
const GROQ_MODEL = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b'
const GROQ_MAX_TOKENS = parseInt(process.env.GROQ_MAX_TOKENS || '8192', 10)
const GROQ_TEMPERATURE = parseFloat(process.env.GROQ_TEMPERATURE || '0.7')

module.exports = {
  GROQ_MODEL,
  GROQ_MAX_TOKENS,
  GROQ_TEMPERATURE,
}
