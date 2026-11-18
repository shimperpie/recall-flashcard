import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDeck, useDecks } from '../hooks/useDecks'
import { useCards } from '../hooks/useCards'
import { CardList } from '../components/card/CardList'
import { CardEditor } from '../components/card/CardEditor'
import { DeckForm } from '../components/deck/DeckForm'
import { EmptyState } from '../components/shared/EmptyState'
import type { Card } from '../db/mod'

export default function DeckDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { deck, loading: deckLoading, update: updateDeck } = useDeck(id)
  const { cards, loading: cardsLoading, add, update, remove, toggleStar } = useCards(id)
  const { remove: removeDeck } = useDecks()
  const [showEditor, setShowEditor] = useState(false)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [showDeckForm, setShowDeckForm] = useState(false)
  const [search, setSearch] = useState('')

  if (!id) return null

  const filteredCards = search.trim()
    ? cards.filter((c) =>
        c.front.toLowerCase().includes(search.toLowerCase()) ||
        c.back.toLowerCase().includes(search.toLowerCase())
      )
    : cards

  const handleSave = async (front: string, back: string) => {
    if (editingCard) {
      await update(editingCard.id, { front, back })
      setEditingCard(null)
    } else {
      await add(front, back)
    }
    setShowEditor(false)
  }

  const loading = deckLoading || cardsLoading

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          {loading ? (
            <div className="h-7 w-48 bg-zinc-100 rounded animate-pulse" />
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {deck?.name || 'Deck not found'}
              </h1>
              {deck && (
                <button
                  onClick={() => setShowDeckForm(true)}
                  className="text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer dark:text-zinc-600 dark:hover:text-zinc-400"
                  title="Edit deck"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11.25 1.25l2.5 2.5-9.375 9.375L1.25 14.75l1.625-3.125z" />
                    <path d="M9.625 2.875l2.5 2.5" />
                  </svg>
                </button>
              )}
            </div>
          )}
          {deck && (
            <p className="text-sm text-zinc-400 mt-1">
              {deck.description || <span className="italic text-zinc-300">No description</span>}
            </p>
          )}
          {deck && (
            <p className="text-xs text-zinc-400 mt-0.5">
              {deck.cardCount} card{deck.cardCount !== 1 ? 's' : ''}
              {deck.masteredCount > 0 && ` · ${deck.masteredCount} mastered`}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/deck/${id}/study`)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
            disabled={loading || (deck?.cardCount ?? 0) === 0}
          >
            Study
          </button>
          <button
            onClick={() => { setEditingCard(null); setShowEditor(true) }}
            className="px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            Add Card
          </button>
        </div>
      </div>

      {/* Search */}
      {cards.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards..."
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
          />
        </div>
      )}

      {/* Card list */}
      {!loading && cards.length === 0 && !showEditor ? (
        <EmptyState
          title="No cards yet"
          description="Add your first card to this deck."
          action={{ label: 'Add Card', onClick: () => setShowEditor(true) }}
        />
      ) : (
        <CardList
          cards={filteredCards}
          onEdit={(card) => { setEditingCard(card); setShowEditor(true) }}
          onDelete={remove}
          onToggleStar={toggleStar}
        />
      )}

      {/* Card editor */}
      {showEditor && (
        <div className="mt-6 p-6 bg-white rounded-xl border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-700 mb-4 dark:text-zinc-300">
            {editingCard ? 'Edit Card' : 'New Card'}
          </h3>
          <CardEditor
            initialFront={editingCard?.front || ''}
            initialBack={editingCard?.back || ''}
            onSave={handleSave}
            onCancel={() => { setShowEditor(false); setEditingCard(null) }}
          />
        </div>
      )}

      {/* Deck edit modal */}
      <DeckForm
        open={showDeckForm}
        onClose={() => setShowDeckForm(false)}
        onSubmit={(name, description) => {
          updateDeck({ name, description })
          setShowDeckForm(false)
        }}
        initialName={deck?.name || ''}
        initialDescription={deck?.description || ''}
        allowDelete
        onDelete={async () => {
          await removeDeck(id)
          navigate('/')
        }}
      />
    </div>
  )
}
