'use client'
import { cn } from '@/utils/helpers'

export function Card({ children, className, hover = false, glow = false, ...props }) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-6 shadow-xl shadow-black/10',
        hover && 'glass-hover cursor-pointer',
        glow && 'animate-border-glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
