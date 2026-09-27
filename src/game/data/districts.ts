import { L, type Txt } from '../text'
import type { DistrictKey } from '../types'

export type Point = [number, number]

export interface Place {
  id: string
  name: string
  /** Ortsangabe für Fließtext, etwa „im Hinterhof in der Kösliner Straße“ */
  at: string
  x: number
  y: number
}

export interface District {
  key: DistrictKey
  name: string
  text: Txt
  /** Umriss im Kartenraster 1000 x 700 */
  polygon: Point[]
  /** Linke obere Ecke des Bezirksschilds */
  plaque: Point
  places: Place[]
  /** Überwachung durch SA und Polizei je Woche (Index = Woche) */
  surveillance: number[]
  /** Wie es im Bezirk gerade aussieht, ab welcher Woche (Index) */
  situation: { from: number; text: Txt }[]
  /** Auftrag, den es nur hier gibt */
  special: Txt
}

/*
 * Maße der Kartenelemente im Kartenraster. Der Geometrie-Test in map.test.ts
 * stellt sicher, dass Schilder und Marker vollständig in ihrem Bezirk liegen
 * und sich nirgends überschneiden.
 */
export const MAP_W = 1000
export const MAP_H = 700
export const PLAQUE_W = 184
export const PLAQUE_H = 50
export const MARKER_R = 21
/** Umriss eines Markers samt Namensschild darunter, relativ zum Mittelpunkt */
export const MARKER_BOX = { left: 40, right: 40, top: 27, bottom: 50 }

