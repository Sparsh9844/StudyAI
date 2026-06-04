'use client'
import { cn } from '@/utils/helpers'

export function Button({ children, variant = 'primary', className, ...props }) {
  const base = 'px-4 py-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25',
    secondary: 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white',
    danger: 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
  }
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  )
}
