import { useState, useCallback, useMemo } from 'react'
import { db, type Card } from '../db/mod'
import { sm2, type Score } from '../lib/sm2'
export type { Score }

export interface StudyState {
  currentIndex: number
  cards: Card[]
  isFlipped: boolean
  sessionDone: boolean
  stats: { reviewed: number; remaining: number }
}

export function useStudy(deckId: string | undefined) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionDone, setSessionDone] = useState(false)
  const [sessionCards, setSessionCards] = useState<Card[]>([])

  const startSession = useCallback(async () => {
    if (!deckId) return
    const now = Date.now()
    // Get cards due for review: phase !== 'mastered' and nextReview <= now
    const all = await db.cards
      .where('deckId').equals(deckId)
      .toArray()

    const due = all.filter((c) => {
      if (c.phase === 'mastered') return c.nextReview <= now
      return true // Include all non-mastered cards
    })

    // Sort: new cards first, then by nextReview date
    due.sort((a, b) => {
      if (a.phase === 'new' && b.phase !== 'new') return -1
      if (b.phase === 'new' && a.phase !== 'new') return 1
      return a.nextReview - b.nextReview
    })

    setSessionCards(due)
    setCurrentIndex(0)
    setIsFlipped(false)
    setSessionDone(due.length === 0)
  }, [deckId])

  const card = sessionCards[currentIndex] ?? null

  const stats = useMemo(() => ({
    reviewed: currentIndex,
    remaining: sessionCards.length - currentIndex,
  }), [currentIndex, sessionCards.length])

  const flip = useCallback(() => setIsFlipped(true), [])

  const rate = useCallback(async (score: Score) => {
    const c = sessionCards[currentIndex]
    if (!c) return

    const result = sm2(c.ease, c.interval, c.repetitions, score)
    await db.cards.update(c.id, {
      ...result,
      lastReview: Date.now(),
      updatedAt: Date.now(),
    })

    setIsFlipped(false)
    if (currentIndex + 1 >= sessionCards.length) {
      setSessionDone(true)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, sessionCards])

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setCurrentIndex((i) => i - 1)
    }
  }, [currentIndex])

  const goForward = useCallback(() => {
    if (!isFlipped) {
      flip()
    } else {
      rate(2) // Default "good" when using arrow key
    }
  }, [isFlipped, flip, rate])

  return {
    card,
    currentIndex,
    totalCards: sessionCards.length,
    isFlipped,
    sessionDone,
    stats,
    startSession,
    flip,
    rate,
    goBack,
    goForward,
  }
}
