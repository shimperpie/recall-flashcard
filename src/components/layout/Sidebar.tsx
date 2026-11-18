import { NavLink } from 'react-router-dom'
import type { Deck } from '../../db/mod'

interface SidebarProps {
  decks: Deck[]
  loading: boolean
  onNewDeck: () => void
}

export function Sidebar({ decks, loading, onNewDeck }: SidebarProps) {
  return (
    <aside className="w-60 h-screen flex flex-col border-r border-zinc-200 bg-white shrink-0 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="px-5 py-5">
        <NavLink to="/" className="text-lg font-semibold text-indigo-600 tracking-tight no-underline">
          Recall
        </NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Decks</span>
          <button
            onClick={onNewDeck}
            className="text-zinc-400 hover:text-indigo-600 transition-colors text-lg leading-none cursor-pointer"
            title="New deck"
          >
            +
          </button>
        </div>

        {loading ? (
          <div className="space-y-1 px-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-zinc-100 rounded-md animate-pulse dark:bg-zinc-800" />
            ))}
          </div>
        ) : decks.length === 0 ? (
          <p className="text-xs text-zinc-400 px-2 py-4 text-center">
            No decks yet. Create one to get started.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {decks.map((deck) => (
              <li key={deck.id}>
                <NavLink
                  to={`/deck/${deck.id}`}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-2 py-1.5 rounded-md text-sm no-underline transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-950 dark:text-indigo-300'
                        : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                    }`
                  }
                >
                  <span className="truncate flex-1">{deck.name}</span>
                  <span className="text-xs text-zinc-400 shrink-0">{deck.cardCount}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className="px-3 py-3 border-t border-zinc-200 dark:border-zinc-800">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-2 px-2 py-1.5 rounded-md text-sm no-underline transition-colors ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
            }`
          }
        >
          Settings
        </NavLink>
      </div>
    </aside>
  )
}
