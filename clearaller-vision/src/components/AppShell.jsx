import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { TopNav } from './TopNav'

const HIDE_BOTTOM_ON = ['/login', '/register']

export function AppShell() {
  const loc = useLocation()
  const hideBottom = HIDE_BOTTOM_ON.some((p) => loc.pathname.startsWith(p))

  return (
    <div className="min-h-dvh bg-surface-1">
      <TopNav />
      <main className="mx-auto max-w-md px-4 pt-4 pb-24">
        <Outlet />
      </main>
      {hideBottom ? null : <BottomNav />}
    </div>
  )
}

