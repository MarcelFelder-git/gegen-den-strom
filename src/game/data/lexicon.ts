import { L, type Txt } from '../text'

export interface LexiconEntry {
  id: string
  term: string
  text: Txt
}

/** Worterklärungen, in der leichten Stufe in einfacher Sprache */
export const LEXICON: LexiconEntry[] = [
  {
    id: 'anschluss',
    term: 'Anschluss',
    text: L(
      'So nannten die Nazis die Besetzung von Österreich im März 1938. Österreich war danach kein eigenes Land mehr. Gegner und Juden wurden sofort verfolgt.',
      'So nannten die Nationalsozialisten die Besetzung Österreichs im März 1938. Österreich hörte auf, ein eigener Staat zu sein. Gegner und Juden wurden sofort verfolgt, viele Österreicher jubelten.',
    ),
  },
  {
    id: 'antisemitismus',
    term: 'Antisemitismus',
    text: L(
      'Hass auf Jüdinnen und Juden. Die Nazis machten diesen Hass zur Politik des Staates. Jüdische Menschen wurden Schritt für Schritt ausgegrenzt, beraubt und später millionenfach ermordet. Antisemitismus gibt es leider bis heute.',
      'Feindschaft und Vorurteile gegen Jüdinnen und Juden. Die Nationalsozialisten machten ihn zur Staatspolitik: Jüdische Deutsche wurden Schritt für Schritt ausgegrenzt, beraubt und später millionenfach ermordet. Antisemitismus ist bis heute nicht verschwunden.',
    ),
  },
  {
    id: 'bekennende-kirche',
    term: 'Bekennende Kirche',
    text: L(
      'Eine Gruppe in der evangelischen Kirche. Sie wehrte sich ab 1934 dagegen, dass der Staat die Kirche beherrscht. Viele ihrer Pfarrer wurden verhaftet. Für die verfolgten Juden setzten sich aber nur wenige ein.',
      'Eine Bewegung in der evangelischen Kirche, die sich ab 1934 dagegen wehrte, dass der Staat die Kirche beherrscht. Viele ihrer Pfarrer wurden verhaftet. Für die verfolgten Juden setzten sich aber nur wenige ein.',
    ),
  },
  {
    id: 'boykott',
    term: 'Boykott',
    text: L(
      'Ein Aufruf, bei bestimmten Geschäften nicht mehr zu kaufen. Am 1. April 1933 stellten sich SA-Männer vor jüdische Läden und Praxen. Sie wollten die Kunden abschrecken.',
      'Ein Aufruf, bestimmte Geschäfte zu meiden. Am 1. April 1933 stellten sich SA-Männer vor jüdische Läden, Praxen und Kanzleien, um die Kundschaft abzuschrecken.',
    ),
  },
  {
    id: 'buecherverbrennung',
    term: 'Bücherverbrennung',
    text: L(
      'Am 10. Mai 1933 verbrannten Studenten in Berlin und vielen anderen Städten Bücher. Es waren Bücher von Menschen, die den Nazis nicht gefielen. So sollten ihre Gedanken ausgelöscht werden.',
      'Am 10. Mai 1933 verbrannten Studenten in Berlin und vielen anderen Städten Bücher von Schriftstellern, die den Nationalsozialisten nicht passten. Damit sollten Gedanken und Ideen ausgelöscht werden.',
    ),
  },
  {
    id: 'demokratie',
    term: 'Demokratie',
    text: L(
      'Eine Staatsform, in der das Volk bestimmt. Die Menschen wählen ihre Regierung. Sie dürfen ihre Meinung sagen, auch gegen die Regierung. Gerichte sind unabhängig. Die Weimarer Republik war eine Demokratie. Die Nazis haben sie 1933 zerstört.',
      'Herrschaft des Volkes: Die Bürgerinnen und Bürger wählen in freien Wahlen, es gibt Meinungs- und Pressefreiheit, unabhängige Gerichte und den Schutz von Minderheiten. Die Weimarer Republik war die erste deutsche Demokratie. Die Nationalsozialisten zerstörten sie 1933 in wenigen Monaten, zum Teil mit legalen Mitteln.',
    ),
  },
  {
    id: 'denunziation',
    term: 'Denunziation',
    text: L(
      'Jemanden heimlich bei der Polizei anzeigen, oft aus Neid oder um sich selbst einen Vorteil zu verschaffen. Viele Menschen wurden verhaftet, weil Nachbarn sie angezeigt hatten.',
      'Die Anzeige eines Menschen bei Polizei oder Partei, oft aus Neid, Rache oder um sich einen Vorteil zu verschaffen. Die Gestapo war auf solche Anzeigen aus der Bevölkerung angewiesen. Ohne sie hätte sie viele Menschen nie gefunden.',
    ),
  },
  {
    id: 'diktatur',
    term: 'Diktatur',
    text: L(
      'Eine Staatsform, in der einer oder wenige allein bestimmen. Es gibt keine freien Wahlen. Wer etwas gegen die Regierung sagt, wird bestraft. Ab 1933 war Deutschland eine Diktatur.',
      'Eine Herrschaft, in der eine Person oder Gruppe die ganze Macht hat, ohne Kontrolle durch Wahlen, Parlament, freie Presse oder unabhängige Gerichte. Gegner werden verfolgt. Ab 1933 wurde Deutschland zur Diktatur.',
    ),
  },
  {
    id: 'ermaechtigungsgesetz',
    term: 'Ermächtigungsgesetz',
    text: L(
      'Ein Gesetz vom 23. März 1933. Damit durfte die Regierung Gesetze machen, ohne den Reichstag zu fragen. Das Parlament hatte keine Macht mehr. Nur die SPD stimmte dagegen.',
      'Ein Gesetz vom 23. März 1933. Es erlaubte der Regierung, Gesetze ohne den Reichstag zu beschließen, auch wenn sie gegen die Verfassung verstießen. Damit war das Parlament entmachtet. Nur die SPD stimmte dagegen.',
    ),
  },
  {
    id: 'faschismus',
    term: 'Faschismus',
    text: L(
      'Eine Art zu herrschen, bei der ein Führer alles bestimmt. Alle sollen gehorchen und gleich denken. Wer anders ist oder anders denkt, gilt als Feind. Faschisten setzen Gewalt ein, um an die Macht zu kommen und sie zu behalten. Der Name kommt aus Italien. In Deutschland nannten sich die Faschisten Nationalsozialisten, kurz Nazis. Sie machten den Hass auf Juden zum Kern ihrer Politik.',
      'Eine politische Bewegung und Herrschaftsform, die im 20. Jahrhundert entstand, zuerst in Italien unter Mussolini. Kennzeichen: ein Führer, dem alle folgen sollen, extremer Nationalismus, Feindschaft gegen Demokratie und Gleichheit, Gewalt gegen Gegner und die Ausgrenzung ganzer Gruppen als „Feinde“ oder „Fremde“. Der deutsche Nationalsozialismus war eine besonders radikale Form, in deren Mittelpunkt der Rassenwahn und der Antisemitismus standen. Er führte zum Völkermord an den europäischen Juden.',
    ),
  },
  {
    id: 'flugschrift',
    term: 'Flugblatt oder Flugschrift',
    text: L(
      'Ein gedrucktes Blatt mit einer Nachricht, das heimlich verteilt wird. Die Zeitungen durften nur noch schreiben, was die Regierung wollte. Deshalb waren Flugblätter für den Widerstand sehr wichtig.',
      'Ein gedrucktes Blatt mit einer Botschaft, das heimlich verteilt wird. Weil die Zeitungen nur noch schreiben durften, was die Regierung wollte, waren Flugblätter für den Widerstand sehr wichtig.',
    ),
  },
  {
    id: 'gestapo',
    term: 'Gestapo',
    text: L(
      'Kurz für Geheime Staatspolizei. Sie wurde im April 1933 gegründet. Sie jagte alle Gegner der Nazis. Sie durfte Menschen einsperren, ohne dass ein Gericht gefragt wurde.',
      'Kurz für Geheime Staatspolizei. Sie wurde im April 1933 gegründet und verfolgte alle, die als Gegner galten. Sie durfte Menschen ohne Gerichtsurteil einsperren und folterte in ihren Verhören.',
    ),
  },
  {
    id: 'gewerkschaft',
    term: 'Gewerkschaft',
    text: L(
      'Ein Zusammenschluss von Arbeiterinnen und Arbeitern. Sie setzen sich gemeinsam für bessere Löhne und Arbeitsbedingungen ein. Am 2. Mai 1933 zerschlugen die Nazis alle freien Gewerkschaften.',
      'Ein Zusammenschluss von Arbeiterinnen und Arbeitern, die sich gemeinsam für bessere Löhne und Arbeitsbedingungen einsetzen. Am 2. Mai 1933 wurden alle freien Gewerkschaften zerschlagen.',
    ),
  },
  {
    id: 'gleichschaltung',
    term: 'Gleichschaltung',
    text: L(
      'So nannten es die Nazis, wenn sie Vereine, Zeitungen, Schulen und Ämter unter ihre Kontrolle brachten. Alles sollte nach ihrem Willen laufen. Wer nicht mitmachte, wurde entlassen oder verfolgt.',
      'So nannten die Nationalsozialisten es, wenn sie Vereine, Zeitungen, Schulen, Länder und Behörden unter ihre Kontrolle brachten. Wer nicht mitmachte, wurde entlassen oder verfolgt. Viele passten sich auch von selbst an.',
    ),
  },
  {
    id: 'hitlerputsch',
    term: 'Hitlerputsch',
    text: L(
      'Am 8. und 9. November 1923 wollte Hitler in München mit Gewalt die Macht übernehmen. Die Polizei stoppte ihn. Hitler kam ins Gefängnis und die NSDAP wurde verboten. Schon nach gut einem Jahr war Hitler wieder frei.',
      'Am 8. und 9. November 1923 versuchte Hitler, in München gewaltsam die Macht an sich zu reißen und von dort aus die Republik zu stürzen. Die Polizei schlug den Putsch nieder. Hitler wurde zu fünf Jahren Festungshaft verurteilt, kam aber schon nach gut einem Jahr frei. Im Gefängnis schrieb er „Mein Kampf“. Die NSDAP wurde verboten und 1925 neu gegründet.',
    ),
  },
  {
    id: 'kindertransport',
    term: 'Kindertransport',
    text: L(
      'Nach dem Novemberpogrom 1938 nahm England etwa 10.000 jüdische Kinder auf. Sie reisten ohne ihre Eltern. Die meisten sahen ihre Familien nie wieder.',
      'Nach dem Novemberpogrom 1938 nahm Großbritannien etwa 10.000 jüdische Kinder auf. Sie reisten ohne ihre Eltern. Die meisten sahen ihre Familien nie wieder.',
    ),
  },
  {
    id: 'kpd',
    term: 'KPD',
    text: L(
      'Die Kommunistische Partei Deutschlands. Sie wollte, dass die Arbeiter herrschen, wie in der Sowjetunion. Auch sie war keine Freundin der Demokratie. Nach dem Reichstagsbrand wurden ihre Mitglieder als Erste verhaftet.',
      'Die Kommunistische Partei Deutschlands. Sie wollte eine Herrschaft der Arbeiter nach sowjetischem Vorbild und bekämpfte auch die Demokratie der Weimarer Republik. Nach dem Reichstagsbrand wurden ihre Mitglieder als Erste verfolgt. Viele Kommunisten leisteten Widerstand und bezahlten mit dem Leben.',
    ),
  },
  {
    id: 'kz',
    term: 'Konzentrationslager (KZ)',
    text: L(
      'Lager, in denen Menschen ohne Gerichtsurteil eingesperrt, gequält und später auch ermordet wurden. Die ersten gab es schon im März 1933, zum Beispiel in Dachau bei München und in Oranienburg bei Berlin.',
      'Lager, in denen Menschen ohne Gerichtsurteil eingesperrt, gequält und ermordet wurden. Die ersten entstanden schon im März 1933, zum Beispiel in Dachau bei München und in Oranienburg bei Berlin. Später kamen die Vernichtungslager hinzu, in denen Millionen Menschen ermordet wurden.',
    ),
  },
  {
    id: 'machtuebernahme',
    term: 'Machtergreifung oder Machtübertragung',
    text: L(
      'Die Nazis sagten „Machtergreifung“. Das klingt so, als hätten sie die Macht erkämpft. In Wahrheit hat der Reichspräsident Hitler am 30. Januar 1933 zum Kanzler gemacht. Deshalb sagt man heute oft Machtübertragung.',
      'Die Nationalsozialisten sprachen von „Machtergreifung“, als hätten sie die Macht erkämpft. Tatsächlich wurde Hitler am 30. Januar 1933 vom Reichspräsidenten zum Kanzler ernannt. Historiker sprechen deshalb oft von Machtübertragung.',
    ),
  },
  {
    id: 'mitlaeufer',
    term: 'Mitläufer',
    text: L(
      'Menschen, die mitmachten, ohne selbst Täter zu sein. Sie sahen weg, schwiegen oder taten, was verlangt wurde. Viele dachten: „Mir geht es doch gut. Das ist nicht meine Sache.“ Ohne die vielen Mitläufer hätten die Nazis nicht so viel Macht gehabt.',
      'Menschen, die das Regime mittrugen, ohne selbst zu den Haupttätern zu gehören: aus Angst, Bequemlichkeit, Vorteil, Gleichgültigkeit oder Überzeugung. Sie schauten weg, schwiegen, grüßten mit, kauften woanders ein. Ohne sie hätte die Diktatur nicht funktioniert. Widerstand begann oft damit, eben nicht mitzulaufen.',
    ),
  },
  {
    id: 'notverordnung',
    term: 'Notverordnung',
    text: L(
      'Eine Vorschrift, die der Reichspräsident ohne das Parlament machen konnte. Die Verordnung vom 28. Februar 1933 schaffte die wichtigsten Grundrechte ab, zum Beispiel die Meinungsfreiheit.',
      'Eine Verordnung, die der Reichspräsident ohne das Parlament erlassen konnte. Die Reichstagsbrandverordnung vom 28. Februar 1933 hob die wichtigsten Grundrechte auf, etwa die Meinungsfreiheit, und blieb bis 1945 in Kraft.',
    ),
  },
  {
    id: 'nsdap',
    term: 'NSDAP',
    text: L(
      'Die Nationalsozialistische Deutsche Arbeiterpartei, die Partei von Hitler. Ihre Mitglieder nennt man Nazis. Ab Juli 1933 war sie die einzige erlaubte Partei in Deutschland.',
      'Die Nationalsozialistische Deutsche Arbeiterpartei, die Partei Adolf Hitlers. Sie wurde 1920 gegründet, nach dem Hitlerputsch 1923 verboten und 1925 neu gegründet. Ab Juli 1933 war sie die einzige erlaubte Partei.',
    ),
  },
  {
    id: 'novemberpogrom',
    term: 'Novemberpogrom',
    text: L(
      'In der Nacht vom 9. auf den 10. November 1938 zerstörten SA-Männer und andere Nazis in ganz Deutschland Synagogen, Geschäfte und Wohnungen von Juden. Etwa 30.000 jüdische Männer kamen in Lager. Die Nazis nannten es „Reichskristallnacht“, damit die Gewalt harmloser klingt.',
      'In der Nacht vom 9. auf den 10. November 1938 zerstörten SA und Parteianhänger in ganz Deutschland Synagogen, Geschäfte und Wohnungen jüdischer Menschen. Etwa 30.000 jüdische Männer wurden in Lager gebracht. Der Ausdruck „Reichskristallnacht“ verharmlost die Gewalt.',
    ),
  },
  {
    id: 'nuernberger-gesetze',
    term: 'Nürnberger Gesetze',
    text: L(
      'Gesetze vom September 1935. Sie nahmen jüdischen Deutschen viele Rechte. Juden und Nichtjuden durften nicht mehr heiraten.',
      'Gesetze vom September 1935. Sie nahmen jüdischen Deutschen die vollen Bürgerrechte und verboten Ehen zwischen Juden und Nichtjuden.',
    ),
  },
  {
    id: 'olympia',
    term: 'Olympische Spiele 1936',
    text: L(
      'Im August 1936 waren die Olympischen Spiele in Berlin. Die Nazis wollten der Welt ein friedliches Deutschland zeigen. Zwei Wochen lang verschwanden die Schilder gegen Juden.',
      'Im August 1936 fanden die Olympischen Spiele in Berlin statt. Das Regime nutzte sie, um der Welt ein friedliches Deutschland vorzuspielen. Für zwei Wochen verschwanden die Schilder gegen Juden.',
    ),
  },
  {
    id: 'propaganda',
    term: 'Propaganda',
    text: L(
      'Nachrichten, Bilder und Reden, die Menschen in eine bestimmte Richtung lenken sollen. Die Nazis kontrollierten Zeitungen, Radio und Kino. Sie erzählten Lügen so oft, bis viele sie glaubten.',
      'Gezielte Beeinflussung durch Nachrichten, Bilder, Reden und Feste. Das Regime kontrollierte Zeitungen, Rundfunk und Film über das Propagandaministerium von Joseph Goebbels. Es wiederholte Feindbilder so lange, bis viele sie für selbstverständlich hielten.',
    ),
  },
  {
    id: 'rassismus',
    term: 'Rassismus',
    text: L(
      'Die falsche Idee, dass Menschen in „Rassen“ eingeteilt werden können und manche mehr wert sind als andere. Die Nazis verfolgten deshalb Juden, Sinti und Roma und andere. Menschenrassen gibt es nicht. Alle Menschen sind gleich viel wert.',
      'Die Einteilung von Menschen in angebliche „Rassen“ mit unterschiedlichem Wert. Die NS-Rassenideologie hatte keine wissenschaftliche Grundlage, diente aber als Begründung für Ausgrenzung, Verfolgung und Mord an Juden, Sinti und Roma und anderen. Menschenrassen gibt es nicht.',
    ),
  },
  {
    id: 'reichskanzler',
    term: 'Reichskanzler',
    text: L(
      'Der Chef der Regierung im Deutschen Reich, so wie heute der Bundeskanzler. Der Reichspräsident hat ihn ernannt.',
      'Der Chef der Regierung im Deutschen Reich, vergleichbar mit dem heutigen Bundeskanzler. Ernannt wurde er vom Reichspräsidenten.',
    ),
  },
  {
    id: 'reichsmark',
    term: 'Reichsmark',
    text: L(
      'Das Geld im Deutschen Reich. Ein Arbeiter verdiente 1933 etwa 25 bis 30 Reichsmark in der Woche. Ein Brot kostete ungefähr 40 Pfennig.',
      'Das Geld im Deutschen Reich. Ein Arbeiter verdiente 1933 etwa 25 bis 30 Reichsmark in der Woche. Ein Brot kostete ungefähr 40 Pfennig.',
    ),
  },
  {
    id: 'reichstag',
    term: 'Reichstag',
    text: L(
      'Das Parlament im Deutschen Reich, also die gewählten Vertreter des Volkes. So heißt auch das Gebäude in Berlin. Heute arbeitet dort der Bundestag.',
      'Das Parlament des Deutschen Reiches, also die gewählte Volksvertretung. So heißt auch das Gebäude in Berlin, in dem es tagte. Heute sitzt dort der Bundestag.',
    ),
  },
  {
    id: 'sa',
    term: 'SA',
    text: L(
      'Die Sturmabteilung, eine Schlägertruppe der NSDAP in braunen Uniformen. Sie störte Versammlungen und verprügelte Gegner. 1933 wurde sie sogar zur Hilfspolizei.',
      'Die Sturmabteilung, der Kampfverband der NSDAP in braunen Uniformen. Sie störte Versammlungen, verprügelte Gegner und wurde 1933 sogar als Hilfspolizei eingesetzt. In ihren Kellern wurden Gefangene gefoltert.',
    ),
  },
  {
    id: 'scheinwahl',
    term: 'Scheinwahl',
    text: L(
      'Eine Wahl, bei der man nicht wirklich wählen kann. Ab 1933 gab es nur noch eine Partei auf dem Zettel. Wer Nein sagte oder nicht hinging, machte sich verdächtig.',
      'Eine Wahl, bei der es keine echte Auswahl gibt. Ab 1933 stand nur noch eine Liste zur Wahl. Wer mit Nein stimmte oder nicht hinging, machte sich verdächtig.',
    ),
  },
  {
    id: 'schutzhaft',
    term: 'Schutzhaft',
    text: L(
      'Ein Wort, das etwas Schlimmes harmlos klingen lässt. Angeblich sollte die Haft die Menschen schützen. In Wahrheit wurden sie ohne Gericht und ohne Anwalt eingesperrt, oft in Lagern. Niemand wusste, wie lange.',
      'Ein beschönigendes Wort: Angeblich sollte die Haft die Betroffenen vor dem „Volkszorn“ schützen. In Wahrheit wurden Menschen ohne Gerichtsverfahren und ohne Anwalt eingesperrt, oft in Konzentrationslagern, und niemand wusste, wie lange.',
    ),
  },
  {
    id: 'sinti-roma',
    term: 'Sinti und Roma',
    text: L(
      'Eine Minderheit, die seit Jahrhunderten in Deutschland lebt. Die Nazis verfolgten sie als angeblich fremde „Rasse“. Hunderttausende Sinti und Roma in Europa wurden ermordet.',
      'Eine Minderheit, die seit Jahrhunderten in Deutschland lebt. Die Nationalsozialisten verfolgten sie als angeblich fremde „Rasse“. Hunderttausende Sinti und Roma in Europa wurden ermordet.',
    ),
  },
  {
    id: 'solidaritaet',
    term: 'Solidarität',
    text: L(
      'Füreinander einstehen. Auch für Menschen, die man nicht kennt. Auch dann, wenn es einem selbst gut geht. Wer solidarisch ist, sagt nicht „Das ist nicht mein Problem“. Er hilft, wenn anderen Unrecht geschieht.',
      'Das Einstehen füreinander, auch für Menschen, die man nicht kennt, und auch dann, wenn man selbst nicht betroffen ist. Im Nationalsozialismus hieß Solidarität: Verfolgte verstecken, Familien von Gefangenen versorgen, bei jüdischen Nachbarn einkaufen. Sie war das Gegenteil von „Das geht mich nichts an“.',
    ),
  },
  {
    id: 'spd',
    term: 'SPD',
    text: L(
      'Die Sozialdemokratische Partei Deutschlands. Sie war für die Demokratie und für die Rechte der Arbeiter. Im Juni 1933 wurde sie verboten.',
      'Die Sozialdemokratische Partei Deutschlands. Sie trat für die Demokratie und die Rechte der Arbeiter ein und stimmte als einzige Partei gegen das Ermächtigungsgesetz. Im Juni 1933 wurde sie verboten.',
    ),
  },
  {
    id: 'spitzel',
    term: 'Spitzel',
    text: L(
      'Jemand, der andere heimlich beobachtet und an die Polizei verrät. Viele Verhaftungen begannen mit einer Anzeige von Nachbarn oder Kollegen.',
      'Jemand, der andere heimlich beobachtet und an die Polizei verrät. Die Gestapo setzte gezielt Spitzel in Widerstandsgruppen ein.',
    ),
  },
  {
    id: 'ss',
    term: 'SS',
    text: L(
      'Die Schutzstaffel der NSDAP in schwarzen Uniformen. Sie übernahm später die Konzentrationslager. Sie wurde die mächtigste und grausamste Organisation der Nazis.',
      'Die Schutzstaffel der NSDAP in schwarzen Uniformen. Sie übernahm die Konzentrationslager und wurde zur mächtigsten Organisation des Terrors. Sie organisierte den Völkermord an den europäischen Juden.',
    ),
  },
  {
    id: 'weimarer-republik',
    term: 'Weimarer Republik',
    text: L(
      'So heißt die erste Demokratie in Deutschland, von 1918 bis 1933. Frauen durften zum ersten Mal wählen. Es gab aber viel Not, Streit und Gewalt auf den Straßen.',
      'Die erste parlamentarische Demokratie in Deutschland von 1918 bis 1933, benannt nach der Stadt Weimar, wo 1919 die Verfassung beschlossen wurde. Sie brachte das Frauenwahlrecht und viele Freiheiten, litt aber unter Krisen, Straßengewalt und Gegnern von links und rechts.',
    ),
  },
  {
    id: 'weltwirtschaftskrise',
    term: 'Weltwirtschaftskrise',
    text: L(
      'Ab 1929 gingen auf der ganzen Welt Firmen und Banken pleite. In Deutschland waren 1932 etwa sechs Millionen Menschen ohne Arbeit. Viele hatten Hunger. Die Nazis versprachen einfache Lösungen und bekamen immer mehr Stimmen.',
      'Ab Oktober 1929 brach die Weltwirtschaft ein. In Deutschland stieg die Zahl der Arbeitslosen bis 1932 auf rund sechs Millionen. Not und Angst trieben viele zu den radikalen Parteien. Die NSDAP wuchs von 2,6 Prozent 1928 auf 37,3 Prozent im Juli 1932.',
    ),
  },
  {
    id: 'widerstand',
    term: 'Widerstand',
    text: L(
      'Alles, was Menschen taten, um sich dem Unrecht der Nazis entgegenzustellen. Das konnte ein Flugblatt sein, ein Versteck für Verfolgte oder einfach das Nein zum Mitmachen.',
      'Alles, was Menschen taten, um sich dem Unrecht der Nationalsozialisten entgegenzustellen: von der Weigerung, mitzumachen, über Hilfe für Verfolgte und Flugblätter bis zum Versuch, Hitler zu stürzen.',
    ),
  },
  {
    id: 'zensur',
    term: 'Zensur',
    text: L(
      'Der Staat bestimmt, was in Zeitungen, Büchern oder im Radio stehen darf. Ab 1933 durften die Zeitungen nur noch schreiben, was der Regierung gefiel.',
      'Wenn der Staat kontrolliert und verbietet, was in Zeitungen, Büchern oder im Radio gesagt werden darf. Ab 1933 durfte die Presse nur noch berichten, was der Regierung gefiel.',
    ),
  },
  {
    id: 'zeitzeuge',
    term: 'Zeitzeugin und Zeitzeuge',
    text: L(
      'Menschen, die eine Zeit selbst erlebt haben und davon erzählen. Im Spiel sind Zeitzeugenberichte echt und haben eine Quelle. Die Tagebuchnotizen der Gruppe sind dagegen erfunden.',
      'Menschen, die eine Zeit selbst erlebt haben und darüber berichten, etwa in Tagebüchern, Briefen oder Interviews. Solche Berichte sind wertvolle Quellen, aber immer auch persönlich gefärbt. Im Spiel sind Zeitzeugenberichte echt und belegt, die Tagebuchnotizen der Gruppe dagegen erfunden.',
    ),
  },
  {
    id: 'zivilcourage',
    term: 'Zivilcourage',
    text: L(
      'Mut im Alltag. Wer Zivilcourage hat, schaut nicht weg, wenn jemand schlecht behandelt wird. Er hilft oder holt Hilfe, auch wenn es unbequem ist.',
      'Mut im Alltag: für andere eintreten, wenn sie gedemütigt oder angegriffen werden, auch gegen die Mehrheit und auf eigenes Risiko. Zivilcourage war im Nationalsozialismus gefährlich. Heute ist sie eine Grundlage der Demokratie.',
    ),
  },
]

export function getLexiconEntry(id: string): LexiconEntry | undefined {
  return LEXICON.find((e) => e.id === id)
}
