import { L, type Txt } from '../text'
import type { Effects, MissionResult } from '../types'

/**
 * Jede Woche ein kleines Ziel. Wer es schafft, bekommt eine Belohnung im Wochenbericht.
 * Die Ziele lenken den Blick darauf, worum es im Widerstand ging: anderen beistehen,
 * vorsichtig sein, Menschen erreichen.
 */
export interface WeekGoal {
  id: string
  text: Txt
  reward: Effects
  rewardText: Txt
  met: (r: { results: MissionResult[]; helpedDelta: number }) => boolean
}

const helfen: WeekGoal = {
  id: 'helfen',
  text: L('Helft in dieser Woche mindestens einem Menschen, der verfolgt wird.', 'Helft in dieser Woche mindestens einem verfolgten oder bedrängten Menschen.'),
  reward: { moral: 5 },
  rewardText: L('Ihr habt nicht weggesehen. Das gibt allen Kraft.', 'Ihr habt nicht weggesehen. Das stärkt den Zusammenhalt der Gruppe.'),
  met: (r) => r.helpedDelta > 0,
}

const unentdeckt: WeekGoal = {
  id: 'unentdeckt',
  text: L('Schafft einen Auftrag, ohne dass euch jemand sieht.', 'Führt mindestens einen Auftrag erfolgreich aus, ohne entdeckt zu werden.'),
  reward: { supporters: 2 },
  rewardText: L('Niemand hat euch gesehen. Zwei Menschen wollen jetzt mitmachen.', 'Eure Vorsicht zahlt sich aus: Zwei neue Unterstützer vertrauen euch.'),
  met: (r) => r.results.some((x) => x.outcome === 'gelungen' && !x.detected),
}

const erreichen: WeekGoal = {
  id: 'erreichen',
  text: L('Bringt Flugblätter oder eine Zeitung unter die Leute.', 'Erreicht mit Flugblättern oder einer eigenen Zeitung die Menschen in der Stadt.'),
  reward: { moral: 4, supporters: 1 },
  rewardText: L('Eure Worte sind angekommen. Die Leute reden darüber.', 'Eure Worte sind angekommen. In den Hinterhöfen wird darüber geflüstert.'),
  met: (r) => r.results.some((x) => (x.type === 'verteilen' || x.type === 'zeitung' || x.type === 'parolen') && x.outcome === 'gelungen'),
}

const vorsichtig: WeekGoal = {
  id: 'vorsichtig',
  text: L('Kommt diese Woche ohne Verhaftung durch.', 'Kommt durch diese Woche, ohne dass jemand aus der Gruppe verhaftet wird.'),
  reward: { moral: 4 },
  rewardText: L('Alle sind noch da. Ihr passt gut aufeinander auf.', 'Alle sind noch da. Eure Regeln haben euch geschützt.'),
  met: (r) => r.results.length > 0 && r.results.every((x) => x.arrested.length === 0),
}

/** Reihenfolge der Ziele über die 18 Wochen beider Kapitel */
const ORDER: WeekGoal[] = [
  unentdeckt, erreichen, helfen, vorsichtig, erreichen, helfen, helfen, vorsichtig, helfen, erreichen,
  vorsichtig, helfen, erreichen, helfen, vorsichtig, helfen, helfen, helfen,
]

export function weekGoal(weekIndex: number): WeekGoal {
  return ORDER[weekIndex] ?? helfen
}
