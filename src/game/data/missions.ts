import { L, type Txt } from '../text'
import type { Effects, Inventory, MissionType, StatKey } from '../types'

export interface MissionTemplate {
  type: MissionType
  title: Txt
  /** Kurzes Etikett auf der Stadtkarte, höchstens neun Zeichen */
  tag: string
  /** Zwischentitel der Nachtsequenz */
  night: Txt
  short: Txt
  dossier: Txt
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
  rewardLabel: Txt
  /** Hilft der Auftrag verfolgten Menschen direkt? Dann zählt er für die Solidarität. */
  solidarity?: boolean
  success: (rng: () => number, flags: string[]) => Effects
  failure: Effects
  /**
   * Platzhalter: {team}, {ort}, {Ort} (am Satzanfang),
   * {einzahl|mehrzahl} und {er|sie|mehrzahl} je nach Größe und Geschlecht des Teams.
   */
  texts: { success: Txt[]; failure: Txt[]; detected: Txt[] }
}

const between = (rng: () => number, min: number, max: number) => min + Math.floor(rng() * (max - min + 1))

export const MISSIONS: Record<MissionType, MissionTemplate> = {
  spenden: {
    type: 'spenden',
    title: L('Heimlich Geld sammeln', 'Spenden im Geheimen sammeln'),
    tag: 'Spenden',
    night: L('{team} {sammelt|sammeln} {ort} heimlich Geld.', '{team} {sammelt|sammeln} {ort} heimlich Geld.'),
    short: L('Bringt Geld in die Kasse', 'Bringt Reichsmark in die Kasse'),
    dossier: L(
      'Manche Menschen trauen sich nicht, selbst etwas zu tun. Aber sie wollen helfen. Man muss sie leise ansprechen: bei der Arbeit, im Treppenhaus, nach der Kirche. Ein falsches Wort beim falschen Nachbarn, und die Polizei steht vor der Tür.',
      'Es gibt Menschen, die nicht selbst handeln wollen, aber helfen möchten. Man muss sie leise ansprechen, bei der Arbeit, im Treppenhaus, nach dem Gottesdienst. Ein falsches Wort an den falschen Nachbarn genügt, und die Polizei steht vor der Tür.',
    ),
    primary: 'empathie',
    secondary: 'propaganda',
    difficulty: 4,
    baseRisk: 6,
    heat: 3,
    cost: {},
    places: ['koesliner', 'aeg', 'leopoldplatz', 'schillerpark', 'hermannstrasse', 'rathaus', 'mariannenplatz', 'marheineke', 'scheunenviertel'],
    rewardLabel: L('15 bis 30 Reichsmark und ein neuer Unterstützer', '15 bis 30 Reichsmark, dazu ein neuer Unterstützer'),
    success: (rng) => ({ kasse: between(rng, 15, 30), supporters: 1 }),
    failure: {},
    texts: {
      success: [
        L(
          '{team} {ging|gingen} von Tür zu Tür. {Ort} gaben viele mehr, als sie hatten. Eine alte Frau gab {ihm|ihr|ihnen} ihr letztes Geldstück und sagte nur: „Macht weiter.“',
          '{team} {ging|gingen} von Tür zu Tür. {Ort} gaben viele mehr, als sie entbehren konnten. Eine alte Frau drückte {ihm|ihr|ihnen} ihr letztes Markstück in die Hand und sagte nur: „Macht weiter.“',
        ),
        L(
          '{team} {sprach|sprachen} nach der Arbeit mit Kollegen und Bekannten. {Ort} kam eine ordentliche Summe zusammen.',
          '{team} {sprach|sprachen} nach Feierabend mit Kollegen und Bekannten. {Ort} kam eine ordentliche Summe zusammen, eingewickelt in Zeitungspapier.',
        ),
      ],
      failure: [
        L(
          '{team} {klopfte|klopften} an viele Türen. {Ort} blieben die meisten zu. Die Menschen haben Angst.',
          '{team} {klopfte|klopften} an viele Türen. {Ort} blieben die meisten verschlossen. Die Menschen haben Angst, und wer kann es ihnen verdenken.',
        ),
      ],
      detected: [
        L(
          'Ein Nazi aus dem Nachbarhaus hat {team} {ort} beobachtet und Namen aufgeschrieben. Jetzt wird über {ihn|sie|sie} geredet.',
          'Ein Parteigenosse aus dem Nachbarhaus hat {team} {ort} beobachtet und sich Namen notiert. Nun wird über {ihn|sie|sie} geredet.',
        ),
      ],
    },
  },
  papier: {
    type: 'papier',
    title: 'Papier und Druckfarbe kaufen',
    tag: 'Einkauf',
    night: L('{team} {kauft|kaufen} {ort} Papier und Farbe.', '{team} {kauft|kaufen} {ort} Papier und Farbe.'),
    short: L('Kostet Geld, bringt Material zum Drucken', 'Kostet Geld, bringt Druckmaterial'),
    dossier: L(
      'Wer viel Papier und Druckfarbe kauft, fällt auf. Manche Händler melden der Polizei, wer viel kauft. Deshalb kauft man wenig auf einmal, in verschiedenen Läden. Alles kommt in Einkaufstaschen nach Hause.',
      'Wer viel Papier und Druckfarbe kauft, macht sich verdächtig. Manche Händler melden der Polizei, wer große Mengen kauft. Man kauft darum in kleinen Mengen, bei verschiedenen Geschäften, und trägt alles in Einkaufstaschen nach Hause.',
    ),
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
        L(
          '{team} {kaufte|kauften} in drei verschiedenen Läden ein. {Ort} fragte niemand, wozu man so viel Papier braucht. Drei Stapel Papier und zwei Dosen Farbe liegen jetzt im Versteck.',
          '{team} {kaufte|kauften} in drei verschiedenen Läden ein. {Ort} fragte niemand, wozu man so viel Papier braucht. Drei Ries Papier und zwei Dosen Farbe liegen nun im Versteck.',
        ),
      ],
      failure: [
        L(
          'Der Händler {ort} wurde misstrauisch und wollte einen Namen wissen. {team} {ging|gingen} ohne Ware weg. Das Geld blieb in der Kasse.',
          'Der Händler {ort} wurde misstrauisch und verlangte einen Namen. {team} {ging|gingen} ohne Ware davon. Das Geld blieb in der Kasse.',
        ),
      ],
      detected: [
        L(
          'Der Händler {ort} hat die Polizei gerufen. {team} {konnte|konnten} fliehen. Aber jetzt liegt eine Beschreibung auf der Wache.',
          'Der Händler {ort} hat die Polizei gerufen. {team} {konnte|konnten} entkommen, doch eine Beschreibung liegt nun auf der Wache.',
        ),
      ],
    },
  },
  druck: {
    type: 'druck',
    title: L('Flugblätter gegen die Nazis drucken', 'Antifaschistische Flugblätter drucken'),
    tag: 'Drucken',
    night: L('{team} {druckt|drucken} {ort} Flugblätter.', '{team} {druckt|drucken} {ort} Flugblätter.'),
    short: L('Braucht Papier und Farbe, bringt Flugblätter', 'Braucht Papier und Farbe, bringt Flugblätter'),
    dossier: L(
      'Im Keller steht eine alte Druckmaschine. Sie ist laut, und die Farbe riecht durchs ganze Haus. Man druckt nachts und hängt Decken vor die Kellerfenster. Auf den Blättern steht, was in keiner Zeitung mehr stehen darf.',
      'Im Keller steht eine alte Handpresse. Sie ist laut, und der Geruch der Druckfarbe zieht durch das ganze Haus. Man druckt nachts und legt Decken über die Kellerfenster. Auf den Blättern steht, was keine Zeitung mehr drucken darf: die Wahrheit über Verhaftungen, Lager und Gewalt.',
    ),
    primary: 'bildung',
    secondary: 'staerke',
    difficulty: 5,
    baseRisk: 14,
    heat: 5,
    cost: { items: { papier: 2, farbe: 1 } },
    places: ['linienstrasse', 'koesliner', 'mariannenplatz', 'hermannstrasse', 'richardplatz', 'hackescher'],
    rewardLabel: L('3 Bündel Flugblätter, mit eigener Druckerei 5', '3 Bündel Flugblätter, mit eigener Druckerei 5'),
    success: (_rng, flags) => ({ items: { flugblaetter: flags.includes('druckerei') ? 5 : 3 } }),
    failure: { items: { flugblaetter: 1 } },
    texts: {
      success: [
        L(
          '{team} {arbeitete|arbeiteten} die ganze Nacht an der Druckmaschine {ort}. Am Morgen hängen drei Bündel frische Flugblätter zum Trocknen auf der Leine.',
          '{team} {arbeitete|arbeiteten} die ganze Nacht an der Presse {ort}. Am Morgen hängen drei Bündel frischer Flugblätter zum Trocknen auf der Leine.',
        ),
      ],
      failure: [
        L(
          'Die Maschine {ort} hat die Farbe verschmiert. {team} {konnte|konnten} nur ein Bündel lesbare Blätter retten.',
          'Die Presse {ort} verschmierte die Farbe. {team} {konnte|konnten} nur ein einziges Bündel lesbarer Blätter retten.',
        ),
      ],
      detected: [
        L(
          'Ein Nachbar hat das Klappern der Maschine {ort} gemeldet. {team} {floh|flohen} über den Hof, bevor die Polizei kam.',
          'Ein Nachbar hat das Klappern der Presse {ort} gemeldet. {team} {floh|flohen} über den Hof, bevor die Polizei kam.',
        ),
      ],
    },
  },
  verteilen: {
    type: 'verteilen',
    title: L('Flugblätter nachts verteilen', 'Flugblätter in der Nacht verteilen'),
    tag: 'Verteilen',
    night: L('{team} {verteilt|verteilen} {ort} Flugblätter.', '{team} {verteilt|verteilen} {ort} Flugblätter.'),
    short: L('Braucht Flugblätter, bringt Unterstützer und Mut', 'Braucht Flugblätter, bringt Unterstützer und Mut'),
    dossier: L(
      'Die Blätter müssen zu den Menschen. In Briefkästen, auf Treppen, zwischen die Zeitungen am Kiosk. Einer passt an der Ecke auf, die anderen sind schnell. Wer mit Flugblättern erwischt wird, kommt ins Gefängnis.',
      'Die Blätter müssen unter die Leute. In Briefkästen, auf Treppenstufen, zwischen die Zeitungen am Kiosk. Einer steht Schmiere an der Ecke, die anderen arbeiten schnell. Wer mit Flugschriften erwischt wird, kommt in Schutzhaft und später oft vor Gericht.',
    ),
    primary: 'heimlichkeit',
    secondary: 'propaganda',
    difficulty: 7,
    baseRisk: 24,
    heat: 10,
    cost: { items: { flugblaetter: 2 } },
    places: ['aeg', 'leopoldplatz', 'goerlitzer', 'hermannplatz', 'alexanderplatz', 'kochstrasse', 'opernplatz', 'schillerpark'],
    rewardLabel: L('3 bis 6 Unterstützer und Mut', '3 bis 6 Unterstützer, dazu Moral'),
    success: (rng) => ({ supporters: between(rng, 3, 6), moral: 6 }),
    failure: { moral: -3 },
    texts: {
      success: [
        L(
          '{team} {verteilte|verteilten} in der Nacht zwei Bündel Flugblätter. Am Morgen standen {ort} Menschen in kleinen Gruppen und lasen. Einige steckten die Blätter heimlich ein.',
          '{team} {verteilte|verteilten} in der Nacht zwei Bündel Flugblätter. Am Morgen standen {ort} Menschen in kleinen Gruppen beisammen und lasen. Einige steckten die Blätter heimlich ein.',
        ),
        L(
          '{team} {legte|legten} die Flugblätter {ort} in jeden Hausflur. Am nächsten Tag fragten Leute leise, wer das war und ob man helfen kann.',
          '{team} {legte|legten} die Flugschriften {ort} in jeden Hausflur. Schon am nächsten Tag fragten Leute leise, wer dahintersteckt und ob man helfen könne.',
        ),
      ],
      failure: [
        L(
          '{team} {musste|mussten} sich {ort} vor einer Streife verstecken. Die meisten Blätter landeten im Kanal, damit man sie nicht findet.',
          '{team} {musste|mussten} sich {ort} vor einer Streife verstecken. Die meisten Blätter landeten im Kanal, damit man sie nicht findet.',
        ),
      ],
      detected: [
        L(
          'Eine Streife der SA hat {team} {ort} gesehen. Es gab Pfiffe und Rufe. {Er|Sie|Sie} {rannte|rannten} durch die Hinterhöfe davon.',
          'Eine Streife der SA hat {team} {ort} gesehen. Es gab Pfiffe und laute Rufe. {Er|Sie|Sie} {rannte|rannten} durch die Hinterhöfe davon.',
        ),
      ],
    },
  },
  parolen: {
    type: 'parolen',
    title: 'Parolen an Häuserwände malen',
    tag: 'Parolen',
    night: L('{team} {malt|malen} {ort} Parolen an die Wand.', '{team} {malt|malen} {ort} Parolen an die Wand.'),
    short: L('Braucht Farbe, bringt Mut und Hoffnung', 'Braucht Farbe, bringt Mut und Hoffnung'),
    dossier: L(
      'Ein paar Worte an einer Mauer, so groß, dass die ganze Straße sie am Morgen liest. „Freiheit!“ oder „Nieder mit Hitler!“ Es dauert nur Minuten. Aber in diesen Minuten ist man ungeschützt.',
      'Ein paar Worte an einer Mauer, groß genug, dass die ganze Straße sie am Morgen liest. „Freiheit!“ oder „Nieder mit Hitler!“ Es dauert nur Minuten, aber in diesen Minuten ist man ungeschützt.',
    ),
    primary: 'heimlichkeit',
    secondary: 'staerke',
    difficulty: 6,
    baseRisk: 18,
    heat: 8,
    cost: { items: { farbe: 1 } },
    places: ['koesliner', 'goerlitzer', 'hermannplatz', 'schillerpark', 'rathaus', 'mariannenplatz', 'leopoldplatz'],
    rewardLabel: L('Mut und ein neuer Unterstützer', 'Moral, dazu ein neuer Unterstützer'),
    success: () => ({ moral: 8, supporters: 1 }),
    failure: { moral: -2 },
    texts: {
      success: [
        L(
          'Am Morgen stand {ort} in weißen Buchstaben an der Wand: „Freiheit!“ Die SA hat es bis Mittag übermalt. Aber da hatten es schon Hunderte gelesen. {team} {ist|sind} gut zurückgekommen.',
          'Am Morgen stand {ort} in weißen Buchstaben an der Wand: „Freiheit!“ Die SA hat es bis Mittag übermalt, aber da hatten es schon Hunderte gelesen. {team} {ist|sind} wohlbehalten zurück.',
        ),
      ],
      failure: [
        L(
          '{team} {wurde|wurden} {ort} von einem Hausmeister gestört. {Er|Sie|Sie} {musste|mussten} aufhören. Nur ein halbes Wort steht jetzt an der Mauer.',
          '{team} {wurde|wurden} {ort} von einem Hauswart gestört und {musste|mussten} die Arbeit abbrechen. Nur ein halbes Wort steht nun an der Mauer.',
        ),
      ],
      detected: [
        L(
          'Jemand hat {team} {ort} mit dem Farbeimer gesehen. Ein Polizist rief laut. {Er|Sie|Sie} {ließ|ließen} alles stehen und {lief|liefen} weg.',
          '{team} {wurde|wurden} {ort} mit dem Farbeimer gesehen. Ein Polizist rief laut hinterher. {Er|Sie|Sie} {ließ|ließen} alles stehen und {lief|liefen}.',
        ),
      ],
    },
  },
  unterschlupf: {
    type: 'unterschlupf',
    title: L('Verfolgte Menschen verstecken', 'Verfolgten Nachbarn Unterschlupf gewähren'),
    tag: 'Versteck',
    night: L('{team} {versteckt|verstecken} {ort} einen Menschen, der gesucht wird.', '{team} {versteckt|verstecken} {ort} einen Verfolgten.'),
    short: L('Rettet Menschen, gibt viel Mut, ist aber gefährlich', 'Hilft Verfolgten direkt, großer Gewinn an Moral, aber gefährlich'),
    dossier: L(
      'Ein Mensch wird gesucht. Vielleicht, weil er Kommunist oder Gewerkschafter ist. Vielleicht, weil ihn jemand angezeigt hat. Er braucht für ein paar Nächte ein Bett, Essen und Menschen, die schweigen. Wer einen Verfolgten versteckt, bringt sich selbst in große Gefahr. Du selbst wirst nicht verfolgt. Genau deshalb kannst du helfen.',
      'Ein Mensch wird gesucht, weil er Kommunist oder Gewerkschafter ist, weil er in der falschen Partei war oder weil ihn jemand angezeigt hat. Er braucht für einige Nächte ein Bett, Essen und Menschen, die schweigen. Wer nicht selbst verfolgt wird, hat Möglichkeiten, die Verfolgten fehlen: eine unverdächtige Wohnung, einen sauberen Namen. Wer sie nutzt, bringt sich selbst in große Gefahr.',
    ),
    primary: 'empathie',
    secondary: 'heimlichkeit',
    difficulty: 7,
    baseRisk: 26,
    heat: 12,
    cost: { kasse: 10 },
    places: ['scheunenviertel', 'hackescher', 'mariannenplatz', 'richardplatz', 'schillerpark'],
    rewardLabel: L('2 Menschen geholfen und viel Mut für alle', '2 Menschen geholfen, dazu viel Moral für die ganze Gruppe'),
    solidarity: true,
    success: () => ({ moral: 15, helped: 2 }),
    failure: { moral: -5 },
    texts: {
      success: [
        L(
          '{team} {versteckte|versteckten} einen gesuchten Nachbarn {ort} vier Nächte lang. Am fünften Morgen konnte er mit dem Zug zu Verwandten aufs Land fahren. Beim Abschied hat er geweint.',
          '{team} {versteckte|versteckten} einen gesuchten Nachbarn {ort} für vier Nächte. Am fünften Morgen konnte er mit dem Zug zu Verwandten aufs Land fahren. Beim Abschied hat er geweint.',
        ),
        L(
          '{team} {brachte|brachten} eine verfolgte Familie {ort} unter. Niemand im Haus hat etwas verraten. Die Familie ist in Sicherheit, erst einmal.',
          '{team} {brachte|brachten} eine verfolgte Familie {ort} unter. Niemand im Haus hat etwas verraten. Die Familie ist in Sicherheit, vorerst.',
        ),
      ],
      failure: [
        L(
          'Das Versteck {ort} war nicht sicher genug. Der Verfolgte ging nach einer Nacht weiter. {team} {weiß|wissen} nicht, wohin.',
          'Der Unterschlupf {ort} war nicht sicher genug. Der Verfolgte zog nach einer Nacht weiter. {team} {weiß|wissen} nicht, wohin er gegangen ist.',
        ),
      ],
      detected: [
        L(
          'Eine Nachbarin hat den Fremden {ort} gesehen und davon erzählt. {team} {musste|mussten} ihn in letzter Minute wegbringen. Jetzt fragt man nach {ihm|ihr|ihnen}.',
          'Eine Nachbarin hat den Fremden {ort} bemerkt und geredet. {team} {musste|mussten} ihn in letzter Minute fortbringen. Nun fragt man nach {ihm|ihr|ihnen}.',
        ),
      ],
    },
  },
  ausweise: {
    type: 'ausweise',
    title: L('Falsche Ausweise besorgen', 'Falsche Papiere besorgen'),
    tag: 'Papiere',
    night: L('{team} {trifft|treffen} {ort} einen Fälscher.', '{team} {trifft|treffen} {ort} einen Fälscher.'),
    short: L('Kostet Geld, bringt einen falschen Ausweis', 'Kostet Geld, bringt einen gefälschten Ausweis'),
    dossier: L(
      'Ein Drucker in einer Werkstatt im Hinterhof macht Ausweise mit fremden Namen. Wer gesucht wird, kann damit untertauchen. Der Mann will viel Geld. Und man weiß nie, ob er nicht selbst für die Polizei arbeitet.',
      'Ein Drucker in einer Hinterhofwerkstatt fertigt Ausweise mit fremden Namen. Wer gesucht wird, kann damit untertauchen. Der Mann verlangt viel Geld, und man weiß nie, ob er nicht selbst für die Polizei arbeitet.',
    ),
    primary: 'heimlichkeit',
    secondary: 'bildung',
    difficulty: 6,
    baseRisk: 16,
    heat: 6,
    cost: { kasse: 30 },
    places: ['kochstrasse', 'richardplatz', 'leopoldplatz', 'hermannstrasse', 'alexanderplatz'],
    rewardLabel: L(
      'Ein falscher Ausweis. Damit sucht die Polizei einen Gefährten viel weniger.',
      'Ein gefälschter Ausweis. Er senkt den Fahndungsdruck eines Gefährten deutlich.',
    ),
    success: () => ({ items: { ausweise: 1 } }),
    failure: { kasse: 15 },
    texts: {
      success: [
        L(
          '{team} {traf|trafen} den Fälscher {ort}. Der Ausweis ist gut gemacht, mit Stempel und Foto. Er liegt jetzt unter einem losen Brett im Fußboden.',
          '{team} {traf|trafen} den Fälscher {ort}. Der Ausweis ist gut gemacht, mit Stempel und Lichtbild. Er liegt nun unter einem losen Dielenbrett.',
        ),
      ],
      failure: [
        L(
          'Der Fälscher kam nicht zum Treffpunkt {ort}. {team} {wartete|warteten} zwei Stunden umsonst. Die Anzahlung ist weg, der Rest blieb in der Kasse.',
          'Der Fälscher erschien nicht am Treffpunkt {ort}. {team} {wartete|warteten} zwei Stunden vergeblich. Die Anzahlung ist verloren, der Rest blieb in der Kasse.',
        ),
      ],
      detected: [
        L(
          'Der Treffpunkt {ort} wurde beobachtet. {team} {sah|sahen} die Männer in normaler Kleidung gerade noch rechtzeitig.',
          'Der Treffpunkt {ort} wurde beobachtet. {team} {bemerkte|bemerkten} die Männer in Zivil gerade noch rechtzeitig.',
        ),
      ],
    },
  },
  besorgung: {
    type: 'besorgung',
    title: L('Jüdischen Nachbarn beistehen', 'Jüdischen Nachbarn beistehen'),
    tag: 'Beistand',
    night: L(
      '{team} {besucht|besuchen} {ort} jüdische Nachbarn, die jetzt allein gelassen werden.',
      '{team} {besucht|besuchen} {ort} jüdische Nachbarn, die von allen anderen gemieden werden.',
    ),
    short: L('Hilft Verfolgten direkt: nicht wegsehen, beistehen', 'Hilft Verfolgten direkt: Beistand statt Wegsehen'),
    dossier: L(
      'Seit dem 1. April grüßen viele ihre jüdischen Nachbarn nicht mehr. Man kauft nicht mehr bei ihnen und geht ihnen aus dem Weg. Ihr macht das Gegenteil. Ihr kauft weiter in ihren Läden, bringt Nachrichten, begleitet sie zu den Ämtern. Das ist klein. Aber es zeigt: Ihr seid nicht allein. Wer dabei gesehen wird, gilt schnell als „Judenfreund“.',
      'Seit dem Boykott meiden viele ihre jüdischen Nachbarn. Man grüßt nicht mehr, kauft woanders, schaut weg. Beistand heißt: weiter bei ihnen einkaufen, Nachrichten bringen, zu den Ämtern begleiten, zuhören. Für die Verfolgten war dieser alltägliche Anstand oft wichtiger als große Gesten. Wer dabei beobachtet wurde, galt als „Judenfreund“ und konnte selbst in Gefahr geraten.',
    ),
    primary: 'empathie',
    secondary: 'heimlichkeit',
    difficulty: 4,
    baseRisk: 10,
    heat: 5,
    cost: { kasse: 5 },
    places: ['scheunenviertel', 'hackescher', 'marheineke', 'rathaus', 'mariannenplatz', 'hermannstrasse'],
    rewardLabel: L('2 Menschen geholfen, dazu Mut und Vertrauen', '2 Menschen geholfen, dazu Moral und Vertrauen im Bezirk'),
    solidarity: true,
    success: () => ({ helped: 2, moral: 4 }),
    failure: { moral: -1 },
    texts: {
      success: [
        L(
          '{team} {kaufte|kauften} {ort} bei einem jüdischen Bäcker ein, wie früher. Dann {trug|trugen} {er|sie|sie} einer alten Frau die Kohlen in den dritten Stock. „Sie sind die Ersten seit Wochen, die mich grüßen“, sagte sie.',
          '{team} {kaufte|kauften} {ort} demonstrativ bei einem jüdischen Bäcker ein und {begleitete|begleiteten} danach eine alte Nachbarin zum Amt. „Sie sind die Ersten seit Wochen, die mich auf der Straße grüßen“, sagte sie zum Abschied.',
        ),
        L(
          '{team} {brachte|brachten} einer jüdischen Familie {ort} Nachrichten und etwas zu essen. Die Kinder dürfen nicht mehr mit den anderen spielen. Heute haben sie zum ersten Mal wieder gelacht.',
          '{team} {saß|saßen} {ort} einen Abend lang bei einer jüdischen Familie, deren Kinder im Hof niemand mehr mitspielen lässt. Ihr habt nichts Großes getan. Aber die Familie weiß jetzt, dass nicht alle wegsehen.',
        ),
      ],
      failure: [
        L(
          'Die Familie {ort} hatte zu viel Angst und öffnete nicht. Zu oft hat es zuletzt geklopft, und es war nie etwas Gutes.',
          'Die Familie {ort} öffnete nicht. Zu oft hatte es in den letzten Wochen geklopft, und nie war es etwas Gutes gewesen.',
        ),
      ],
      detected: [
        L(
          'Ein Nachbar hat {team} {ort} gesehen. „Judenfreund!“, rief er laut. Jetzt wissen es alle in der Straße.',
          'Ein Nachbar hat {team} {ort} beobachtet und laut „Judenfreund!“ gerufen. Am nächsten Tag hing ein Zettel an der Haustür.',
        ),
      ],
    },
  },

  /*
   * Das Vorhaben „Eigene Druckerei“ in drei Schritten, danach die eigene Zeitung.
   */
  presse: {
    type: 'presse',
    title: L('Eine Druckmaschine kaufen', 'Eine Druckpresse kaufen'),
    tag: 'Presse',
    night: L('{team} {verhandelt|verhandeln} {ort} über eine alte Druckmaschine.', '{team} {verhandelt|verhandeln} {ort} über eine alte Druckpresse.'),
    short: L('Vorhaben, Schritt 1 von 3: die eigene Druckerei', 'Vorhaben, Schritt 1 von 3: die eigene Druckerei'),
    dossier: L(
      'Die Zeitungen der Linken sind verboten. In vielen Druckereien stehen jetzt die Maschinen still. Ein alter Drucker würde eine kleine Maschine verkaufen, wenn niemand erfährt, an wen. Mit einer eigenen Maschine kann die Gruppe viel mehr drucken. Das ist der erste von drei Schritten.',
      'Seit die Zeitungen der Linken verboten sind, stehen in vielen Druckereien die Maschinen still. Ein Setzer würde eine kleine Tiegelpresse verkaufen, wenn niemand erfährt, an wen. Mit einer eigenen Presse kann die Gruppe viel mehr drucken. Dies ist der erste von drei Schritten.',
    ),
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
        L(
          'Der alte Drucker {ort} sah {team} lange an. Dann nickte er. „Nehmt sie. Sie soll wieder etwas Anständiges drucken.“ Die Maschine gehört jetzt der Gruppe. Jetzt muss sie nur noch weg von hier.',
          'Der alte Setzer {ort} sah {team} lange an. Dann nickte er. „Nehmt sie. Ich will, dass sie wieder etwas Anständiges druckt.“ Die Presse gehört jetzt der Gruppe. Nun muss sie nur noch fort von hier.',
        ),
      ],
      failure: [
        L(
          'Der Drucker {ort} bekam Angst und wollte nicht mehr verkaufen. {team} {nahm|nahmen} das Geld wieder mit.',
          'Der Setzer {ort} bekam Angst und wollte nicht mehr verkaufen. {team} {nahm|nahmen} das Geld wieder mit.',
        ),
      ],
      detected: [
        L(
          'Ein Nachbar des Druckers {ort} hat {team} ausgefragt. {Er|Sie|Sie} {verschwand|verschwanden}, bevor er die Polizei holen konnte.',
          'Ein Nachbar des Setzers {ort} hat {team} ausgefragt. {Er|Sie|Sie} {verschwand|verschwanden}, bevor er die Polizei holen konnte.',
        ),
      ],
    },
  },
  transport: {
    type: 'transport',
    title: L('Die Druckmaschine durch die Stadt bringen', 'Die Presse durch die Stadt schaffen'),
    tag: 'Transport',
    night: L('{team} {schiebt|schieben} {ort} einen schweren Handwagen durch die Nacht.', '{team} {schiebt|schieben} {ort} einen schweren Handwagen durch die Nacht.'),
    short: L('Vorhaben, Schritt 2 von 3: die eigene Druckerei', 'Vorhaben, Schritt 2 von 3: die eigene Druckerei'),
    dossier: L(
      'Die Maschine ist so schwer wie drei Männer. Sie wird in Teile zerlegt und unter Kohlen auf einem Handwagen versteckt. So muss sie quer durch die Stadt. Jede Streife könnte fragen, was unter den Kohlen liegt. Das ist der zweite Schritt.',
      'Die Presse wiegt so viel wie drei Männer. Zerlegt in Einzelteile und versteckt unter Kohlen auf einem Handwagen muss sie quer durch die Stadt. Jede Streife könnte fragen, was unter den Kohlen liegt. Dies ist der zweite Schritt.',
    ),
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
        L(
          '{team} {zog|zogen} den Handwagen {ort} an zwei Streifen vorbei. Niemand wollte unter die Kohlen schauen. Die Teile liegen jetzt im Versteck.',
          '{team} {zog|zogen} den Handwagen {ort} an zwei Streifen vorbei. Niemand wollte unter die Kohlen sehen. Die Einzelteile liegen jetzt im Versteck.',
        ),
      ],
      failure: [
        L(
          'Das Rad des Handwagens brach {ort}. {team} {musste|mussten} die Teile in einem Hauseingang verstecken und morgen wiederkommen.',
          'Das Rad des Handwagens brach {ort}. {team} {musste|mussten} die Teile in einem Hauseingang verstecken und morgen wiederkommen.',
        ),
      ],
      detected: [
        L(
          'Ein Polizist {ort} hat den Handwagen bemerkt. {team} {ließ|ließen} ihn stehen und {floh|flohen}. Zum Glück konnten die Teile später geholt werden.',
          'Ein Polizist {ort} wurde auf den Handwagen aufmerksam. {team} {ließ|ließen} ihn stehen und {floh|flohen}. Die Teile konnten später zum Glück geholt werden.',
        ),
      ],
    },
  },
  keller: {
    type: 'keller',
    title: L('Einen Keller zum Drucken einrichten', 'Einen Druckkeller einrichten'),
    tag: 'Keller',
    night: L('{team} {richtet|richten} {ort} heimlich einen Keller zum Drucken ein.', '{team} {richtet|richten} {ort} heimlich einen Druckkeller ein.'),
    short: L('Vorhaben, Schritt 3 von 3: die eigene Druckerei', 'Vorhaben, Schritt 3 von 3: die eigene Druckerei'),
    dossier: L(
      'Die Maschine braucht einen Keller, in dem niemand das Klappern hört. Decken vor die Fenster, Stroh unter die Maschine, ein zweiter Ausgang über den Hof. Wenn das klappt, druckt die Gruppe mehr Flugblätter. Sie kann dann sogar eine eigene Zeitung machen.',
      'Die Presse braucht einen Keller, in dem niemand das Klappern hört. Decken vor die Fenster, Stroh unter die Füße der Maschine, ein zweiter Ausgang über den Hof. Wenn das gelingt, druckt die Gruppe künftig mehr Flugblätter und kann sogar eine eigene Zeitung herausgeben.',
    ),
    primary: 'bildung',
    secondary: 'heimlichkeit',
    difficulty: 6,
    baseRisk: 14,
    heat: 6,
    cost: { kasse: 10 },
    places: ['koesliner', 'richardplatz', 'hermannstrasse', 'linienstrasse'],
    rewardLabel: L('Die eigene Druckerei: mehr Flugblätter und eine eigene Zeitung', 'Die eigene Druckerei: mehr Flugblätter und eine eigene Zeitung'),
    success: () => ({ flags: ['druckerei'], moral: 8 }),
    failure: { kasse: 10 },
    texts: {
      success: [
        L(
          'Die ganze Nacht {arbeitete|arbeiteten} {team} {ort}. Am Morgen lief die Maschine zum ersten Mal, leise wie eine Uhr. Die Gruppe hat jetzt ihre eigene Druckerei.',
          'Die ganze Nacht {arbeitete|arbeiteten} {team} {ort}. Am Morgen lief die Presse zum ersten Mal, leise wie ein Uhrwerk. Die Gruppe hat jetzt ihre eigene Druckerei.',
        ),
      ],
      failure: [
        L(
          'Der Keller {ort} war zu feucht, die Farbe trocknete nicht. {team} {muss|müssen} einen besseren Ort suchen.',
          'Der Keller {ort} war zu feucht, die Farbe trocknete nicht. {team} {muss|müssen} einen besseren Ort suchen.',
        ),
      ],
      detected: [
        L(
          'Der Hausmeister {ort} hat {team} mit den Decken gesehen und Fragen gestellt. Der Keller ist verloren. Die Maschine zum Glück nicht.',
          'Der Hauswart {ort} hat {team} mit den Decken gesehen und Fragen gestellt. Der Keller ist verloren, die Presse zum Glück nicht.',
        ),
      ],
    },
  },
  zeitung: {
    type: 'zeitung',
    title: 'Eine eigene Zeitung herausgeben',
    tag: 'Zeitung',
    night: L('{team} {druckt|drucken} {ort} die erste eigene Zeitung.', '{team} {druckt|drucken} {ort} die erste Ausgabe der eigenen Zeitung.'),
    short: L('Braucht Papier und Farbe, bringt viele Unterstützer', 'Braucht Papier und Farbe, bringt viele Unterstützer'),
    dossier: L(
      'Mit der eigenen Druckerei kann die Gruppe mehr machen als Flugblätter: eine kleine Zeitung mit Nachrichten, die sonst niemand druckt. Solche Zeitungen wurden heimlich von Hand zu Hand gegeben. Wer damit erwischt wird, kommt ins Gefängnis.',
      'Mit der eigenen Druckerei kann die Gruppe mehr als Flugblätter herstellen: eine kleine Zeitung mit Nachrichten, die sonst niemand druckt. In Berlin erschienen solche Blätter heimlich und wurden von Hand zu Hand weitergegeben. Wer mit einer erwischt wurde, kam wegen „Vorbereitung zum Hochverrat“ vor Gericht.',
    ),
    primary: 'propaganda',
    secondary: 'bildung',
    difficulty: 8,
    baseRisk: 24,
    heat: 12,
    cost: { items: { papier: 2, farbe: 1 } },
    places: ['koesliner', 'richardplatz', 'hermannstrasse', 'linienstrasse'],
    rewardLabel: L('6 bis 10 Unterstützer und viel Mut', '6 bis 10 Unterstützer und viel Moral'),
    success: (rng) => ({ supporters: 6 + Math.floor(rng() * 5), moral: 10 }),
    failure: { moral: -4 },
    texts: {
      success: [
        L(
          'Zweihundert Zeitungen, gefaltet und gebündelt. Schon am nächsten Tag lesen Menschen in drei Bezirken, was {team} {ort} gedruckt {hat|haben}. Die Zeitung wird weitergegeben, bis das Papier ganz weich ist.',
          'Zweihundert Ausgaben, gefaltet und gebündelt. Schon am nächsten Tag lesen Menschen in drei Bezirken, was {team} {ort} gedruckt {hat|haben}. Die Zeitung wird weitergereicht, bis das Papier weich ist.',
        ),
      ],
      failure: [
        L(
          'Die Maschine {ort} hat das halbe Papier zerknüllt. Die Zeitung ist kaum lesbar. {team} {muss|müssen} von vorn anfangen.',
          'Die Presse {ort} fraß das halbe Papier. Die Ausgabe ist kaum lesbar, {team} {muss|müssen} von vorn beginnen.',
        ),
      ],
      detected: [
        L(
          'Jemand hat die frischen Blätter {ort} gesehen. {team} {verbrannte|verbrannten} alles im Ofen, bevor die Polizei kam.',
          'Jemand hat die frischen Blätter {ort} gesehen. {team} {verbrannte|verbrannten} die Ausgabe im Ofen, bevor die Polizei kam.',
        ),
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
    night: L('{team} {bringt|bringen} {ort} Essen zu den Familien der Verhafteten.', '{team} {bringt|bringen} {ort} Lebensmittel zu den Familien der Verhafteten.'),
    short: L('Nur im Wedding: Hilfe für die Familien', 'Nur im Wedding: praktische Solidarität mit den Familien'),
    dossier: L(
      'Im Wedding sitzen hinter vielen Türen Frauen und Kinder, deren Männer und Väter verhaftet sind. Ohne Lohn reicht das Geld nicht für Miete und Brot. Die verbotene Rote Hilfe sammelt heimlich Geld und Essen für sie. Wer hilft, zeigt: Ihr seid nicht vergessen.',
      'Hinter vielen Türen im Wedding sitzen Frauen und Kinder, deren Männer und Väter in Schutzhaft sind. Ohne Lohn reicht es nicht für Miete und Brot. Die verbotene Rote Hilfe sammelt heimlich Geld und Lebensmittel für sie. Wer hilft, zeigt: Ihr seid nicht vergessen.',
    ),
    primary: 'empathie',
    secondary: 'heimlichkeit',
    difficulty: 5,
    baseRisk: 14,
    heat: 6,
    cost: { kasse: 10 },
    places: ['koesliner', 'leopoldplatz', 'schillerpark'],
    rewardLabel: L('3 Menschen geholfen, dazu Unterstützer und Mut', '3 Menschen geholfen, dazu Unterstützer und Moral'),
    solidarity: true,
    success: () => ({ supporters: 2, moral: 6, helped: 3 }),
    failure: { moral: -1 },
    texts: {
      success: [
        L(
          '{team} {stellte|stellten} {ort} Körbe mit Brot, Kartoffeln und Kohlen vor die Türen. Eine Frau weinte. Ihr kleiner Sohn fragte, ob sein Vater die Kartoffeln geschickt hat.',
          '{team} {stellte|stellten} {ort} Körbe mit Brot, Kartoffeln und Kohlen vor die Türen. Eine Frau weinte. Ihr kleiner Sohn fragte, ob sein Vater die Kartoffeln geschickt habe.',
        ),
      ],
      failure: [
        L(
          'Vor dem Haus {ort} stand ein Mann und schaute zu den Fenstern hoch. {team} {trug|trugen} die Körbe wieder weg.',
          'Vor dem Haus {ort} stand ein Mann und sah zu den Fenstern hinauf. {team} {trug|trugen} die Körbe wieder fort.',
        ),
      ],
      detected: [
        L(
          'Ein Nazi {ort} hat {team} mit den Körben gesehen und sich die Gesichter gemerkt.',
          'Ein Parteigenosse {ort} hat {team} mit den Körben gesehen und sich die Gesichter gemerkt.',
        ),
      ],
    },
  },
  warnung: {
    type: 'warnung',
    title: L('Eine Warnung aus der Polizei weitergeben', 'Eine Warnung aus dem Präsidium weitergeben'),
    tag: 'Warnung',
    night: L('{team} {trifft|treffen} {ort} einen Schreiber aus dem Polizeipräsidium.', '{team} {trifft|treffen} {ort} einen Schreiber aus dem Polizeipräsidium.'),
    short: L('Nur in Mitte: warnt Menschen vor der Verhaftung', 'Nur in Mitte: warnt Menschen vor der Verhaftung, senkt den Fahndungsdruck aller'),
    dossier: L(
      'Nicht alle im Polizeipräsidium am Alexanderplatz sind Nazis. Ein Schreiber sagt heimlich, welche Namen auf den nächsten Listen stehen. So kann man die Menschen warnen, bevor die Polizei kommt. Wer ihn trifft, muss sehr vorsichtig sein. Auch er wird beobachtet.',
      'Nicht alle Beamten im Polizeipräsidium am Alexanderplatz sind Nationalsozialisten. Ein Schreiber aus der Registratur lässt wissen, welche Namen auf den nächsten Listen stehen. So lassen sich Menschen warnen, bevor sie abgeholt werden. Wer ihn trifft, muss sehr vorsichtig sein, denn auch er wird beobachtet.',
    ),
    primary: 'heimlichkeit',
    secondary: 'empathie',
    difficulty: 6,
    baseRisk: 20,
    heat: 7,
    cost: {},
    places: ['alexanderplatz', 'hackescher'],
    rewardLabel: L('2 Menschen gewarnt, und die Polizei sucht euch weniger', '2 Menschen gewarnt, dazu sinkt der Fahndungsdruck aller Gefährten deutlich'),
    solidarity: true,
    success: () => ({ heatAll: -12, helped: 2 }),
    failure: {},
    texts: {
      success: [
        L(
          'Der Schreiber {ort} gab {team} einen gefalteten Zettel. Darauf standen vier Namen. Zwei Nachbarn schlafen jetzt woanders. Zwei aus der Gruppe auch.',
          'Der Schreiber {ort} steckte {team} einen gefalteten Zettel zu. Vier Namen standen darauf, zwei davon aus der Gruppe. Wer gemeint ist, schläft in dieser Woche woanders.',
        ),
      ],
      failure: [
        L(
          'Der Schreiber kam nicht. Vielleicht hatte er Angst. Vielleicht wurde er beobachtet. {team} {wartete|warteten} {ort} umsonst.',
          'Der Schreiber kam nicht. Vielleicht hatte er Angst, vielleicht wurde er beobachtet. {team} {wartete|warteten} {ort} vergeblich.',
        ),
      ],
      detected: [
        L(
          'Zwei Männer in normaler Kleidung folgten dem Schreiber {ort}. {team} {ging|gingen} an ihm vorbei und {sah|sahen} ihn nicht an.',
          'Zwei Männer in Zivil folgten dem Schreiber {ort}. {team} {ging|gingen} an ihm vorbei, ohne ihn anzusehen.',
        ),
      ],
    },
  },
  nachrichten: {
    type: 'nachrichten',
    title: 'Nachrichten aus dem Ausland abschreiben',
    tag: 'Ausland',
    night: L('{team} {schreibt|schreiben} {ort} Berichte aus Zeitungen aus dem Ausland ab.', '{team} {schreibt|schreiben} {ort} Berichte aus ausländischen Zeitungen ab.'),
    short: L('Nur in Kreuzberg: die Wahrheit weitergeben', 'Nur in Kreuzberg: die Wahrheit weitergeben'),
    dossier: L(
      'An manchen Kiosken gibt es noch Zeitungen aus der Schweiz und aus England. Darin steht, was deutsche Zeitungen verschweigen: die Verhaftungen, die Lager, die Gewalt. Man muss die Berichte abschreiben und weitergeben, bevor auch diese Zeitungen verboten werden.',
      'An manchen Kiosken gibt es noch Zeitungen aus der Schweiz und aus England. Dort steht, was deutsche Blätter verschweigen: die Verhaftungen, die Lager, die Gewalt. Man muss die Berichte abschreiben und weitergeben, bevor auch diese Zeitungen verboten werden.',
    ),
    primary: 'bildung',
    secondary: 'propaganda',
    difficulty: 5,
    baseRisk: 12,
    heat: 5,
    cost: { items: { papier: 1 } },
    places: ['kochstrasse', 'marheineke'],
    rewardLabel: L('1 Bündel Flugblätter und 2 Unterstützer', '1 Bündel Flugblätter und 2 Unterstützer'),
    success: () => ({ items: { flugblaetter: 1 }, supporters: 2 }),
    failure: {},
    texts: {
      success: [
        L(
          '{team} {las|lasen} {ort} eine Zeitung aus Zürich. {Er|Sie|Sie} {schrieb|schrieben} ab, was dort über die Lager stand. Die Abschriften gehen jetzt von Hand zu Hand.',
          '{team} {las|lasen} {ort} eine Zeitung aus Zürich und {schrieb|schrieben} ab, was dort über die Lager stand. Die Abschriften gehen von Hand zu Hand.',
        ),
      ],
      failure: [
        L(
          'Der Kiosk {ort} hatte keine Zeitungen aus dem Ausland mehr. Sie seien „nicht mehr erwünscht“, sagte der Verkäufer.',
          'Der Kiosk {ort} hatte keine ausländischen Zeitungen mehr. Sie seien „nicht mehr erwünscht“, sagte der Händler.',
        ),
      ],
      detected: [
        L(
          'Ein Mann las {ort} über die Schulter mit. Am nächsten Tag stand ein Polizist neben dem Kiosk.',
          'Ein Mann las {ort} über die Schulter mit. Am nächsten Tag stand ein Polizist neben dem Kiosk.',
        ),
      ],
    },
  },
  sportverein: {
    type: 'sportverein',
    title: L('Heimliches Treffen des Arbeiter-Sportvereins', 'Heimliches Treffen des Arbeitersportvereins'),
    tag: 'Treffen',
    night: L('{team} {trifft|treffen} sich {ort} mit den alten Sportfreunden.', '{team} {trifft|treffen} sich {ort} mit den alten Sportkameraden.'),
    short: L('Nur in Neukölln: Mut für viele', 'Nur in Neukölln: Mut für viele'),
    dossier: L(
      'Die Sportvereine der Arbeiter sind verboten. Ihre Turnhallen wurden weggenommen. Doch die alten Mitglieder treffen sich weiter. Sie tun so, als wären sie eine Wandergruppe oder eine Kartenrunde. Wer dort spricht, erreicht Dutzende Menschen.',
      'Die Arbeitersportvereine sind verboten, ihre Turnhallen beschlagnahmt. Doch die alten Mitglieder treffen sich weiter, getarnt als Wandergruppe oder Kartenrunde. Wer dort spricht, erreicht Dutzende, die sich noch nicht aufgegeben haben.',
    ),
    primary: 'empathie',
    secondary: 'staerke',
    difficulty: 5,
    baseRisk: 12,
    heat: 5,
    cost: {},
    places: ['rathaus', 'richardplatz', 'hermannstrasse'],
    rewardLabel: L('Mut und 2 Unterstützer', 'Moral und 2 Unterstützer'),
    success: () => ({ moral: 6, supporters: 2 }),
    failure: { moral: -1 },
    texts: {
      success: [
        L(
          'Zwanzig Männer und Frauen saßen {ort} beim Kartenspiel. Als {team} {sprach|sprachen}, legten sie die Karten weg und hörten zu. Zum Abschied sangen sie leise ein altes Lied.',
          'Zwanzig Männer und Frauen saßen {ort} beim Kartenspiel. Als {team} {sprach|sprachen}, legten sie die Karten weg und hörten zu. Zum Abschied sangen sie leise ein altes Lied.',
        ),
      ],
      failure: [
        L('Nur drei Leute kamen {ort}. Die anderen trauen sich nicht mehr.', 'Nur drei Leute kamen {ort}. Die anderen trauen sich nicht mehr.'),
      ],
      detected: [
        L(
          'Ein Wirt hat die „Kartenrunde“ {ort} gemeldet. {team} {verließ|verließen} das Lokal durch die Küche.',
          'Die „Kartenrunde“ {ort} wurde von einem Wirt gemeldet. {team} {verließ|verließen} das Lokal durch die Küche.',
        ),
      ],
    },
  },
  /*
   * Aufträge ab 1936.
   */
  ausreise: {
    type: 'ausreise',
    title: L('Einer jüdischen Familie bei der Flucht ins Ausland helfen', 'Einer jüdischen Familie bei der Ausreise helfen'),
    tag: 'Ausreise',
    night: L('{team} {hilft|helfen} {ort} einer Familie mit den Papieren für die Ausreise.', '{team} {hilft|helfen} {ort} einer Familie, ihre Papiere für die Ausreise zu ordnen.'),
    short: L('Rettet Menschen, die fliehen müssen', 'Ab 1938: Menschen retten, die fliehen müssen'),
    dossier: L(
      'Viele jüdische Familien wollen Deutschland verlassen. Aber die Ämter verlangen viele Papiere und viel Geld. Ohne Hilfe schafft es kaum jemand. Wer hilft, rettet vielleicht Leben.',
      'Viele jüdische Familien wollen Deutschland verlassen, doch die Ämter verlangen Stapel von Papieren, die „Reichsfluchtsteuer“ und Bescheinigungen. Und kaum ein Land nimmt sie auf. Ohne Geld und Hilfe schafft es kaum jemand. Wer hilft, rettet vielleicht Leben.',
    ),
    primary: 'bildung',
    secondary: 'empathie',
    difficulty: 6,
    baseRisk: 14,
    heat: 6,
    cost: { kasse: 20 },
    places: ['scheunenviertel', 'hackescher', 'mariannenplatz', 'rathaus'],
    rewardLabel: L('Eine Familie mit 3 Menschen kommt der Rettung näher. Viel Mut.', 'Eine Familie mit 3 Menschen kommt ihrer Rettung näher. Viel Moral.'),
    solidarity: true,
    success: () => ({ moral: 10, supporters: 1, helped: 3 }),
    failure: { moral: -3 },
    texts: {
      success: [
        L(
          '{team} {saß|saßen} {ort} bis tief in die Nacht über Formularen. Drei Wochen später kam die Nachricht: Die Familie darf nach Amerika.',
          '{team} {saß|saßen} {ort} bis tief in die Nacht über Formularen. Drei Wochen später kam die Nachricht: Die Familie hat ein Visum für Amerika.',
        ),
      ],
      failure: [
        L(
          'Das Amt wollte noch ein weiteres Papier. {team} {konnte|konnten} {ort} nichts mehr tun. Die Familie wartet weiter.',
          'Das Amt verlangte eine weitere Bescheinigung. {team} {konnte|konnten} {ort} nichts mehr ausrichten. Die Familie wartet weiter.',
        ),
      ],
      detected: [
        L(
          'Ein Nachbar {ort} hat die Polizei gerufen. Er sagte: Bei den Juden gehen Fremde ein und aus.',
          'Ein Nachbar {ort} hat die Polizei gerufen, weil „Fremde bei den Juden“ ein und aus gehen.',
        ),
      ],
    },
  },
  pakete: {
    type: 'pakete',
    title: L('Pakete für Gefangene packen', 'Pakete für Häftlinge packen'),
    tag: 'Pakete',
    night: L('{team} {packt|packen} {ort} Pakete für Gefangene im Lager.', '{team} {packt|packen} {ort} Pakete für Gefangene in Sachsenhausen.'),
    short: L('Ab 1936: Hilfe für die Gefangenen im Lager', 'Ab 1936: Hilfe für die Gefangenen im Lager'),
    dossier: L(
      'Manchmal dürfen die Familien den Gefangenen im Lager Sachsenhausen Geld und Wäsche schicken. Aber viele Familien haben selbst nichts mehr. Die Gruppe sammelt warme Sachen und etwas Geld. Kein Gefangener soll vergessen werden.',
      'Die Familien der Häftlinge in Sachsenhausen dürfen manchmal Geld und Wäsche schicken. Aber viele haben selbst nichts mehr. Die Gruppe sammelt warme Sachen und etwas Geld, damit kein Gefangener vergessen wird.',
    ),
    primary: 'empathie',
    secondary: 'heimlichkeit',
    difficulty: 4,
    baseRisk: 12,
    heat: 5,
    cost: { kasse: 10 },
    places: ['koesliner', 'leopoldplatz', 'hermannstrasse', 'marheineke'],
    rewardLabel: L('2 Menschen geholfen, dazu Mut', '2 Menschen geholfen, dazu Moral und Vertrauen der Familien'),
    solidarity: true,
    success: () => ({ moral: 7, supporters: 1, helped: 2 }),
    failure: { moral: -1 },
    texts: {
      success: [
        L(
          '{team} {packte|packten} {ort} Wollsocken, Seife und ein paar Mark in braunes Papier. Die Mutter eines Gefangenen hat das Paket abgeschickt. „Er soll wissen, dass es noch Menschen gibt“, sagte sie.',
          '{team} {packte|packten} {ort} wollene Socken, Seife und ein paar Mark in braunes Papier. Die Mutter eines Häftlings hat das Paket abgeschickt. „Er soll wissen, dass es noch Menschen gibt“, sagte sie.',
        ),
      ],
      failure: [
        L('Die Sammlung {ort} brachte kaum etwas. Die Menschen haben selbst wenig.', 'Die Sammlung {ort} brachte kaum etwas ein. Die Menschen haben selbst wenig.'),
      ],
      detected: [
        L(
          'Ein Blockwart {ort} wollte wissen, für wen die Pakete sind. {team} {log|logen} ihn an.',
          'Ein Blockwart {ort} wollte wissen, für wen die Pakete sind. {team} {log|logen} ihm etwas vor.',
        ),
      ],
    },
  },
  reporter: {
    type: 'reporter',
    title: L('Reportern aus dem Ausland die Wahrheit sagen', 'Berichte an ausländische Reporter geben'),
    tag: 'Reporter',
    night: L('{team} {trifft|treffen} {ort} einen Reporter aus dem Ausland.', '{team} {trifft|treffen} {ort} einen Reporter aus dem Ausland.'),
    short: L('Nur während der Olympischen Spiele: der Welt die Wahrheit sagen', 'Nur während der Olympischen Spiele: der Welt die Wahrheit sagen'),
    dossier: L(
      'Während der Olympischen Spiele sind Hunderte Reporter aus dem Ausland in der Stadt. Sie sehen nur, was man ihnen zeigt. Wer ihnen Berichte über Lager und Verhaftungen gibt, erreicht die ganze Welt. Aber die Gestapo beobachtet die Gäste genau.',
      'Während der Olympischen Spiele sind Hunderte ausländische Journalisten in der Stadt. Sie sehen nur, was man ihnen zeigt. Wer ihnen Berichte über Lager und Verhaftungen zusteckt, erreicht die ganze Welt, aber die Gestapo beobachtet die Gäste genau.',
    ),
    primary: 'propaganda',
    secondary: 'heimlichkeit',
    difficulty: 6,
    baseRisk: 22,
    heat: 10,
    cost: { items: { flugblaetter: 1 } },
    places: ['alexanderplatz', 'opernplatz', 'kochstrasse'],
    rewardLabel: L('Die Welt erfährt die Wahrheit: viele Unterstützer und Mut', 'Die Welt erfährt die Wahrheit: viele Unterstützer und Moral'),
    success: () => ({ moral: 9, supporters: 4 }),
    failure: { moral: -2 },
    texts: {
      success: [
        L(
          '{team} {gab|gaben} einem Reporter aus Paris {ort} die Berichte. Zwei Wochen später bringt jemand eine Zeitung aus Frankreich mit. Auf der ersten Seite steht ein Bericht über die Lager.',
          '{team} {steckte|steckten} einem Reporter aus Paris {ort} die Berichte zu. Zwei Wochen später bringt jemand eine französische Zeitung mit: Die Lager stehen auf der ersten Seite.',
        ),
      ],
      failure: [
        L(
          'Der Reporter {ort} hatte Angst und wollte nichts nehmen. „Ich muss hier noch drei Wochen arbeiten“, sagte er.',
          'Der Reporter {ort} hatte Angst und wollte nichts annehmen. „Ich muss hier noch drei Wochen arbeiten“, sagte er.',
        ),
      ],
      detected: [
        L(
          'Ein Mann in normaler Kleidung folgte dem Reporter {ort}. {team} {verschwand|verschwanden} in der Menge.',
          'Ein Mann in Zivil folgte dem Reporter {ort}. {team} {tauchte|tauchten} in der Menge unter.',
        ),
      ],
    },
  },
}

export const DETECTED_EFFECTS: Effects = { moral: -6 }
export const DETECTION_HEAT = 20
