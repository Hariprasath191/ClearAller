import { cn } from '../utils/cn'

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-surface-2/80 backdrop-blur border border-black/5 dark:border-white/10 shadow-soft',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

