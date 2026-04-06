import { Bot, Home, ScanLine, Search, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../utils/cn'

const items = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/scan', label: 'Scan', icon: ScanLine },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/chat', label: 'Chat', icon: Bot },
  { to: '/profile', label: 'Profiles', icon: Users },
]

export function BottomNav({ className }) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-surface-1/85 backdrop-blur border-t border-black/5 dark:border-white/10',
        className,
      )}
    >
      <div className="mx-auto max-w-md px-3 h-16 grid grid-cols-5 gap-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 rounded-2xl transition active:scale-[0.99]',
                isActive ? 'text-brand-700 dark:text-ocean-300 bg-surface-2' : 'text-ink-2',
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-[11px] font-semibold">{label}</span>
          </NavLink>
        ))}
      </div>
      <div className="mx-auto max-w-md h-[env(safe-area-inset-bottom)]" />
    </div>
  )
}

