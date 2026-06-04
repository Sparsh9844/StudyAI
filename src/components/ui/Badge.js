'use client'
import { cn } from '@/utils/helpers'

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-white/10 text-gray-300',
    success: 'bg-green-500/10 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/10 text-red-400 border-red-500/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  }
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variants[variant] || variants.default,
      className
    )}>
      {children}
    </span>
  )
}
