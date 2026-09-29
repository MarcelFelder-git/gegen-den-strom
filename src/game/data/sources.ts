import { L, type Txt } from '../text'

/**
 * Eine echte Quelle pro Woche, mit einer kleinen Aufgabe.
 * Alle Zitate sind im Wortlaut geprüft, Kürzungen sind mit […] markiert.
 * Die Rechtschreibung der Quellen ist die von damals („daß“).
 * Der Quelltext ist in beiden Stufen gleich, Frage und Erklärung nicht:
 * In der schweren Stufe sind die falschen Antworten näher an der richtigen.
 */
export interface WeekSource {
  kind: string
  title: string
  origin: Txt
  text: string
  question: Txt
  options: Txt[]
  answer: number
  explain: Txt
}

export const SOURCES: WeekSource[] = [
  // 1933
  {
    kind: 'Aufruf',
    title: 'Der „Dringende Appell“',
    origin: L(
      'Ein Aufruf vom Juni 1932. Im Februar 1933 hing er noch einmal als Plakat. Unterschrieben haben unter anderen Käthe Kollwitz, Albert Einstein und Heinrich Mann.',
      'Aufruf vom Juni 1932, im Februar 1933 erneut als Plakat veröffentlicht. Unterschrieben unter anderem von Käthe Kollwitz, Albert Einstein und Heinrich Mann.',
    ),
    text: '„Die Vernichtung aller persönlichen und politischen Freiheit in Deutschland steht unmittelbar bevor, wenn es nicht in letzter Minute gelingt, unbeschadet von Prinzipiengegensätzen alle Kräfte zusammenzufassen, die in der Ablehnung des Faschismus einig sind.“',
    question: L('Wovor warnen die Menschen, die unterschrieben haben?', 'Was fordern die Unterzeichner, um die drohende Gefahr abzuwenden?'),
    options: [
      L('Vor dem Ende aller Freiheit in Deutschland', 'Dass alle Gegner des Faschismus trotz ihrer Streitigkeiten zusammenarbeiten'),
      L('Vor zu hohen Steuern für Künstler', 'Dass SPD und KPD sich zu einer einzigen Partei vereinigen'),
      L('Vor einem Streik der Straßenbahner', 'Dass der Reichspräsident die NSDAP verbietet'),
    ],
    answer: 0,
    explain: L(
      'Sie wollten, dass SPD und KPD sich gemeinsam gegen die Nazis stellen. Das gelang nicht. Käthe Kollwitz und Heinrich Mann mussten wegen ihrer Unterschrift im Februar 1933 die Akademie der Künste verlassen.',
      '„Unbeschadet von Prinzipiengegensätzen“ heißt: trotz aller Unterschiede. Gemeint war vor allem ein Bündnis von SPD und KPD, die sich bis dahin erbittert bekämpft hatten. Es kam nicht zustande. Käthe Kollwitz und Heinrich Mann mussten wegen ihrer Unterschrift im Februar 1933 die Akademie der Künste verlassen.',
    ),
  },
  {
    kind: 'Verordnung',
    title: 'Verordnung zum Schutze des Deutschen Volkes',
    origin: L('Vom Reichspräsidenten erlassen am 4. Februar 1933, § 1', 'Erlassen vom Reichspräsidenten am 4. Februar 1933, § 1'),
    text: '„Öffentliche politische Versammlungen sowie alle Versammlungen und Aufzüge unter freiem Himmel sind spätestens achtundvierzig Stunden vorher unter Angabe des Ortes, der Zeit und des Verhandlungsgegenstandes der Ortspolizeibehörde anzumelden.“',
    question: L('Was verlangt diese Verordnung?', 'Warum war diese scheinbar harmlose Regel für die Gegner der Regierung gefährlich?'),
    options: [
      L('Versammlungen müssen zwei Tage vorher bei der Polizei angemeldet werden', 'Die Polizei erfuhr vorher Ort, Zeit und Thema und konnte die Versammlung verbieten'),
      L('Versammlungen sind in Zukunft immer erlaubt', 'Versammlungen unter freiem Himmel waren ab sofort ganz verboten'),
      L('Nur Sportvereine dürfen sich noch treffen', 'Wer eine Versammlung anmeldete, wurde automatisch verhaftet'),
    ],
    answer: 0,
    explain: L(
      'Die Polizei konnte angemeldete Versammlungen einfach verbieten. So wurden vor der Wahl im März vor allem die Treffen von SPD und KPD verhindert.',
      'Die Anmeldepflicht klingt nach Ordnung. Tatsächlich gab sie der Polizei die Mittel, Versammlungen der Gegner zu verbieten oder aufzulösen. Vor der Wahl im März 1933 traf das vor allem SPD und KPD.',
    ),
  },
  {
    kind: 'Verordnung',
    title: 'Die Reichstagsbrandverordnung',
    origin: L('Verordnung des Reichspräsidenten vom 28. Februar 1933, § 1 (gekürzt)', 'Verordnung des Reichspräsidenten zum Schutz von Volk und Staat, 28. Februar 1933, § 1 (gekürzt)'),
    text: '„Die Artikel 114, 115, 117, 118, 123, 124 und 153 der Verfassung des Deutschen Reichs werden bis auf weiteres außer Kraft gesetzt. Es sind daher Beschränkungen der persönlichen Freiheit, des Rechts der freien Meinungsäußerung, einschließlich der Pressefreiheit, des Vereins- und Versammlungsrechts, Eingriffe in das Brief-, Post-, Telegraphen- und Fernsprechgeheimnis […] auch außerhalb der sonst hierfür bestimmten gesetzlichen Grenzen zulässig.“',
    question: L('Welche Rechte verlieren die Menschen durch diese Verordnung?', 'Was bedeutet „bis auf weiteres außer Kraft gesetzt“ für die Grundrechte?'),
    options: [
      L('Meinungsfreiheit, Pressefreiheit und das Briefgeheimnis', 'Sie gelten nicht mehr, und niemand legt fest, wann sie zurückkommen'),
      L('Das Recht, in den Urlaub zu fahren', 'Sie gelten nur noch für Mitglieder der Regierungsparteien'),
      L('Das Wahlrecht für Frauen', 'Sie gelten weiter, dürfen aber von Gerichten überprüft werden'),
    ],
    answer: 0,
    explain: L(
      '„Bis auf weiteres“ hieß: bis 1945. Die Verordnung wurde nie aufgehoben. Mit ihr konnte jeder ohne Gericht eingesperrt werden.',
      '„Bis auf weiteres“ bedeutete: bis 1945. Die Verordnung wurde nie aufgehoben und bildete die rechtliche Grundlage der „Schutzhaft“. Mit ihr konnte jeder ohne Gerichtsverfahren eingesperrt werden. Der Jurist Ernst Fraenkel nannte sie deshalb die „Verfassungsurkunde des Dritten Reiches“.',
    ),
  },
  {
    kind: 'Zahlen',
    title: 'Das Ergebnis der Reichstagswahl',
    origin: L('Amtliches Ergebnis der Wahl vom 5. März 1933, Stimmen in Prozent', 'Amtliches Ergebnis der Wahl vom 5. März 1933, Stimmen in Prozent'),
    text: 'NSDAP 43,9 · SPD 18,3 · KPD 12,3 · Zentrum 11,2 · Kampffront Schwarz-Weiß-Rot 8,0 · andere 6,3',
    question: L('Hatte die NSDAP allein die Mehrheit?', 'Wie kam die Regierung Hitler trotzdem auf eine Mehrheit im Reichstag?'),
    options: [
      L('Nein, sie bekam weniger als die Hälfte der Stimmen', 'Nur zusammen mit der Kampffront Schwarz-Weiß-Rot, also den Deutschnationalen'),
      L('Ja, fast alle haben sie gewählt', 'Weil die SPD nach der Wahl zur NSDAP übertrat'),
      L('Ja, sie bekam genau die Hälfte', 'Weil das Zentrum mit der NSDAP eine Koalition bildete'),
    ],
    answer: 0,
    explain: L(
      'Trotz Verboten, Gewalt und Verhaftungen wählte mehr als die Hälfte andere Parteien. Nur zusammen mit ihren Verbündeten hatte die Regierung eine knappe Mehrheit.',
      'NSDAP und Kampffront kamen zusammen auf knapp 52 Prozent. Für eine Verfassungsänderung wie das Ermächtigungsgesetz brauchte die Regierung aber zwei Drittel. Die bekam sie nur, weil die KPD-Abgeordneten ausgeschaltet waren und das Zentrum und andere zustimmten.',
    ),
  },
  {
    kind: 'Gesetz und Rede',
    title: 'Das Ermächtigungsgesetz und die Antwort der SPD',
    origin: L(
      'Gesetz vom 23. März 1933, Artikel 1. Darunter ein Satz aus der Rede von Otto Wels (SPD) im Reichstag.',
      'Gesetz zur Behebung der Not von Volk und Reich, Artikel 1. Darunter aus der Rede von Otto Wels (SPD) am 23. März 1933 im Reichstag.',
    ),
    text: '„Reichsgesetze können außer in dem in der Reichsverfassung vorgesehenen Verfahren auch durch die Reichsregierung beschlossen werden.“\n\nOtto Wels: „Freiheit und Leben kann man uns nehmen, die Ehre nicht.“',
    question: L('Wer darf nach Artikel 1 Gesetze beschließen?', 'Warum bedeutete Artikel 1 das Ende der Gewaltenteilung?'),
    options: [
      L('Auch die Regierung allein, ohne den Reichstag', 'Weil dieselbe Regierung jetzt Gesetze machen und ausführen konnte, ohne Kontrolle durch das Parlament'),
      L('Nur noch der Reichspräsident', 'Weil die Gerichte ab jetzt Gesetze beschließen durften'),
      L('Die Bürgerinnen und Bürger in Volksabstimmungen', 'Weil der Reichstag aufgelöst und nie wieder gewählt wurde'),
    ],
    answer: 0,
    explain: L(
      'Damit gab das Parlament seine Macht ab. Nur die 94 anwesenden Abgeordneten der SPD stimmten mit Nein. Otto Wels hielt die letzte freie Rede im Reichstag.',
      'Gesetzgebung und Regierung lagen nun in einer Hand. Der Reichstag bestand weiter, war aber nur noch Kulisse. Nur die 94 anwesenden Abgeordneten der SPD stimmten mit Nein. Otto Wels hielt die letzte freie Rede im Reichstag.',
    ),
  },
  {
    kind: 'Plakat',
    title: 'Ein Schild vom 1. April 1933',
    origin: L(
      'Das stand auf Schildern, die SA-Männer beim Boykott vor jüdische Geschäfte stellten',
      'Aufschrift auf Schildern und Plakaten, die SA-Männer beim Boykott vor jüdische Geschäfte stellten',
    ),
    text: '„Deutsche! Wehrt euch! Kauft nicht bei Juden!“',
    question: L('Was sollte mit diesen Schildern erreicht werden?', 'Welche Lüge steckt in den Worten „Wehrt euch“?'),
    options: [
      L('Dass niemand mehr bei jüdischen Nachbarn einkauft', 'Sie stellen die angegriffenen Juden als Angreifer dar'),
      L('Dass die Preise in den Läden sinken', 'Sie behaupten, jüdische Läden seien teurer als andere'),
      L('Dass die Menschen mehr einkaufen', 'Sie fordern die Juden auf, sich gegen die SA zu wehren'),
    ],
    answer: 0,
    explain: L(
      'Jüdische Deutsche sollten aus ihren Berufen gedrängt werden. „Wehrt euch“ tat so, als wären die Juden die Angreifer. Dabei waren sie die Opfer. Einige Menschen kauften trotzdem ein und zeigten damit Mut.',
      'Die Täter stellten sich als Verteidiger dar: eine Umkehrung von Täter und Opfer, wie sie antisemitische Propaganda immer wieder benutzt. Jüdische Deutsche sollten aus dem Wirtschaftsleben gedrängt werden. Einige Menschen kauften trotzdem ein und zeigten damit Mut.',
    ),
  },
  {
    kind: 'Gesetz',
    title: 'Das Gesetz zur Wiederherstellung des Berufsbeamtentums',
    origin: L('7. April 1933, § 3 und § 4 (gekürzt)', '7. April 1933, § 3 Absatz 1 und § 4 (gekürzt)'),
    text: '„Beamte, die nicht arischer Abstammung sind, sind in den Ruhestand […] zu versetzen.“\n\n„Beamte, die nach ihrer bisherigen politischen Betätigung nicht die Gewähr dafür bieten, daß sie jederzeit rückhaltlos für den nationalen Staat eintreten, können aus dem Dienst entlassen werden.“',
    question: L('Wen trifft dieses Gesetz?', 'Welche zwei Gruppen trifft das Gesetz, und aus welchen Gründen?'),
    options: [
      L('Jüdische Beamte und Menschen mit einer anderen politischen Meinung', 'Jüdische Beamte aus rassistischen Gründen und Demokraten und Linke aus politischen Gründen'),
      L('Alle Beamten, die älter als sechzig sind', 'Nur Beamte, die gegen ein Gesetz verstoßen hatten'),
      L('Beamte, die zu spät zur Arbeit kommen', 'Nur Beamte, die in der KPD waren'),
    ],
    answer: 0,
    explain: L(
      'Richter, Lehrerinnen und Professoren verloren ihre Arbeit. Das Wort „nicht arisch“ haben sich die Nazis ausgedacht. Gemeint waren vor allem Juden.',
      'Richter, Lehrerinnen, Professoren und Beamte verloren ihre Arbeit. „Nicht arisch“ war ein Begriff der NS-Rassenideologie ohne wissenschaftliche Grundlage, gemeint waren vor allem Juden. Die zweite Regel traf alle, die sich nicht „rückhaltlos“ unterordneten.',
    ),
  },
  {
    kind: 'Aufsatz',
    title: 'Dietrich Bonhoeffer: „Die Kirche vor der Judenfrage“',
    origin: L(
      'Ein Text des Berliner Pfarrers Dietrich Bonhoeffer vom April 1933. Er schreibt, was die Kirche gegen Unrecht tun kann.',
      'Aufsatz des Berliner Theologen Dietrich Bonhoeffer, April 1933. Er beschreibt, was die Kirche gegen staatliches Unrecht tun kann.',
    ),
    text: '„[…] nicht nur die Opfer unter dem Rad zu verbinden, sondern dem Rad selbst in die Speichen zu fallen.“',
    question: L('Was meint Bonhoeffer mit „dem Rad in die Speichen fallen“?', 'Welche zwei Arten des Handelns unterscheidet Bonhoeffer?'),
    options: [
      L('Das Unrecht selbst aufhalten, nicht nur den Opfern helfen', 'Den Opfern helfen und das Unrecht selbst verhindern'),
      L('Radfahren lernen', 'Beten und Spenden sammeln'),
      L('Sich aus allem heraushalten', 'Gehorsam gegenüber dem Staat und Gehorsam gegenüber Gott'),
    ],
    answer: 0,
    explain: L(
      'Das Rad steht für den Staat, der Menschen überrollt. Den Opfern zu helfen ist gut, schreibt Bonhoeffer. Aber manchmal muss man das Unrecht selbst stoppen. Genau das versucht auch deine Gruppe.',
      'Das Rad steht für den Staat, der Menschen überrollt. Opfern zu helfen ist Solidarität, das Rad aufzuhalten ist Widerstand. Bonhoeffer hielt beides für geboten. Deine Gruppe versucht beides.',
    ),
  },
  {
    kind: 'Gesetz',
    title: 'Ein neuer Feiertag',
    origin: L('Gesetz vom 10. April 1933, § 1', 'Gesetz über die Einführung eines Feiertags der nationalen Arbeit, 10. April 1933, § 1'),
    text: '„Der 1. Mai ist der Feiertag der nationalen Arbeit.“',
    question: L('Was geschah einen Tag nach diesem Feiertag, am 2. Mai 1933?', 'Warum kann man den neuen Feiertag eine Täuschung nennen?'),
    options: [
      L('SA und SS besetzten die Häuser der Gewerkschaften', 'Weil am Tag danach die Gewerkschaften der Arbeiter zerschlagen wurden'),
      L('Alle Arbeiter bekamen mehr Lohn', 'Weil der Feiertag nur für Beamte galt'),
      L('Die Gewerkschaften wurden größer', 'Weil der 1. Mai schon vorher ein gesetzlicher Feiertag war'),
    ],
    answer: 0,
    explain: L(
      'Der Feiertag war ein Trick. Die Arbeiter sollten feiern. Am nächsten Morgen wurden ihre Gewerkschaften zerschlagen und ihr Geld weggenommen.',
      'Der 1. Mai war der Kampftag der Arbeiterbewegung. Das Regime machte ihn zum Staatsfeiertag und zerschlug am nächsten Morgen die Gewerkschaften. Umarmung und Vernichtung lagen einen Tag auseinander.',
    ),
  },
  {
    kind: 'Feuerspruch und Gedicht',
    title: 'Was am 10. Mai 1933 gerufen wurde',
    origin: L(
      'Einer der „Feuersprüche“ bei der Bücherverbrennung. Darunter ein Satz von Heinrich Heine aus dem Jahr 1821.',
      'Einer der „Feuersprüche“ bei der Bücherverbrennung auf dem Opernplatz. Darunter ein Satz von Heinrich Heine aus dem Jahr 1821.',
    ),
    text: '„Gegen Dekadenz und moralischen Zerfall! Für Zucht und Sitte in Familie und Staat! Ich übergebe der Flamme die Schriften von Heinrich Mann, Ernst Glaeser und Erich Kästner.“\n\nHeinrich Heine: „Dort, wo man Bücher verbrennt, verbrennt man auch am Ende Menschen.“',
    question: L('Was sollte mit der Bücherverbrennung erreicht werden?', 'Wie begründen die Täter im Feuerspruch die Verbrennung?'),
    options: [
      L('Gedanken und Ideen sollten ausgelöscht werden', 'Sie behaupten, die Bücher zerstörten Moral und Anstand'),
      L('Man wollte den Platz heizen', 'Sie behaupten, die Bücher seien zu teuer'),
      L('Alte Bücher sollten Platz für neue machen', 'Sie sagen offen, dass sie Kritik verbieten wollen'),
    ],
    answer: 0,
    explain: L(
      'Erich Kästner stand selbst in der Menge und hörte seinen Namen. Heines Satz war über hundert Jahre alt. Später wurde er auf schreckliche Weise wahr.',
      'Die Täter gaben sich als Verteidiger von Anstand und Familie aus. Tatsächlich ging es darum, kritische, jüdische und linke Stimmen auszulöschen. Erich Kästner stand selbst in der Menge. Heines Satz wurde später auf schreckliche Weise wahr.',
    ),
  },
  // 1936 bis 1938
  {
    kind: 'Zahlen',
    title: 'Eine Wahl ohne Wahl',
    origin: L('Amtliches Ergebnis der Wahl vom 29. März 1936', 'Amtliches Ergebnis der Reichstagswahl vom 29. März 1936'),
    text: 'Stimmen für die Liste der NSDAP: 98,8 Prozent. Eine andere Liste stand nicht auf dem Stimmzettel.',
    question: L('Warum stimmten fast 99 Prozent für die NSDAP?', 'Was kann man aus diesem Ergebnis über die Meinung der Menschen ablesen?'),
    options: [
      L('Es gab nur eine Liste, und wer anders stimmte, geriet in Gefahr', 'Wenig: Ohne Wahlmöglichkeit, Geheimnis und Freiheit sagt die Zahl nichts Verlässliches'),
      L('Alle Menschen waren mit der Regierung zufrieden', 'Dass 98,8 Prozent überzeugte Nationalsozialisten waren'),
      L('Die Wahl war frei und geheim', 'Dass die Opposition sich selbst aufgelöst hatte'),
    ],
    answer: 0,
    explain: L(
      'Andere Parteien waren verboten. Oft wurde offen abgestimmt. Manche Ergebnisse wurden auch gefälscht. Solche Zahlen sagen nichts darüber, was die Menschen wirklich dachten.',
      'Andere Parteien waren verboten, oft wurde offen abgestimmt, und Ergebnisse wurden auch geschönt. Dennoch unterstützten viele das Regime wirklich, weil es ihnen wirtschaftlich besser ging. Die Zahl verdeckt beides: Angst und Zustimmung.',
    ),
  },
  {
    kind: 'Erlass',
    title: 'Ein Wort, das Menschen herabsetzt',
    origin: L('Titel eines Erlasses des Innenministers vom Juni 1936', 'Titel eines Erlasses des Reichsinnenministers vom Juni 1936'),
    text: '„Bekämpfung der Zigeunerplage“',
    question: L('Was zeigt das Wort „Plage“?', 'Welche Wirkung sollte die Sprache dieses Erlasses haben?'),
    options: [
      L('Menschen werden wie Ungeziefer behandelt, das man loswerden will', 'Menschen sollten nicht mehr als Menschen gesehen werden, damit Gewalt gegen sie normal erscheint'),
      L('Es geht um eine Krankheit, die man heilen kann', 'Sie sollte eine medizinische Hilfe für Sinti und Roma ankündigen'),
      L('Es ist ein freundliches Wort für eine Gruppe', 'Sie war die damals übliche, neutrale Amtssprache'),
    ],
    answer: 0,
    explain: L(
      'Sprache war eine Waffe. Wer Menschen „Plage“ nennt, macht es leichter, sie einzusperren. Wenige Wochen später brachte die Polizei die Berliner Sinti und Roma in das Lager Marzahn. Das Wort „Zigeuner“ empfinden viele Sinti und Roma heute als beleidigend.',
      'Wer Menschen „Plage“ nennt, entmenschlicht sie. So wird Verfolgung vorbereitet und scheinbar gerechtfertigt. Wenige Wochen später brachte die Polizei die Berliner Sinti und Roma in das Zwangslager Marzahn. Die Fremdbezeichnung „Zigeuner“ lehnen viele Sinti und Roma heute ab.',
    ),
  },
  {
    kind: 'Gegenstand',
    title: 'Ein Schild verschwindet',
    origin: L(
      'Schild an Gasthäusern und Läden in ganz Deutschland. Im August 1936 wurden viele davon abgenommen.',
      'Schild an Gasthäusern, Läden und Ortseingängen in ganz Deutschland. Im August 1936 wurden viele davon abgenommen.',
    ),
    text: '„Juden unerwünscht“',
    question: L('Warum wurden solche Schilder während der Olympischen Spiele abgenommen?', 'Was zeigt das Abnehmen der Schilder über das Regime?'),
    options: [
      L('Die Gäste aus dem Ausland sollten ein freundliches Deutschland sehen', 'Es wusste genau, dass die Welt die Verfolgung verurteilen würde, und versteckte sie'),
      L('Die Verfolgung der Juden hatte aufgehört', 'Es hatte seine Haltung zu den Juden geändert'),
      L('Die Schilder waren alt und kaputt', 'Es wollte die jüdischen Sportler ehren'),
    ],
    answer: 0,
    explain: L(
      'Es war Theater für die Welt. Nach den Spielen hingen die Schilder wieder. Und die Verfolgung wurde schlimmer.',
      'Das Regime wusste, dass seine Politik international Anstoß erregte, und inszenierte Weltoffenheit. Nach den Spielen hingen die Schilder wieder, und die Verfolgung verschärfte sich.',
    ),
  },
  {
    kind: 'Denkschrift',
    title: 'Elisabeth Schmitz: „Zur Lage der deutschen Nichtarier“',
    origin: L(
      'Text der Berliner Lehrerin Elisabeth Schmitz, 1935. Sie gab etwa 200 Abschriften an Pfarrer der Bekennenden Kirche.',
      'Denkschrift der Berliner Lehrerin Elisabeth Schmitz, 1935. Sie verteilte etwa 200 Abschriften an Pfarrer der Bekennenden Kirche.',
    ),
    text: '„Warum tut die Kirche nichts? Warum läßt sie das namenlose Unrecht geschehen?“',
    question: L('Was fordert Elisabeth Schmitz von ihrer Kirche?', 'Wen kritisiert Elisabeth Schmitz mit ihrer Frage vor allem?'),
    options: [
      L('Dass sie öffentlich gegen das Unrecht an den Juden protestiert', 'Ihre eigene Kirche, die schweigt, obwohl sie Bescheid weiß'),
      L('Dass sie mehr Kirchen baut', 'Die Juden, die sich nicht genug wehren'),
      L('Dass sie sich aus der Politik heraushält', 'Nur die Regierung, nicht die Christen'),
    ],
    answer: 0,
    explain: L(
      'Die Kirche sprach nicht über ihren Text. Viele wollten nur ihre eigene Kirche schützen, aber nicht die Juden. Elisabeth Schmitz blieb mit ihrer Frage fast allein.',
      'Schmitz richtete sich an die Bekennende Kirche selbst, die zwar ihre eigene Freiheit verteidigte, zum Unrecht an den Juden aber schwieg. Die Synode besprach ihre Denkschrift nicht. Das Schweigen der Anständigen war ihr Thema.',
    ),
  },
  {
    kind: 'Stimmzettel',
    title: 'Die Frage auf dem Stimmzettel',
    origin: L('Stimmzettel der Abstimmung vom 10. April 1938', 'Stimmzettel der Volksabstimmung vom 10. April 1938'),
    text: '„Bist Du mit der am 13. März 1938 vollzogenen Wiedervereinigung Österreichs mit dem Deutschen Reich einverstanden und stimmst Du für die Liste unseres Führers Adolf Hitler?“',
    question: L('Was ist an dieser Frage unfair?', 'Welche zwei Tricks stecken in dieser Frage?'),
    options: [
      L('Man muss zu zwei Dingen auf einmal Ja oder Nein sagen, und der Anschluss ist schon passiert', 'Zwei Fragen sind zu einer verbunden, und über eine vollendete Tatsache wird nachträglich abgestimmt'),
      L('Die Frage ist zu kurz', 'Die Frage ist mit „Du“ statt „Sie“ gestellt und die Schrift zu klein'),
      L('Die Frage ist in einer fremden Sprache gestellt', 'Man durfte nur mit Nein antworten'),
    ],
    answer: 0,
    explain: L(
      'Wer den Anschluss gut fand, musste gleichzeitig für Hitler stimmen. Und über etwas, das schon passiert ist, kann man nicht mehr entscheiden. Offiziell stimmten über 99 Prozent mit Ja.',
      'Wer den Anschluss befürwortete, musste zugleich Hitler zustimmen. Und über eine vollendete Tatsache gibt es nichts mehr zu entscheiden. Das „Du“ sollte Nähe und Volksgemeinschaft erzeugen. Offiziell stimmten über 99 Prozent mit Ja.',
    ),
  },
  {
    kind: 'Verordnung',
    title: 'Ein Gesetz über Vornamen',
    origin: L(
      'Verordnung vom 17. August 1938, § 2',
      'Zweite Verordnung zur Durchführung des Gesetzes über die Änderung von Familiennamen und Vornamen, 17. August 1938, § 2',
    ),
    text: '„Soweit Juden andere Vornamen führen, als sie nach § 1 Juden beigelegt werden dürfen, müssen sie vom 1. Januar 1939 ab zusätzlich einen weiteren Vornamen annehmen, und zwar männliche Personen den Vornamen Israel, weibliche Personen den Vornamen Sara.“',
    question: L('Warum sollten jüdische Menschen einen zusätzlichen Vornamen tragen?', 'Welchem Zweck diente die Verordnung in der Verfolgung?'),
    options: [
      L('Damit man sie auf jedem Papier sofort erkennen und ausgrenzen konnte', 'Sie markierte Juden in allen Akten und bereitete so weitere Maßnahmen vor'),
      L('Weil ihre eigenen Namen zu lang waren', 'Sie sollte die Arbeit der Standesämter vereinfachen'),
      L('Weil sie es sich selbst gewünscht hatten', 'Sie sollte jüdische Traditionen schützen'),
    ],
    answer: 0,
    explain: L(
      'Der Name gehört zu einem Menschen. Ihn zu ändern war eine Demütigung und ein Zeichen: Seht her, das ist ein Jude. Im Oktober 1938 kam das rote „J“ in den Pässen dazu.',
      'Der Zwangsname war Demütigung und Markierung zugleich. Wer auf jedem Formular erkennbar ist, kann leichter erfasst, beraubt und später deportiert werden. Im Oktober 1938 kam das rote „J“ in den Reisepässen hinzu.',
    ),
  },
  {
    kind: 'Verordnung',
    title: 'Wer bezahlt den Schaden?',
    origin: L(
      'Verordnung vom 12. November 1938, § 1',
      'Verordnung über eine Sühneleistung der Juden deutscher Staatsangehörigkeit, 12. November 1938, § 1',
    ),
    text: '„Den Juden deutscher Staatsangehörigkeit in ihrer Gesamtheit wird die Zahlung einer Kontribution von 1 000 000 000 Reichsmark an das Deutsche Reich auferlegt.“',
    question: L('Wer sollte nach dem Pogrom für die Zerstörungen bezahlen?', 'Was ist an dem Wort „Sühneleistung“ im Titel verlogen?'),
    options: [
      L('Die Opfer, also die jüdischen Menschen selbst', 'Es unterstellt den Opfern eine Schuld, die sie büßen müssen'),
      L('Die SA-Männer, die alles zerschlagen hatten', 'Es verspricht eine Entschädigung, die nie gezahlt wurde'),
      L('Die Versicherungen', 'Es ist ein Fachwort aus dem Versicherungsrecht ohne Wertung'),
    ],
    answer: 0,
    explain: L(
      'Die Täter wurden nicht bestraft. Die Opfer mussten zahlen. Auch das Geld der Versicherungen für die kaputten Läden nahm sich der Staat.',
      'Sühne leistet, wer schuld ist. Die Verordnung drehte Schuld und Opfer um: Die Täter blieben straffrei, die Opfer mussten zahlen. Auch die Versicherungsleistungen für zerstörte Geschäfte zog der Staat ein.',
    ),
  },
  {
    kind: 'Vorschrift',
    title: 'Was ein Kind mitnehmen durfte',
    origin: L(
      'Regeln für die Kindertransporte 1938 und 1939, nach Berichten der Hilfsorganisationen',
      'Regeln für die Kindertransporte 1938 und 1939, nach Berichten und Unterlagen der Hilfsorganisationen',
    ),
    text: 'Ein Koffer. Eine Tasche. Zehn Reichsmark. Kein Spielzeug, keine Bücher, keine Wertsachen. Nur ein Foto war erlaubt.',
    question: L('Was durften die Kinder mitnehmen?', 'Warum ist diese Liste ein wichtiges Dokument, obwohl sie so kurz ist?'),
    options: [
      L('Einen Koffer, eine Tasche und zehn Reichsmark', 'Sie zeigt, wie viel den Kindern genommen wurde und wie wenig vom Leben blieb'),
      L('Alles, was in einen Möbelwagen passte', 'Sie beweist, dass die Kinder freiwillig ausreisten'),
      L('Nur ihr Lieblingsspielzeug', 'Sie zeigt, dass England nur reiche Kinder aufnahm'),
    ],
    answer: 0,
    explain: L(
      'Etwa 10.000 Kinder wurden so gerettet. Die meisten sahen ihre Eltern nie wieder, weil diese später ermordet wurden. Überlegt: Was verrät diese kurze Liste über die Lage der Familien?',
      'Etwa 10.000 Kinder wurden so gerettet, die meisten sahen ihre Eltern nie wieder. Die Liste macht greifbar, was Zahlen nicht zeigen: Was verrät sie über die Lage der Familien, die ihre Kinder allein fortschickten?',
    ),
  },
]
