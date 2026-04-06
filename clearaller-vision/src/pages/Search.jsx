import { Search as SearchIcon, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { SearchResultCard } from '../components/SearchResultCard'
import { useProfiles } from '../context/ProfileContext'
import { searchProducts } from '../services/api'

export default function Search() {
  const nav = useNavigate()
  const { selected } = useProfiles()
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const helper = useMemo(() => {
    if (!selected) return 'Select a profile to personalize safety.'
    if (!selected.allergies?.length) return 'Tip: add allergies in Profiles for better detection.'
    return `Using ${selected.name} allergies: ${selected.allergies.join(', ')}`
  }, [selected])

  useEffect(() => {
    if (!q.trim()) {
      setResults([])
      return
    }
    let alive = true
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const data = await searchProducts(q)
        if (!alive) return
        setResults(data.results || [])
      } catch (e) {
        if (!alive) return
        toast.error(e?.response?.data?.message || 'Search failed.')
      } finally {
        if (alive) setLoading(false)
      }
    }, 320)

    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [q])

  function openResult(r) {
    nav('/loading', {
      state: { job: { source: 'search', product: { id: r.id, name: r.name }, allergies: selected?.allergies || [] } },
    })
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600 dark:text-ocean-300" />
              Smart product search
            </div>
            <div className="mt-1 text-xs text-ink-2">{helper}</div>
          </div>
        </div>

        <div className="mt-4">
          <Input
            startIcon={SearchIcon}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products (e.g., chocolate, protein bar)"
            autoFocus
          />
        </div>

        <div className="mt-3 text-xs text-ink-2">
          Returns <span className="font-semibold text-ink-1">top 3 matches</span> with ML-like scoring.
        </div>
      </Card>

      {loading ? (
        <Card className="p-5">
          <div className="h-12 rounded-2xl bg-gradient-to-r from-surface-2 via-surface-3 to-surface-2 bg-[length:200%_100%] animate-shimmer" />
          <div className="mt-3 h-12 rounded-2xl bg-gradient-to-r from-surface-2 via-surface-3 to-surface-2 bg-[length:200%_100%] animate-shimmer" />
          <div className="mt-3 h-12 rounded-2xl bg-gradient-to-r from-surface-2 via-surface-3 to-surface-2 bg-[length:200%_100%] animate-shimmer" />
        </Card>
      ) : null}

      {!loading && q.trim() && !results.length ? (
        <Card className="p-5">
          <div className="text-sm font-semibold">No matches</div>
          <div className="mt-1 text-xs text-ink-2">Try different keywords (brand + product type).</div>
        </Card>
      ) : null}

      <div className="space-y-3">
        {results.map((r) => (
          <SearchResultCard key={r.id || r.name} result={r} onClick={() => openResult(r)} />
        ))}
      </div>

      <Button variant="secondary" className="w-full" onClick={() => setQ('')}>
        Clear search
      </Button>
    </div>
  )
}

