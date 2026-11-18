import type { Card } from '../../db/mod'
import { CardPreview } from './CardPreview'

interface CardListProps {
  cards: Card[]
  onEdit: (card: Card) => void
  onDelete: (id: string) => void
  onToggleStar: (id: string) => void
}

export function CardList({ cards, onEdit, onDelete, onToggleStar }: CardListProps) {
  if (cards.length === 0) return null

  const phaseLabel = (phase: string) => {
    const map: Record<string, string> = {
      new: 'New',
      learning: 'Learning',
      review: 'Review',
      mastered: 'Mastered',
    }
    return map[phase] || phase
  }

  const phaseColor = (phase: string) => {
    const map: Record<string, string> = {
      new: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
      learning: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
      review: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
      mastered: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    }
    return map[phase] || ''
  }

  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <div
          key={card.id}
          className="p-4 bg-white rounded-xl border border-zinc-200 group hover:border-zinc-300 transition-colors dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700"
        >
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Front</p>
              <CardPreview html={card.frontHtml} />
            </div>
            <div className="min-w-0 border-l border-zinc-100 pl-4 dark:border-zinc-800">
              <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Back</p>
              <CardPreview html={card.backHtml} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${phaseColor(card.phase)}`}>
              {phaseLabel(card.phase)}
            </span>
            {card.interval > 0 && (
              <span className="text-[10px] text-zinc-400">
                Next: {new Date(card.nextReview).toLocaleDateString()}
              </span>
            )}
            <div className="flex-1" />
            <button
              onClick={() => onToggleStar(card.id)}
              className={`text-sm cursor-pointer transition-colors ${
                card.starred ? 'text-amber-400' : 'text-zinc-300 hover:text-amber-400'
              }`}
              title={card.starred ? 'Unstar' : 'Star'}
            >
              {card.starred ? '★' : '☆'}
            </button>
            <button
              onClick={() => onEdit(card)}
              className="text-xs text-zinc-400 hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-all cursor-pointer dark:hover:text-zinc-300"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(card.id)}
              className="text-xs text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
