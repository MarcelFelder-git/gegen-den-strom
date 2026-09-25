import type { Effects, Inventory, MissionType, StatKey } from '../types'

export interface MissionTemplate {
  type: MissionType
  title: string
  /** Kurzes Etikett auf der Stadtkarte, höchstens neun Zeichen */
  tag: string
  /** Zwischentitel der Nachtsequenz */
  night: string
  short: string
  dossier: string
  primary: StatKey
  secondary: StatKey
  /** Wie viel Teamstärke für eine Aussicht von 45 vom Hundert nötig ist */
  difficulty: number
  baseRisk: number
  /** Fahndungsdruck, den jeder Teilnehmer auch bei Erfolg erhält */
  heat: number
  cost: { kasse?: number; items?: Partial<Inventory> }
  /** Orte, an denen dieser Auftrag auftauchen kann */
  places: string[]
  rewardLabel: string
  success: (rng: () => number, flags: string[]) => Effects
  failure: Effects
  /**
   * Platzhalter: {team}, {ort}, {Ort} (am Satzanfang),
   * {einzahl|mehrzahl} und {er|sie|mehrzahl} je nach Größe und Geschlecht des Teams.
   */
  texts: { success: string[]; failure: string[]; detected: string[] }
}

const between = (rng: () => number, min: number, max: number) => min + Math.floor(rng() * (max - min + 1))

