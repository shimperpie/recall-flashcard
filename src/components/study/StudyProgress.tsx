interface StudyProgressProps {
  currentIndex: number
  totalCards: number
  reviewed: number
  remaining: number
}

export function StudyProgress({ currentIndex, totalCards, reviewed, remaining }: StudyProgressProps) {
  const pct = totalCards > 0 ? Math.round((reviewed / totalCards) * 100) : 0

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2 text-xs text-zinc-400">
        <span>
          Card {totalCards > 0 ? currentIndex + 1 : 0} of {totalCards}
        </span>
        <span>{remaining} remaining</span>
      </div>
      <div className="h-1 bg-zinc-100 rounded-full overflow-hidden dark:bg-zinc-800">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
