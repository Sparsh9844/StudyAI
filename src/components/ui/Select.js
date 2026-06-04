'use client'
import { cn } from '@/utils/helpers'

export function Select({ label, options, error, className, ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
      <select
        className={cn(
          'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all',
          error && 'border-red-500/50',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-gray-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
