import { useState, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { DeckForm } from './components/deck/DeckForm'
import { useDecks } from './hooks/useDecks'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const DeckDetail = lazy(() => import('./pages/DeckDetail'))
const Study = lazy(() => import('./pages/Study'))
const Settings = lazy(() => import('./pages/Settings'))

function AppLayout() {
  const { decks, loading, add } = useDecks()
  const [showNewDeck, setShowNewDeck] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        decks={decks}
        loading={loading}
        onNewDeck={() => setShowNewDeck(true)}
      />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<div className="h-8 w-32 bg-zinc-100 rounded animate-pulse" />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/deck/:id" element={<DeckDetail />} />
              <Route path="/deck/:id/study" element={<Study />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </div>
      </main>
      <DeckForm
        open={showNewDeck}
        onClose={() => setShowNewDeck(false)}
        onSubmit={(name, desc) => add(name, desc)}
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
