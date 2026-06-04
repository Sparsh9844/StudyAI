'use client'
import { cn } from '@/utils/helpers'

export function Input({ label, error, className, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300">{label}</label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all',
          error && 'border-red-500/50 focus:ring-red-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
