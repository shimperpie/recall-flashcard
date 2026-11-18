import { Link } from 'react-router-dom'
import type { Deck } from '../../db/mod'

const phaseLabels: Record<string, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  learning: { label: 'Learning', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  review: { label: 'Review', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  mastered: { label: 'Mastered', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
}

export function DeckCard({ deck }: { deck: Deck }) {
  const dueCount = deck.newCount + deck.learningCount + deck.reviewCount

  return (
    <Link
      to={`/deck/${deck.id}`}
      className="block p-5 bg-white rounded-xl border border-zinc-200 hover:border-indigo-300 hover:shadow-md transition-all no-underline dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-indigo-700"
    >
      <h3 className="font-semibold text-zinc-900 mb-1 truncate dark:text-zinc-100">{deck.name}</h3>
      {deck.description && (
        <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{deck.description}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-zinc-400">{deck.cardCount} cards</span>
        {dueCount > 0 && (
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full dark:text-indigo-400 dark:bg-indigo-950">
            {dueCount} due
          </span>
        )}
        {Object.entries(phaseLabels).map(([phase, { label, color }]) => {
          const count = deck[`${phase}Count` as keyof Deck] as number
          if (count === 0) return null
          return (
            <span key={phase} className={`text-[11px] px-1.5 py-0.5 rounded ${color}`}>
              {count} {label}
            </span>
          )
        })}
      </div>
    </Link>
  )
}
