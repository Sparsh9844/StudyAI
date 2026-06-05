import { getGroqChatCompletion } from '@/lib/groq'

export async function generateStudyPlan(subjects, examDates, totalDays) {
  const prompt = `You are an AI study planner. Create a day-wise study schedule.
  
Subjects and exam dates: ${JSON.stringify(subjects)}
Total days available: ${totalDays}

Create a JSON array of objects with: day (number), date, subject, topics_to_cover (array), hours, focus_area.
Return ONLY valid JSON array, no other text.`

  try {
    const response = await getGroqChatCompletion([
      { role: 'system', content: 'You are a precise study planner AI. Return ONLY valid JSON.' },
      { role: 'user', content: prompt },
    ])
    const content = response.choices[0]?.message?.content || '[]'
    const cleaned = content.replace(/```json?/g, '').replace(/```/g, '').trim()
    return JSON.parse(cleaned)
  } catch (error) {
    console.error('Groq API error in generateStudyPlan:', error.message)
    throw error
  }
}

export async function generateNotes(topic, subject) {
  const prompt = `Generate comprehensive study notes for the topic "${topic}" in subject "${subject}".
Include: key concepts, important points, formulas (if applicable), and summary.
Format as HTML with proper headings and bullet points.`

  try {
    const response = await getGroqChatCompletion([
      { role: 'system', content: 'You are a helpful study assistant. Generate clear, concise notes.' },
      { role: 'user', content: prompt },
    ])
    return response.choices[0]?.message?.content || 'Unable to generate notes.'
  } catch (error) {
    console.error('Groq API error in generateNotes:', error.message)
    throw error
  }
}

export async function solveDoubt(question, context) {
  const prompt = `Student question: "${question}"
Context: ${context || 'General'}

Provide a clear, step-by-step explanation.`

  try {
    const response = await getGroqChatCompletion([
      { role: 'system', content: 'You are a patient tutor. Explain concepts clearly with examples.' },
      { role: 'user', content: prompt },
    ])
    return response.choices[0]?.message?.content || 'Unable to answer.'
  } catch (error) {
    console.error('Groq API error in solveDoubt:', error.message)
    throw error
  }
}
