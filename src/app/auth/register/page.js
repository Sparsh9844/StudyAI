import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUp, resendConfirmation } from '@/services/auth'
import { preloadDashboard } from '@/lib/preload'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { BookOpen, MailCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  // Set once the account exists but the email still needs confirming
  const [pendingEmail, setPendingEmail] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { preloadDashboard() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await signUp(email, password, name)
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else if (data?.session) {
      // Email confirmation disabled — the user is already signed in
      toast.success(`Welcome, ${name.split(' ')[0]}!`)
      navigate('/dashboard', { replace: true })
    } else {
      setPendingEmail(email)
    }
  }

  const handleResend = async () => {
    setResending(true)
    const { error } = await resendConfirmation(pendingEmail)
    setResending(false)
    if (error) toast.error(error.message)
    else toast.success('Confirmation email sent again')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]" />
      <Card className="w-full max-w-md relative z-10">
        {pendingEmail ? (
          <>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <MailCheck className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Confirm Your Email</h1>
              <p className="text-gray-400 mt-1">
                We sent a link to <span className="text-white">{pendingEmail}</span>.
                Open it to activate your account — you&apos;ll be signed in automatically.
              </p>
            </div>
            <Button variant="secondary" className="w-full" disabled={resending} onClick={handleResend}>
              {resending ? 'Sending...' : 'Resend email'}
            </Button>
            <p className="text-center text-gray-400 mt-6 text-sm">
              Already confirmed?{' '}
              <Link to="/auth/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link>
            </p>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Create Account</h1>
              <p className="text-gray-400 mt-1">Start your study journey</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required autoComplete="name" />
              <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
              <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} autoComplete="new-password" />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            <p className="text-center text-gray-400 mt-6 text-sm">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link>
            </p>
          </>
        )}
      </Card>
    </div>
  )
}
