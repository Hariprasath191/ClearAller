import { cn } from '../utils/cn'

const MAP = {
  Safe: {
    cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
    dot: 'bg-emerald-500',
    label: 'Safe',
  },
  Moderate: {
    cls: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/25',
    dot: 'bg-amber-500',
    label: 'Moderate',
  },
  High: {
    cls: 'bg-red-500/15 text-red-800 dark:text-red-300 border-red-500/25',
    dot: 'bg-red-500',
    label: 'High Risk',
  },
}

export function RiskBadge({ risk = 'Safe', className }) {
  const meta = MAP[risk] || MAP.Safe
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
        meta.cls,
        className,
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  )
}

