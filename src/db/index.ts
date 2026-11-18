import Dexie, { type EntityTable } from 'dexie'
import { nanoid } from 'nanoid'

export interface Deck {
  id: string
  name: string
  description: string
  cardCount: number
  newCount: number
  learningCount: number
  reviewCount: number
  masteredCount: number
  createdAt: number
  updatedAt: number
}

export type CardPhase = 'new' | 'learning' | 'review' | 'mastered'

export interface Card {
  id: string
  deckId: string
  front: string
  back: string
  frontHtml: string
  backHtml: string
  starred: boolean
  ease: number
  interval: number
  repetitions: number
  nextReview: number
  lastReview: number | null
  phase: CardPhase
  createdAt: number
  updatedAt: number
}

export const db = new Dexie('RecallDB') as Dexie & {
  decks: EntityTable<Deck, 'id'>
  cards: EntityTable<Card, 'id'>
}

db.version(1).stores({
  decks: 'id, name, updatedAt',
  cards: 'id, deckId, phase, nextReview, starred',
})

export function createDeck(name: string, description = ''): Deck {
  const now = Date.now()
  return {
    id: nanoid(),
    name,
    description,
    cardCount: 0,
    newCount: 0,
    learningCount: 0,
    reviewCount: 0,
    masteredCount: 0,
    createdAt: now,
    updatedAt: now,
  }
}

export function createCard(deckId: string, front = '', back = ''): Card {
  const now = Date.now()
  return {
    id: nanoid(),
    deckId,
    front,
    back,
    frontHtml: '',
    backHtml: '',
    starred: false,
    ease: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: now,
    lastReview: null,
    phase: 'new',
    createdAt: now,
    updatedAt: now,
  }
}

export async function recalcDeckCounts(deckId: string) {
  const cards = await db.cards.where('deckId').equals(deckId).toArray()
  const counts = { cardCount: 0, newCount: 0, learningCount: 0, reviewCount: 0, masteredCount: 0 }
  for (const c of cards) {
    counts.cardCount++
    counts[`${c.phase}Count` as keyof typeof counts]++
  }
  await db.decks.update(deckId, { ...counts, updatedAt: Date.now() })
}
