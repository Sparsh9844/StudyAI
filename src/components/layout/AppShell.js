import { useAuth } from '@/hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'

const publicPaths = [
  '/', '/auth/login', '/auth/register',
  '/auth/forgot-password', '/auth/reset-password',
]

export function AppShell({ children }) {
  const { user, loading } = useAuth()
  const pathname = useLocation().pathname
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user && !publicPaths.includes(pathname)) {
      navigate('/auth/login', { replace: true })
    }
  }, [user, loading, pathname, navigate])

  const isPublic = publicPaths.includes(pathname)

  // Public pages never depend on auth state to render — paint them
  // immediately instead of blocking first paint on the auth check.
  if (isPublic) return <>{children}</>

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      <main className="md:ml-60 p-5 md:p-8">{children}</main>
    </div>
  )
}
