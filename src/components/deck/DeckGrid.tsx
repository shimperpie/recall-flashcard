import type { Deck } from '../../db/mod'
import { DeckCard } from './DeckCard'

interface DeckGridProps {
  decks: Deck[]
  loading: boolean
}

export function DeckGrid({ decks, loading }: DeckGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-xl border border-zinc-200 animate-pulse">
            <div className="h-5 bg-zinc-100 rounded w-3/4 mb-3" />
            <div className="h-3 bg-zinc-50 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {decks.map((deck) => (
        <DeckCard key={deck.id} deck={deck} />
      ))}
    </div>
  )
}
