import { WEEKS_1936 } from './weeks1936'
import type { AvatarConfig, Effects, IdeologyKey, ProfessionKey, StatKey } from '../types'

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
  headline: string
  body: string
}

export interface ConditionalEffect {
  ideology?: IdeologyKey
  profession?: ProfessionKey
  effects: Effects
  text: string
}

export interface EventChoice {
  label: string
  /** Probe auf einen Wert der Anführerin oder des Anführers */
  check?: { stat: StatKey; min: number }
  /** Wahl ist nur möglich, wenn so viel Geld in der Kasse liegt */
  needsKasse?: number
  effects: Effects
  result: string
  failEffects?: Effects
  failResult?: string
}

export interface StoryEvent {
  title: string
  scene: string
  speaker: string
  speakerRole: string
  portrait: AvatarConfig
  /** Platzhalter: {name} (Anführer), {g1}, {g2} (Gefährten) */
  text: string
  choices: EventChoice[]
}

export interface WeekData {
  /** Abreißkalender und Zwischentitel der Wochenschau */
  calendar: { day: number; month: string; weekday: string; year?: number }
  intertitle: string
  dateLabel: string
  paperDate: string
  headline: string
  subline: string
  lead: string
  articles: NewsArticle[]
  illustration: IllustrationKind
  caption: string
  /** Handschriftliche Notiz der Gruppe: was nicht in der Zeitung steht */
  note: string
  /** Sachliche Erklärung für Schülerinnen und Schüler */
  context: string
  lexicon: string[]
  effects: Effects
  moodText: string
  conditional?: ConditionalEffect[]
  event: StoryEvent
}

