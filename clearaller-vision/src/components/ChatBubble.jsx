import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

export function ChatBubble({ role, text, isTyping }) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className={cn(
          'max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-soft border',
          isUser
            ? 'bg-gradient-to-b from-ocean-500 to-ocean-600 text-white border-white/10'
            : 'bg-surface-2 text-ink-1 border-black/5 dark:border-white/10',
        )}
      >
        {isTyping ? (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-ink-2/60 animate-bounce [animation-delay:-0.12s]" />
            <span className="h-2 w-2 rounded-full bg-ink-2/60 animate-bounce [animation-delay:-0.06s]" />
            <span className="h-2 w-2 rounded-full bg-ink-2/60 animate-bounce" />
          </div>
        ) : (
          <span className="whitespace-pre-wrap">{text}</span>
        )}
      </motion.div>
    </div>
  )
}

