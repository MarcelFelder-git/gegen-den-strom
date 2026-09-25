import { describe, expect, it } from 'vitest'
import { MISSIONS } from './data/missions'
import { WEEKS } from './data/weeks'
import { COMPANIONS } from './data/companions'
import { LEXICON } from './data/lexicon'
import { SOURCES } from './data/sources'
import { CARDS } from './data/cards'
import { PROFESSIONS, IDEOLOGIES } from './data/professions'
import {
  EMPTY_TRUST,
  applyEffects,
  detectionRisk,
  fillMissionText,
  generateMissions,
  joinNames,
  resolveMission,
  seededRng,
  successChance,
  type ResourceState,
} from './logic'
import type { Character, Stats } from './types'

const stats = (v: number): Stats => ({ heimlichkeit: v, propaganda: v, empathie: v, staerke: v, bildung: v })

function person(id: string, name: string, gender: 'm' | 'w', heat = 0, v = 3): Character {
  return {
    id,
    name,
    isLeader: id === 'leader',
    avatar: { gender, face: 'oval', headwear: 'kurz', hairTone: 'dunkel', glasses: false, clothing: 'weste' },
    beruf: 'Test',
    bio: '',
    stats: stats(v),
    heat,
    status: 'bereit',
    injuredWeeks: 0,
  }
}

describe('Texte', () => {
  it('verbindet Namen wie im Deutschen üblich', () => {
    expect(joinNames(['Karl'])).toBe('Karl')
    expect(joinNames(['Karl', 'Lotte'])).toBe('Karl und Lotte')
    expect(joinNames(['Karl', 'Lotte', 'Hans'])).toBe('Karl, Lotte und Hans')
  })

  it('beugt Verben und Pronomen nach Anzahl und Geschlecht', () => {
    const tpl = '{team} {ging|gingen} los. {Er|Sie|Sie} {kam|kamen} {ort} an und dankte {ihm|ihr|ihnen}.'
    expect(fillMissionText(tpl, [person('a', 'Karl', 'm')], 'im Hof')).toBe('Karl ging los. Er kam im Hof an und dankte ihm.')
    expect(fillMissionText(tpl, [person('a', 'Marta', 'w')], 'im Hof')).toBe('Marta ging los. Sie kam im Hof an und dankte ihr.')
    expect(fillMissionText(tpl, [person('a', 'Karl', 'm'), person('b', 'Lotte Krause', 'w')], 'im Hof')).toBe(
      'Karl und Lotte gingen los. Sie kamen im Hof an und dankte ihnen.',
    )
  })

  it('schreibt den Ort am Satzanfang groß', () => {
    expect(fillMissionText('{Ort} war es still.', [person('a', 'Karl', 'm')], 'im Hinterhof')).toBe('Im Hinterhof war es still.')
  })

  it('enthält keine Gedankenstriche und keine offenen Platzhalter in den Spieltexten', () => {
    const all = JSON.stringify({ MISSIONS, WEEKS, COMPANIONS, LEXICON, PROFESSIONS, IDEOLOGIES, SOURCES, CARDS })
    expect(all).not.toMatch(new RegExp('[\\u2013\\u2014]'))
    // Nach dem Füllen dürfen keine geschweiften Klammern übrig bleiben
    const team = [person('a', 'Karl', 'm'), person('b', 'Lotte', 'w')]
    for (const t of Object.values(MISSIONS)) {
      for (const text of [...t.texts.success, ...t.texts.failure, ...t.texts.detected]) {
        for (const size of [1, 2]) {
          expect(fillMissionText(text, team.slice(0, size), 'im Hof')).not.toMatch(/[{}]/)
        }
      }
    }
  })
})

