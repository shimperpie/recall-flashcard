interface EmptyStateProps {
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4 dark:bg-zinc-800">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-zinc-700 mb-1 dark:text-zinc-300">{title}</h3>
      <p className="text-xs text-zinc-400 max-w-xs mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
