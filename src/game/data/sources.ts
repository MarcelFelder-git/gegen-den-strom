/**
 * Eine echte Quelle pro Woche, mit einer kleinen Aufgabe.
 * Alle Zitate sind im Wortlaut geprüft, Kürzungen sind mit […] markiert.
 * Die Rechtschreibung der Quellen ist die von damals („daß“).
 */
export interface WeekSource {
  kind: string
  title: string
  origin: string
  text: string
  question: string
  options: string[]
  answer: number
  explain: string
}

export const SOURCES: WeekSource[] = [
  // 1933
  {
    kind: 'Aufruf',
    title: 'Der „Dringende Appell“',
    origin: 'Aufruf vom Juni 1932, im Februar 1933 erneut als Plakat veröffentlicht. Unterschrieben unter anderem von Käthe Kollwitz, Albert Einstein und Heinrich Mann.',
    text: '„Die Vernichtung aller persönlichen und politischen Freiheit in Deutschland steht unmittelbar bevor, wenn es nicht in letzter Minute gelingt, unbeschadet von Prinzipiengegensätzen alle Kräfte zusammenzufassen, die in der Ablehnung des Faschismus einig sind.“',
    question: 'Wovor warnen die Unterzeichner?',
    options: ['Vor dem Ende aller Freiheit in Deutschland', 'Vor zu hohen Steuern für Künstler', 'Vor einem Streik der Straßenbahner'],
    answer: 0,
    explain:
      'Sie wollten, dass SPD und KPD sich gegen die Nationalsozialisten verbünden. Das gelang nicht. Käthe Kollwitz und Heinrich Mann mussten wegen ihrer Unterschrift im Februar 1933 die Akademie der Künste verlassen.',
  },
  {
    kind: 'Verordnung',
    title: 'Verordnung zum Schutze des Deutschen Volkes',
    origin: 'Erlassen vom Reichspräsidenten am 4. Februar 1933, § 1',
    text: '„Öffentliche politische Versammlungen sowie alle Versammlungen und Aufzüge unter freiem Himmel sind spätestens achtundvierzig Stunden vorher unter Angabe des Ortes, der Zeit und des Verhandlungsgegenstandes der Ortspolizeibehörde anzumelden.“',
    question: 'Was verlangt diese Verordnung?',
    options: [
      'Versammlungen müssen zwei Tage vorher bei der Polizei angemeldet werden',
      'Versammlungen sind in Zukunft immer erlaubt',
      'Nur Sportvereine dürfen sich noch treffen',
    ],
    answer: 0,
    explain:
      'Die Polizei konnte angemeldete Versammlungen einfach verbieten. So wurden vor der Wahl im März vor allem die Treffen von SPD und KPD behindert.',
  },
  {
    kind: 'Verordnung',
    title: 'Die Reichstagsbrandverordnung',
    origin: 'Verordnung des Reichspräsidenten zum Schutz von Volk und Staat, 28. Februar 1933, § 1 (gekürzt)',
    text: '„Die Artikel 114, 115, 117, 118, 123, 124 und 153 der Verfassung des Deutschen Reichs werden bis auf weiteres außer Kraft gesetzt. Es sind daher Beschränkungen der persönlichen Freiheit, des Rechts der freien Meinungsäußerung, einschließlich der Pressefreiheit, des Vereins- und Versammlungsrechts, Eingriffe in das Brief-, Post-, Telegraphen- und Fernsprechgeheimnis […] auch außerhalb der sonst hierfür bestimmten gesetzlichen Grenzen zulässig.“',
    question: 'Welche Rechte verlieren die Menschen durch diese Verordnung?',
    options: [
      'Meinungsfreiheit, Pressefreiheit und das Briefgeheimnis',
      'Das Recht, in den Urlaub zu fahren',
      'Das Wahlrecht für Frauen',
    ],
    answer: 0,
    explain: '„Bis auf weiteres“ bedeutete: bis 1945. Die Verordnung wurde nie aufgehoben. Mit ihr konnte jeder ohne Gericht in Schutzhaft genommen werden.',
  },
  {
    kind: 'Zahlen',
    title: 'Das Ergebnis der Reichstagswahl',
    origin: 'Amtliches Ergebnis der Wahl vom 5. März 1933, Stimmen in Prozent',
    text: 'NSDAP 43,9 · SPD 18,3 · KPD 12,3 · Zentrum 11,2 · Kampffront Schwarz-Weiß-Rot 8,0 · andere 6,3',
    question: 'Hatte die NSDAP allein die Mehrheit?',
    options: ['Nein, sie bekam weniger als die Hälfte der Stimmen', 'Ja, fast alle haben sie gewählt', 'Ja, sie bekam genau die Hälfte'],
    answer: 0,
    explain:
      'Trotz Verboten, Gewalt und Verhaftungen stimmte mehr als die Hälfte für andere Parteien. Nur zusammen mit der Kampffront kam die Regierung auf eine knappe Mehrheit.',
  },
  {
    kind: 'Gesetz und Rede',
    title: 'Das Ermächtigungsgesetz und die Antwort der SPD',
    origin: 'Gesetz zur Behebung der Not von Volk und Reich, Artikel 1. Darunter aus der Rede von Otto Wels (SPD) am 23. März 1933 im Reichstag.',
    text: '„Reichsgesetze können außer in dem in der Reichsverfassung vorgesehenen Verfahren auch durch die Reichsregierung beschlossen werden.“\n\nOtto Wels: „Freiheit und Leben kann man uns nehmen, die Ehre nicht.“',
    question: 'Wer darf nach Artikel 1 Gesetze beschließen?',
    options: ['Auch die Regierung allein, ohne den Reichstag', 'Nur noch der Reichspräsident', 'Die Bürgerinnen und Bürger in Volksabstimmungen'],
    answer: 0,
    explain:
      'Damit gab das Parlament seine Macht ab. Nur die 94 Abgeordneten der SPD stimmten mit Nein. Otto Wels hielt die letzte freie Rede im Reichstag.',
  },
  {
    kind: 'Plakat',
    title: 'Ein Schild vom 1. April 1933',
    origin: 'Aufschrift auf Schildern und Plakaten, die SA-Männer beim Boykott vor jüdische Geschäfte stellten',
    text: '„Deutsche! Wehrt euch! Kauft nicht bei Juden!“',
    question: 'Was sollte mit diesen Schildern erreicht werden?',
    options: [
      'Dass niemand mehr bei jüdischen Nachbarn einkauft',
      'Dass die Preise in den Läden sinken',
      'Dass die Menschen mehr einkaufen',
    ],
    answer: 0,
    explain:
      'Jüdische Deutsche sollten aus dem Wirtschaftsleben gedrängt werden. „Wehrt euch“ tat so, als seien die Juden Angreifer. Einige Menschen kauften trotzdem ein und zeigten damit Mut.',
  },
  {
    kind: 'Gesetz',
    title: 'Das Gesetz zur Wiederherstellung des Berufsbeamtentums',
    origin: '7. April 1933, § 3 Absatz 1 und § 4 (gekürzt)',
    text: '„Beamte, die nicht arischer Abstammung sind, sind in den Ruhestand […] zu versetzen.“\n\n„Beamte, die nach ihrer bisherigen politischen Betätigung nicht die Gewähr dafür bieten, daß sie jederzeit rückhaltlos für den nationalen Staat eintreten, können aus dem Dienst entlassen werden.“',
    question: 'Wen trifft dieses Gesetz?',
    options: [
      'Jüdische Beamte und Menschen mit anderer politischer Meinung',
      'Alle Beamten, die älter als sechzig sind',
      'Beamte, die zu spät zur Arbeit kommen',
    ],
    answer: 0,
    explain:
      'Richter, Lehrerinnen, Professoren und Beamte verloren ihre Arbeit. „Nicht arisch“ war ein erfundener Begriff der Nationalsozialisten, gemeint waren vor allem Juden.',
  },
  {
    kind: 'Aufsatz',
    title: 'Dietrich Bonhoeffer: „Die Kirche vor der Judenfrage“',
    origin: 'Aufsatz des Berliner Theologen Dietrich Bonhoeffer, April 1933. Er beschreibt, was die Kirche gegen staatliches Unrecht tun kann.',
    text: '„[…] nicht nur die Opfer unter dem Rad zu verbinden, sondern dem Rad selbst in die Speichen zu fallen.“',
    question: 'Was meint Bonhoeffer mit „dem Rad in die Speichen fallen“?',
    options: ['Das Unrecht selbst aufhalten, nicht nur den Opfern helfen', 'Radfahren lernen', 'Sich aus allem heraushalten'],
    answer: 0,
    explain:
      'Das Rad steht für den Staat, der Menschen überrollt. Den Opfern zu helfen ist gut, schreibt Bonhoeffer, aber manchmal muss man das Unrecht selbst stoppen. Genau das versucht auch deine Gruppe.',
  },
  {
    kind: 'Gesetz',
    title: 'Ein neuer Feiertag',
    origin: 'Gesetz über die Einführung eines Feiertags der nationalen Arbeit, 10. April 1933, § 1',
    text: '„Der 1. Mai ist der Feiertag der nationalen Arbeit.“',
    question: 'Was geschah einen Tag nach diesem Feiertag, am 2. Mai 1933?',
    options: ['SA und SS besetzten die Häuser der Gewerkschaften', 'Alle Arbeiter bekamen mehr Lohn', 'Die Gewerkschaften wurden größer'],
    answer: 0,
    explain:
      'Der Feiertag war eine Täuschung. Die Arbeiter sollten feiern, und am nächsten Morgen wurden ihre Gewerkschaften zerschlagen und die Kassen beschlagnahmt.',
  },
  {
    kind: 'Feuerspruch und Gedicht',
    title: 'Was am 10. Mai 1933 gerufen wurde',
    origin: 'Einer der „Feuersprüche“ bei der Bücherverbrennung auf dem Opernplatz. Darunter ein Satz von Heinrich Heine aus dem Jahr 1821.',
    text: '„Gegen Dekadenz und moralischen Zerfall! Für Zucht und Sitte in Familie und Staat! Ich übergebe der Flamme die Schriften von Heinrich Mann, Ernst Glaeser und Erich Kästner.“\n\nHeinrich Heine: „Dort, wo man Bücher verbrennt, verbrennt man auch am Ende Menschen.“',
    question: 'Was sollte mit der Bücherverbrennung erreicht werden?',
    options: ['Gedanken und Ideen sollten ausgelöscht werden', 'Man wollte den Platz heizen', 'Alte Bücher sollten Platz für neue machen'],
    answer: 0,
    explain:
      'Erich Kästner stand selbst in der Menge und hörte seinen Namen. Heines Satz war über hundert Jahre alt und wurde später auf schreckliche Weise wahr.',
  },
  // 1936 bis 1938
  {
    kind: 'Zahlen',
    title: 'Eine Wahl ohne Wahl',
    origin: 'Amtliches Ergebnis der Reichstagswahl vom 29. März 1936',
    text: 'Stimmen für die Liste der NSDAP: 98,8 Prozent. Eine andere Liste stand nicht auf dem Stimmzettel.',
    question: 'Warum stimmten fast 99 Prozent für die NSDAP?',
    options: [
      'Es gab nur eine Liste, und wer anders stimmte, geriet in Gefahr',
      'Alle Menschen waren mit der Regierung zufrieden',
      'Die Wahl war frei und geheim',
    ],
    answer: 0,
    explain:
      'Andere Parteien waren verboten, oft wurde offen abgestimmt, und Ergebnisse wurden auch gefälscht. Solche Zahlen sagen nichts darüber, was die Menschen wirklich dachten.',
  },
  {
    kind: 'Erlass',
    title: 'Ein Wort, das Menschen herabsetzt',
    origin: 'Titel eines Erlasses des Reichsinnenministers vom Juni 1936',
    text: '„Bekämpfung der Zigeunerplage“',
    question: 'Was zeigt das Wort „Plage“?',
    options: [
      'Menschen werden wie Ungeziefer behandelt, das man loswerden will',
      'Es geht um eine Krankheit, die man heilen kann',
      'Es ist ein freundliches Wort für eine Gruppe',
    ],
    answer: 0,
    explain:
      'Sprache war eine Waffe. Wer Menschen „Plage“ nennt, macht es leichter, sie einzusperren. Wenige Wochen später brachte die Polizei die Berliner Sinti und Roma in das Lager Marzahn.',
  },
  {
    kind: 'Gegenstand',
    title: 'Ein Schild verschwindet',
    origin: 'Schild an Gasthäusern, Läden und Ortseingängen in ganz Deutschland. Im August 1936 wurden viele davon abgenommen.',
    text: '„Juden unerwünscht“',
    question: 'Warum wurden solche Schilder während der Olympischen Spiele abgenommen?',
    options: [
      'Die ausländischen Gäste sollten ein freundliches Deutschland sehen',
      'Die Verfolgung der Juden hatte aufgehört',
      'Die Schilder waren alt und kaputt',
    ],
    answer: 0,
    explain: 'Es war Theater für die Welt. Nach den Spielen hingen die Schilder wieder, und die Verfolgung wurde schlimmer.',
  },
  {
    kind: 'Denkschrift',
    title: 'Elisabeth Schmitz: „Zur Lage der deutschen Nichtarier“',
    origin: 'Denkschrift der Berliner Lehrerin Elisabeth Schmitz, 1935. Sie verteilte 200 Abschriften an Pfarrer der Bekennenden Kirche.',
    text: '„Warum tut die Kirche nichts? Warum läßt sie das namenlose Unrecht geschehen?“',
    question: 'Was fordert Elisabeth Schmitz von ihrer Kirche?',
    options: [
      'Dass sie öffentlich gegen das Unrecht an den Juden protestiert',
      'Dass sie mehr Kirchen baut',
      'Dass sie sich aus der Politik heraushält',
    ],
    answer: 0,
    explain:
      'Die Synode der Bekennenden Kirche sprach nicht über ihre Denkschrift. Viele wollten die eigene Kirche schützen, aber nicht die Juden. Elisabeth Schmitz blieb mit ihrer Frage fast allein.',
  },
  {
    kind: 'Stimmzettel',
    title: 'Die Frage auf dem Stimmzettel',
    origin: 'Stimmzettel der Volksabstimmung vom 10. April 1938',
    text: '„Bist Du mit der am 13. März 1938 vollzogenen Wiedervereinigung Österreichs mit dem Deutschen Reich einverstanden und stimmst Du für die Liste unseres Führers Adolf Hitler?“',
    question: 'Was ist an dieser Frage unfair?',
    options: [
      'Man muss zu zwei Dingen auf einmal Ja oder Nein sagen, und der Anschluss ist schon geschehen',
      'Die Frage ist zu kurz',
      'Die Frage ist in einer fremden Sprache gestellt',
    ],
    answer: 0,
    explain:
      'Wer den Anschluss gut fand, musste zugleich für Hitler stimmen. Und über etwas, das schon passiert ist, gibt es eigentlich nichts mehr zu entscheiden. Offiziell stimmten über 99 Prozent mit Ja.',
  },
  {
    kind: 'Verordnung',
    title: 'Ein Gesetz über Vornamen',
    origin: 'Zweite Verordnung zur Durchführung des Gesetzes über die Änderung von Familiennamen und Vornamen, 17. August 1938, § 2',
    text: '„Soweit Juden andere Vornamen führen, als sie nach § 1 Juden beigelegt werden dürfen, müssen sie vom 1. Januar 1939 ab zusätzlich einen weiteren Vornamen annehmen, und zwar männliche Personen den Vornamen Israel, weibliche Personen den Vornamen Sara.“',
    question: 'Warum sollten jüdische Menschen zusätzliche Vornamen tragen?',
    options: [
      'Damit man sie auf jedem Schriftstück sofort erkennen und ausgrenzen konnte',
      'Weil ihre eigenen Namen zu lang waren',
      'Weil sie es sich selbst gewünscht hatten',
    ],
    answer: 0,
    explain:
      'Der Name gehört zu einem Menschen. Ihn zu verändern war eine Demütigung und eine Markierung. Im Oktober 1938 kam das rote „J“ in den Reisepässen hinzu.',
  },
  {
    kind: 'Verordnung',
    title: 'Wer bezahlt den Schaden?',
    origin: 'Verordnung über eine Sühneleistung der Juden deutscher Staatsangehörigkeit, 12. November 1938, § 1',
    text: '„Den Juden deutscher Staatsangehörigkeit in ihrer Gesamtheit wird die Zahlung einer Kontribution von 1 000 000 000 Reichsmark an das Deutsche Reich auferlegt.“',
    question: 'Wer sollte nach dem Pogrom für die Zerstörungen bezahlen?',
    options: ['Die Opfer, also die jüdischen Menschen selbst', 'Die SA-Männer, die alles zerschlagen hatten', 'Die Versicherungen'],
    answer: 0,
    explain:
      'Die Täter wurden nicht bestraft, die Opfer mussten zahlen. Auch das Geld, das Versicherungen für die zerstörten Läden zahlten, nahm sich der Staat.',
  },
  {
    kind: 'Vorschrift',
    title: 'Was ein Kind mitnehmen durfte',
    origin: 'Regeln für die Kindertransporte 1938 und 1939, nach Berichten und Unterlagen der Hilfsorganisationen',
    text: 'Ein Koffer. Eine Tasche. Zehn Reichsmark. Kein Spielzeug, keine Bücher, keine Wertsachen. Nur ein Foto war erlaubt.',
    question: 'Was durften die Kinder mitnehmen?',
    options: ['Einen Koffer, eine Tasche und zehn Reichsmark', 'Alles, was in einen Möbelwagen passte', 'Nur ihr Lieblingsspielzeug'],
    answer: 0,
    explain:
      'Etwa 10.000 Kinder wurden so gerettet. Die meisten sahen ihre Eltern nie wieder, weil diese später ermordet wurden. Stell dir vor, du müsstest heute Abend so einen Koffer packen.',
  },
]
