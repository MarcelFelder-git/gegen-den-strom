import { L, type Txt } from '../text'
import type { AvatarConfig, Clothing, FaceShape, Gender, HairTone, Headwear, MissionType } from '../types'

/**
 * Die Menschen hinter der Zahl „Geholfen“. Sie sind erfunden, aber ihre Lage war typisch:
 * Gesuchte, die ein Versteck brauchten, jüdische Nachbarn, Familien von Gefangenen, Menschen auf der Flucht.
 */
export type HelpKind = 'unterschlupf' | 'besorgung' | 'rotehilfe' | 'warnung' | 'ausreise' | 'pakete' | 'begegnung' | 'haft'

export interface HelpedPerson {
  id: string
  name: string
  who: string
  /** So viele Menschen stehen hinter dem Eintrag, etwa eine ganze Familie */
  count: number
  week: number
  avatar: AvatarConfig
  kind: HelpKind
  /** Ein Brief von dieser Person kam schon */
  letter?: boolean
  /** In welcher Woche der Brief kam */
  letterWeek?: number
}

interface HelpTemplate {
  who: Txt
  names: { name: string; gender: Gender }[]
}

export const MISSION_HELP: Partial<Record<MissionType, HelpTemplate>> = {
  unterschlupf: {
    who: L('Bei euch versteckt, als die Polizei suchte', 'Einige Nächte versteckt, während die Polizei suchte'),
    names: [
      { name: 'Kurt Mielke', gender: 'm' },
      { name: 'Erna Jacobi', gender: 'w' },
      { name: 'Paul Wrobel', gender: 'm' },
      { name: 'Käthe Marcus', gender: 'w' },
      { name: 'Otto Zielinski', gender: 'm' },
      { name: 'Ruth Goldstein', gender: 'w' },
    ],
  },
  besorgung: {
    who: L('Jüdische Nachbarn, ihr habt für sie eingekauft', 'Jüdische Nachbarn, versorgt und nicht allein gelassen'),
    names: [
      { name: 'Familie Cohn', gender: 'w' },
      { name: 'Familie Hirsch', gender: 'm' },
      { name: 'Frau Loewenthal', gender: 'w' },
      { name: 'Familie Kaufmann', gender: 'm' },
      { name: 'Herr Blumenfeld', gender: 'm' },
      { name: 'Familie Mendel', gender: 'w' },
    ],
  },
  rotehilfe: {
    who: L('Familie eines Gefangenen, mit Geld und Essen versorgt', 'Familie eines politischen Gefangenen, versorgt mit Geld und Lebensmitteln'),
    names: [
      { name: 'Familie Lindner', gender: 'w' },
      { name: 'Familie Kruse', gender: 'w' },
      { name: 'Familie Pietsch', gender: 'w' },
      { name: 'Familie Wendland', gender: 'w' },
      { name: 'Familie Schramm', gender: 'w' },
    ],
  },
  warnung: {
    who: L('Rechtzeitig vor der Polizei gewarnt', 'Vor einer Razzia gewarnt, bevor die Polizei kam'),
    names: [
      { name: 'Familie Nowak', gender: 'm' },
      { name: 'Familie Brückner', gender: 'w' },
      { name: 'Hans Kubiak', gender: 'm' },
      { name: 'Frieda Rautenberg', gender: 'w' },
    ],
  },
  ausreise: {
    who: L('Mit eurer Hilfe ins Ausland entkommen', 'Mit eurer Hilfe bei Papieren und Fahrkarten ins Ausland entkommen'),
    names: [
      { name: 'Familie Adler', gender: 'm' },
      { name: 'Ilse Perlmann', gender: 'w' },
      { name: 'Familie Stern', gender: 'w' },
      { name: 'Herr Oppenheim', gender: 'm' },
      { name: 'Familie Rosen', gender: 'm' },
    ],
  },
  pakete: {
    who: L('Im Lager, ihr habt Pakete geschickt', 'Häftling im Lager, versorgt mit euren Paketen'),
    names: [
      { name: 'Willi Tesch', gender: 'm' },
      { name: 'Ernst Hanke', gender: 'm' },
      { name: 'Paul Wolter', gender: 'm' },
      { name: 'Max Bartsch', gender: 'm' },
    ],
  },
}

export const PRISON_FAMILY_WHO: Txt = L(
  'Ihr habt sie versorgt, als jemand aus eurer Gruppe in Haft war',
  'Versorgt, während jemand aus eurer Gruppe in Haft war',
)

/** Orte, aus denen Postkarten von Ausgewanderten kommen. Viele Flüchtlinge kamen ab 1938 nach Shanghai. */
const EXILE = ['New York', 'London', 'Buenos Aires', 'Shanghai']

/**
 * Post von Menschen, denen die Gruppe geholfen hat. Nicht jede Nachricht ist tröstlich:
 * Manche Briefe kommen zurück, weil die Menschen fort sind.
 */
