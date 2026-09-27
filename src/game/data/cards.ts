import { L, type Txt } from '../text'
import { PHOTOS, type Photo } from './photos'
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
  role: Txt
  /** Was tat dieser Mensch? */
  deed: Txt
  /** Was hat das mit deinem Spiel zu tun? */
  link: Txt
  /** Was aus ihm oder ihr wurde */
  fate: Txt
  /** Ein Satz dieses Menschen, im Wortlaut */
  quote?: { text: string; source: string }
  /** Hinweis, solange die Karte noch gesperrt ist */
  hint: Txt
  unlock: { week?: number; weeks?: number[]; mission?: MissionType; fromWeek?: number }
  source: string
  photo?: Photo
}

export const CARDS: HeroCard[] = [
  {
    id: 'ossietzky',
    name: 'Carl von Ossietzky',
    years: '1889 bis 1938',
    role: L('Journalist in Berlin, Chef der Zeitschrift „Die Weltbühne“', 'Journalist und Herausgeber der „Weltbühne“ in Berlin'),
    deed: L(
      'In seiner Zeitschrift warnte er schon Jahre vor 1933 vor Hitler. Er deckte auf, dass Deutschland heimlich Waffen für einen Krieg baute. Er hätte ins Ausland fliehen können. Aber er blieb.',
      'In der „Weltbühne“ warnte er schon Jahre vor 1933 vor Hitler und deckte auf, dass die Reichswehr heimlich aufrüstete. Dafür saß er schon 1932 im Gefängnis. Freunde drängten ihn zur Flucht, aber er blieb in Berlin.',
    ),
    link: L(
      'Er wurde am Morgen nach dem Reichstagsbrand verhaftet, wie Hans Litten. Wie deine Gruppe schrieb er gegen die Lügen der Regierung an.',
      'Er wurde am Morgen nach dem Reichstagsbrand verhaftet, in derselben Nacht wie Hans Litten. Wie deine Gruppe schrieb er gegen die Lügen der Regierung an.',
    ),
    fate: L(
      'In den Lagern wurde er schwer misshandelt. 1936 bekam er den Friedensnobelpreis. Er durfte ihn nicht selbst abholen. Er starb 1938 in Berlin an den Folgen der Haft. Heute tragen viele Schulen seinen Namen, vielleicht auch deine.',
      'In den Lagern Sonnenburg und Esterwegen wurde er schwer misshandelt. 1936 erhielt er den Friedensnobelpreis, durfte ihn aber nicht selbst entgegennehmen. Hitler verbot danach allen Deutschen, Nobelpreise anzunehmen. Ossietzky starb 1938 in Berlin an den Folgen der Haft, bis zuletzt von der Polizei bewacht. Heute tragen viele Schulen seinen Namen, vielleicht auch deine.',
    ),
    hint: L('Erlebe die Woche des Reichstagsbrands oder beginne Kapitel 2.', 'Erlebe die Woche des Reichstagsbrands oder beginne Kapitel 2.'),
    unlock: { weeks: [2, 10] },
    source: 'https://www.gdw-berlin.de/vertiefung/biografien/personenverzeichnis/biografie/view-bio/carl-von-ossietzky/',
    photo: PHOTOS.ossietzky,
  },
  {
    id: 'kollwitz',
    name: 'Käthe Kollwitz',
    years: '1867 bis 1945',
    role: L('Künstlerin aus dem Prenzlauer Berg', 'Grafikerin und Bildhauerin aus dem Prenzlauer Berg'),
    deed: L(
      'Sie malte und zeichnete die Not der armen Leute in Berlin. 1932 unterschrieb sie einen Aufruf: SPD und KPD sollten sich gemeinsam gegen die Nazis stellen.',
      'Sie zeichnete die Not der armen Leute in Berlin. 1932 unterschrieb sie den „Dringenden Appell“, der SPD und KPD zu einem gemeinsamen Vorgehen gegen die Nationalsozialisten aufrief.',
    ),
    link: L(
      'Deine Gruppe malt Parolen an Wände. Käthe Kollwitz wollte mit ihren Bildern die Menschen aufwecken.',
      'Wie deine Gruppe mit Parolen wollte sie mit Bildern die Menschen wachrütteln.',
    ),
    fate: L(
      'Im Februar 1933 musste sie die Akademie der Künste verlassen. Sie durfte kaum noch ausstellen. Sie starb im April 1945, wenige Tage vor Kriegsende.',
      'Im Februar 1933 musste sie die Akademie der Künste verlassen, danach durfte sie kaum noch ausstellen. Sie starb im April 1945, wenige Tage vor Kriegsende.',
    ),
    hint: L('Male erfolgreich Parolen an eine Wand.', 'Male erfolgreich Parolen an eine Wand.'),
    unlock: { mission: 'parolen' },
    source: 'https://de.wikipedia.org/wiki/Dringender_Appell_(1932)',
    photo: PHOTOS.kollwitz,
  },
  {
    id: 'litten',
    name: 'Hans Litten',
    years: '1903 bis 1938',
    role: L('Anwalt in Berlin', 'Rechtsanwalt in Berlin'),
    deed: L(
      'Er verteidigte Arbeiter, die von der SA angegriffen worden waren. 1931 befragte er Hitler vor Gericht so geschickt, dass Hitler ins Stottern kam. Das hat Hitler ihm nie verziehen.',
      'Er vertrat Arbeiter, die von der SA überfallen worden waren. 1931 lud er Hitler als Zeugen vor Gericht und trieb ihn im Kreuzverhör so in die Enge, dass Hitler sich öffentlich bloßgestellt sah.',
    ),
    link: L(
      'In der Nacht nach dem Reichstagsbrand wurde er verhaftet. Genau in dieser Nacht klopft in deinem Spiel Willi an deine Tür.',
      'Nach dem Reichstagsbrand wurde er in derselben Nacht verhaftet, in der in deinem Spiel Willi Harms an die Tür klopft.',
    ),
    fate: L(
      'Fünf Jahre lang wurde er in Gefängnissen und Lagern gequält. 1938 starb er im Konzentrationslager Dachau.',
      'Fünf Jahre lang wurde er durch Gefängnisse und Lager geschleppt und schwer gefoltert. 1938 nahm er sich im KZ Dachau das Leben. Seine Mutter Irmgard Litten kämpfte all die Jahre um seine Freilassung.',
    ),
    hint: L('Erlebe die Woche des Reichstagsbrands.', 'Erlebe die Woche des Reichstagsbrands.'),
    unlock: { week: 2 },
    source: 'https://www.zukunft-braucht-erinnerung.de/hans-litten/',
    photo: PHOTOS.litten,
  },
  {
    id: 'muehsam',
    name: 'Erich Mühsam',
    years: '1878 bis 1934',
    role: L('Dichter aus Britz', 'Dichter und Schriftsteller aus Britz'),
    deed: L(
      'Er schrieb Gedichte und Texte gegen Krieg, Unterdrückung und die Nazis. Sein Koffer für die Flucht nach Prag war schon gepackt.',
      'Er schrieb Gedichte und Artikel gegen Krieg, Unterdrückung und die Nationalsozialisten. Sein Koffer für die Flucht nach Prag war schon gepackt.',
    ),
    link: L(
      'Er kam in das Lager Oranienburg. Das siehst du auf deiner Stadtkarte als Pfeil.',
      'Er wurde in das Lager Oranienburg gebracht, das auf deiner Stadtkarte als Pfeil erscheint.',
    ),
    fate: L(
      'Am Morgen nach dem Reichstagsbrand wurde er verhaftet. Im Juli 1934 ermordeten ihn SS-Männer im Lager Oranienburg.',
      'Er wurde am 28. Februar 1933 verhaftet, in mehreren Lagern gequält und im Juli 1934 im Konzentrationslager Oranienburg von SS-Männern ermordet.',
    ),
    hint: L('Schreibe Nachrichten aus dem Ausland ab.', 'Schreibe Nachrichten aus dem Ausland ab.'),
    unlock: { mission: 'nachrichten' },
    source: 'https://www.gdw-berlin.de/vertiefung/biografien/personenverzeichnis/biografie/view-bio/erich-muehsam/',
    photo: PHOTOS.muehsam,
  },
  {
    id: 'wels',
    name: 'Otto Wels',
    years: '1873 bis 1939',
    role: L('Chef der SPD', 'Vorsitzender der SPD'),
    deed: L(
      'Am 23. März 1933 sprach er im Reichstag gegen das Ermächtigungsgesetz. Draußen und drinnen standen SA und SS. Es war die letzte freie Rede im Reichstag.',
      'Am 23. März 1933 begründete er im Reichstag das Nein der SPD zum Ermächtigungsgesetz, während SA und SS im Saal standen. Es war die letzte freie Rede im Reichstag.',
    ),
    link: L(
      'Seine Worte „Freiheit und Leben kann man uns nehmen, die Ehre nicht“ stehen in der Zeitung deiner fünften Woche.',
      'Seine Worte „Freiheit und Leben kann man uns nehmen, die Ehre nicht“ stehen in der Zeitung deiner fünften Woche.',
    ),
    fate: L(
      'Er musste fliehen und leitete die SPD aus dem Ausland. Er starb 1939 in Paris.',
      'Er musste fliehen und leitete die SPD im Exil, erst von Prag, dann von Paris aus. Er starb 1939 in Paris.',
    ),
    quote: { text: '„Freiheit und Leben kann man uns nehmen, die Ehre nicht.“', source: 'Rede im Reichstag, 23. März 1933' },
    hint: L('Erlebe die Woche des Ermächtigungsgesetzes.', 'Erlebe die Woche des Ermächtigungsgesetzes.'),
    unlock: { week: 4 },
    source: 'https://www.fes.de/adsd50/otto-wels',
    photo: PHOTOS.wels,
  },
  {
    id: 'bonhoeffer',
    name: 'Dietrich Bonhoeffer',
    years: '1906 bis 1945',
    role: L('Pfarrer in Berlin', 'Pfarrer und Theologe in Berlin'),
    deed: L(
      'Schon im April 1933 schrieb er: Die Kirche muss den verfolgten Juden helfen. Und wenn nötig muss sie das Unrecht selbst aufhalten.',
      'Schon im April 1933 schrieb er, die Kirche müsse sich an die Seite der verfolgten Juden stellen und notfalls „dem Rad selbst in die Speichen fallen“.',
    ),
    link: L(
      'Wie Johannes in deinem Spiel musste er sich entscheiden: schweigen oder sprechen.',
      'Wie Johannes in deinem Spiel musste er sich entscheiden, ob er schweigt oder spricht.',
    ),
    fate: L(
      'Später half er Menschen, die Hitler stürzen wollten. 1943 wurde er verhaftet. Am 9. April 1945, kurz vor Kriegsende, wurde er im Lager Flossenbürg ermordet.',
      'Er schloss sich später dem Widerstandskreis um Offiziere an, die Hitler stürzen wollten, und wurde 1943 verhaftet. Am 9. April 1945, kurz vor Kriegsende, wurde er im KZ Flossenbürg ermordet.',
    ),
    quote: { text: '„[…] dem Rad selbst in die Speichen zu fallen.“', source: '„Die Kirche vor der Judenfrage“, April 1933' },
    hint: L('Erlebe die Woche, in der jüdische Beamte entlassen werden.', 'Erlebe die Woche, in der jüdische Beamte entlassen werden.'),
    unlock: { week: 6 },
    source: 'https://www.dietrich-bonhoeffer.net/leben/entscheidung/',
    photo: PHOTOS.bonhoeffer,
  },
  {
    id: 'schulze-boysen',
    name: 'Harro Schulze-Boysen',
    years: '1909 bis 1942',
    role: L('Macher der Zeitschrift „Gegner“', 'Herausgeber der Zeitschrift „Gegner“'),
    deed: L(
      'Er machte eine Zeitschrift, in der junge Menschen gegen die Nazis schrieben. Im April 1933 überfiel die SS die Redaktion. Sie verprügelte ihn schwer.',
      'Er gab eine Zeitschrift heraus, in der junge Menschen gegen die Nationalsozialisten schrieben. Im April 1933 überfiel die SS die Redaktion und misshandelte ihn schwer. Ein Freund starb an den Folgen.',
    ),
    link: L(
      'Deine Gruppe will eine eigene Zeitung machen, um die Wahrheit zu verbreiten. Er auch.',
      'Wie deine Gruppe wollte er mit einer eigenen Zeitung die Wahrheit verbreiten.',
    ),
    fate: L(
      'Später baute er eine große Widerstandsgruppe auf. Die Gestapo nannte sie „Rote Kapelle“. 1942 wurde er hingerichtet.',
      'Er baute später ein großes Netz von Widerstandsgruppen auf, das die Gestapo „Rote Kapelle“ nannte. 1942 wurde er in Berlin-Plötzensee hingerichtet.',
    ),
    hint: L('Gib eine eigene Zeitung heraus.', 'Gib eine eigene Zeitung heraus.'),
    unlock: { mission: 'zeitung' },
    source: 'https://www.gdw-berlin.de/vertiefung/biografien/personenverzeichnis/biografie/view-bio/harro-schulze-boysen',
    photo: PHOTOS.schulzeBoysen,
  },
  {
    id: 'seelenbinder',
    name: 'Werner Seelenbinder',
    years: '1904 bis 1944',
    role: L('Ringer aus einem Sportverein der Arbeiter in Neukölln', 'Ringer aus einem Arbeitersportverein in Neukölln'),
    deed: L(
      '1933 wurde er Deutscher Meister. Auf dem Siegerpodest machte er den Hitlergruß nicht mit. Dafür wurde er ein paar Tage eingesperrt und durfte über ein Jahr lang nicht mehr kämpfen.',
      'Als er 1933 Deutscher Meister wurde, verweigerte er auf dem Siegerpodest den Hitlergruß. Dafür hielt ihn die Gestapo einige Tage im Columbia-Haus fest und sperrte ihn für 16 Monate. 1936 trat er dennoch bei den Olympischen Spielen in Berlin an.',
    ),
    link: L(
      'Er kam aus einem Sportverein der Arbeiter. Deren heimliche Treffen besuchst du in Neukölln.',
      'Er kam aus einem der Arbeitersportvereine, deren heimliche Treffen du in Neukölln besuchst.',
    ),
    fate: L(
      'Er arbeitete weiter im Widerstand. 1942 wurde er verhaftet und 1944 hingerichtet. Heute tragen Sportplätze seinen Namen.',
      'Er nutzte seine Reisen als Sportler, um Nachrichten für den Widerstand zu überbringen. 1942 wurde er verhaftet und 1944 in Brandenburg hingerichtet. Heute tragen Sportstätten seinen Namen.',
    ),
    hint: L('Besuche erfolgreich ein Treffen des Sportvereins.', 'Besuche erfolgreich ein Treffen des Arbeitersportvereins.'),
    unlock: { mission: 'sportverein' },
    source: 'https://www.gedenktafeln-in-berlin.de/gedenktafeln/detail/werner-seelenbinder/3773',
    photo: PHOTOS.seelenbinder,
  },
  {
    id: 'rotehilfe',
    name: 'Die Frauen der Roten Hilfe',
    years: 'ab 1933',
    role: L('Helferinnen in den Arbeitervierteln von Berlin', 'Helferinnen in Berliner Arbeitervierteln'),
    deed: L(
      'Viele Männer waren verhaftet. Dann machten vor allem Frauen weiter. Sie sammelten heimlich Geld und Essen für die Familien der Gefangenen.',
      'Als viele Männer verhaftet waren, machten vor allem Frauen weiter. Sie sammelten heimlich Geld und Lebensmittel für die Familien der Gefangenen und hielten Kontakt in die Gefängnisse.',
    ),
    link: L(
      'Genau das tut deine Gruppe, wenn sie im Wedding den Familien von Verhafteten hilft.',
      'Genau das tut deine Gruppe, wenn sie im Wedding Familien von Verhafteten unterstützt.',
    ),
    fate: L(
      'Viele von ihnen wurden später selbst verhaftet. Ihre Namen sind oft vergessen. Ihre Hilfe nicht.',
      'Viele von ihnen wurden später selbst verhaftet. Ihre Namen sind oft vergessen, ihre Hilfe nicht.',
    ),
    hint: L('Hilf erfolgreich den Familien von Verhafteten.', 'Unterstütze erfolgreich die Familien von Verhafteten.'),
    unlock: { mission: 'rotehilfe' },
    source: 'https://de.wikipedia.org/wiki/Rote_Hilfe_Deutschlands',
  },
  {
    id: 'baum',
    name: 'Herbert Baum',
    years: '1912 bis 1942',
    role: L('Elektriker, er gründete eine jüdische Widerstandsgruppe', 'Elektriker und Gründer einer jüdischen Widerstandsgruppe'),
    deed: L(
      'Ab etwa 1936 traf er sich mit jungen jüdischen Freundinnen und Freunden. Sie verteilten Flugblätter gegen die Nazis. Dabei wurden sie selbst verfolgt.',
      'Ab etwa 1936 sammelte er junge, meist jüdische Frauen und Männer um sich. Sie diskutierten, bildeten sich und verteilten Flugblätter gegen das Regime, obwohl sie als Juden selbst verfolgt wurden.',
    ),
    link: L(
      'Deine Gruppe muss nicht um ihr Leben fürchten, nur weil sie da ist. Herbert Baum und seine Freunde schon. Trotzdem wehrten sie sich.',
      'Deine Gruppe besteht aus Menschen, die nicht rassistisch verfolgt werden. Die Baum-Gruppe zeigt: Auch Verfolgte leisteten Widerstand, unter noch viel größerer Gefahr.',
    ),
    fate: L(
      'Im Mai 1942 wurde die Gruppe verraten. Herbert Baum starb in der Haft. Mehr als zwanzig seiner Freunde wurden ermordet.',
      'Nach einem Brandanschlag auf eine Propagandaausstellung im Mai 1942 wurde die Gruppe verhaftet. Herbert Baum starb in der Haft, mehr als zwanzig seiner Freundinnen und Freunde wurden hingerichtet.',
    ),
    hint: L('Verteile ab 1936 erfolgreich Flugblätter.', 'Verteile ab 1936 erfolgreich Flugblätter.'),
    unlock: { mission: 'verteilen', fromWeek: 10 },
    source: 'https://www.gdw-berlin.de/vertiefung/biografien/personenverzeichnis/biografie/view-bio/herbert-baum',
    photo: PHOTOS.baum,
  },
  {
    id: 'niemoeller',
    name: 'Martin Niemöller',
    years: '1892 bis 1984',
    role: L('Pfarrer in Berlin-Dahlem', 'Pfarrer in Berlin-Dahlem'),
    deed: L(
      'Zuerst fand er die Nazis gut. Dann merkte er, dass sie auch die Kirche beherrschen wollten. 1933 gründete er mit anderen Pfarrern einen Bund dagegen. Daraus wurde die Bekennende Kirche.',
      'Er begrüßte 1933 zunächst die neue Regierung und äußerte sich auch antisemitisch. Als der Staat die Kirche gleichschalten wollte, gründete er den Pfarrernotbund, aus dem die Bekennende Kirche entstand. Von der Kanzel sprach er offen gegen den Staat.',
    ),
    link: L(
      'Seine Verhaftung am 1. Juli 1937 steht in der Zeitung deiner vierzehnten Woche.',
      'Seine Verhaftung am 1. Juli 1937 steht in der Zeitung deiner vierzehnten Woche. Sein Weg zeigt, wie lange es dauern kann, bis man erkennt, was geschieht.',
    ),
    fate: L(
      'Fast acht Jahre war er in Haft, zuletzt in Konzentrationslagern. Er überlebte. Nach dem Krieg sagte er: Ich habe zu lange geschwiegen.',
      'Er war fast acht Jahre in Haft, zuletzt in den Konzentrationslagern Sachsenhausen und Dachau, und überlebte. Nach dem Krieg bekannte er seine Mitschuld und setzte sich für Frieden und Versöhnung ein.',
    ),
    quote: {
      text: '„Als die Nazis die Kommunisten holten, habe ich geschwiegen; ich war ja kein Kommunist. […] Als sie mich holten, gab es keinen mehr, der protestieren konnte.“',
      source: 'Nach dem Krieg, in mehreren Fassungen überliefert',
    },
    hint: L('Erlebe die Woche im Juli 1937.', 'Erlebe die Woche im Juli 1937.'),
    unlock: { week: 13 },
    source: 'https://www.gdw-berlin.de/vertiefung/biografien/personenverzeichnis/biografie/view-bio/martin-niemoeller/',
    photo: PHOTOS.niemoeller,
  },
  {
    id: 'schmitz',
    name: 'Elisabeth Schmitz',
    years: '1893 bis 1977',
    role: L('Lehrerin an einer Berliner Schule', 'Studienrätin an einer Berliner Schule'),
    deed: L(
      '1935 schrieb sie heimlich einen langen Text gegen die Verfolgung der Juden. Sie gab etwa 200 Abschriften an Pfarrer. Darin fragte sie: „Warum tut die Kirche nichts?“',
      '1935 verfasste sie heimlich eine Denkschrift gegen die Verfolgung der Juden und verteilte etwa 200 Abschriften an Pfarrer der Bekennenden Kirche. Sie fragte: „Warum tut die Kirche nichts?“',
    ),
    link: L(
      'Sie war selbst nicht verfolgt. Trotzdem setzte sie sich für die Juden ein. Genau darum geht es in deinem Spiel.',
      'Wie deine Gruppe wurde sie selbst nicht verfolgt und setzte sich trotzdem für andere ein. Sie ist ein Beispiel für Solidarität aus freier Entscheidung.',
    ),
    fate: L(
      'Ende 1938 kündigte sie ihre Stelle. Sie wollte diesem Staat nicht mehr dienen. Sie versteckte auch Verfolgte. Sie überlebte den Krieg und starb 1977.',
      'Nach dem Novemberpogrom kündigte sie ihre Stelle, weil sie diesem Staat nicht mehr dienen wollte. Sie half Verfolgten und versteckte Menschen. Sie starb 1977. Erst Jahrzehnte später wurde ihre Denkschrift bekannt.',
    ),
    hint: L('Hilf einer jüdischen Familie bei der Ausreise.', 'Hilf einer jüdischen Familie bei der Ausreise.'),
    unlock: { mission: 'ausreise' },
    source: 'https://www.gdw-berlin.de/vertiefung/biografien/personenverzeichnis/biografie/view-bio/elisabeth-schmitz/',
    photo: PHOTOS.schmitz,
  },
  {
    id: 'kruetzfeld',
    name: 'Wilhelm Krützfeld',
    years: '1880 bis 1953',
    role: L('Polizist am Hackeschen Markt', 'Polizeioffizier am Hackeschen Markt'),
    deed: L(
      'In der Nacht des Novemberpogroms jagte er die Brandstifter von der Neuen Synagoge weg. Dann ließ er die Feuerwehr löschen.',
      'In der Nacht des Novemberpogroms jagte er die Brandstifter von der Neuen Synagoge in der Oranienburger Straße fort und ließ die Feuerwehr löschen. Er berief sich darauf, dass das Gebäude unter Denkmalschutz stand.',
    ),
    link: L(
      'Er zeigt: Auch wer für den Staat arbeitete, konnte Nein sagen.',
      'Er zeigt: Auch wer für den Staat arbeitete, hatte Spielräume und konnte Nein sagen.',
    ),
    fate: L(
      'Er wurde nur verwarnt. Die Neue Synagoge überstand die Nacht. Ihre goldene Kuppel kannst du heute noch sehen. Er starb 1953.',
      'Er wurde nur verwarnt und ging später in den Ruhestand. Die Neue Synagoge überstand die Nacht, wurde aber im Krieg schwer beschädigt. Ihre goldene Kuppel ist heute wieder aufgebaut. Er starb 1953.',
    ),
    hint: L('Erlebe die Nacht vom 9. auf den 10. November 1938.', 'Erlebe die Nacht vom 9. auf den 10. November 1938.'),
    unlock: { week: 16 },
    source: 'https://de.wikipedia.org/wiki/Wilhelm_Kr%C3%BCtzfeld',
    photo: PHOTOS.neueSynagoge,
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
