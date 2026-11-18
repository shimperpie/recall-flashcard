import { useState, useEffect } from 'react'
import { Modal } from '../shared/Modal'

interface DeckFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (name: string, description: string) => void
  initialName?: string
  initialDescription?: string
  allowDelete?: boolean
  onDelete?: () => void
}

export function DeckForm({
  open,
  onClose,
  onSubmit,
  initialName = '',
  initialDescription = '',
  allowDelete = false,
  onDelete,
}: DeckFormProps) {
  const [name, setName] = useState(initialName)
  const [desc, setDesc] = useState(initialDescription)

  // Sync state when props change (e.g. deck data loads after initial render)
  useEffect(() => {
    if (open) {
      setName(initialName)
      setDesc(initialDescription)
    }
  }, [open, initialName, initialDescription])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit(name.trim(), desc.trim())
    setName('')
    setDesc('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={initialName ? 'Edit Deck' : 'New Deck'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. MGT100 — Organizational Culture"
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
            autoFocus
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">Description (optional)</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Brief description of this deck..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          {allowDelete && onDelete ? (
            <button
              type="button"
              onClick={() => { if (window.confirm('Delete this deck and all its cards?')) { onDelete(); onClose() } }}
              className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer dark:hover:bg-red-950"
            >
              Delete deck
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
