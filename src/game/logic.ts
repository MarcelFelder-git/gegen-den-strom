import { DETECTED_EFFECTS, DETECTION_HEAT, MISSIONS, type MissionTemplate } from './data/missions'
import { getPlace, surveillanceAt } from './data/districts'
import { t as txt, type Level } from './text'
import type { Character, DistrictKey, Effects, Inventory, ItemKey, Mission, MissionResult, MissionType } from './types'

export type Rng = () => number

export const WANTED_THRESHOLD = 70
export const MAX_TEAM = 3
export const INJURY_CHANCE_WHEN_DETECTED = 0.2
export const AUSWEIS_HEAT_RELIEF = 35

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function pick<T>(items: readonly T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length) % items.length]
}

export function rollD100(rng: Rng): number {
  return 1 + Math.floor(rng() * 100)
}

export const firstName = (c: Pick<Character, 'name'>) => c.name.trim().split(/\s+/)[0]

export function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  return `${names.slice(0, -1).join(', ')} und ${names[names.length - 1]}`
}

export const isWanted = (c: Pick<Character, 'heat'>) => c.heat >= WANTED_THRESHOLD

export const isAvailable = (c: Character) => c.status === 'bereit'

/** Wer in Haft, im Lager, tot oder ausgewandert ist, kann gerade nicht mitmachen */
export const isGone = (c: Pick<Character, 'status'>) =>
  c.status === 'verhaftet' || c.status === 'lager' || c.status === 'tot' || c.status === 'ausgewandert'

/** Wer in diesem Kapitel sicher nicht mehr zurückkommt */
export const isLost = (c: Pick<Character, 'status'>) => c.status === 'lager' || c.status === 'tot' || c.status === 'ausgewandert'

/** Wer die Gruppe gerade führt: die Anführerin oder der Anführer, sonst der erste freie Gefährte */
export function actingLeader<T extends Pick<Character, 'isLeader' | 'status'>>(members: T[]): T | undefined {
  const leader = members.find((m) => m.isLeader)
  if (leader && !isGone(leader)) return leader
  return members.find((m) => !m.isLeader && !isGone(m))
}

/** Stellschrauben der Schwierigkeitsstufe für einen einzelnen Auftrag */
export interface MissionTuning {
  successBonus: number
  riskFactor: number
  /** Verhaftung bei Entdeckung, wenn die Person schon gesucht wird */
  arrestChance: number
  /** Verhaftung bei Entdeckung, auch wenn die Person noch unbekannt ist */
  arrestChanceUnknown: number
}

export const DEFAULT_TUNING: MissionTuning = { successBonus: 0, riskFactor: 1, arrestChance: 0.5, arrestChanceUnknown: 0 }

export type Trust = Record<DistrictKey, number>
export const EMPTY_TRUST: Trust = { wedding: 0, mitte: 0, kreuzberg: 0, neukoelln: 0 }
export const TRUST_MAX = 5
/** So viel Gefahr nimmt jede Stufe Vertrauen im Bezirk weg */
export const TRUST_RISK_RELIEF = 2

/** Wie stark weitere Personen zählen: Die beste zählt voll, jede weitere weniger */
const TEAM_WEIGHTS = [1, 0.6, 0.35]
/** Zusätzliche Gefahr für jede weitere Person im Team */
export const EXTRA_MEMBER_RISK = 8

/**
 * Hauptwert und halber Nebenwert, die stärkste Person zählt voll, weitere weniger.
 * Mehr Leute helfen also, machen einen Auftrag aber nicht sicher.
 */
export function teamPower(t: MissionTemplate, members: Character[]): number {
  return members
    .map((m) => m.stats[t.primary] + m.stats[t.secondary] * 0.5)
    .sort((a, b) => b - a)
    .reduce((sum, v, i) => sum + v * (TEAM_WEIGHTS[i] ?? 0.25), 0)
}

export function successChance(t: MissionTemplate, members: Character[], bonus = 0): number {
  if (members.length === 0) return 0
  return clamp(Math.round(45 + bonus + (teamPower(t, members) - t.difficulty) * 9), 5, 95)
}

export function detectionRisk(
  t: MissionTemplate,
  district: DistrictKey,
  members: Character[],
  week: number,
  trust = 0,
  factor = 1,
): number {
  if (members.length === 0) return 0
  const bestStealth = Math.max(...members.map((m) => m.stats.heimlichkeit))
  const avgHeat = members.reduce((s, m) => s + m.heat, 0) / members.length
  const raw =
    t.baseRisk +
    surveillanceAt(district, week) * 0.6 +
    (members.length - 1) * EXTRA_MEMBER_RISK -
    bestStealth * 3 +
    avgHeat * 0.2 -
    trust * TRUST_RISK_RELIEF
  return clamp(Math.round(raw * factor), 3, 90)
}

