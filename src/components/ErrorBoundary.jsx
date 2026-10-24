import { Component } from 'react'

// Catches render/lifecycle errors in the subtree so the app shows a message
// instead of a blank black screen. Async/event-handler errors are not caught
// (those should be handled at the call site).
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black p-6 text-center">
          <div className="max-w-md">
            <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-400 text-sm mb-1">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <p className="text-gray-600 text-xs mb-4">
              If this persists, check your <code>.env.local</code> (Supabase + Groq keys).
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
