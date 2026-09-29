import type { Level } from './text'

/**
 * Die beiden Schwierigkeitsstufen. Die Ereignisse sind in beiden Stufen dieselben
 * und werden nicht entschärft. Es unterscheiden sich Sprache, Erfolgsaussichten,
 * Hilfen und die Folgen von Verhaftungen.
 */
export interface Difficulty {
  level: Level
  label: string
  /** Kurzbeschreibung auf dem Auswahlbildschirm */
  pitch: string
  details: string[]
  /** Zuschlag auf die Erfolgsaussicht jedes Auftrags, in Prozentpunkten */
  successBonus: number
  /** Faktor auf die Gefahr, entdeckt zu werden */
  riskFactor: number
  /** Wahrscheinlichkeit, dass eine gesuchte Person bei Entdeckung verhaftet wird */
  arrestChance: number
  /** Wahrscheinlichkeit, dass auch eine noch unbekannte Person bei Entdeckung verhaftet wird */
  arrestChanceUnknown: number
  /** Zusätzliches Geld zu Beginn */
  startKasse: number
  /** Moralverlust jede Woche */
  moralDecay: number
  /** Moralverlust je Verhaftung */
  arrestMoralLoss: number
  /** Dauer der Haft in Wochen, von bis */
  prisonWeeks: [number, number]
  /** Aussicht, dass Verhaftete nach der Haft nicht zurückkehren: [Lager oder Zuchthaus, Tod], je Kapitel */
  noReturn: { 1: [number, number]; 2: [number, number] }
  /** Kann das Spiel vorzeitig enden? */
  gameOver: boolean
  /** Ab so vielen geholfenen Menschen gibt es die zweite und dritte Stufe der Bewertung, je Kapitel */
  helpedGoals: { 1: [number, number]; 2: [number, number] }
}

export const DIFFICULTIES: Record<Level, Difficulty> = {
  leicht: {
    level: 'leicht',
    label: '6. bis 8. Klasse',
    pitch: 'Kurze Sätze und viele Erklärungen. Die Ereignisse sind genauso ernst, aber eure Gruppe hält länger durch.',
    details: [
      'Texte in einfacher Sprache',
      'Aufträge gelingen etwas öfter',
      'Wer verhaftet wird, kommt nach ein bis zwei Wochen zurück',
      'Das Spiel geht immer bis zum Ende des Kapitels',
    ],
    successBonus: 10,
    riskFactor: 0.8,
    arrestChance: 0.35,
    arrestChanceUnknown: 0,
    startKasse: 15,
    moralDecay: 2,
    arrestMoralLoss: 10,
    // Kurz genug, dass niemand lange nur zusieht. Viele „Schutzhäftlinge“ kamen 1933 nach Tagen oder Wochen frei.
    prisonWeeks: [1, 2],
    noReturn: { 1: [0, 0], 2: [0, 0] },
    gameOver: false,
    helpedGoals: { 1: [10, 24], 2: [8, 20] },
  },
  schwer: {
    level: 'schwer',
    label: 'ab 9. Klasse und Oberstufe',
    pitch: 'Ausführliche Texte mit Originalzitaten. So gefährlich, wie es wirklich war: Nicht jeder kommt aus der Haft zurück.',
    details: [
      'Ausführliche Texte und Quellen',
      'Realistische Erfolgsaussichten',
      'Manche Verhaftete kehren nicht zurück',
      'Die Gruppe kann zerschlagen werden. Danach lest ihr, wie es weiterging.',
    ],
    successBonus: 0,
    riskFactor: 1.1,
    arrestChance: 0.55,
    arrestChanceUnknown: 0.15,
    startKasse: 0,
    moralDecay: 3,
    arrestMoralLoss: 15,
    // Zwei Wochen, mit Anwalt eine. Der Ernst liegt darin, dass manche nicht zurückkommen.
    prisonWeeks: [2, 2],
    // Etwa jede fünfte Person kommt nach der Haft nicht zurück: ins Lager verurteilt oder tot
    noReturn: { 1: [0.16, 0.04], 2: [0.14, 0.06] },
    gameOver: true,
    helpedGoals: { 1: [10, 22], 2: [8, 18] },
  },
}

export const difficultyOf = (level: Level): Difficulty => DIFFICULTIES[level] ?? DIFFICULTIES.leicht
