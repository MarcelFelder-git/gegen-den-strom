import { WEEKS_1936 } from './weeks1936'
import { L, type Txt } from '../text'
import type { AvatarConfig, Effects, Gender, IdeologyKey, ProfessionKey, StatKey } from '../types'

export type IllustrationKind =
  | 'tor'
  | 'armbinde'
  | 'reichstag'
  | 'urne'
  | 'gesetz'
  | 'laden'
  | 'schule'
  | 'amt'
  | 'fabrik'
  | 'buecher'
  | 'zaun'
  | 'stadion'
  | 'kirche'
  | 'grenze'
  | 'pass'
  | 'synagoge'
  | 'zug'

export interface NewsArticle {
  headline: Txt
  body: Txt
}

export interface ConditionalEffect {
  ideology?: IdeologyKey
  profession?: ProfessionKey
  effects: Effects
  text: Txt
}

export interface EventChoice {
  label: Txt
  /** Wem diese Wahl hilft, falls es nicht die sprechende Person ist */
  helps?: { name: string; gender: Gender; who: Txt }
  /** Probe auf einen Wert der Person, die die Gruppe führt */
  check?: { stat: StatKey; min: number }
  /** Wahl ist nur möglich, wenn so viel Geld in der Kasse liegt */
  needsKasse?: number
  effects: Effects
  result: Txt
  failEffects?: Effects
  failResult?: Txt
}

export interface StoryEvent {
  title: Txt
  scene: Txt
  speaker: string
  speakerRole: Txt
  portrait: AvatarConfig
  /** Platzhalter: {name} (wer die Gruppe führt), {g1}, {g2} (Gefährten) */
  text: Txt
  choices: EventChoice[]
}

/** Ein echter Zeitzeugenbericht, im Wortlaut und mit Quelle */
export interface Witness {
  who: Txt
  text: string
  source: string
  url?: string
}

export interface WeekData {
  /** Abreißkalender und Zwischentitel der Wochenschau */
  calendar: { day: number; month: string; weekday: string; year?: number }
  intertitle: Txt
  dateLabel: string
  paperDate: string
  headline: Txt
  subline: Txt
  lead: Txt
  articles: NewsArticle[]
  illustration: IllustrationKind
  caption: Txt
  /** Erfundene Tagebuchnotiz der Gruppe: was nicht in der Zeitung steht */
  note: Txt
  /** Erfundene Stimme aus der Nachbarschaft: wie Mitläufer redeten */
  voice: Txt
  /** Echte Zeitzeugenberichte, sofern es passende gibt */
  witnesses?: Witness[]
  /** Einleitung zu den Zeitzeugenberichten */
  witnessIntro?: Txt
  /** Sachliche Erklärung für Schülerinnen und Schüler */
  context: Txt
  /** Frage zum Nachdenken, am Ende der Woche */
  reflect: Txt
  lexicon: string[]
  effects: Effects
  moodText: Txt
  conditional?: ConditionalEffect[]
  event: StoryEvent
}

const BPB_314 = 'Informationen zur politischen Bildung Nr. 314, Bundeszentrale für politische Bildung'
const BPB_314_URL = 'https://www.bpb.de/shop/zeitschriften/izpb/nationalsozialismus-aufstieg-und-herrschaft-314/137194/machteroberung-1933/'

