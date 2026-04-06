import { Bot, ImageUp, ScanLine, Search, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ProfileCard } from '../components/ProfileCard'
import { useAuth } from '../context/AuthContext'
import { useProfiles } from '../context/ProfileContext'

export default function Dashboard() {
  const { user } = useAuth()
  const { profiles, selectedId, setSelectedId, loading, error, refresh } = useProfiles()
  const nav = useNavigate()

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-ink-2">Welcome</div>
            <div className="text-xl font-bold tracking-tight">
              {user?.email ? user.email.split('@')[0] : 'there'}
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={refresh} disabled={loading}>
            {loading ? 'Loading…' : 'Refresh'}
          </Button>
        </div>
      </motion.div>

      <Card className="p-5 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600 dark:text-ocean-300" />
              Profiles
            </div>
            <div className="text-xs text-ink-2 mt-1">Select who you’re checking safety for.</div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => nav('/profile')}>
            Manage
          </Button>
        </div>

        {error ? (
          <div className="mt-4 text-sm text-red-600 dark:text-red-300">{error}</div>
        ) : null}

        <div className="mt-4 grid gap-3">
          {profiles.map((p) => (
            <ProfileCard
              key={p.id}
              profile={p}
              selected={p.id === selectedId}
              onSelect={() => setSelectedId(p.id)}
            />
          ))}
          {!profiles.length && !loading ? (
            <div className="text-sm text-ink-2">No profiles yet. Create one in Profiles.</div>
          ) : null}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="primary" className="justify-start" onClick={() => nav('/scan')}>
          <ScanLine className="h-5 w-5" />
          Scan product
        </Button>
        <Button variant="secondary" className="justify-start" onClick={() => nav('/scan?mode=image')}>
          <ImageUp className="h-5 w-5" />
          Upload image
        </Button>
        <Button variant="secondary" className="justify-start" onClick={() => nav('/search')}>
          <Search className="h-5 w-5" />
          Search product
        </Button>
        <Button variant="secondary" className="justify-start" onClick={() => nav('/chat')}>
          <Bot className="h-5 w-5" />
          Open chatbot
        </Button>
      </div>
    </div>
  )
}

