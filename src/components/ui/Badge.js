import { cn } from '@/utils/helpers'

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-200 border-zinc-700',
    success: 'bg-green-900/40 text-green-300 border-green-700/50',
    warning: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
    danger:  'bg-red-900/40  text-red-300   border-red-700/50',
    info:    'bg-blue-900/40 text-blue-300  border-blue-700/50',
    purple:  'bg-purple-900/40 text-purple-300 border-purple-700/50',
  }
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border',
      variants[variant] || variants.default,
      className
    )}>
      {children}
    </span>
  )
}
