import { useEffect } from 'react'
import { StudyCard } from './StudyCard'
import { StudyProgress } from './StudyProgress'
import { useStudy, type Score } from '../../hooks/useStudy'

interface StudySessionProps {
  deckId: string
  onDone: () => void
}

const ratingButtons: { score: Score; label: string; key: string; color: string }[] = [
  { score: 0, label: 'Forgot', key: '1', color: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-900' },
  { score: 1, label: 'Hard', key: '2', color: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900' },
  { score: 2, label: 'Good', key: '3', color: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900' },
  { score: 3, label: 'Easy', key: '4', color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900' },
]

export function StudySession({ deckId, onDone }: StudySessionProps) {
  const {
    card,
    currentIndex,
    totalCards,
    isFlipped,
    sessionDone,
    stats,
    startSession,
    flip,
    rate,
    goBack,
    goForward,
  } = useStudy(deckId)

  useEffect(() => {
    startSession()
  }, [startSession])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goForward()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goBack()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goForward, goBack])

  if (sessionDone) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4 dark:bg-emerald-950">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-zinc-900 mb-1 dark:text-zinc-100">Session complete!</h2>
        <p className="text-sm text-zinc-400 mb-6">
          You reviewed {stats.reviewed} card{stats.reviewed !== 1 ? 's' : ''}.
        </p>
        <button
          onClick={onDone}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          Back to deck
        </button>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <p className="text-sm text-zinc-400 mb-4">No cards due for review today.</p>
        <button
          onClick={onDone}
          className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer dark:text-indigo-400 dark:hover:bg-indigo-950"
        >
          Back to deck
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 h-full py-8 px-4">
      <StudyProgress
        currentIndex={currentIndex}
        totalCards={totalCards}
        reviewed={stats.reviewed}
        remaining={stats.remaining}
      />

      <div className="flex-1 flex items-center justify-center w-full">
        <StudyCard card={card} isFlipped={isFlipped} onFlip={flip} />
      </div>

      {isFlipped && (
        <div className="flex gap-3 animate-in fade-in">
          {ratingButtons.map((btn) => (
            <button
              key={btn.score}
              onClick={() => rate(btn.score)}
              className={`px-5 py-2.5 text-sm font-medium rounded-lg border cursor-pointer transition-colors ${btn.color}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-zinc-100 rounded text-[10px] font-mono dark:bg-zinc-800">←</kbd>
          Previous
        </span>
        <span className="flex items-center gap-1">
          Next
          <kbd className="px-1.5 py-0.5 bg-zinc-100 rounded text-[10px] font-mono dark:bg-zinc-800">→</kbd>
        </span>
      </div>
    </div>
  )
}