/**
 * Ersetzt {team}, {ort}, {Ort} sowie grammatische Weichen:
 * {einzahl|mehrzahl} und {männlich|weiblich|mehrzahl}.
 */
export function fillMissionText(text: string, team: Character[], placeAt: string): string {
  const plural = team.length > 1
  const female = !plural && team[0]?.avatar.gender === 'w'
  return text
    .replace(/\{team\}/g, joinNames(team.map(firstName)))
    .replace(/\{ort\}/g, placeAt)
    .replace(/\{Ort\}/g, placeAt.charAt(0).toUpperCase() + placeAt.slice(1))
    .replace(/\{([^{}|]+)\|([^{}|]+)(?:\|([^{}|]+))?\}/g, (_m, a: string, b: string, c?: string) => {
      if (c === undefined) return plural ? b : a
      return plural ? c : female ? b : a
    })
}

export function fillNames(text: string, names: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (m, key: string) => names[key] ?? m)
}

export function canAfford(t: MissionTemplate, kasse: number, inv: Inventory): boolean {
  if ((t.cost.kasse ?? 0) > kasse) return false
  return Object.entries(t.cost.items ?? {}).every(([k, v]) => inv[k as ItemKey] >= (v ?? 0))
}

export function missingForCost(t: MissionTemplate, kasse: number, inv: Inventory): string[] {
  const missing: string[] = []
  const needKasse = t.cost.kasse ?? 0
  if (needKasse > kasse) missing.push(`${needKasse - kasse} Reichsmark`)
  for (const [k, v] of Object.entries(t.cost.items ?? {}) as [ItemKey, number][]) {
    if (inv[k] < v) missing.push(`${v - inv[k]} ${ITEM_LABELS[k].unit(v - inv[k])} ${ITEM_LABELS[k].name}`)
  }
  return missing
}

export const ITEM_LABELS: Record<ItemKey, { name: string; unit: (n: number) => string }> = {
  papier: { name: 'Papier', unit: () => 'Ries' },
  farbe: { name: 'Druckfarbe', unit: (n) => (n === 1 ? 'Dose' : 'Dosen') },
  flugblaetter: { name: 'Flugblätter', unit: () => 'Bündel' },
  ausweise: { name: 'Ausweise', unit: () => 'gefälschte' },
}

export function describeItem(k: ItemKey, n: number): string {
  if (k === 'ausweise') return n === 1 ? '1 gefälschter Ausweis' : `${n} gefälschte Ausweise`
  return `${n} ${ITEM_LABELS[k].unit(n)} ${ITEM_LABELS[k].name}`
}

export function costAsEffects(t: MissionTemplate, sign: 1 | -1): Effects {
  const items: Partial<Inventory> = {}
  for (const [k, v] of Object.entries(t.cost.items ?? {}) as [ItemKey, number][]) items[k] = v * sign
  return { kasse: (t.cost.kasse ?? 0) * sign, items }
}

export function mergeEffects(a: Effects, b: Effects): Effects {
  const items: Partial<Inventory> = { ...a.items }
  for (const [k, v] of Object.entries(b.items ?? {}) as [ItemKey, number][]) items[k] = (items[k] ?? 0) + v
  const sum = (x?: number, y?: number) => (x === undefined && y === undefined ? undefined : (x ?? 0) + (y ?? 0))
  return {
    moral: sum(a.moral, b.moral),
    supporters: sum(a.supporters, b.supporters),
    kasse: sum(a.kasse, b.kasse),
    heatAll: sum(a.heatAll, b.heatAll),
    heatLeader: sum(a.heatLeader, b.heatLeader),
    items: Object.keys(items).length ? items : undefined,
    flags: [...(a.flags ?? []), ...(b.flags ?? [])],
    self: b.self ?? a.self,
    trust: mergeTrust(a.trust, b.trust),
    helped: sum(a.helped, b.helped),
  }
}

function mergeTrust(a?: Partial<Trust>, b?: Partial<Trust>): Partial<Trust> | undefined {
  if (!a && !b) return undefined
  const out: Partial<Trust> = { ...a }
  for (const [k, v] of Object.entries(b ?? {}) as [DistrictKey, number][]) out[k] = (out[k] ?? 0) + v
  return out
}

export interface ResourceState {
  moral: number
  supporters: number
  kasse: number
  inventory: Inventory
  members: Character[]
  flags: string[]
  trust: Trust
  helped: number
}

/**
 * Wendet Effekte an und hält alle Werte in ihren Grenzen.
 * selfId bestimmt, wen die Wirkung „self“ einer Gefährten-Geschichte trifft.
 */
