import { AlertTriangle, CheckCircle2, ChevronRight, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { RiskBadge } from '../components/RiskBadge'
import { useProfiles } from '../context/ProfileContext'

function norm(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
}

function tone(risk) {
  if (risk === 'High') return { icon: ShieldAlert, cls: 'text-red-600 dark:text-red-300' }
  if (risk === 'Moderate') return { icon: AlertTriangle, cls: 'text-amber-700 dark:text-amber-300' }
  return { icon: ShieldCheck, cls: 'text-emerald-700 dark:text-emerald-300' }
}

export default function Result() {
  const loc = useLocation()
  const nav = useNavigate()
  const { selected } = useProfiles()

  const analysis = useMemo(() => {
    const a = loc.state?.analysis
    if (a) return a
    try {
      const raw = localStorage.getItem('cv_last_analysis')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [loc.state])

  useEffect(() => {
    if (analysis) localStorage.setItem('cv_last_analysis', JSON.stringify(analysis))
  }, [analysis])

  const risk = analysis?.risk_level || analysis?.risk || 'Safe'
  const meta = tone(risk)
  const Icon = meta.icon

  const allergies = (selected?.allergies || []).map(norm).filter(Boolean)
  const detected = (analysis?.detected_allergens || []).map(norm)

  const ingredients = analysis?.ingredients || []

  function isAllergenIngredient(ing) {
    const t = norm(ing)
    return allergies.some((a) => a && t.includes(a))
  }

  if (!analysis) {
    return (
      <Card className="p-5">
        <div className="text-sm font-semibold">No analysis found</div>
        <div className="mt-1 text-xs text-ink-2">Scan or search a product to see results.</div>
        <div className="mt-4 flex gap-2">
          <Button className="flex-1" onClick={() => nav('/scan')}>
            Scan
          </Button>
          <Button variant="secondary" className="flex-1" onClick={() => nav('/search')}>
            Search
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-ink-2">Product</div>
            <div className="mt-1 text-lg font-bold tracking-tight truncate">{analysis.product?.name}</div>
            <div className="mt-3 flex items-center gap-2">
              <RiskBadge risk={risk} />
              <span className="text-xs font-semibold text-ink-2">Risk score: {analysis.risk_score}</span>
              <span className="text-xs font-semibold text-ink-2">Confidence: {analysis.confidence}%</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-3xl bg-gradient-to-br from-brand-500/15 to-ocean-500/15 grid place-items-center">
            <Icon className={['h-6 w-6', meta.cls].join(' ')} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-surface-1 border border-black/5 dark:border-white/10 p-4">
            <div className="text-xs font-semibold text-ink-2">Detected allergens</div>
            <div className="mt-2 text-sm font-semibold">
              {detected.length ? (
                <div className="flex flex-wrap gap-2">
                  {detected.map((a) => (
                    <span
                      key={a}
                      className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20 text-xs"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> None matched
                </span>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-surface-1 border border-black/5 dark:border-white/10 p-4">
            <div className="text-xs font-semibold text-ink-2">Profile used</div>
            <div className="mt-2 text-sm font-semibold">{selected?.name || '—'}</div>
            <div className="mt-1 text-xs text-ink-2">
              {allergies.length ? allergies.join(', ') : 'No allergies saved'}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-600 dark:text-ocean-300" />
          Ingredients (highlighted)
        </div>
        <div className="mt-1 text-xs text-ink-2">
          Allergens are highlighted in red; other ingredients shown as safe/neutral.
        </div>

        <div className="mt-4 space-y-2">
          {ingredients.map((ing, idx) => {
            const allergen = isAllergenIngredient(ing)
            return (
              <div
                key={`${ing}-${idx}`}
                className={[
                  'rounded-2xl px-3 py-2 text-sm border',
                  allergen
                    ? 'bg-red-500/10 border-red-500/20 text-red-800 dark:text-red-200'
                    : 'bg-emerald-500/10 border-emerald-500/15 text-emerald-800 dark:text-emerald-200',
                ].join(' ')}
              >
                {ing}
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-5">
        <div className="text-sm font-semibold">Suggestions</div>
        <div className="mt-3 space-y-2">
          {(analysis.suggestions || []).map((s, i) => (
            <div
              key={i}
              className="rounded-2xl bg-surface-1 border border-black/5 dark:border-white/10 px-3 py-2 text-sm text-ink-1"
            >
              {s}
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            className="w-full"
            onClick={() =>
              nav('/chat', {
                state: {
                  seed: `Is ${analysis.product?.name} safe for ${selected?.name || 'me'}?`,
                },
              })
            }
          >
            Ask AllerGuard
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => nav('/search')}>
            Search more
          </Button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Similar safer products</div>
          <div className="text-xs text-ink-2">Top 3</div>
        </div>

        <div className="mt-4 space-y-3">
          {(analysis.similar_safer_products || []).slice(0, 3).map((p) => (
            <button
              key={p.id || p.name}
              onClick={() =>
                nav('/loading', {
                  state: { job: { source: 'similar', product: { id: p.id, name: p.name }, allergies } },
                })
              }
              className="w-full text-left rounded-3xl bg-surface-1 border border-black/5 dark:border-white/10 p-4 hover:bg-surface-2 transition active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{p.name}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <RiskBadge risk={p.risk} />
                    <span className="text-xs font-semibold text-ink-2">Score: {p.score}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-ink-2 mt-1" />
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