export function letterFor(p: HelpedPerson, laterChapter: boolean): Txt {
  const place = EXILE[Math.abs(hash(p.id)) % EXILE.length]
  switch (p.kind) {
    case 'unterschlupf':
      return L(
        'Ein Zettel ohne Absender, unter der Tür durchgeschoben: „Ich bin in Sicherheit. Ich denke jeden Tag an die Nächte bei euch. Danke.“',
        'Ein Zettel ohne Absender, unter der Tür hindurchgeschoben: „Ich bin in Sicherheit, weit weg von Berlin. Ich denke oft an die Nächte bei euch. Ihr habt mir mehr gegeben als ein Bett.“',
      )
    case 'besorgung':
      return laterChapter && hash(p.id) % 2 === 0
        ? L(
            'Euer Brief an die Familie kommt zurück. Auf dem Umschlag steht: „Empfänger unbekannt verzogen.“ Niemand im Haus weiß, wo sie jetzt sind.',
            'Euer Brief kommt ungeöffnet zurück. Auf dem Umschlag steht: „Empfänger unbekannt verzogen.“ Niemand im Haus will wissen, wohin die Familie gebracht wurde oder geflohen ist.',
          )
        : L(
            '„Danke, dass Sie noch zu uns kommen. Die meisten Nachbarn grüßen uns nicht mehr. Sie schon.“',
            '„Danke, dass Sie noch zu uns kommen. Die meisten Nachbarn sehen weg, wenn wir im Treppenhaus stehen. Sie nicht. Das vergessen wir Ihnen nicht.“',
          )
    case 'rotehilfe':
      return L(
        '„Die Miete ist bezahlt. Die Kinder haben zu essen. Mein Mann ist noch im Lager. Aber wir wissen jetzt: Wir sind nicht allein.“',
        '„Die Miete ist bezahlt, und die Kinder haben zu essen. Mein Mann ist noch immer im Lager. Aber seit ihr da wart, wissen wir, dass wir nicht vergessen sind.“',
      )
    case 'warnung':
      return L(
        'Eine Frau nickt dir auf der Straße zu. Leise sagt sie: „Wir waren nicht zu Hause, als sie kamen. Das verdanken wir euch.“',
        'Auf der Straße nickt dir eine Frau zu und flüstert im Vorbeigehen: „Wir waren nicht zu Hause, als sie kamen. Das verdanken wir euch.“',
      )
    case 'ausreise':
      return L(
        `Eine Postkarte aus ${place}: „Wir sind angekommen. Alles ist fremd, aber wir sind in Sicherheit. Wir vergessen euch nie.“`,
        `Eine Postkarte aus ${place}: „Wir sind angekommen. Die Sprache ist fremd, die Arbeit schwer, aber wir sind in Sicherheit. Viele aus unserer Familie sind noch in Deutschland. Denkt an sie.“`,
      )
    case 'pakete':
      return L(
        'Ein Brief aus dem Lager. Die Wärter lesen alles mit. Nur wenige Zeilen sind erlaubt: „Das Paket ist angekommen. Die Socken sind warm. Grüßt alle.“',
        'Ein Brief aus dem Lager, mit dem Stempel der Zensur. Nur wenige Zeilen sind erlaubt: „Das Paket ist angekommen. Die Socken sind warm. Grüßt alle, die an mich denken.“',
      )
    case 'haft':
      return L(
        '„Ohne euch hätten wir diese Wochen nicht geschafft. Danke für alles.“',
        '„Ohne eure Hilfe hätten wir diese Wochen nicht überstanden. Wir wissen, was ihr dafür riskiert habt.“',
      )
    default:
      return L(
        '„Ich habe nicht vergessen, was Sie für mich getan haben. In diesen Zeiten tut das kaum noch jemand.“',
        '„Ich habe nicht vergessen, was Sie für mich getan haben. In diesen Zeiten ist das alles andere als selbstverständlich.“',
      )
  }
}

export function hash(text: string): number {
  let h = 0
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) | 0
  return Math.abs(h)
}

const FACES: FaceShape[] = ['oval', 'rund', 'kantig', 'schmal']
const HEAD: Record<Gender, Headwear[]> = { m: ['schiebermuetze', 'fedora', 'kurz'], w: ['zoepfe', 'welle', 'glocke', 'kurz'] }
const CLOTHES: Record<Gender, Clothing[]> = { m: ['arbeiterjacke', 'trenchcoat', 'weste'], w: ['kleid', 'trenchcoat', 'arbeiterjacke'] }
const HAIR: HairTone[] = ['dunkel', 'dunkel', 'hell', 'grau']

/** Ein festes Gesicht für einen Namen, damit dieselbe Person immer gleich aussieht */
export function portraitFor(name: string, gender: Gender): AvatarConfig {
  const h = hash(name)
  return {
    gender,
    face: FACES[h % FACES.length],
    headwear: HEAD[gender][(h >> 3) % HEAD[gender].length],
    hairTone: HAIR[(h >> 5) % HAIR.length],
    glasses: (h >> 7) % 4 === 0,
    clothing: CLOTHES[gender][(h >> 9) % CLOTHES[gender].length],
  }
}
