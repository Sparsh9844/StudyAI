'use client'
import { useAuth } from '@/hooks/useAuth'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'

const publicPaths = ['/', '/auth/login', '/auth/register']

export function AppShell({ children }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user && !publicPaths.includes(pathname)) {
      router.push('/auth/login')
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isPublic = publicPaths.includes(pathname)

  if (isPublic || !user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
