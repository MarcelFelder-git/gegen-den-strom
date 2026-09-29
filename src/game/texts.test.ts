import { existsSync } from 'node:fs'
import { resolve as resolvePath } from 'node:path'
import { describe, expect, it } from 'vitest'
import { WEEKS } from './data/weeks'
import { MISSIONS } from './data/missions'
import { STORIES } from './data/stories'
import { SOURCES } from './data/sources'
import { CARDS } from './data/cards'
import { LEXICON, getLexiconEntry } from './data/lexicon'
import { TIMELINE, TIMELINE_INTRO, TIMELINE_OUTRO } from './data/timeline'
import { DISTRICTS } from './data/districts'
import { ALL_PHOTOS } from './data/photos'
import { SOLIDARITY_RATINGS, HONEST_NOTE } from './data/fates'
import { PRISON_HELP } from './data/prison'
import { COMPANIONS } from './data/companions'
import { PROFESSIONS, IDEOLOGIES } from './data/professions'
import { TUTORIAL, TUTORIAL_RESOURCES, TUTORIAL_WEEK } from './data/tutorial'
import { MISSION_HELP, PRISON_FAMILY_WHO, letterFor, portraitFor, type HelpKind } from './data/helped'
import { isLeveled, resolve, type Leveled } from './text'

const LETTER_KINDS: HelpKind[] = ['unterschlupf', 'besorgung', 'rotehilfe', 'warnung', 'ausreise', 'pakete', 'begegnung', 'haft']
const LETTERS = LETTER_KINDS.flatMap((kind) =>
  [false, true].flatMap((later) =>
    ['h1-3', 'h2-12'].map((id) => letterFor({ id, name: 'X', who: '', count: 1, week: 3, avatar: portraitFor('X', 'w'), kind }, later)),
  ),
)

const ALL = { WEEKS, MISSIONS, STORIES, SOURCES, CARDS, LEXICON, TIMELINE, TIMELINE_INTRO, TIMELINE_OUTRO, DISTRICTS, SOLIDARITY_RATINGS, HONEST_NOTE, PRISON_HELP, COMPANIONS, PROFESSIONS, IDEOLOGIES, TUTORIAL, TUTORIAL_RESOURCES, TUTORIAL_WEEK, MISSION_HELP, PRISON_FAMILY_WHO, LETTERS }

/** Sammelt alle zweistufigen Texte aus einem Datenbaum */
function collect(value: unknown, out: Leveled[] = []): Leveled[] {
  if (isLeveled(value)) out.push(value)
  else if (Array.isArray(value)) value.forEach((v) => collect(v, out))
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => collect(v, out))
  return out
}

