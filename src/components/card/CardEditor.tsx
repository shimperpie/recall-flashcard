import { useState, useCallback } from 'react'
import { CardPreview } from './CardPreview'
import { renderMarkdown } from '../../lib/markdown'

interface CardEditorProps {
  initialFront?: string
  initialBack?: string
  onSave: (front: string, back: string) => void
  onCancel: () => void
}

export function CardEditor({
  initialFront = '',
  initialBack = '',
  onSave,
  onCancel,
}: CardEditorProps) {
  const [front, setFront] = useState(initialFront)
  const [back, setBack] = useState(initialBack)
  const [showPreview, setShowPreview] = useState(false)

  const frontHtml = useCallback(() => renderMarkdown(front), [front])
  const backHtml = useCallback(() => renderMarkdown(back), [back])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!front.trim() && !back.trim()) return
    onSave(front.trim(), back.trim())
  }

  const insertMarkdown = (setter: typeof setFront, syntax: string, placeholder: string) => {
    setter((prev) => prev + syntax.replace('$1', placeholder))
  }

  const ToolbarButton = ({ label, title, onClick }: { label: string; title: string; onClick: () => void }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="px-1.5 py-0.5 text-xs text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors cursor-pointer font-mono dark:hover:text-zinc-300 dark:hover:bg-zinc-800"
    >
      {label}
    </button>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Front side */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-zinc-500">Front</label>
            <div className="flex gap-0.5">
              <ToolbarButton label="B" title="Bold" onClick={() => insertMarkdown(setFront, '**$1**', 'bold text')} />
              <ToolbarButton label="I" title="Italic" onClick={() => insertMarkdown(setFront, '*$1*', 'italic text')} />
              <ToolbarButton label="`" title="Inline code" onClick={() => insertMarkdown(setFront, '`$1`', 'code')} />
              <ToolbarButton label="$$" title="LaTeX inline" onClick={() => insertMarkdown(setFront, '$$1$', 'x^2')} />
              <ToolbarButton label="∑" title="LaTeX block" onClick={() => insertMarkdown(setFront, '$$\n$1\n$$', '\\sum_{i=1}^n')} />
              <ToolbarButton label="</>" title="Code block" onClick={() => insertMarkdown(setFront, '```python\n$1\n```', 'print("hello")')} />
            </div>
          </div>
          <textarea
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Front of card (Markdown, LaTeX supported)..."
            rows={6}
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-mono dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
          />
          {showPreview && (
            <div className="mt-2 p-3 bg-zinc-50 rounded-lg border border-zinc-100 dark:bg-zinc-800/50 dark:border-zinc-700">
              <CardPreview html={frontHtml()} />
            </div>
          )}
        </div>

        {/* Back side */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-zinc-500">Back</label>
            <div className="flex gap-0.5">
              <ToolbarButton label="B" title="Bold" onClick={() => insertMarkdown(setBack, '**$1**', 'bold text')} />
              <ToolbarButton label="I" title="Italic" onClick={() => insertMarkdown(setBack, '*$1*', 'italic text')} />
              <ToolbarButton label="`" title="Inline code" onClick={() => insertMarkdown(setBack, '`$1`', 'code')} />
              <ToolbarButton label="$$" title="LaTeX inline" onClick={() => insertMarkdown(setBack, '$$1$', 'x^2')} />
              <ToolbarButton label="∑" title="LaTeX block" onClick={() => insertMarkdown(setBack, '$$\n$1\n$$', '\\sum_{i=1}^n')} />
              <ToolbarButton label="</>" title="Code block" onClick={() => insertMarkdown(setBack, '```python\n$1\n```', 'print("hello")')} />
            </div>
          </div>
          <textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Back of card (answer)..."
            rows={6}
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-mono dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
          />
          {showPreview && (
            <div className="mt-2 p-3 bg-zinc-50 rounded-lg border border-zinc-100 dark:bg-zinc-800/50 dark:border-zinc-700">
              <CardPreview html={backHtml()} />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer dark:hover:text-zinc-300"
        >
          {showPreview ? 'Hide preview' : 'Show preview'}
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer font-medium"
          >
            Save Card
          </button>
        </div>
      </div>
    </form>
  )
}
