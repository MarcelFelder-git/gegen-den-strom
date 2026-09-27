import { L, type Txt } from '../text'
import { PHOTOS, type Photo } from './photos'

/**
 * Die Vorgeschichte als Zeitleiste für das Intro: Wie konnte es so weit kommen?
 * Alle Daten sind geprüft. Die Einträge ab 1934 erscheinen nur, wenn direkt Kapitel 2 beginnt.
 */
export interface TimelineEntry {
  id: string
  year: string
  date: string
  title: Txt
  text: Txt
  photo?: Photo
  /** Nur beim Einstieg in Kapitel 2 */
  chapter2?: boolean
}

export const TIMELINE: TimelineEntry[] = [
  {
    id: '1918',
    year: '1918',
    date: '9. November 1918',
    title: L('Deutschland wird eine Demokratie', 'Das Kaiserreich stürzt, die Republik entsteht'),
    text: L(
      'Der Erste Weltkrieg ist verloren. Soldaten und Arbeiter wollen keinen Kaiser mehr. Der Kaiser flieht. Deutschland wird eine Republik. Zum ersten Mal dürfen auch Frauen wählen. Aber viele Menschen sind enttäuscht und wütend über den verlorenen Krieg.',
      'Nach vier Jahren Krieg und Millionen Toten erheben sich Matrosen, Soldaten und Arbeiter. Der Kaiser dankt ab, in Berlin wird die Republik ausgerufen. 1919 gibt sich Deutschland in Weimar eine demokratische Verfassung, Frauen wählen zum ersten Mal. Doch viele lehnen die neue Demokratie von Anfang an ab und verbreiten die Lüge, das Heer sei „im Felde unbesiegt“ von Verrätern in der Heimat „erdolcht“ worden.',
    ),
    photo: PHOTOS.revolution1918,
  },
  {
    id: '1923',
    year: '1923',
    date: '8. und 9. November 1923',
    title: L('Hitler versucht es mit Gewalt', 'Der Hitlerputsch in München'),
    text: L(
      'Das Geld ist fast nichts mehr wert. Ein Brot kostet Milliarden Mark. In München will Adolf Hitler mit bewaffneten Anhängern die Macht an sich reißen. Die Polizei stoppt ihn. Hitler kommt ins Gefängnis, seine Partei, die NSDAP, wird verboten. Im Gefängnis schreibt er ein Buch voller Hass: „Mein Kampf“.',
      'Die Inflation vernichtet die Ersparnisse von Millionen, ein Brot kostet Milliarden Mark. In München versucht Adolf Hitler, mit bewaffneten Anhängern die Macht zu übernehmen und nach Berlin zu marschieren. Die bayerische Polizei schlägt den Putsch nieder, es gibt Tote. Die NSDAP wird verboten, Hitler zu fünf Jahren Festungshaft verurteilt. Er kommt schon Ende 1924 frei. In der Haft schreibt er „Mein Kampf“, in dem er seinen Judenhass und seine Pläne offen darlegt.',
    ),
    photo: PHOTOS.putsch1923,
  },
  {
    id: '1925',
    year: '1925',
    date: '27. Februar 1925',
    title: L('Die NSDAP ist wieder da', 'Die NSDAP wird neu gegründet'),
    text: L(
      'Nur gut ein Jahr nach dem Putsch darf Hitler seine Partei neu gründen. Diesmal will er die Macht über Wahlen erobern. Viele lachen über ihn. Das ist ein Fehler.',
      'Kaum ein Jahr nach seiner Entlassung gründet Hitler die NSDAP neu. Er ändert die Taktik: Nicht mehr mit einem Putsch, sondern über Wahlen will er an die Macht und die Demokratie dann von innen zerstören. Noch ist die Partei klein, 1928 bekommt sie nur 2,6 Prozent der Stimmen.',
    ),
  },
  {
    id: '1929',
    year: '1929',
    date: 'Oktober 1929',
    title: L('Die große Not beginnt', 'Die Weltwirtschaftskrise'),
    text: L(
      'In Amerika bricht die Börse zusammen. Auf der ganzen Welt gehen Firmen pleite. In Deutschland sind bald sechs Millionen Menschen ohne Arbeit. Viele Familien haben nicht genug zu essen. Sie stehen Schlange für eine Suppe. Die Nazis versprechen, alles wird besser. Viele glauben ihnen.',
      'Der Börsenkrach in New York stürzt die Welt in eine Wirtschaftskrise. In Deutschland steigt die Zahl der Arbeitslosen bis 1932 auf rund sechs Millionen. Familien hungern, Wärmehallen und Suppenküchen sind überfüllt. Die Regierungen finden keinen Ausweg und regieren ab 1930 mit Notverordnungen des Reichspräsidenten statt mit dem Parlament. Die radikalen Parteien gewinnen.',
    ),
    photo: PHOTOS.waermehalle1931,
  },
  {
    id: '1930-denkschrift',
    year: '1930',
    date: 'August 1930',
    title: L('Eine Warnung, die niemand hören will', 'Die Denkschrift gegen die NSDAP'),
    text: L(
      'Der junge Beamte Robert Kempner arbeitet im Innenministerium von Preußen. Er sammelt Beweise: Die NSDAP will die Demokratie mit Gewalt abschaffen. Sie gehört verboten. Er schreibt alles in einem langen Bericht auf. Die Regierung in Berlin legt ihn beiseite. Nichts passiert.',
      'Robert Kempner, Justiziar im preußischen Innenministerium, verfasst mit Kollegen eine Denkschrift: Die NSDAP sei eine „staats- und republikfeindliche hochverräterische Verbindung“. Das Material geht an den Oberreichsanwalt, Preußen fordert ein Vorgehen gegen die Partei. Die Reichsregierung unter Kanzler Brüning ignoriert die Warnung. Kempner wird 1933 entlassen und muss 1935 fliehen. Nach dem Krieg klagt er in Nürnberg die Täter an.',
    ),
    photo: PHOTOS.kempner,
  },
  {
    id: '1930-wahl',
    year: '1930',
    date: '14. September 1930',
    title: L('Plötzlich wählen viele die Nazis', 'Der Durchbruch der NSDAP'),
    text: L(
      'Bei der Wahl zum Reichstag bekommt die NSDAP 18,3 Prozent. Vorher waren es nur 2,6 Prozent. Jetzt ist sie die zweitstärkste Partei. Ihre Schlägertruppe, die SA, marschiert durch die Straßen und verprügelt Gegner.',
      'Bei der Reichstagswahl springt die NSDAP von 2,6 auf 18,3 Prozent und wird zweitstärkste Partei. Die SA trägt die Gewalt auf die Straße: Saalschlachten, Überfälle, Tote. Auch die KPD gewinnt, die Parteien der Mitte verlieren. Eine stabile Mehrheit für die Demokratie gibt es im Reichstag nicht mehr.',
    ),
    photo: PHOTOS.aufmarsch1930,
  },
  {
    id: '1932',
    year: '1932',
    date: '31. Juli 1932',
    title: L('Die NSDAP ist die stärkste Partei', 'Die NSDAP wird stärkste Partei'),
    text: L(
      'Bei der Wahl im Juli bekommt die NSDAP 37,3 Prozent. Das sind mehr Stimmen als jede andere Partei. Die Mehrheit hat sie aber nicht. Im November verliert sie sogar Stimmen. Viele denken: Jetzt ist die Gefahr vorbei.',
      'Im Juli 1932 wird die NSDAP mit 37,3 Prozent stärkste Partei, eine eigene Mehrheit verfehlt sie. Schon am 20. Juli hatte die Reichsregierung die demokratische Regierung Preußens abgesetzt. Bei der Wahl im November fällt die NSDAP auf 33,1 Prozent. Viele glauben, ihr Höhepunkt sei überschritten. Doch im Januar 1933 verhandeln konservative Politiker um Franz von Papen heimlich mit Hitler über eine gemeinsame Regierung.',
    ),
    photo: PHOTOS.wahl1932,
  },
  {
    id: '1933',
    year: '1933',
    date: '30. Januar 1933',
    title: L('Hitler wird Reichskanzler', 'Die Macht wird Hitler übertragen'),
    text: L(
      'Reichspräsident Hindenburg macht Hitler zum Reichskanzler. Hitler hat die Macht nicht erkämpft. Er hat sie bekommen, von Politikern, die ihn benutzen wollten. In derselben Nacht marschieren Tausende mit Fackeln durch Berlin. Hier beginnt eure Geschichte.',
      'Reichspräsident von Hindenburg ernennt Hitler zum Reichskanzler. Konservative Politiker glauben, sie könnten ihn „einrahmen“ und für ihre Ziele benutzen. Hitler braucht nur wenige Monate, um die Demokratie vollständig zu zerstören. In derselben Nacht ziehen Tausende mit Fackeln durch das Brandenburger Tor. Hier beginnt eure Geschichte.',
    ),
    photo: PHOTOS.kabinett1933,
  },
  {
    id: '1934',
    year: '1934',
    date: '30. Juni und 2. August 1934',
    title: L('Hitler hat alle Macht', 'Hitler wird „Führer und Reichskanzler“'),
    text: L(
      'Hitler lässt Gegner ermorden, auch aus den eigenen Reihen. Dann stirbt Reichspräsident Hindenburg. Hitler ist jetzt Kanzler und Präsident zugleich. Alle Soldaten müssen ihm persönlich Treue schwören.',
      'Am 30. Juni 1934 lässt Hitler die Führung der SA und zahlreiche andere Gegner ermorden. Ein Gesetz erklärt die Morde nachträglich für rechtens. Nach Hindenburgs Tod am 2. August vereinigt Hitler die Ämter von Kanzler und Präsident. Die Soldaten schwören ihm persönlich die Treue.',
    ),
    chapter2: true,
  },
  {
    id: '1935',
    year: '1935',
    date: '15. September 1935',
    title: L('Gesetze gegen Juden', 'Die Nürnberger Gesetze'),
    text: L(
      'Neue Gesetze nehmen jüdischen Deutschen viele Rechte. Sie dürfen keine Nichtjuden mehr heiraten. Sie sind jetzt Bürger zweiter Klasse.',
      'Die Nürnberger Gesetze machen jüdische Deutsche zu Bürgern minderen Rechts und verbieten Ehen zwischen Juden und Nichtjuden. Der Rassenwahn wird geltendes Recht. Die meisten Deutschen nehmen es hin.',
    ),
    chapter2: true,
  },
]

