import { cn } from '@/utils/helpers'

export function Button({ children, variant = 'primary', size, className, ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  }

  const variants = {
    primary:   'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-500/20',
    secondary: 'bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 hover:text-white',
    ghost:     'text-zinc-300 hover:text-white hover:bg-zinc-800',
    danger:    'bg-red-900/30 text-red-400 border border-red-800/50 hover:bg-red-900/50',
  }

  return (
    <button
      className={cn(base, sizes[size || 'md'], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
}
