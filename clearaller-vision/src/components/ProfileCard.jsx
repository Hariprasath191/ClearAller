import { CheckCircle2, User } from 'lucide-react'
import { cn } from '../utils/cn'
import { Card } from './Card'

export function ProfileCard({ profile, selected, onSelect, className }) {
  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition active:scale-[0.99] hover:shadow-lift',
        selected ? 'ring-2 ring-ring/50' : '',
        className,
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-500/15 to-ocean-500/15 grid place-items-center">
            <User className="h-5 w-5 text-ink-1" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{profile.name}</div>
            <div className="text-xs text-ink-2 truncate">
              {profile.allergies?.length ? `${profile.allergies.length} allergen(s)` : 'No allergens yet'}
            </div>
          </div>
        </div>
        {selected ? <CheckCircle2 className="h-5 w-5 text-brand-600 dark:text-ocean-300" /> : null}
      </div>

      {profile.allergies?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.allergies.slice(0, 4).map((a) => (
            <span
              key={a}
              className="text-[11px] px-2 py-1 rounded-full bg-surface-1 border border-black/5 dark:border-white/10 text-ink-2"
            >
              {a}
            </span>
          ))}
          {profile.allergies.length > 4 ? (
            <span className="text-[11px] px-2 py-1 rounded-full bg-surface-1 border border-black/5 dark:border-white/10 text-ink-2">
              +{profile.allergies.length - 4}
            </span>
          ) : null}
        </div>
      ) : null}
    </Card>
  )
}

