import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

export function Loader({ label = 'Analyzing Ingredients…', className }) {
  return (
    <div className={cn('w-full flex flex-col items-center justify-center gap-4 py-10', className)}>
      <div className="relative h-14 w-14">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand-300/40 dark:border-ocean-300/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-br from-brand-400/30 to-ocean-500/30 blur-sm"
          animate={{ opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-3 rounded-full bg-surface-1"
          animate={{ scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="text-center">
        <div className="text-base font-semibold">{label}</div>
        <div className="text-sm text-ink-2">We’re scanning ingredients and matching allergens.</div>
      </div>
    </div>
  )
}

