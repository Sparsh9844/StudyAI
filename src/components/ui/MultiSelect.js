'use client'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/helpers'
import { Check, ChevronDown } from 'lucide-react'

export function MultiSelect({ label, options, value, onChange, placeholder = 'Select...', error }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const toggle = (id) => {
    const selected = value.includes(id) ? value.filter(v => v !== id) : [...value, id]
    onChange(selected)
  }

  return (
    <div className="space-y-1 relative" ref={ref}>
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-left flex items-center justify-between transition-all',
          open ? 'ring-2 ring-indigo-500/50 border-indigo-500/50' : '',
          error && 'border-red-500/50',
          value.length === 0 ? 'text-gray-500' : 'text-white'
        )}
      >
        <span className="text-sm truncate">
          {value.length === 0 ? placeholder : `${value.length} subject${value.length > 1 ? 's' : ''} selected`}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-gray-900 border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
          {options.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm text-center">No subjects available</p>
          ) : (
            options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors"
              >
                <div className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center transition-all',
                  value.includes(opt.value)
                    ? 'bg-indigo-600 border-indigo-500'
                    : 'border-white/20'
                )}>
                  {value.includes(opt.value) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-white">{opt.label}</span>
                {opt.description && <span className="text-gray-500 text-xs ml-auto">{opt.description}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