export const DISTRICTS: District[] = [
  {
    key: 'wedding',
    name: 'Wedding',
    text: L('Der „Rote Wedding“. Große Mietshäuser, Fabriken und viele Kommunisten und Sozialdemokraten.', 'Der „Rote Wedding“. Mietskasernen, Fabriken und viele Kommunisten und Sozialdemokraten.'),
    polygon: [[170, 40], [420, 24], [660, 40], [700, 120], [690, 236], [520, 250], [310, 246], [200, 200]],
    plaque: [212, 56],
    places: [
      { id: 'koesliner', name: 'Hinterhof in der Kösliner Straße', at: 'im Hinterhof in der Kösliner Straße', x: 300, y: 158 },
      { id: 'aeg', name: 'Werkstor der AEG an der Brunnenstraße', at: 'am Werkstor der AEG an der Brunnenstraße', x: 505, y: 92 },
      { id: 'leopoldplatz', name: 'Kneipe am Leopoldplatz', at: 'in der Kneipe am Leopoldplatz', x: 425, y: 180 },
      { id: 'schillerpark', name: 'Laubenkolonie am Schillerpark', at: 'in der Laubenkolonie am Schillerpark', x: 625, y: 150 },
    ],
    surveillance: [10, 12, 22, 22, 24, 24, 24, 28, 28, 30, 30, 30, 26, 30, 32, 32, 36, 34],
    special: L('Familien von Verhafteten helfen', 'Familien von Verhafteten unterstützen'),
    situation: [
      { from: 0, text: L('Aus manchen Fenstern hängen noch rote Fahnen. In den Kneipen streiten die Leute laut über die neue Regierung.', 'Aus manchen Fenstern hängen noch rote Fahnen. In den Kneipen wird laut über die neue Regierung gestritten.') },
      { from: 2, text: L('Nach dem Reichstagsbrand durchsucht die SA jedes Haus. Viele Männer sind verschwunden. Ihre Familien haben jetzt kein Geld mehr.', 'Nach dem Reichstagsbrand durchsucht die SA die Mietskasernen Haus für Haus. Viele Männer sind verschwunden, ihre Familien stehen ohne Lohn da.') },
      { from: 7, text: 'In den Kneipen redet niemand mehr offen. Jeder könnte ein Spitzel sein.' },
      { from: 10, text: L('Die alten Freunde sind verhaftet, geflohen oder still. Wer noch weitermacht, kennt nur zwei oder drei andere. So kann er niemanden verraten.', 'Die alten Genossen sind verhaftet, geflohen oder schweigen. Wer noch weitermacht, kennt nur zwei oder drei andere, damit er niemanden verraten kann.') },
      { from: 16, text: L('In der Nacht des Pogroms wurden auch hier die Scheiben jüdischer Geschäfte eingeschlagen. Die Nachbarn standen am Fenster und schauten zu.', 'In der Nacht des Pogroms wurden auch hier die Scheiben jüdischer Geschäfte eingeschlagen. Die Nachbarn standen am Fenster.') },
    ],
  },
  {
    key: 'mitte',
    name: 'Mitte',
    text: L('Die Mitte der Stadt. Hier sind die Regierung, große Kaufhäuser und die Polizei am Alexanderplatz. Überall wird beobachtet.', 'Das Herz der Stadt. Regierungsviertel, Warenhäuser und das Polizeipräsidium am Alexanderplatz. Überall sind Augen.'),
    polygon: [[310, 246], [520, 250], [690, 236], [770, 300], [760, 420], [620, 436], [460, 440], [330, 420], [300, 330]],
    plaque: [322, 262],
    places: [
      { id: 'linienstrasse', name: 'Kellerdruckerei in der Linienstraße', at: 'in der Kellerdruckerei in der Linienstraße', x: 578, y: 285 },
      { id: 'scheunenviertel', name: 'Scheunenviertel, Grenadierstraße', at: 'im Scheunenviertel in der Grenadierstraße', x: 672, y: 284 },
      { id: 'hackescher', name: 'Hinterhaus am Hackeschen Markt', at: 'im Hinterhaus am Hackeschen Markt', x: 420, y: 356 },
      { id: 'opernplatz', name: 'Universität am Opernplatz', at: 'vor der Universität am Opernplatz', x: 530, y: 368 },
      { id: 'alexanderplatz', name: 'Unter den Bögen am Alexanderplatz', at: 'unter den Bögen am Alexanderplatz', x: 668, y: 368 },
    ],
    surveillance: [16, 18, 22, 22, 26, 28, 28, 32, 32, 34, 34, 34, 30, 34, 36, 36, 38, 36],
    special: L('Eine Warnung aus der Polizei weitergeben', 'Eine Warnung aus dem Präsidium weitergeben'),
    situation: [
      { from: 0, text: L('Rund um die Regierung marschieren Männer in Uniform. Im Scheunenviertel leben viele arme jüdische Familien. Sie sehen das mit Sorge.', 'Rund um die Regierungsgebäude marschieren Kolonnen. Im Scheunenviertel leben viele arme jüdische Familien, die das mit Sorge beobachten.') },
      { from: 4, text: L('Das Parlament hat keine Macht mehr. An den Ämtern hängen neue Fahnen. Bei der Polizei stapeln sich die Akten.', 'Das Parlament hat sich selbst entmachtet. An den Amtsgebäuden hängen neue Fahnen, im Polizeipräsidium stapeln sich die Akten.') },
      { from: 8, text: L('Die Gestapo sitzt jetzt in der Prinz-Albrecht-Straße. Wer dort hineingebracht wird, kommt oft lange nicht wieder heraus.', 'Die Gestapo hat ihren Sitz in der Prinz-Albrecht-Straße bezogen. Wer dort hineingebracht wird, kommt oft lange nicht wieder heraus.') },
      { from: 10, text: L('Die Stadt wird für die Olympischen Spiele schön gemacht. Die Schilder gegen Juden verschwinden, für ein paar Wochen.', 'Die Stadt wird für die Olympischen Spiele herausgeputzt. Die Schilder gegen Juden verschwinden, für ein paar Wochen.') },
      { from: 16, text: L('Im Scheunenviertel sind die Scheiben kaputt. Die Neue Synagoge steht noch, weil ein Polizist das Feuer löschen ließ.', 'Im Scheunenviertel sind die Scheiben zerschlagen. Die Neue Synagoge in der Oranienburger Straße steht noch, weil ein Polizist das Feuer löschen ließ.') },
    ],
  },
  {
    key: 'kreuzberg',
    name: 'Kreuzberg',
    text: L('Hier an der Kochstraße werden die Zeitungen gemacht. Dazu Hinterhöfe, Werkstätten und der Landwehrkanal.', 'Das Zeitungsviertel an der Kochstraße, Hinterhöfe, Werkstätten und der Landwehrkanal. Hier wird gedruckt, was die Stadt liest.'),
    polygon: [[330, 420], [460, 440], [620, 436], [650, 520], [630, 660], [420, 670], [320, 620], [300, 500]],
    plaque: [340, 452],
    places: [
      { id: 'kochstrasse', name: 'Zeitungsviertel an der Kochstraße', at: 'im Zeitungsviertel an der Kochstraße', x: 380, y: 548 },
      { id: 'mariannenplatz', name: 'Hinterhof am Mariannenplatz', at: 'im Hinterhof am Mariannenplatz', x: 578, y: 488 },
      { id: 'goerlitzer', name: 'Görlitzer Bahnhof', at: 'am Görlitzer Bahnhof', x: 572, y: 588 },
      { id: 'marheineke', name: 'Markthalle am Marheinekeplatz', at: 'in der Markthalle am Marheinekeplatz', x: 475, y: 590 },
    ],
    surveillance: [10, 12, 14, 16, 18, 20, 20, 30, 30, 32, 30, 30, 26, 30, 32, 32, 34, 32],
    special: 'Nachrichten aus dem Ausland abschreiben',
    situation: [
      { from: 0, text: 'Im Zeitungsviertel wird noch gedruckt, was der Regierung nicht gefällt. Noch.' },
      { from: 2, text: L('Die Zeitungen der Linken sind verboten, ihre Druckereien zugesperrt. Viele Drucker haben keine Arbeit mehr.', 'Die Zeitungen der Linken sind verboten, ihre Druckereien versiegelt. Viele Setzer und Drucker stehen ohne Arbeit auf der Straße.') },
      { from: 7, text: L('Keine Zeitung schreibt mehr gegen die Regierung. Die Wahrheit steht nur noch in Zeitungen aus dem Ausland.', 'Keine Zeitung schreibt mehr gegen die Regierung. Die Wahrheit steht nur noch in Blättern aus dem Ausland.') },
      { from: 10, text: L('Die großen Zeitungen gehören jetzt der Partei. Wer anders denkt, schreibt nur noch heimlich.', 'Die großen Verlage gehören jetzt der Partei. Wer anders denkt, schreibt nur noch für die Schublade.') },
      { from: 16, text: L('Jüdische Familien müssen ihre Möbel billig verkaufen, um die Flucht ins Ausland bezahlen zu können.', 'Jüdische Familien verkaufen ihre Möbel für einen Bruchteil des Wertes, um die Ausreise bezahlen zu können.') },
    ],
  },
  {
    key: 'neukoelln',
    name: 'Neukölln',
    text: L('Ein Bezirk der Arbeiter im Südosten, mit dem alten Dorf Rixdorf in der Mitte. Die Menschen hier halten zusammen.', 'Arbeiterbezirk im Südosten, mit dem alten Dorf Rixdorf in seiner Mitte. Die Menschen hier halten zusammen, wenn es darauf ankommt.'),
    polygon: [[620, 436], [760, 420], [900, 440], [950, 560], [920, 680], [640, 680], [630, 660], [650, 520]],
    plaque: [700, 450],
    places: [
      { id: 'hermannplatz', name: 'Vor dem Warenhaus am Hermannplatz', at: 'vor dem Warenhaus am Hermannplatz', x: 692, y: 546 },
      { id: 'rathaus', name: 'Kellerlokal beim Rathaus Neukölln', at: 'im Kellerlokal beim Rathaus Neukölln', x: 800, y: 546 },
      { id: 'richardplatz', name: 'Schmiede am Richardplatz', at: 'in der Schmiede am Richardplatz', x: 870, y: 628 },
      { id: 'hermannstrasse', name: 'Hinterhof in der Hermannstraße', at: 'im Hinterhof in der Hermannstraße', x: 760, y: 628 },
    ],
    surveillance: [10, 10, 18, 18, 20, 20, 20, 26, 26, 28, 28, 28, 24, 28, 30, 30, 34, 32],
    special: L('Heimliches Treffen des Sportvereins der Arbeiter', 'Heimliches Treffen des Arbeitersportvereins'),
    situation: [
      { from: 0, text: L('Die Sportvereine der Arbeiter trainieren noch in ihren Hallen. Die Menschen hier halten zusammen.', 'Die Arbeitersportvereine trainieren noch in ihren Hallen. Die Menschen hier halten zusammen.') },
      { from: 3, text: L('Die Vereine der Arbeiter sind verboten. Man trifft sich jetzt heimlich und tut so, als wäre man eine Wandergruppe.', 'Die Arbeitervereine sind verboten, ihre Hallen beschlagnahmt. Man trifft sich nun heimlich, getarnt als Wandergruppe oder Kartenrunde.') },
      { from: 8, text: L('Im Rathaus sitzen jetzt Nazis. Die gewählten Vertreter der Linken sind abgesetzt oder verhaftet.', 'Im Rathaus sitzen neue Männer. Die gewählten Stadtverordneten der Linken sind abgesetzt oder verhaftet.') },
      { from: 10, text: L('Überall hängen Fahnen. In den Höfen wird Geld für die Winterhilfe gesammelt. Die Menschen sind vorsichtig geworden.', 'Überall hängen Fahnen, auf den Höfen wird für die Winterhilfe gesammelt. Die Menschen sind vorsichtig geworden.') },
      { from: 16, text: L('Viele jüdische Männer aus dem Bezirk wurden ins Lager Sachsenhausen gebracht. Ihre Frauen warten vor den Ämtern.', 'Viele jüdische Männer aus dem Bezirk wurden nach Sachsenhausen gebracht. Ihre Frauen stehen vor den Ämtern Schlange.') },
    ],
  },
]

