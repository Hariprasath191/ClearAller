import { ChevronRight } from 'lucide-react'
import { Card } from './Card'
import { RiskBadge } from './RiskBadge'
import { cn } from '../utils/cn'

export function SearchResultCard({ result, onClick, className }) {
  return (
    <Card
      className={cn('p-4 cursor-pointer transition active:scale-[0.99] hover:shadow-lift', className)}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{result.name}</div>
          <div className="mt-1 text-xs text-ink-2">
            <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
              {result.ingredients_preview}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <RiskBadge risk={result.risk} />
            <span className="text-xs font-semibold text-ink-2">Score: {result.score}</span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-ink-2 mt-1" />
      </div>
    </Card>
  )
}