const WEEKS_1933: WeekData[] = [
  // Woche 1
  {
    calendar: { day: 30, month: 'Januar', weekday: 'Montag' },
    intertitle: 'Berlin, in der Nacht zum 31. Januar 1933. Stundenlang ziehen Fackeln durch das Brandenburger Tor.',
    dateLabel: 'Woche vom 30. Januar 1933',
    paperDate: 'Dienstag, den 31. Januar 1933',
    headline: 'Adolf Hitler zum Reichskanzler ernannt',
    subline: 'Reichspräsident von Hindenburg beruft ein Kabinett der „nationalen Konzentration“. Fackelzug durch das Brandenburger Tor.',
    lead:
      'Am gestrigen Montag hat der Herr Reichspräsident den Führer der Nationalsozialisten, Adolf Hitler, zum Reichskanzler ernannt. Vizekanzler wird Franz von Papen. Dem neuen Kabinett gehören neben dem Kanzler nur zwei Nationalsozialisten an, Dr. Frick als Reichsminister des Innern und Hermann Göring. Kreise der Deutschnationalen erklären, man werde den neuen Kanzler schon „einrahmen“. Bis spät in die Nacht zogen Kolonnen der SA und des Stahlhelms mit Fackeln durch das Brandenburger Tor und die Wilhelmstraße entlang.',
    articles: [
      {
        headline: 'Jubel in der Wilhelmstraße',
        body: 'Tausende Schaulustige säumten die Straßen. Aus einem Fenster der Reichskanzlei grüßte der neue Kanzler die Marschierenden. Der greise Reichspräsident sah dem Zug von seinem Fenster aus zu.',
      },
      {
        headline: 'Schweigen in den Arbeitervierteln',
        body: 'In Wedding und Neukölln blieb es still. Die Führer der Sozialdemokratie mahnen zur Besonnenheit und wollen den Boden der Verfassung nicht verlassen.',
      },
    ],
    illustration: 'tor',
    caption: 'Fackelzug am Brandenburger Tor, in der Nacht zum 31. Januar',
    note: 'In unserer Straße hat niemand gefeiert. Frau Pagel sagt, das geht vorüber wie ein Gewitter. Ich glaube es nicht. Wir müssen etwas tun, solange wir es noch können.',
    context:
      'Am 30. Januar 1933 ernannte Reichspräsident Paul von Hindenburg Adolf Hitler zum Reichskanzler. Die Nationalsozialisten nannten das „Machtergreifung“. Tatsächlich wurde ihm die Macht von konservativen Politikern übertragen, die glaubten, sie könnten ihn lenken. Das war ein schwerer Irrtum.',
    lexicon: ['reichskanzler', 'sa', 'machtuebernahme'],
    effects: { moral: -2 },
    moodText: 'Die Nachricht drückt auf die Stimmung der Gruppe.',
    event: {
      title: 'Die erste Zusammenkunft',
      scene: 'Deine Küche, spät am Abend. Die Vorhänge sind zugezogen.',
      speaker: '{g1}',
      speakerRole: 'Gefährte der ersten Stunde',
      portrait: { gender: 'm', face: 'kantig', headwear: 'schiebermuetze', hairTone: 'dunkel', glasses: false, clothing: 'arbeiterjacke' },
      text:
        'Vier Menschen sitzen um den Küchentisch. Auf dem Herd summt der Wasserkessel. {g1} legt die Zeitung auf den Tisch und tippt mit dem Finger auf das Bild. „Die sagen, in drei Monaten ist der Spuk vorbei. Aber ich sage dir, {name}, die gehen nicht wieder. Was machen wir?“ Alle sehen dich an.',
      choices: [
        {
          label: '„Wir handeln. Noch in dieser Woche.“',
          effects: { moral: 10, heatAll: 5 },
          result: 'Die Augen der anderen leuchten. Man verabredet sich für die nächsten Tage. Beim Gehen drückt dir {g1} fest die Hand. Aber im Treppenhaus hat jemand die Tür einen Spalt geöffnet.',
        },
        {
          label: '„Wir warten ab und beobachten. Vorsicht ist keine Feigheit.“',
          effects: { moral: 3, heatAll: -5 },
          result: 'Man nickt. Niemand ist ganz zufrieden, aber alle sind erleichtert. Die Gruppe wird sich nicht zu früh verraten.',
        },
        {
          label: '„Jeder gibt, was er entbehren kann. Ohne Geld geht es nicht.“',
          effects: { kasse: 15, moral: 2 },
          result: 'Auf dem Tisch liegen am Ende fünfzehn Reichsmark in Münzen und zerknitterten Scheinen. Es ist wenig, aber es ist ein Anfang.',
        },
      ],
    },
  },
  // Woche 2
  {
    calendar: { day: 22, month: 'Februar', weekday: 'Mittwoch' },
    intertitle: 'Februar 1933. Wer eine weiße Armbinde trägt, ist jetzt Polizei.',
    dateLabel: 'Woche vom 20. Februar 1933',
    paperDate: 'Donnerstag, den 23. Februar 1933',
    headline: 'SA und SS werden Hilfspolizei',
    subline: 'Minister Göring verstärkt die preußische Polizei um Zehntausende Männer. Kennzeichen ist eine weiße Armbinde mit der Aufschrift „Hilfspolizei“.',
    lead:
      'Der kommissarische preußische Innenminister Göring hat verfügt, dass Männer der SA, der SS und des Stahlhelms als Hilfspolizisten eingesetzt werden. Sie sollen die reguläre Polizei im „Kampf gegen die staatsfeindlichen Elemente“ unterstützen. Bereits in der vergangenen Woche hatte der Minister die Polizei angewiesen, gegen Feinde des Staates notfalls rücksichtslos von der Schusswaffe Gebrauch zu machen.',
    articles: [
      {
        headline: 'Weitere Blätter verboten',
        body: 'Aufgrund der Verordnung zum Schutze des deutschen Volkes vom 4. Februar sind erneut mehrere Zeitungen der Linken für einige Tage verboten worden. Versammlungen unter freiem Himmel müssen 48 Stunden vorher angemeldet werden und können jederzeit verboten werden.',
      },
      {
        headline: 'Der Wahlkampf beginnt',
        body: 'Zum 5. März sind Neuwahlen zum Reichstag angesetzt. Versammlungen der Sozialdemokraten und Kommunisten werden vielerorts gestört oder aufgelöst.',
      },
    ],
    illustration: 'armbinde',
    caption: 'Hilfspolizist mit weißer Armbinde',
    note: 'Jetzt sind sie Polizei. Dieselben Männer, die letzten Sommer in der Kneipe am Leopoldplatz Stühle geworfen haben, tragen nun eine Armbinde und dürfen Leute verhaften.',
    context:
      'Im Februar 1933 machte Hermann Göring in Preußen, zu dem auch Berlin gehörte, die Schlägertruppen der NSDAP zu Hilfspolizisten. Damit konnten SA-Männer nun ganz offiziell politische Gegner festnehmen. Wer sich gegen sie wehrte, hatte keinen Schutz mehr durch die Polizei.',
    lexicon: ['sa', 'ss', 'notverordnung'],
    effects: { moral: -3 },
    moodText: 'Die Straßen werden unsicherer.',
    event: {
      title: 'Die Hauswartsfrau',
      scene: 'Das Treppenhaus deines Mietshauses, am Vormittag.',
      speaker: 'Frau Pagel',
      speakerRole: 'Hauswartsfrau im Vorderhaus',
      portrait: { gender: 'w', face: 'rund', headwear: 'welle', hairTone: 'grau', glasses: true, clothing: 'kleid' },
      text:
        'Frau Pagel fegt die Treppe, als du nach Hause kommst. Sie hält inne und senkt die Stimme. „Gestern waren zwei Männer mit Armbinden hier. Sie haben gefragt, wer in Ihrer Wohnung ein und aus geht, {name}. Ich habe nichts gesagt. Noch nicht.“ Sie sieht dich lange an.',
      choices: [
        {
          label: 'Ihr fünf Reichsmark zustecken, damit sie schweigt',
          needsKasse: 5,
          effects: { kasse: -5, heatLeader: -10 },
          result: 'Frau Pagel steckt das Geld wortlos in die Schürzentasche. „Ich habe hier niemanden gesehen“, sagt sie und fegt weiter.',
        },
        {
          label: 'Sie ehrlich bitten, zu schweigen',
          check: { stat: 'empathie', min: 4 },
          effects: { moral: 4, heatLeader: -5 },
          result: 'Du sprichst lange mit ihr. Am Ende nimmt sie deine Hand. „Mein Mann war auch bei den Gewerkschaften. Von mir erfährt niemand etwas.“',
          failEffects: { heatLeader: 10 },
          failResult: 'Sie hört dir zu, aber ihr Blick bleibt kalt. „Ich will keinen Ärger im Haus“, sagt sie nur. Du weißt nicht, ob sie schweigen wird.',
        },
        {
          label: 'Die Papiere noch in der Nacht zu {g2} bringen',
          effects: { heatLeader: -8, moral: -2 },
          result: 'Um zwei Uhr nachts trägst du einen Karton durch die leeren Straßen. {g2} öffnet schweigend die Tür. Deine Wohnung ist nun sauber, doch die Angst schläft mit dir.',
        },
      ],
    },
  },
  // Woche 3
  {
    calendar: { day: 27, month: 'Februar', weekday: 'Montag' },
    intertitle: '27. Februar 1933, kurz nach neun Uhr abends. Der Reichstag brennt.',
    dateLabel: 'Woche vom 27. Februar 1933',
    paperDate: 'Dienstag, den 28. Februar 1933',
    headline: 'Der Reichstag in Flammen!',
    subline: 'Die Regierung spricht von einem kommunistischen Aufstandsversuch. Ein junger Holländer am Brandort festgenommen.',
    lead:
      'In der Nacht zum Dienstag ist das Reichstagsgebäude in Brand geraten. Der Plenarsaal ist völlig ausgebrannt, die gläserne Kuppel stand in hellen Flammen. Im Gebäude wurde der Holländer Marinus van der Lubbe festgenommen. Minister Göring erklärte noch in der Nacht, der Brand sei das Signal für einen kommunistischen Aufstand gewesen. In ganz Preußen sind seither zahlreiche kommunistische Funktionäre und Abgeordnete verhaftet worden. Unter den Festgenommenen sind auch der Herausgeber der „Weltbühne“, Carl von Ossietzky, und der Rechtsanwalt Hans Litten.',
    articles: [
      {
        headline: 'Verordnung zum Schutz von Volk und Staat',
        body: 'Der Herr Reichspräsident hat heute eine Notverordnung unterzeichnet. Die Freiheit der Person, die Freiheit der Meinung und der Presse, das Versammlungsrecht und das Briefgeheimnis sind bis auf weiteres außer Kraft gesetzt.',
      },
      {
        headline: 'Kommunistische Presse verboten',
        body: 'Sämtliche Zeitungen der KPD sind verboten. Auch die sozialdemokratische Presse in Preußen darf für zwei Wochen nicht erscheinen.',
      },
    ],
    illustration: 'reichstag',
    caption: 'Die brennende Kuppel des Reichstags',
    note: 'Wer das Feuer gelegt hat, weiß niemand genau. Aber schon am Morgen hatten sie Listen mit Namen und Adressen. Im Wedding holen sie die Leute aus den Betten.',
    context:
      'Am 27. Februar 1933 brannte das Reichstagsgebäude in Berlin. Die Regierung gab den Kommunisten die Schuld. Schon am nächsten Tag hob die „Reichstagsbrandverordnung“ die wichtigsten Grundrechte auf. Nun konnte die Polizei jeden ohne Gericht einsperren. Tausende wurden verhaftet.',
    lexicon: ['reichstag', 'notverordnung', 'schutzhaft', 'kpd'],
    effects: { moral: -6, flags: ['unterschlupf'] },
    moodText: 'Die Grundrechte sind aufgehoben. Ab jetzt suchen Verfolgte ein Versteck.',
    conditional: [
      {
        ideology: 'kommunistisch',
        effects: { heatLeader: 15 },
        text: 'Dein Name steht auf den Listen der Polizei. Du schläfst nicht mehr zu Hause.',
      },
      {
        ideology: 'sozialdemokratisch',
        effects: { heatLeader: 5 },
        text: 'Auch nach Sozialdemokraten wird nun gefragt.',
      },
    ],
    event: {
      title: 'Es klopft in der Nacht',
      scene: 'Deine Wohnung, gegen drei Uhr morgens. Draußen fährt ein Lastwagen vorbei.',
      speaker: 'Willi Harms',
      speakerRole: 'Nachbar aus dem Hinterhaus, Kommunist',
      portrait: { gender: 'm', face: 'schmal', headwear: 'kurz', hairTone: 'dunkel', glasses: false, clothing: 'arbeiterjacke' },
      text:
        'Jemand klopft leise, dreimal. Vor der Tür steht Willi Harms aus dem Hinterhaus, ohne Mantel, das Gesicht grau vor Kälte. „Sie haben meinen Bruder geholt, vor einer Stunde. Ich bin über die Dächer weg. {name}, ich weiß nicht, wohin. Nur eine Nacht, bitte.“ Unten auf der Straße hört man Stiefel.',
      choices: [
        {
          label: 'Ihn hereinlassen und verstecken',
          effects: { moral: 8, heatLeader: 15 },
          result: 'Du ziehst ihn in die Wohnung und schiebst den Riegel vor. Willi schläft in der Kammer hinter dem Kleiderschrank. Im Morgengrauen ist er fort. Auf dem Kissen liegt ein Zettel: „Danke. Ich vergesse das nie.“',
        },
        {
          label: 'Ihm Geld und einen Mantel geben',
          needsKasse: 10,
          effects: { kasse: -10, moral: 4 },
          result: 'Du drückst ihm deinen alten Mantel und zehn Reichsmark in die Hand. Er nickt stumm und verschwindet im Treppenhaus. Du hoffst, dass er es schafft.',
        },
        {
          label: 'Die Tür geschlossen halten',
          effects: { moral: -8, heatLeader: -5 },
          result: 'Du stehst reglos hinter der Tür, bis seine Schritte verklingen. Du sagst dir, dass du die Gruppe schützen musstest. Geschlafen hast du in dieser Nacht nicht mehr.',
        },
      ],
    },
  },
  // Woche 4
  {
    calendar: { day: 5, month: 'März', weekday: 'Sonntag' },
    intertitle: '5. März 1933. Zum letzten Mal treten bei einer Reichstagswahl mehrere Parteien an.',
    dateLabel: 'Woche vom 6. März 1933',
    paperDate: 'Montag, den 6. März 1933',
    headline: 'Reichstagswahl: 43,9 vom Hundert für die NSDAP',
    subline: 'Zusammen mit der Kampffront Schwarz-Weiß-Rot verfügt die Regierung über die Mehrheit im Reichstag.',
    lead:
      'Bei der gestrigen Reichstagswahl haben die Nationalsozialisten 43,9 vom Hundert der Stimmen erhalten. Die absolute Mehrheit haben sie damit verfehlt. Die Sozialdemokraten erreichten 18,3, die Kommunisten 12,3 und das Zentrum 11,2 vom Hundert. Die Wahlbeteiligung war außerordentlich hoch. Die Regierung spricht von einem Sieg der nationalen Erhebung.',
    articles: [
      {
        headline: 'Wo sind die Abgeordneten der KPD?',
        body: 'Die Kommunisten haben 81 Sitze errungen. Viele ihrer Abgeordneten sind jedoch in Haft oder geflohen. Ob sie ihre Mandate ausüben können, gilt als ausgeschlossen.',
      },
      {
        headline: 'Hakenkreuzfahnen auf den Rathäusern',
        body: 'In zahlreichen Städten hissten SA-Männer am Wahlabend die Fahnen der Partei auf Rathäusern und Amtsgebäuden. Die Polizei schritt nicht ein.',
      },
    ],
    illustration: 'urne',
    caption: 'Stimmabgabe in einem Berliner Wahllokal',
    note: 'Mehr als die Hälfte hat sie nicht gewählt, trotz allem. Trotz der Verbote, der Prügel, der Verhaftungen. Das darf man nicht vergessen.',
    context:
      'Die Wahl am 5. März 1933 war nicht mehr frei. Zeitungen der Gegner waren verboten, viele Kommunisten saßen im Gefängnis. Trotzdem erhielt die NSDAP keine eigene Mehrheit. Mehr als die Hälfte der Wählerinnen und Wähler stimmte für andere Parteien.',
    lexicon: ['reichstag', 'kpd', 'spd'],
    effects: { moral: -3 },
    moodText: 'Die Wahl ist verloren, aber nicht alle haben aufgegeben.',
    event: {
      title: 'Ein alter Kollege',
      scene: 'Vor dem Fabriktor, beim Schichtwechsel.',
      speaker: 'Rudi Lehmann',
      speakerRole: 'Früher Kollege, seit kurzem in der SA',
      portrait: { gender: 'm', face: 'oval', headwear: 'kurz', hairTone: 'hell', glasses: false, clothing: 'weste' },
      text:
        'Rudi Lehmann steht vor dir, in brauner Uniform. Ihr habt jahrelang zusammen gearbeitet. Er grinst verlegen. „Guck nicht so, {name}. Ich war zwei Jahre ohne Arbeit. Bei der SA gibt es Suppe, Stiefel und Kameraden. Was hat mir denn deine Partei gegeben?“',
      choices: [
        {
          label: 'Mit ihm reden, von Mensch zu Mensch',
          check: { stat: 'empathie', min: 4 },
          effects: { supporters: 2, moral: 5 },
          result: 'Ihr redet lange. Rudi wird still. „Ich habe gesehen, was sie mit dem alten Grünberg gemacht haben“, sagt er schließlich. „Das war nicht recht.“ Zwei Wochen später schickt er seinen Schwager zu euch.',
          failEffects: { heatLeader: 12 },
          failResult: 'Rudi wird wütend. „Pass bloß auf, was du sagst! Ich weiß, wo du wohnst.“ Er dreht sich um und geht. Du hast ihm zu viel verraten.',
        },
        {
          label: 'Ihm mit Argumenten die Wahrheit zeigen',
          check: { stat: 'propaganda', min: 4 },
          effects: { supporters: 2, moral: 4 },
          result: 'Du zählst ihm auf, was die Nationalsozialisten versprochen und was sie getan haben. Rudi hat keine Antwort. Er nimmt heimlich ein Flugblatt mit.',
          failEffects: { heatLeader: 10, moral: -2 },
          failResult: 'Rudi lacht dich aus. „Ihr mit euren Reden. Die Zeit der Reden ist vorbei.“ Du hast dich zu weit vorgewagt.',
        },
        {
          label: 'Wortlos weitergehen',
          effects: { moral: -2 },
          result: 'Du gehst an ihm vorbei. Er ruft dir etwas hinterher, aber du drehst dich nicht um. Wie viele Rudis gibt es in dieser Stadt?',
        },
      ],
    },
  },
  // Woche 5
  {
    calendar: { day: 23, month: 'März', weekday: 'Donnerstag' },
    intertitle: '23. März 1933. Mit einem einzigen Gesetz entmachtet sich das Parlament selbst.',
    dateLabel: 'Woche vom 20. März 1933',
    paperDate: 'Freitag, den 24. März 1933',
    headline: 'Reichstag nimmt Ermächtigungsgesetz an',
    subline: 'Mit 444 gegen 94 Stimmen. Die Regierung darf nun Gesetze ohne das Parlament erlassen.',
    lead:
      'In der Krolloper, dem Ausweichquartier des Reichstags, haben die Abgeordneten gestern dem „Gesetz zur Behebung der Not von Volk und Reich“ zugestimmt. Die Reichsregierung kann damit vier Jahre lang Gesetze beschließen, auch wenn sie von der Verfassung abweichen. Allein die Sozialdemokraten stimmten dagegen. Die Kommunisten waren nicht anwesend. Vor dem Saal standen SA und SS in dichten Reihen. Der Abgeordnete Otto Wels erklärte für die SPD: „Freiheit und Leben kann man uns nehmen, die Ehre nicht.“',
    articles: [
      {
        headline: 'Konzentrationslager bei Dachau',
        body: 'Der kommissarische Polizeipräsident von München, Himmler, gibt bekannt, dass bei Dachau ein Lager für politische Schutzhäftlinge errichtet worden ist. Am 22. März trafen die ersten Gefangenen ein.',
      },
      {
        headline: 'Lager auch in Oranienburg',
        body: 'Nördlich von Berlin hat die SA in einer stillgelegten Brauerei in Oranienburg ein Lager eingerichtet. Dorthin werden Verhaftete aus der Reichshauptstadt gebracht.',
      },
      {
        headline: 'Feierlichkeiten in Potsdam',
        body: 'Am Dienstag wurde der neue Reichstag in der Garnisonkirche zu Potsdam feierlich eröffnet. Der Reichskanzler verneigte sich vor dem Reichspräsidenten.',
      },
    ],
    illustration: 'gesetz',
    caption: 'Die Abstimmung in der Krolloper',
    note: 'Es steht in der Zeitung. Jeder kann es lesen. Sie nennen es Schutzhaft, aber niemand weiß, vor wem man da geschützt wird, und niemand weiß, wie lange sie dauert.',
    context:
      'Mit dem Ermächtigungsgesetz vom 23. März 1933 gab der Reichstag seine Macht ab. Hitler konnte nun allein Gesetze machen. Nur die SPD stimmte mit Nein. Zur selben Zeit entstanden die ersten Konzentrationslager, zum Beispiel in Dachau und Oranienburg. Dort wurden politische Gegner ohne Gerichtsurteil eingesperrt.',
    lexicon: ['ermaechtigungsgesetz', 'kz', 'schutzhaft', 'spd'],
    effects: { moral: -6 },
    moodText: 'Das Parlament hat sich selbst entmachtet.',
    conditional: [
      {
        ideology: 'sozialdemokratisch',
        effects: { moral: 5 },
        text: 'Die Rede von Otto Wels geht von Hand zu Hand. Sie gibt dir neue Kraft.',
      },
    ],
    event: {
      title: 'Eine Mutter bittet um Hilfe',
      scene: 'Die Wohnung der Familie Brandt in Neukölln. Auf dem Tisch steht kalter Kaffee.',
      speaker: 'Frau Brandt',
      speakerRole: 'Mutter eines Verhafteten',
      portrait: { gender: 'w', face: 'schmal', headwear: 'glocke', hairTone: 'dunkel', glasses: false, clothing: 'trenchcoat' },
      text:
        'Frau Brandt hält ein Blatt Papier in den zitternden Händen. „Mein Junge ist neunzehn. Sie haben ihn aus der Werkstatt geholt, und jetzt heißt es, er ist in Oranienburg. Ich darf ihm nicht einmal schreiben. {name}, Sie kennen sich doch aus mit Ämtern und Briefen. Was soll ich nur tun?“',
      choices: [
        {
          label: 'Mit ihr ein Gesuch an das Polizeipräsidium schreiben',
          check: { stat: 'bildung', min: 4 },
          effects: { moral: 6, supporters: 1 },
          result: 'Ihr setzt ein höfliches, genaues Schreiben auf, mit allen Daten und Namen. Drei Wochen später darf sie ein Paket mit Wäsche schicken. Es ist nicht viel. Aber es ist ein Lebenszeichen.',
          failEffects: { heatLeader: 12, moral: -2 },
          failResult: 'Das Schreiben wird abgelehnt. Schlimmer noch: Auf dem Präsidium hat man nach deinem Namen gefragt, weil du es unterzeichnet hast.',
        },
        {
          label: 'Der Familie Geld aus der Kasse geben',
          needsKasse: 15,
          effects: { kasse: -15, moral: 8, supporters: 1 },
          result: 'Frau Brandt weint, als du ihr die fünfzehn Reichsmark gibst. Ohne den Lohn ihres Sohnes hätte sie die Miete nicht zahlen können. Die ganze Straße erfährt davon, dass es noch Anstand gibt.',
        },
        {
          label: '„Wir können nichts tun. Es tut mir leid.“',
          effects: { moral: -6 },
          result: 'Frau Brandt nickt stumm. An der Tür dreht sie sich noch einmal um, sagt aber nichts. Du fühlst dich elend.',
        },
      ],
    },
  },
  // Woche 6
  {
    calendar: { day: 1, month: 'April', weekday: 'Sonnabend' },
    intertitle: '1. April 1933. Vor den Läden jüdischer Nachbarn stehen Männer in Uniform.',
    dateLabel: 'Woche vom 27. März 1933',
    paperDate: 'Sonnabend, den 1. April 1933',
    headline: 'Boykott gegen jüdische Geschäfte',
    subline: 'Vor Läden, Arztpraxen und Kanzleien stehen seit zehn Uhr Posten der SA.',
    lead:
      'Auf Anordnung der Parteileitung hat heute um zehn Uhr im ganzen Reich ein Boykott jüdischer Geschäfte begonnen. Vor den Eingängen stehen SA-Männer mit Schildern. Auf den Plakaten heißt es: „Deutsche! Wehrt euch! Kauft nicht bei Juden!“ An viele Schaufenster wurden Parolen geschmiert. Die Kundschaft wird am Betreten der Läden gehindert.',
    articles: [
      {
        headline: 'Stille im Scheunenviertel',
        body: 'In der Grenadierstraße und der Dragonerstraße blieben viele Läden geschlossen. Die Inhaber wagten nicht, ihre Rollläden zu öffnen.',
      },
      {
        headline: 'Einige kauften dennoch',
        body: 'Vereinzelt betraten Bürger dennoch die boykottierten Geschäfte. Sie wurden von den Posten beschimpft und fotografiert.',
      },
    ],
    illustration: 'laden',
    caption: 'SA-Posten vor einem Geschäft in Berlin',
    note: 'Herr Rosenthal hat meinem Vater im Winter die Rechnung gestundet, als wir kein Geld hatten. Heute steht ein Junge in Uniform vor seiner Tür, kaum älter als sechzehn.',
    context:
      'Am 1. April 1933 riefen die Nationalsozialisten zum Boykott jüdischer Geschäfte, Arztpraxen und Anwaltskanzleien auf. SA-Männer stellten sich vor die Eingänge und bedrohten die Kundschaft. Es war der Beginn einer Verfolgung, die immer schlimmer wurde. Jüdische Deutsche waren Nachbarn, Kollegen und Freunde, wie alle anderen auch.',
    lexicon: ['boykott', 'sa', 'antisemitismus'],
    effects: { moral: -4 },
    moodText: 'Jüdische Nachbarn werden offen ausgegrenzt, und kaum jemand widerspricht.',
    event: {
      title: 'Vor dem Laden von Herrn Rosenthal',
      scene: 'Ein Kolonialwarenladen in der Grenadierstraße, Sonnabend, elf Uhr vormittags.',
      speaker: 'Herr Rosenthal',
      speakerRole: 'Kaufmann im Scheunenviertel',
      portrait: { gender: 'm', face: 'oval', headwear: 'fedora', hairTone: 'grau', glasses: true, clothing: 'weste' },
      text:
        'Vor dem Laden steht ein SA-Posten mit einem Schild. Hinter der Scheibe siehst du Herrn Rosenthal. Er steht allein zwischen seinen Regalen und rückt Konservendosen gerade, die schon gerade stehen. Als er dich erkennt, hebt er kurz die Hand, dann lässt er sie sinken. Der Posten sieht dich herausfordernd an.',
      choices: [
        {
          label: 'Am Posten vorbei in den Laden gehen und einkaufen',
          effects: { moral: 10, heatLeader: 10, supporters: 1, kasse: -2 },
          result: 'Der Posten brüllt dich an und schreibt sich etwas auf. Du gehst trotzdem hinein und kaufst Zucker und Kaffee. Herr Rosenthal kann kaum sprechen. Hinter dir betritt eine alte Frau den Laden, dann noch eine.',
        },
        {
          label: 'Am Abend über den Hof an die Hintertür klopfen',
          effects: { moral: 5, kasse: -2 },
          result: 'Nach Einbruch der Dunkelheit klopfst du an die Hintertür. Herr Rosenthal verkauft dir, was du brauchst, und hält deine Hand einen Augenblick zu lang. „Es gibt noch Menschen“, sagt er leise.',
        },
        {
          label: 'Weitergehen, als hättest du nichts gesehen',
          effects: { moral: -8 },
          result: 'Du gehst weiter. Drei Häuser später drehst du dich um. Herr Rosenthal steht noch immer hinter der Scheibe. Du wirst diesen Anblick lange nicht vergessen.',
        },
      ],
    },
  },
  // Woche 7
  {
    calendar: { day: 7, month: 'April', weekday: 'Freitag' },
    intertitle: 'April 1933. Lehrerinnen und Lehrer verlieren ihre Stelle, weil sie Juden sind oder die falsche Meinung haben.',
    dateLabel: 'Woche vom 3. April 1933',
    paperDate: 'Sonnabend, den 8. April 1933',
    headline: 'Gesetz zur Wiederherstellung des Berufsbeamtentums',
    subline: 'Beamte „nicht arischer Abstammung“ und politisch unzuverlässige Beamte werden aus dem Dienst entfernt.',
    lead:
      'Die Reichsregierung hat ein Gesetz beschlossen, nach dem Beamte, die „nicht arischer Abstammung“ sind, in den Ruhestand zu versetzen sind. Entlassen werden auch Beamte, die nach ihrer bisherigen politischen Betätigung nicht die Gewähr dafür bieten, jederzeit rückhaltlos für den nationalen Staat einzutreten. Betroffen sind Richter, Verwaltungsbeamte, Professoren und Lehrer.',
    articles: [
      {
        headline: 'Auch Schulen betroffen',
        body: 'Auch an den Berliner Schulen sollen sämtliche Lehrkräfte bald Fragebögen über ihre Abstammung und ihre frühere Parteizugehörigkeit ausfüllen.',
      },
      {
        headline: 'Säuberung der Universitäten',
        body: 'An der Friedrich-Wilhelms-Universität wurden mehrere Professoren beurlaubt. Studenten in SA-Uniform stören Vorlesungen.',
      },
    ],
    illustration: 'schule',
    caption: 'Eine Berliner Volksschule',
    note: 'Fräulein Doktor Weiß hat zwanzig Jahre an der Schule in der Rütlistraße unterrichtet. Gestern hat man sie nach Hause geschickt. Die Kinder haben am Fenster gestanden und geweint.',
    context:
      'Mit diesem Gesetz vom 7. April 1933 wurden jüdische Beamte und politische Gegner aus dem Staatsdienst entfernt. Viele Lehrerinnen und Lehrer verloren ihre Arbeit. Das war ein Teil der „Gleichschaltung“: Alles im Staat sollte nach dem Willen der Nationalsozialisten funktionieren.',
    lexicon: ['gleichschaltung', 'antisemitismus'],
    effects: { moral: -3 },
    moodText: 'Eine Welle der Entlassungen geht durch die Stadt.',
    conditional: [
      {
        profession: 'lehrer',
        effects: { heatLeader: 10 },
        text: 'Auch du musst den Fragebogen ausfüllen. Der Rektor sieht dich seither prüfend an.',
      },
    ],
    event: {
      title: 'Die entlassene Lehrerin',
      scene: 'Eine kleine Wohnung in Neukölln. Überall stehen Bücherkisten.',
      speaker: 'Dr. Else Weiß',
      speakerRole: 'Lehrerin, seit gestern entlassen',
      portrait: { gender: 'w', face: 'oval', headwear: 'kurz', hairTone: 'grau', glasses: true, clothing: 'weste' },
      text:
        'Dr. Weiß packt ihre Bücher in Kisten. Sie wirkt ruhig, fast zu ruhig. „Zwanzig Jahre, {name}. Und nun sagt man mir, ich sei eine Gefahr für die Jugend.“ Sie legt ein Buch beiseite. „Ich habe jetzt viel Zeit. Und ich habe eine Schreibmaschine. Vielleicht kann ich euch nützlich sein.“',
      choices: [
        {
          label: '„Schreiben Sie unsere Flugblätter. Niemand schreibt so klar wie Sie.“',
          effects: { items: { flugblaetter: 2 }, moral: 5, heatLeader: 5 },
          result: 'Schon am nächsten Abend bringt sie zwei Bündel sauber getippter Flugschriften. Die Sätze sind einfach und klar. Selbst ein Kind kann verstehen, was darin steht.',
        },
        {
          label: 'Unter den Unterstützern Geld für sie sammeln',
          needsKasse: 10,
          effects: { kasse: -10, moral: 6, supporters: 2 },
          result: 'Ihr bringt ihr zehn Reichsmark und einen Korb mit Lebensmitteln. Dr. Weiß erzählt ihren früheren Kollegen davon. Zwei von ihnen möchten euch künftig unterstützen.',
        },
        {
          label: '„Sie haben schon genug verloren. Bleiben Sie außen vor.“',
          effects: { moral: 1 },
          result: 'Sie lächelt traurig. „Vielleicht haben Sie recht.“ Als du gehst, sitzt sie am Fenster und sieht auf die Straße hinunter.',
        },
      ],
    },
  },
  // Woche 8
  {
    calendar: { day: 26, month: 'April', weekday: 'Mittwoch' },
    intertitle: '26. April 1933. Die Geheime Staatspolizei nimmt ihre Arbeit auf. Ihre Fenster bleiben die ganze Nacht erleuchtet.',
    dateLabel: 'Woche vom 24. April 1933',
    paperDate: 'Donnerstag, den 27. April 1933',
    headline: 'Geheimes Staatspolizeiamt errichtet',
    subline: 'Neue politische Polizei für ganz Preußen. Sie soll „staatsfeindliche Bestrebungen“ erforschen und bekämpfen.',
    lead:
      'Durch Gesetz vom 26. April ist in Preußen das Geheime Staatspolizeiamt geschaffen worden. Die neue Behörde untersteht dem preußischen Innenminister Göring. Sie soll alle staatsgefährlichen politischen Bestrebungen im gesamten Staatsgebiet erforschen. Ihre Beamten dürfen Verdächtige in Schutzhaft nehmen, ohne dass ein Richter darüber entscheidet.',
    articles: [
      {
        headline: 'Der 1. Mai wird Feiertag',
        body: 'Der 1. Mai wird als „Feiertag der nationalen Arbeit“ begangen. Auf dem Tempelhofer Feld wird eine gewaltige Kundgebung vorbereitet. Die Gewerkschaften haben zur Teilnahme aufgerufen.',
      },
      {
        headline: 'Anzeigen aus der Bevölkerung',
        body: 'Bei den Polizeirevieren gehen täglich zahlreiche Anzeigen gegen Nachbarn und Arbeitskollegen ein, heißt es aus dem Präsidium.',
      },
    ],
    illustration: 'amt',
    caption: 'Ein Amtsgebäude in der Reichshauptstadt',
    note: 'Jetzt haben sie eine eigene Polizei nur für Leute wie uns. Ab heute trauen wir niemandem, den wir nicht seit Jahren kennen. Treffen nur noch zu zweit.',
    context:
      'Die Geheime Staatspolizei, kurz Gestapo, wurde im April 1933 gegründet. Sie verfolgte alle, die gegen die Nationalsozialisten waren. Oft bekam sie ihre Hinweise von Nachbarn oder Kollegen, die andere anzeigten. Niemand konnte sicher sein, wer ihn beobachtete.',
    lexicon: ['gestapo', 'spitzel'],
    effects: { moral: -3 },
    moodText: 'Ab jetzt ist jeder Einsatz gefährlicher.',
    event: {
      title: 'Der Neue',
      scene: 'Das Hinterzimmer einer Kneipe am Leopoldplatz.',
      speaker: 'Herr Kaminski',
      speakerRole: 'Möchte der Gruppe beitreten',
      portrait: { gender: 'm', face: 'rund', headwear: 'fedora', hairTone: 'dunkel', glasses: false, clothing: 'trenchcoat' },
      text:
        'Ein Mann im guten Mantel setzt sich zu dir. Er nennt sich Kaminski und spricht leise und freundlich. „Ich weiß, was ihr macht, {name}. Die Flugblätter, die Parolen. Ich will helfen. Ich habe Geld und kenne Leute bei der Post.“ Er lächelt. Woher weiß er so viel?',
      choices: [
        {
          label: 'Ihm geschickte Fragen stellen, bevor du ihm traust',
          check: { stat: 'bildung', min: 4 },
          effects: { moral: 4 },
          result: 'Du fragst nach Straßen, Namen, alten Versammlungen. Seine Antworten passen nicht zusammen. Du bedankst dich höflich und gehst. Noch in derselben Nacht verlegt die Gruppe ihren Treffpunkt.',
          failEffects: { heatAll: 15 },
          failResult: 'Seine Antworten klingen überzeugend. Du erzählst ihm mehr, als du solltest. Erst Tage später merkt {g1}, dass ein Mann im guten Mantel vor eurem Haus auf und ab geht.',
        },
        {
          label: 'Das Geld nehmen und ihn aufnehmen',
          effects: { kasse: 25, supporters: 2, heatAll: 20 },
          result: 'Kaminski gibt dir fünfundzwanzig Reichsmark. Er kommt zu zwei Treffen, dann bleibt er aus. Seitdem stehen immer wieder Männer in Zivil an den Straßenecken. Ihr hättet es wissen müssen.',
        },
        {
          label: 'Ihn sofort abweisen',
          effects: { moral: -1 },
          result: '„Ich weiß nicht, wovon Sie reden“, sagst du und gehst. Vielleicht war er ehrlich. Vielleicht nicht. Heute kann man es nicht mehr wissen, und genau das ist das Schlimme.',
        },
      ],
    },
  },
  // Woche 9
  {
    calendar: { day: 2, month: 'Mai', weekday: 'Dienstag' },
    intertitle: '2. Mai 1933, zehn Uhr morgens. SA-Männer besetzen die Häuser der Gewerkschaften.',
    dateLabel: 'Woche vom 1. Mai 1933',
    paperDate: 'Mittwoch, den 3. Mai 1933',
    headline: 'Gewerkschaftshäuser im ganzen Reich besetzt',
    subline: 'Einen Tag nach dem Feiertag der Arbeit übernehmen SA und SS die Freien Gewerkschaften.',
    lead:
      'Am gestrigen Dienstag um zehn Uhr haben Abteilungen der SA und SS im ganzen Reich die Häuser der Freien Gewerkschaften besetzt. Zahlreiche Gewerkschaftsführer wurden in Schutzhaft genommen. Das Vermögen und die Kassen der Verbände sind beschlagnahmt. Die Leitung übernimmt ein „Aktionskomitee zum Schutz der deutschen Arbeit“ unter Dr. Robert Ley.',
    articles: [
      {
        headline: 'Eine Million am Tempelhofer Feld',
        body: 'Am Vortag hatten auf dem Tempelhofer Feld über eine Million Menschen der Rede des Reichskanzlers zum Feiertag der nationalen Arbeit beigewohnt.',
      },
      {
        headline: 'Mitgliederlisten beschlagnahmt',
        body: 'In den Gewerkschaftshäusern wurden umfangreiche Akten und Mitgliederverzeichnisse sichergestellt.',
      },
    ],
    illustration: 'fabrik',
    caption: 'Fabrikschornsteine im Norden Berlins',
    note: 'Am Montag haben sie mit den Arbeitern gefeiert, am Dienstag haben sie ihnen die Gewerkschaft weggenommen. Die Kollegen in der Fabrik reden kaum noch miteinander.',
    context:
      'Am 1. Mai 1933 feierten die Nationalsozialisten den „Tag der nationalen Arbeit“. Schon am nächsten Tag besetzten sie alle Gewerkschaftshäuser. Die Gewerkschaften hatten sich jahrzehntelang für bessere Löhne und Arbeitszeiten eingesetzt. Nun gab es niemanden mehr, der die Arbeiter vertrat.',
    lexicon: ['gewerkschaft', 'gleichschaltung', 'schutzhaft'],
    effects: { moral: -4 },
    moodText: 'Die letzte große Organisation der Arbeiter ist zerschlagen.',
    conditional: [
      {
        profession: 'arbeiter',
        effects: { supporters: 2 },
        text: 'Deine Kollegen sind verbittert. Einige fragen dich heimlich, ob man etwas tun kann.',
      },
    ],
    event: {
      title: 'Die Mitgliederlisten',
      scene: 'Ein Treppenhaus in Wedding. Es riecht nach Bohnerwachs.',
      speaker: 'Paul Sommer',
      speakerRole: 'Sekretär der Metallarbeiter',
      portrait: { gender: 'm', face: 'kantig', headwear: 'schiebermuetze', hairTone: 'grau', glasses: true, clothing: 'weste' },
      text:
        'Paul Sommer drückt dir einen schweren Karton in die Arme. „Das sind die Listen unserer Ortsgruppe. Dreihundert Namen, mit Adressen. Die SA hat sie im Büro nicht gefunden, weil ich sie am Freitag mitgenommen habe. Wenn sie die finden, holen sie jeden einzelnen. {name}, was machen wir damit?“',
      choices: [
        {
          label: 'Die Listen noch heute Nacht im Ofen verbrennen',
          effects: { moral: 6, heatLeader: 8 },
          result: 'Blatt für Blatt verbrennst du die Namen im Küchenofen. Es dauert bis zum Morgen. Dreihundert Menschen werden nie erfahren, dass du sie heute Nacht geschützt hast.',
        },
        {
          label: 'Die Listen verstecken. Die Namen sind wertvoll für später.',
          effects: { supporters: 4, heatAll: 15 },
          result: 'Ihr versteckt den Karton hinter einer losen Wand im Keller. Über die Listen findet ihr neue Helfer. Doch jeder weitere Tag mit diesen Papieren im Haus ist eine Gefahr für alle.',
        },
        {
          label: '„Das ist zu gefährlich. Nehmen Sie das wieder mit.“',
          effects: { moral: -5 },
          result: 'Paul Sommer sieht dich enttäuscht an und nimmt den Karton zurück. Du hörst nie wieder von ihm.',
        },
      ],
    },
  },
  // Woche 10
  {
    calendar: { day: 10, month: 'Mai', weekday: 'Mittwoch' },
    intertitle: '10. Mai 1933, Opernplatz. Es regnet. Und trotzdem brennen die Bücher.',
    dateLabel: 'Woche vom 8. Mai 1933',
    paperDate: 'Donnerstag, den 11. Mai 1933',
    headline: 'Verbrennung „undeutschen Schrifttums“ auf dem Opernplatz',
    subline: 'Studenten werfen zwanzigtausend Bücher in die Flammen. Reichsminister Dr. Goebbels spricht um Mitternacht.',
    lead:
      'Gestern Abend zogen Studenten mit Fackeln von der Universität zum Opernplatz. Dort warfen sie unter lauten „Feuersprüchen“ Bücher auf einen großen Scheiterhaufen. Verbrannt wurden die Werke von Heinrich Mann, Erich Kästner, Kurt Tucholsky, Sigmund Freud, Karl Marx und vielen anderen. Reichsminister Dr. Goebbels erklärte das „Zeitalter eines überspitzten jüdischen Intellektualismus“ für beendet.',
    articles: [
      {
        headline: 'Auch in anderen Städten',
        body: 'In München, Frankfurt, Breslau und zahlreichen weiteren Universitätsstädten fanden ähnliche Kundgebungen statt.',
      },
      {
        headline: 'Büchereien werden durchsucht',
        body: 'Die Leihbüchereien der Stadt haben Listen erhalten, welche Werke aus den Regalen zu entfernen sind.',
      },
    ],
    illustration: 'buecher',
    caption: 'Der Scheiterhaufen auf dem Opernplatz',
    note: 'Man sagt, Erich Kästner, der „Emil und die Detektive“ geschrieben hat, stand selbst in der Menge und sah zu, wie seine Bücher brannten. Es hat die ganze Nacht geregnet, und trotzdem hat es gebrannt.',
    context:
      'Am 10. Mai 1933 verbrannten Studenten auf dem Berliner Opernplatz, dem heutigen Bebelplatz, Tausende Bücher. Es waren Werke von Schriftstellern, die den Nationalsozialisten nicht passten, darunter Erich Kästner. Heute erinnert dort ein Denkmal unter dem Pflaster an die Bücherverbrennung: eine leere Bibliothek.',
    lexicon: ['buecherverbrennung', 'zensur'],
    effects: { moral: -4 },
    moodText: 'Die Gedanken selbst sollen verboten werden.',
    conditional: [
      {
        profession: 'journalist',
        effects: { heatLeader: 6 },
        text: 'Auch die Zeitung, für die du geschrieben hast, steht auf einer Liste.',
      },
    ],
    event: {
      title: 'Die Bücher der Volksbücherei',
      scene: 'Die Hintertür einer Volksbücherei in Kreuzberg, kurz vor Mitternacht.',
      speaker: 'Hedwig Albrecht',
      speakerRole: 'Bibliothekarin',
      portrait: { gender: 'w', face: 'oval', headwear: 'zoepfe', hairTone: 'hell', glasses: true, clothing: 'kleid' },
      text:
        'Die junge Bibliothekarin hat Tränen in den Augen. „Morgen früh holen sie die Bücher ab. Kästner, Tucholsky, Heine, alles. Ich habe den Schlüssel zum Hinterausgang. Wenn wir heute Nacht einen Handwagen bekommen, können wir wenigstens einige retten, {name}.“',
      choices: [
        {
          label: 'Mit dem Handwagen die Bücher heimlich fortschaffen',
          check: { stat: 'heimlichkeit', min: 4 },
          effects: { moral: 12, supporters: 1 },
          result: 'Dreimal fahrt ihr mit dem Handwagen durch die dunklen Straßen. Zweihundert Bücher liegen nun in Kellern und auf Dachböden. Eines Tages wird man sie wieder lesen dürfen.',
          failEffects: { moral: 5, heatLeader: 15 },
          failResult: 'Bei der dritten Fahrt ruft euch ein Wachmann an. Ihr lasst den Wagen stehen und rennt. Hundert Bücher sind gerettet, aber der Wachmann hat dein Gesicht gesehen.',
        },
        {
          label: 'Eine Flugschrift über die Bücherverbrennung verfassen',
          check: { stat: 'propaganda', min: 4 },
          effects: { moral: 8, items: { flugblaetter: 1 } },
          result: 'Ihr schreibt die ganze Nacht. Am Ende steht ein Satz von Heinrich Heine über dem Blatt: „Dort, wo man Bücher verbrennt, verbrennt man auch am Ende Menschen.“',
          failEffects: { moral: 2 },
          failResult: 'Die Worte wollen nicht kommen. Was ihr schreibt, klingt hilflos gegen das, was geschehen ist. Ihr zerreißt das Blatt.',
        },
        {
          label: 'Ihr raten, den Schlüssel abzugeben und zu schweigen',
          effects: { moral: -4 },
          result: 'Die Bibliothekarin sieht dich lange an. Dann nickt sie und schließt die Tür. Am Morgen fährt ein Lastwagen vor.',
        },
      ],
    },
  },
]

/** Beide Kapitel hintereinander: Wochen 0 bis 9 sind 1933, 10 bis 17 sind 1936 bis 1938 */
export const WEEKS: WeekData[] = [...WEEKS_1933, ...WEEKS_1936]

export const TOTAL_WEEKS = WEEKS.length
