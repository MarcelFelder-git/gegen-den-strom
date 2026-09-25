import type { MissionType } from '../types'

/**
 * Echte Menschen aus dem Widerstand. Jede Karte wird im Spiel freigeschaltet,
 * entweder durch einen gelungenen Auftrag oder durch eine bestimmte Woche.
 * Alle Angaben sind an den Biografien der Gedenkstätte Deutscher Widerstand und
 * weiteren Quellen geprüft.
 */
export interface HeroCard {
  id: string
  name: string
  years: string
  role: string
  /** Was tat dieser Mensch? */
  deed: string
  /** Was hat das mit deinem Spiel zu tun? */
  link: string
  /** Was aus ihm oder ihr wurde */
  fate: string
  /** Hinweis, solange die Karte noch gesperrt ist */
  hint: string
  unlock: { week?: number; weeks?: number[]; mission?: MissionType; fromWeek?: number }
  source: string
}

export const CARDS: HeroCard[] = [
  {
    id: 'ossietzky',
    name: 'Carl von Ossietzky',
    years: '1889 bis 1938',
    role: 'Journalist und Herausgeber der „Weltbühne“ in Berlin',
    deed: 'In seiner Zeitschrift „Die Weltbühne“ warnte er schon Jahre vor 1933 vor Hitler und deckte auf, dass Deutschland heimlich aufrüstete. Er hätte ins Ausland fliehen können, aber er blieb.',
    link: 'Er wurde am Morgen nach dem Reichstagsbrand verhaftet, in derselben Nacht wie Hans Litten. Wie deine Gruppe schrieb er gegen die Lügen der Regierung an.',
    fate: 'In den Lagern Sonnenburg und Esterwegen wurde er schwer misshandelt. 1936 erhielt er den Friedensnobelpreis, durfte ihn aber nicht selbst entgegennehmen. Hitler verbot danach allen Deutschen, Nobelpreise anzunehmen. Ossietzky starb 1938 in Berlin an den Folgen der Haft. Heute tragen viele Schulen seinen Namen, vielleicht auch deine.',
    hint: 'Erlebe die Woche des Reichstagsbrands oder beginne Kapitel 2.',
    unlock: { weeks: [2, 10] },
    source: 'https://www.gdw-berlin.de/vertiefung/biografien/personenverzeichnis/biografie/view-bio/carl-von-ossietzky/',
  },
  {
    id: 'kollwitz',
    name: 'Käthe Kollwitz',
    years: '1867 bis 1945',
    role: 'Künstlerin aus dem Prenzlauer Berg',
    deed: 'Sie zeichnete die Not der armen Leute in Berlin. 1932 und 1933 unterschrieb sie einen Aufruf, dass sich SPD und KPD gegen die Nationalsozialisten verbünden sollten.',
    link: 'Wie deine Gruppe mit Parolen wollte sie mit Bildern die Menschen wachrütteln.',
    fate: 'Im Februar 1933 musste sie die Akademie der Künste verlassen und durfte kaum noch ausstellen. Sie starb im April 1945, wenige Tage vor Kriegsende.',
    hint: 'Male erfolgreich Parolen an eine Wand.',
    unlock: { mission: 'parolen' },
    source: 'https://de.wikipedia.org/wiki/Dringender_Appell_(1932)',
  },
  {
    id: 'litten',
    name: 'Hans Litten',
    years: '1903 bis 1938',
    role: 'Rechtsanwalt in Berlin',
    deed: 'Er verteidigte Arbeiter, die von der SA angegriffen worden waren. 1931 zwang er Hitler vor Gericht in ein Kreuzverhör und brachte ihn in Bedrängnis.',
    link: 'Nach dem Reichstagsbrand wurde er in derselben Nacht verhaftet wie die Menschen, die in deinem Spiel an die Tür klopfen.',
    fate: 'Fünf Jahre lang wurde er durch Gefängnisse und Lager geschleppt und schwer misshandelt. 1938 starb er im Konzentrationslager Dachau.',
    hint: 'Erlebe die Woche des Reichstagsbrands.',
    unlock: { week: 2 },
    source: 'https://www.zukunft-braucht-erinnerung.de/hans-litten/',
  },
  {
    id: 'muehsam',
    name: 'Erich Mühsam',
    years: '1878 bis 1934',
    role: 'Dichter und Schriftsteller aus Britz',
    deed: 'Er schrieb Gedichte und Artikel gegen Krieg, Unterdrückung und die Nationalsozialisten. Sein Koffer für die Flucht nach Prag war schon gepackt.',
    link: 'Er wurde in das Lager Oranienburg gebracht, das auf deiner Stadtkarte als Pfeil erscheint.',
    fate: 'Er wurde am 28. Februar 1933 verhaftet und im Juli 1934 im Konzentrationslager Oranienburg von SS-Männern ermordet.',
    hint: 'Schreibe Nachrichten aus dem Ausland ab.',
    unlock: { mission: 'nachrichten' },
    source: 'https://www.gdw-berlin.de/vertiefung/biografien/personenverzeichnis/biografie/view-bio/erich-muehsam/',
  },
  {
    id: 'wels',
    name: 'Otto Wels',
    years: '1873 bis 1939',
    role: 'Vorsitzender der SPD',
    deed: 'Am 23. März 1933 sprach er im Reichstag gegen das Ermächtigungsgesetz, während draußen SA und SS standen. Es war die letzte freie Rede im Reichstag.',
    link: 'Seine Worte „Freiheit und Leben kann man uns nehmen, die Ehre nicht“ stehen in der Zeitung deiner fünften Woche.',
    fate: 'Er musste fliehen und leitete die SPD aus dem Ausland. Er starb 1939 in Paris.',
    hint: 'Erlebe die Woche des Ermächtigungsgesetzes.',
    unlock: { week: 4 },
    source: 'https://www.fes.de/adsd50/otto-wels',
  },
  {
    id: 'bonhoeffer',
    name: 'Dietrich Bonhoeffer',
    years: '1906 bis 1945',
    role: 'Pfarrer und Theologe in Berlin',
    deed: 'Schon im April 1933 schrieb er, die Kirche müsse sich an die Seite der verfolgten Juden stellen und notfalls „dem Rad selbst in die Speichen fallen“.',
    link: 'Wie Johannes in deinem Spiel musste er sich entscheiden, ob er schweigt oder spricht.',
    fate: 'Er schloss sich später dem Widerstand gegen Hitler an und wurde 1943 verhaftet. Am 9. April 1945, kurz vor Kriegsende, wurde er im KZ Flossenbürg ermordet.',
    hint: 'Erlebe die Woche, in der jüdische Beamte entlassen werden.',
    unlock: { week: 6 },
    source: 'https://www.dietrich-bonhoeffer.net/leben/entscheidung/',
  },
  {
    id: 'schulze-boysen',
    name: 'Harro Schulze-Boysen',
    years: '1909 bis 1942',
    role: 'Herausgeber der Zeitschrift „Gegner“',
    deed: 'Er gab eine Zeitschrift heraus, in der junge Menschen gegen die Nationalsozialisten schrieben. Im April 1933 überfiel die SS die Redaktion und misshandelte ihn.',
    link: 'Wie deine Gruppe wollte er mit einer eigenen Zeitung die Wahrheit verbreiten.',
    fate: 'Er baute später eine große Widerstandsgruppe auf, die die Gestapo „Rote Kapelle“ nannte. 1942 wurde er hingerichtet.',
    hint: 'Gib eine eigene Zeitung heraus.',
    unlock: { mission: 'zeitung' },
    source: 'https://www.gdw-berlin.de/vertiefung/biografien/personenverzeichnis/biografie/view-bio/harro-schulze-boysen',
  },
  {
    id: 'seelenbinder',
    name: 'Werner Seelenbinder',
    years: '1904 bis 1944',
    role: 'Ringer aus einem Arbeitersportverein in Neukölln',
    deed: 'Als er 1933 Deutscher Meister wurde, verweigerte er auf dem Siegerpodest den Hitlergruß. Dafür wurde er verhaftet und gesperrt.',
    link: 'Er kam aus einem der Arbeitersportvereine, deren heimliche Treffen du in Neukölln besuchst.',
    fate: 'Er arbeitete weiter im Widerstand, wurde 1942 verhaftet und 1944 hingerichtet. Heute tragen Sportstätten seinen Namen.',
    hint: 'Besuche erfolgreich ein Treffen des Arbeitersportvereins.',
    unlock: { mission: 'sportverein' },
    source: 'https://www.gedenktafeln-in-berlin.de/gedenktafeln/detail/werner-seelenbinder/3773',
  },
  {
    id: 'rotehilfe',
    name: 'Die Frauen der Roten Hilfe',
    years: 'ab 1933',
    role: 'Helferinnen in Berliner Arbeitervierteln',
    deed: 'Als viele Männer verhaftet waren, machten vor allem Frauen weiter. Sie sammelten heimlich Geld und Lebensmittel für die Familien der Gefangenen.',
    link: 'Genau das tut deine Gruppe, wenn sie im Wedding Familien von Verhafteten unterstützt.',
    fate: 'Viele von ihnen wurden später selbst verhaftet. Ihre Namen sind oft vergessen, ihre Hilfe nicht.',
    hint: 'Unterstütze erfolgreich die Familien von Verhafteten.',
    unlock: { mission: 'rotehilfe' },
    source: 'https://de.wikipedia.org/wiki/Rote_Hilfe_Deutschlands',
  },
  {
    id: 'baum',
    name: 'Herbert Baum',
    years: '1912 bis 1942',
    role: 'Elektriker und Gründer einer jüdischen Jugendgruppe',
    deed: 'Ab 1936 verteilten er und seine meist sehr jungen Freundinnen und Freunde Flugblätter gegen das Regime und halfen Verfolgten beim Untertauchen.',
    link: 'Wie deine Gruppe druckten und verteilten sie Flugblätter, obwohl sie als Juden selbst verfolgt waren.',
    fate: 'Im Mai 1942 wurde die Gruppe verraten. Herbert Baum starb in der Haft, mehr als zwanzig seiner Freunde wurden ermordet.',
    hint: 'Verteile ab 1936 erfolgreich Flugblätter.',
    unlock: { mission: 'verteilen', fromWeek: 10 },
    source: 'https://www.gdw-berlin.de/vertiefung/biografien/personenverzeichnis/biografie/view-bio/herbert-baum',
  },
  {
    id: 'niemoeller',
    name: 'Martin Niemöller',
    years: '1892 bis 1984',
    role: 'Pfarrer in Berlin-Dahlem',
    deed: 'Er gründete 1933 den Pfarrernotbund, aus dem die Bekennende Kirche entstand. Von der Kanzel sprach er offen gegen die Einmischung des Staates.',
    link: 'Seine Verhaftung am 1. Juli 1937 steht in der Zeitung deiner vierzehnten Woche.',
    fate: 'Er war fast acht Jahre in Konzentrationslagern und überlebte. Nach dem Krieg setzte er sich für Frieden und Versöhnung ein.',
    hint: 'Erlebe die Woche im Juli 1937.',
    unlock: { week: 13 },
    source: 'https://www.gdw-berlin.de/vertiefung/biografien/personenverzeichnis/biografie/view-bio/martin-niemoeller/',
  },
  {
    id: 'schmitz',
    name: 'Elisabeth Schmitz',
    years: '1893 bis 1977',
    role: 'Lehrerin an einer Berliner Schule',
    deed: '1935 schrieb sie heimlich eine Denkschrift gegen die Verfolgung der Juden und verteilte 200 Abschriften an Pfarrer. Sie fragte: „Warum tut die Kirche nichts?“',
    link: 'Wie Dr. Weiß in deinem Spiel war sie Lehrerin, und wie deine Gruppe verbreitete sie heimlich Schriften.',
    fate: 'Ende 1938 kündigte sie ihre Stelle, weil sie diesem Staat nicht mehr dienen wollte. Sie überlebte den Krieg und starb 1977.',
    hint: 'Hilf einer jüdischen Familie bei der Ausreise.',
    unlock: { mission: 'ausreise' },
    source: 'https://www.gdw-berlin.de/vertiefung/biografien/personenverzeichnis/biografie/view-bio/elisabeth-schmitz/',
  },
  {
    id: 'kruetzfeld',
    name: 'Wilhelm Krützfeld',
    years: '1880 bis 1953',
    role: 'Polizeioffizier am Hackeschen Markt',
    deed: 'In der Nacht des Novemberpogroms jagte er die Brandstifter von der Neuen Synagoge in der Oranienburger Straße fort und ließ die Feuerwehr löschen.',
    link: 'Er zeigt: Auch wer für den Staat arbeitete, konnte Nein sagen.',
    fate: 'Er wurde nur verwarnt und später versetzt. Die Neue Synagoge überstand die Nacht. Er starb 1953.',
    hint: 'Erlebe die Nacht vom 9. auf den 10. November 1938.',
    unlock: { week: 16 },
    source: 'https://de.wikipedia.org/wiki/Wilhelm_Kr%C3%BCtzfeld',
  },
]

export function cardsForWeek(week: number): HeroCard[] {
  return CARDS.filter((c) => c.unlock.week === week || c.unlock.weeks?.includes(week))
}

export function cardsForMission(type: MissionType, week: number): HeroCard[] {
  return CARDS.filter((c) => c.unlock.mission === type && week >= (c.unlock.fromWeek ?? 0))
}

export function getCard(id: string): HeroCard | undefined {
  return CARDS.find((c) => c.id === id)
}
