export type StatKey = 'heimlichkeit' | 'propaganda' | 'empathie' | 'staerke' | 'bildung'
export type Stats = Record<StatKey, number>

export type Gender = 'm' | 'w'
export type FaceShape = 'oval' | 'rund' | 'kantig' | 'schmal'
export type Headwear = 'schiebermuetze' | 'fedora' | 'kurz' | 'zoepfe' | 'welle' | 'glocke'
export type Clothing = 'arbeiterjacke' | 'trenchcoat' | 'weste' | 'kleid'
export type HairTone = 'dunkel' | 'hell' | 'grau'

export interface AvatarConfig {
  gender: Gender
  face: FaceShape
  headwear: Headwear
  hairTone: HairTone
  glasses: boolean
  clothing: Clothing
}

export type ProfessionKey = 'arbeiter' | 'journalist' | 'lehrer' | 'haendler'
export type IdeologyKey = 'sozialdemokratisch' | 'kommunistisch' | 'christlich' | 'humanistisch'

/** Verhaftet und ausgewandert sind endgültig. "Gesucht" wird aus dem Fahndungsdruck abgeleitet. */
export type MemberStatus = 'bereit' | 'verletzt' | 'verhaftet' | 'ausgewandert'

export interface Character {
  id: string
  name: string
  isLeader: boolean
  avatar: AvatarConfig
  beruf: string
  bio: string
  stats: Stats
  /** Fahndungsdruck 0 bis 100 */
  heat: number
  status: MemberStatus
  /** Wochen, die eine Verletzung noch andauert */
  injuredWeeks: number
  /** Deckname in der Widerstandsgruppe */
  codename?: string
}

export interface Inventory {
  papier: number
  farbe: number
  flugblaetter: number
  ausweise: number
}
export type ItemKey = keyof Inventory

export type DistrictKey = 'mitte' | 'kreuzberg' | 'wedding' | 'neukoelln'

export type MissionType =
  | 'spenden'
  | 'papier'
  | 'druck'
  | 'verteilen'
  | 'parolen'
  | 'unterschlupf'
  | 'ausweise'
  | 'presse'
  | 'transport'
  | 'keller'
  | 'zeitung'
  | 'rotehilfe'
  | 'warnung'
  | 'nachrichten'
  | 'sportverein'
  | 'ausreise'
  | 'pakete'
  | 'reporter'

export interface Effects {
  moral?: number
  supporters?: number
  kasse?: number
  items?: Partial<Inventory>
  /** Fahndungsdruck für alle Gefährten */
  heatAll?: number
  /** Fahndungsdruck nur für die Anführerin oder den Anführer */
  heatLeader?: number
  /** setzt Merker für spätere Wochen */
  flags?: string[]
  /** Wirkung auf die Person, um die es in einer Gefährten-Geschichte geht */
  self?: { heat?: number; stat?: StatKey; statDelta?: number; emigrates?: boolean }
  /** Vertrauen der Menschen in einem Bezirk */
  trust?: Partial<Record<DistrictKey, number>>
}

export interface Mission {
  uid: string
  type: MissionType
  district: DistrictKey
  placeId: string
  assigned: string[]
}

export type Outcome = 'gelungen' | 'gescheitert'

export interface MissionResult {
  uid: string
  type: MissionType
  district: DistrictKey
  placeId: string
  team: string[]
  outcome: Outcome
  detected: boolean
  chance: number
  risk: number
  roll: number
  detectRoll: number
  text: string
  effects: Effects
  injured: string[]
  arrested: string[]
}

export interface WeekReport {
  weekIndex: number
  results: MissionResult[]
  income: number
  moralDecay: number
  idleCooled: string[]
  healed: string[]
  heatArrests: string[]
  moralBefore: number
  moralAfter: number
  supportersBefore: number
  supportersAfter: number
  kasseBefore: number
  kasseAfter: number
}

export interface Decision {
  weekIndex: number
  title: string
  /** Name der Gefährtin oder des Gefährten, falls es eine persönliche Geschichte war */
  companion?: string
  choice: string
  success: boolean | null
  result: string
}

export type Phase = 'title' | 'creation' | 'newspaper' | 'event' | 'map' | 'report' | 'end'
export type EndReason = 'kapitelende' | 'moral' | 'verhaftet'

export interface LeaderDraft {
  name: string
  groupName: string
  motto: string
  codename: string
  avatar: AvatarConfig
  profession: ProfessionKey
  ideology: IdeologyKey
}
