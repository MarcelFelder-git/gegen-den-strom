import { beforeEach, describe, expect, it } from 'vitest'
import { MISSIONS } from '../game/data/missions'
import { canAfford, isWanted, successChance } from '../game/logic'
import type { IdeologyKey, ProfessionKey } from '../game/types'
import type { Level } from '../game/text'
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

describe('Einführung', () => {
  it('erscheint in jedem neuen Spiel einmal', () => {
    useGame.getState().startGame(draft('lehrer', 'christlich'))
    expect(useGame.getState().tutorialSeen).toBe(false)
    useGame.getState().markTutorial()
    expect(useGame.getState().tutorialSeen).toBe(true)
    useGame.getState().startGame(draft('lehrer', 'christlich'))
    expect(useGame.getState().tutorialSeen).toBe(false)
  })
})

describe('Doppeltes Tippen auf dem Tablet', () => {
  it('überspringt keine Woche und keine Geschichte', () => {
    useGame.getState().startGame(draft('arbeiter', 'kommunistisch'))
    useGame.getState().closeNewspaper()
    useGame.getState().chooseEventOption(0)
    const stage = useGame.getState().eventStage
    useGame.getState().finishEvent()
    const after = useGame.getState()
    // Zweites Tippen, bevor die nächste Geschichte beantwortet ist, ändert nichts
    after.finishEvent()
    expect(useGame.getState().eventStage).toBe(after.eventStage)
    expect(after.eventStage === stage + 1 || after.phase === 'map').toBe(true)

    useGame.setState({ phase: 'map' })
    useGame.getState().endWeek()
    const week = useGame.getState().weekIndex
    useGame.getState().nextWeek()
    useGame.getState().nextWeek()
    expect(useGame.getState().weekIndex).toBe(week + 1)
  })
})

/**
 * Spielt viele Partien mit einer einfachen, vernünftigen Strategie.
 * Dient als Prüfung der Spielbalance: gut spielbar, aber nicht trivial.
 */
