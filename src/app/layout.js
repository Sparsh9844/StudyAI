import { Providers } from '@/components/layout/Providers'
import { AppShell } from '@/components/layout/AppShell'
import './globals.css'

export const metadata = {
  title: 'StudyAI - Smart Study Planner',
  description: 'AI-powered study planner and revision tracker',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
