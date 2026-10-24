import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/hooks/useAuth'
import { CookieConsent } from '@/components/CookieConsent'

export function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <CookieConsent />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
          },
        }}
      />
    </AuthProvider>
  )
}
