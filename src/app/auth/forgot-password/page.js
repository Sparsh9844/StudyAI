import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '@/services/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { KeyRound, MailCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await requestPasswordReset(email)
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]" />
      <Card className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            {sent ? <MailCheck className="w-7 h-7 text-white" /> : <KeyRound className="w-7 h-7 text-white" />}
          </div>
          <h1 className="text-2xl font-bold text-white">{sent ? 'Check Your Email' : 'Forgot Password'}</h1>
          <p className="text-gray-400 mt-1">
            {sent
              ? <>If an account exists for <span className="text-white">{email}</span>, we&apos;ve sent a link to reset your password.</>
              : 'Enter your email and we’ll send you a reset link'}
          </p>
        </div>
        {sent ? (
          <Button variant="secondary" className="w-full" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Remembered it?{' '}
          <Link to="/auth/login" className="text-indigo-400 hover:text-indigo-300">Back to sign in</Link>
        </p>
      </Card>
    </div>
  )
}
