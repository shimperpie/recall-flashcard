export type Score = 0 | 1 | 2 | 3

export interface SM2Result {
  ease: number
  interval: number
  repetitions: number
  nextReview: number
  phase: 'new' | 'learning' | 'review' | 'mastered'
}

/**
 * SM-2 spaced repetition algorithm.
 * Scores: 0 = forgot, 1 = hard, 2 = good, 3 = easy
 */
export function sm2(
  prevEase: number,
  prevInterval: number,
  prevRepetitions: number,
  score: Score
): SM2Result {
  let ease = prevEase
  let interval: number
  let repetitions: number

  if (score === 0) {
    // Forgot — reset
    repetitions = 0
    interval = 0
    ease = Math.max(1.3, ease - 0.2)
  } else {
    repetitions = prevRepetitions + 1

    if (repetitions === 1) {
      interval = 1
    } else if (repetitions === 2) {
      interval = 3
    } else {
      interval = Math.round(prevInterval * ease)
    }

    // Adjust ease based on score
    if (score === 1) {
      ease = Math.max(1.3, ease - 0.15)
    } else if (score === 3) {
      ease = Math.min(3.0, ease + 0.15)
    }
    // score 2: ease stays the same
  }

  const nextReview = Date.now() + interval * 86400000

  let phase: SM2Result['phase']
  if (interval >= 90) phase = 'mastered'
  else if (interval >= 21) phase = 'review'
  else if (interval >= 1) phase = 'learning'
  else phase = 'new'

  return { ease, interval, repetitions, nextReview, phase }
}

/**
 * Get cards due for review today for a given deck.
 */
export function getDueCards(
  cards: { nextReview: number; phase: string }[]
) {
  return cards.filter(
    (c) => c.phase !== 'mastered' || c.nextReview <= Date.now()
  )
}
