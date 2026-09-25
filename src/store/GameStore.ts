import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { COMPANIONS } from '../game/data/companions'
import { MISSIONS } from '../game/data/missions'
import { getIdeology, getProfession, leaderStats } from '../game/data/professions'
import { TOTAL_WEEKS, WEEKS, type EventChoice, type StoryEvent } from '../game/data/weeks'
import { getStory, storiesFor } from '../game/data/stories'
import { CHAPTERS, chapterOf } from '../game/data/chapters'
import { SOURCES } from '../game/data/sources'
import { cardsForMission, cardsForWeek } from '../game/data/cards'
import { CODENAMES } from '../game/data/group'
import {
  ARREST_MORAL_LOSS,
  AUSWEIS_HEAT_RELIEF,
  MAX_TEAM,
  EMPTY_TRUST,
  WEEKLY_MORAL_DECAY,
  applyEffects,
  canAfford,
  clamp,
  costAsEffects,
  fillNames,
  firstName,
  generateMissions,
  heatGain,
  isAvailable,
  isGone,
  mergeEffects,
  resolveMission,
  type ResourceState,
  type Rng,
} from '../game/logic'
import type {
  Character,
  Decision,
  Effects,
  EndReason,
  IdeologyKey,
  LeaderDraft,
  Mission,
  MissionResult,
  Phase,
  ProfessionKey,
  WeekReport,
} from '../game/types'

export interface WeekNote {
  text: string
  effects: Effects
}

export interface EventOutcome {
  choiceIndex: number
  /** null, wenn die Wahl keine Probe verlangte */
  success: boolean | null
  text: string
  effects: Effects
}

interface GameData extends ResourceState {
  phase: Phase
  weekIndex: number
  profession: ProfessionKey
  ideology: IdeologyKey
  missions: Mission[]
  weekNotes: WeekNote[]
  eventOutcome: EventOutcome | null
  report: WeekReport | null
  history: WeekReport[]
  endReason: EndReason | null
  /** Persönliche Geschichten dieser Woche, nach der Begegnung */
  storyIds: string[]
  /** 0 = Begegnung der Woche, danach die Geschichten der Reihe nach */
  eventStage: number
  decisions: Decision[]
  /** Antworten auf die Quelle der Woche: Woche als Schlüssel, richtig oder falsch */
  sourceAnswers: Record<string, boolean>
  /** Name und Leitspruch der Widerstandsgruppe */
  groupName: string
  motto: string
  /** Freigeschaltete Vorbilder-Karten */
  cards: string[]
  /** Karten, die gerade neu sind und noch gezeigt werden müssen */
  pendingCards: string[]
}

interface GameActions {
  goTo: (phase: 'title' | 'creation') => void
  startGame: (draft: LeaderDraft, startWeek?: number) => void
  /** Nach dem Ende von Kapitel 1 mit derselben Gruppe weiterspielen */
  continueToChapter2: () => void
  answerSource: (optionIndex: number) => boolean
  dismissCards: () => void
  closeNewspaper: () => void
  chooseEventOption: (index: number) => void
  finishEvent: () => void
  /** Liefert eine Fehlermeldung oder null bei Erfolg */
  assign: (missionUid: string, memberIds: string[]) => string | null
  unassign: (missionUid: string) => void
  giveAusweis: (memberId: string) => void
  endWeek: () => void
  nextWeek: () => void
}

export type GameState = GameData & GameActions

export const START_MORAL = 60

const initialData: GameData = {
  phase: 'title',
  weekIndex: 0,
  profession: 'arbeiter',
  ideology: 'humanistisch',
  moral: START_MORAL,
  supporters: 0,
  kasse: 0,
  inventory: { papier: 0, farbe: 0, flugblaetter: 0, ausweise: 0 },
  members: [],
  flags: [],
  missions: [],
  weekNotes: [],
  eventOutcome: null,
  report: null,
  history: [],
  endReason: null,
  trust: { ...EMPTY_TRUST },
  storyIds: [],
  eventStage: 0,
  decisions: [],
  sourceAnswers: {},
  groupName: 'Morgenrot',
  motto: 'Wir schweigen nicht.',
  cards: [],
  pendingCards: [],
}

