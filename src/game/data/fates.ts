import { L, type Txt } from '../text'
import type { Character, IdeologyKey } from '../types'

/**
 * Was aus den Figuren wahrscheinlich geworden wäre. Die Figuren sind erfunden,
 * die Wege sind es nicht: Jeder Text beschreibt, was vielen Menschen in ihrer Lage wirklich geschah.
 */
interface FateText {
  frei: Txt
  verhaftet: Txt
  ausgewandert?: Txt
}

const COMPANION_FATES: Record<string, FateText> = {
  'Hans Wendt': {
    frei: L(
      'Hans hätte wohl heimlich weiter gedruckt. Viele Drucker wie er wurden bis 1936 von der Gestapo gefunden. Ihre Maschinen hinterließen Spuren im Druck, an denen man sie erkannte.',
      'Hans hätte wohl heimlich weitergesetzt und gedruckt. Viele Drucker wie er wurden bis 1936 von der Gestapo aufgespürt, weil ihre Maschinen verräterische Spuren im Schriftbild hinterließen.',
    ),
    verhaftet: L(
      'Hans wäre wohl vor Gericht gekommen. Viele Drucker der Arbeiterzeitungen saßen jahrelang im Zuchthaus, zum Beispiel in Brandenburg.',
      'Hans wäre wohl nach Monaten der Schutzhaft verurteilt worden. Viele Drucker der Arbeiterpresse verbrachten Jahre in Zuchthäusern wie Brandenburg.',
    ),
  },
  'Lotte Krause': {
    frei: L(
      'Lotte wäre wohl nie entdeckt worden. Gerade Frauen wie sie verdächtigte niemand. Sie trugen jahrelang Nachrichten und Geld für die Familien von Verhafteten.',
      'Lotte wäre vermutlich unentdeckt geblieben. Gerade Frauen wie sie, die niemand verdächtigte, trugen jahrelang Nachrichten und Geld für die Familien Verhafteter.',
    ),
    verhaftet: L(
      'Lotte wäre wohl in das Frauenlager Moringen gekommen, später vielleicht nach Ravensbrück. So erging es vielen Frauen aus dem Widerstand.',
      'Lotte wäre wohl in das Frauenlager Moringen oder später nach Ravensbrück gebracht worden, wie viele Frauen aus dem Widerstand.',
    ),
  },
  'Erich Vogt': {
    frei: L(
      'Erich wäre wohl von der Universität geworfen worden. Manche Studenten wie er gingen ins Ausland. Andere mussten im Krieg Soldat werden, obwohl sie gegen diesen Krieg waren.',
      'Erich wäre wohl von der Universität geworfen worden. Einige Studenten wie er gingen ins Ausland, andere wurden im Krieg Soldat, obwohl sie gegen diesen Krieg waren.',
    ),
    verhaftet: L(
      'Erich hätte nach der Haft nicht weiter studieren dürfen. Die Polizei hätte ihn beobachtet, wie viele Studenten, die widersprochen hatten.',
      'Erich wäre wohl nach der Haft von der Universität verwiesen worden und hätte unter Beobachtung gestanden, wie viele Studenten, die widersprochen hatten.',
    ),
  },
  'Trude Kowalski': {
    frei: L(
      'Trude hätte wohl weiter im Kaufhaus gearbeitet und Warnungen weitergegeben. Viele Helferinnen wie sie wurden nie entdeckt. Kaum jemand kennt heute ihre Namen.',
      'Trude hätte vermutlich weiter im Warenhaus gearbeitet und Warnungen weitergegeben. Viele Helferinnen wie sie wurden nie entdeckt, und kaum jemand kennt heute ihre Namen.',
    ),
    verhaftet: L(
      'Trude hätte nach der Haft ihre Arbeit verloren. Frauen aus dem Widerstand wurden oft jahrelang von der Gestapo beobachtet.',
      'Trude hätte nach der Haft ihre Stelle verloren. Frauen aus dem Widerstand wurden oft jahrelang von der Gestapo überwacht.',
    ),
  },
  'Heinrich Schulz': {
    frei: L(
      'Heinrich wäre wohl Schaffner geblieben. Ab 1941 hätte er gesehen, wie jüdische Nachbarn mit ihren Koffern zu den Sammelstellen gehen mussten. Manche Berliner warnten Verfolgte heimlich oder versteckten sie.',
      'Heinrich wäre wohl Schaffner geblieben und hätte gesehen, wie ab 1941 jüdische Nachbarn mit ihren Koffern zu den Sammelstellen gehen mussten. Manche Berliner warnten Verfolgte heimlich oder gaben ihnen ein Versteck.',
    ),
    verhaftet: L(
      'Heinrich hätte nach der Haft seine Arbeit verloren. Wer als Gegner galt, fand kaum noch eine Stelle.',
      'Heinrich hätte nach der Haft seine Stelle bei den Verkehrsbetrieben verloren. Wer als politisch unzuverlässig galt, fand kaum noch Arbeit.',
    ),
  },
  'Grete Hoffmann': {
    frei: L(
      'Grete hätte der Familie Levin wohl weiter geholfen, so lange es ging. Später hätte sie vielleicht Juden versteckt, als die Deportationen begannen. Solche Menschen ehrt man heute als „Gerechte unter den Völkern“.',
      'Grete hätte der Familie Levin wohl bis zuletzt beigestanden. Als ab 1941 die Deportationen begannen, versteckten Menschen wie sie jüdische Nachbarn. In Berlin überlebten so etwa 1.700 Jüdinnen und Juden im Untergrund. Heute ehrt man ihre Helfer als „Gerechte unter den Völkern“.',
    ),
    verhaftet: L(
      'Grete wäre nach der Haft als „Judenfreundin“ beschimpft worden. Die Polizei hätte sie beobachtet. Viele Helferinnen wie sie machten trotzdem weiter.',
      'Grete wäre nach der Haft als „Judenfreundin“ gebrandmarkt und überwacht worden. Wer Juden half, riskierte ab 1941 selbst das Lager. Viele machten trotzdem weiter.',
    ),
  },
  'Johannes Hartmann': {
    frei: L(
      'Johannes wäre wohl zur Bekennenden Kirche gegangen. Viele junge Pfarrer wie er wurden verwarnt, versetzt oder durften nicht mehr predigen.',
      'Johannes hätte sich wohl der Bekennenden Kirche angeschlossen. Viele junge Pfarrer wie er wurden verwarnt, versetzt oder mit Redeverbot belegt.',
    ),
    verhaftet: L(
      'Johannes wäre wohl als Pfarrer der Bekennenden Kirche mehrmals verhaftet worden. So erging es Hunderten Pfarrern bis 1939.',
      'Johannes wäre wohl als Pfarrer der Bekennenden Kirche mehrmals verhaftet worden, wie Hunderte andere in den Jahren bis 1939.',
    ),
  },
  'Anni Neumann': {
    frei: L(
      'Anni hätte mit ihrer Schreibmaschine wohl weiter Flugblätter getippt. Frauen, die schnell und sauber tippen konnten, waren für den Widerstand sehr wertvoll.',
      'Anni hätte mit ihrer Schreibmaschine vermutlich weiter Flugblätter getippt. Stenotypistinnen waren im Widerstand wertvoll, weil sie schnell und sauber schrieben.',
    ),
    verhaftet: L(
      'Anni wäre wohl zu Zuchthaus verurteilt worden. Wer Flugblätter gemacht hatte, kam wegen „Hochverrat“ vor Gericht.',
      'Anni wäre wohl zu Zuchthaus verurteilt worden. Wer Flugblätter hergestellt hatte, wurde wegen „Vorbereitung zum Hochverrat“ angeklagt.',
    ),
  },
  'August Brenner': {
    frei: L(
      'August hätte wohl geschwiegen und trotzdem geholfen. Viele Arbeiter wie er versteckten Flugblätter unter Kohlen oder warnten Kollegen, ohne je aufzufallen.',
      'August hätte wohl geschwiegen und doch geholfen. Viele Arbeiter wie er versteckten Flugblätter unter Kohlen oder warnten Kollegen, ohne je aufzufallen.',
    ),
    verhaftet: L(
      'August wäre wohl in ein Lager wie Sachsenhausen gekommen. Das wurde ab 1936 bei Oranienburg gebaut.',
      'August wäre wohl in ein Lager wie Sachsenhausen gebracht worden, das ab 1936 bei Oranienburg entstand.',
    ),
  },
}

