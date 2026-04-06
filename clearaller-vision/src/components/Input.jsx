import { cn } from '../utils/cn'

export function Input({ className, startIcon: StartIcon, end: endSlot, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-2xl bg-surface-1 border border-black/10 dark:border-white/10 px-4 h-12 focus-within:ring-2 focus-within:ring-ring/50',
        className,
      )}
    >
      {StartIcon ? <StartIcon className="h-5 w-5 text-ink-2" /> : null}
      <input
        className="w-full bg-transparent outline-none text-sm placeholder:text-ink-2/70"
        {...props}
      />
      {endSlot}
    </div>
  )
}

