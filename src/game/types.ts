export type StatKey = 'heimlichkeit' | 'propaganda' | 'empathie' | 'staerke' | 'bildung'
export type Stats = Record<StatKey, number>

export type Gender = 'm' | 'w'
export type FaceShape = 'oval' | 'rund' | 'kantig' | 'schmal'
export type Headwear = 'schiebermuetze' | 'fedora' | 'kurz' | 'zoepfe' | 'welle' | 'glocke'
export type Clothing = 'arbeiterjacke' | 'trenchcoat' | 'weste' | 'kleid'
export type HairTone = 'dunkel' | 'hell' | 'rot' | 'grau'
/** Besonderheiten im Gesicht oder an der Kleidung, mehrere zugleich möglich */
export type AvatarDetail = 'sommersprossen' | 'schal' | 'schnurrbart' | 'ohrringe'

export interface AvatarConfig {
  gender: Gender
  face: FaceShape
  headwear: Headwear
  hairTone: HairTone
  glasses: boolean
  clothing: Clothing
  details?: AvatarDetail[]
  /** Älterer Spielstand: nur eine Besonderheit */
  detail?: AvatarDetail | 'keine'
}

export type ProfessionKey = 'arbeiter' | 'journalist' | 'lehrer' | 'haendler'
export type IdeologyKey = 'sozialdemokratisch' | 'kommunistisch' | 'christlich' | 'humanistisch'

/**
 * „Verhaftet“ dauert einige Wochen. „Lager“ heißt: verurteilt oder verschleppt, kehrt in diesem Kapitel
 * nicht zurück. „Tot“ und „ausgewandert“ sind endgültig. „Gesucht“ wird aus dem Fahndungsdruck abgeleitet.
 */
export type MemberStatus = 'bereit' | 'verletzt' | 'verhaftet' | 'lager' | 'tot' | 'ausgewandert'

/** Was Verhafteten während der Haft geschieht */
export interface Prison {
  /** Wochen, bis über die Freilassung entschieden wird */
  weeks: number
  /** Wo die Person festgehalten wird */
  place: string
  /** Hilfe von außen in dieser Woche schon geleistet */
  helpedThisWeek: boolean
  /** Ein Anwalt kümmert sich */
  lawyer: boolean
  /** Pakete und Briefe halten den Mut aufrecht */
  packages: number
}

export type PrisonHelp = 'paket' | 'anwalt' | 'familie'

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
  /** Nur während der Haft */
  prison?: Prison
  /** Wie oft die Person schon in Haft war */
  arrests?: number
  /** Ursprünglicher Name, falls die Person im Spiel anders heißt, weil sie so hieß wie die eigene Figur */
  template?: string
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
  | 'besorgung'

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
  /** Verfolgte und bedrängte Menschen, denen die Gruppe geholfen hat */
  helped?: number
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
  /** Wer aus der Haft zurückkam, wer verurteilt wurde und wer nicht überlebte */
  released: string[]
  sentenced: string[]
  died: string[]
  /** Wer die Gruppe führt, solange die Anführerin oder der Anführer in Haft ist */
  actingLeader?: string
  /** Die Gruppe war am Ende und hat sich neu aufgerafft (nur leichte Stufe) */
  crisis?: boolean
  /** Neue Mitglieder, weil sonst niemand mehr frei war (nur leichte Stufe) */
  recruited: string[]
  helpedBefore: number
  helpedAfter: number
  /** Welches Ziel in dieser Woche galt */
  goalId?: string
  /** Post von jemandem, dem die Gruppe früher geholfen hat */
  letter?: { name: string; who: string; avatar: AvatarConfig; text: string; week: number }
  /** Ziel der Woche erreicht? */
  goalMet?: boolean
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
  /** Schwierigkeitsstufe, leicht für Klasse 6 bis 8 */
  level?: import('./text').Level
  name: string
  groupName: string
  motto: string
  codename: string
  avatar: AvatarConfig
  profession: ProfessionKey
  ideology: IdeologyKey
  /** Selbst gewählte Gefährten (Namen); fehlen sie, werden drei zufällig bestimmt */
  companions?: string[]
}
