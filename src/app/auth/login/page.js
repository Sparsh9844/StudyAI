import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signIn, resendConfirmation } from '@/services/auth'
import { useAuth } from '@/hooks/useAuth'
import { preloadDashboard } from '@/lib/preload'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [unconfirmed, setUnconfirmed] = useState(false)
  const [resending, setResending] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { preloadDashboard() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setUnconfirmed(false)
    const { data, error } = await signIn(email, password)
    setLoading(false)
    if (error?.code === 'email_not_confirmed') {
      setUnconfirmed(true)
    } else if (error) {
      toast.error(error.message)
    } else {
      const firstName = data.user?.user_metadata?.full_name?.split(' ')[0]
      toast.success(firstName ? `Welcome back, ${firstName}!` : 'Welcome back!')
      navigate('/dashboard', { replace: true })
    }
  }

  const handleResend = async () => {
    setResending(true)
    const { error } = await resendConfirmation(email)
    setResending(false)
    if (error) toast.error(error.message)
    else toast.success('Confirmation email sent')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]" />
      <Card className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-1">Sign in to your StudyAI account</p>
        </div>
        {user && (
          <div className="mb-5 p-3 rounded-xl bg-zinc-800/60 border border-zinc-700 text-sm text-zinc-300">
            Signed in as <span className="text-white font-medium">{user.email}</span>.{' '}
            <Link to="/dashboard" className="text-indigo-400 hover:text-indigo-300">Continue</Link>
            {' '}or sign in with another account below.
          </div>
        )}
        {unconfirmed && (
          <div className="mb-5 p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-sm text-amber-200">
            Please confirm your email first — check your inbox for the link we sent.{' '}
            <button type="button" onClick={handleResend} disabled={resending} className="text-amber-300 underline hover:text-amber-100 disabled:opacity-50">
              {resending ? 'Sending...' : 'Resend email'}
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
          <div className="space-y-1.5">
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />
            <div className="text-right">
              <Link to="/auth/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</Link>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/auth/register" className="text-indigo-400 hover:text-indigo-300">Sign up</Link>
        </p>
      </Card>
    </div>
  )
}
