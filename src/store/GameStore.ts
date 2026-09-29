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
import { MISSION_HELP, PRISON_FAMILY_WHO, letterFor, portraitFor, type HelpedPerson, type HelpKind } from '../game/data/helped'
import { CODENAMES } from '../game/data/group'
import { chooseGoal, goalById } from '../game/data/goals'
import { PRISON_HELP, prisonPlace } from '../game/data/prison'
import { difficultyOf } from '../game/difficulty'
import { t, type Level } from '../game/text'
import {
  AUSWEIS_HEAT_RELIEF,
  MAX_TEAM,
  EMPTY_TRUST,
  actingLeader,
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
  AvatarConfig,
  Character,
  Decision,
  Effects,
  MissionType,
  EndReason,
  IdeologyKey,
  LeaderDraft,
  Mission,
  MissionResult,
  Phase,
  PrisonHelp,
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
  /** Schwierigkeitsstufe: leicht für Klasse 6 bis 8, schwer ab Klasse 9 */
  level: Level
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
  /** Die Gruppe stand vor dem Aus und hat sich neu aufgerafft (leichte Stufe) */
  crisis: boolean
  /** Stand der geholfenen Menschen zu Beginn des Kapitels, für die Bewertung */
  chapterHelpedStart: number
  /** Die Einführung auf der Stadtkarte wurde in diesem Spiel schon gezeigt */
  tutorialSeen: boolean
  /** Die Menschen hinter der Zahl „Geholfen“ */
  helpedPeople: HelpedPerson[]
  /** Woche, in der zuletzt ein Brief kam */
  lastLetterWeek: number
  /** Das Ziel dieser Woche, beim Wochenbeginn so gewählt, dass es erreichbar ist */
  goalId?: string
  /** Stand von „Geholfen“ zu Wochenbeginn: Jede Hilfe der Woche zählt für das Ziel */
  weekHelpedStart?: number
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
  /** Hilfe von außen für eine verhaftete Person */
  helpPrisoner: (memberId: string, kind: PrisonHelp) => string | null
  endWeek: () => void
  nextWeek: () => void
  markTutorial: () => void
}

export type GameState = GameData & GameActions

export const START_MORAL = 60
/** Auf diesen Wert rafft sich die Gruppe in der leichten Stufe wieder auf */
const CRISIS_MORAL = 25

