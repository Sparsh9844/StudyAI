import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req) {
  try {
    const { subjectIds, days } = await req.json()

    if (!subjectIds || subjectIds.length === 0) {
      return NextResponse.json({ plan: [], error: 'Please select at least one subject.' }, { status: 400 })
    }

    if (!days || days < 1) {
      return NextResponse.json({ plan: [], error: 'Number of days must be at least 1.' }, { status: 400 })
    }

    // Fetch subjects and their topics from Supabase
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    const { data: subjects, error: subjError } = await supabase
      .from('subjects')
      .select('*, topics(id, name, status)')
      .in('id', subjectIds)

    if (subjError) {
      return NextResponse.json({ plan: [], error: 'Failed to fetch subject data.' }, { status: 500 })
    }

    if (!subjects || subjects.length === 0) {
      return NextResponse.json({ plan: [], error: 'Selected subjects not found.' }, { status: 404 })
    }

    // Build a detailed prompt with actual topic names
    const subjectDetails = subjects.map(s => ({
      name: s.name,
      exam_date: s.exam_date || 'Not set',
      topics: (s.topics || []).map(t => ({ name: t.name, status: t.status })),
    }))

    const prompt = `You are an AI study planner. Create a day-wise study schedule for ${days} days for the following subject(s):

${JSON.stringify(subjectDetails, null, 2)}

Return a JSON array of objects with these exact fields:
- day: number (starting from 1)
- date: string (YYYY-MM-DD, starting from today)
- subject: string (the subject name)
- topics_to_cover: array of strings (specific topics from the subject)
- hours: number (1-4)
- focus_area: string (key concept or skill to focus on)

Return ONLY the JSON array. No markdown, no code fences, no explanation.`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a precise study planner. Return ONLY valid JSON.' },
        { role: 'user', content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 8192,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ plan: [], error: 'AI returned an empty response. Please try again.' }, { status: 500 })
    }

    const cleaned = content.replace(/```json?/g, '').replace(/```/g, '').trim()
    let plan
    try {
      plan = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ plan: [], error: 'AI returned invalid JSON. Please try again.' }, { status: 500 })
    }

    if (!Array.isArray(plan) || plan.length === 0) {
      return NextResponse.json({ plan: [], error: 'AI generated an empty plan. Try different subjects or fewer days.' }, { status: 500 })
    }

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('Study plan API error:', error)
    return NextResponse.json({
      plan: [],
      error: error.message || 'An unexpected error occurred while generating the study plan.',
    }, { status: 500 })
  }
}
