import JSZip from 'jszip'
import initSqlJs, { type Database } from 'sql.js'
import type { Card } from '../db/mod'
import { renderMarkdown } from './markdown'

export interface ApkgResult {
  deckName: string
  cards: Omit<Card, 'id' | 'deckId'>[]
}

/**
 * Parse an Anki .apkg file.
 * .apkg = zip containing collection.anki2 (SQLite DB) + media files.
 */
export async function parseApkg(file: File): Promise<ApkgResult> {
  const SQL = await initSqlJs({
    locateFile: (f: string) => `https://sql.js.org/dist/${f}`,
  })

  const buffer = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(buffer)

  // Find the SQLite database file
  const dbFile = zip.file('collection.anki2') || zip.file('collection.anki21')
  if (!dbFile) throw new Error('Invalid .apkg: no collection database found')

  const dbData = await dbFile.async('arraybuffer')
  const db = new SQL.Database(new Uint8Array(dbData))

  // Extract deck name from decks table
  const deckName = getDeckName(db)

  // Extract cards
  const cards = extractCards(db)

  db.close()

  return { deckName, cards }
}

function getDeckName(db: Database): string {
  try {
    const result = db.exec("SELECT name FROM decks LIMIT 1")
    if (result.length > 0 && result[0].values.length > 0) {
      return result[0].values[0][0] as string
    }
  } catch { /* ignore */ }
  return 'Imported Deck'
}

function extractCards(db: Database): ApkgResult['cards'] {
  const cards: ApkgResult['cards'] = []

  try {
    // Get notes (contains the actual content)
    const notesResult = db.exec(`
      SELECT n.flds, n.sfld, n.tags
      FROM notes n
      ORDER BY n.id
    `)

    if (notesResult.length === 0) return cards

    const notesRows = notesResult[0].values

    for (const row of notesRows) {
      const flds = row[0] as string
      // Anki separates fields with \x1f (unit separator)
      const fields = flds.split('')

      const front = fields[0] || ''
      const back = fields[1] || ''

      if (!front && !back) continue

      const now = Date.now()
      cards.push({
        front,
        back,
        frontHtml: renderMarkdown(front),
        backHtml: renderMarkdown(back),
        starred: false,
        ease: 2.5,
        interval: 0,
        repetitions: 0,
        nextReview: now,
        lastReview: null,
        phase: 'new',
        createdAt: now,
        updatedAt: now,
      })
    }
  } catch (err) {
    console.error('Failed to extract cards from .apkg:', err)
  }

  return cards
}
