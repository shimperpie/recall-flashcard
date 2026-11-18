import { CardPreview } from '../card/CardPreview'
import type { Card } from '../../db/mod'

interface StudyCardProps {
  card: Card
  isFlipped: boolean
  onFlip: () => void
}

export function StudyCard({ card, isFlipped, onFlip }: StudyCardProps) {
  return (
    <div
      onClick={() => !isFlipped && onFlip()}
      className="relative w-full max-w-2xl mx-auto cursor-pointer"
      style={{ perspective: '1000px', minHeight: '280px' }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
          minHeight: '280px',
        }}
      >
        {/* Front */}
        <div
          className="card-face absolute inset-0 bg-white rounded-2xl border border-zinc-200 p-8 flex flex-col items-center justify-center text-center shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {card.starred && (
            <span className="absolute top-4 right-4 text-amber-400 text-sm">★</span>
          )}
          <div className="max-w-full overflow-auto">
            <div className="text-lg leading-relaxed dark:text-zinc-100">
              <CardPreview html={card.frontHtml} />
            </div>
          </div>
          {!isFlipped && (
            <p className="absolute bottom-4 text-xs text-zinc-400">
              Click or press → to reveal answer
            </p>
          )}
        </div>

        {/* Back */}
        <div
          className="card-face card-back absolute inset-0 bg-white rounded-2xl border border-zinc-200 p-8 flex flex-col items-center justify-center text-center shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
        >
          <div className="max-w-full overflow-auto">
            <div className="text-lg leading-relaxed dark:text-zinc-100">
              <CardPreview html={card.backHtml} />
            </div>
          </div>
          <p className="absolute bottom-4 text-xs text-zinc-400">
            Rate your recall below
          </p>
        </div>
      </div>
    </div>
  )
}
