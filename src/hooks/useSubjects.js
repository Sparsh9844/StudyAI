'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export function useSubjects() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadSubjects = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setSubjects(data || [])
    setLoading(false)
  }

  useEffect(() => { loadSubjects() }, [])

  const addSubject = async (subject) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('subjects')
      .insert({ ...subject, user_id: user.id })
      .select()
      .single()
    setSubjects(prev => [data, ...prev])
    return data
  }

  const removeSubject = async (id) => {
    await supabase.from('subjects').delete().eq('id', id)
    setSubjects(prev => prev.filter(s => s.id !== id))
  }

  return { subjects, loading, addSubject, removeSubject, loadSubjects }
}