const rng: Rng = Math.random

function shuffle<T>(items: T[], r: Rng): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function createCompanions(leaderName: string, r: Rng): Character[] {
  const pool = shuffle(
    COMPANIONS.filter((c) => firstName(c) !== firstName({ name: leaderName })),
    r,
  )
  return pool.slice(0, 3).map((c, i) => ({
    id: `g${i + 1}`,
    name: c.name,
    isLeader: false,
    avatar: c.avatar,
    beruf: c.beruf,
    bio: c.bio,
    stats: { ...c.stats },
    heat: Math.floor(r() * 3) * 5,
    status: 'bereit',
    injuredWeeks: 0,
  }))
}

/** Vergibt freie Decknamen an neue Gefährten */
function withCodenames(list: Character[], taken: string[]): Character[] {
  const free = shuffle(
    CODENAMES.filter((c) => !taken.includes(c)),
    rng,
  )
  return list.map((c, i) => ({ ...c, codename: c.codename ?? free[i % free.length] }))
}

/** Wochenbeginn: Zeitungsmeldung wirkt, neue Aufträge erscheinen */
function beginWeek(s: GameData, index: number): GameData {
  const week = WEEKS[index]
  const notes: WeekNote[] = [{ text: week.moodText, effects: week.effects }]
  for (const c of week.conditional ?? []) {
    if ((c.ideology && c.ideology === s.ideology) || (c.profession && c.profession === s.profession)) {
      notes.push({ text: c.text, effects: c.effects })
    }
  }
  let next: GameData = { ...s, weekIndex: index }
  for (const n of notes) next = applyEffects(next, n.effects)
  const present = next.members.filter((m) => !m.isLeader && !isGone(m)).map((m) => m.name)
  const weekCards = cardsForWeek(index)
    .map((c) => c.id)
    .filter((id) => !next.cards.includes(id))
  return {
    ...next,
    cards: [...next.cards, ...weekCards],
    pendingCards: [...next.pendingCards, ...weekCards],
    storyIds: storiesFor(index, present).map((st) => st.id),
    eventStage: 0,
    phase: 'newspaper',
    weekNotes: notes,
    missions: generateMissions(index, next.flags, rng),
    eventOutcome: null,
    report: null,
  }
}

export interface CurrentEvent {
  event: StoryEvent
  /** Bei Gefährten-Geschichten: die Person, um die es geht */
  self?: Character
}

/** Die Begegnung, die gerade an der Reihe ist */
export function currentEvent(s: Pick<GameData, 'weekIndex' | 'eventStage' | 'storyIds' | 'members'>): CurrentEvent {
  if (s.eventStage > 0) {
    const st = getStory(s.storyIds[s.eventStage - 1])
    const self = st && s.members.find((m) => m.name === st.companion)
    if (st && self) return { event: st.event, self }
  }
  return { event: WEEKS[s.weekIndex].event }
}

export function eventNames(members: Character[], self?: Character): Record<string, string> {
  const leader = members.find((m) => m.isLeader)
  const others = members.filter((m) => !m.isLeader && !isGone(m))
  return {
    self: self ? firstName(self) : '',
    name: leader?.name ?? 'Freund',
    g1: others[0] ? firstName(others[0]) : 'ein alter Freund',
    g2: others[1] ? firstName(others[1]) : others[0] ? firstName(others[0]) : 'ein Bekannter',
  }
}

