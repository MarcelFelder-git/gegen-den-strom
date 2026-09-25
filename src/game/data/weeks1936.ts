import type { WeekData } from './weeks'

/*
 * Kapitel 2: 1936 bis 1938. Die Presse ist jetzt vollständig gleichgeschaltet,
 * die Zeitung schreibt im Ton des Regimes. Einordnung und Notiz sagen, was wirklich geschah.
 */
export const WEEKS_1936: WeekData[] = [
  // Woche 11
  {
    calendar: { day: 29, month: 'März', weekday: 'Sonntag', year: 1936 },
    intertitle: 'Berlin, März 1936. Drei Jahre sind vergangen. Deutsche Soldaten stehen im Rheinland, und das Volk soll zustimmen.',
    dateLabel: 'Woche vom 23. März 1936',
    paperDate: 'Montag, den 30. März 1936',
    headline: '98,8 vom Hundert für die Liste des Führers',
    subline: 'Nach dem Einmarsch deutscher Truppen in das Rheinland stimmt das Volk geschlossen zu.',
    lead:
      'Bei der gestrigen Reichstagswahl haben 98,8 vom Hundert der Wähler für die Liste der NSDAP gestimmt. Eine andere Liste gab es nicht, denn andere Parteien sind seit 1933 verboten. Am 7. März waren deutsche Truppen in das entmilitarisierte Rheinland eingerückt, obwohl der Vertrag von Versailles dies untersagt. Die Regierung wertet das Ergebnis als Bekenntnis des ganzen Volkes.',
    articles: [
      {
        headline: 'Kein Widerspruch aus Paris und London',
        body: 'Frankreich und England haben gegen den Einmarsch protestiert, aber keine Truppen geschickt. In Berlin spricht man von einem großen Erfolg.',
      },
      {
        headline: 'Das Reichssportfeld wächst',
        body: 'Im Westen der Stadt entsteht das neue Olympiastadion. Im August sollen hier die Olympischen Spiele eröffnet werden.',
      },
    ],
    illustration: 'urne',
    caption: 'Wahllokal in einer Berliner Schule',
    note: 'Im Wahllokal standen zwei SA-Männer neben der Urne. Wer in die Kabine ging, machte sich verdächtig. Die meisten haben ihr Kreuz offen auf dem Tisch gemacht.',
    context:
      'Seit 1933 war die NSDAP die einzige erlaubte Partei. Bei den „Wahlen“ gab es nur noch eine Liste, und wer nicht zur Wahl ging oder mit Nein stimmte, geriet schnell in Verdacht. Das Ergebnis von fast 99 Prozent zeigt deshalb nicht, was die Menschen wirklich dachten.',
    lexicon: ['scheinwahl', 'reichstag'],
    effects: { moral: -3 },
    moodText: 'Drei Jahre Diktatur. Wer widerspricht, steht fast allein.',
    event: {
      title: 'Der Blockwart',
      scene: 'Deine Wohnungstür, am Sonntagnachmittag.',
      speaker: 'Herr Kleinschmidt',
      speakerRole: 'Blockwart der Partei',
      portrait: { gender: 'm', face: 'rund', headwear: 'kurz', hairTone: 'grau', glasses: true, clothing: 'weste' },
      text:
        'Herr Kleinschmidt klingelt mit einer roten Sammelbüchse des Winterhilfswerks. Er sieht auf seine Liste. „{name}, Sie waren heute noch nicht wählen. Die anderen im Haus haben alle ihre Pflicht getan. Und für die Winterhilfe geben Sie doch sicher auch etwas?“ Er lächelt, aber seine Augen nicht.',
      choices: [
        {
          label: 'Wählen gehen und ungültig stimmen, dann zehn Pfennig in die Büchse',
          effects: { moral: 2 },
          result: 'Du gehst ins Wahllokal, machst kein Kreuz und steckst den leeren Zettel in die Urne. Herr Kleinschmidt hakt dich zufrieden auf seiner Liste ab. Niemand wird je erfahren, wie du gestimmt hast.',
        },
        {
          label: '„Ich gehe nicht. Und für Ihre Büchse habe ich nichts.“',
          effects: { moral: 6, heatLeader: 15 },
          result: 'Herr Kleinschmidt schreibt etwas auf. „Das werde ich melden müssen“, sagt er. Am Abend erzählen dir die Nachbarn, er habe nach dir gefragt.',
        },
        {
          label: 'Mitgehen und das Kreuz machen, das alle machen',
          effects: { moral: -5, heatLeader: -5 },
          result: 'Du machst dein Kreuz bei „Ja“, am offenen Tisch, wo alle zusehen. Auf dem Heimweg sprichst du kein Wort.',
        },
      ],
    },
  },
  // Woche 12
  {
    calendar: { day: 16, month: 'Juli', weekday: 'Donnerstag', year: 1936 },
    intertitle: '16. Juli 1936. Zwei Wochen vor den Olympischen Spielen holt die Polizei Hunderte Sinti und Roma aus ihren Wohnungen.',
    dateLabel: 'Woche vom 13. Juli 1936',
    paperDate: 'Freitag, den 17. Juli 1936',
    headline: 'Die Reichshauptstadt rüstet für die Olympischen Spiele',
    subline: 'Polizei bringt „Zigeuner“ in ein Lager am Stadtrand. Neues Lager bei Oranienburg im Bau.',
    lead:
      'In einer großangelegten Aktion hat die Polizei am gestrigen Donnerstag rund sechshundert Sinti und Roma aus der ganzen Stadt auf einen Platz bei den Rieselfeldern in Marzahn gebracht. Die Stadt solle den ausländischen Gästen „sauber“ gegenübertreten, heißt es aus dem Polizeipräsidium. Die Betroffenen dürfen das Lager nicht verlassen.',
    articles: [
      {
        headline: 'Neues Lager bei Oranienburg',
        body: 'Nördlich von Berlin, in Sachsenhausen bei Oranienburg, errichten Häftlinge ein großes neues Konzentrationslager. Es soll als Musterlager dienen.',
      },
      {
        headline: 'Fahnen in allen Straßen',
        body: 'Die Hausbesitzer sind aufgefordert, zu den Spielen zu flaggen. Die Straßen Unter den Linden werden mit Masten geschmückt.',
      },
    ],
    illustration: 'zaun',
    caption: 'Das Lager an den Rieselfeldern in Marzahn',
    note: 'Familie Franz aus der Nebenstraße ist fort. Herr Franz hat im Krieg für Deutschland gekämpft, die Kinder spielten mit unseren im Hof. Heute früh stand ein Polizeiwagen vor der Tür.',
    context:
      'Sinti und Roma lebten seit Jahrhunderten in Deutschland. Die Nationalsozialisten verfolgten sie als angeblich „fremde Rasse“. Vor den Olympischen Spielen 1936 wurden die Berliner Sinti und Roma in ein Zwangslager in Marzahn gebracht, zwischen Friedhof und Abwasserfeldern. Viele von ihnen wurden später in Auschwitz ermordet.',
    lexicon: ['sinti-roma', 'kz'],
    effects: { moral: -4 },
    moodText: 'Die Stadt putzt sich heraus. Wer nicht ins Bild passt, verschwindet.',
    event: {
      title: 'Hugo',
      scene: 'Die Laubenkolonie am Stadtrand, abends.',
      speaker: 'Hugo Franz',
      speakerRole: 'Nachbarsjunge, zwölf Jahre alt',
      portrait: { gender: 'm', face: 'schmal', headwear: 'schiebermuetze', hairTone: 'dunkel', glasses: false, clothing: 'arbeiterjacke' },
      text:
        'Zwischen den Lauben sitzt ein Junge und hält sich die Knie. Es ist Hugo, der Sohn der Familie Franz. „Ich war beim Bäcker, als sie kamen“, flüstert er. „Meine Eltern sind in Marzahn. Meine Tante wohnt in Hamburg. Aber allein komme ich nicht hin.“ Er sieht dich an. „Bitte sagen Sie es keinem.“',
      choices: [
        {
          label: 'Ihn verstecken und eine Fahrkarte nach Hamburg besorgen',
          needsKasse: 15,
          effects: { kasse: -15, moral: 10, heatLeader: 10 },
          result: 'Hugo schläft zwei Nächte in deiner Kammer. Dann bringt ihn jemand aus der Gruppe zum Lehrter Bahnhof. Eine Postkarte kommt nie an. Aber ein Bekannter aus Hamburg lässt ausrichten: Der Junge ist angekommen.',
        },
        {
          label: 'Ihn zum Lager bringen, damit er bei seinen Eltern ist',
          effects: { moral: -2 },
          result: 'Am Zaun in Marzahn fällt Hugo seiner Mutter um den Hals. Sie weint und dankt dir. Du fragst dich lange, ob das richtig war.',
        },
        {
          label: 'Ihm Brot und etwas Geld geben und gehen',
          needsKasse: 5,
          effects: { kasse: -5, moral: 1 },
          result: 'Hugo nimmt das Brot und verschwindet in der Dunkelheit. Du wirst nie erfahren, wohin er gegangen ist.',
        },
      ],
    },
  },
  // Woche 13
  {
    calendar: { day: 1, month: 'August', weekday: 'Sonnabend', year: 1936 },
    intertitle: '1. August 1936. Die Welt kommt nach Berlin. Für zwei Wochen soll sie ein freundliches Deutschland sehen.',
    dateLabel: 'Woche vom 3. August 1936',
    paperDate: 'Montag, den 3. August 1936',
    headline: 'Die Welt zu Gast in Berlin',
    subline: 'Feierliche Eröffnung der XI. Olympischen Spiele im neuen Olympiastadion.',
    lead:
      'Vor rund hunderttausend Zuschauern hat der Führer am Sonnabend die XI. Olympischen Spiele eröffnet. Sportler aus fast fünfzig Nationen zogen in das neue Stadion ein. Tausende ausländische Besucher und Journalisten sind in der Stadt. Sie loben die Ordnung, die Sauberkeit und die Gastfreundschaft der Berliner.',
    articles: [
      {
        headline: 'Berlin zeigt sich von seiner besten Seite',
        body: 'Die Stadt ist geschmückt, die Gaststätten sind voll. Überall hört man fremde Sprachen.',
      },
      {
        headline: 'Deutsche Mannschaft mit großen Hoffnungen',
        body: 'Die deutschen Sportler gehen als Favoriten in viele Wettbewerbe. Der Reichssportführer erwartet zahlreiche Medaillen.',
      },
    ],
    illustration: 'stadion',
    caption: 'Der Einzug der Mannschaften ins Olympiastadion',
    note: 'Die Schilder „Juden unerwünscht“ sind für zwei Wochen verschwunden, auch das am Gasthaus an der Ecke. Ein schwarzer Amerikaner namens Jesse Owens gewinnt in diesen Tagen vier Goldmedaillen, und das Stadion jubelt ihm zu.',
    context:
      'Die Nationalsozialisten nutzten die Olympischen Spiele 1936, um der Welt ein friedliches und weltoffenes Deutschland vorzuspielen. Antisemitische Schilder wurden abgenommen und die Presse sollte sich zurückhalten. Jüdische Sportlerinnen und Sportler durften für Deutschland nicht antreten. Nach den Spielen ging die Verfolgung weiter.',
    lexicon: ['olympia', 'antisemitismus'],
    effects: { moral: -2 },
    moodText: 'Für zwei Wochen trägt die Diktatur eine freundliche Maske.',
    event: {
      title: 'Der Journalist',
      scene: 'Ein Café am Kurfürstendamm, am Nachmittag.',
      speaker: 'Mr. Harold Wilson',
      speakerRole: 'Journalist aus London',
      portrait: { gender: 'm', face: 'schmal', headwear: 'fedora', hairTone: 'hell', glasses: true, clothing: 'trenchcoat' },
      text:
        'Ein Engländer setzt sich an deinen Tisch und spricht leise, mit starkem Akzent. „Man hat mir gesagt, Sie wissen Dinge. Alles hier sieht so ordentlich aus. Aber ich höre von Lagern, von Verhaftungen. Ist das wahr?“ Am Nebentisch sitzt ein Mann, der schon lange in dieselbe Zeitung starrt.',
      choices: [
        {
          label: 'Ihm auf der Toilette ein Bündel Flugblätter zustecken',
          effects: { moral: 8, supporters: 2, heatLeader: 12, items: { flugblaetter: -1 } },
          result: 'Mr. Wilson steckt das Bündel in seine Innentasche. Drei Wochen später bringt jemand aus der Gruppe eine englische Zeitung mit. Darin steht ein Bericht über Oranienburg und Marzahn.',
        },
        {
          label: 'Ihm eine Adresse aufschreiben, wo er mehr erfährt',
          check: { stat: 'heimlichkeit', min: 4 },
          effects: { moral: 6, supporters: 1 },
          result: 'Du schreibst die Adresse auf eine Serviette und lässt sie liegen. Der Mann am Nebentisch bemerkt nichts.',
          failEffects: { heatLeader: 20 },
          failResult: 'Als du gehst, faltet der Mann am Nebentisch seine Zeitung zusammen und folgt dir bis zur Straßenbahn.',
        },
        {
          label: '„Ich weiß nicht, wovon Sie sprechen.“',
          effects: { moral: -3 },
          result: 'Mr. Wilson nickt enttäuscht und zahlt. In seinem Bericht wird stehen, dass die Berliner mit ihrer Regierung zufrieden sind.',
        },
      ],
    },
  },
  // Woche 14
  {
    calendar: { day: 1, month: 'Juli', weekday: 'Donnerstag', year: 1937 },
    intertitle: '1. Juli 1937, früh am Morgen. Zwei Männer der Gestapo klingeln am Pfarrhaus in Dahlem.',
    dateLabel: 'Woche vom 28. Juni 1937',
    paperDate: 'Freitag, den 2. Juli 1937',
    headline: 'Pfarrer Niemöller in Haft genommen',
    subline: 'Der Dahlemer Pfarrer wird des Kanzelmissbrauchs beschuldigt.',
    lead:
      'Die Geheime Staatspolizei hat den Pfarrer Martin Niemöller aus Berlin-Dahlem festgenommen. Ihm wird vorgeworfen, von der Kanzel aus gegen den Staat gehetzt zu haben. Niemöller ist ein führender Kopf der sogenannten Bekennenden Kirche, die sich gegen die „Deutschen Christen“ stellt.',
    articles: [
      {
        headline: 'Weitere Pfarrer verhaftet',
        body: 'In diesem Jahr wurden im ganzen Reich zahlreiche Pfarrer der Bekennenden Kirche festgenommen oder mit Redeverbot belegt.',
      },
      {
        headline: 'Gottesdienste unter Aufsicht',
        body: 'In manchen Gemeinden sitzen Beamte der Staatspolizei in den Bänken und schreiben die Predigten mit.',
      },
    ],
    illustration: 'kirche',
    caption: 'Die Annenkirche in Berlin-Dahlem',
    note: 'In der Annenkirche wurden am Sonntag die Namen der verhafteten Pfarrer vorgelesen, einer nach dem anderen. Die Leute standen auf. Draußen notierte ein Mann in Zivil die Autonummern.',
    context:
      'Die meisten Christen passten sich an. Ein Teil der evangelischen Kirche, die „Bekennende Kirche“, wehrte sich aber gegen den Versuch, die Kirche gleichzuschalten. Martin Niemöller war einer ihrer Gründer. Er blieb bis 1945 in Konzentrationslagern gefangen und überlebte.',
    lexicon: ['bekennende-kirche', 'kz'],
    effects: { moral: -3 },
    moodText: 'Selbst die Kirche ist kein sicherer Ort mehr.',
    event: {
      title: 'Die Fürbittenliste',
      scene: 'Die Sakristei einer Kirche in Kreuzberg.',
      speaker: 'Schwester Marianne',
      speakerRole: 'Gemeindehelferin der Bekennenden Kirche',
      portrait: { gender: 'w', face: 'oval', headwear: 'welle', hairTone: 'grau', glasses: true, clothing: 'kleid' },
      text:
        'Schwester Marianne gibt dir einen zusammengefalteten Zettel. „Das ist die Fürbittenliste. Die Namen aller verhafteten Pfarrer. Sie wird am Sonntag in den Gottesdiensten vorgelesen, aber wir brauchen Abschriften für zwanzig Gemeinden. Die Post wird kontrolliert.“',
      choices: [
        {
          label: 'Die Abschriften selbst verteilen',
          effects: { moral: 6, supporters: 2, heatLeader: 10 },
          result: 'Du bringst die Listen mit dem Fahrrad von Gemeinde zu Gemeinde. Am Sonntag hören in zwanzig Kirchen Hunderte Menschen die Namen.',
        },
        {
          label: 'Die Liste abtippen und über Boten weitergeben',
          check: { stat: 'bildung', min: 3 },
          effects: { moral: 4, supporters: 1 },
          result: 'Auf der Schreibmaschine entstehen zwanzig saubere Abschriften. Die Boten sind unauffällige alte Damen mit Einkaufstaschen.',
          failEffects: { heatLeader: 10 },
          failResult: 'Eine Abschrift wird bei einer Botin gefunden. Sie verrät nichts, aber die Polizei fragt nun nach der Schreibmaschine.',
        },
      ],
    },
  },
  // Woche 15
  {
    calendar: { day: 10, month: 'April', weekday: 'Sonntag', year: 1938 },
    intertitle: 'März 1938. Deutsche Truppen marschieren in Österreich ein. Einen Monat später soll das Volk Ja sagen.',
    dateLabel: 'Woche vom 11. April 1938',
    paperDate: 'Montag, den 11. April 1938',
    headline: 'Über 99 vom Hundert sagen Ja',
    subline: 'Volksabstimmung bestätigt die Wiedervereinigung Österreichs mit dem Reich.',
    lead:
      'Bei der gestrigen Volksabstimmung haben im ganzen Reich über 99 vom Hundert der Wähler der Vereinigung Österreichs mit dem Deutschen Reich zugestimmt. Am 12. März waren deutsche Truppen in Österreich einmarschiert und von vielen Menschen mit Blumen begrüßt worden. Am 15. März sprach der Führer in Wien vor einer riesigen Menschenmenge.',
    articles: [
      {
        headline: 'Säuberung in Wien',
        body: 'In Wien hat die Staatspolizei in den vergangenen Wochen Tausende Gegner des neuen Staates festgenommen. Jüdische Bürger mussten unter dem Gelächter von Zuschauern die Straßen schrubben.',
      },
      {
        headline: 'Erste Transporte nach Dachau',
        body: 'Am 1. April wurden bekannte österreichische Politiker und Beamte in das Lager Dachau gebracht.',
      },
    ],
    illustration: 'grenze',
    caption: 'Ein Schlagbaum an der früheren Grenze',
    note: 'Auf dem Stimmzettel stand eine einzige Frage, und der Kreis für Ja war viel größer gedruckt. Onkel Paul hat gesagt, man könne ja Nein ankreuzen. Tante Grete hat ihn angesehen, und dann hat er nichts mehr gesagt.',
    context:
      'Im März 1938 besetzte Deutschland Österreich. Man nannte das „Anschluss“. Schon in den ersten Tagen wurden in Wien Tausende Menschen verhaftet und jüdische Bürgerinnen und Bürger öffentlich gedemütigt. Die Abstimmung einen Monat später war nicht frei.',
    lexicon: ['anschluss', 'scheinwahl'],
    effects: { moral: -3 },
    moodText: 'Das Reich wird größer. Die Angst auch.',
    event: {
      title: 'Die Wahlkabine',
      scene: 'Das Wahllokal in einer Schule, Sonntag, der 10. April.',
      speaker: 'Frau Pagel',
      speakerRole: 'Hauswartsfrau, jetzt Wahlhelferin',
      portrait: { gender: 'w', face: 'rund', headwear: 'welle', hairTone: 'grau', glasses: true, clothing: 'kleid' },
      text:
        'Frau Pagel sitzt am Tisch mit den Stimmzetteln, eine Armbinde am Ärmel. Sie reicht dir den Zettel und sagt laut, so dass alle es hören: „Die Kabine brauchen Sie ja nicht, {name}.“ Dann, ganz leise: „Oder doch?“',
      choices: [
        {
          label: 'In die Kabine gehen und Nein ankreuzen',
          effects: { moral: 8, heatLeader: 15 },
          result: 'Du gehst in die Kabine. Hinter dir wird es still. Du machst dein Kreuz bei Nein. Frau Pagel sieht dich nicht an, als du den Zettel einwirfst. Aber sie lächelt kaum merklich.',
        },
        {
          label: 'Am Tisch das Kreuz bei Ja machen',
          effects: { moral: -4, heatLeader: -5 },
          result: 'Du machst dein Kreuz am offenen Tisch. Frau Pagel nickt. „Ordentlich“, sagt sie laut. Du glaubst, Enttäuschung in ihrem Gesicht zu sehen.',
        },
      ],
    },
  },
  // Woche 16
  {
    calendar: { day: 17, month: 'August', weekday: 'Mittwoch', year: 1938 },
    intertitle: 'August 1938. Ein neues Gesetz nimmt jüdischen Menschen sogar ihren Namen.',
    dateLabel: 'Woche vom 15. August 1938',
    paperDate: 'Donnerstag, den 18. August 1938',
    headline: 'Neue Vorschriften über die Vornamen der Juden',
    subline: 'Ab 1. Januar 1939 müssen Juden zusätzlich die Vornamen „Israel“ oder „Sara“ führen.',
    lead:
      'Nach einer neuen Verordnung des Reichsinnenministers müssen Juden, die keinen als jüdisch geltenden Vornamen tragen, ab dem 1. Januar 1939 einen weiteren Vornamen annehmen: Männer den Namen „Israel“, Frauen den Namen „Sara“. Die Änderung ist beim Standesamt zu melden.',
    articles: [
      {
        headline: 'Aktion gegen „Asoziale“',
        body: 'Im Juni hat die Polizei in Berlin Tausende Menschen als „asozial“ festgenommen, darunter viele Juden. Sie wurden in Konzentrationslager gebracht.',
      },
      {
        headline: 'Spannung um die Tschechoslowakei',
        body: 'Die Lage an der Grenze zur Tschechoslowakei spitzt sich zu. In den Zeitungen ist täglich von der Not der Sudetendeutschen die Rede.',
      },
    ],
    illustration: 'pass',
    caption: 'Ein Reisepass',
    note: 'Dr. Löwenthal, unser Hausarzt, darf ab Oktober keine Patienten mehr behandeln. Er hat mir die Hand gegeben und gesagt: „Jetzt wissen Sie wenigstens auf jedem Formular, wer ich bin.“',
    context:
      'Schritt für Schritt nahmen die Nationalsozialisten jüdischen Menschen ihre Rechte: Arbeit, Besitz, Schule und sogar den eigenen Namen. Ab Oktober 1938 wurde in ihre Pässe ein rotes „J“ gestempelt. Viele versuchten jetzt verzweifelt, Deutschland zu verlassen, doch kaum ein Land wollte sie aufnehmen.',
    lexicon: ['antisemitismus', 'kindertransport'],
    effects: { moral: -3 },
    moodText: 'Die Ausgrenzung wird täglich enger.',
    event: {
      title: 'Auf dem Standesamt',
      scene: 'Der Flur eines Standesamts in Mitte.',
      speaker: 'Frau Levy',
      speakerRole: 'Nachbarin aus dem dritten Stock',
      portrait: { gender: 'w', face: 'oval', headwear: 'glocke', hairTone: 'dunkel', glasses: false, clothing: 'trenchcoat' },
      text:
        'Frau Levy steht im Flur des Standesamts und hält ein Formular in der Hand. Ihre Hände zittern. „Sie wollen, dass ich unterschreibe, dass ich jetzt Sara heiße. Ich heiße Clara. Seit sechzig Jahren.“ Hinter dem Schalter sieht ein Beamter ungeduldig auf die Uhr.',
      choices: [
        {
          label: 'Bei ihr bleiben und ihre Hand halten, während sie unterschreibt',
          effects: { moral: 5, heatLeader: 5 },
          result: 'Du bleibst neben ihr stehen. Der Beamte sieht dich lange an. Frau Levy unterschreibt mit fester Schrift. Draußen sagt sie: „Für Sie bleibe ich Clara.“',
        },
        {
          label: 'Ihr versprechen, mit ihr nach Wegen ins Ausland zu suchen',
          effects: { moral: 4, flags: ['levy'] },
          result: 'Frau Levy hat einen Sohn in New York. Du versprichst, ihr bei den Papieren zu helfen. In der Stadtkarte erscheinen jetzt Aufträge zur Ausreise.',
        },
      ],
    },
  },
  // Woche 17
  {
    calendar: { day: 9, month: 'November', weekday: 'Mittwoch', year: 1938 },
    intertitle: 'Die Nacht vom 9. auf den 10. November 1938. In ganz Deutschland brennen die Synagogen.',
    dateLabel: 'Woche vom 7. November 1938',
    paperDate: 'Freitag, den 11. November 1938',
    headline: '„Spontane Kundgebungen“ gegen die Juden',
    subline: 'Nach dem Tod des Gesandtschaftsrats vom Rath in Paris.',
    lead:
      'Nach dem Tod des deutschen Diplomaten Ernst vom Rath, auf den ein junger Jude in Paris geschossen hatte, kam es in der Nacht zum 10. November im ganzen Reich zu Aktionen gegen jüdische Geschäfte und Synagogen. Reichsminister Dr. Goebbels spricht von der „berechtigten Empörung des Volkes“ und hat zur Ruhe aufgerufen.',
    articles: [
      {
        headline: 'Zahlreiche Festnahmen',
        body: 'Im ganzen Reich wurden jüdische Männer in Schutzhaft genommen. Viele von ihnen wurden in die Lager Sachsenhausen, Buchenwald und Dachau gebracht.',
      },
      {
        headline: 'Scherben in der Tauentzienstraße',
        body: 'In den Geschäftsstraßen der Stadt liegen die Scherben zerschlagener Schaufenster. Die Aufräumarbeiten dauern an.',
      },
    ],
    illustration: 'synagoge',
    caption: 'Eine Berliner Synagoge in der Nacht zum 10. November',
    note: 'Es war kein Volkszorn. Die SA kam in Lastwagen, mit Benzinkanistern und Äxten. In der Oranienburger Straße hat ein Polizist die Feuerwehr gerufen und die Brandstifter fortgejagt. Die Neue Synagoge steht noch.',
    context:
      'In der Nacht vom 9. auf den 10. November 1938 zerstörten SA und Parteianhänger im ganzen Reich Synagogen, Geschäfte und Wohnungen jüdischer Menschen. In Berlin brannten elf von vierzehn Synagogen. Etwa 30.000 jüdische Männer wurden in Konzentrationslager verschleppt, Hunderte Menschen starben. Die meisten Deutschen schauten zu oder weg.',
    lexicon: ['novemberpogrom', 'kz'],
    effects: { moral: -8, flags: ['levy'] },
    moodText: 'Das Schlimmste geschieht nicht mehr im Verborgenen.',
    event: {
      title: 'Herr Rosenthal',
      scene: 'Deine Wohnungstür, zwei Uhr nachts. Draußen klirrt Glas.',
      speaker: 'Herr Rosenthal',
      speakerRole: 'Kaufmann aus der Grenadierstraße',
      portrait: { gender: 'm', face: 'oval', headwear: 'fedora', hairTone: 'grau', glasses: true, clothing: 'weste' },
      text:
        'Vor deiner Tür steht Herr Rosenthal, der Kaufmann aus der Grenadierstraße, im Mantel über dem Nachthemd. Sein Laden ist zerschlagen, seine Wohnung auch. „Sie holen alle Männer ab, {name}. Meine Frau ist bei ihrer Schwester. Ich wusste nicht, wohin.“ Unten auf der Straße ruft jemand Befehle.',
      choices: [
        {
          label: 'Ihn hereinlassen und verstecken, bis es vorbei ist',
          effects: { moral: 12, heatLeader: 20 },
          result: 'Herr Rosenthal verbringt drei Tage in deiner Kammer. Er spricht kaum, er betet leise. Als die Verhaftungen nachlassen, holt ihn seine Frau. „Das vergessen wir Ihnen nie“, sagt sie.',
        },
        {
          label: 'Ihm Geld geben und den Weg zu Freunden aus der Gruppe zeigen',
          needsKasse: 15,
          effects: { kasse: -15, moral: 6, heatLeader: 5 },
          result: 'Du gibst ihm fünfzehn Reichsmark und eine Adresse in Neukölln. Er drückt deine Hand und verschwindet im Dunkeln. Zwei Tage später erfährst du: Er ist dort angekommen.',
        },
        {
          label: 'Die Tür nicht öffnen',
          effects: { moral: -12 },
          result: 'Du stehst hinter der Tür, bis seine Schritte verklingen. Am nächsten Tag hörst du, dass viele Männer aus der Grenadierstraße nach Sachsenhausen gebracht wurden.',
        },
      ],
    },
  },
  // Woche 18
  {
    calendar: { day: 1, month: 'Dezember', weekday: 'Donnerstag', year: 1938 },
    intertitle: '1. Dezember 1938, Bahnhof Friedrichstraße. Ein Zug mit fast zweihundert Kindern fährt nach England. Ohne ihre Eltern.',
    dateLabel: 'Woche vom 28. November 1938',
    paperDate: 'Freitag, den 2. Dezember 1938',
    headline: 'Juden aus dem Kulturleben ausgeschlossen',
    subline: 'Theater, Kinos, Konzerte und Ausstellungen für Juden verboten. Jüdische Kinder verlassen die deutschen Schulen.',
    lead:
      'Juden ist der Besuch von Theatern, Kinos, Konzerten und Ausstellungen ab sofort untersagt. Jüdische Kinder dürfen keine deutschen Schulen mehr besuchen. Die Maßnahmen folgen auf die Ereignisse vom 10. November. Den Juden wurde zudem eine „Sühneleistung“ von einer Milliarde Reichsmark auferlegt.',
    articles: [
      {
        headline: 'Abreise jüdischer Kinder',
        body: 'Gestern verließ ein Zug mit jüdischen Kindern Berlin in Richtung Holland. Die Kinder sollen in England untergebracht werden.',
      },
      {
        headline: 'Die Winterhilfe sammelt',
        body: 'Auf allen Plätzen der Stadt klappern die Sammelbüchsen des Winterhilfswerks. Jeder Volksgenosse ist aufgerufen zu geben.',
      },
    ],
    illustration: 'zug',
    caption: 'Ein Zug nach Hoek van Holland',
    note: 'Heute früh am Bahnhof Friedrichstraße: Hunderte Eltern, die winkten. Keiner hat geweint, solange der Zug noch zu sehen war. Danach haben alle geweint.',
    context:
      'Nach dem Novemberpogrom nahm Großbritannien etwa 10.000 jüdische Kinder aus Deutschland, Österreich und der Tschechoslowakei auf. Die Kinder durften nur einen Koffer mitnehmen. Ihre Eltern mussten zurückbleiben. Die meisten Kinder sahen ihre Eltern nie wieder, weil diese später ermordet wurden.',
    lexicon: ['kindertransport', 'novemberpogrom'],
    effects: { moral: -4 },
    moodText: 'Wer helfen will, muss sich jetzt entscheiden.',
    event: {
      title: 'Der Koffer',
      scene: 'Eine Wohnung in der Grenadierstraße, am Abend vor der Abreise.',
      speaker: 'Frau Salomon',
      speakerRole: 'Mutter eines Kindes auf der Liste',
      portrait: { gender: 'w', face: 'schmal', headwear: 'kurz', hairTone: 'dunkel', glasses: false, clothing: 'kleid' },
      text:
        'Frau Salomon packt den Koffer ihrer Tochter Lea, acht Jahre alt. Ein Koffer, eine Tasche, zehn Reichsmark, mehr ist nicht erlaubt. „Mein Mann ist noch in Sachsenhausen“, sagt sie. „Ich kann nicht mit zum Bahnhof. Wenn ich sie gehen sehe, lasse ich sie nicht los.“ Sie sieht dich an. „Würden Sie sie bringen?“',
      choices: [
        {
          label: 'Lea zum Bahnhof bringen',
          effects: { moral: 10, heatLeader: 5 },
          result: 'Am Bahnhof Friedrichstraße hält Lea deine Hand, bis der Zug einfährt. Sie winkt nicht, sie sieht nur. Im Frühjahr kommt eine Postkarte aus England: „Mir geht es gut. Sag Mama, ich lerne Englisch.“',
        },
        {
          label: 'Frau Salomon Mut machen, selbst zu gehen',
          check: { stat: 'empathie', min: 4 },
          effects: { moral: 8 },
          result: 'Ihr redet die halbe Nacht. Am Morgen steht Frau Salomon selbst am Bahnsteig. Sie lässt Lea los. Du stehst neben ihr, als der Zug abfährt.',
          failEffects: { moral: 2 },
          failResult: 'Frau Salomon schafft es nicht. Eine Nachbarin bringt Lea zum Zug. Frau Salomon sitzt den ganzen Tag am Fenster.',
        },
      ],
    },
  },
]