export function applyEffects<S extends ResourceState>(s: S, e: Effects, selfId?: string): S {
  const inventory = { ...s.inventory }
  for (const [k, v] of Object.entries(e.items ?? {}) as [ItemKey, number][]) inventory[k] = Math.max(0, inventory[k] + v)
  const members = s.members.map((m) => {
    if (isGone(m)) return m
    const own = m.id === selfId ? e.self : undefined
    const delta = (e.heatAll ?? 0) + (m.isLeader ? (e.heatLeader ?? 0) : 0) + (own?.heat ?? 0)
    let next = delta ? { ...m, heat: clamp(m.heat + delta, 0, 100) } : m
    if (own?.stat && own.statDelta) next = { ...next, stats: { ...next.stats, [own.stat]: clamp(next.stats[own.stat] + own.statDelta, 1, 6) } }
    if (own?.emigrates) next = { ...next, status: 'ausgewandert' }
    return next
  })
  const trust = { ...s.trust }
  for (const [k, v] of Object.entries(e.trust ?? {}) as [DistrictKey, number][]) trust[k] = clamp((trust[k] ?? 0) + v, 0, TRUST_MAX)
  return {
    ...s,
    moral: clamp(s.moral + (e.moral ?? 0), 0, 100),
    supporters: Math.max(0, s.supporters + (e.supporters ?? 0)),
    kasse: Math.max(0, s.kasse + (e.kasse ?? 0)),
    inventory,
    members,
    flags: Array.from(new Set([...s.flags, ...(e.flags ?? [])])),
    trust,
    helped: Math.max(0, s.helped + (e.helped ?? 0)),
  }
}

/** Aufträge, die Verfolgten helfen, und ab welcher Woche es sie gibt */
const SOLIDARITY: { type: MissionType; from: number; flag?: string }[] = [
  // Nach dem Reichstagsbrand
  { type: 'unterschlupf', from: 0, flag: 'unterschlupf' },
  { type: 'rotehilfe', from: 2 },
  { type: 'warnung', from: 3 },
  // Ab dem Boykott vom 1. April 1933: jüdischen Nachbarn beistehen
  { type: 'besorgung', from: 5 },
  // Ab 1936
  { type: 'pakete', from: 11 },
]

/** Bezirksaufträge ohne direkte Hilfe für Verfolgte */
const DISTRICT_SPECIALS: { type: MissionType; from: number }[] = [
  { type: 'nachrichten', from: 1 },
  { type: 'sportverein', from: 3 },
]

export interface MissionSupply {
  kasse: number
  inventory: Inventory
}

/** Ohne Angaben: der Vorrat zu Spielbeginn */
const START_SUPPLY: MissionSupply = { kasse: 40, inventory: { papier: 2, farbe: 1, flugblaetter: 0, ausweise: 0 } }

/** Der nächste Schritt zur eigenen Druckerei, danach die eigene Zeitung */
export function projectStep(flags: string[]): MissionType {
  if (!flags.includes('presse')) return 'presse'
  if (!flags.includes('transport')) return 'transport'
  if (!flags.includes('druckerei')) return 'keller'
  return 'zeitung'
}

/**
 * Höchstens sieben Aufträge pro Woche, damit die Karte überschaubar bleibt und jede Wahl zählt:
 * das Vorhaben, bis zu zwei Hilfen für Verfolgte, ein Bezirksauftrag, Spenden und zwei Aufträge
 * rund um Flugblätter, passend zum Vorrat der Gruppe.
 */
