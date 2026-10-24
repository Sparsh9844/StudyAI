import { useState } from 'react'
import { Cookie } from 'lucide-react'
import { getConsent, setConsent } from '@/lib/consent'
import { loadSupabase } from '@/lib/supabase-lazy'
import { syncServerSession, clearServerSession } from '@/services/session'
import { Button } from '@/components/ui/Button'

// Asks once whether we may keep the user signed in with a cookie.
// The choice is applied immediately to any current session.
export function CookieConsent() {
  const [visible, setVisible] = useState(() => getConsent() === null)

  if (!visible) return null

  const accept = async () => {
    setConsent('accepted')
    setVisible(false)
    const supabase = await loadSupabase()
    const { data } = await supabase?.auth.getSession() ?? {}
    if (data?.session) syncServerSession(data.session)
  }

  const decline = () => {
    setConsent('declined')
    setVisible(false)
    clearServerSession()
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] p-4"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto max-w-2xl flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl shadow-black/50 animate-fade-in-up">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-zinc-300 leading-relaxed">
            We use a secure cookie to keep you signed in, so you don&apos;t have to log in every visit.
            If you decline, you&apos;ll be signed out when you close your browser.
          </p>
        </div>
        <div className="flex gap-2 sm:flex-shrink-0">
          <Button variant="secondary" onClick={decline} className="flex-1 sm:flex-none">Decline</Button>
          <Button onClick={accept} className="flex-1 sm:flex-none">Accept</Button>
        </div>
      </div>
    </div>
  )
}
