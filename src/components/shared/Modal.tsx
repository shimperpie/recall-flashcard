interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 dark:bg-zinc-900 dark:border dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 text-xl leading-none cursor-pointer transition-colors"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
