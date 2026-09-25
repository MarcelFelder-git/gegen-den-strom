import { describe, expect, it } from 'vitest'
import { STORIES, storiesFor } from './data/stories'
import { COMPANIONS } from './data/companions'
import { MISSIONS } from './data/missions'
import { DISTRICTS } from './data/districts'
import { WEEKS } from './data/weeks'
import {
  EMPTY_TRUST,
  applyEffects,
  detectionRisk,
  fillNames,
  generateMissions,
  projectStep,
  resolveMission,
  seededRng,
  type ResourceState,
} from './logic'
import type { Character } from './types'

function person(id: string, name: string): Character {
  return {
    id,
    name,
    isLeader: id === 'leader',
    avatar: { gender: 'w', face: 'oval', headwear: 'kurz', hairTone: 'dunkel', glasses: false, clothing: 'kleid' },
    beruf: 'Test',
    bio: '',
    stats: { heimlichkeit: 3, propaganda: 3, empathie: 3, staerke: 3, bildung: 3 },
    heat: 30,
    status: 'bereit',
    injuredWeeks: 0,
  }
}

const base = (): ResourceState => ({
  moral: 50,
  supporters: 5,
  kasse: 50,
  inventory: { papier: 2, farbe: 1, flugblaetter: 0, ausweise: 0 },
  members: [person('leader', 'Frieda'), person('g1', 'Ruth Levin')],
  flags: [],
  trust: { ...EMPTY_TRUST },
})

describe('Gefährten-Geschichten', () => {
  it('jede Person hat genau zwei Geschichten, jede mit zwei Wahlmöglichkeiten', () => {
    for (const c of COMPANIONS) {
      const own = STORIES.filter((st) => st.companion === c.name)
      expect(own).toHaveLength(2)
      for (const st of own) {
        expect(st.event.choices).toHaveLength(2)
        expect(st.week).toBeGreaterThanOrEqual(0)
        expect(st.week).toBeLessThan(WEEKS.length)
      }
    }
  })

  it('erscheinen nur für Personen in der Gruppe', () => {
    expect(storiesFor(5, ['Ruth Levin']).map((s) => s.companion)).toEqual(['Ruth Levin'])
    expect(storiesFor(5, ['Hans Wendt'])).toEqual([])
  })

  it('lassen nach dem Füllen keine Platzhalter übrig', () => {
    const names = { self: 'Ruth', name: 'Frieda', g1: 'Hans', g2: 'Lotte' }
    for (const st of STORIES) {
      for (const text of [st.event.text, ...st.event.choices.flatMap((c) => [c.label, c.result, c.failResult ?? ''])]) {
        expect(fillNames(text, names)).not.toMatch(/[{}]/)
      }
    }
  })

  it('treffen mit „self“ nur die eigene Person, Auswanderung inklusive', () => {
    const after = applyEffects(base(), { self: { heat: 10, emigrates: true } }, 'g1')
    expect(after.members[1].status).toBe('ausgewandert')
    expect(after.members[1].heat).toBe(40)
    expect(after.members[0].heat).toBe(30)
  })
})

describe('Vorhaben: eigene Druckerei', () => {
  it('führt in drei Schritten zur Druckerei und danach zur Zeitung', () => {
    expect(projectStep([])).toBe('presse')
    expect(projectStep(['presse'])).toBe('transport')
    expect(projectStep(['presse', 'transport'])).toBe('keller')
    expect(projectStep(['presse', 'transport', 'druckerei'])).toBe('zeitung')
  })

  it('die Druckerei bringt mehr Flugblätter', () => {
    const rng = seededRng(1)
    expect(MISSIONS.druck.success(rng, []).items?.flugblaetter).toBe(3)
    expect(MISSIONS.druck.success(rng, ['druckerei']).items?.flugblaetter).toBe(5)
  })

  it('der nächste Schritt steht ab der zweiten Woche auf der Karte', () => {
    expect(generateMissions(0, [], seededRng(2)).some((m) => m.type === 'presse')).toBe(false)
    expect(generateMissions(1, [], seededRng(2)).some((m) => m.type === 'presse')).toBe(true)
    expect(generateMissions(4, ['presse'], seededRng(2)).some((m) => m.type === 'transport')).toBe(true)
  })
})

describe('Bezirke', () => {
  it('jeder Bezirk hat eine Lage für die erste Woche und einen eigenen Auftrag', () => {
    for (const d of DISTRICTS) {
      expect(d.situation[0].from).toBe(0)
      expect(d.special.length).toBeGreaterThan(0)
    }
  })

  it('Vertrauen senkt die Gefahr und steigt nach gelungenen Einsätzen', () => {
    const team = [person('leader', 'Frieda')]
    const t = MISSIONS.verteilen
    expect(detectionRisk(t, 'wedding', team, 3, 4)).toBeLessThan(detectionRisk(t, 'wedding', team, 3, 0))

    for (let seed = 1; seed < 60; seed++) {
      const [m] = generateMissions(3, [], seededRng(seed)).filter((x) => x.type === 'spenden')
      const r = resolveMission(m, team, 3, seededRng(seed))
      const delta = r.effects.trust?.[m.district] ?? 0
      const expected = (r.outcome === 'gelungen' ? 1 : 0) - (r.detected ? 1 : 0)
      expect(delta).toBe(expected)
    }
  })

  it('Vertrauen bleibt zwischen 0 und 5', () => {
    let s = base()
    for (let i = 0; i < 10; i++) s = applyEffects(s, { trust: { mitte: 1 } })
    expect(s.trust.mitte).toBe(5)
    s = applyEffects(s, { trust: { mitte: -9 } })
    expect(s.trust.mitte).toBe(0)
  })

  it('auf der Karte liegen nie zwei Aufträge am selben Ort', () => {
    for (let seed = 1; seed < 80; seed++) {
      for (const week of [0, 3, 6, 9]) {
        const flags = ['unterschlupf', 'presse', 'transport', 'druckerei']
        const ms = generateMissions(week, flags, seededRng(seed * 13 + week))
        expect(new Set(ms.map((m) => m.placeId)).size).toBe(ms.length)
      }
    }
  })
})
