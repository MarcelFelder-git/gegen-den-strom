import { describe, expect, it } from 'vitest'
import { CARDS, cardNumber, cardsOfChapter } from './cards'
import { CHAPTERS } from './chapters'

describe('Vorbilder nach Kapiteln', () => {
  it('jedes Kapitel hat eigene Vorbilder, zusammen ergeben sie das Album', () => {
    expect(cardsOfChapter(1)).toHaveLength(8)
    expect(cardsOfChapter(2)).toHaveLength(5)
    expect(cardsOfChapter(1).length + cardsOfChapter(2).length).toBe(CARDS.length)
  })

  it('Vorbilder einer Woche erscheinen in einer Woche ihres eigenen Kapitels', () => {
    for (const c of CARDS) {
      const ch = CHAPTERS[c.chapter]
      const weeks = [c.unlock.week, ...(c.unlock.weeks ?? []), c.unlock.fromWeek].filter((w): w is number => w !== undefined)
      for (const w of weeks) {
        expect(w, c.id).toBeGreaterThanOrEqual(ch.first)
        expect(w, c.id).toBeLessThanOrEqual(ch.last)
      }
    }
  })

  it('die Nummer auf der Karte zählt innerhalb des Kapitels', () => {
    expect(cardNumber(cardsOfChapter(2)[0])).toEqual({ number: 1, total: 5 })
    expect(cardNumber(cardsOfChapter(1)[7])).toEqual({ number: 8, total: 8 })
  })
})