export function generateMissions(week: number, flags: string[], rng: Rng, supply: MissionSupply = START_SUPPLY): Mission[] {
  const { kasse, inventory: inv } = supply
  // Vorhaben und Bezirksaufträge zuerst, weil sie nur wenige mögliche Orte haben
  const types: MissionType[] = []
  if (week === 12) types.push('reporter')
  if (week >= 1) types.push(projectStep(flags))
  const specials = DISTRICT_SPECIALS.filter((d) => week >= d.from).map((d) => d.type)
  if (specials.length) types.push(specials[Math.floor(rng() * specials.length)])

  // Hilfe für Verfolgte: die Ausreise, sobald es sie gibt, sonst zwei zufällige, bezahlbare zuerst
  const help = SOLIDARITY.filter((h) => week >= h.from && (!h.flag || flags.includes(h.flag))).map((h) => h.type)
  const chosen: MissionType[] = []
  if (week >= 15 || flags.includes('levy')) chosen.push('ausreise')
  const pool = help
    .map((type) => ({ type, order: rng() + (canAfford(MISSIONS[type], kasse, inv) ? 0 : 1) }))
    .sort((a, b) => a.order - b.order)
    .map((h) => h.type)
  for (const type of pool) if (chosen.length < 2) chosen.push(type)
  types.push(...chosen)

  // Grundaufträge: Spenden immer, dazu was zum Vorrat passt
  types.push('spenden')
  const chain: MissionType[] = []
  if (inv.flugblaetter >= 2) chain.push('verteilen')
  if (inv.papier >= 2 && inv.farbe >= 1) chain.push('druck')
  if (inv.farbe >= 1) chain.push('parolen')
  chain.push('papier', 'druck', 'parolen')
  if (week >= 2 && rng() < 0.35) chain.splice(1, 0, 'ausweise')
  const basics = [...new Set(chain)]
  // Ohne Vorhaben und Hilfen in den ersten Wochen dürfen es ein paar Grundaufträge mehr sein
  const room = Math.max(2, 5 - types.length)
  types.push(...basics.slice(0, room))

  const used = new Set<string>()
  const missions: Mission[] = []
  types.forEach((type, i) => {
    const candidates = MISSIONS[type].places.filter((p) => !used.has(p))
    if (candidates.length === 0) return
    const placeId = pick(candidates, rng)
    used.add(placeId)
    missions.push({ uid: `w${week}-${i}-${type}`, type, placeId, district: getPlace(placeId).district, assigned: [] })
  })
  return missions
}

export interface MissionContext {
  flags?: string[]
  trust?: number
  tuning?: MissionTuning
  level?: Level
}

export function resolveMission(
  mission: Mission,
  team: Character[],
  week: number,
  rng: Rng,
  ctx: MissionContext = {},
): MissionResult {
  const t = MISSIONS[mission.type]
  const place = getPlace(mission.placeId)
  const tuning = ctx.tuning ?? DEFAULT_TUNING
  const chance = successChance(t, team, tuning.successBonus)
  const risk = detectionRisk(t, mission.district, team, week, ctx.trust ?? 0, tuning.riskFactor)
  const roll = rollD100(rng)
  const detectRoll = rollD100(rng)
  const success = roll <= chance
  const detected = detectRoll <= risk

  let effects: Effects = success ? t.success(rng, ctx.flags ?? []) : { ...t.failure }
  if (detected) effects = mergeEffects(effects, DETECTED_EFFECTS)
  // Gelungene Einsätze schaffen Vertrauen im Bezirk, Entdeckungen zerstören es
  const trustDelta = (success ? 1 : 0) - (detected ? 1 : 0)
  if (trustDelta) effects = mergeEffects(effects, { trust: { [mission.district]: trustDelta } })

  const level = ctx.level ?? 'schwer'
  const say = (list: typeof t.texts.success) => txt(pick(list, rng), level)
  let text: string
  if (!detected) text = say(success ? t.texts.success : t.texts.failure)
  else if (success) text = `${say(t.texts.success)} Doch {team} {wurde|wurden} dabei beobachtet.`
  else text = say(t.texts.detected)

  const injured: string[] = []
  const arrested: string[] = []
  if (detected) {
    for (const m of team) {
      if (isWanted(m) && rng() < tuning.arrestChance) arrested.push(m.id)
      else if (!isWanted(m) && rng() < tuning.arrestChanceUnknown) arrested.push(m.id)
      else if (rng() < INJURY_CHANCE_WHEN_DETECTED) injured.push(m.id)
    }
  }

  return {
    uid: mission.uid,
    type: mission.type,
    district: mission.district,
    placeId: mission.placeId,
    team: team.map((m) => m.id),
    outcome: success ? 'gelungen' : 'gescheitert',
    detected,
    chance,
    risk,
    roll,
    detectRoll,
    text: fillMissionText(text, team, place.at),
    effects,
    injured,
    arrested,
  }
}

export function heatGain(type: MissionType, detected: boolean): number {
  return MISSIONS[type].heat + (detected ? DETECTION_HEAT : 0)
}

/** Einfacher, reproduzierbarer Zufallsgenerator für Tests */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type DangerTier = 'gering' | 'mittel' | 'hoch'

/** Grobe Gefahr für eine einzelne, unauffällige Person: für die Übersicht auf der Karte */
export function dangerEstimate(t: MissionTemplate, district: DistrictKey, week: number, trust = 0, factor = 1): number {
  return clamp(Math.round((t.baseRisk + surveillanceAt(district, week) * 0.6 - 6 - trust * TRUST_RISK_RELIEF) * factor), 3, 90)
}

export function dangerTier(risk: number): DangerTier {
  if (risk >= 28) return 'hoch'
  if (risk >= 15) return 'mittel'
  return 'gering'
}
