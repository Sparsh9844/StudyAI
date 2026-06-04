'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/services/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signUp(email, password, name)
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Account created! Check your email to confirm.')
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]" />
      <Card className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-1">Start your study journey</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link>
        </p>
      </Card>
    </div>
  )
}