const LOST: Record<'lager' | 'tot', Txt> = {
  lager: L(
    'Nach der Haft kam {name} nicht zurück. Ein Gericht verurteilte {pron} zu Jahren im Zuchthaus. So erging es vielen, die mit Flugblättern erwischt wurden.',
    'Nach der Schutzhaft wurde {name} nicht freigelassen, sondern wegen „Vorbereitung zum Hochverrat“ zu Jahren im Zuchthaus verurteilt oder in ein Lager verschleppt. So erging es Tausenden aus dem Widerstand.',
  ),
  tot: L(
    '{name} hat die Haft nicht überlebt. In den Kellern der SA und in den Lagern wurden Gefangene gequält und ermordet. Die Familie bekam nur eine kurze Nachricht.',
    '{name} hat die Haft nicht überlebt. In den SA-Kellern und frühen Lagern wurden Hunderte Gefangene zu Tode gequält. Die Angehörigen erhielten oft nur eine knappe Mitteilung, der Häftling sei „auf der Flucht erschossen“ worden oder habe „Selbstmord verübt“.',
  ),
}

const LEADER_FATES: Record<IdeologyKey, Txt> = {
  sozialdemokratisch: L(
    'Als Sozialdemokrat hättest du vielleicht Kontakt zur SPD im Ausland gehalten. Du hättest Berichte über Deutschland hinausgeschmuggelt. Viele solcher Gruppen wurden bis 1938 entdeckt.',
    'Als Sozialdemokrat hättest du vielleicht Kontakt zur SPD im Exil in Prag gehalten und Berichte über die Lage in Deutschland hinausgeschmuggelt. Viele solcher Gruppen flogen bis 1938 auf.',
  ),
  kommunistisch: L(
    'Als Kommunist warst du in besonders großer Gefahr. Die meisten Gruppen der KPD wurden in den ersten Jahren von der Gestapo zerschlagen, oft durch Spitzel.',
    'Als Kommunist wärst du in besonders großer Gefahr gewesen. Die meisten Gruppen der verbotenen KPD wurden in den ersten Jahren von der Gestapo zerschlagen, oft durch eingeschleuste Spitzel.',
  ),
  christlich: L(
    'Als Christ wärst du vielleicht zur Bekennenden Kirche gegangen. Einige von ihnen versteckten später jüdische Menschen und retteten so Leben.',
    'Als Christ hättest du dich vielleicht der Bekennenden Kirche angeschlossen. Einige ihrer Mitglieder versteckten später jüdische Menschen und retteten so Leben.',
  ),
  humanistisch: L(
    'Du warst in keiner Partei und auf keiner Liste. Vielleicht hättest du jahrelang unentdeckt helfen können. Heute nennt man solche Menschen „stille Helden“. In Berlin gibt es eine Gedenkstätte für sie.',
    'Ohne Partei und ohne Namen auf einer Liste hättest du vielleicht jahrelang unentdeckt helfen können. Heute nennt man solche Menschen „stille Helden“. In Berlin gibt es eine Gedenkstätte für sie.',
  ),
}

