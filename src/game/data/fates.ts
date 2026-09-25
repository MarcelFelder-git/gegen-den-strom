import type { Character, IdeologyKey } from '../types'

/**
 * Was aus den Figuren wahrscheinlich geworden wäre. Die Figuren sind erfunden,
 * die Wege sind es nicht: Jeder Text beschreibt, was vielen Menschen in ihrer Lage wirklich geschah.
 */
interface FateText {
  frei: string
  verhaftet: string
  ausgewandert?: string
}

const COMPANION_FATES: Record<string, FateText> = {
  'Hans Wendt': {
    frei: 'Hans hätte wohl heimlich weitergesetzt und gedruckt. Viele Drucker wie er wurden bis 1936 von der Gestapo aufgespürt, weil ihre Maschinen verräterische Spuren im Schriftbild hinterließen.',
    verhaftet: 'Hans wäre wohl nach Monaten der Schutzhaft verurteilt worden. Viele Drucker der Arbeiterpresse verbrachten Jahre in Zuchthäusern wie Brandenburg.',
  },
  'Lotte Krause': {
    frei: 'Lotte wäre vermutlich unentdeckt geblieben. Gerade Frauen wie sie, die niemand verdächtigte, trugen jahrelang Nachrichten und Geld für die Familien Verhafteter.',
    verhaftet: 'Lotte wäre wohl in das Frauenlager Moringen oder später nach Ravensbrück gebracht worden, wie viele Frauen aus dem Widerstand.',
  },
  'Erich Vogt': {
    frei: 'Erich wäre wohl von der Universität geworfen worden. Einige Studenten wie er gingen ins Ausland, andere wurden im Krieg Soldat, obwohl sie gegen diesen Krieg waren.',
    verhaftet: 'Erich wäre wohl nach der Haft von der Universität verwiesen worden und hätte unter Beobachtung gestanden, wie viele Studenten, die widersprochen hatten.',
  },
  'Trude Kowalski': {
    frei: 'Trude hätte vermutlich weiter im Warenhaus gearbeitet und Warnungen weitergegeben. Viele Helferinnen wie sie wurden nie entdeckt, und kaum jemand kennt heute ihre Namen.',
    verhaftet: 'Trude hätte nach der Haft ihre Stelle verloren. Frauen aus dem Widerstand wurden oft jahrelang von der Gestapo überwacht.',
  },
  'Heinrich Schulz': {
    frei: 'Heinrich wäre wohl Schaffner geblieben und hätte gesehen, wie ab 1941 jüdische Nachbarn mit ihren Koffern zu den Sammelstellen gehen mussten. Manche Berliner warnten Verfolgte heimlich oder gaben ihnen ein Versteck.',
    verhaftet: 'Heinrich hätte nach der Haft seine Stelle bei den Verkehrsbetrieben verloren. Wer als politisch unzuverlässig galt, fand kaum noch Arbeit.',
  },
  'Ruth Levin': {
    frei: 'Ruth wäre als Jüdin in Berlin immer mehr ausgegrenzt worden. Ab 1941 wurden die Berliner Juden deportiert. Nur wenige überlebten im Versteck, mit Hilfe mutiger Nachbarn.',
    verhaftet: 'Für eine jüdische Widerstandskämpferin wie Ruth war die Haft besonders gefährlich. Viele wurden nie mehr freigelassen und später ermordet.',
    ausgewandert: 'Ruth hätte in London gelebt und vielleicht ihr Studium beendet. Sie hätte gerettet werden können, aber viele Verwandte, die in Deutschland blieben, wurden ermordet.',
  },
  'Johannes Hartmann': {
    frei: 'Johannes hätte sich wohl der Bekennenden Kirche angeschlossen. Viele junge Pfarrer wie er wurden verwarnt, versetzt oder mit Redeverbot belegt.',
    verhaftet: 'Johannes wäre wohl als Pfarrer der Bekennenden Kirche mehrmals verhaftet worden, wie Hunderte andere in den Jahren bis 1939.',
  },
  'Anni Neumann': {
    frei: 'Anni hätte mit ihrer Schreibmaschine vermutlich weiter Flugblätter getippt. Stenotypistinnen waren im Widerstand wertvoll, weil sie schnell und sauber schrieben.',
    verhaftet: 'Anni wäre wohl zu Zuchthaus verurteilt worden. Wer Flugblätter hergestellt hatte, wurde vor Gericht wegen „Vorbereitung zum Hochverrat“ angeklagt.',
  },
  'August Brenner': {
    frei: 'August hätte wohl geschwiegen und doch geholfen. Viele Arbeiter wie er versteckten Flugblätter unter Kohlen oder warnten Kollegen, ohne je aufzufallen.',
    verhaftet: 'August wäre wohl in ein Lager wie Sachsenhausen gebracht worden, das ab 1936 bei Oranienburg entstand.',
  },
}

const LEADER_FATES: Record<IdeologyKey, string> = {
  sozialdemokratisch:
    'Als Sozialdemokrat hättest du vielleicht Kontakt zur SPD im Exil in Prag gehalten und Berichte über die Lage in Deutschland hinausgeschmuggelt. Viele solcher Gruppen flogen bis 1938 auf.',
  kommunistisch:
    'Als Kommunist wärst du in besonders großer Gefahr gewesen. Die meisten Gruppen der verbotenen KPD wurden in den ersten Jahren von der Gestapo zerschlagen, oft durch Spitzel.',
  christlich:
    'Als Christ hättest du dich vielleicht der Bekennenden Kirche angeschlossen. Einige ihrer Mitglieder versteckten später jüdische Menschen und retteten so Leben.',
  humanistisch:
    'Ohne Partei und ohne Namen auf einer Liste hättest du vielleicht jahrelang unentdeckt helfen können. Heute nennt man solche Menschen „stille Helden“. In Berlin gibt es eine Gedenkstätte für sie.',
}

export function fateOf(c: Character): string {
  const f = COMPANION_FATES[c.name]
  if (!f) return ''
  if (c.status === 'ausgewandert' && f.ausgewandert) return f.ausgewandert
  if (c.status === 'verhaftet') return f.verhaftet
  return f.frei
}

export function leaderFate(ideology: IdeologyKey, arrested: boolean): string {
  if (arrested) {
    return 'Nach der Schutzhaft hättest du, wenn du überlebt hättest, unter ständiger Beobachtung gestanden. Viele Freigelassene machten trotzdem weiter, noch vorsichtiger als zuvor.'
  }
  return LEADER_FATES[ideology]
}

/** Die ehrliche Bilanz, die am Ende jedes Spiels steht */
export const HONEST_NOTE =
  'Die meisten Widerstandsgruppen der ersten Jahre wurden von der Gestapo entdeckt und zerschlagen. Tausende ihrer Mitglieder kamen in Gefängnisse und Lager, viele wurden ermordet. Und doch zeigen sie: Es war möglich, nicht mitzumachen.'
