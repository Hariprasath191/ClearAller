import { forwardRef } from 'react'
import { cn } from '../utils/cn'

export const Button = forwardRef(function Button(
  { as: Comp = 'button', className, variant = 'primary', size = 'md', ...props },
  ref,
) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60'

  const variants = {
    primary:
      'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-soft hover:from-brand-400 hover:to-brand-600',
    secondary:
      'bg-surface-2 text-ink-1 border border-black/5 dark:border-white/10 hover:bg-surface-3',
    ghost: 'bg-transparent text-ink-1 hover:bg-surface-2',
    danger:
      'bg-gradient-to-b from-red-500 to-red-600 text-white shadow-soft hover:from-red-400 hover:to-red-600',
  }

  const sizes = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-5 text-sm',
    lg: 'h-14 px-6 text-base',
    icon: 'h-12 w-12',
  }

  return (
    <Comp
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
})

