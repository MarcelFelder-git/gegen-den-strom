import { beforeEach, describe, expect, it } from 'vitest'
import { MISSIONS } from '../game/data/missions'
import { WEEKS } from '../game/data/weeks'
import { canAfford, isWanted, successChance } from '../game/logic'
import type { IdeologyKey, ProfessionKey } from '../game/types'
import { currentEvent, useGame } from './GameStore'

const draft = (profession: ProfessionKey, ideology: IdeologyKey) => ({
  name: 'Frieda',
  groupName: 'Die Unbeugsamen',
  motto: 'Wir schweigen nicht.',
  codename: 'Amsel',
  avatar: { gender: 'w' as const, face: 'oval' as const, headwear: 'welle' as const, hairTone: 'dunkel' as const, glasses: false, clothing: 'kleid' as const },
  profession,
  ideology,
})

beforeEach(() => {
  useGame.setState({ phase: 'title', members: [], history: [], report: null })
})

describe('Spielablauf', () => {
  it('führt durch Zeitung, Begegnung, Karte und Bericht', () => {
    const g = useGame.getState()
    g.startGame(draft('lehrer', 'christlich'))
    let s = useGame.getState()
    expect(s.phase).toBe('newspaper')
    expect(s.members).toHaveLength(4)
    expect(s.missions.length).toBeGreaterThanOrEqual(5)

    s.closeNewspaper()
    expect(useGame.getState().phase).toBe('event')
    useGame.getState().chooseEventOption(1)
    expect(useGame.getState().eventOutcome).not.toBeNull()
    useGame.getState().finishEvent()
    expect(useGame.getState().phase).toBe('map')

    s = useGame.getState()
    const druck = s.missions.find((m) => m.type === 'druck')!
    const papierBefore = s.inventory.papier
    expect(s.assign(druck.uid, ['leader'])).toBeNull()
    expect(useGame.getState().inventory.papier).toBe(papierBefore - 2)
    // Dieselbe Person kann nicht zweimal eingeteilt werden
    const spenden = s.missions.find((m) => m.type === 'spenden')!
    expect(useGame.getState().assign(spenden.uid, ['leader'])).toMatch(/bereits/)
    // Zurückziehen erstattet das Material
    useGame.getState().unassign(druck.uid)
    expect(useGame.getState().inventory.papier).toBe(papierBefore)

    useGame.getState().assign(druck.uid, ['leader', 'g1'])
    useGame.getState().endWeek()
    s = useGame.getState()
    expect(s.phase).toBe('report')
    expect(s.report?.results).toHaveLength(1)
    s.nextWeek()
    expect(['newspaper', 'end']).toContain(useGame.getState().phase)
  })
})

/**
 * Spielt viele Partien mit einer einfachen, vernünftigen Strategie.
 * Dient als Prüfung der Spielbalance: gut spielbar, aber nicht trivial.
 */
function autoplay(profession: ProfessionKey, ideology: IdeologyKey) {
  useGame.getState().startGame(draft(profession, ideology))
  for (let guard = 0; guard < 120; guard++) {
    const s = useGame.getState()
    if (s.phase === 'end') break
    if (s.phase === 'newspaper') s.closeNewspaper()
    else if (s.phase === 'event') {
      const choices = WEEKS[s.weekIndex].event.choices
      const idx = choices.findIndex((c) => (c.needsKasse ?? 0) <= s.kasse && (c.effects.moral ?? 0) >= 0)
      s.chooseEventOption(Math.max(0, idx))
      useGame.getState().finishEvent()
    } else if (s.phase === 'map') {
      for (const type of ['druck', 'verteilen', 'papier', 'unterschlupf', 'parolen', 'spenden', 'ausweise'] as const) {
        const cur = useGame.getState()
        const mission = cur.missions.find((m) => m.type === type && m.assigned.length === 0)
        if (!mission || !canAfford(MISSIONS[type], cur.kasse, cur.inventory)) continue
        const busy = new Set(cur.missions.flatMap((m) => m.assigned))
        const free = cur.members.filter((m) => m.status === 'bereit' && !busy.has(m.id) && !isWanted(m))
        const t = MISSIONS[type]
        const sorted = [...free].sort((a, b) => b.stats[t.primary] - a.stats[t.primary])
        const team = sorted.slice(0, 1)
        if (successChance(t, team) < 55 && sorted[1]) team.push(sorted[1])
        if (team.length) cur.assign(mission.uid, team.map((m) => m.id))
      }
      const cur = useGame.getState()
      for (const m of cur.members) if (cur.inventory.ausweise > 0 && m.heat >= 50) cur.giveAusweis(m.id)
      useGame.getState().endWeek()
    } else if (s.phase === 'report') s.nextWeek()
  }
  return useGame.getState()
}

