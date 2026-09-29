import { L, type Txt } from '../text'
import type { Gender, IdeologyKey, ProfessionKey, StatKey, Stats } from '../types'

export const STAT_LABELS: Record<StatKey, string> = {
  heimlichkeit: 'Heimlichkeit',
  propaganda: 'Propaganda',
  empathie: 'Empathie',
  staerke: 'Stärke',
  bildung: 'Bildung',
}

export const STAT_HINTS: Record<StatKey, string> = {
  heimlichkeit: 'Unbemerkt bleiben, Spuren verwischen, Wege kennen.',
  propaganda: 'Worte finden, die andere Menschen erreichen.',
  empathie: 'Vertrauen gewinnen und anderen Mut machen.',
  staerke: 'Schwere Arbeit, lange Nächte, schnelle Beine.',
  bildung: 'Lesen, schreiben, rechnen, eine Druckmaschine bedienen.',
}

export const STAT_ORDER: StatKey[] = ['heimlichkeit', 'propaganda', 'empathie', 'staerke', 'bildung']

export const STAT_MAX = 6

export interface Profession {
  key: ProfessionKey
  label: Record<Gender, string>
  text: Txt
  bonus: Partial<Stats>
  bonusLabel: string
  startKasse: number
  weeklyIncome: number
}

export const PROFESSIONS: Profession[] = [
  {
    key: 'arbeiter',
    label: { m: 'Arbeiter', w: 'Arbeiterin' },
    text: L('Zehn Stunden am Tag arbeitest du in der Fabrik. Du kennst die Hinterhöfe und die Kollegen, auf die man sich verlassen kann.', 'Zehn Stunden am Tag in der Fabrik. Du kennst die Hinterhöfe und die Kollegen, auf die man sich verlassen kann.'),
    bonus: { staerke: 2, heimlichkeit: 2 },
    bonusLabel: 'Stärke und Heimlichkeit',
    startKasse: 40,
    weeklyIncome: 0,
  },
  {
    key: 'journalist',
    label: { m: 'Journalist', w: 'Journalistin' },
    text: L('Du schreibst für eine Zeitung, die bald verboten wird. Du weißt, wie man mit Worten Menschen erreicht.', 'Du schreibst für ein Blatt, das bald verboten sein wird. Du weißt, wie man mit Worten Menschen bewegt.'),
    bonus: { propaganda: 2, bildung: 2 },
    bonusLabel: 'Propaganda und Bildung',
    startKasse: 40,
    weeklyIncome: 0,
  },
  {
    key: 'lehrer',
    label: { m: 'Lehrer', w: 'Lehrerin' },
    text: L('Du bist Lehrerin oder Lehrer an einer Volksschule. Die Kinder vertrauen dir. Die Eltern hören auf dich.', 'Du unterrichtest an einer Volksschule. Die Kinder vertrauen dir, und die Eltern hören auf dein Wort.'),
    bonus: { empathie: 2, bildung: 2 },
    bonusLabel: 'Empathie und Bildung',
    startKasse: 40,
    weeklyIncome: 0,
  },
  {
    key: 'haendler',
    label: { m: 'Händler', w: 'Händlerin' },
    text: L('Dir gehört ein kleiner Lebensmittelladen. Du hast immer etwas Geld. Und die Kunden erzählen dir vieles.', 'Dir gehört ein kleiner Kolonialwarenladen. Die Kasse ist nie ganz leer, und die Kundschaft erzählt dir vieles.'),
    bonus: { empathie: 2 },
    bonusLabel: 'Empathie und Reichsmark',
    startKasse: 70,
    weeklyIncome: 3,
  },
]

export interface Ideology {
  key: IdeologyKey
  label: string
  text: Txt
  bonus: Partial<Stats>
  bonusLabel: string
  startHeat: number
  startSupporters: number
  /** Um wie viel sinkt der Fahndungsdruck, wenn man eine Woche ruht */
  cooldown: number
}

export const IDEOLOGIES: Ideology[] = [
  {
    key: 'sozialdemokratisch',
    label: 'Sozialdemokratisch',
    text: L('Du glaubst an die Demokratie und an die Rechte der Arbeiter. Viele alte Freunde aus der SPD halten zu dir. Nach dem Verbot der Partei musst du vorsichtig sein.', 'Du glaubst an die Republik und an die Rechte der Arbeiter. Viele alte Parteifreunde halten noch zu dir. Spätestens mit dem Verbot der SPD im Juni 1933 wirst auch du beobachtet.'),
    bonus: { propaganda: 1 },
    bonusLabel: '+1 Propaganda, mehr Unterstützer',
    startHeat: 5,
    startSupporters: 5,
    cooldown: 8,
  },
  {
    key: 'kommunistisch',
    label: 'Kommunistisch',
    text: L('Deine Freunde aus der KPD werden als Erste verfolgt. Die Polizei kennt deinen Namen schon. Aber du weißt, wie man sich wehrt.', 'Deine Genossen werden als Erste verfolgt. Die Polizei kennt deinen Namen schon, aber du weißt, wie man sich wehrt und im Untergrund arbeitet.'),
    bonus: { staerke: 1 },
    bonusLabel: '+1 Stärke, aber bekannt bei der Polizei',
    startHeat: 20,
    startSupporters: 6,
    cooldown: 8,
  },
  {
    key: 'christlich',
    label: 'Christlich-Konservativ',
    text: L('Dein Glaube sagt dir: Hilf deinem Nächsten. Dir selbst tut niemand etwas. Du gehst sonntags in die Kirche und fällst nicht auf. Noch nicht.', 'Dein Glaube verbietet dir, Unrecht zu dulden. Dir selbst droht keine Gefahr, als Kirchgänger bist du über jeden Verdacht erhaben. Noch.'),
    bonus: { empathie: 1 },
    bonusLabel: '+1 Empathie, Verdacht verfliegt schneller',
    startHeat: 0,
    startSupporters: 3,
    cooldown: 12,
  },
  {
    key: 'humanistisch',
    label: 'Parteilos und Humanistisch',
    text: L('Du bist in keiner Partei. Dir geht es gut, dir tut niemand etwas. Aber du kannst nicht zusehen, wie andere gejagt werden.', 'Du gehörst keiner Partei an und stehst auf keiner Liste. Dir ginge es gut, wenn du einfach wegsehen würdest. Aber du folgst deinem Gewissen.'),
    bonus: { heimlichkeit: 1 },
    bonusLabel: '+1 Heimlichkeit, unbekannt bei der Polizei',
    startHeat: 0,
    startSupporters: 3,
    cooldown: 10,
  },
]

export const BASE_STATS: Stats = { heimlichkeit: 2, propaganda: 2, empathie: 2, staerke: 2, bildung: 2 }

export function getProfession(key: ProfessionKey): Profession {
  return PROFESSIONS.find((p) => p.key === key) ?? PROFESSIONS[0]
}

export function getIdeology(key: IdeologyKey): Ideology {
  return IDEOLOGIES.find((i) => i.key === key) ?? IDEOLOGIES[0]
}

export function leaderStats(profession: ProfessionKey, ideology: IdeologyKey): Stats {
  const stats = { ...BASE_STATS }
  for (const bonus of [getProfession(profession).bonus, getIdeology(ideology).bonus]) {
    for (const [k, v] of Object.entries(bonus) as [StatKey, number][]) {
      stats[k] = Math.min(STAT_MAX, stats[k] + v)
    }
  }
  return stats
}