export const MISSIONS: Record<MissionType, MissionTemplate> = {
  spenden: {
    type: 'spenden',
    title: 'Spenden im Geheimen sammeln',
    tag: 'Spenden',
    night: '{team} {sammelt|sammeln} {ort} heimlich Geld.',
    short: 'Bringt Reichsmark in die Kasse',
    dossier:
      'Es gibt Menschen, die nicht selbst handeln wollen, aber helfen möchten. Man muss sie leise ansprechen, bei der Arbeit, im Treppenhaus, nach dem Gottesdienst. Ein falsches Wort an den falschen Nachbarn genügt, und die Polizei steht vor der Tür.',
    primary: 'empathie',
    secondary: 'propaganda',
    difficulty: 4,
    baseRisk: 6,
    heat: 3,
    cost: {},
    places: ['koesliner', 'aeg', 'leopoldplatz', 'schillerpark', 'hermannstrasse', 'rathaus', 'mariannenplatz', 'marheineke', 'scheunenviertel'],
    rewardLabel: '15 bis 30 Reichsmark, dazu ein neuer Unterstützer',
    success: (rng) => ({ kasse: between(rng, 15, 30), supporters: 1 }),
    failure: {},
    texts: {
      success: [
        '{team} {ging|gingen} von Tür zu Tür. {Ort} gaben viele mehr, als sie entbehren konnten. Eine alte Frau drückte {ihm|ihr|ihnen} ihr letztes Markstück in die Hand und sagte nur: „Macht weiter.“',
        '{team} {sprach|sprachen} nach Feierabend mit Kollegen und Bekannten. {Ort} kam eine ordentliche Summe zusammen, eingewickelt in Zeitungspapier.',
      ],
      failure: [
        '{team} {klopfte|klopften} an viele Türen. {Ort} blieben die meisten verschlossen. Die Menschen haben Angst, und wer kann es ihnen verdenken.',
      ],
      detected: [
        'Ein Parteigenosse aus dem Nachbarhaus hat {team} {ort} beobachtet und sich Namen notiert. Nun wird über {ihn|sie|sie} geredet.',
      ],
    },
  },
  papier: {
    type: 'papier',
    title: 'Papier und Druckfarbe kaufen',
    tag: 'Einkauf',
    night: '{team} {kauft|kaufen} {ort} Papier und Farbe.',
    short: 'Kostet Geld, bringt Druckmaterial',
    dossier:
      'Wer viel Papier und Druckfarbe kauft, macht sich verdächtig. Manche Händler melden der Polizei, wer große Mengen kauft. Man kauft darum in kleinen Mengen, bei verschiedenen Geschäften, und trägt alles in Einkaufstaschen nach Hause.',
    primary: 'heimlichkeit',
    secondary: 'empathie',
    difficulty: 3,
    baseRisk: 10,
    heat: 3,
    cost: { kasse: 20 },
    places: ['marheineke', 'kochstrasse', 'hackescher', 'hermannplatz', 'alexanderplatz'],
    rewardLabel: '3 Ries Papier und 2 Dosen Druckfarbe',
    success: () => ({ items: { papier: 3, farbe: 2 } }),
    failure: { kasse: 20 },
    texts: {
      success: [
        '{team} {kaufte|kauften} in drei verschiedenen Läden ein. {Ort} fragte niemand, wozu man so viel Papier braucht. Drei Ries Papier und zwei Dosen Farbe liegen nun im Versteck.',
      ],
      failure: [
        'Der Händler {ort} wurde misstrauisch und verlangte einen Namen. {team} {ging|gingen} ohne Ware davon. Das Geld blieb in der Kasse.',
      ],
      detected: [
        'Der Händler {ort} hat die Polizei gerufen. {team} {konnte|konnten} entkommen, doch eine Beschreibung liegt nun auf der Wache.',
      ],
    },
  },
  druck: {
    type: 'druck',
    title: 'Antifaschistische Flugblätter drucken',
    tag: 'Drucken',
    night: '{team} {druckt|drucken} {ort} Flugblätter.',
    short: 'Braucht Papier und Farbe, bringt Flugblätter',
    dossier:
      'Im Keller steht eine alte Handpresse. Sie ist laut, und der Geruch der Druckfarbe zieht durch das ganze Haus. Man druckt nachts und legt Decken über die Kellerfenster. Jedes Blatt muss sauber gesetzt sein, damit man die Worte lesen kann.',
    primary: 'bildung',
    secondary: 'staerke',
    difficulty: 5,
    baseRisk: 14,
    heat: 5,
    cost: { items: { papier: 2, farbe: 1 } },
    places: ['linienstrasse', 'koesliner', 'mariannenplatz', 'hermannstrasse', 'richardplatz', 'hackescher'],
    rewardLabel: '3 Bündel Flugblätter, mit eigener Druckerei 5',
    success: (_rng, flags) => ({ items: { flugblaetter: flags.includes('druckerei') ? 5 : 3 } }),
    failure: { items: { flugblaetter: 1 } },
    texts: {
      success: [
        '{team} {arbeitete|arbeiteten} die ganze Nacht an der Presse {ort}. Am Morgen hängen drei Bündel frischer Flugblätter zum Trocknen auf der Leine.',
      ],
      failure: [
        'Die Presse {ort} verschmierte die Farbe. {team} {konnte|konnten} nur ein einziges Bündel lesbarer Blätter retten.',
      ],
      detected: [
        'Ein Nachbar hat das Klappern der Presse {ort} gemeldet. {team} {floh|flohen} über den Hof, bevor die Polizei kam.',
      ],
    },
  },
  verteilen: {
    type: 'verteilen',
    title: 'Flugblätter in der Nacht verteilen',
    tag: 'Verteilen',
    night: '{team} {verteilt|verteilen} {ort} Flugblätter.',
    short: 'Braucht Flugblätter, bringt Unterstützer und Mut',
    dossier:
      'Die Blätter müssen unter die Leute. In Briefkästen, auf Treppenstufen, zwischen die Zeitungen am Kiosk. Einer steht Schmiere an der Ecke, die anderen arbeiten schnell. Wer mit Flugschriften erwischt wird, kommt in Schutzhaft.',
    primary: 'heimlichkeit',
    secondary: 'propaganda',
    difficulty: 7,
    baseRisk: 24,
    heat: 10,
    cost: { items: { flugblaetter: 2 } },
    places: ['aeg', 'leopoldplatz', 'goerlitzer', 'hermannplatz', 'alexanderplatz', 'kochstrasse', 'opernplatz', 'schillerpark'],
    rewardLabel: '3 bis 6 Unterstützer, dazu Moral',
    success: (rng) => ({ supporters: between(rng, 3, 6), moral: 6 }),
    failure: { moral: -3 },
    texts: {
      success: [
        '{team} {verteilte|verteilten} in der Nacht zwei Bündel Flugblätter. Am Morgen standen {ort} Menschen in kleinen Gruppen beisammen und lasen. Einige steckten die Blätter heimlich ein.',
        '{team} {legte|legten} die Flugschriften {ort} in jeden Hausflur. Schon am nächsten Tag fragten Leute leise, wer dahintersteckt und ob man helfen könne.',
      ],
      failure: [
        '{team} {musste|mussten} sich {ort} vor einer Streife verstecken. Die meisten Blätter landeten im Kanal, damit man sie nicht findet.',
      ],
      detected: [
        'Eine Streife der SA hat {team} {ort} gesehen. Es gab Pfiffe und laute Rufe. {Er|Sie|Sie} {rannte|rannten} durch die Hinterhöfe davon.',
      ],
    },
  },
  parolen: {
    type: 'parolen',
    title: 'Parolen an Häuserwände malen',
    tag: 'Parolen',
    night: '{team} {malt|malen} {ort} Parolen an die Wand.',
    short: 'Braucht Farbe, bringt Mut und Hoffnung',
    dossier:
      'Ein paar Worte an einer Mauer, groß genug, dass die ganze Straße sie am Morgen liest. „Freiheit!“ oder „Nieder mit Hitler!“ Es dauert nur Minuten, aber in diesen Minuten ist man ungeschützt.',
    primary: 'heimlichkeit',
    secondary: 'staerke',
    difficulty: 6,
    baseRisk: 18,
    heat: 8,
    cost: { items: { farbe: 1 } },
    places: ['koesliner', 'goerlitzer', 'hermannplatz', 'schillerpark', 'rathaus', 'mariannenplatz', 'leopoldplatz'],
    rewardLabel: 'Moral, dazu ein neuer Unterstützer',
    success: () => ({ moral: 8, supporters: 1 }),
    failure: { moral: -2 },
    texts: {
      success: [
        'Am Morgen stand {ort} in weißen Buchstaben an der Wand: „Freiheit!“ Die SA hat es bis Mittag übermalt, aber da hatten es schon Hunderte gelesen. {team} {ist|sind} wohlbehalten zurück.',
      ],
      failure: [
        '{team} {wurde|wurden} {ort} von einem Hauswart gestört und {musste|mussten} die Arbeit abbrechen. Nur ein halbes Wort steht nun an der Mauer.',
      ],
      detected: [
        '{team} {wurde|wurden} {ort} mit dem Farbeimer gesehen. Ein Polizist rief laut hinterher. {Er|Sie|Sie} {ließ|ließen} alles stehen und {lief|liefen}.',
      ],
    },
  },
  unterschlupf: {
    type: 'unterschlupf',
    title: 'Verfolgten Nachbarn Unterschlupf gewähren',
    tag: 'Versteck',
    night: '{team} {versteckt|verstecken} {ort} einen Verfolgten.',
    short: 'Großer Gewinn an Moral, aber gefährlich',
    dossier:
      'Ein Mensch wird gesucht, weil er Kommunist oder Gewerkschafter ist, weil er in der falschen Partei war oder weil ihn jemand angezeigt hat. Er braucht für einige Nächte ein Bett, Essen und Menschen, die schweigen. Wer einen Verfolgten versteckt, bringt sich selbst in große Gefahr.',
    primary: 'empathie',
    secondary: 'heimlichkeit',
    difficulty: 7,
    baseRisk: 26,
    heat: 12,
    cost: { kasse: 10 },
    places: ['scheunenviertel', 'hackescher', 'mariannenplatz', 'richardplatz', 'schillerpark'],
    rewardLabel: 'Viel Moral für die ganze Gruppe',
    success: () => ({ moral: 15 }),
    failure: { moral: -5 },
    texts: {
      success: [
        '{team} {versteckte|versteckten} einen gesuchten Nachbarn {ort} für vier Nächte. Am fünften Morgen konnte er mit dem Zug zu Verwandten aufs Land fahren. Beim Abschied hat er geweint.',
        '{team} {brachte|brachten} eine verfolgte Familie {ort} unter. Niemand im Haus hat etwas verraten. Die Familie ist in Sicherheit, vorerst.',
      ],
      failure: [
        'Der Unterschlupf {ort} war nicht sicher genug. Der Verfolgte zog nach einer Nacht weiter. {team} {weiß|wissen} nicht, wohin er gegangen ist.',
      ],
      detected: [
        'Eine Nachbarin hat den Fremden {ort} bemerkt und geredet. {team} {musste|mussten} ihn in letzter Minute fortbringen. Nun fragt man nach {ihm|ihr|ihnen}.',
      ],
    },
  },
  ausweise: {
    type: 'ausweise',
    title: 'Falsche Papiere besorgen',
    tag: 'Papiere',
    night: '{team} {trifft|treffen} {ort} einen Fälscher.',
    short: 'Kostet Geld, bringt einen gefälschten Ausweis',
    dossier:
      'Ein Drucker in einer Hinterhofwerkstatt fertigt Ausweise mit fremden Namen. Wer gesucht wird, kann damit untertauchen. Der Mann verlangt viel Geld, und man weiß nie, ob er nicht selbst für die Polizei arbeitet.',
    primary: 'heimlichkeit',
    secondary: 'bildung',
    difficulty: 6,
    baseRisk: 16,
    heat: 6,
    cost: { kasse: 30 },
    places: ['kochstrasse', 'richardplatz', 'leopoldplatz', 'hermannstrasse', 'alexanderplatz'],
    rewardLabel: 'Ein gefälschter Ausweis. Er senkt den Fahndungsdruck eines Gefährten deutlich.',
    success: () => ({ items: { ausweise: 1 } }),
    failure: { kasse: 15 },
    texts: {
      success: [
        '{team} {traf|trafen} den Fälscher {ort}. Der Ausweis ist gut gemacht, mit Stempel und Lichtbild. Er liegt nun unter einem losen Dielenbrett.',
      ],
      failure: [
        'Der Fälscher erschien nicht am Treffpunkt {ort}. {team} {wartete|warteten} zwei Stunden vergeblich. Die Anzahlung ist verloren, der Rest blieb in der Kasse.',
      ],
      detected: [
        'Der Treffpunkt {ort} wurde beobachtet. {team} {bemerkte|bemerkten} die Männer in Zivil gerade noch rechtzeitig.',
      ],
    },
  },

  /*
   * Das Vorhaben „Eigene Druckerei“ in drei Schritten, danach die eigene Zeitung.
   */
  presse: {
    type: 'presse',
    title: 'Eine Druckpresse kaufen',
    tag: 'Presse',
    night: '{team} {verhandelt|verhandeln} {ort} über eine alte Druckpresse.',
    short: 'Vorhaben, Schritt 1 von 3: die eigene Druckerei',
    dossier:
      'Seit die Zeitungen der Linken verboten sind, stehen in vielen Druckereien die Maschinen still. Ein Setzer würde eine kleine Tiegelpresse verkaufen, wenn niemand erfährt, an wen. Mit einer eigenen Presse kann die Gruppe viel mehr drucken. Dies ist der erste von drei Schritten.',
    primary: 'empathie',
    secondary: 'bildung',
    difficulty: 5,
    baseRisk: 12,
    heat: 5,
    cost: { kasse: 35 },
    places: ['kochstrasse', 'linienstrasse'],
    rewardLabel: 'Schritt 1 von 3 zur eigenen Druckerei',
    success: () => ({ flags: ['presse'], moral: 3 }),
    failure: { kasse: 35 },
    texts: {
      success: [
        'Der alte Setzer {ort} sah {team} lange an. Dann nickte er. „Nehmt sie. Ich will, dass sie wieder etwas Anständiges druckt.“ Die Presse gehört jetzt der Gruppe. Nun muss sie nur noch fort von hier.',
      ],
      failure: ['Der Setzer {ort} bekam Angst und wollte nicht mehr verkaufen. {team} {nahm|nahmen} das Geld wieder mit.'],
      detected: [
        'Ein Nachbar des Setzers {ort} hat {team} ausgefragt. {Er|Sie|Sie} {verschwand|verschwanden}, bevor er die Polizei holen konnte.',
      ],
    },
  },
  transport: {
    type: 'transport',
    title: 'Die Presse durch die Stadt schaffen',
    tag: 'Transport',
    night: '{team} {schiebt|schieben} {ort} einen schweren Handwagen durch die Nacht.',
    short: 'Vorhaben, Schritt 2 von 3: die eigene Druckerei',
    dossier:
      'Die Presse wiegt so viel wie drei Männer. Zerlegt in Einzelteile und versteckt unter Kohlen auf einem Handwagen muss sie quer durch die Stadt. Jede Streife könnte fragen, was unter den Kohlen liegt. Dies ist der zweite Schritt.',
    primary: 'staerke',
    secondary: 'heimlichkeit',
    difficulty: 7,
    baseRisk: 20,
    heat: 9,
    cost: {},
    places: ['goerlitzer', 'mariannenplatz', 'hermannplatz'],
    rewardLabel: 'Schritt 2 von 3 zur eigenen Druckerei',
    success: () => ({ flags: ['transport'], moral: 3 }),
    failure: { moral: -3 },
    texts: {
      success: [
        '{team} {zog|zogen} den Handwagen {ort} an zwei Streifen vorbei. Niemand wollte unter die Kohlen sehen. Die Einzelteile liegen jetzt im Versteck.',
      ],
      failure: [
        'Das Rad des Handwagens brach {ort}. {team} {musste|mussten} die Teile in einem Hauseingang verstecken und morgen wiederkommen.',
      ],
      detected: [
        'Ein Polizist {ort} wurde auf den Handwagen aufmerksam. {team} {ließ|ließen} ihn stehen und {floh|flohen}. Die Teile konnten später zum Glück geholt werden.',
      ],
    },
  },
  keller: {
    type: 'keller',
    title: 'Einen Druckkeller einrichten',
    tag: 'Keller',
    night: '{team} {richtet|richten} {ort} heimlich einen Druckkeller ein.',
    short: 'Vorhaben, Schritt 3 von 3: die eigene Druckerei',
    dossier:
      'Die Presse braucht einen Keller, in dem niemand das Klappern hört. Decken vor die Fenster, Stroh unter die Füße der Maschine, ein zweiter Ausgang über den Hof. Wenn das gelingt, druckt die Gruppe künftig mehr Flugblätter und kann sogar eine eigene Zeitung herausgeben.',
    primary: 'bildung',
    secondary: 'heimlichkeit',
    difficulty: 6,
    baseRisk: 14,
    heat: 6,
    cost: { kasse: 10 },
    places: ['koesliner', 'richardplatz', 'hermannstrasse', 'linienstrasse'],
    rewardLabel: 'Die eigene Druckerei: mehr Flugblätter und eine eigene Zeitung',
    success: () => ({ flags: ['druckerei'], moral: 8 }),
    failure: { kasse: 10 },
    texts: {
      success: [
        'Die ganze Nacht {arbeitete|arbeiteten} {team} {ort}. Am Morgen lief die Presse zum ersten Mal, leise wie ein Uhrwerk. Die Gruppe hat jetzt ihre eigene Druckerei.',
      ],
      failure: ['Der Keller {ort} war zu feucht, die Farbe trocknete nicht. {team} {muss|müssen} einen besseren Ort suchen.'],
      detected: [
        'Der Hauswart {ort} hat {team} mit den Decken gesehen und Fragen gestellt. Der Keller ist verloren, die Presse zum Glück nicht.',
      ],
    },
  },
  zeitung: {
    type: 'zeitung',
    title: 'Eine eigene Zeitung herausgeben',
    tag: 'Zeitung',
    night: '{team} {druckt|drucken} {ort} die erste Ausgabe der eigenen Zeitung.',
    short: 'Braucht Papier und Farbe, bringt viele Unterstützer',
    dossier:
      'Mit der eigenen Druckerei kann die Gruppe mehr als Flugblätter herstellen: eine kleine Zeitung mit Nachrichten, die sonst niemand druckt. In Berlin erscheinen 1933 solche Blätter heimlich und werden von Hand zu Hand weitergegeben. Wer mit einer erwischt wird, kommt ins Gefängnis.',
    primary: 'propaganda',
    secondary: 'bildung',
    difficulty: 8,
    baseRisk: 24,
    heat: 12,
    cost: { items: { papier: 2, farbe: 1 } },
    places: ['koesliner', 'richardplatz', 'hermannstrasse', 'linienstrasse'],
    rewardLabel: '6 bis 10 Unterstützer und viel Moral',
    success: (rng) => ({ supporters: 6 + Math.floor(rng() * 5), moral: 10 }),
    failure: { moral: -4 },
    texts: {
      success: [
        'Zweihundert Ausgaben, gefaltet und gebündelt. Schon am nächsten Tag lesen Menschen in drei Bezirken, was {team} {ort} gedruckt {hat|haben}. Die Zeitung wird weitergereicht, bis das Papier weich ist.',
      ],
      failure: ['Die Presse {ort} fraß das halbe Papier. Die Ausgabe ist kaum lesbar, {team} {muss|müssen} von vorn beginnen.'],
      detected: [
        'Jemand hat die frischen Blätter {ort} gesehen. {team} {verbrannte|verbrannten} die Ausgabe im Ofen, bevor die Polizei kam.',
      ],
    },
  },
  /*
   * Aufträge, die es nur in einem bestimmten Bezirk gibt.
   */
  rotehilfe: {
    type: 'rotehilfe',
    title: 'Familien von Verhafteten unterstützen',
    tag: 'Hilfe',
    night: '{team} {bringt|bringen} {ort} Lebensmittel zu den Familien der Verhafteten.',
    short: 'Nur im Wedding: Hilfe für die Familien',
    dossier:
      'Hinter vielen Türen im Wedding sitzen Frauen und Kinder, deren Männer und Väter in Schutzhaft sind. Ohne Lohn reicht es nicht für Miete und Brot. Die verbotene Rote Hilfe sammelt heimlich Geld und Lebensmittel für sie. Wer hilft, zeigt: Ihr seid nicht vergessen.',
    primary: 'empathie',
    secondary: 'heimlichkeit',
    difficulty: 5,
    baseRisk: 14,
    heat: 6,
    cost: { kasse: 10 },
    places: ['koesliner', 'leopoldplatz', 'schillerpark'],
    rewardLabel: '3 Unterstützer und Moral',
    success: () => ({ supporters: 3, moral: 6 }),
    failure: { moral: -1 },
    texts: {
      success: [
        '{team} {stellte|stellten} {ort} Körbe mit Brot, Kartoffeln und Kohlen vor die Türen. Eine Frau weinte. Ihr kleiner Sohn fragte, ob sein Vater die Kartoffeln geschickt habe.',
      ],
      failure: ['Vor dem Haus {ort} stand ein Mann und sah zu den Fenstern hinauf. {team} {trug|trugen} die Körbe wieder fort.'],
      detected: ['Ein Parteigenosse {ort} hat {team} mit den Körben gesehen und sich die Gesichter gemerkt.'],
    },
  },
  warnung: {
    type: 'warnung',
    title: 'Eine Warnung aus dem Präsidium weitergeben',
    tag: 'Warnung',
    night: '{team} {trifft|treffen} {ort} einen Schreiber aus dem Polizeipräsidium.',
    short: 'Nur in Mitte: senkt den Fahndungsdruck aller',
    dossier:
      'Nicht alle Beamten im Polizeipräsidium am Alexanderplatz sind Nationalsozialisten. Ein Schreiber aus der Registratur lässt wissen, welche Namen auf den nächsten Listen stehen. Wer ihn trifft, muss sehr vorsichtig sein, denn auch er wird beobachtet.',
    primary: 'heimlichkeit',
    secondary: 'empathie',
    difficulty: 6,
    baseRisk: 20,
    heat: 7,
    cost: {},
    places: ['alexanderplatz', 'hackescher'],
    rewardLabel: 'Fahndungsdruck aller Gefährten sinkt deutlich',
    success: () => ({ heatAll: -12 }),
    failure: {},
    texts: {
      success: [
        'Der Schreiber {ort} steckte {team} einen gefalteten Zettel zu. Zwei Namen aus der Gruppe standen darauf. Wer gemeint ist, schläft in dieser Woche woanders.',
      ],
      failure: ['Der Schreiber kam nicht. Vielleicht hatte er Angst, vielleicht wurde er beobachtet. {team} {wartete|warteten} {ort} vergeblich.'],
      detected: [
        'Zwei Männer in Zivil folgten dem Schreiber {ort}. {team} {ging|gingen} an ihm vorbei, ohne ihn anzusehen.',
      ],
    },
  },
  nachrichten: {
    type: 'nachrichten',
    title: 'Nachrichten aus dem Ausland abschreiben',
    tag: 'Ausland',
    night: '{team} {schreibt|schreiben} {ort} Berichte aus ausländischen Zeitungen ab.',
    short: 'Nur in Kreuzberg: die Wahrheit weitergeben',
    dossier:
      'An manchen Kiosken gibt es noch Zeitungen aus der Schweiz und aus England. Dort steht, was deutsche Blätter verschweigen: die Verhaftungen, die Lager, die Gewalt. Man muss die Berichte abschreiben und weitergeben, bevor auch diese Zeitungen verboten werden.',
    primary: 'bildung',
    secondary: 'propaganda',
    difficulty: 5,
    baseRisk: 12,
    heat: 5,
    cost: { items: { papier: 1 } },
    places: ['kochstrasse', 'marheineke'],
    rewardLabel: '1 Bündel Flugblätter und 2 Unterstützer',
    success: () => ({ items: { flugblaetter: 1 }, supporters: 2 }),
    failure: {},
    texts: {
      success: [
        '{team} {las|lasen} {ort} eine Zeitung aus Zürich und {schrieb|schrieben} ab, was dort über die Lager stand. Die Abschriften gehen von Hand zu Hand.',
      ],
      failure: ['Der Kiosk {ort} hatte keine ausländischen Zeitungen mehr. Sie seien „nicht mehr erwünscht“, sagte der Händler.'],
      detected: ['Ein Mann las {ort} über die Schulter mit. Am nächsten Tag stand ein Polizist neben dem Kiosk.'],
    },
  },
  sportverein: {
    type: 'sportverein',
    title: 'Heimliches Treffen des Arbeitersportvereins',
    tag: 'Treffen',
    night: '{team} {trifft|treffen} sich {ort} mit den alten Sportkameraden.',
    short: 'Nur in Neukölln: Mut für viele',
    dossier:
      'Die Arbeitersportvereine sind verboten, ihre Turnhallen beschlagnahmt. Doch die alten Mitglieder treffen sich weiter, getarnt als Wandergruppe oder Kartenrunde. Wer dort spricht, erreicht Dutzende, die sich noch nicht aufgegeben haben.',
    primary: 'empathie',
    secondary: 'staerke',
    difficulty: 5,
    baseRisk: 12,
    heat: 5,
    cost: {},
    places: ['rathaus', 'richardplatz', 'hermannstrasse'],
    rewardLabel: 'Moral und 2 Unterstützer',
    success: () => ({ moral: 6, supporters: 2 }),
    failure: { moral: -1 },
    texts: {
      success: [
        'Zwanzig Männer und Frauen saßen {ort} beim Kartenspiel. Als {team} {sprach|sprachen}, legten sie die Karten weg und hörten zu. Zum Abschied sangen sie leise ein altes Lied.',
      ],
      failure: ['Nur drei Leute kamen {ort}. Die anderen trauen sich nicht mehr.'],
      detected: ['Die „Kartenrunde“ {ort} wurde von einem Wirt gemeldet. {team} {verließ|verließen} das Lokal durch die Küche.'],
    },
  },
  /*
   * Aufträge ab 1936.
   */
  ausreise: {
    type: 'ausreise',
    title: 'Einer jüdischen Familie bei der Ausreise helfen',
    tag: 'Ausreise',
    night: '{team} {hilft|helfen} {ort} einer Familie, ihre Papiere für die Ausreise zu ordnen.',
    short: 'Ab 1938: Menschen retten, die fliehen müssen',
    dossier:
      'Viele jüdische Familien wollen Deutschland verlassen, doch die Ämter verlangen Stapel von Papieren, Steuern und Bescheinigungen. Ohne Geld und Hilfe schafft es kaum jemand. Wer hilft, rettet vielleicht Leben.',
    primary: 'bildung',
    secondary: 'empathie',
    difficulty: 6,
    baseRisk: 14,
    heat: 6,
    cost: { kasse: 20 },
    places: ['scheunenviertel', 'hackescher', 'mariannenplatz', 'rathaus'],
    rewardLabel: 'Eine Familie kommt ihrer Rettung näher. Viel Moral.',
    success: () => ({ moral: 10, supporters: 1 }),
    failure: { moral: -3 },
    texts: {
      success: [
        '{team} {saß|saßen} {ort} bis tief in die Nacht über Formularen. Drei Wochen später kam die Nachricht: Die Familie hat ein Visum für Amerika.',
      ],
      failure: ['Das Amt verlangte eine weitere Bescheinigung. {team} {konnte|konnten} {ort} nichts mehr ausrichten. Die Familie wartet weiter.'],
      detected: ['Ein Nachbar {ort} hat die Polizei gerufen, weil „Fremde bei den Juden“ ein und aus gehen.'],
    },
  },
  pakete: {
    type: 'pakete',
    title: 'Pakete für Häftlinge packen',
    tag: 'Pakete',
    night: '{team} {packt|packen} {ort} Pakete für Gefangene in Sachsenhausen.',
    short: 'Ab 1936: Hilfe für die Gefangenen im Lager',
    dossier:
      'Die Familien der Häftlinge in Sachsenhausen dürfen manchmal Geld und Wäsche schicken. Aber viele haben selbst nichts mehr. Die Gruppe sammelt warme Sachen und etwas Geld, damit kein Gefangener vergessen wird.',
    primary: 'empathie',
    secondary: 'heimlichkeit',
    difficulty: 4,
    baseRisk: 12,
    heat: 5,
    cost: { kasse: 10 },
    places: ['koesliner', 'leopoldplatz', 'hermannstrasse', 'marheineke'],
    rewardLabel: 'Moral und Vertrauen der Familien',
    success: () => ({ moral: 7, supporters: 2 }),
    failure: { moral: -1 },
    texts: {
      success: [
        '{team} {packte|packten} {ort} wollene Socken, Seife und ein paar Mark in braunes Papier. Die Mutter eines Häftlings hat das Paket abgeschickt. „Er soll wissen, dass es noch Menschen gibt“, sagte sie.',
      ],
      failure: ['Die Sammlung {ort} brachte kaum etwas ein. Die Menschen haben selbst wenig.'],
      detected: ['Ein Blockwart {ort} wollte wissen, für wen die Pakete sind. {team} {log|logen} ihm etwas vor.'],
    },
  },
  reporter: {
    type: 'reporter',
    title: 'Berichte an ausländische Reporter geben',
    tag: 'Reporter',
    night: '{team} {trifft|treffen} {ort} einen Reporter aus dem Ausland.',
    short: 'Nur während der Olympischen Spiele: der Welt die Wahrheit sagen',
    dossier:
      'Während der Olympischen Spiele sind Hunderte ausländische Journalisten in der Stadt. Sie sehen nur, was man ihnen zeigt. Wer ihnen Berichte über Lager und Verhaftungen zusteckt, erreicht die ganze Welt, aber die Gestapo beobachtet die Gäste genau.',
    primary: 'propaganda',
    secondary: 'heimlichkeit',
    difficulty: 6,
    baseRisk: 22,
    heat: 10,
    cost: { items: { flugblaetter: 1 } },
    places: ['alexanderplatz', 'opernplatz', 'kochstrasse'],
    rewardLabel: 'Die Welt erfährt die Wahrheit: viele Unterstützer und Moral',
    success: () => ({ moral: 9, supporters: 4 }),
    failure: { moral: -2 },
    texts: {
      success: [
        '{team} {steckte|steckten} einem Reporter aus Paris {ort} die Berichte zu. Zwei Wochen später bringt jemand eine französische Zeitung mit: Das Lager Sachsenhausen steht auf der ersten Seite.',
      ],
      failure: ['Der Reporter {ort} hatte Angst und wollte nichts annehmen. „Ich muss hier noch drei Wochen arbeiten“, sagte er.'],
      detected: ['Ein Mann in Zivil folgte dem Reporter {ort}. {team} {tauchte|tauchten} in der Menge unter.'],
    },
  },
}

export const DETECTED_EFFECTS: Effects = { moral: -6 }
export const DETECTION_HEAT = 20
