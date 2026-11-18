import { useState, useRef } from 'react'
import { db, createDeck } from '../db/mod'
import { parseApkg } from '../lib/apkg-parser'

export default function Settings() {
  const [importing, setImporting] = useState(false)
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    const decks = await db.decks.toArray()
    const cards = await db.cards.toArray()
    const data = JSON.stringify({ decks, cards, exportedAt: new Date().toISOString() }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recall-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setMessage('')

    try {
      if (file.name.endsWith('.apkg')) {
        // Anki .apkg import
        const result = await parseApkg(file)
        const deck = createDeck(result.deckName)
        await db.decks.add(deck)

        const now = Date.now()
        await db.transaction('rw', db.cards, async () => {
          for (const card of result.cards) {
            await db.cards.add({
              ...card,
              id: crypto.randomUUID(),
              deckId: deck.id,
              createdAt: now,
              updatedAt: now,
            })
          }
        })

        // Update deck counts
        const allCards = await db.cards.where('deckId').equals(deck.id).toArray()
        await db.decks.update(deck.id, {
          cardCount: allCards.length,
          newCount: allCards.length,
          updatedAt: Date.now(),
        })

        setMessage(`Imported "${result.deckName}" with ${result.cards.length} cards.`)
      } else {
        // JSON backup import
        const text = await file.text()
        const data = JSON.parse(text)

        if (data.decks && data.cards) {
          await db.transaction('rw', db.decks, db.cards, async () => {
            for (const deck of data.decks) await db.decks.put(deck)
            for (const card of data.cards) await db.cards.put(card)
          })
          setMessage(`Imported ${data.decks.length} decks and ${data.cards.length} cards.`)
        } else {
          setMessage('Invalid backup file.')
        }
      }
    } catch (err) {
      setMessage(`Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }

    setImporting(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleClearData = async () => {
    if (!window.confirm('Delete all decks and cards? This cannot be undone.')) return
    await db.decks.clear()
    await db.cards.clear()
    setMessage('All data cleared.')
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6 dark:text-zinc-100">Settings</h1>

      {/* Data management */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Data</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Export backup</p>
              <p className="text-xs text-zinc-400">Download all decks and cards as JSON</p>
            </div>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer font-medium dark:text-indigo-400 dark:hover:bg-indigo-950"
            >
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Import</p>
              <p className="text-xs text-zinc-400">Restore from Recall backup or Anki .apkg</p>
            </div>
            <label className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer font-medium dark:text-indigo-400 dark:hover:bg-indigo-950">
              {importing ? 'Importing...' : 'Import'}
              <input
                ref={fileRef}
                type="file"
                accept=".json,.apkg"
                onChange={handleImport}
                className="hidden"
                disabled={importing}
              />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-200 dark:bg-zinc-900 dark:border-red-900/50">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Clear all data</p>
              <p className="text-xs text-zinc-400">Delete all decks and cards permanently</p>
            </div>
            <button
              onClick={handleClearData}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer font-medium dark:text-red-400 dark:hover:bg-red-950"
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section>
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">About</h2>
        <div className="p-4 bg-white rounded-xl border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Recall uses SM-2 spaced repetition to help you study efficiently.
            All data is stored locally in your browser — no account needed.
          </p>
        </div>
      </section>

      {message && (
        <div className="mt-4 p-3 bg-indigo-50 text-indigo-700 text-sm rounded-lg dark:bg-indigo-950 dark:text-indigo-300">
          {message}
        </div>
      )}
    </div>
  )
}
