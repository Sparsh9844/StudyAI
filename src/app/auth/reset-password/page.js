import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loadSupabase } from '@/lib/supabase-lazy'
import { updatePassword } from '@/services/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'

// Supabase reports failed links in the hash, e.g. #error_code=otp_expired&error_description=...
function readLinkError() {
  const params = new URLSearchParams(window.location.hash.slice(1))
  return params.get('error_description')?.replace(/\+/g, ' ') || null
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  // 'checking' → verifying the link, 'ready' → show form, 'invalid' → link expired/used
  const [status, setStatus] = useState('checking')
  const [linkError] = useState(readLinkError)
  const navigate = useNavigate()

  // The SDK exchanges the token in the email link for a recovery session
  // during initialisation; getSession() waits for that to finish.
  useEffect(() => {
    if (linkError) { setStatus('invalid'); return }
    let cancelled = false
    loadSupabase()
      .then(supabase => supabase.auth.getSession())
      .then(({ data: { session } }) => {
        if (!cancelled) setStatus(session ? 'ready' : 'invalid')
      })
      .catch(() => {
        if (!cancelled) setStatus('invalid')
      })
    return () => { cancelled = true }
  }, [linkError])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password updated!')
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]" />
      <Card className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Set New Password</h1>
          <p className="text-gray-400 mt-1">
            {status === 'invalid'
              ? (linkError || 'This reset link is invalid or has expired.')
              : 'Choose a new password for your account'}
          </p>
        </div>

        {status === 'checking' && (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {status === 'ready' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} autoComplete="new-password" />
            <Input label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required minLength={6} autoComplete="new-password" />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        )}

        {status === 'invalid' && (
          <Link
            to="/auth/forgot-password"
            className="flex w-full items-center justify-center px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all"
          >
            Request a new link
          </Link>
        )}

        <p className="text-center text-gray-400 mt-6 text-sm">
          <Link to="/auth/login" className="text-indigo-400 hover:text-indigo-300">Back to sign in</Link>
        </p>
      </Card>
    </div>
  )
}
