import { useState, useEffect, useCallback } from 'react'
import { db, createCard, recalcDeckCounts, type Card } from '../db/mod'
import { renderMarkdown } from '../lib/markdown'

export function useCards(deckId: string | undefined) {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!deckId) { setCards([]); setLoading(false); return }
    const all = await db.cards
      .where('deckId').equals(deckId)
      .sortBy('createdAt')
    setCards(all)
    setLoading(false)
  }, [deckId])

  useEffect(() => { refresh() }, [refresh])

  const add = useCallback(async (front = '', back = '') => {
    if (!deckId) return null
    const frontHtml = front ? renderMarkdown(front) : ''
    const backHtml = back ? renderMarkdown(back) : ''
    const card = createCard(deckId, front, back)
    card.frontHtml = frontHtml
    card.backHtml = backHtml
    await db.cards.add(card)
    await recalcDeckCounts(deckId)
    await refresh()
    return card
  }, [deckId, refresh])

  const update = useCallback(async (id: string, data: Partial<Card>) => {
    const updates: Partial<Card> = { ...data, updatedAt: Date.now() }
    // Re-render HTML if front/back changed
    if (data.front !== undefined) {
      updates.frontHtml = renderMarkdown(data.front)
    }
    if (data.back !== undefined) {
      updates.backHtml = renderMarkdown(data.back)
    }
    await db.cards.update(id, updates)
    await refresh()
  }, [refresh])

  const remove = useCallback(async (id: string) => {
    const card = await db.cards.get(id)
    await db.cards.delete(id)
    if (card) await recalcDeckCounts(card.deckId)
    await refresh()
  }, [refresh])

  const toggleStar = useCallback(async (id: string) => {
    const card = await db.cards.get(id)
    if (!card) return
    await db.cards.update(id, { starred: !card.starred, updatedAt: Date.now() })
    await refresh()
  }, [refresh])

  return { cards, loading, refresh, add, update, remove, toggleStar }
}