describe('Wahrscheinlichkeiten', () => {
  const t = MISSIONS.verteilen

  it('mehr Gefährten erhöhen die Erfolgsaussicht', () => {
    const one = successChance(t, [person('a', 'A', 'm')])
    const two = successChance(t, [person('a', 'A', 'm'), person('b', 'B', 'w')])
    expect(two).toBeGreaterThan(one)
    expect(successChance(t, [])).toBe(0)
  })

  it('hält die Aussicht zwischen 5 und 95', () => {
    expect(successChance(t, [person('a', 'A', 'm', 0, 1)])).toBeGreaterThanOrEqual(5)
    const strong = [1, 2, 3].map((i) => person(`p${i}`, 'X', 'm', 0, 6))
    expect(successChance(t, strong)).toBeLessThanOrEqual(95)
  })

  it('mehr Gefährten und mehr Fahndungsdruck erhöhen die Gefahr', () => {
    const one = detectionRisk(t, 'wedding', [person('a', 'A', 'm')], 0)
    const two = detectionRisk(t, 'wedding', [person('a', 'A', 'm'), person('b', 'B', 'w')], 0)
    const hot = detectionRisk(t, 'wedding', [person('a', 'A', 'm', 90)], 0)
    expect(two).toBeGreaterThan(one)
    expect(hot).toBeGreaterThan(one)
  })

  it('die Überwachung steigt im Lauf des Jahres', () => {
    const team = [person('a', 'A', 'm')]
    expect(detectionRisk(t, 'mitte', team, 9)).toBeGreaterThan(detectionRisk(t, 'mitte', team, 0))
  })
})

describe('Aufträge', () => {
  it('verteilt Aufträge auf verschiedene Orte', () => {
    for (let seed = 1; seed < 50; seed++) {
      const ms = generateMissions(5, ['unterschlupf'], seededRng(seed))
      expect(new Set(ms.map((m) => m.placeId)).size).toBe(ms.length)
      expect(ms.some((m) => m.type === 'unterschlupf')).toBe(true)
    }
  })

  it('Unterschlupf erscheint erst nach dem Reichstagsbrand', () => {
    const ms = generateMissions(1, [], seededRng(3))
    expect(ms.some((m) => m.type === 'unterschlupf')).toBe(false)
  })

  it('verhaftet bei Entdeckung nur Gesuchte', () => {
    for (let seed = 1; seed < 300; seed++) {
      const team = [person('a', 'A', 'm', 10, 1), person('b', 'B', 'w', 80, 1)]
      const [mission] = generateMissions(9, [], seededRng(seed)).filter((m) => m.type === 'verteilen')
      const r = resolveMission(mission, team, 9, seededRng(seed))
      if (!r.detected) expect(r.arrested).toEqual([])
      expect(r.arrested).not.toContain('a')
    }
  })

  it('ist mit gleichem Zufallswert reproduzierbar', () => {
    const team = [person('a', 'A', 'm')]
    const [m] = generateMissions(0, [], seededRng(7))
    expect(resolveMission(m, team, 0, seededRng(42))).toEqual(resolveMission(m, team, 0, seededRng(42)))
  })
})

describe('Effekte', () => {
  it('hält alle Werte in ihren Grenzen', () => {
    const s: ResourceState = {
      moral: 95,
      supporters: 1,
      kasse: 5,
      inventory: { papier: 1, farbe: 0, flugblaetter: 0, ausweise: 0 },
      members: [person('leader', 'Karl', 'm', 95), person('g1', 'Lotte', 'w', 3)],
      flags: [],
      trust: { ...EMPTY_TRUST },
    }
    const n = applyEffects(s, { moral: 20, supporters: -5, kasse: -50, items: { papier: -4 }, heatAll: 10, heatLeader: 10 })
    expect(n.moral).toBe(100)
    expect(n.supporters).toBe(0)
    expect(n.kasse).toBe(0)
    expect(n.inventory.papier).toBe(0)
    expect(n.members[0].heat).toBe(100)
    expect(n.members[1].heat).toBe(13)
  })
})

describe('Historische Daten', () => {
  it('hat zwei Kapitel mit 10 und 8 Wochen, jede mit Zeitung, Quelle und Entscheidung', () => {
    expect(WEEKS).toHaveLength(18)
    expect(SOURCES).toHaveLength(WEEKS.length)
    for (const src of SOURCES) {
      expect(src.options).toHaveLength(3)
      expect(src.answer).toBeGreaterThanOrEqual(0)
    }
    for (const w of WEEKS) {
      expect(w.event.choices.length).toBeGreaterThanOrEqual(2)
      expect(w.event.choices.length).toBeLessThanOrEqual(3)
      for (const id of w.lexicon) expect(LEXICON.some((e) => e.id === id)).toBe(true)
    }
  })
})