/** Aussicht einer Probe in einer Entscheidungsszene */
export function checkChance(choice: EventChoice, leader: Character | undefined): number | null {
  if (!choice.check || !leader) return null
  return clamp(60 + (leader.stats[choice.check.stat] - choice.check.min) * 15, 15, 95)
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialData,

      goTo: (phase) => set({ phase }),

      startGame: (draft, startWeek = 0) => {
        const prof = getProfession(draft.profession)
        const ideo = getIdeology(draft.ideology)
        const leader: Character = {
          id: 'leader',
          name: draft.name.trim(),
          isLeader: true,
          avatar: draft.avatar,
          beruf: prof.label[draft.avatar.gender],
          bio: ideo.text,
          stats: leaderStats(draft.profession, draft.ideology),
          heat: startWeek > 0 ? 0 : ideo.startHeat,
          status: 'bereit',
          injuredWeeks: 0,
          codename: draft.codename,
        }
        // Wer direkt in Kapitel 2 einsteigt, hat schon drei Jahre im Untergrund hinter sich
        const later = startWeek >= CHAPTERS[2].first
        const base: GameData = {
          ...initialData,
          profession: draft.profession,
          ideology: draft.ideology,
          supporters: ideo.startSupporters + (later ? 6 : 0),
          kasse: prof.startKasse + (later ? 20 : 0),
          flags: later ? ['unterschlupf'] : [],
          inventory: { papier: 2, farbe: 1, flugblaetter: 0, ausweise: 0 },
          members: [leader, ...withCodenames(createCompanions(leader.name, rng), [draft.codename])],
          groupName: draft.groupName.trim() || 'Morgenrot',
          motto: draft.motto,
        }
        set(beginWeek(base, startWeek))
      },

      continueToChapter2: () => {
        const s = get()
        if (s.endReason !== 'kapitelende' || chapterOf(s.weekIndex).id !== 1) return
        // Drei Jahre vergehen: Wunden heilen, der Verdacht verblasst, Lücken werden gefüllt
        let members = s.members.map((m) =>
          isGone(m) ? m : { ...m, status: 'bereit' as const, injuredWeeks: 0, heat: Math.max(0, m.heat - 40) },
        )
        const free = members.filter((m) => !m.isLeader && !isGone(m)).length
        if (free < 3) {
          const taken = new Set(members.map((m) => m.name))
          const extra = createCompanions(members.find((m) => m.isLeader)?.name ?? '', rng)
            .filter((c) => !taken.has(c.name))
            .slice(0, 3 - free)
            .map((c, i) => ({ ...c, id: `n${i + 1}` }))
          members = [...members, ...withCodenames(extra, members.map((m) => m.codename ?? ''))]
        }
        set(
          beginWeek(
            {
              ...s,
              members,
              moral: Math.max(s.moral, 45),
              endReason: null,
              report: null,
            },
            CHAPTERS[2].first,
          ),
        )
      },

      answerSource: (optionIndex) => {
        const s = get()
        const key = String(s.weekIndex)
        const src = SOURCES[s.weekIndex]
        if (!src || key in s.sourceAnswers) return s.sourceAnswers[key] ?? false
        const correct = optionIndex === src.answer
        // Wer Bescheid weiß, lässt sich weniger einschüchtern
        set({ ...applyEffects(s, { moral: correct ? 2 : 0 }), sourceAnswers: { ...s.sourceAnswers, [key]: correct } })
        return correct
      },

      dismissCards: () => set({ pendingCards: [] }),

      closeNewspaper: () => set({ phase: 'event' }),

      chooseEventOption: (index) => {
        const s = get()
        if (s.eventOutcome) return
        const { event, self } = currentEvent(s)
        const choice = event.choices[index]
        if (!choice || (choice.needsKasse ?? 0) > s.kasse) return
        const leader = s.members.find((m) => m.isLeader)
        const chance = checkChance(choice, leader)
        const success = chance === null ? null : rng() * 100 < chance
        const effects = success === false ? (choice.failEffects ?? {}) : choice.effects
        const text = success === false ? (choice.failResult ?? choice.result) : choice.result
        const names = eventNames(s.members, self)
        const decision: Decision = {
          weekIndex: s.weekIndex,
          title: event.title,
          companion: self?.name,
          choice: fillNames(choice.label, names),
          success,
          result: fillNames(text, names),
        }
        set({
          ...applyEffects(s, effects, self?.id),
          eventOutcome: { choiceIndex: index, success, text, effects },
          decisions: [...s.decisions, decision],
        })
      },

      finishEvent: () => {
        const s = get()
        if (s.moral <= 0) return set({ phase: 'end', endReason: 'moral' })
        // Weitere Geschichten dieser Woche, sofern die Person noch da ist
        let stage = s.eventStage + 1
        while (stage <= s.storyIds.length) {
          const st = getStory(s.storyIds[stage - 1])
          const who = st && s.members.find((m) => m.name === st.companion)
          if (who && !isGone(who)) return set({ eventStage: stage, eventOutcome: null })
          stage++
        }
        set({ phase: 'map' })
      },

      assign: (missionUid, memberIds) => {
        const s = get()
        const mission = s.missions.find((m) => m.uid === missionUid)
        if (!mission) return 'Dieser Auftrag existiert nicht mehr.'
        if (memberIds.length === 0) return 'Wähle mindestens einen Gefährten aus.'
        if (memberIds.length > MAX_TEAM) return `Höchstens ${MAX_TEAM} Gefährten pro Auftrag.`
        const busy = new Set(s.missions.filter((m) => m.uid !== missionUid).flatMap((m) => m.assigned))
        for (const id of memberIds) {
          const member = s.members.find((m) => m.id === id)
          if (!member || !isAvailable(member)) return 'Nicht alle Gefährten sind einsatzbereit.'
          if (busy.has(id)) return `${firstName(member)} ist bereits für einen anderen Auftrag eingeteilt.`
        }
        const template = MISSIONS[mission.type]
        let next: GameData = s
        if (mission.assigned.length === 0) {
          if (!canAfford(template, s.kasse, s.inventory)) return 'Dafür reichen die Mittel der Gruppe nicht.'
          next = applyEffects(s, costAsEffects(template, -1))
        }
        set({
          ...next,
          missions: s.missions.map((m) => (m.uid === missionUid ? { ...m, assigned: [...memberIds] } : m)),
        })
        return null
      },

      unassign: (missionUid) => {
        const s = get()
        const mission = s.missions.find((m) => m.uid === missionUid)
        if (!mission || mission.assigned.length === 0) return
        set({
          ...applyEffects(s, costAsEffects(MISSIONS[mission.type], 1)),
          missions: s.missions.map((m) => (m.uid === missionUid ? { ...m, assigned: [] } : m)),
        })
      },

      giveAusweis: (memberId) => {
        const s = get()
        if (s.inventory.ausweise <= 0) return
        set({
          inventory: { ...s.inventory, ausweise: s.inventory.ausweise - 1 },
          members: s.members.map((m) =>
            m.id === memberId && !isGone(m) ? { ...m, heat: Math.max(0, m.heat - AUSWEIS_HEAT_RELIEF) } : m,
          ),
        })
      },

      endWeek: () => {
        const s = get()
        if (s.phase !== 'map') return
        const ideo = getIdeology(s.ideology)
        const prof = getProfession(s.profession)
        const before = { moral: s.moral, supporters: s.supporters, kasse: s.kasse }

        // Verletzungen der Vorwoche heilen aus
        const healed: string[] = []
        let state: GameData = {
          ...s,
          members: s.members.map((m) => {
            if (m.status !== 'verletzt') return m
            const left = m.injuredWeeks - 1
            if (left > 0) return { ...m, injuredWeeks: left }
            healed.push(m.id)
            return { ...m, status: 'bereit', injuredWeeks: 0 }
          }),
        }

        // Aufträge auswürfeln
        const results: MissionResult[] = []
        for (const mission of s.missions) {
          if (mission.assigned.length === 0) continue
          const team = mission.assigned
            .map((id) => state.members.find((m) => m.id === id))
            .filter((m): m is Character => !!m && m.status === 'bereit')
          if (team.length === 0) continue
          const r = resolveMission(mission, team, s.weekIndex, rng, {
            flags: state.flags,
            trust: state.trust[mission.district],
          })
          results.push(r)
          state = applyEffects(state, mergeEffects(r.effects, { moral: -ARREST_MORAL_LOSS * r.arrested.length }))
          const gain = heatGain(r.type, r.detected)
          state = {
            ...state,
            members: state.members.map((m) => {
              if (!r.team.includes(m.id)) return m
              if (r.arrested.includes(m.id)) return { ...m, status: 'verhaftet' }
              const heat = clamp(m.heat + gain, 0, 100)
              if (r.injured.includes(m.id)) return { ...m, heat, status: 'verletzt', injuredWeeks: 1 }
              return { ...m, heat }
            }),
          }
        }

        // Wer ruht, gerät etwas aus dem Blick
        const active = new Set(results.flatMap((r) => r.team))
        const idleCooled: string[] = []
        state = {
          ...state,
          members: state.members.map((m) => {
            if (active.has(m.id) || isGone(m) || m.heat === 0) return m
            idleCooled.push(m.id)
            return { ...m, heat: Math.max(0, m.heat - (m.isLeader ? ideo.cooldown : 8)) }
          }),
        }

        // Wer zu bekannt ist, wird abgeholt
        const heatArrests: string[] = []
        state = {
          ...state,
          members: state.members.map((m) => {
            if (isGone(m) || m.heat < 100) return m
            heatArrests.push(m.id)
            return { ...m, status: 'verhaftet' }
          }),
        }

        const income = Math.floor(state.supporters / 3) + prof.weeklyIncome
        state = applyEffects(state, {
          kasse: income,
          moral: -WEEKLY_MORAL_DECAY - ARREST_MORAL_LOSS * heatArrests.length,
        })

        const report: WeekReport = {
          weekIndex: s.weekIndex,
          results,
          income,
          moralDecay: WEEKLY_MORAL_DECAY,
          idleCooled,
          healed,
          heatArrests,
          moralBefore: before.moral,
          moralAfter: state.moral,
          supportersBefore: before.supporters,
          supportersAfter: state.supporters,
          kasseBefore: before.kasse,
          kasseAfter: state.kasse,
        }
        const missionCards = results
          .filter((r) => r.outcome === 'gelungen')
          .flatMap((r) => cardsForMission(r.type, s.weekIndex))
          .map((c) => c.id)
          .filter((id, i, all) => !state.cards.includes(id) && all.indexOf(id) === i)
        set({
          ...state,
          phase: 'report',
          report,
          history: [...s.history, report],
          cards: [...state.cards, ...missionCards],
          pendingCards: [...state.pendingCards, ...missionCards],
        })
      },

      nextWeek: () => {
        const s = get()
        const leader = s.members.find((m) => m.isLeader)
        if (!leader || leader.status === 'verhaftet') return set({ phase: 'end', endReason: 'verhaftet' })
        if (s.moral <= 0) return set({ phase: 'end', endReason: 'moral' })
        if (s.weekIndex === chapterOf(s.weekIndex).last || s.weekIndex + 1 >= TOTAL_WEEKS)
          return set({ phase: 'end', endReason: 'kapitelende' })
        set(beginWeek(s, s.weekIndex + 1))
      },
    }),
    {
      name: 'gegen-den-strom-spielstand',
      version: 2,
      // Ältere Spielstände bekommen die neuen Felder mit ihren Anfangswerten
      migrate: (persisted) => ({ ...initialData, ...(persisted as Partial<GameData>) }) as GameState,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        const data: Partial<GameState> = { ...s }
        for (const key of Object.keys(data) as (keyof GameState)[]) {
          if (typeof data[key] === 'function') delete data[key]
        }
        return data
      },
    },
  ),
)

export const selectLeader = (s: GameState) => s.members.find((m) => m.isLeader)

export function hasSavedGame(s: GameState): boolean {
  if (s.members.length === 0) return false
  // Nach Kapitel 1 bleibt der Spielstand erhalten, damit es mit derselben Gruppe weitergehen kann
  return s.phase !== 'end' || (s.endReason === 'kapitelende' && s.weekIndex === CHAPTERS[1].last)
}
