import { useState, useEffect, useCallback } from 'react'
import { db, createDeck, type Deck } from '../db/mod'

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const all = await db.decks.orderBy('updatedAt').reverse().toArray()
    setDecks(all)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const add = useCallback(async (name: string, description = '') => {
    const deck = createDeck(name, description)
    await db.decks.add(deck)
    await refresh()
    return deck
  }, [refresh])

  const update = useCallback(async (id: string, data: Partial<Deck>) => {
    await db.decks.update(id, { ...data, updatedAt: Date.now() })
    await refresh()
  }, [refresh])

  const remove = useCallback(async (id: string) => {
    await db.cards.where('deckId').equals(id).delete()
    await db.decks.delete(id)
    await refresh()
  }, [refresh])

  return { decks, loading, refresh, add, update, remove }
}

export function useDeck(id: string | undefined) {
  const [deck, setDeck] = useState<Deck | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!id) { setDeck(null); setLoading(false); return }
    const d = await db.decks.get(id)
    setDeck(d ?? null)
    setLoading(false)
  }, [id])

  useEffect(() => { refresh() }, [refresh])

  const update = useCallback(async (data: Partial<Deck>) => {
    if (!id) return
    await db.decks.update(id, { ...data, updatedAt: Date.now() })
    await refresh()
  }, [id, refresh])

  return { deck, loading, refresh, update }
}
