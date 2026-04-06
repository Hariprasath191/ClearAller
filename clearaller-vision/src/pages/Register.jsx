import { Mail, Lock, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await register({ name, email, password })
      toast.success('Account created!')
      nav('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-6 pb-10">
      <div className="text-center">
        <div className="text-2xl font-bold tracking-tight">Create account</div>
        <div className="mt-2 text-sm text-ink-2">Start building your safety profiles.</div>
      </div>

      <Card className="mt-6 p-5">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <div className="text-xs font-semibold text-ink-2 mb-2">Name (optional)</div>
            <Input
              startIcon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

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
              placeholder="Minimum 4 characters"
              type="password"
              autoComplete="new-password"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating…' : 'Register'}
          </Button>

          <div className="text-center text-sm text-ink-2">
            Already have an account?{' '}
            <Link className="font-semibold text-brand-700 dark:text-ocean-300" to="/login">
              Sign in
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

