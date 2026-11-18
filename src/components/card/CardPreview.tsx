import { useMemo } from 'react'
import DOMPurify from 'dompurify'

interface CardPreviewProps {
  html: string
}

export function CardPreview({ html }: CardPreviewProps) {
  // Imported backups can contain rendered HTML from outside this app.
  const safeHtml = useMemo(
    () => (typeof html === 'string' ? DOMPurify.sanitize(html) : ''),
    [html],
  )

  return (
    <div
      className="prose prose-sm max-w-none text-sm leading-relaxed dark:text-zinc-200"
      dangerouslySetInnerHTML={{ __html: safeHtml || '<span class="text-zinc-300 italic">Empty</span>' }}
    />
  )
}