function pronoun(c: Character): string {
  return c.avatar.gender === 'w' ? 'sie' : 'ihn'
}

export function fateOf(c: Character): Txt {
  if (c.status === 'lager' || c.status === 'tot') {
    const tpl = LOST[c.status]
    const fill = (s: string) => s.replace('{name}', c.name.split(' ')[0]).replace('{pron}', pronoun(c))
    return typeof tpl === 'string' ? fill(tpl) : L(fill(tpl.leicht), fill(tpl.schwer))
  }
  const f = COMPANION_FATES[c.name]
  if (!f) return ''
  if (c.status === 'ausgewandert' && f.ausgewandert) return f.ausgewandert
  if (c.status === 'verhaftet') return f.verhaftet
  return f.frei
}

export function leaderFate(ideology: IdeologyKey, status: Character['status']): Txt {
  if (status === 'tot') {
    return L(
      'Du hast die Haft nicht überlebt. So erging es vielen, die sich gewehrt haben. Deine Gruppe hat dich nicht vergessen.',
      'Du hast die Haft nicht überlebt, wie Hunderte andere Gegner des Regimes in diesen Jahren. Deine Gruppe hat dich nicht vergessen.',
    )
  }
  if (status === 'verhaftet' || status === 'lager') {
    return L(
      'Nach der Haft hättest du, wenn du überlebt hättest, unter ständiger Beobachtung gestanden. Viele machten trotzdem weiter, noch vorsichtiger als vorher.',
      'Nach der Schutzhaft hättest du, wenn du überlebt hättest, unter ständiger Beobachtung gestanden. Viele Freigelassene machten trotzdem weiter, noch vorsichtiger als zuvor.',
    )
  }
  return LEADER_FATES[ideology]
}