const WEEKS_1933: WeekData[] = [
  // Woche 1
  {
    calendar: { day: 30, month: 'Januar', weekday: 'Montag' },
    intertitle: L(
      'Berlin, 30. Januar 1933. Die ganze Nacht ziehen Männer mit Fackeln durch das Brandenburger Tor.',
      'Berlin, in der Nacht zum 31. Januar 1933. Stundenlang ziehen Fackeln durch das Brandenburger Tor.',
    ),
    dateLabel: 'Woche vom 30. Januar 1933',
    paperDate: 'Dienstag, den 31. Januar 1933',
    headline: L('Adolf Hitler ist Reichskanzler', 'Adolf Hitler zum Reichskanzler ernannt'),
    subline: L(
      'Reichspräsident von Hindenburg hat ihn ernannt. In der Nacht zogen Fackeln durch Berlin.',
      'Reichspräsident von Hindenburg beruft ein Kabinett der „nationalen Konzentration“. Fackelzug durch das Brandenburger Tor.',
    ),
    lead: L(
      'Am Montag hat Reichspräsident Paul von Hindenburg einen neuen Kanzler ernannt: Adolf Hitler, den Führer der NSDAP. In der neuen Regierung sitzen nur drei Nationalsozialisten. Die anderen Minister glauben, sie könnten Hitler lenken. Am Abend marschierten Tausende Männer der SA mit Fackeln durch das Brandenburger Tor.',
      'Am gestrigen Montag hat der Herr Reichspräsident den Führer der Nationalsozialisten, Adolf Hitler, zum Reichskanzler ernannt. Vizekanzler wird Franz von Papen. Dem neuen Kabinett gehören neben dem Kanzler nur zwei Nationalsozialisten an, Dr. Frick als Reichsminister des Innern und Hermann Göring. Kreise der Deutschnationalen erklären, man werde den neuen Kanzler schon „einrahmen“. Bis spät in die Nacht zogen Kolonnen der SA und des Stahlhelms mit Fackeln durch das Brandenburger Tor und die Wilhelmstraße entlang.',
    ),
    articles: [
      {
        headline: 'Jubel in der Wilhelmstraße',
        body: L(
          'Viele Menschen standen am Straßenrand und jubelten. Hitler winkte aus einem Fenster. Auch der alte Reichspräsident sah dem Zug zu.',
          'Tausende Schaulustige säumten die Straßen. Aus einem Fenster der Reichskanzlei grüßte der neue Kanzler die Marschierenden. Der greise Reichspräsident sah dem Zug von seinem Fenster aus zu.',
        ),
      },
      {
        headline: L('Stille in den Arbeitervierteln', 'Schweigen in den Arbeitervierteln'),
        body: L(
          'Im Wedding und in Neukölln feierte niemand. Die SPD ruft ihre Anhänger auf, wachsam zu bleiben. Sie will die Republik mit der Verfassung verteidigen. Die KPD ruft zum Generalstreik auf. Kaum jemand folgt dem Aufruf.',
          'In Wedding und Neukölln blieb es still. Die Sozialdemokratie ruft ihre Anhänger zur Wachsamkeit auf. Sie will die Republik auf dem Boden der Verfassung verteidigen und warnt vor unüberlegten Einzelaktionen. Die Kommunistische Partei ruft zum Generalstreik auf. Dem Aufruf folgt kaum jemand.',
        ),
      },
    ],
    illustration: 'tor',
    caption: L('Fackelzug am Brandenburger Tor', 'Fackelzug am Brandenburger Tor, in der Nacht zum 31. Januar'),
    note: L(
      'In unserer Straße hat niemand gefeiert. Frau Pagel sagt, das geht vorbei wie ein Gewitter. Ich glaube das nicht. Wir müssen etwas tun, solange es noch geht.',
      'In unserer Straße hat niemand gefeiert. Frau Pagel sagt, das geht vorüber wie ein Gewitter. Ich glaube es nicht. Wir müssen etwas tun, solange wir es noch können.',
    ),
    voice: L(
      '„Hauptsache, es gibt endlich wieder Arbeit. Was die mit den Kommunisten machen, geht uns nichts an.“',
      '„Hauptsache, es kommt wieder Ordnung ins Land und Arbeit für die Männer. Was die mit den Roten machen, geht uns doch nichts an.“',
    ),
    witnessIntro: L(
      'Zwei Menschen, derselbe Tag: Eine jubelt, einer erschrickt.',
      'Derselbe Abend in zwei Tagebüchern: Begeisterung bei den einen, Entsetzen bei den anderen.',
    ),
    witnesses: [
      {
        who: L('Luise Solmitz, Lehrerin in Hamburg, in ihrem Tagebuch', 'Luise Solmitz, deutschnationale Lehrerin in Hamburg, Tagebuch vom 30. Januar 1933'),
        text: '„Was für ein Kabinett!!! Wie wir es im Juli nicht zu erträumen wagten.“',
        source: BPB_314,
        url: BPB_314_URL,
      },
      {
        who: L('Klaus Mann, Schriftsteller, in seinem Tagebuch', 'Klaus Mann, Schriftsteller, Tagebuch vom 30. Januar 1933'),
        text: '„Die Nachricht, daß Hitler Reichskanzler. Schreck.“',
        source: BPB_314,
        url: BPB_314_URL,
      },
    ],
    context: L(
      'Am 30. Januar 1933 wurde Adolf Hitler Reichskanzler. Er hat die Macht nicht erobert. Der Reichspräsident und konservative Politiker haben sie ihm gegeben. Sie dachten, sie könnten ihn lenken. Das war ein schwerer Fehler. Die Nazis nannten den Tag später „Machtergreifung“.',
      'Am 30. Januar 1933 ernannte Reichspräsident Paul von Hindenburg Adolf Hitler zum Reichskanzler. Die Nationalsozialisten nannten das „Machtergreifung“. Tatsächlich wurde ihm die Macht von konservativen Politikern übertragen, die glaubten, sie könnten ihn für ihre Ziele benutzen. Das war ein folgenschwerer Irrtum.',
    ),
    reflect: L(
      'Viele sagten: „Das geht uns nichts an.“ Warum ist dieser Satz gefährlich?',
      '„Das geht uns nichts an“: Warum war diese Haltung für Menschen, denen es selbst gut ging, so bequem? Und warum ist sie gefährlich?',
    ),
    lexicon: ['reichskanzler', 'sa', 'machtuebernahme', 'faschismus'],
    effects: { moral: -2 },
    moodText: L('Die Nachricht macht allen Angst.', 'Die Nachricht drückt auf die Stimmung der Gruppe.'),
    event: {
      title: 'Die erste Zusammenkunft',
      scene: L('Deine Küche, spät am Abend. Die Vorhänge sind zu.', 'Deine Küche, spät am Abend. Die Vorhänge sind zugezogen.'),
      speaker: '{g1}',
      speakerRole: 'Gefährte der ersten Stunde',
      portrait: { gender: 'm', face: 'kantig', headwear: 'schiebermuetze', hairTone: 'dunkel', glasses: false, clothing: 'arbeiterjacke' },
      text: L(
        'Vier Menschen sitzen um den Küchentisch. {g1} legt die Zeitung hin. „Mein Schwager sagt: Uns geht es doch gut. Uns tut keiner was. Aber was ist mit den anderen, {name}? Mit den Nachbarn, die sie jetzt jagen? Was machen wir?“ Alle sehen dich an.',
        'Vier Menschen sitzen um den Küchentisch. Auf dem Herd summt der Wasserkessel. {g1} legt die Zeitung auf den Tisch und tippt auf das Bild. „Mein Schwager sagt, uns kann das egal sein. Wir sind keine Juden, wir haben Arbeit, uns tut keiner was. Aber die holen jetzt schon die ersten Nachbarn, {name}. Sollen wir zusehen, nur weil es uns gut geht?“ Alle sehen dich an.',
      ),
      choices: [
        {
          label: '„Wir handeln. Noch in dieser Woche.“',
          effects: { moral: 10, heatAll: 5 },
          result: L(
            'Die anderen nicken. Ihr verabredet euch für die nächsten Tage. Beim Gehen drückt dir {g1} fest die Hand. Aber im Treppenhaus steht eine Tür einen Spalt offen.',
            'Die Augen der anderen leuchten. Man verabredet sich für die nächsten Tage. Beim Gehen drückt dir {g1} fest die Hand. Aber im Treppenhaus hat jemand die Tür einen Spalt geöffnet.',
          ),
        },
        {
          label: L('„Wir warten erst ab. Vorsicht ist nicht feige.“', '„Wir warten ab und beobachten. Vorsicht ist keine Feigheit.“'),
          effects: { moral: 3, heatAll: -5 },
          result: L(
            'Alle nicken. Ganz zufrieden ist niemand. Aber die Gruppe verrät sich nicht zu früh.',
            'Man nickt. Niemand ist ganz zufrieden, aber alle sind erleichtert. Die Gruppe wird sich nicht zu früh verraten.',
          ),
        },
        {
          label: L('„Jeder gibt etwas Geld. Ohne Geld geht es nicht.“', '„Jeder gibt, was er entbehren kann. Ohne Geld geht es nicht.“'),
          effects: { kasse: 15, moral: 2 },
          result: L(
            'Am Ende liegen fünfzehn Reichsmark auf dem Tisch. Das ist wenig. Aber es ist ein Anfang.',
            'Auf dem Tisch liegen am Ende fünfzehn Reichsmark in Münzen und zerknitterten Scheinen. Es ist wenig, aber es ist ein Anfang.',
          ),
        },
      ],
    },
  },
  // Woche 2
  {
    calendar: { day: 22, month: 'Februar', weekday: 'Mittwoch' },
    intertitle: L(
      'Februar 1933. Wer eine weiße Armbinde trägt, ist jetzt Polizist. Auch die Schläger der SA.',
      'Februar 1933. Wer eine weiße Armbinde trägt, ist jetzt Polizei.',
    ),
    dateLabel: 'Woche vom 20. Februar 1933',
    paperDate: 'Donnerstag, den 23. Februar 1933',
    headline: 'SA und SS werden Hilfspolizei',
    subline: L(
      'Minister Göring macht Zehntausende Männer der Partei zu Polizisten. Sie tragen eine weiße Armbinde.',
      'Minister Göring verstärkt die preußische Polizei um Zehntausende Männer. Kennzeichen ist eine weiße Armbinde mit der Aufschrift „Hilfspolizei“.',
    ),
    lead: L(
      'Hermann Göring ist Innenminister in Preußen. Dazu gehört auch Berlin. Er hat bestimmt: Männer der SA, der SS und des Stahlhelms werden Hilfspolizisten. Sie sollen gegen die „Feinde des Staates“ kämpfen. Schon in der letzten Woche hat Göring der Polizei erlaubt, auf Gegner zu schießen.',
      'Der kommissarische preußische Innenminister Göring hat verfügt, dass Männer der SA, der SS und des Stahlhelms als Hilfspolizisten eingesetzt werden. Sie sollen die reguläre Polizei im „Kampf gegen die staatsfeindlichen Elemente“ unterstützen. Bereits in der vergangenen Woche hatte der Minister die Polizei angewiesen, gegen Feinde des Staates notfalls rücksichtslos von der Schusswaffe Gebrauch zu machen.',
    ),
    articles: [
      {
        headline: 'Weitere Blätter verboten',
        body: L(
          'Mehrere Zeitungen der Linken dürfen für einige Tage nicht erscheinen. Versammlungen im Freien müssen zwei Tage vorher bei der Polizei angemeldet werden. Die Polizei kann sie jederzeit verbieten.',
          'Aufgrund der Verordnung zum Schutze des deutschen Volkes vom 4. Februar sind erneut mehrere Zeitungen der Linken für einige Tage verboten worden. Versammlungen unter freiem Himmel müssen 48 Stunden vorher angemeldet werden und können jederzeit verboten werden.',
        ),
      },
      {
        headline: 'Der Wahlkampf beginnt',
        body: L(
          'Am 5. März wird der Reichstag neu gewählt. Versammlungen der SPD und der KPD werden oft gestört oder aufgelöst.',
          'Zum 5. März sind Neuwahlen zum Reichstag angesetzt. Versammlungen der Sozialdemokraten und Kommunisten werden vielerorts gestört oder aufgelöst.',
        ),
      },
    ],
    illustration: 'armbinde',
    caption: 'Hilfspolizist mit weißer Armbinde',
    note: L(
      'Jetzt sind sie Polizei. Letzten Sommer haben diese Männer in der Kneipe am Leopoldplatz mit Stühlen geworfen. Jetzt tragen sie eine Armbinde. Und sie dürfen Leute verhaften.',
      'Jetzt sind sie Polizei. Dieselben Männer, die letzten Sommer in der Kneipe am Leopoldplatz Stühle geworfen haben, tragen nun eine Armbinde und dürfen Leute verhaften.',
    ),
    voice: L(
      '„Endlich greift mal einer durch. Wer nichts getan hat, muss auch keine Angst haben.“',
      '„Endlich greift einer durch gegen die Roten. Wer nichts ausgefressen hat, braucht sich doch nicht zu fürchten.“',
    ),
    context: L(
      'Im Februar 1933 machte Hermann Göring die Schläger der SA zu Hilfspolizisten. Jetzt durften sie ganz offiziell Gegner verhaften. Wer sich wehrte, bekam keine Hilfe mehr von der Polizei. Denn die Polizei machte jetzt selbst mit.',
      'Im Februar 1933 machte Hermann Göring in Preußen, zu dem auch Berlin gehörte, die Schlägertruppen der NSDAP zu Hilfspolizisten. Damit konnten SA-Männer nun ganz offiziell politische Gegner festnehmen. Wer sich gegen sie wehrte, hatte keinen Schutz mehr durch den Staat.',
    ),
    reflect: L(
      'Ein Nachbar sagt: „Wer nichts getan hat, muss keine Angst haben.“ Stimmt das, wenn Schläger zur Polizei werden?',
      'Der Satz „Wer nichts getan hat, muss keine Angst haben“ klingt beruhigend. Was übersieht er, wenn der Staat selbst bestimmt, wer als Feind gilt?',
    ),
    lexicon: ['sa', 'ss', 'notverordnung', 'mitlaeufer'],
    effects: { moral: -3 },
    moodText: L('Die Straßen werden gefährlicher.', 'Die Straßen werden unsicherer.'),
    event: {
      title: 'Die Hauswartsfrau',
      scene: L('Das Treppenhaus in deinem Haus, am Vormittag.', 'Das Treppenhaus deines Mietshauses, am Vormittag.'),
      speaker: 'Frau Pagel',
      speakerRole: 'Hauswartsfrau im Vorderhaus',
      portrait: { gender: 'w', face: 'rund', headwear: 'welle', hairTone: 'grau', glasses: true, clothing: 'kleid' },
      text: L(
        'Frau Pagel fegt die Treppe. Sie hält inne und flüstert. „Gestern waren zwei Männer mit Armbinden hier. Sie wollten wissen, wer bei Ihnen ein und aus geht, {name}. Ich habe nichts gesagt. Noch nicht. Ich will keinen Ärger im Haus.“',
        'Frau Pagel fegt die Treppe, als du nach Hause kommst. Sie hält inne und senkt die Stimme. „Gestern waren zwei Männer mit Armbinden hier. Sie haben gefragt, wer in Ihrer Wohnung ein und aus geht, {name}. Ich habe nichts gesagt. Noch nicht. Ich will keinen Ärger im Haus, verstehen Sie?“ Sie sieht dich lange an.',
      ),
      choices: [
        {
          label: L('Ihr fünf Reichsmark geben, damit sie schweigt', 'Ihr fünf Reichsmark zustecken, damit sie schweigt'),
          needsKasse: 5,
          effects: { kasse: -5, heatLeader: -10 },
          result: L(
            'Frau Pagel steckt das Geld ein. „Ich habe hier niemanden gesehen“, sagt sie und fegt weiter.',
            'Frau Pagel steckt das Geld wortlos in die Schürzentasche. „Ich habe hier niemanden gesehen“, sagt sie und fegt weiter.',
          ),
        },
        {
          label: 'Sie ehrlich bitten, zu schweigen',
          check: { stat: 'empathie', min: 4 },
          effects: { moral: 4, heatLeader: -5 },
          result: L(
            'Du redest lange mit ihr. Am Ende nimmt sie deine Hand. „Mein Mann war auch in der Gewerkschaft. Von mir erfährt keiner etwas.“',
            'Du sprichst lange mit ihr. Am Ende nimmt sie deine Hand. „Mein Mann war auch bei den Gewerkschaften. Von mir erfährt niemand etwas.“',
          ),
          failEffects: { heatLeader: 10 },
          failResult: L(
            'Sie hört zu, aber ihr Blick bleibt kalt. „Ich will keinen Ärger“, sagt sie nur. Du weißt nicht, ob sie schweigen wird.',
            'Sie hört dir zu, aber ihr Blick bleibt kalt. „Ich will keinen Ärger im Haus“, sagt sie nur. Du weißt nicht, ob sie schweigen wird.',
          ),
        },
        {
          label: L('Die Papiere nachts zu {g2} bringen', 'Die Papiere noch in der Nacht zu {g2} bringen'),
          effects: { heatLeader: -8, moral: -2 },
          result: L(
            'Um zwei Uhr nachts trägst du einen Karton durch die leeren Straßen. {g2} öffnet leise die Tür. Deine Wohnung ist jetzt sauber. Aber die Angst bleibt.',
            'Um zwei Uhr nachts trägst du einen Karton durch die leeren Straßen. {g2} öffnet schweigend die Tür. Deine Wohnung ist nun sauber, doch die Angst schläft mit dir.',
          ),
        },
      ],
    },
  },
  // Woche 3
  {
    calendar: { day: 27, month: 'Februar', weekday: 'Montag' },
    intertitle: L(
      '27. Februar 1933, abends kurz nach neun. Der Reichstag brennt.',
      '27. Februar 1933, kurz nach neun Uhr abends. Der Reichstag brennt.',
    ),
    dateLabel: 'Woche vom 27. Februar 1933',
    paperDate: 'Dienstag, den 28. Februar 1933',
    headline: L('Der Reichstag brennt!', 'Der Reichstag in Flammen!'),
    subline: L(
      'Die Regierung gibt den Kommunisten die Schuld. Ein junger Holländer wurde festgenommen.',
      'Die Regierung spricht von einem kommunistischen Aufstandsversuch. Ein junger Holländer am Brandort festgenommen.',
    ),
    lead: L(
      'In der Nacht hat das Reichstagsgebäude gebrannt. Der große Sitzungssaal ist völlig zerstört. Im Gebäude wurde ein junger Holländer festgenommen, Marinus van der Lubbe. Hermann Göring sagt: Das Feuer war das Zeichen für einen Aufstand der Kommunisten. Noch in der Nacht wurden viele Kommunisten verhaftet. Auch der Journalist Carl von Ossietzky und der Anwalt Hans Litten sind unter den Gefangenen.',
      'In der Nacht zum Dienstag ist das Reichstagsgebäude in Brand geraten. Der Plenarsaal ist völlig ausgebrannt, die gläserne Kuppel stand in hellen Flammen. Im Gebäude wurde der Holländer Marinus van der Lubbe festgenommen. Minister Göring erklärte noch in der Nacht, der Brand sei das Signal für einen kommunistischen Aufstand gewesen. In ganz Preußen sind seither zahlreiche kommunistische Funktionäre und Abgeordnete verhaftet worden. Unter den Festgenommenen sind auch der Herausgeber der „Weltbühne“, Carl von Ossietzky, und der Rechtsanwalt Hans Litten.',
    ),
    articles: [
      {
        headline: L('Die Grundrechte gelten nicht mehr', 'Verordnung zum Schutz von Volk und Staat'),
        body: L(
          'Der Reichspräsident hat eine Notverordnung unterschrieben. Ab sofort gelten wichtige Rechte nicht mehr: die Freiheit der Person, die Meinungsfreiheit, die Pressefreiheit, das Recht, sich zu versammeln, und das Briefgeheimnis.',
          'Der Herr Reichspräsident hat heute eine Notverordnung unterzeichnet. Die Freiheit der Person, die Freiheit der Meinung und der Presse, das Versammlungsrecht und das Briefgeheimnis sind bis auf weiteres außer Kraft gesetzt.',
        ),
      },
      {
        headline: 'Kommunistische Presse verboten',
        body: L(
          'Alle Zeitungen der KPD sind verboten. Auch die Zeitungen der SPD in Preußen dürfen zwei Wochen lang nicht erscheinen.',
          'Sämtliche Zeitungen der KPD sind verboten. Auch die sozialdemokratische Presse in Preußen darf für zwei Wochen nicht erscheinen.',
        ),
      },
    ],
    illustration: 'reichstag',
    caption: 'Die brennende Kuppel des Reichstags',
    note: L(
      'Wer das Feuer gelegt hat, weiß keiner genau. Aber schon am Morgen hatten sie Listen mit Namen und Adressen. Im Wedding holen sie die Leute aus den Betten.',
      'Wer das Feuer gelegt hat, weiß niemand genau. Aber schon am Morgen hatten sie Listen mit Namen und Adressen. Im Wedding holen sie die Leute aus den Betten.',
    ),
    voice: L(
      '„Das waren die Kommunisten. Gut, dass jetzt aufgeräumt wird.“',
      '„Das waren die Kommunisten, steht doch in der Zeitung. Gut, dass jetzt endlich aufgeräumt wird.“',
    ),
    context: L(
      'Am 27. Februar 1933 brannte der Reichstag. Die Regierung gab sofort den Kommunisten die Schuld. Wer das Feuer wirklich gelegt hat, ist bis heute umstritten. Schon am nächsten Tag wurden die wichtigsten Grundrechte abgeschafft. Jetzt konnte die Polizei jeden ohne Gericht einsperren. Tausende wurden verhaftet.',
      'Am 27. Februar 1933 brannte das Reichstagsgebäude. Die Regierung machte sofort die Kommunisten verantwortlich. Ob van der Lubbe allein handelte, ist unter Historikern bis heute umstritten. Schon am nächsten Tag setzte die „Reichstagsbrandverordnung“ die wichtigsten Grundrechte außer Kraft. Nun konnte die Polizei Menschen ohne Gericht unbegrenzt einsperren. Tausende wurden verhaftet.',
    ),
    reflect: L(
      'Willi steht mitten in der Nacht vor deiner Tür. Was hättest du getan? Warum?',
      'Wer Verfolgten half, brachte sich selbst in Gefahr. Wie wägt man die eigene Sicherheit gegen die Not eines anderen Menschen ab?',
    ),
    lexicon: ['reichstag', 'notverordnung', 'schutzhaft', 'kpd'],
    effects: { moral: -6, flags: ['unterschlupf'] },
    moodText: L(
      'Die Grundrechte sind weg. Ab jetzt suchen Verfolgte ein Versteck.',
      'Die Grundrechte sind aufgehoben. Ab jetzt suchen Verfolgte ein Versteck.',
    ),
    conditional: [
      {
        ideology: 'kommunistisch',
        effects: { heatLeader: 15 },
        text: L(
          'Dein Name steht auf den Listen der Polizei. Du schläfst nicht mehr zu Hause.',
          'Dein Name steht auf den Listen der Polizei. Du schläfst nicht mehr zu Hause.',
        ),
      },
      {
        ideology: 'sozialdemokratisch',
        effects: { heatLeader: 5 },
        text: L('Jetzt fragt die Polizei auch nach Sozialdemokraten.', 'Auch nach Sozialdemokraten wird nun gefragt.'),
      },
    ],
    event: {
      title: 'Es klopft in der Nacht',
      scene: L('Deine Wohnung, um drei Uhr morgens. Draußen fährt ein Lastwagen vorbei.', 'Deine Wohnung, gegen drei Uhr morgens. Draußen fährt ein Lastwagen vorbei.'),
      speaker: 'Willi Harms',
      speakerRole: L('Nachbar aus dem Hinterhaus, Kommunist', 'Nachbar aus dem Hinterhaus, Mitglied der KPD'),
      portrait: { gender: 'm', face: 'schmal', headwear: 'kurz', hairTone: 'dunkel', glasses: false, clothing: 'arbeiterjacke' },
      text: L(
        'Jemand klopft leise, dreimal. Vor der Tür steht Willi Harms aus dem Hinterhaus. Er hat keinen Mantel an und friert. „Sie haben meinen Bruder geholt, vor einer Stunde. Ich bin über die Dächer geflohen. {name}, ich weiß nicht, wohin. Nur eine Nacht, bitte.“ Unten auf der Straße hört man Stiefel.',
        'Jemand klopft leise, dreimal. Vor der Tür steht Willi Harms aus dem Hinterhaus, ohne Mantel, das Gesicht grau vor Kälte. „Sie haben meinen Bruder geholt, vor einer Stunde. Ich bin über die Dächer weg. {name}, ich weiß nicht, wohin. Nur eine Nacht, bitte.“ Unten auf der Straße hört man Stiefel.',
      ),
      choices: [
        {
          label: 'Ihn hereinlassen und verstecken',
          effects: { moral: 8, heatLeader: 15, helped: 1 },
          result: L(
            'Du ziehst ihn herein und schiebst den Riegel vor. Willi schläft in der Kammer hinter dem Schrank. Am Morgen ist er fort. Auf dem Kissen liegt ein Zettel: „Danke. Ich vergesse das nie.“',
            'Du ziehst ihn in die Wohnung und schiebst den Riegel vor. Willi schläft in der Kammer hinter dem Kleiderschrank. Im Morgengrauen ist er fort. Auf dem Kissen liegt ein Zettel: „Danke. Ich vergesse das nie.“',
          ),
        },
        {
          label: 'Ihm Geld und einen Mantel geben',
          needsKasse: 10,
          effects: { kasse: -10, moral: 4, helped: 1 },
          result: L(
            'Du gibst ihm deinen alten Mantel und zehn Reichsmark. Er nickt und verschwindet im Treppenhaus. Du hoffst, dass er es schafft.',
            'Du drückst ihm deinen alten Mantel und zehn Reichsmark in die Hand. Er nickt stumm und verschwindet im Treppenhaus. Du hoffst, dass er es schafft.',
          ),
        },
        {
          label: 'Die Tür zu lassen',
          effects: { moral: -8, heatLeader: -5 },
          result: L(
            'Du stehst still hinter der Tür, bis seine Schritte leise werden. Du sagst dir: Ich musste die Gruppe schützen. Schlafen kannst du trotzdem nicht mehr.',
            'Du stehst reglos hinter der Tür, bis seine Schritte verklingen. Du sagst dir, dass du die Gruppe schützen musstest. Geschlafen hast du in dieser Nacht nicht mehr.',
          ),
        },
      ],
    },
  },
  // Woche 4
  {
    calendar: { day: 5, month: 'März', weekday: 'Sonntag' },
    intertitle: L(
      '5. März 1933. Zum letzten Mal stehen bei einer Reichstagswahl mehrere Parteien zur Wahl.',
      '5. März 1933. Zum letzten Mal treten bei einer Reichstagswahl mehrere Parteien an.',
    ),
    dateLabel: 'Woche vom 6. März 1933',
    paperDate: 'Montag, den 6. März 1933',
    headline: L('Wahl: 43,9 Prozent für die NSDAP', 'Reichstagswahl: 43,9 vom Hundert für die NSDAP'),
    subline: L(
      'Zusammen mit ihren Verbündeten hat die Regierung jetzt die Mehrheit im Reichstag.',
      'Zusammen mit der Kampffront Schwarz-Weiß-Rot verfügt die Regierung über die Mehrheit im Reichstag.',
    ),
    lead: L(
      'Am Sonntag wurde der Reichstag gewählt. Die NSDAP bekam 43,9 Prozent der Stimmen. Das ist weniger als die Hälfte. Die SPD bekam 18,3 Prozent, die KPD 12,3 Prozent und das Zentrum 11,2 Prozent. Sehr viele Menschen sind wählen gegangen. Die Regierung spricht von einem großen Sieg.',
      'Bei der gestrigen Reichstagswahl haben die Nationalsozialisten 43,9 vom Hundert der Stimmen erhalten. Die absolute Mehrheit haben sie damit verfehlt. Die Sozialdemokraten erreichten 18,3, die Kommunisten 12,3 und das Zentrum 11,2 vom Hundert. Die Wahlbeteiligung war außerordentlich hoch. Die Regierung spricht von einem Sieg der nationalen Erhebung.',
    ),
    articles: [
      {
        headline: 'Wo sind die Abgeordneten der KPD?',
        body: L(
          'Die KPD hat 81 Sitze gewonnen. Aber viele ihrer Abgeordneten sind im Gefängnis oder auf der Flucht. Sie werden ihre Plätze im Reichstag nicht einnehmen können.',
          'Die Kommunisten haben 81 Sitze errungen. Viele ihrer Abgeordneten sind jedoch in Haft oder geflohen. Ob sie ihre Mandate ausüben können, gilt als ausgeschlossen.',
        ),
      },
      {
        headline: 'Hakenkreuzfahnen auf den Rathäusern',
        body: L(
          'In vielen Städten hängten SA-Männer am Wahlabend die Fahnen der Partei an die Rathäuser. Die Polizei hat nichts dagegen getan.',
          'In zahlreichen Städten hissten SA-Männer am Wahlabend die Fahnen der Partei auf Rathäusern und Amtsgebäuden. Die Polizei schritt nicht ein.',
        ),
      },
    ],
    illustration: 'urne',
    caption: 'Stimmabgabe in einem Berliner Wahllokal',
    note: L(
      'Mehr als die Hälfte hat sie nicht gewählt. Trotz der Verbote, der Prügel und der Verhaftungen. Das darf man nicht vergessen.',
      'Mehr als die Hälfte hat sie nicht gewählt, trotz allem. Trotz der Verbote, der Prügel, der Verhaftungen. Das darf man nicht vergessen.',
    ),
    voice: L(
      '„Ich hab sie gewählt. Die anderen haben es ja auch nicht besser gemacht.“',
      '„Ich habe sie gewählt. Die anderen hatten vierzehn Jahre Zeit, und was ist dabei herausgekommen?“',
    ),
    context: L(
      'Die Wahl am 5. März 1933 war nicht mehr frei. Zeitungen der Gegner waren verboten. Viele Kommunisten saßen im Gefängnis. Trotzdem bekam die NSDAP allein keine Mehrheit. Mehr als die Hälfte der Menschen wählte andere Parteien.',
      'Die Wahl am 5. März 1933 war nicht mehr frei. Zeitungen der Gegner waren verboten, viele Kommunisten saßen in Haft, SA-Männer standen vor den Wahllokalen. Trotzdem erhielt die NSDAP keine eigene Mehrheit. Mehr als die Hälfte der Wählerinnen und Wähler stimmte für andere Parteien.',
    ),
    reflect: L(
      'Rudi ist in die SA gegangen, weil er Arbeit und Essen wollte. Ist das eine Entschuldigung?',
      'Rudi tritt der SA aus Not und Enttäuschung bei. Wo endet das Verständnis für seine Gründe, und wo beginnt seine Verantwortung?',
    ),
    lexicon: ['reichstag', 'kpd', 'spd', 'demokratie'],
    effects: { moral: -3 },
    moodText: L('Die Wahl ist verloren. Aber nicht alle geben auf.', 'Die Wahl ist verloren, aber nicht alle haben aufgegeben.'),
    event: {
      title: 'Ein alter Kollege',
      scene: L('Vor dem Fabriktor, beim Schichtwechsel.', 'Vor dem Fabriktor, beim Schichtwechsel.'),
      speaker: 'Rudi Lehmann',
      speakerRole: L('Früher dein Kollege, jetzt in der SA', 'Früher Kollege, seit kurzem in der SA'),
      portrait: { gender: 'm', face: 'oval', headwear: 'kurz', hairTone: 'hell', glasses: false, clothing: 'weste' },
      text: L(
        'Rudi Lehmann steht vor dir, in brauner Uniform. Ihr habt jahrelang zusammen gearbeitet. Er grinst verlegen. „Guck nicht so, {name}. Ich war zwei Jahre ohne Arbeit. Bei der SA gibt es Suppe, Stiefel und Freunde. Mir geht es endlich wieder gut. Was die mit den anderen machen, ist nicht meine Sache.“',
        'Rudi Lehmann steht vor dir, in brauner Uniform. Ihr habt jahrelang zusammen gearbeitet. Er grinst verlegen. „Guck nicht so, {name}. Ich war zwei Jahre ohne Arbeit. Bei der SA gibt es Suppe, Stiefel und Kameraden. Mir geht es zum ersten Mal seit Jahren gut. Was mit den anderen passiert, ist nicht meine Sache. Was hat mir denn deine Partei gegeben?“',
      ),
      choices: [
        {
          label: L('Mit ihm reden, ganz ehrlich', 'Mit ihm reden, von Mensch zu Mensch'),
          check: { stat: 'empathie', min: 4 },
          effects: { supporters: 2, moral: 5 },
          result: L(
            'Ihr redet lange. Rudi wird still. „Ich habe gesehen, was sie mit dem alten Grünberg gemacht haben“, sagt er. „Das war nicht recht.“ Zwei Wochen später schickt er seinen Schwager zu euch.',
            'Ihr redet lange. Rudi wird still. „Ich habe gesehen, was sie mit dem alten Grünberg gemacht haben“, sagt er schließlich. „Das war nicht recht.“ Zwei Wochen später schickt er seinen Schwager zu euch.',
          ),
          failEffects: { heatLeader: 12 },
          failResult: L(
            'Rudi wird wütend. „Pass bloß auf, was du sagst! Ich weiß, wo du wohnst.“ Er geht. Du hast ihm zu viel verraten.',
            'Rudi wird wütend. „Pass bloß auf, was du sagst! Ich weiß, wo du wohnst.“ Er dreht sich um und geht. Du hast ihm zu viel verraten.',
          ),
        },
        {
          label: L('Ihm mit Tatsachen die Wahrheit zeigen', 'Ihm mit Argumenten die Wahrheit zeigen'),
          check: { stat: 'propaganda', min: 4 },
          effects: { supporters: 2, moral: 4 },
          result: L(
            'Du zählst ihm auf, was die Nazis versprochen haben und was sie wirklich tun. Rudi hat keine Antwort. Heimlich nimmt er ein Flugblatt mit.',
            'Du zählst ihm auf, was die Nationalsozialisten versprochen und was sie getan haben. Rudi hat keine Antwort. Er nimmt heimlich ein Flugblatt mit.',
          ),
          failEffects: { heatLeader: 10, moral: -2 },
          failResult: L(
            'Rudi lacht dich aus. „Ihr mit euren Reden. Die Zeit der Reden ist vorbei.“ Du hast zu viel gesagt.',
            'Rudi lacht dich aus. „Ihr mit euren Reden. Die Zeit der Reden ist vorbei.“ Du hast dich zu weit vorgewagt.',
          ),
        },
        {
          label: 'Wortlos weitergehen',
          effects: { moral: -2 },
          result: L(
            'Du gehst an ihm vorbei. Er ruft dir etwas nach, aber du drehst dich nicht um. Wie viele Rudis gibt es in dieser Stadt?',
            'Du gehst an ihm vorbei. Er ruft dir etwas hinterher, aber du drehst dich nicht um. Wie viele Rudis gibt es in dieser Stadt?',
          ),
        },
      ],
    },
  },
  // Woche 5
  {
    calendar: { day: 23, month: 'März', weekday: 'Donnerstag' },
    intertitle: L(
      '23. März 1933. Mit einem einzigen Gesetz gibt das Parlament seine Macht ab.',
      '23. März 1933. Mit einem einzigen Gesetz entmachtet sich das Parlament selbst.',
    ),
    dateLabel: 'Woche vom 20. März 1933',
    paperDate: 'Freitag, den 24. März 1933',
    headline: L('Reichstag beschließt Ermächtigungsgesetz', 'Reichstag nimmt Ermächtigungsgesetz an'),
    subline: L(
      '444 Abgeordnete stimmen dafür, 94 dagegen. Die Regierung darf jetzt allein Gesetze machen.',
      'Mit 444 gegen 94 Stimmen. Die Regierung darf nun Gesetze ohne das Parlament erlassen.',
    ),
    lead: L(
      'Der Reichstag hat am Donnerstag ein neues Gesetz beschlossen. Vier Jahre lang darf die Regierung jetzt allein Gesetze machen. Das Parlament braucht sie dafür nicht mehr. Nur die SPD hat dagegen gestimmt. Die Abgeordneten der KPD waren nicht da. Sie waren verhaftet oder auf der Flucht. Im Saal standen SA und SS. Otto Wels von der SPD sagte: „Freiheit und Leben kann man uns nehmen, die Ehre nicht.“',
      'In der Krolloper, dem Ausweichquartier des Reichstags, haben die Abgeordneten gestern dem „Gesetz zur Behebung der Not von Volk und Reich“ zugestimmt. Die Reichsregierung kann damit vier Jahre lang Gesetze beschließen, auch wenn sie von der Verfassung abweichen. Allein die Sozialdemokraten stimmten dagegen. Die Kommunisten waren nicht anwesend. Vor und in dem Saal standen SA und SS in dichten Reihen. Der Abgeordnete Otto Wels erklärte für die SPD: „Freiheit und Leben kann man uns nehmen, die Ehre nicht.“',
    ),
    articles: [
      {
        headline: 'Konzentrationslager bei Dachau',
        body: L(
          'Bei Dachau in der Nähe von München gibt es jetzt ein Lager für politische Gefangene. Am 22. März kamen die ersten Häftlinge an.',
          'Der kommissarische Polizeipräsident von München, Himmler, gibt bekannt, dass bei Dachau ein Lager für politische Schutzhäftlinge errichtet worden ist. Am 22. März trafen die ersten Gefangenen ein.',
        ),
      },
      {
        headline: 'Lager auch in Oranienburg',
        body: L(
          'Nördlich von Berlin hat die SA in einer alten Brauerei ein Lager eingerichtet. Dorthin bringt sie Verhaftete aus Berlin.',
          'Nördlich von Berlin hat die SA in einer stillgelegten Brauerei in Oranienburg ein Lager eingerichtet. Dorthin werden Verhaftete aus der Reichshauptstadt gebracht.',
        ),
      },
      {
        headline: 'Feierlichkeiten in Potsdam',
        body: L(
          'Am Dienstag wurde der neue Reichstag in einer Kirche in Potsdam feierlich eröffnet. Hitler verbeugte sich vor dem Reichspräsidenten.',
          'Am Dienstag wurde der neue Reichstag in der Garnisonkirche zu Potsdam feierlich eröffnet. Der Reichskanzler verneigte sich vor dem Reichspräsidenten.',
        ),
      },
    ],
    illustration: 'gesetz',
    caption: 'Die Abstimmung in der Krolloper',
    note: L(
      'Es steht in der Zeitung, jeder kann es lesen. Sie nennen es „Schutzhaft“. Angeblich schützt sie die Verhafteten vor dem Zorn des Volkes. In Wahrheit sperren die Nazis ihre Gegner ein. Ohne Gericht, ohne Anwalt, ohne Ende.',
      'Es steht in der Zeitung, jeder kann es lesen. Sie nennen es „Schutzhaft“ und behaupten, sie schütze die Verhafteten vor dem Zorn des Volkes. In Wahrheit schützt sie niemanden außer dem Regime selbst. Die Gegner verschwinden, ohne Gericht, ohne Anwalt, und niemand weiß, wie lange.',
    ),
    voice: L(
      '„Ins Lager kommen doch nur die Roten. Mit uns hat das nichts zu tun.“',
      '„In die Lager kommen doch nur Kommunisten und Unruhestifter. Unsereins hat damit nichts zu tun.“',
    ),
    context: L(
      'Mit dem Ermächtigungsgesetz vom 23. März 1933 gab der Reichstag seine Macht ab. Jetzt konnte Hitler allein Gesetze machen. Nur die SPD stimmte mit Nein. Zur selben Zeit entstanden die ersten Konzentrationslager, zum Beispiel in Dachau und in Oranienburg. Dort wurden Gegner ohne Gerichtsurteil eingesperrt und gequält.',
      'Mit dem Ermächtigungsgesetz vom 23. März 1933 gab der Reichstag seine Macht ab. Die Regierung Hitler konnte nun Gesetze ohne das Parlament erlassen. Nur die SPD stimmte mit Nein, die Abgeordneten der KPD waren verhaftet oder geflohen. Zur selben Zeit entstanden die ersten Konzentrationslager, etwa in Dachau und Oranienburg. Dort wurden politische Gegner ohne Gerichtsurteil festgehalten, misshandelt und manche ermordet.',
    ),
    reflect: L(
      'Frau Brandt weiß nicht, an wen sie sich wenden soll. Wer konnte ihr damals helfen, wenn die Polizei nicht half?',
      'Die Polizei war 1933 kein Schutz mehr, sondern Teil der Verfolgung. Wo fanden Angehörige von Verhafteten stattdessen Hilfe, und was riskierten die Helfer?',
    ),
    lexicon: ['ermaechtigungsgesetz', 'kz', 'schutzhaft', 'spd', 'diktatur'],
    effects: { moral: -6 },
    moodText: L('Das Parlament hat keine Macht mehr.', 'Das Parlament hat sich selbst entmachtet.'),
    conditional: [
      {
        ideology: 'sozialdemokratisch',
        effects: { moral: 5 },
        text: L(
          'Die Rede von Otto Wels wird heimlich weitergegeben. Sie gibt dir neue Kraft.',
          'Die Rede von Otto Wels geht von Hand zu Hand. Sie gibt dir neue Kraft.',
        ),
      },
    ],
    event: {
      title: 'Eine Mutter bittet um Hilfe',
      scene: L('Die Wohnung der Familie Brandt in Neukölln. Auf dem Tisch steht kalter Kaffee.', 'Die Wohnung der Familie Brandt in Neukölln. Auf dem Tisch steht kalter Kaffee.'),
      speaker: 'Frau Brandt',
      speakerRole: 'Mutter eines Verhafteten',
      portrait: { gender: 'w', face: 'schmal', headwear: 'glocke', hairTone: 'dunkel', glasses: false, clothing: 'trenchcoat' },
      text: L(
        'Frau Brandt hält einen Brief in den zitternden Händen. „Mein Junge ist neunzehn. Sie haben ihn aus der Werkstatt geholt. Jetzt heißt es, er ist in Oranienburg. Ich darf ihm nicht einmal schreiben. Und ohne seinen Lohn kann ich die Miete nicht zahlen. {name}, an wen soll ich mich denn wenden? An die Polizei? Die hat ihn doch geholt.“',
        'Frau Brandt hält ein Blatt Papier in den zitternden Händen. „Mein Junge ist neunzehn. Sie haben ihn aus der Werkstatt geholt, und jetzt heißt es, er ist in Oranienburg. Ich darf ihm nicht einmal schreiben. Ohne seinen Lohn reicht es nicht für die Miete. {name}, an wen soll ich mich denn wenden? An die Polizei? Die haben ihn doch abgeholt.“',
      ),
      choices: [
        {
          label: L('Sie mit der Roten Hilfe zusammenbringen', 'Sie heimlich mit der verbotenen Roten Hilfe zusammenbringen'),
          check: { stat: 'heimlichkeit', min: 3 },
          effects: { moral: 6, supporters: 1, helped: 1, trust: { neukoelln: 1 } },
          result: L(
            'Du kennst eine Frau aus der verbotenen Roten Hilfe. Sie besucht Frau Brandt noch in dieser Woche. Sie bringt Geld für die Miete und sagt: „Viele Familien helfen einander. Sie sind nicht allein.“',
            'Über einen Umweg erreichst du eine Helferin der verbotenen Roten Hilfe. Noch in derselben Woche steht sie bei Frau Brandt in der Küche, mit Geld für die Miete und der Nachricht, dass die Familien der Gefangenen einander beistehen. Frau Brandt ist nicht mehr allein.',
          ),
          failEffects: { heatLeader: 10, moral: -2 },
          failResult: L(
            'Der Kontakt ist abgerissen. Die Frau von der Roten Hilfe ist selbst verhaftet worden. Und jemand hat gesehen, wie du nach ihr gefragt hast.',
            'Der Kontakt ist abgerissen: Die Helferin der Roten Hilfe ist selbst verhaftet worden. Schlimmer noch, jemand hat gesehen, wie du dich nach ihr erkundigt hast.',
          ),
        },
        {
          label: L('Einen Anwalt suchen, der Verhaftete verteidigt', 'Einen Anwalt suchen, der den Mut hat, politische Gefangene zu vertreten'),
          check: { stat: 'bildung', min: 4 },
          effects: { moral: 5, helped: 1 },
          result: L(
            'Ihr findet einen Anwalt, der sich traut. Er darf den Jungen nicht besuchen. Aber er fragt immer wieder nach. Drei Wochen später darf Frau Brandt ein Paket mit Wäsche schicken. Es ist wenig. Aber es ist ein Lebenszeichen.',
            'Ihr findet einen Anwalt, der sich traut. Gegen die „Schutzhaft“ gibt es kein Gericht, aber er fragt nach, schreibt und lässt nicht locker. Drei Wochen später darf Frau Brandt ein Paket mit Wäsche schicken. Auch ein Gesuch an die Polizei hat sie geschrieben, wie viele Angehörige. Ob es geholfen hat, erfahrt ihr nie.',
          ),
          failEffects: { heatLeader: 8 },
          failResult: L(
            'Der Anwalt schüttelt den Kopf. „Gegen die Schutzhaft gibt es kein Gericht“, sagt er. „Und wer fragt, macht sich verdächtig.“ Auf dem Heimweg folgt dir ein Mann.',
            'Der Anwalt schüttelt den Kopf. „Gegen die Schutzhaft gibt es kein Gericht. Und wer zu viel fragt, macht sich selbst verdächtig.“ Auf dem Heimweg folgt dir ein Mann bis zur Straßenbahn.',
          ),
        },
        {
          label: 'Der Familie Geld aus der Kasse geben',
          needsKasse: 15,
          effects: { kasse: -15, moral: 8, supporters: 1, helped: 1 },
          result: L(
            'Frau Brandt weint, als du ihr die fünfzehn Reichsmark gibst. Jetzt kann sie die Miete zahlen. In der Straße spricht es sich herum: Es gibt noch Menschen, die helfen.',
            'Frau Brandt weint, als du ihr die fünfzehn Reichsmark gibst. Ohne den Lohn ihres Sohnes hätte sie die Miete nicht zahlen können. Die ganze Straße erfährt davon, dass es noch Anstand gibt.',
          ),
        },
        {
          label: '„Wir können nichts tun. Es tut mir leid.“',
          effects: { moral: -6 },
          result: L(
            'Frau Brandt nickt stumm. An der Tür dreht sie sich noch einmal um. Sie sagt nichts. Du fühlst dich elend.',
            'Frau Brandt nickt stumm. An der Tür dreht sie sich noch einmal um, sagt aber nichts. Du fühlst dich elend.',
          ),
        },
      ],
    },
  },
  // Woche 6
  {
    calendar: { day: 1, month: 'April', weekday: 'Sonnabend' },
    intertitle: L(
      '1. April 1933. Vor den Läden jüdischer Nachbarn stehen Männer in Uniform.',
      '1. April 1933. Vor den Läden jüdischer Nachbarn stehen Männer in Uniform.',
    ),
    dateLabel: 'Woche vom 27. März 1933',
    paperDate: 'Sonnabend, den 1. April 1933',
    headline: 'Boykott gegen jüdische Geschäfte',
    subline: L(
      'Seit zehn Uhr stehen Posten der SA vor Läden, Arztpraxen und Kanzleien.',
      'Vor Läden, Arztpraxen und Kanzleien stehen seit zehn Uhr Posten der SA.',
    ),
    lead: L(
      'Die NSDAP hat heute zum Boykott aufgerufen. Das heißt: Niemand soll bei jüdischen Geschäften kaufen. Vor den Eingängen stehen SA-Männer mit Schildern. Darauf steht: „Deutsche! Wehrt euch! Kauft nicht bei Juden!“ Viele Schaufenster wurden beschmiert. Wer hinein will, wird aufgehalten.',
      'Auf Anordnung der Parteileitung hat heute um zehn Uhr im ganzen Reich ein Boykott jüdischer Geschäfte begonnen. Vor den Eingängen stehen SA-Männer mit Schildern. Auf den Plakaten heißt es: „Deutsche! Wehrt euch! Kauft nicht bei Juden!“ An viele Schaufenster wurden Parolen geschmiert. Die Kundschaft wird am Betreten der Läden gehindert.',
    ),
    articles: [
      {
        headline: 'Stille im Scheunenviertel',
        body: L(
          'In der Grenadierstraße und der Dragonerstraße blieben viele Läden zu. Die Besitzer hatten Angst, ihre Rollläden hochzuziehen.',
          'In der Grenadierstraße und der Dragonerstraße blieben viele Läden geschlossen. Die Inhaber wagten nicht, ihre Rollläden zu öffnen.',
        ),
      },
      {
        headline: 'Einige kauften dennoch',
        body: L(
          'Einige Menschen gingen trotzdem in die Läden. Die Posten beschimpften sie und machten Fotos von ihnen.',
          'Vereinzelt betraten Bürger dennoch die boykottierten Geschäfte. Sie wurden von den Posten beschimpft und fotografiert.',
        ),
      },
    ],
    illustration: 'laden',
    caption: 'SA-Posten vor einem Geschäft in Berlin',
    note: L(
      'Herr Rosenthal hat meinem Vater im Winter die Rechnung gestundet, als wir kein Geld hatten. Heute steht ein Junge in Uniform vor seiner Tür. Er ist kaum älter als sechzehn.',
      'Herr Rosenthal hat meinem Vater im Winter die Rechnung gestundet, als wir kein Geld hatten. Heute steht ein Junge in Uniform vor seiner Tür, kaum älter als sechzehn.',
    ),
    voice: L(
      '„Ich kauf halt woanders. Ich will keinen Ärger.“',
      '„Ich kaufe jetzt eben woanders ein. Was soll man machen? Ich will keinen Ärger, ich habe Familie.“',
    ),
    context: L(
      'Am 1. April 1933 riefen die Nazis zum Boykott jüdischer Geschäfte, Arztpraxen und Anwaltsbüros auf. SA-Männer stellten sich vor die Eingänge und bedrohten die Kunden. Das war der Anfang einer Verfolgung, die immer schlimmer wurde. Jüdische Deutsche waren Nachbarn, Kollegen und Freunde wie alle anderen auch. Die meisten Menschen gingen an diesem Tag einfach weiter.',
      'Am 1. April 1933 organisierte die NSDAP den Boykott jüdischer Geschäfte, Arztpraxen und Anwaltskanzleien. SA-Männer stellten sich vor die Eingänge und bedrohten die Kundschaft. Es war der erste reichsweite, offen organisierte Angriff auf die jüdische Bevölkerung und der Beginn einer Verfolgung, die sich Schritt für Schritt verschärfte. Die meisten nichtjüdischen Deutschen protestierten nicht.',
    ),
    reflect: L(
      'Die meisten gingen am 1. April einfach weiter. Was hätte es bedeutet, trotzdem in den Laden zu gehen?',
      'Am 1. April 1933 widersprachen nur wenige. Warum reicht es nicht, selbst kein Unrecht zu tun, wenn man zusieht, wie es anderen geschieht?',
    ),
    lexicon: ['boykott', 'sa', 'antisemitismus', 'rassismus', 'solidaritaet'],
    effects: { moral: -4 },
    moodText: L(
      'Jüdische Nachbarn werden offen ausgegrenzt. Kaum jemand sagt etwas dagegen.',
      'Jüdische Nachbarn werden offen ausgegrenzt, und kaum jemand widerspricht.',
    ),
    event: {
      title: 'Vor dem Laden von Herrn Rosenthal',
      scene: L(
        'Ein Lebensmittelladen in der Grenadierstraße. Sonnabend, elf Uhr vormittags.',
        'Ein Kolonialwarenladen in der Grenadierstraße, Sonnabend, elf Uhr vormittags.',
      ),
      speaker: 'Herr Rosenthal',
      speakerRole: 'Kaufmann im Scheunenviertel',
      portrait: { gender: 'm', face: 'oval', headwear: 'fedora', hairTone: 'grau', glasses: true, clothing: 'weste' },
      text: L(
        'Vor dem Laden steht ein SA-Mann mit einem Schild. Hinter der Scheibe siehst du Herrn Rosenthal. Er steht allein zwischen seinen Regalen. Er rückt Dosen gerade, die schon gerade stehen. Als er dich sieht, hebt er kurz die Hand. Dann lässt er sie sinken. Der SA-Mann sieht dich herausfordernd an. Die Leute auf der Straße gehen schnell vorbei.',
        'Vor dem Laden steht ein SA-Posten mit einem Schild. Hinter der Scheibe siehst du Herrn Rosenthal. Er steht allein zwischen seinen Regalen und rückt Konservendosen gerade, die schon gerade stehen. Als er dich erkennt, hebt er kurz die Hand, dann lässt er sie sinken. Der Posten sieht dich herausfordernd an. Die Passanten gehen mit gesenktem Blick vorbei.',
      ),
      choices: [
        {
          label: L('Am Posten vorbei in den Laden gehen und einkaufen', 'Am Posten vorbei in den Laden gehen und einkaufen'),
          effects: { moral: 10, heatLeader: 10, supporters: 1, kasse: -2, helped: 1 },
          result: L(
            'Der Posten brüllt dich an und schreibt etwas auf. Du gehst trotzdem hinein und kaufst Zucker und Kaffee. Herr Rosenthal kann kaum sprechen. Hinter dir kommt eine alte Frau in den Laden. Dann noch eine.',
            'Der Posten brüllt dich an und schreibt sich etwas auf. Du gehst trotzdem hinein und kaufst Zucker und Kaffee. Herr Rosenthal kann kaum sprechen. Hinter dir betritt eine alte Frau den Laden, dann noch eine. Mut steckt an.',
          ),
        },
        {
          label: 'Am Abend über den Hof an die Hintertür klopfen',
          effects: { moral: 5, kasse: -2, helped: 1 },
          result: L(
            'Als es dunkel ist, klopfst du an die Hintertür. Herr Rosenthal verkauft dir, was du brauchst. Er hält deine Hand einen Moment fest. „Es gibt noch Menschen“, sagt er leise.',
            'Nach Einbruch der Dunkelheit klopfst du an die Hintertür. Herr Rosenthal verkauft dir, was du brauchst, und hält deine Hand einen Augenblick zu lang. „Es gibt noch Menschen“, sagt er leise.',
          ),
        },
        {
          label: L('Weitergehen wie alle anderen', 'Weitergehen, als hättest du nichts gesehen, wie alle anderen'),
          effects: { moral: -8 },
          result: L(
            'Du gehst weiter, wie alle anderen. Drei Häuser später drehst du dich um. Herr Rosenthal steht noch immer hinter der Scheibe. Du wirst das lange nicht vergessen.',
            'Du gehst weiter, wie die anderen auch. Drei Häuser später drehst du dich um. Herr Rosenthal steht noch immer hinter der Scheibe. Du wirst diesen Anblick lange nicht vergessen.',
          ),
        },
      ],
    },
  },
  // Woche 7
  {
    calendar: { day: 7, month: 'April', weekday: 'Freitag' },
    intertitle: L(
      'April 1933. Lehrerinnen und Lehrer verlieren ihre Arbeit. Weil sie Juden sind. Oder weil sie Demokraten sind und nicht mitmachen.',
      'April 1933. Beamte, Richter und Lehrerinnen werden entlassen: weil sie jüdisch sind oder weil sie als Demokraten und Linke nicht mitmachen.',
    ),
    dateLabel: 'Woche vom 3. April 1933',
    paperDate: 'Sonnabend, den 8. April 1933',
    headline: 'Gesetz zur Wiederherstellung des Berufsbeamtentums',
    subline: L(
      'Beamte, die die Nazis „nicht arisch“ oder „unzuverlässig“ nennen, werden entlassen.',
      'Beamte „nicht arischer Abstammung“ und politisch unzuverlässige Beamte werden aus dem Dienst entfernt.',
    ),
    lead: L(
      'Die Regierung hat ein neues Gesetz gemacht. Beamte, die sie „nicht arisch“ nennt, müssen gehen. Gemeint sind vor allem Juden. Auch Beamte, die in der SPD oder der KPD waren, können entlassen werden. Das trifft Richter, Professoren und Lehrer.',
      'Die Reichsregierung hat ein Gesetz beschlossen, nach dem Beamte, die „nicht arischer Abstammung“ sind, in den Ruhestand zu versetzen sind. Entlassen werden auch Beamte, die nach ihrer bisherigen politischen Betätigung nicht die Gewähr dafür bieten, jederzeit rückhaltlos für den nationalen Staat einzutreten. Betroffen sind Richter, Verwaltungsbeamte, Professoren und Lehrer.',
    ),
    articles: [
      {
        headline: 'Auch Schulen betroffen',
        body: L(
          'Auch alle Lehrerinnen und Lehrer in Berlin müssen bald einen Fragebogen ausfüllen. Darin wird nach ihrer Familie und ihrer früheren Partei gefragt.',
          'Auch an den Berliner Schulen sollen sämtliche Lehrkräfte bald Fragebögen über ihre Abstammung und ihre frühere Parteizugehörigkeit ausfüllen.',
        ),
      },
      {
        headline: 'Säuberung der Universitäten',
        body: L(
          'An der Universität in Berlin mussten mehrere Professoren gehen. Studenten in SA-Uniform stören die Vorlesungen.',
          'An der Friedrich-Wilhelms-Universität wurden mehrere Professoren beurlaubt. Studenten in SA-Uniform stören Vorlesungen.',
        ),
      },
    ],
    illustration: 'schule',
    caption: 'Eine Berliner Volksschule',
    note: L(
      'Fräulein Doktor Weiß hat zwanzig Jahre an der Schule in der Rütlistraße unterrichtet. Gestern hat man sie nach Hause geschickt, weil sie Sozialdemokratin ist. Die Kinder standen am Fenster und haben geweint.',
      'Fräulein Doktor Weiß hat zwanzig Jahre an der Schule in der Rütlistraße unterrichtet. Gestern hat man sie nach Hause geschickt, weil sie in der SPD war. Die Kinder haben am Fenster gestanden und geweint.',
    ),
    voice: L(
      '„Die Frau Doktor war ja nett. Aber Vorschrift ist Vorschrift.“',
      '„Die Frau Doktor war ja immer sehr nett. Aber Gesetz ist Gesetz, da kann man nichts machen.“',
    ),
    context: L(
      'Mit diesem Gesetz vom 7. April 1933 wurden jüdische Beamte und politische Gegner entlassen. Viele Lehrerinnen und Lehrer verloren ihre Arbeit. Die Nazis wollten Schulen, in denen Kinder gehorchen und nicht selbst denken. Das nannten sie „Gleichschaltung“: Alles sollte nach ihrem Willen laufen.',
      'Mit dem Gesetz vom 7. April 1933 wurden jüdische Beamte und politische Gegner aus dem Staatsdienst entfernt. „Nicht arisch“ war ein Begriff der NS-Rassenideologie ohne jede wissenschaftliche Grundlage. Viele Lehrerinnen und Lehrer verloren ihre Arbeit. Die Schule sollte nicht mehr zu eigenem Urteilen erziehen, sondern zu Gehorsam und Anpassung. Das war Teil der „Gleichschaltung“.',
    ),
    reflect: L(
      'Die Nazis wollten bestimmen, was Kinder in der Schule lernen. Warum war ihnen das so wichtig?',
      'Die Nationalsozialisten wollten eine Schule, die Gehorsam statt eigenes Denken lehrt. Warum ist eine Erziehung zum selbstständigen Urteilen und zum Nicht-Mitmachen ein Schutz gegen Diktatur?',
    ),
    lexicon: ['gleichschaltung', 'antisemitismus', 'rassismus'],
    effects: { moral: -3 },
    moodText: L('Überall in der Stadt verlieren Menschen ihre Arbeit.', 'Eine Welle der Entlassungen geht durch die Stadt.'),
    conditional: [
      {
        profession: 'lehrer',
        effects: { heatLeader: 10 },
        text: L(
          'Auch du musst den Fragebogen ausfüllen. Der Schulleiter beobachtet dich seitdem.',
          'Auch du musst den Fragebogen ausfüllen. Der Rektor sieht dich seither prüfend an.',
        ),
      },
    ],
    event: {
      title: 'Die entlassene Lehrerin',
      scene: L('Eine kleine Wohnung in Neukölln. Überall stehen Kisten mit Büchern.', 'Eine kleine Wohnung in Neukölln. Überall stehen Bücherkisten.'),
      speaker: 'Dr. Else Weiß',
      speakerRole: L('Lehrerin, seit gestern ohne Arbeit', 'Lehrerin, seit gestern entlassen'),
      portrait: { gender: 'w', face: 'oval', headwear: 'kurz', hairTone: 'grau', glasses: true, clothing: 'weste' },
      text: L(
        'Dr. Weiß packt ihre Bücher in Kisten. Sie wirkt ruhig, fast zu ruhig. „Zwanzig Jahre, {name}. Ich habe den Kindern beigebracht, selbst zu denken. Genau das wollen sie nicht mehr.“ Sie legt ein Buch zur Seite. „Ich habe jetzt viel Zeit. Und eine Schreibmaschine. Vielleicht kann ich euch helfen.“',
        'Dr. Weiß packt ihre Bücher in Kisten. Sie wirkt ruhig, fast zu ruhig. „Zwanzig Jahre, {name}. Ich habe den Kindern beigebracht, Fragen zu stellen und selbst zu urteilen. Das ist jetzt verboten.“ Sie legt ein Buch beiseite. „Ich habe jetzt viel Zeit. Und ich habe eine Schreibmaschine. Vielleicht kann ich euch nützlich sein.“',
      ),
      choices: [
        {
          label: '„Schreiben Sie unsere Flugblätter. Niemand schreibt so klar wie Sie.“',
          effects: { items: { flugblaetter: 2 }, moral: 5, heatLeader: 5 },
          result: L(
            'Schon am nächsten Abend bringt sie zwei Bündel getippte Flugblätter. Die Sätze sind einfach und klar. Jedes Kind kann verstehen, was darin steht.',
            'Schon am nächsten Abend bringt sie zwei Bündel sauber getippter Flugschriften. Die Sätze sind einfach und klar. Selbst ein Kind kann verstehen, was darin steht.',
          ),
        },
        {
          label: L('Bei den Unterstützern Geld für sie sammeln', 'Unter den Unterstützern Geld für sie sammeln'),
          needsKasse: 10,
          effects: { kasse: -10, moral: 6, supporters: 2, helped: 1 },
          result: L(
            'Ihr bringt ihr zehn Reichsmark und einen Korb mit Essen. Dr. Weiß erzählt ihren früheren Kollegen davon. Zwei von ihnen wollen euch jetzt helfen.',
            'Ihr bringt ihr zehn Reichsmark und einen Korb mit Lebensmitteln. Dr. Weiß erzählt ihren früheren Kollegen davon. Zwei von ihnen möchten euch künftig unterstützen.',
          ),
        },
        {
          label: L('„Sie haben schon genug verloren. Halten Sie sich raus.“', '„Sie haben schon genug verloren. Bleiben Sie außen vor.“'),
          effects: { moral: 1 },
          result: L(
            'Sie lächelt traurig. „Vielleicht haben Sie recht.“ Als du gehst, sitzt sie am Fenster und schaut auf die Straße.',
            'Sie lächelt traurig. „Vielleicht haben Sie recht.“ Als du gehst, sitzt sie am Fenster und sieht auf die Straße hinunter.',
          ),
        },
      ],
    },
  },
  // Woche 8
  {
    calendar: { day: 26, month: 'April', weekday: 'Mittwoch' },
    intertitle: L(
      '26. April 1933. Die Geheime Staatspolizei beginnt ihre Arbeit. Ihre Fenster sind die ganze Nacht hell.',
      '26. April 1933. Die Geheime Staatspolizei nimmt ihre Arbeit auf. Ihre Fenster bleiben die ganze Nacht erleuchtet.',
    ),
    dateLabel: 'Woche vom 24. April 1933',
    paperDate: 'Donnerstag, den 27. April 1933',
    headline: L('Neue Geheime Staatspolizei', 'Geheimes Staatspolizeiamt errichtet'),
    subline: L(
      'Eine neue politische Polizei soll alle „Feinde des Staates“ finden und bekämpfen.',
      'Neue politische Polizei für ganz Preußen. Sie soll „staatsfeindliche Bestrebungen“ erforschen und bekämpfen.',
    ),
    lead: L(
      'In Preußen gibt es jetzt eine neue Polizei: das Geheime Staatspolizeiamt. Chef ist Hermann Göring. Die neue Polizei soll alle Gegner des Staates aufspüren. Ihre Beamten dürfen Menschen einsperren, ohne dass ein Richter gefragt wird.',
      'Durch Gesetz vom 26. April ist in Preußen das Geheime Staatspolizeiamt geschaffen worden. Die neue Behörde untersteht dem preußischen Innenminister Göring. Sie soll alle staatsgefährlichen politischen Bestrebungen im gesamten Staatsgebiet erforschen. Ihre Beamten dürfen Verdächtige in Schutzhaft nehmen, ohne dass ein Richter darüber entscheidet.',
    ),
    articles: [
      {
        headline: 'Der 1. Mai wird Feiertag',
        body: L(
          'Der 1. Mai heißt jetzt „Feiertag der nationalen Arbeit“. Auf dem Tempelhofer Feld wird eine riesige Kundgebung vorbereitet. Auch die Gewerkschaften rufen zum Mitmachen auf.',
          'Der 1. Mai wird als „Feiertag der nationalen Arbeit“ begangen. Auf dem Tempelhofer Feld wird eine gewaltige Kundgebung vorbereitet. Die Gewerkschaften haben zur Teilnahme aufgerufen.',
        ),
      },
      {
        headline: 'Anzeigen aus der Bevölkerung',
        body: L(
          'Bei der Polizei gehen jeden Tag viele Anzeigen ein. Menschen zeigen ihre Nachbarn und Kollegen an.',
          'Bei den Polizeirevieren gehen täglich zahlreiche Anzeigen gegen Nachbarn und Arbeitskollegen ein, heißt es aus dem Präsidium.',
        ),
      },
    ],
    illustration: 'amt',
    caption: L('Ein Amtsgebäude in Berlin', 'Ein Amtsgebäude in der Reichshauptstadt'),
    note: L(
      'Jetzt haben sie eine eigene Polizei nur für Leute wie uns. Ab heute trauen wir niemandem, den wir nicht seit Jahren kennen. Wir treffen uns nur noch zu zweit.',
      'Jetzt haben sie eine eigene Polizei nur für Leute wie uns. Ab heute trauen wir niemandem, den wir nicht seit Jahren kennen. Treffen nur noch zu zweit.',
    ),
    voice: L(
      '„Ich hab nur gemeldet, was ich gesehen habe. Das ist meine Pflicht.“',
      '„Ich habe nur gemeldet, was mir aufgefallen ist. Das ist doch meine Pflicht als anständiger Bürger.“',
    ),
    context: L(
      'Die Geheime Staatspolizei, kurz Gestapo, wurde im April 1933 gegründet. Sie jagte alle Gegner der Nazis. Oft bekam sie Hinweise von Nachbarn oder Kollegen, die andere anzeigten. Niemand wusste, wer ihn beobachtete.',
      'Die Geheime Staatspolizei, kurz Gestapo, entstand im April 1933. Sie verfolgte alle, die als Gegner galten. Die Gestapo hatte vergleichsweise wenige Beamte. Ihre Macht beruhte zu einem großen Teil auf Anzeigen aus der Bevölkerung: Nachbarn, Kollegen und sogar Verwandte meldeten andere, aus Überzeugung, aus Neid oder um sich selbst Vorteile zu verschaffen.',
    ),
    reflect: L(
      'Viele Verhaftungen begannen mit einer Anzeige von Nachbarn. Warum haben Menschen andere verraten?',
      'Die Gestapo lebte von Anzeigen aus der Bevölkerung. Welche Gründe hatten Menschen, ihre Nachbarn anzuzeigen, und was sagt das über die Macht einer Diktatur?',
    ),
    lexicon: ['gestapo', 'spitzel', 'denunziation'],
    effects: { moral: -3 },
    moodText: L('Ab jetzt ist jeder Auftrag gefährlicher.', 'Ab jetzt ist jeder Einsatz gefährlicher.'),
    event: {
      title: 'Der Neue',
      scene: L('Das Hinterzimmer einer Kneipe am Leopoldplatz.', 'Das Hinterzimmer einer Kneipe am Leopoldplatz.'),
      speaker: 'Herr Kaminski',
      speakerRole: L('Will bei euch mitmachen', 'Möchte der Gruppe beitreten'),
      portrait: { gender: 'm', face: 'rund', headwear: 'fedora', hairTone: 'dunkel', glasses: false, clothing: 'trenchcoat' },
      text: L(
        'Ein Mann in einem guten Mantel setzt sich zu dir. Er nennt sich Kaminski. Er spricht leise und freundlich. „Ich weiß, was ihr macht, {name}. Die Flugblätter, die Parolen. Ich will helfen. Ich habe Geld.“ Er lächelt. Woher weiß er so viel?',
        'Ein Mann im guten Mantel setzt sich zu dir. Er nennt sich Kaminski und spricht leise und freundlich. „Ich weiß, was ihr macht, {name}. Die Flugblätter, die Parolen. Ich will helfen. Ich habe Geld und kenne Leute bei der Post.“ Er lächelt. Woher weiß er so viel?',
      ),
      choices: [
        {
          label: L('Ihm kluge Fragen stellen, bevor du ihm traust', 'Ihm geschickte Fragen stellen, bevor du ihm traust'),
          check: { stat: 'bildung', min: 4 },
          effects: { moral: 4 },
          result: L(
            'Du fragst nach Straßen, Namen und alten Treffen. Seine Antworten passen nicht zusammen. Du bedankst dich und gehst. Noch in derselben Nacht sucht die Gruppe einen neuen Treffpunkt.',
            'Du fragst nach Straßen, Namen, alten Versammlungen. Seine Antworten passen nicht zusammen. Du bedankst dich höflich und gehst. Noch in derselben Nacht verlegt die Gruppe ihren Treffpunkt.',
          ),
          failEffects: { heatAll: 15 },
          failResult: L(
            'Seine Antworten klingen gut. Du erzählst ihm mehr, als du solltest. Tage später merkt {g1}: Ein Mann im guten Mantel läuft vor eurem Haus auf und ab.',
            'Seine Antworten klingen überzeugend. Du erzählst ihm mehr, als du solltest. Erst Tage später merkt {g1}, dass ein Mann im guten Mantel vor eurem Haus auf und ab geht.',
          ),
        },
        {
          label: 'Das Geld nehmen und ihn aufnehmen',
          effects: { kasse: 25, supporters: 2, heatAll: 20 },
          result: L(
            'Kaminski gibt dir fünfundzwanzig Reichsmark. Er kommt zu zwei Treffen, dann nicht mehr. Seitdem stehen oft Männer in normaler Kleidung an den Straßenecken. Er war ein Spitzel.',
            'Kaminski gibt dir fünfundzwanzig Reichsmark. Er kommt zu zwei Treffen, dann bleibt er aus. Seitdem stehen immer wieder Männer in Zivil an den Straßenecken. Ihr hättet es wissen müssen.',
          ),
        },
        {
          label: 'Ihn sofort abweisen',
          effects: { moral: -1 },
          result: L(
            '„Ich weiß nicht, wovon Sie reden“, sagst du und gehst. Vielleicht war er ehrlich. Vielleicht nicht. Heute kann man das nicht mehr wissen. Genau das ist das Schlimme.',
            '„Ich weiß nicht, wovon Sie reden“, sagst du und gehst. Vielleicht war er ehrlich. Vielleicht nicht. Heute kann man es nicht mehr wissen, und genau das ist das Schlimme.',
          ),
        },
      ],
    },
  },
  // Woche 9
  {
    calendar: { day: 2, month: 'Mai', weekday: 'Dienstag' },
    intertitle: L(
      '2. Mai 1933, zehn Uhr morgens. SA-Männer besetzen die Häuser der Gewerkschaften.',
      '2. Mai 1933, zehn Uhr morgens. SA-Männer besetzen die Häuser der Gewerkschaften.',
    ),
    dateLabel: 'Woche vom 1. Mai 1933',
    paperDate: 'Mittwoch, den 3. Mai 1933',
    headline: 'Gewerkschaftshäuser im ganzen Reich besetzt',
    subline: L(
      'Einen Tag nach dem Feiertag der Arbeit übernehmen SA und SS die Gewerkschaften.',
      'Einen Tag nach dem Feiertag der Arbeit übernehmen SA und SS die Freien Gewerkschaften.',
    ),
    lead: L(
      'Am Dienstag um zehn Uhr hat die SA im ganzen Reich die Häuser der Gewerkschaften besetzt. Viele Gewerkschaftsführer wurden verhaftet. Das Geld der Gewerkschaften wurde weggenommen. Jetzt bestimmt die Partei über die Arbeiter.',
      'Am gestrigen Dienstag um zehn Uhr haben Abteilungen der SA und SS im ganzen Reich die Häuser der Freien Gewerkschaften besetzt. Zahlreiche Gewerkschaftsführer wurden in Schutzhaft genommen. Das Vermögen und die Kassen der Verbände sind beschlagnahmt. Die Leitung übernimmt ein „Aktionskomitee zum Schutz der deutschen Arbeit“ unter Dr. Robert Ley.',
    ),
    articles: [
      {
        headline: 'Eine Million am Tempelhofer Feld',
        body: L(
          'Am Tag davor hörten auf dem Tempelhofer Feld über eine Million Menschen die Rede von Hitler zum Feiertag der Arbeit.',
          'Am Vortag hatten auf dem Tempelhofer Feld über eine Million Menschen der Rede des Reichskanzlers zum Feiertag der nationalen Arbeit beigewohnt.',
        ),
      },
      {
        headline: 'Mitgliederlisten beschlagnahmt',
        body: L(
          'In den Gewerkschaftshäusern wurden viele Akten und Listen mit den Namen der Mitglieder gefunden.',
          'In den Gewerkschaftshäusern wurden umfangreiche Akten und Mitgliederverzeichnisse sichergestellt.',
        ),
      },
    ],
    illustration: 'fabrik',
    caption: 'Fabrikschornsteine im Norden Berlins',
    note: L(
      'Am Montag haben sie mit den Arbeitern gefeiert. Am Dienstag haben sie ihnen die Gewerkschaft weggenommen. Die Kollegen in der Fabrik reden kaum noch miteinander.',
      'Am Montag haben sie mit den Arbeitern gefeiert, am Dienstag haben sie ihnen die Gewerkschaft weggenommen. Die Kollegen in der Fabrik reden kaum noch miteinander.',
    ),
    voice: L(
      '„Am 1. Mai sind alle mitmarschiert. Wer gefehlt hat, wurde aufgeschrieben.“',
      '„Am 1. Mai sind wir alle mitmarschiert, der ganze Betrieb. Wer gefehlt hat, stand am nächsten Tag auf einer Liste.“',
    ),
    context: L(
      'Am 1. Mai 1933 feierten die Nazis den „Tag der nationalen Arbeit“. Schon am nächsten Tag besetzten sie alle Gewerkschaftshäuser. Die Gewerkschaften hatten sich lange für bessere Löhne eingesetzt. Jetzt gab es niemanden mehr, der für die Arbeiter sprach.',
      'Am 1. Mai 1933 feierten die Nationalsozialisten erstmals den „Tag der nationalen Arbeit“ als bezahlten Feiertag. Schon am nächsten Tag besetzten SA und SS alle Häuser der Freien Gewerkschaften. Die Arbeiterbewegung verlor ihre größte Organisation. An ihre Stelle trat die „Deutsche Arbeitsfront“, in der Arbeiter nichts mehr mitbestimmen konnten.',
    ),
    reflect: L(
      'Paul Sommer will die Liste mit 300 Namen schützen. Warum ist es wichtig, auch Menschen zu schützen, die man gar nicht kennt?',
      'Solidarität heißt auch, für Menschen einzustehen, die man gar nicht kennt. Was unterscheidet Solidarität von Freundschaft oder Mitleid?',
    ),
    lexicon: ['gewerkschaft', 'gleichschaltung', 'schutzhaft', 'solidaritaet'],
    effects: { moral: -4 },
    moodText: L('Die letzte große Organisation der Arbeiter ist zerstört.', 'Die letzte große Organisation der Arbeiter ist zerschlagen.'),
    conditional: [
      {
        profession: 'arbeiter',
        effects: { supporters: 2 },
        text: L(
          'Deine Kollegen sind wütend. Einige fragen dich heimlich, ob man etwas tun kann.',
          'Deine Kollegen sind verbittert. Einige fragen dich heimlich, ob man etwas tun kann.',
        ),
      },
    ],
    event: {
      title: 'Die Mitgliederlisten',
      scene: L('Ein Treppenhaus im Wedding. Es riecht nach Bohnerwachs.', 'Ein Treppenhaus in Wedding. Es riecht nach Bohnerwachs.'),
      speaker: 'Paul Sommer',
      speakerRole: L('Sekretär der Gewerkschaft der Metallarbeiter', 'Sekretär der Metallarbeiter'),
      portrait: { gender: 'm', face: 'kantig', headwear: 'schiebermuetze', hairTone: 'grau', glasses: true, clothing: 'weste' },
      text: L(
        'Paul Sommer gibt dir einen schweren Karton. „Das sind die Listen unserer Gewerkschaft. Dreihundert Namen mit Adressen. Die SA hat sie nicht gefunden. Wenn sie die finden, holen sie jeden Einzelnen. {name}, was machen wir damit?“',
        'Paul Sommer drückt dir einen schweren Karton in die Arme. „Das sind die Listen unserer Ortsgruppe. Dreihundert Namen, mit Adressen. Die SA hat sie im Büro nicht gefunden, weil ich sie am Freitag mitgenommen habe. Wenn sie die finden, holen sie jeden einzelnen. {name}, was machen wir damit?“',
      ),
      choices: [
        {
          helps: { name: 'Die Menschen auf den Listen', gender: 'm', who: L('Dreihundert Namen, die ihr verbrannt habt', 'Dreihundert Gewerkschafter, deren Namen ihr verbrannt habt') },
          label: L('Die Listen heute Nacht im Ofen verbrennen', 'Die Listen noch heute Nacht im Ofen verbrennen'),
          effects: { moral: 6, heatLeader: 8, helped: 3 },
          result: L(
            'Blatt für Blatt verbrennst du die Namen im Küchenofen. Es dauert bis zum Morgen. Dreihundert Menschen werden nie erfahren, dass du sie heute Nacht beschützt hast.',
            'Blatt für Blatt verbrennst du die Namen im Küchenofen. Es dauert bis zum Morgen. Dreihundert Menschen werden nie erfahren, dass du sie heute Nacht geschützt hast.',
          ),
        },
        {
          label: L('Die Listen verstecken. Die Namen sind später wichtig.', 'Die Listen verstecken. Die Namen sind wertvoll für später.'),
          effects: { supporters: 4, heatAll: 15 },
          result: L(
            'Ihr versteckt den Karton hinter einer losen Wand im Keller. Mit den Listen findet ihr neue Helfer. Aber jeder Tag mit diesen Papieren im Haus ist gefährlich für alle.',
            'Ihr versteckt den Karton hinter einer losen Wand im Keller. Über die Listen findet ihr neue Helfer. Doch jeder weitere Tag mit diesen Papieren im Haus ist eine Gefahr für alle, deren Namen darauf stehen.',
          ),
        },
        {
          label: '„Das ist zu gefährlich. Nehmen Sie das wieder mit.“',
          effects: { moral: -5 },
          result: L(
            'Paul Sommer sieht dich enttäuscht an und nimmt den Karton zurück. Du hörst nie wieder von ihm.',
            'Paul Sommer sieht dich enttäuscht an und nimmt den Karton zurück. Du hörst nie wieder von ihm.',
          ),
        },
      ],
    },
  },
  // Woche 10
  {
    calendar: { day: 10, month: 'Mai', weekday: 'Mittwoch' },
    intertitle: L(
      '10. Mai 1933, Opernplatz. Es regnet. Trotzdem brennen die Bücher.',
      '10. Mai 1933, Opernplatz. Es regnet. Und trotzdem brennen die Bücher.',
    ),
    dateLabel: 'Woche vom 8. Mai 1933',
    paperDate: 'Donnerstag, den 11. Mai 1933',
    headline: L('Bücher auf dem Opernplatz verbrannt', 'Verbrennung „undeutschen Schrifttums“ auf dem Opernplatz'),
    subline: L(
      'Studenten werfen zwanzigtausend Bücher ins Feuer. Minister Goebbels hält eine Rede.',
      'Studenten werfen zwanzigtausend Bücher in die Flammen. Reichsminister Dr. Goebbels spricht um Mitternacht.',
    ),
    lead: L(
      'Gestern Abend zogen Studenten mit Fackeln zum Opernplatz. Dort warfen sie Bücher auf einen großen Holzhaufen und zündeten ihn an. Verbrannt wurden die Bücher von Heinrich Mann, Erich Kästner, Kurt Tucholsky, Sigmund Freud, Karl Marx und vielen anderen. Minister Goebbels sagte, jetzt beginne eine neue Zeit.',
      'Gestern Abend zogen Studenten mit Fackeln von der Universität zum Opernplatz. Dort warfen sie unter lauten „Feuersprüchen“ Bücher auf einen großen Scheiterhaufen. Verbrannt wurden die Werke von Heinrich Mann, Erich Kästner, Kurt Tucholsky, Sigmund Freud, Karl Marx und vielen anderen. Reichsminister Dr. Goebbels erklärte das „Zeitalter eines überspitzten jüdischen Intellektualismus“ für beendet.',
    ),
    articles: [
      {
        headline: 'Auch in anderen Städten',
        body: L(
          'In München, Frankfurt, Breslau und vielen anderen Städten mit Universitäten brannten ebenfalls Bücher.',
          'In München, Frankfurt, Breslau und zahlreichen weiteren Universitätsstädten fanden ähnliche Kundgebungen statt.',
        ),
      },
      {
        headline: 'Büchereien werden durchsucht',
        body: L(
          'Die Büchereien der Stadt haben Listen bekommen. Darauf steht, welche Bücher aus den Regalen müssen.',
          'Die Leihbüchereien der Stadt haben Listen erhalten, welche Werke aus den Regalen zu entfernen sind.',
        ),
      },
    ],
    illustration: 'buecher',
    caption: 'Der Scheiterhaufen auf dem Opernplatz',
    note: L(
      'Erich Kästner hat „Emil und die Detektive“ geschrieben. Man sagt, er stand selbst in der Menge. Er hat zugesehen, wie andere Bücher von ihm brannten. Es hat die ganze Nacht geregnet. Und trotzdem hat es gebrannt.',
      'Man sagt, Erich Kästner, der „Emil und die Detektive“ geschrieben hat, stand selbst in der Menge und sah zu, wie seine Bücher brannten. Es hat die ganze Nacht geregnet, und trotzdem hat es gebrannt.',
    ),
    voice: L(
      '„Das sind doch nur Bücher. Deswegen geht die Welt nicht unter.“',
      '„Es sind doch nur Bücher. Man soll sich nicht so aufregen, das meiste davon hat eh keiner gelesen.“',
    ),
    witnessIntro: L(
      'Erich Kästner stand wirklich in der Menge. Später schrieb er darüber:',
      'Erich Kästner war tatsächlich auf dem Opernplatz. Nach dem Krieg erinnerte er sich:',
    ),
    witnesses: [
      {
        who: L('Erich Kästner, Schriftsteller', 'Erich Kästner, Schriftsteller, in einer Erinnerung an den 10. Mai 1933'),
        text: '„Ich stand vor der Universität, eingekeilt zwischen Studenten in SA-Uniformen […] und sah unsere Bücher in die zuckenden Flammen fliegen.“',
        source: 'Erich Kästner, nach 1945 veröffentlichte Erinnerung, zitiert nach dem Exil-Archiv',
        url: 'https://www.exilarchiv.de/?p=605',
      },
    ],
    context: L(
      'Am 10. Mai 1933 verbrannten Studenten auf dem Opernplatz in Berlin Tausende Bücher. Heute heißt der Platz Bebelplatz. Die Bücher waren von Menschen, die den Nazis nicht passten. Heute erinnert dort ein Denkmal unter dem Pflaster an die Bücherverbrennung: eine leere Bibliothek.',
      'Am 10. Mai 1933 verbrannten Studenten auf dem Berliner Opernplatz, dem heutigen Bebelplatz, Tausende Bücher. Organisiert hatte die Aktion die Deutsche Studentenschaft, nicht die Regierung allein. Professoren standen dabei. Heute erinnert dort ein Denkmal von Micha Ullman an die Bücherverbrennung: eine unterirdische, leere Bibliothek.',
    ),
    reflect: L(
      'Heinrich Heine schrieb: Wo man Bücher verbrennt, verbrennt man am Ende auch Menschen. Was meinte er damit?',
      'Warum beginnt Unterdrückung oft mit der Kontrolle von Worten und Büchern? Welche Rolle spielt dabei das Schweigen der vielen, die zusehen?',
    ),
    lexicon: ['buecherverbrennung', 'zensur', 'propaganda'],
    effects: { moral: -4 },
    moodText: L('Sogar Gedanken sollen verboten werden.', 'Die Gedanken selbst sollen verboten werden.'),
    conditional: [
      {
        profession: 'journalist',
        effects: { heatLeader: 6 },
        text: L(
          'Auch die Zeitung, für die du geschrieben hast, steht auf einer Liste.',
          'Auch die Zeitung, für die du geschrieben hast, steht auf einer Liste.',
        ),
      },
    ],
    event: {
      title: 'Die Bücher der Volksbücherei',
      scene: L('Die Hintertür einer Bücherei in Kreuzberg, kurz vor Mitternacht.', 'Die Hintertür einer Volksbücherei in Kreuzberg, kurz vor Mitternacht.'),
      speaker: 'Hedwig Albrecht',
      speakerRole: 'Bibliothekarin',
      portrait: { gender: 'w', face: 'oval', headwear: 'zoepfe', hairTone: 'hell', glasses: true, clothing: 'kleid' },
      text: L(
        'Die junge Bibliothekarin hat Tränen in den Augen. „Morgen früh holen sie die Bücher ab. Kästner, Tucholsky, Heine, alles. Ich habe den Schlüssel zur Hintertür. Mit einem Handwagen können wir heute Nacht einige retten, {name}.“',
        'Die junge Bibliothekarin hat Tränen in den Augen. „Morgen früh holen sie die Bücher ab. Kästner, Tucholsky, Heine, alles. Ich habe den Schlüssel zum Hinterausgang. Wenn wir heute Nacht einen Handwagen bekommen, können wir wenigstens einige retten, {name}.“',
      ),
      choices: [
        {
          label: 'Mit dem Handwagen die Bücher heimlich fortschaffen',
          check: { stat: 'heimlichkeit', min: 4 },
          effects: { moral: 12, supporters: 1 },
          result: L(
            'Dreimal fahrt ihr mit dem Handwagen durch die dunklen Straßen. Zweihundert Bücher liegen jetzt in Kellern und auf Dachböden. Eines Tages darf man sie wieder lesen.',
            'Dreimal fahrt ihr mit dem Handwagen durch die dunklen Straßen. Zweihundert Bücher liegen nun in Kellern und auf Dachböden. Eines Tages wird man sie wieder lesen dürfen.',
          ),
          failEffects: { moral: 5, heatLeader: 15 },
          failResult: L(
            'Bei der dritten Fahrt ruft euch ein Wachmann. Ihr lasst den Wagen stehen und rennt. Hundert Bücher sind gerettet. Aber der Wachmann hat dein Gesicht gesehen.',
            'Bei der dritten Fahrt ruft euch ein Wachmann an. Ihr lasst den Wagen stehen und rennt. Hundert Bücher sind gerettet, aber der Wachmann hat dein Gesicht gesehen.',
          ),
        },
        {
          label: 'Ein Flugblatt über die Bücherverbrennung schreiben',
          check: { stat: 'propaganda', min: 4 },
          effects: { moral: 8, items: { flugblaetter: 1 } },
          result: L(
            'Ihr schreibt die ganze Nacht. Oben auf dem Blatt steht ein Satz von Heinrich Heine: „Dort, wo man Bücher verbrennt, verbrennt man auch am Ende Menschen.“',
            'Ihr schreibt die ganze Nacht. Am Ende steht ein Satz von Heinrich Heine über dem Blatt: „Dort, wo man Bücher verbrennt, verbrennt man auch am Ende Menschen.“',
          ),
          failEffects: { moral: 2 },
          failResult: L(
            'Die Worte wollen nicht kommen. Was ihr schreibt, klingt hilflos. Ihr zerreißt das Blatt.',
            'Die Worte wollen nicht kommen. Was ihr schreibt, klingt hilflos gegen das, was geschehen ist. Ihr zerreißt das Blatt.',
          ),
        },
        {
          label: L('Ihr raten, den Schlüssel abzugeben und still zu sein', 'Ihr raten, den Schlüssel abzugeben und zu schweigen'),
          effects: { moral: -4 },
          result: L(
            'Die Bibliothekarin sieht dich lange an. Dann nickt sie und schließt die Tür. Am Morgen kommt ein Lastwagen.',
            'Die Bibliothekarin sieht dich lange an. Dann nickt sie und schließt die Tür. Am Morgen fährt ein Lastwagen vor.',
          ),
        },
      ],
    },
  },
]

/** Beide Kapitel hintereinander: Wochen 0 bis 9 sind 1933, 10 bis 17 sind 1936 bis 1938 */
export const WEEKS: WeekData[] = [...WEEKS_1933, ...WEEKS_1936]

export const TOTAL_WEEKS = WEEKS.length