/** Die Einleitung, bevor die Zeitleiste beginnt */
export const TIMELINE_INTRO: { title: Txt; text: Txt } = {
  title: L('Wie konnte es so weit kommen?', 'Wie konnte es so weit kommen?'),
  text: L(
    'Hitler kam nicht plötzlich. Es gab viele Warnungen. Es gab viele Menschen, die hätten Nein sagen können. Schau dir an, was vor 1933 passiert ist.',
    'Die Diktatur fiel nicht vom Himmel. Es gab Jahre der Krise, klare Warnzeichen und viele Momente, in denen Menschen hätten widersprechen können. Das ist die Vorgeschichte.',
  ),
}

/** Die Rolle der Spielenden, nach der Zeitleiste */
export const TIMELINE_OUTRO: { title: Txt; text: Txt } = {
  title: L('Und ihr?', 'Und ihr?'),
  text: L(
    'Ihr seid ganz normale Menschen in Berlin. Ihr seid nicht jüdisch. Euch verfolgen die Nazis nicht wegen eurer Herkunft. Ihr könntet einfach wegsehen und sagen: „Uns geht es doch gut.“ Viele tun das. Ihr nicht. Ihr gründet eine Widerstandsgruppe und helft denen, die verfolgt werden.',
    'Ihr spielt ganz gewöhnliche Berlinerinnen und Berliner. Ihr gehört nicht zu denen, die das Regime aus rassistischen Gründen verfolgt. Ihr könntet euch arrangieren, wie Millionen andere, und sagen: „Uns geht es doch gut.“ Ihr entscheidet euch anders. Ihr gründet eine Widerstandsgruppe und steht denen bei, die verfolgt werden. Denn Solidarität ist Widerstand.',
  ),
}