export interface Landmark {
  id: string
  label: string
  x: number
  y: number
  kind: 'dome' | 'gate' | 'block' | 'stadium'
  /** ab welcher Woche (Index) sichtbar */
  from: number
  danger?: boolean
  /** Beschriftungsfeld relativ zum Mittelpunkt */
  box: { left: number; right: number; top: number; bottom: number }
}

export const LANDMARKS: Landmark[] = [
  { id: 'reichstag', label: 'Reichstag', x: 222, y: 296, kind: 'dome', from: 0, box: { left: 78, right: 78, top: 30, bottom: 30 } },
  { id: 'tor', label: 'Brandenburger Tor', x: 240, y: 392, kind: 'gate', from: 0, box: { left: 64, right: 64, top: 14, bottom: 30 } },
  { id: 'gestapo', label: 'Gestapo', x: 262, y: 478, kind: 'block', from: 8, danger: true, box: { left: 34, right: 34, top: 12, bottom: 30 } },
  { id: 'stadion', label: 'Olympiastadion', x: 84, y: 214, kind: 'stadium', from: 12, box: { left: 60, right: 60, top: 20, bottom: 30 } },
]

export function toPath(points: Point[]): string {
  return `M${points.map(([x, y]) => `${x} ${y}`).join(' L')} Z`
}