const initialData: GameData = {
  phase: 'title',
  level: 'leicht',
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
  helped: 0,
  storyIds: [],
  eventStage: 0,
  decisions: [],
  sourceAnswers: {},
  groupName: 'Tante Frieda',
  motto: 'Wir sehen nicht weg.',
  cards: [],
  pendingCards: [],
  crisis: false,
  chapterHelpedStart: 0,
  tutorialSeen: false,
  helpedPeople: [],
  lastLetterWeek: -10,
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

function companionFrom(c: (typeof COMPANIONS)[number], id: string, r: Rng, level: Level): Character {
  return {
    id,
    name: c.name,
    isLeader: false,
    avatar: c.avatar,
    beruf: c.beruf,
    bio: t(c.bio, level),
    stats: { ...c.stats },
    heat: Math.floor(r() * 3) * 5,
    status: 'bereit',
    injuredWeeks: 0,
  }
}

/** Die selbst gewählten Gefährten, aufgefüllt mit zufälligen, falls weniger als drei gewählt wurden */
function chosenCompanions(names: string[], leaderName: string, r: Rng, level: Level): Character[] {
  const chosen = names
    .map((n) => COMPANIONS.find((c) => c.name === n))
    .filter((c): c is (typeof COMPANIONS)[number] => !!c && firstName(c) !== firstName({ name: leaderName }))
    .slice(0, 3)
  const picked = chosen.map((c, i) => companionFrom(c, `g${i + 1}`, r, level))
  if (picked.length === 3) return picked
  const extra = createCompanions(leaderName, r, level, chosen.map((c) => c.name), 3 - picked.length, 'g')
  return [...picked, ...extra.map((m, i) => ({ ...m, id: `g${picked.length + i + 1}` }))]
}

function createCompanions(leaderName: string, r: Rng, level: Level, exclude: string[] = [], count = 3, idPrefix = 'g'): Character[] {
  const pool = shuffle(
    COMPANIONS.filter((c) => firstName(c) !== firstName({ name: leaderName }) && !exclude.includes(c.name)),
    r,
  )
  return pool.slice(0, count).map((c, i) => companionFrom(c, `${idPrefix}${i + 1}`, r, level))
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
  const notes: WeekNote[] = [{ text: t(week.moodText, s.level), effects: week.effects }]
  for (const c of week.conditional ?? []) {
    if ((c.ideology && c.ideology === s.ideology) || (c.profession && c.profession === s.profession)) {
      notes.push({ text: t(c.text, s.level), effects: c.effects })
    }
  }
  let next: GameData = { ...s, weekIndex: index }
  for (const n of notes) next = applyEffects(next, n.effects)
  const present = next.members.filter((m) => !m.isLeader && !isGone(m)).map((m) => m.name)
  const weekCards = cardsForWeek(index)
    .map((c) => c.id)
    .filter((id) => !next.cards.includes(id))
  const missions = generateMissions(index, next.flags, rng)
  return {
    ...next,
    goalId: chooseGoal(index, missions, next.kasse, next.inventory).id,
    weekHelpedStart: next.helped,
    // Hilfe für Gefangene ist jede Woche neu möglich
    members: next.members.map((m) => (m.prison ? { ...m, prison: { ...m.prison, helpedThisWeek: false } } : m)),
    cards: [...next.cards, ...weekCards],
    pendingCards: [...next.pendingCards, ...weekCards],
    storyIds: storiesFor(index, present).map((st) => st.id),
    eventStage: 0,
    phase: 'newspaper',
    weekNotes: notes,
    missions,
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
  // Ist die Anführerin oder der Anführer in Haft, spricht man die Person an, die jetzt die Gruppe führt
  const lead = actingLeader(members)
  const others = members.filter((m) => !m.isLeader && !isGone(m) && m.id !== lead?.id)
  return {
    self: self ? firstName(self) : '',
    name: lead ? firstName(lead) : 'Freund',
    g1: others[0] ? firstName(others[0]) : 'ein alter Freund',
    g2: others[1] ? firstName(others[1]) : others[0] ? firstName(others[0]) : 'ein Bekannter',
  }
}

/** Aussicht einer Probe in einer Entscheidungsszene */
export function checkChance(choice: EventChoice, leader: Character | undefined, level: Level = 'schwer'): number | null {
  if (!choice.check || !leader) return null
  const bonus = difficultyOf(level).successBonus
  return clamp(60 + bonus + (leader.stats[choice.check.stat] - choice.check.min) * 15, 15, 95)
}

/**
 * Leichte Stufe: Die Gruppe gibt nicht auf. Fällt die Moral auf null, rafft sie sich
 * wieder auf, verliert aber viele Unterstützer.
 */
function withCrisis(s: GameData): GameData {
  if (s.moral > 0 || difficultyOf(s.level).gameOver) return s
  return { ...s, moral: CRISIS_MORAL, supporters: Math.floor(s.supporters * 0.6), crisis: true }
}

/** Neue Gefährten, wenn niemand mehr frei ist (nur leichte Stufe) */
function recruitIfEmpty(s: GameData): { state: GameData; recruited: string[] } {
  if (difficultyOf(s.level).gameOver || s.members.some((m) => !isGone(m))) return { state: s, recruited: [] }
  const taken = s.members.map((m) => m.name)
  const leaderName = s.members.find((m) => m.isLeader)?.name ?? ''
  const fresh = createCompanions(leaderName, rng, s.level, taken, 2, `r${s.weekIndex}-`)
  const joined = withCodenames(fresh, s.members.map((m) => m.codename ?? ''))
  return {
    state: { ...s, members: [...s.members, ...joined], supporters: Math.max(0, s.supporters - 4) },
    recruited: joined.map((m) => m.id),
  }
}

interface HelpSpec {
  name: string
  who: string
  avatar: AvatarConfig
  kind: HelpKind
}

/**
 * Hält fest, wem die Gruppe geholfen hat. Taucht derselbe Name wieder auf, wächst sein Eintrag,
 * damit auf der Wand niemand doppelt steht.
 */
function recordHelp<T extends GameData>(s: T, count: number, spec: HelpSpec): T {
  if (count <= 0) return s
  const existing = s.helpedPeople.find((p) => p.name === spec.name)
  if (existing) {
    return {
      ...s,
      helpedPeople: s.helpedPeople.map((p) => (p === existing ? { ...p, count: p.count + count, week: s.weekIndex } : p)),
    }
  }
  const person: HelpedPerson = { id: `h${s.helpedPeople.length + 1}-${s.weekIndex}`, count, week: s.weekIndex, ...spec }
  return { ...s, helpedPeople: [...s.helpedPeople, person] }
}

/** Ein Mensch aus dem Namensvorrat eines Auftrags, möglichst jemand Neues */
function missionHelp(s: GameData, type: MissionType): HelpSpec | null {
  const tpl = MISSION_HELP[type]
  if (!tpl) return null
  const used = new Set(s.helpedPeople.map((p) => p.name))
  const fresh = tpl.names.filter((n) => !used.has(n.name))
  const pick = (fresh.length ? fresh : tpl.names)[Math.floor(rng() * (fresh.length || tpl.names.length))]
  return { name: pick.name, who: t(tpl.who, s.level), avatar: portraitFor(pick.name, pick.gender), kind: type as HelpKind }
}

/**
 * Etwa alle drei Wochen kommt Post von jemandem, dem die Gruppe früher geholfen hat.
 * So wird aus der Zahl wieder ein Mensch.
 */
function pickLetter(s: GameData): { person: HelpedPerson; text: string } | null {
  if (s.weekIndex - s.lastLetterWeek < 3) return null
  const person = s.helpedPeople.find((p) => !p.letter && s.weekIndex - p.week >= 2)
  if (!person) return null
  const text = t(letterFor(person, chapterOf(s.weekIndex).id === 2), s.level)
  return { person, text }
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialData,

      goTo: (phase) => set({ phase }),

      startGame: (draft, startWeek = 0) => {
        const prof = getProfession(draft.profession)
        const ideo = getIdeology(draft.ideology)
        const level = draft.level ?? 'leicht'
        const diff = difficultyOf(level)
        const leader: Character = {
          id: 'leader',
          name: draft.name.trim(),
          isLeader: true,
          avatar: draft.avatar,
          beruf: prof.label[draft.avatar.gender],
          bio: t(ideo.text, level),
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
          level,
          profession: draft.profession,
          ideology: draft.ideology,
          supporters: ideo.startSupporters + (later ? 6 : 0),
          kasse: prof.startKasse + diff.startKasse + (later ? 20 : 0),
          flags: later ? ['unterschlupf'] : [],
          inventory: { papier: 2, farbe: 1, flugblaetter: 0, ausweise: 0 },
          members: [leader, ...withCodenames(chosenCompanions(draft.companions ?? [], leader.name, rng, level), [draft.codename])],
          groupName: draft.groupName.trim() || 'Tante Frieda',
          motto: draft.motto,
        }
        set(beginWeek(base, startWeek))
      },

      continueToChapter2: () => {
        const s = get()
        if (s.endReason !== 'kapitelende' || chapterOf(s.weekIndex).id !== 1) return
        // Drei Jahre vergehen: Haft endet, Wunden heilen, der Verdacht verblasst.
        // Wer 1933 verurteilt wurde, kommt oft erst nach Jahren im Zuchthaus zurück.
        let members = s.members.map((m): Character => {
          if (m.status === 'tot' || m.status === 'ausgewandert') return m
          if (m.status === 'lager' && rng() < 0.4) return m
          return { ...m, status: 'bereit', injuredWeeks: 0, prison: undefined, heat: Math.max(0, m.heat - 40) }
        })
        const free = members.filter((m) => !m.isLeader && !isGone(m)).length
        if (free < 3) {
          const taken = members.map((m) => m.name)
          const extra = createCompanions(members.find((m) => m.isLeader)?.name ?? '', rng, s.level, taken, 3 - free, 'n')
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
              crisis: false,
              chapterHelpedStart: s.helped,
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
        const lead = actingLeader(s.members)
        const chance = checkChance(choice, lead, s.level)
        const success = chance === null ? null : rng() * 100 < chance
        const effects = success === false ? (choice.failEffects ?? {}) : choice.effects
        const rawText = success === false ? (choice.failResult ?? choice.result) : choice.result
        const text = t(rawText, s.level)
        const names = eventNames(s.members, self)
        const decision: Decision = {
          weekIndex: s.weekIndex,
          title: t(event.title, s.level),
          companion: self?.name,
          choice: fillNames(t(choice.label, s.level), names),
          success,
          result: fillNames(text, names),
        }
        let next = applyEffects(s, effects, self?.id)
        const helpedNow = next.helped - s.helped
        if (helpedNow > 0) {
          const spec: HelpSpec = choice.helps
            ? {
                name: choice.helps.name,
                who: t(choice.helps.who, s.level),
                avatar: portraitFor(choice.helps.name, choice.helps.gender),
                kind: 'begegnung',
              }
            : { name: fillNames(event.speaker, names), who: t(event.speakerRole, s.level), avatar: event.portrait, kind: 'begegnung' }
          next = recordHelp(next, helpedNow, spec)
        }
        set({
          ...next,
          eventOutcome: { choiceIndex: index, success, text, effects },
          decisions: [...s.decisions, decision],
        })
      },

      finishEvent: () => {
        let s = get()
        // Doppeltes Tippen darf keine Geschichte überspringen
        if (s.phase !== 'event' || !s.eventOutcome) return
        if (s.moral <= 0) {
          if (difficultyOf(s.level).gameOver) return set({ phase: 'end', endReason: 'moral' })
          set(withCrisis(s))
          s = get()
        }
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

      helpPrisoner: (memberId, kind) => {
        const s = get()
        if (s.phase !== 'map') return 'Hilfe lässt sich nur während der Planung organisieren.'
        const m = s.members.find((x) => x.id === memberId)
        const option = PRISON_HELP.find((o) => o.kind === kind)
        if (!m || m.status !== 'verhaftet' || !m.prison || !option) return 'Diese Person ist nicht in Haft.'
        if (m.prison.helpedThisWeek) return 'Für diese Woche ist schon Hilfe unterwegs.'
        if (kind === 'anwalt' && m.prison.lawyer) return 'Ein Anwalt kümmert sich bereits.'
        if (s.kasse < option.cost) return 'Dafür reicht das Geld in der Kasse nicht.'
        const prison = {
          ...m.prison,
          helpedThisWeek: true,
          lawyer: m.prison.lawyer || kind === 'anwalt',
          packages: m.prison.packages + (kind === 'paket' ? 1 : 0),
          // Ein Anwalt kann die Haft um eine Woche verkürzen
          weeks: kind === 'anwalt' ? Math.max(1, m.prison.weeks - 1) : m.prison.weeks,
        }
        const effects: Effects =
          kind === 'paket'
            ? { kasse: -option.cost, moral: 2 }
            : kind === 'anwalt'
              ? { kasse: -option.cost }
              : { kasse: -option.cost, moral: 2, supporters: 1, helped: 1 }
        let next = applyEffects(s, effects)
        if (kind === 'familie') {
          const name = `Familie von ${firstName(m)}`
          next = recordHelp(next, next.helped - s.helped, {
            name,
            who: t(PRISON_FAMILY_WHO, s.level),
            avatar: portraitFor(name, m.avatar.gender === 'm' ? 'w' : 'm'),
            kind: 'haft',
          })
        }
        set({ ...next, members: next.members.map((x) => (x.id === memberId ? { ...x, prison } : x)) })
        return null
      },

      endWeek: () => {
        const s = get()
        if (s.phase !== 'map') return
        const diff = difficultyOf(s.level)
        const chapterId = chapterOf(s.weekIndex).id
        const ideo = getIdeology(s.ideology)
        const prof = getProfession(s.profession)
        const before = { moral: s.moral, supporters: s.supporters, kasse: s.kasse, helped: s.helped }

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

        // Haft: Wer schon länger sitzt, kommt frei, wird verurteilt oder überlebt nicht
        const released: string[] = []
        const sentenced: string[] = []
        const died: string[] = []
        state = {
          ...state,
          members: state.members.map((m): Character => {
            if (m.status !== 'verhaftet' || !m.prison) return m
            const weeks = m.prison.weeks - 1
            if (weeks > 0) return { ...m, prison: { ...m.prison, weeks } }
            const [lager, tod] = diff.noReturn[chapterId]
            // Ein Anwalt und Pakete von außen verbessern die Aussichten
            const lagerChance = lager * (m.prison.lawyer ? 0.5 : 1)
            const todChance = tod * (m.prison.packages > 0 ? 0.6 : 1)
            const roll = rng()
            if (roll < todChance) {
              died.push(m.id)
              return { ...m, status: 'tot', prison: undefined }
            }
            if (roll < todChance + lagerChance) {
              sentenced.push(m.id)
              return { ...m, status: 'lager', prison: undefined }
            }
            released.push(m.id)
            // Freigelassene stehen unter Beobachtung und tragen die Haft mit sich
            return {
              ...m,
              status: 'bereit',
              prison: undefined,
              heat: 55,
              stats: { ...m.stats, staerke: Math.max(1, m.stats.staerke - 1) },
            }
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
            tuning: diff,
            level: s.level,
          })
          results.push(r)
          const helpedBefore = state.helped
          state = applyEffects(state, mergeEffects(r.effects, { moral: -diff.arrestMoralLoss * r.arrested.length }))
          const spec = missionHelp(state, r.type)
          if (spec) state = recordHelp(state, state.helped - helpedBefore, spec)
          const gain = heatGain(r.type, r.detected)
          state = {
            ...state,
            members: state.members.map((m) => {
              if (!r.team.includes(m.id)) return m
              if (r.arrested.includes(m.id)) return arrest(m, s.weekIndex, diff.prisonWeeks)
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
            if (active.has(m.id) || isGone(m) || m.heat === 0 || released.includes(m.id)) return m
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
            return arrest(m, s.weekIndex, diff.prisonWeeks)
          }),
        }

        const income = Math.floor(state.supporters / 3) + prof.weeklyIncome
        state = applyEffects(state, {
          kasse: income,
          moral:
            -diff.moralDecay -
            diff.arrestMoralLoss * heatArrests.length -
            diff.arrestMoralLoss * died.length +
            4 * released.length,
        })

        // Ziel der Woche
        // Jede Hilfe der Woche zählt: Begegnungen, Geschichten, Hilfe für Gefangene und Aufträge
        const goal = goalById(s.goalId, s.weekIndex)
        const goalMet = goal.met({ results, helpedDelta: state.helped - (s.weekHelpedStart ?? before.helped) })
        if (goalMet) state = applyEffects(state, goal.reward)

        // Leichte Stufe: Die Gruppe gibt nicht auf, und wenn niemand mehr frei ist, springen Unterstützer ein
        const crisis = state.crisis || (state.moral <= 0 && !diff.gameOver)
        state = withCrisis(state)
        const { state: withRecruits, recruited } = recruitIfEmpty(state)
        state = withRecruits

        const leader = state.members.find((m) => m.isLeader)
        const acting = leader && isGone(leader) && !diff.gameOver ? actingLeader(state.members) : undefined

        const letter = pickLetter(state)
        if (letter) {
          state = {
            ...state,
            lastLetterWeek: s.weekIndex,
            helpedPeople: state.helpedPeople.map((p) => (p.id === letter.person.id ? { ...p, letter: true } : p)),
          }
        }

        const report: WeekReport = {
          weekIndex: s.weekIndex,
          results,
          income,
          moralDecay: diff.moralDecay,
          idleCooled,
          healed,
          heatArrests,
          released,
          sentenced,
          died,
          actingLeader: acting?.id,
          crisis,
          recruited,
          helpedBefore: before.helped,
          helpedAfter: state.helped,
          letter: letter
            ? { name: letter.person.name, who: letter.person.who, avatar: letter.person.avatar, text: letter.text, week: letter.person.week }
            : undefined,
          goalMet,
          goalId: goal.id,
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
          crisis: false,
          phase: 'report',
          report,
          history: [...s.history, report],
          cards: [...state.cards, ...missionCards],
          pendingCards: [...state.pendingCards, ...missionCards],
        })
      },

      markTutorial: () => set({ tutorialSeen: true }),

      nextWeek: () => {
        const s = get()
        // Doppeltes Tippen darf keine Woche überspringen
        if (s.phase !== 'report') return
        const diff = difficultyOf(s.level)
        const leader = s.members.find((m) => m.isLeader)
        if (diff.gameOver) {
          if (!leader || isGone(leader)) return set({ phase: 'end', endReason: 'verhaftet' })
          if (s.moral <= 0) return set({ phase: 'end', endReason: 'moral' })
        }
        if (s.weekIndex === chapterOf(s.weekIndex).last || s.weekIndex + 1 >= TOTAL_WEEKS)
          return set({ phase: 'end', endReason: 'kapitelende' })
        set(beginWeek(s, s.weekIndex + 1))
      },
    }),
    {
      name: 'gegen-den-strom-spielstand',
      version: 3,
      // Ältere Spielstände bekommen die neuen Felder mit ihren Anfangswerten.
      // Verhaftete aus älteren Ständen bekommen eine Haftdauer, damit sie zurückkehren können.
      migrate: (persisted) => {
        const data = { ...initialData, ...(persisted as Partial<GameData>) }
        data.members = data.members.map((m) =>
          m.status === 'verhaftet' && !m.prison
            ? { ...m, prison: { weeks: 2, place: 'im Polizeipräsidium am Alexanderplatz', helpedThisWeek: false, lawyer: false, packages: 0 } }
            : m,
        )
        return data as unknown as GameState
      },
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

/** Verhaftung: Die Person kommt für einige Wochen in Haft */
function arrest(m: Character, week: number, [min, max]: [number, number]): Character {
  return {
    ...m,
    status: 'verhaftet',
    injuredWeeks: 0,
    arrests: (m.arrests ?? 0) + 1,
    prison: {
      weeks: min + Math.floor(rng() * (max - min + 1)),
      place: prisonPlace(week, rng),
      helpedThisWeek: false,
      lawyer: false,
      packages: 0,
    },
  }
}

export const selectLeader = (s: GameState) => s.members.find((m) => m.isLeader)

/** Wer die Gruppe gerade führt */
export const selectActingLeader = (s: GameState) => actingLeader(s.members)

export function hasSavedGame(s: GameState): boolean {
  if (s.members.length === 0) return false
  // Nach Kapitel 1 bleibt der Spielstand erhalten, damit es mit derselben Gruppe weitergehen kann
  return s.phase !== 'end' || (s.endReason === 'kapitelende' && s.weekIndex === CHAPTERS[1].last)
}