describe('Spielbalance', () => {
  it('ist mit umsichtiger Strategie meist zu schaffen, aber nicht immer', () => {
    const combos: [ProfessionKey, IdeologyKey][] = [
      ['arbeiter', 'kommunistisch'],
      ['journalist', 'sozialdemokratisch'],
      ['lehrer', 'christlich'],
      ['haendler', 'humanistisch'],
    ]
    let survived = 0
    let total = 0
    let supporters = 0
    const reasons: Record<string, number> = {}
    for (const [p, i] of combos) {
      for (let n = 0; n < 60; n++) {
        const end = autoplay(p, i)
        total++
        reasons[end.endReason ?? 'offen'] = (reasons[end.endReason ?? 'offen'] ?? 0) + 1
        if (end.endReason === 'kapitelende') {
          survived++
          supporters += end.supporters
        }
      }
    }
    const rate = survived / total
    console.info(`Überlebensrate ${(rate * 100).toFixed(0)}%, Unterstützer im Schnitt ${(supporters / Math.max(1, survived)).toFixed(1)}`, reasons)
    expect(rate).toBeGreaterThan(0.45)
    // Die Simulation spielt sehr umsichtig. Kinder spielen mutiger, für sie ist es schwerer.
    expect(rate).toBeLessThan(0.995)
  })
})

describe('Kapitel 2', () => {
  it('lässt sich direkt beginnen und bis Dezember 1938 spielen', () => {
    useGame.getState().startGame(draft('lehrer', 'christlich'), 10)
    expect(useGame.getState().weekIndex).toBe(10)
    for (let guard = 0; guard < 120; guard++) {
      const s = useGame.getState()
      if (s.phase === 'end') break
      if (s.phase === 'newspaper') {
        s.answerSource(0)
        s.closeNewspaper()
      } else if (s.phase === 'event') {
        const idx = currentEvent(s).event.choices.findIndex((c) => (c.needsKasse ?? 0) <= s.kasse)
        s.chooseEventOption(Math.max(0, idx))
        useGame.getState().finishEvent()
      } else if (s.phase === 'map') s.endWeek()
      else if (s.phase === 'report') s.nextWeek()
    }
    const end = useGame.getState()
    expect(end.phase).toBe('end')
    expect(Object.keys(end.sourceAnswers).length).toBeGreaterThan(0)
    // Ohne Aufträge überlebt die Gruppe nicht immer, aber die Karten der Wochen sind da
    if (end.endReason === 'kapitelende') {
      expect(end.weekIndex).toBe(17)
      expect(end.cards).toContain('kruetzfeld')
    }
  })

  it('führt nach Kapitel 1 mit derselben Gruppe weiter', () => {
    useGame.getState().startGame(draft('arbeiter', 'humanistisch'))
    useGame.setState({ weekIndex: 9, phase: 'end', endReason: 'kapitelende' })
    const leaderBefore = useGame.getState().members.find((m) => m.isLeader)?.name
    useGame.getState().continueToChapter2()
    const s = useGame.getState()
    expect(s.weekIndex).toBe(10)
    expect(s.phase).toBe('newspaper')
    expect(s.members.find((m) => m.isLeader)?.name).toBe(leaderBefore)
    expect(s.members.filter((m) => !m.isLeader && m.status !== 'verhaftet' && m.status !== 'ausgewandert').length).toBeGreaterThanOrEqual(3)
  })
})
