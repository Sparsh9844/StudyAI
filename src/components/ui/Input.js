import { cn } from '@/utils/helpers'

export function Input({ label, error, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-zinc-200">{label}</label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl',
          'text-white font-medium placeholder-zinc-500 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all',
          error && 'border-red-600 focus:ring-red-500/40',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
    </div>
  )
}