function autoplay(profession: ProfessionKey, ideology: IdeologyKey, level: Level) {
  useGame.getState().startGame({ ...draft(profession, ideology), level })
  for (let guard = 0; guard < 160; guard++) {
    const s = useGame.getState()
    if (s.phase === 'end') break
    if (s.phase === 'newspaper') s.closeNewspaper()
    else if (s.phase === 'event') {
      const { event } = currentEvent(s)
      const affordable = (c: (typeof event.choices)[number]) => (c.needsKasse ?? 0) <= s.kasse
      let idx = event.choices.findIndex((c) => affordable(c) && (c.effects.moral ?? 0) >= 0)
      if (idx < 0) idx = event.choices.findIndex(affordable)
      s.chooseEventOption(idx)
      useGame.getState().finishEvent()
    } else if (s.phase === 'map') {
      for (const type of ['druck', 'besorgung', 'rotehilfe', 'verteilen', 'papier', 'unterschlupf', 'parolen', 'spenden', 'ausweise'] as const) {
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
      for (const m of useGame.getState().members) if (m.status === 'verhaftet') useGame.getState().helpPrisoner(m.id, 'paket')
      useGame.getState().endWeek()
    } else if (s.phase === 'report') s.nextWeek()
  }
  return useGame.getState()
}

const COMBOS: [ProfessionKey, IdeologyKey][] = [
  ['arbeiter', 'kommunistisch'],
  ['journalist', 'sozialdemokratisch'],
  ['lehrer', 'christlich'],
  ['haendler', 'humanistisch'],
]

describe('Spielbalance', () => {
  it('schwere Stufe: mit umsichtiger Strategie meist zu schaffen, aber nicht immer', () => {
    let survived = 0
    let total = 0
    let helped = 0
    const reasons: Record<string, number> = {}
    for (const [p, i] of COMBOS) {
      for (let n = 0; n < 60; n++) {
        const end = autoplay(p, i, 'schwer')
        total++
        reasons[end.endReason ?? 'offen'] = (reasons[end.endReason ?? 'offen'] ?? 0) + 1
        if (end.endReason === 'kapitelende') survived++
        helped += end.helped
      }
    }
    const rate = survived / total
    console.info(`Schwer: Überlebensrate ${(rate * 100).toFixed(0)}%, geholfen im Schnitt ${(helped / total).toFixed(1)}`, reasons)
    expect(rate).toBeGreaterThan(0.45)
    // Die Simulation spielt sehr umsichtig. Kinder spielen mutiger, für sie ist es schwerer.
    expect(rate).toBeLessThan(0.995)
  })

  it('leichte Stufe: die Gruppe kommt immer bis zum Kapitelende', () => {
    let helped = 0
    let total = 0
    for (const [p, i] of COMBOS) {
      for (let n = 0; n < 40; n++) {
        const end = autoplay(p, i, 'leicht')
        total++
        helped += end.helped
        expect(end.endReason).toBe('kapitelende')
        expect(end.weekIndex).toBe(9)
      }
    }
    console.info(`Leicht: geholfen im Schnitt ${(helped / total).toFixed(1)}`)
    expect(helped / total).toBeGreaterThan(5)
  })
})

describe('Haft', () => {
  it('Verhaftete kommen in der leichten Stufe nach einigen Wochen zurück', () => {
    useGame.getState().startGame({ ...draft('arbeiter', 'humanistisch'), level: 'leicht' })
    const s = useGame.getState()
    useGame.setState({
      phase: 'map',
      members: s.members.map((m) =>
        m.id === 'g1' ? { ...m, status: 'verhaftet', prison: { weeks: 2, place: 'im Polizeipräsidium am Alexanderplatz', helpedThisWeek: false, lawyer: false, packages: 0 } } : m,
      ),
      missions: [],
    })
    expect(useGame.getState().helpPrisoner('g1', 'familie')).toBeNull()
    expect(useGame.getState().helped).toBe(1)
    expect(useGame.getState().helpPrisoner('g1', 'paket')).toMatch(/schon Hilfe/)
    useGame.getState().endWeek()
    expect(useGame.getState().members.find((m) => m.id === 'g1')?.status).toBe('verhaftet')
    useGame.setState({ phase: 'map', missions: [] })
    useGame.getState().endWeek()
    const g1 = useGame.getState().members.find((m) => m.id === 'g1')!
    expect(g1.status).toBe('bereit')
    expect(useGame.getState().report?.released).toContain('g1')
  })

  it('in der leichten Stufe übernimmt jemand die Gruppe, wenn die Anführerin in Haft ist', () => {
    useGame.getState().startGame({ ...draft('arbeiter', 'humanistisch'), level: 'leicht' })
    const s = useGame.getState()
    useGame.setState({
      phase: 'map',
      missions: [],
      members: s.members.map((m) =>
        m.isLeader ? { ...m, status: 'verhaftet', prison: { weeks: 3, place: 'im Lager Oranienburg', helpedThisWeek: false, lawyer: false, packages: 0 } } : m,
      ),
    })
    useGame.getState().endWeek()
    expect(useGame.getState().report?.actingLeader).toBeDefined()
    useGame.getState().nextWeek()
    expect(useGame.getState().phase).toBe('newspaper')
  })

  it('in der schweren Stufe endet das Spiel, wenn die Anführerin verhaftet ist', () => {
    useGame.getState().startGame({ ...draft('arbeiter', 'humanistisch'), level: 'schwer' })
    const s = useGame.getState()
    useGame.setState({
      phase: 'report',
      members: s.members.map((m) => (m.isLeader ? { ...m, status: 'verhaftet' } : m)),
    })
    useGame.getState().nextWeek()
    expect(useGame.getState().endReason).toBe('verhaftet')
  })

  it('leichte Stufe: Bei Moral null rafft sich die Gruppe wieder auf', () => {
    useGame.getState().startGame({ ...draft('arbeiter', 'humanistisch'), level: 'leicht' })
    useGame.setState({ phase: 'map', missions: [], moral: 1 })
    useGame.getState().endWeek()
    const st = useGame.getState()
    expect(st.moral).toBeGreaterThan(0)
    expect(st.report?.crisis).toBe(true)
  })
})