/** Die ehrliche Bilanz, die am Ende jedes Spiels steht */
export const HONEST_NOTE: Txt = L(
  'Die meisten Widerstandsgruppen der ersten Jahre wurden von der Gestapo entdeckt und zerschlagen. Tausende kamen in Gefängnisse und Lager, viele wurden ermordet. Den Faschismus besiegt hat am Ende nicht der Widerstand, sondern der Krieg der Alliierten. Aber die Menschen im Widerstand zeigen: Man musste nicht mitmachen. Man konnte anderen helfen.',
  'Die meisten Widerstandsgruppen der ersten Jahre wurden von der Gestapo entdeckt und zerschlagen. Tausende ihrer Mitglieder kamen in Gefängnisse und Lager, viele wurden ermordet. Gestürzt wurde das Regime nicht von innen, sondern 1945 von den Alliierten. Und doch zeigen die Menschen im Widerstand: Es war möglich, nicht mitzumachen und anderen beizustehen.',
)

/**
 * Bewertung am Ende eines Kapitels. Niemand besiegt im Spiel den Faschismus,
 * gemessen wird, wie vielen Menschen die Gruppe beigestanden hat.
 */
export interface SolidarityRating {
  stage: 1 | 2 | 3
  title: Txt
  text: Txt
}

export const SOLIDARITY_RATINGS: SolidarityRating[] = [
  {
    stage: 1,
    title: L('Ihr habt nicht weggesehen', 'Ihr habt nicht weggesehen'),
    text: L(
      'Ihr konntet nur wenigen helfen. Aber in einer Zeit, in der fast alle wegsahen, habt ihr hingeschaut. Auch das ist schon Widerstand.',
      'Ihr konntet nur wenigen beistehen. Doch in einer Zeit, in der die meisten wegsahen oder mitmachten, habt ihr euch für die Verfolgten entschieden. Auch das war schon Widerstand.',
    ),
  },
  {
    stage: 2,
    title: L('Ihr habt Menschen beigestanden', 'Ihr habt Menschen beigestanden'),
    text: L(
      'Ihr habt Verfolgte versteckt, Familien versorgt und Nachbarn nicht allein gelassen. Für diese Menschen hat eure Hilfe alles verändert.',
      'Ihr habt Verfolgte versteckt, Familien von Gefangenen versorgt und ausgegrenzte Nachbarn nicht allein gelassen. Für diese Menschen war eure Hilfe keine Kleinigkeit, sondern manchmal die Rettung.',
    ),
  },
  {
    stage: 3,
    title: L('Ein Netz der Solidarität', 'Ein Netz der Solidarität'),
    text: L(
      'Aus einer Küche voller Menschen ist ein Netz geworden, das viele trägt. Ihr hattet selbst nichts zu befürchten und habt trotzdem alles riskiert. Genau das macht Widerstand aus.',
      'Aus einer Küche voller Menschen ist ein Netz geworden, das viele trägt. Ihr hättet euch heraushalten können, weil euch selbst niemand verfolgte. Ihr habt es nicht getan. Genau darin lag die Kraft des Widerstands.',
    ),
  },
]
