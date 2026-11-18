import { useParams, useNavigate } from 'react-router-dom'
import { StudySession } from '../components/study/StudySession'

export default function Study() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) return null

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4 px-4 pt-4">
        <button
          onClick={() => navigate(`/deck/${id}`)}
          className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer flex items-center gap-1 dark:hover:text-zinc-300"
        >
          ← Back
        </button>
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Study</span>
      </div>
      <StudySession deckId={id} onDone={() => navigate(`/deck/${id}`)} />
    </div>
  )
}
