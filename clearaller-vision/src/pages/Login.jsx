import { Mail, Lock } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const from = useMemo(() => loc.state?.from || '/dashboard', [loc.state])

  const [email, setEmail] = useState('demo@clearaller.ai')
  const [password, setPassword] = useState('demo123')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email, password })
      toast.success('Welcome back!')
      nav(from, { replace: true })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-6 pb-10">
      <div className="text-center">
        <div className="text-2xl font-bold tracking-tight">Sign in</div>
        <div className="mt-2 text-sm text-ink-2">
          ClearAller Vision (AllerGuard) • premium allergen safety assistant
        </div>
      </div>

      <Card className="mt-6 p-5">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <div className="text-xs font-semibold text-ink-2 mb-2">Email</div>
            <Input
              startIcon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <div className="text-xs font-semibold text-ink-2 mb-2">Password</div>
            <Input
              startIcon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in…' : 'Login'}
          </Button>

          <div className="text-center text-sm text-ink-2">
            New here?{' '}
            <Link className="font-semibold text-brand-700 dark:text-ocean-300" to="/register">
              Create an account
            </Link>
          </div>
        </form>
      </Card>

      <div className="mt-6 text-center text-xs text-ink-2">
        Demo login is prefilled. You can also register a new account.
      </div>
    </div>
  )
}