export function getDistrict(key: DistrictKey): District {
  return DISTRICTS.find((d) => d.key === key) ?? DISTRICTS[0]
}

export const PLACES: (Place & { district: DistrictKey })[] = DISTRICTS.flatMap((d) =>
  d.places.map((p) => ({ ...p, district: d.key })),
)

export function getPlace(placeId: string): Place & { district: DistrictKey } {
  return PLACES.find((p) => p.id === placeId) ?? PLACES[0]
}

export function surveillanceAt(district: DistrictKey, week: number): number {
  const s = getDistrict(district).surveillance
  return s[Math.min(week, s.length - 1)]
}

export function surveillanceLabel(value: number): string {
  if (value >= 28) return 'sehr hoch'
  if (value >= 20) return 'hoch'
  if (value >= 14) return 'mittel'
  return 'gering'
}

export function situationAt(district: DistrictKey, week: number): Txt {
  const list = getDistrict(district).situation
  return [...list].reverse().find((x) => week >= x.from)?.text ?? list[0].text
}

/** Überwachung als Stufe von 1 bis 5 für die Anzeige */
export function surveillanceLevel(value: number): number {
  if (value >= 32) return 5
  if (value >= 28) return 4
  if (value >= 20) return 3
  if (value >= 14) return 2
  return 1
}
