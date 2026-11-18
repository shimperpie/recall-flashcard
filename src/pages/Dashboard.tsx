import { useState } from 'react'
import { useDecks } from '../hooks/useDecks'
import { DeckGrid } from '../components/deck/DeckGrid'
import { DeckForm } from '../components/deck/DeckForm'
import { EmptyState } from '../components/shared/EmptyState'

export default function Dashboard() {
  const { decks, loading, add } = useDecks()
  const [showForm, setShowForm] = useState(false)

  const dueToday = decks.reduce((sum, d) =>
    sum + d.newCount + d.learningCount + d.reviewCount, 0
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Decks</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {dueToday > 0 ? `${dueToday} card${dueToday > 1 ? 's' : ''} due today` : 'All caught up'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          New Deck
        </button>
      </div>

      {!loading && decks.length === 0 ? (
        <EmptyState
          title="No decks yet"
          description="Create your first deck to start studying with spaced repetition."
          action={{ label: 'Create Deck', onClick: () => setShowForm(true) }}
        />
      ) : (
        <DeckGrid decks={decks} loading={loading} />
      )}

      <DeckForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={(name, desc) => add(name, desc)}
      />
    </div>
  )
}