const sentences = (text: string) =>
  text
    .replace(/\b(Dr|Nr|Mr)\./g, '$1')
    .split(/(?<=[.!?:]“?)\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

const words = (s: string) => s.split(/\s+/).filter(Boolean).length

describe('Zwei Sprachstufen', () => {
  const texts = collect(ALL)

  it('gibt es für sehr viele Texte', () => {
    expect(texts.length).toBeGreaterThan(600)
  })

  it('enthalten keine Gedankenstriche', () => {
    for (const level of ['leicht', 'schwer'] as const) {
      const all = JSON.stringify(resolve(ALL, level))
      expect(all).not.toMatch(new RegExp('[\\u2013\\u2014]'))
    }
  })

  it('die leichte Stufe hat deutlich kürzere Sätze', () => {
    const avg = (level: 'leicht' | 'schwer') => {
      const lens = texts.flatMap((t) => sentences(t[level]).map(words))
      return lens.reduce((a, b) => a + b, 0) / lens.length
    }
    const leicht = avg('leicht')
    const schwer = avg('schwer')
    console.info(`Wörter pro Satz: leicht ${leicht.toFixed(1)}, schwer ${schwer.toFixed(1)}`)
    expect(leicht).toBeLessThan(11)
    expect(leicht).toBeLessThan(schwer)
  })

  it('in der leichten Stufe ist kaum ein Satz länger als 22 Wörter', () => {
    const long = texts.flatMap((t) => sentences(t.leicht)).filter((s) => words(s) > 22)
    if (long.length) console.info('Lange Sätze in der leichten Stufe:\n' + long.join('\n'))
    expect(long.length).toBeLessThanOrEqual(8)
  })
})

describe('Inhalte', () => {
  it('jede Woche hat eine Frage zum Nachdenken und eine Stimme aus der Nachbarschaft', () => {
    for (const w of WEEKS) {
      expect(w.reflect).toBeTruthy()
      expect(w.voice).toBeTruthy()
      for (const id of w.lexicon) expect(getLexiconEntry(id), id).toBeDefined()
    }
  })

  it('Zeitzeugenberichte haben immer eine Quelle', () => {
    const witnesses = WEEKS.flatMap((w) => w.witnesses ?? [])
    expect(witnesses.length).toBeGreaterThanOrEqual(3)
    for (const wt of witnesses) {
      expect(wt.source.length).toBeGreaterThan(10)
      expect(wt.text.startsWith('„')).toBe(true)
    }
  })

  it('das Lexikon erklärt Faschismus, Mitläufer und Solidarität', () => {
    for (const id of ['faschismus', 'mitlaeufer', 'solidaritaet', 'zivilcourage', 'diktatur', 'hitlerputsch', 'rassismus']) {
      expect(LEXICON.some((e) => e.id === id), id).toBe(true)
    }
  })

  it('jedes Foto liegt im Projekt und hat einen Bildnachweis', () => {
    for (const p of ALL_PHOTOS) {
      expect(existsSync(resolvePath(__dirname, '../../public', p.src.replace('./', ''))), p.src).toBe(true)
      expect(p.credit.length).toBeGreaterThan(3)
      expect(p.license.length).toBeGreaterThan(2)
      expect(p.url).toMatch(/^https:\/\/commons\.wikimedia\.org\//)
    }
  })

  it('jedes Vorbild hat ein echtes Foto oder Dokument', () => {
    expect(CARDS.filter((c) => !c.photo).map((c) => c.name)).toEqual([])
  })

  it('die Zeitleiste des Intros beginnt 1918 und nennt Hitlerputsch, Neugründung und Denkschrift', () => {
    const years = TIMELINE.map((e) => e.date).join(' ')
    expect(years).toMatch(/1918/)
    expect(years).toMatch(/9\. November 1923/)
    expect(years).toMatch(/27\. Februar 1925/)
    expect(years).toMatch(/August 1930/)
    expect(years).toMatch(/30\. Januar 1933/)
  })

  it('die Gruppe besteht aus Menschen, die nicht rassistisch verfolgt werden', () => {
    expect(COMPANIONS.some((c) => c.name === 'Ruth Levin')).toBe(false)
    expect(STORIES.every((st) => COMPANIONS.some((c) => c.name === st.companion))).toBe(true)
  })

  it('Solidarische Aufträge helfen Menschen', () => {
    const rng = () => 0.5
    for (const t of Object.values(MISSIONS)) {
      if (t.solidarity) expect(t.success(rng, []).helped ?? 0).toBeGreaterThan(0)
    }
  })
})

describe('Menschen hinter der Zahl', () => {
  it('jeder solidarische Auftrag hat Namen und eine Beschreibung', () => {
    for (const t of Object.values(MISSIONS)) {
      if (t.solidarity) expect(MISSION_HELP[t.type], t.type).toBeDefined()
    }
  })

  it('jede Geschichte, die hilft, nennt, wem sie hilft', () => {
    for (const st of STORIES) {
      for (const c of st.event.choices) {
        if ((c.effects.helped ?? 0) > 0) expect(c.helps, `${st.companion}: ${resolve(c.label, 'schwer')}`).toBeDefined()
      }
    }
  })

  it('dieselbe Person sieht immer gleich aus', () => {
    expect(portraitFor('Familie Cohn', 'w')).toEqual(portraitFor('Familie Cohn', 'w'))
  })
})
