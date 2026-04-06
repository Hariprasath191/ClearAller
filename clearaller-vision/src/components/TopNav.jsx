import { Moon, Sun, ArrowLeft, ShieldCheck } from 'lucide-react'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { Button } from './Button'
import { cn } from '../utils/cn'

const TITLE_BY_PATH = [
  { prefix: '/dashboard', title: 'ClearAller Vision' },
  { prefix: '/scan', title: 'Scan & Analyze' },
  { prefix: '/search', title: 'Smart Search' },
  { prefix: '/result', title: 'Safety Result' },
  { prefix: '/chat', title: 'AllerGuard AI' },
  { prefix: '/profile', title: 'Profiles' },
]

export function TopNav({ title, showBack = true, className }) {
  const { theme, toggle } = useTheme()
  const { isAuthed, logout } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()

  const computedTitle = useMemo(() => {
    if (title) return title
    const match = TITLE_BY_PATH.find((r) => loc.pathname.startsWith(r.prefix))
    return match?.title || 'ClearAller Vision'
  }, [loc.pathname, title])

  const canGoBack = showBack && loc.pathname !== '/dashboard' && loc.pathname !== '/login'

  return (
    <div
      className={cn(
        'sticky top-0 z-40 bg-surface-1/80 backdrop-blur border-b border-black/5 dark:border-white/10',
        className,
      )}
    >
      <div className="mx-auto max-w-md px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {canGoBack ? (
            <button
              className="h-10 w-10 grid place-items-center rounded-2xl hover:bg-surface-2 active:scale-[0.99]"
              onClick={() => nav(-1)}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="h-10 w-10 grid place-items-center rounded-2xl bg-gradient-to-br from-brand-500/15 to-ocean-500/15">
              <ShieldCheck className="h-5 w-5 text-brand-600 dark:text-ocean-300" />
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{computedTitle}</div>
            <div className="text-[11px] text-ink-2 truncate">AllerGuard • AI allergen detection</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="h-10 w-10 grid place-items-center rounded-2xl hover:bg-surface-2 active:scale-[0.99]"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {isAuthed ? (
            <Button size="sm" variant="secondary" onClick={logout} className="hidden sm:inline-flex">
              Logout
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

