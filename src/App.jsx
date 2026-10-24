import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Providers } from './components/layout/Providers'
import { AppShell } from './components/layout/AppShell'
import { ErrorBoundary } from './components/ErrorBoundary'

// ── Eager (needed immediately on every load) ─────────────────
import Landing from './app/page'
import Login from './app/auth/login/page'
import Register from './app/auth/register/page'

// ── Lazy (loaded only when the user navigates there) ─────────
// Each lazy() call becomes its own JS chunk — the browser only
// downloads a chunk when the user actually visits that route.
const ForgotPassword = lazy(() => import('./app/auth/forgot-password/page'))
const ResetPassword  = lazy(() => import('./app/auth/reset-password/page'))
const Dashboard    = lazy(() => import('./app/dashboard/page'))
const PrepHub      = lazy(() => import('./app/prep-hub/page'))
const Flashcards   = lazy(() => import('./app/flashcards/page'))
const InterviewTracker = lazy(() => import('./app/interview-tracker/page'))
const Assistant    = lazy(() => import('./app/assistant/page'))
const Dsa          = lazy(() => import('./app/dsa/page'))
const Aptitude     = lazy(() => import('./app/aptitude/page'))
const CoreCS       = lazy(() => import('./app/core-cs/page'))

// ── Minimal full-screen spinner shown while a chunk loads ─────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 text-xs tracking-wider uppercase">Loading</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <BrowserRouter>
          <AppShell>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public — always in initial bundle */}
                <Route path="/"               element={<Landing />} />
                <Route path="/auth/login"     element={<Login />} />
                <Route path="/auth/register"  element={<Register />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/reset-password"  element={<ResetPassword />} />

                {/* Protected — loaded on demand */}
                <Route path="/dashboard"          element={<Dashboard />} />
                <Route path="/prep-hub"           element={<PrepHub />} />
                <Route path="/flashcards"         element={<Flashcards />} />
                <Route path="/interview-tracker"  element={<InterviewTracker />} />
                <Route path="/dsa"            element={<Dsa />} />
                <Route path="/aptitude"       element={<Aptitude />} />
                <Route path="/core-cs"        element={<CoreCS />} />
                <Route path="/assistant"      element={<Assistant />} />
              </Routes>
            </Suspense>
          </AppShell>
        </BrowserRouter>
      </Providers>
    </ErrorBoundary>
  )
}
