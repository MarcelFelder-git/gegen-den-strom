import type { Rng } from '../logic'
import type { PrisonHelp } from '../types'
import { L, type Txt } from '../text'

/**
 * Orte, an die Verhaftete aus Berlin gebracht wurden, je nach Zeit.
 * Wochen-Index: 0 bis 9 ist 1933, ab 10 sind es die Jahre 1936 bis 1938.
 */
const PLACES: { from: number; to: number; at: string }[] = [
  { from: 0, to: 9, at: 'im Polizeipräsidium am Alexanderplatz' },
  { from: 0, to: 9, at: 'in einem Keller der SA' },
  // Das SA-Gefängnis in der General-Pape-Straße bestand von März bis Dezember 1933
  { from: 3, to: 9, at: 'im SA-Gefängnis in der Papestraße' },
  // Das Lager Oranienburg ab dem 21. März 1933, Sonnenburg ab Anfang April 1933
  { from: 4, to: 9, at: 'im Lager Oranienburg' },
  { from: 6, to: 9, at: 'im Lager Sonnenburg' },
  { from: 10, to: 17, at: 'im Gefängnis der Gestapo in der Prinz-Albrecht-Straße' },
  { from: 10, to: 17, at: 'im Untersuchungsgefängnis Moabit' },
  // Das Columbia-Haus wurde im November 1936 geschlossen, Sachsenhausen ab Juli 1936 errichtet
  { from: 10, to: 12, at: 'im Columbia-Haus in Tempelhof' },
  { from: 11, to: 17, at: 'im Lager Sachsenhausen' },
]

export function prisonPlace(week: number, rng: Rng): string {
  const options = PLACES.filter((p) => week >= p.from && week <= p.to)
  return options[Math.floor(rng() * options.length)]?.at ?? 'im Polizeipräsidium am Alexanderplatz'
}

export interface PrisonHelpOption {
  kind: PrisonHelp
  label: Txt
  cost: number
  text: Txt
}

/** Hilfe von außen: So unterstützten Freunde und die Rote Hilfe die Gefangenen */
export const PRISON_HELP: PrisonHelpOption[] = [
  {
    kind: 'paket',
    label: L('Paket schicken', 'Paket mit Wäsche schicken'),
    cost: 5,
    text: L(
      'Warme Wäsche, Brot und ein Brief. So weiß die Person: Wir haben dich nicht vergessen.',
      'Wäsche, Lebensmittel und ein unverfänglicher Brief. Pakete waren oft der einzige Kontakt nach draußen und hielten den Lebensmut aufrecht.',
    ),
  },
  {
    kind: 'anwalt',
    label: L('Anwalt bezahlen', 'Einen Anwalt bezahlen'),
    cost: 15,
    text: L(
      'Ein mutiger Anwalt fragt bei der Polizei nach. Vielleicht kommt die Person früher frei.',
      'Gegen die „Schutzhaft“ gab es kein Gericht. Aber ein Anwalt konnte nachfragen, Druck machen und manchmal eine frühere Entlassung erreichen.',
    ),
  },
  {
    kind: 'familie',
    label: L('Familie versorgen', 'Die Familie versorgen'),
    cost: 8,
    text: L(
      'Ohne Lohn fehlt der Familie das Geld für Miete und Brot. Ihr helft ihr.',
      'Mit der Verhaftung fiel der Lohn weg. Geld für Miete und Brot war praktische Solidarität, wie sie die verbotene Rote Hilfe organisierte.',
    ),
  },
]
