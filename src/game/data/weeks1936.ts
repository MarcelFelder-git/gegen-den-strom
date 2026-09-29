import { L } from '../text'
import type { WeekData } from './weeks'

/*
 * Kapitel 2: 1936 bis 1938. Die Presse ist jetzt vollständig gleichgeschaltet,
 * die Zeitung schreibt im Ton des Regimes. Einordnung und Notiz sagen, was wirklich geschah.
 */
export const WEEKS_1936: WeekData[] = [
  // Woche 11
  {
    calendar: { day: 29, month: 'März', weekday: 'Sonntag', year: 1936 },
    intertitle: L(
      'Berlin, März 1936. Drei Jahre sind vergangen. Es gibt nur noch eine Partei. Und alle sollen Ja sagen.',
      'Berlin, März 1936. Drei Jahre sind vergangen. Deutsche Soldaten stehen im Rheinland, und das Volk soll zustimmen.',
    ),
    dateLabel: 'Woche vom 23. März 1936',
    paperDate: 'Montag, den 30. März 1936',
    headline: L('98,8 Prozent für die Liste des Führers', '98,8 vom Hundert für die Liste des Führers'),
    subline: L(
      'Deutsche Soldaten sind ins Rheinland einmarschiert. Jetzt sollte das Volk zustimmen.',
      'Nach dem Einmarsch deutscher Truppen in das Rheinland stimmt das Volk geschlossen zu.',
    ),
    lead: L(
      'Bei der Wahl am Sonntag haben 98,8 Prozent für die NSDAP gestimmt. Eine andere Partei stand nicht auf dem Stimmzettel. Alle anderen Parteien sind seit 1933 verboten. Am 7. März sind deutsche Soldaten ins Rheinland einmarschiert. Das war nach einem Vertrag eigentlich verboten.',
      'Bei der gestrigen Reichstagswahl haben 98,8 vom Hundert der Wähler für die Liste der NSDAP gestimmt. Eine andere Liste gab es nicht, denn andere Parteien sind seit 1933 verboten. Am 7. März waren deutsche Truppen in das entmilitarisierte Rheinland eingerückt, obwohl der Vertrag von Versailles dies untersagt. Die Regierung wertet das Ergebnis als Bekenntnis des ganzen Volkes.',
    ),
    articles: [
      {
        headline: 'Kein Widerspruch aus Paris und London',
        body: L(
          'Frankreich und England haben protestiert. Aber sie haben keine Soldaten geschickt. In Berlin spricht man von einem großen Erfolg.',
          'Frankreich und England haben gegen den Einmarsch protestiert, aber keine Truppen geschickt. In Berlin spricht man von einem großen Erfolg.',
        ),
      },
      {
        headline: 'Das Reichssportfeld wächst',
        body: L(
          'Im Westen der Stadt wird ein neues Stadion gebaut. Im August sollen hier die Olympischen Spiele beginnen.',
          'Im Westen der Stadt entsteht das neue Olympiastadion. Im August sollen hier die Olympischen Spiele eröffnet werden.',
        ),
      },
    ],
    illustration: 'urne',
    caption: 'Wahllokal in einer Berliner Schule',
    note: L(
      'Im Wahllokal standen zwei SA-Männer neben der Urne. Wer in die Kabine ging, machte sich verdächtig. Die meisten haben ihr Kreuz offen auf dem Tisch gemacht.',
      'Im Wahllokal standen zwei SA-Männer neben der Urne. Wer in die Kabine ging, machte sich verdächtig. Die meisten haben ihr Kreuz offen auf dem Tisch gemacht.',
    ),
    voice: L(
      '„Mir geht es doch gut. Ich hab Arbeit, die Straßen sind sicher. Warum soll ich Nein sagen?“',
      '„Mir geht es doch gut. Ich habe wieder Arbeit, die Straßen sind ruhig. Warum sollte ich mich da querstellen?“',
    ),
    context: L(
      'Seit 1933 war die NSDAP die einzige erlaubte Partei. Bei den „Wahlen“ gab es nur noch eine Liste. Wer nicht wählen ging oder Nein sagte, geriet in Verdacht. Deshalb zeigen die 99 Prozent nicht, was die Menschen wirklich dachten. Viele, denen es gut ging, machten einfach mit.',
      'Seit 1933 war die NSDAP die einzige erlaubte Partei. Bei den „Wahlen“ gab es nur noch eine Liste, und wer nicht zur Wahl ging oder mit Nein stimmte, geriet schnell in Verdacht. Das Ergebnis von fast 99 Prozent zeigt deshalb nicht, was die Menschen wirklich dachten. Es zeigt aber auch: Viele, denen es wirtschaftlich besser ging, hatten sich mit dem Regime arrangiert.',
    ),
    reflect: L(
      'Ein Nachbar sagt: „Mir geht es doch gut. Warum soll ich Nein sagen?“ Was würdest du ihm antworten?',
      '„Mir geht es doch gut“: Warum kann gerade Zufriedenheit dazu führen, dass Menschen Unrecht an anderen hinnehmen?',
    ),
    lexicon: ['scheinwahl', 'reichstag', 'diktatur', 'mitlaeufer'],
    effects: { moral: -3 },
    moodText: L('Drei Jahre Diktatur. Wer Nein sagt, steht fast allein.', 'Drei Jahre Diktatur. Wer widerspricht, steht fast allein.'),
    event: {
      title: 'Der Blockwart',
      scene: L('Deine Wohnungstür, am Sonntagnachmittag.', 'Deine Wohnungstür, am Sonntagnachmittag.'),
      speaker: 'Herr Kleinschmidt',
      speakerRole: L('Blockwart der Partei, er überwacht das Haus', 'Blockwart der Partei'),
      portrait: { gender: 'm', face: 'rund', headwear: 'kurz', hairTone: 'grau', glasses: true, clothing: 'weste' },
      text: L(
        'Herr Kleinschmidt klingelt. Er hat eine Sammelbüchse in der Hand und eine Liste. „{name}, Sie waren heute noch nicht wählen. Alle anderen im Haus waren schon da. Und für die Winterhilfe geben Sie doch sicher auch etwas?“ Er lächelt. Aber seine Augen lächeln nicht.',
        'Herr Kleinschmidt klingelt mit einer roten Sammelbüchse des Winterhilfswerks. Er sieht auf seine Liste. „{name}, Sie waren heute noch nicht wählen. Die anderen im Haus haben alle ihre Pflicht getan. Und für die Winterhilfe geben Sie doch sicher auch etwas?“ Er lächelt, aber seine Augen nicht.',
      ),
      choices: [
        {
          label: L('Wählen gehen, ungültig stimmen und zehn Pfennig geben', 'Wählen gehen und ungültig stimmen, dann zehn Pfennig in die Büchse'),
          effects: { moral: 2 },
          result: L(
            'Du gehst ins Wahllokal. Du machst kein Kreuz und steckst den leeren Zettel in die Urne. Herr Kleinschmidt hakt dich zufrieden ab. Niemand wird erfahren, wie du gestimmt hast.',
            'Du gehst ins Wahllokal, machst kein Kreuz und steckst den leeren Zettel in die Urne. Herr Kleinschmidt hakt dich zufrieden auf seiner Liste ab. Niemand wird je erfahren, wie du gestimmt hast.',
          ),
        },
        {
          label: '„Ich gehe nicht. Und für Ihre Büchse habe ich nichts.“',
          effects: { moral: 6, heatLeader: 15 },
          result: L(
            'Herr Kleinschmidt schreibt etwas auf. „Das muss ich melden“, sagt er. Am Abend erzählen dir die Nachbarn: Er hat nach dir gefragt.',
            'Herr Kleinschmidt schreibt etwas auf. „Das werde ich melden müssen“, sagt er. Am Abend erzählen dir die Nachbarn, er habe nach dir gefragt.',
          ),
        },
        {
          label: L('Mitgehen und das Kreuz machen, wie alle', 'Mitgehen und das Kreuz machen, das alle machen'),
          effects: { moral: -5, heatLeader: -5 },
          result: L(
            'Du machst dein Kreuz bei „Ja“, am offenen Tisch. Alle sehen zu. Auf dem Heimweg sagst du kein Wort.',
            'Du machst dein Kreuz bei „Ja“, am offenen Tisch, wo alle zusehen. Auf dem Heimweg sprichst du kein Wort.',
          ),
        },
      ],
    },
  },
  // Woche 12
  {
    calendar: { day: 16, month: 'Juli', weekday: 'Donnerstag', year: 1936 },
    intertitle: L(
      '16. Juli 1936. Kurz vor den Olympischen Spielen holt die Polizei Hunderte Sinti und Roma aus ihren Wohnungen.',
      '16. Juli 1936. Zwei Wochen vor den Olympischen Spielen holt die Polizei Hunderte Sinti und Roma aus ihren Wohnungen.',
    ),
    dateLabel: 'Woche vom 13. Juli 1936',
    paperDate: 'Freitag, den 17. Juli 1936',
    headline: L('Berlin macht sich bereit für die Olympischen Spiele', 'Die Reichshauptstadt rüstet für die Olympischen Spiele'),
    subline: L(
      'Die Polizei bringt Sinti und Roma in ein Lager am Stadtrand. Die Zeitung nennt sie „Zigeuner“.',
      'Polizei bringt „Zigeuner“ in ein Lager am Stadtrand. Neues Lager bei Oranienburg im Bau.',
    ),
    lead: L(
      'Am Donnerstag hat die Polizei rund sechshundert Sinti und Roma aus der ganzen Stadt geholt. Sie wurden auf einen Platz in Marzahn gebracht. Dort sind nur ein Friedhof und Felder mit Abwasser. Die Stadt soll für die Gäste aus dem Ausland „sauber“ aussehen, sagt die Polizei. Die Menschen dürfen das Lager nicht verlassen.',
      'In einer großangelegten Aktion hat die Polizei am gestrigen Donnerstag rund sechshundert Sinti und Roma aus der ganzen Stadt auf einen Platz bei den Rieselfeldern in Marzahn gebracht. Die Stadt solle den ausländischen Gästen „sauber“ gegenübertreten, heißt es aus dem Polizeipräsidium. Die Betroffenen dürfen das Lager nicht verlassen.',
    ),
    articles: [
      {
        headline: 'Neues Lager bei Oranienburg',
        body: L(
          'Nördlich von Berlin, in Sachsenhausen, müssen Häftlinge ein großes neues Konzentrationslager bauen.',
          'Nördlich von Berlin, in Sachsenhausen bei Oranienburg, errichten Häftlinge ein großes neues Konzentrationslager. Es soll als Musterlager dienen.',
        ),
      },
      {
        headline: 'Fahnen in allen Straßen',
        body: L(
          'Alle Hausbesitzer sollen zu den Spielen Fahnen aufhängen. Unter den Linden werden Fahnenmasten aufgestellt.',
          'Die Hausbesitzer sind aufgefordert, zu den Spielen zu flaggen. Die Straße Unter den Linden wird mit Masten geschmückt.',
        ),
      },
    ],
    illustration: 'zaun',
    caption: 'Das Lager an den Rieselfeldern in Marzahn',
    note: L(
      'Familie Franz aus der Nebenstraße ist fort. Herr Franz hat im Krieg für Deutschland gekämpft. Die Kinder haben mit unseren im Hof gespielt. Heute früh stand ein Polizeiwagen vor der Tür.',
      'Familie Franz aus der Nebenstraße ist fort. Herr Franz hat im Krieg für Deutschland gekämpft, die Kinder spielten mit unseren im Hof. Heute früh stand ein Polizeiwagen vor der Tür.',
    ),
    voice: L(
      '„Die sind jetzt eben woanders. Mich betrifft das ja nicht.“',
      '„Die sind jetzt eben am Stadtrand. Für die Spiele muss die Stadt ordentlich aussehen, das versteht doch jeder.“',
    ),
    witnessIntro: L(
      'Otto Rosenberg war 1936 neun Jahre alt. Er musste mit seiner Familie ins Lager Marzahn. Später erzählte er:',
      'Otto Rosenberg, geboren 1927, wurde 1936 mit seiner Familie nach Marzahn verschleppt. Von den Kindern der Familie überlebte nur er die Lager. Er erinnerte sich:',
    ),
    witnesses: [
      {
        who: L('Otto Rosenberg, Berliner Sinto', 'Otto Rosenberg, Berliner Sinto, in seinen Erinnerungen „Das Brennglas“ (1998)'),
        text: '„Wir waren seit jeher, solange ich denken kann und nach allem, was mir erzählt worden ist, deutsche Sinti.“',
        source: 'Otto Rosenberg: Das Brennglas, zitiert nach der Gedenkstätte Zwangslager Marzahn',
        url: 'https://www.gedenkstaette-zwangslager-marzahn.de/rundgang/otto-rosenberg.html',
      },
    ],
    context: L(
      'Sinti und Roma leben seit Jahrhunderten in Deutschland. Die Nazis verfolgten sie, weil sie angeblich eine fremde „Rasse“ seien. Vor den Olympischen Spielen 1936 brachte die Polizei die Berliner Sinti und Roma in ein Zwangslager in Marzahn. Es lag zwischen Friedhof und Abwasserfeldern. Viele von ihnen wurden später in Auschwitz ermordet.',
      'Sinti und Roma lebten seit Jahrhunderten in Deutschland. Die Nationalsozialisten verfolgten sie aus rassistischen Gründen als angeblich „fremde Rasse“. Vor den Olympischen Spielen 1936 wurden die Berliner Sinti und Roma in ein Zwangslager in Marzahn gebracht, zwischen Friedhof und Abwasserfeldern. „Rasseforscher“ untersuchten sie dort. Viele wurden später nach Auschwitz deportiert und ermordet.',
    ),
    reflect: L(
      'Familie Franz war auf einmal weg. Warum haben so wenige Nachbarn gefragt, wo sie ist?',
      'Die Verschleppung nach Marzahn geschah am helllichten Tag. Warum fiel es vielen so leicht, nicht nachzufragen?',
    ),
    lexicon: ['sinti-roma', 'kz', 'rassismus'],
    effects: { moral: -4 },
    moodText: L(
      'Die Stadt wird herausgeputzt. Wer nicht ins Bild passt, verschwindet.',
      'Die Stadt putzt sich heraus. Wer nicht ins Bild passt, verschwindet.',
    ),
    event: {
      title: 'Hugo',
      scene: L('Eine Kleingartensiedlung am Stadtrand, abends.', 'Die Laubenkolonie am Stadtrand, abends.'),
      speaker: 'Hugo Franz',
      speakerRole: L('Nachbarsjunge, zwölf Jahre alt', 'Nachbarsjunge, zwölf Jahre alt'),
      portrait: { gender: 'm', face: 'schmal', headwear: 'schiebermuetze', hairTone: 'dunkel', glasses: false, clothing: 'arbeiterjacke' },
      text: L(
        'Zwischen den Gartenhäuschen sitzt ein Junge und hält sich die Knie. Es ist Hugo, der Sohn der Familie Franz. „Ich war beim Bäcker, als sie kamen“, flüstert er. „Meine Eltern sind jetzt in Marzahn. Meine Tante wohnt in Hamburg. Aber allein komme ich nicht hin.“ Er sieht dich an. „Bitte sagen Sie es keinem.“',
        'Zwischen den Lauben sitzt ein Junge und hält sich die Knie. Es ist Hugo, der Sohn der Familie Franz. „Ich war beim Bäcker, als sie kamen“, flüstert er. „Meine Eltern sind in Marzahn. Meine Tante wohnt in Hamburg. Aber allein komme ich nicht hin.“ Er sieht dich an. „Bitte sagen Sie es keinem.“',
      ),
      choices: [
        {
          label: L('Ihn verstecken und eine Fahrkarte nach Hamburg kaufen', 'Ihn verstecken und eine Fahrkarte nach Hamburg besorgen'),
          needsKasse: 15,
          effects: { kasse: -15, moral: 10, heatLeader: 10, helped: 1 },
          result: L(
            'Hugo schläft zwei Nächte in deiner Kammer. Dann bringt ihn jemand aus der Gruppe zum Bahnhof. Später kommt eine Nachricht aus Hamburg: Der Junge ist angekommen.',
            'Hugo schläft zwei Nächte in deiner Kammer. Dann bringt ihn jemand aus der Gruppe zum Lehrter Bahnhof. Eine Postkarte kommt nie an. Aber ein Bekannter aus Hamburg lässt ausrichten: Der Junge ist angekommen.',
          ),
        },
        {
          label: L('Ihn zum Lager bringen, damit er bei seinen Eltern ist', 'Ihn zum Lager bringen, damit er bei seinen Eltern ist'),
          effects: { moral: -2 },
          result: L(
            'Am Zaun in Marzahn fällt Hugo seiner Mutter um den Hals. Sie weint und dankt dir. Du fragst dich lange, ob das richtig war.',
            'Am Zaun in Marzahn fällt Hugo seiner Mutter um den Hals. Sie weint und dankt dir. Du fragst dich lange, ob das richtig war.',
          ),
        },
        {
          label: L('Ihm Brot und etwas Geld geben und gehen', 'Ihm Brot und etwas Geld geben und gehen'),
          needsKasse: 5,
          effects: { kasse: -5, moral: 1, helped: 1 },
          result: L(
            'Hugo nimmt das Brot und verschwindet in der Dunkelheit. Du wirst nie erfahren, wohin er gegangen ist.',
            'Hugo nimmt das Brot und verschwindet in der Dunkelheit. Du wirst nie erfahren, wohin er gegangen ist.',
          ),
        },
      ],
    },
  },
  // Woche 13
  {
    calendar: { day: 1, month: 'August', weekday: 'Sonnabend', year: 1936 },
    intertitle: L(
      '1. August 1936. Die Welt kommt nach Berlin. Zwei Wochen lang soll sie ein freundliches Deutschland sehen.',
      '1. August 1936. Die Welt kommt nach Berlin. Für zwei Wochen soll sie ein freundliches Deutschland sehen.',
    ),
    dateLabel: 'Woche vom 3. August 1936',
    paperDate: 'Montag, den 3. August 1936',
    headline: 'Die Welt zu Gast in Berlin',
    subline: L(
      'Die Olympischen Spiele haben im neuen Stadion begonnen.',
      'Feierliche Eröffnung der XI. Olympischen Spiele im neuen Olympiastadion.',
    ),
    lead: L(
      'Am Sonnabend hat Hitler die Olympischen Spiele eröffnet. Rund hunderttausend Menschen waren im Stadion. Sportler aus fast fünfzig Ländern sind dabei. Tausende Besucher und Reporter aus dem Ausland sind in der Stadt. Sie loben die Ordnung und die Sauberkeit.',
      'Vor rund hunderttausend Zuschauern hat der Führer am Sonnabend die XI. Olympischen Spiele eröffnet. Sportler aus fast fünfzig Nationen zogen in das neue Stadion ein. Tausende ausländische Besucher und Journalisten sind in der Stadt. Sie loben die Ordnung, die Sauberkeit und die Gastfreundschaft der Berliner.',
    ),
    articles: [
      {
        headline: 'Berlin zeigt sich von seiner besten Seite',
        body: L(
          'Die Stadt ist geschmückt, die Gasthäuser sind voll. Überall hört man fremde Sprachen.',
          'Die Stadt ist geschmückt, die Gaststätten sind voll. Überall hört man fremde Sprachen.',
        ),
      },
      {
        headline: 'Deutsche Mannschaft mit großen Hoffnungen',
        body: L(
          'Die deutschen Sportler wollen viele Medaillen gewinnen.',
          'Die deutschen Sportler gehen als Favoriten in viele Wettbewerbe. Der Reichssportführer erwartet zahlreiche Medaillen.',
        ),
      },
    ],
    illustration: 'stadion',
    caption: 'Der Einzug der Mannschaften ins Olympiastadion',
    note: L(
      'Die Schilder „Juden unerwünscht“ sind für zwei Wochen weg. Auch das am Gasthaus an der Ecke. Ein schwarzer Amerikaner namens Jesse Owens gewinnt vier Goldmedaillen. Das Stadion jubelt ihm zu.',
      'Die Schilder „Juden unerwünscht“ sind für zwei Wochen verschwunden, auch das am Gasthaus an der Ecke. Ein schwarzer Amerikaner namens Jesse Owens gewinnt in diesen Tagen vier Goldmedaillen, und das Stadion jubelt ihm zu.',
    ),
    voice: L(
      '„Siehst du, die Ausländer finden es auch schön bei uns. So schlimm kann es also nicht sein.“',
      '„Die ganze Welt lobt uns. Wenn es hier so schlimm wäre, wie manche flüstern, würden die das doch merken.“',
    ),
    context: L(
      'Die Nazis nutzten die Olympischen Spiele 1936, um der Welt ein friedliches Deutschland vorzuspielen. Die Schilder gegen Juden wurden abgenommen. Fast alle jüdischen Sportler durften nicht für Deutschland antreten. Nur die Fechterin Helene Mayer durfte mitmachen, damit das Ausland nicht protestierte. Nach den Spielen ging die Verfolgung weiter.',
      'Das Regime nutzte die Olympischen Spiele 1936, um der Welt ein friedliches und weltoffenes Deutschland vorzuspielen. Antisemitische Schilder wurden abgenommen, die Presse sollte sich zurückhalten. Jüdische Sportlerinnen und Sportler wurden aus den Vereinen gedrängt. Die Hochspringerin Gretel Bergmann wurde kurz vor den Spielen aus der Mannschaft gestrichen. Nur die Fechterin Helene Mayer, deren Vater Jude war, durfte als Aushängeschild antreten. Nach den Spielen ging die Verfolgung verschärft weiter.',
    ),
    reflect: L(
      'Die Gäste aus dem Ausland sahen nur die schöne Seite. Warum ist es so leicht, sich täuschen zu lassen?',
      'Die Spiele waren eine Inszenierung. Warum ließen sich viele Besucher, aber auch viele Deutsche so gern täuschen?',
    ),
    lexicon: ['olympia', 'antisemitismus', 'propaganda'],
    effects: { moral: -2 },
    moodText: L(
      'Zwei Wochen lang trägt die Diktatur eine freundliche Maske.',
      'Für zwei Wochen trägt die Diktatur eine freundliche Maske.',
    ),
    event: {
      title: 'Der Journalist',
      scene: L('Ein Café am Kurfürstendamm, am Nachmittag.', 'Ein Café am Kurfürstendamm, am Nachmittag.'),
      speaker: 'Mr. Harold Wilson',
      speakerRole: 'Journalist aus London',
      portrait: { gender: 'm', face: 'schmal', headwear: 'fedora', hairTone: 'hell', glasses: true, clothing: 'trenchcoat' },
      text: L(
        'Ein Engländer setzt sich an deinen Tisch. Er spricht leise. „Man hat mir gesagt, Sie wissen Dinge. Hier sieht alles so ordentlich aus. Aber ich höre von Lagern und Verhaftungen. Ist das wahr?“ Am Nebentisch sitzt ein Mann. Er starrt schon lange in dieselbe Zeitung.',
        'Ein Engländer setzt sich an deinen Tisch und spricht leise, mit starkem Akzent. „Man hat mir gesagt, Sie wissen Dinge. Alles hier sieht so ordentlich aus. Aber ich höre von Lagern, von Verhaftungen. Ist das wahr?“ Am Nebentisch sitzt ein Mann, der schon lange in dieselbe Zeitung starrt.',
      ),
      choices: [
        {
          label: L('Ihm heimlich ein Bündel Flugblätter zustecken', 'Ihm auf der Toilette ein Bündel Flugblätter zustecken'),
          effects: { moral: 8, supporters: 2, heatLeader: 12, items: { flugblaetter: -1 } },
          result: L(
            'Mr. Wilson steckt das Bündel ein. Drei Wochen später bringt jemand eine englische Zeitung mit. Darin steht ein Bericht über die Lager in Oranienburg und Marzahn.',
            'Mr. Wilson steckt das Bündel in seine Innentasche. Drei Wochen später bringt jemand aus der Gruppe eine englische Zeitung mit. Darin steht ein Bericht über Oranienburg und Marzahn.',
          ),
        },
        {
          label: L('Ihm eine Adresse geben, wo er mehr erfährt', 'Ihm eine Adresse aufschreiben, wo er mehr erfährt'),
          check: { stat: 'heimlichkeit', min: 4 },
          effects: { moral: 6, supporters: 1 },
          result: L(
            'Du schreibst die Adresse auf eine Serviette und lässt sie liegen. Der Mann am Nebentisch merkt nichts.',
            'Du schreibst die Adresse auf eine Serviette und lässt sie liegen. Der Mann am Nebentisch bemerkt nichts.',
          ),
          failEffects: { heatLeader: 20 },
          failResult: L(
            'Als du gehst, faltet der Mann am Nebentisch seine Zeitung zusammen. Er folgt dir bis zur Straßenbahn.',
            'Als du gehst, faltet der Mann am Nebentisch seine Zeitung zusammen und folgt dir bis zur Straßenbahn.',
          ),
        },
        {
          label: '„Ich weiß nicht, wovon Sie sprechen.“',
          effects: { moral: -3 },
          result: L(
            'Mr. Wilson nickt enttäuscht und zahlt. In seinem Bericht wird stehen: Die Berliner sind mit ihrer Regierung zufrieden.',
            'Mr. Wilson nickt enttäuscht und zahlt. In seinem Bericht wird stehen, dass die Berliner mit ihrer Regierung zufrieden sind.',
          ),
        },
      ],
    },
  },
  // Woche 14
  {
    calendar: { day: 1, month: 'Juli', weekday: 'Donnerstag', year: 1937 },
    intertitle: L(
      '1. Juli 1937, früh am Morgen. Zwei Männer der Gestapo klingeln am Pfarrhaus in Dahlem.',
      '1. Juli 1937, früh am Morgen. Zwei Männer der Gestapo klingeln am Pfarrhaus in Dahlem.',
    ),
    dateLabel: 'Woche vom 28. Juni 1937',
    paperDate: 'Freitag, den 2. Juli 1937',
    headline: 'Pfarrer Niemöller in Haft genommen',
    subline: L('Der Pfarrer aus Dahlem soll gegen den Staat gepredigt haben.', 'Der Dahlemer Pfarrer wird des Kanzelmissbrauchs beschuldigt.'),
    lead: L(
      'Die Gestapo hat den Pfarrer Martin Niemöller aus Berlin-Dahlem verhaftet. Er soll in seinen Predigten gegen den Staat gehetzt haben. Niemöller gehört zur Bekennenden Kirche. Diese Christen wehren sich dagegen, dass der Staat ihnen vorschreibt, was sie glauben sollen.',
      'Die Geheime Staatspolizei hat den Pfarrer Martin Niemöller aus Berlin-Dahlem festgenommen. Ihm wird vorgeworfen, von der Kanzel aus gegen den Staat gehetzt zu haben. Niemöller ist ein führender Kopf der sogenannten Bekennenden Kirche, die sich gegen die „Deutschen Christen“ stellt.',
    ),
    articles: [
      {
        headline: 'Weitere Pfarrer verhaftet',
        body: L(
          'In diesem Jahr wurden im ganzen Reich viele Pfarrer der Bekennenden Kirche verhaftet. Andere dürfen nicht mehr predigen.',
          'In diesem Jahr wurden im ganzen Reich zahlreiche Pfarrer der Bekennenden Kirche festgenommen oder mit Redeverbot belegt.',
        ),
      },
      {
        headline: 'Gottesdienste unter Aufsicht',
        body: L(
          'In manchen Kirchen sitzen Polizisten in den Bänken und schreiben die Predigten mit.',
          'In manchen Gemeinden sitzen Beamte der Staatspolizei in den Bänken und schreiben die Predigten mit.',
        ),
      },
    ],
    illustration: 'kirche',
    caption: 'Die Annenkirche in Berlin-Dahlem',
    note: L(
      'In der Annenkirche wurden am Sonntag die Namen der verhafteten Pfarrer vorgelesen, einer nach dem anderen. Die Leute standen auf. Draußen schrieb ein Mann in Zivil die Autonummern auf.',
      'In der Annenkirche wurden am Sonntag die Namen der verhafteten Pfarrer vorgelesen, einer nach dem anderen. Die Leute standen auf. Draußen notierte ein Mann in Zivil die Autonummern.',
    ),
    voice: L(
      '„Ein Pfarrer soll beten und sich nicht einmischen. Selbst schuld.“',
      '„Ein Pfarrer soll predigen und sich aus der Politik heraushalten. Wer sich einmischt, ist selbst schuld.“',
    ),
    context: L(
      'Die meisten Christen passten sich an. Ein Teil der evangelischen Kirche wehrte sich aber: die Bekennende Kirche. Martin Niemöller war einer ihrer Gründer. Er blieb bis 1945 in Konzentrationslagern und überlebte. Anfangs hatte auch Niemöller die Nazis gewählt. Später sagte er, er habe zu lange geschwiegen.',
      'Die meisten Christen passten sich an. Ein Teil der evangelischen Kirche, die Bekennende Kirche, wehrte sich gegen die Gleichschaltung der Kirche. Für die verfolgten Juden setzte sie sich kaum ein. Martin Niemöller hatte 1933 selbst die NSDAP gewählt und sich antisemitisch geäußert. Von 1937 bis 1945 war er in Haft, zuletzt in Konzentrationslagern. Nach dem Krieg bekannte er, zu lange geschwiegen zu haben.',
    ),
    reflect: L(
      'Niemöller sagte später: Als sie die anderen holten, habe ich geschwiegen. Was will er uns damit sagen?',
      'Niemöller wurde erst zum Gegner, als der Staat in seine Kirche eingriff. Was lehrt sein Weg über den Zeitpunkt, an dem man widersprechen sollte?',
    ),
    lexicon: ['bekennende-kirche', 'kz', 'mitlaeufer'],
    effects: { moral: -3 },
    moodText: L('Nicht einmal die Kirche ist noch sicher.', 'Selbst die Kirche ist kein sicherer Ort mehr.'),
    event: {
      title: 'Die Fürbittenliste',
      scene: L('Ein Raum neben dem Altar einer Kirche in Kreuzberg.', 'Die Sakristei einer Kirche in Kreuzberg.'),
      speaker: 'Schwester Marianne',
      speakerRole: L('Helferin der Bekennenden Kirche', 'Gemeindehelferin der Bekennenden Kirche'),
      portrait: { gender: 'w', face: 'oval', headwear: 'welle', hairTone: 'grau', glasses: true, clothing: 'kleid' },
      text: L(
        'Schwester Marianne gibt dir einen gefalteten Zettel. „Das ist die Fürbittenliste. Hier stehen die Namen aller verhafteten Pfarrer. Wir beten am Sonntag für sie. Aber wir brauchen Abschriften für zwanzig Gemeinden. Die Post wird kontrolliert.“',
        'Schwester Marianne gibt dir einen zusammengefalteten Zettel. „Das ist die Fürbittenliste. Die Namen aller verhafteten Pfarrer. Sie wird am Sonntag in den Gottesdiensten vorgelesen, aber wir brauchen Abschriften für zwanzig Gemeinden. Die Post wird kontrolliert.“',
      ),
      choices: [
        {
          label: 'Die Abschriften selbst verteilen',
          effects: { moral: 6, supporters: 2, heatLeader: 10 },
          result: L(
            'Du bringst die Listen mit dem Fahrrad von Kirche zu Kirche. Am Sonntag hören in zwanzig Kirchen Hunderte Menschen die Namen.',
            'Du bringst die Listen mit dem Fahrrad von Gemeinde zu Gemeinde. Am Sonntag hören in zwanzig Kirchen Hunderte Menschen die Namen.',
          ),
        },
        {
          label: L('Die Liste abtippen und über Boten weitergeben', 'Die Liste abtippen und über Boten weitergeben'),
          check: { stat: 'bildung', min: 3 },
          effects: { moral: 4, supporters: 1 },
          result: L(
            'Auf der Schreibmaschine entstehen zwanzig saubere Abschriften. Die Boten sind unauffällige alte Damen mit Einkaufstaschen.',
            'Auf der Schreibmaschine entstehen zwanzig saubere Abschriften. Die Boten sind unauffällige alte Damen mit Einkaufstaschen.',
          ),
          failEffects: { heatLeader: 10 },
          failResult: L(
            'Bei einer Botin wird eine Abschrift gefunden. Sie verrät nichts. Aber die Polizei sucht jetzt nach der Schreibmaschine.',
            'Eine Abschrift wird bei einer Botin gefunden. Sie verrät nichts, aber die Polizei fragt nun nach der Schreibmaschine.',
          ),
        },
      ],
    },
  },
  // Woche 15
  {
    calendar: { day: 10, month: 'April', weekday: 'Sonntag', year: 1938 },
    intertitle: L(
      'März 1938. Deutsche Soldaten marschieren in Österreich ein. Einen Monat später soll das Volk Ja sagen.',
      'März 1938. Deutsche Truppen marschieren in Österreich ein. Einen Monat später soll das Volk Ja sagen.',
    ),
    dateLabel: 'Woche vom 11. April 1938',
    paperDate: 'Montag, den 11. April 1938',
    headline: L('Über 99 Prozent sagen Ja', 'Über 99 vom Hundert sagen Ja'),
    subline: L(
      'Die Abstimmung bestätigt: Österreich gehört jetzt zum Deutschen Reich.',
      'Volksabstimmung bestätigt die Wiedervereinigung Österreichs mit dem Reich.',
    ),
    lead: L(
      'Bei der Abstimmung am Sonntag haben über 99 Prozent Ja gesagt. Österreich gehört jetzt zum Deutschen Reich. Am 12. März waren deutsche Soldaten nach Österreich einmarschiert. Viele Menschen haben sie mit Blumen begrüßt.',
      'Bei der gestrigen Volksabstimmung haben im ganzen Reich über 99 vom Hundert der Wähler der Vereinigung Österreichs mit dem Deutschen Reich zugestimmt. Am 12. März waren deutsche Truppen in Österreich einmarschiert und von vielen Menschen mit Blumen begrüßt worden. Am 15. März sprach der Führer in Wien vor einer riesigen Menschenmenge.',
    ),
    articles: [
      {
        headline: 'Säuberung in Wien',
        body: L(
          'In Wien hat die Polizei Tausende Gegner verhaftet. Jüdische Menschen mussten auf Knien die Straßen schrubben. Zuschauer lachten dabei.',
          'In Wien hat die Staatspolizei in den vergangenen Wochen Tausende Gegner des neuen Staates festgenommen. Jüdische Bürger mussten unter dem Gelächter von Zuschauern die Straßen schrubben.',
        ),
      },
      {
        headline: 'Erste Transporte nach Dachau',
        body: L(
          'Am 1. April wurden bekannte Politiker aus Österreich in das Lager Dachau gebracht.',
          'Am 1. April wurden bekannte österreichische Politiker und Beamte in das Lager Dachau gebracht.',
        ),
      },
    ],
    illustration: 'grenze',
    caption: 'Ein Schlagbaum an der früheren Grenze',
    note: L(
      'Auf dem Stimmzettel stand nur eine Frage. Der Kreis für Ja war viel größer gedruckt. Onkel Paul hat gesagt, man kann ja Nein ankreuzen. Tante Grete hat ihn angesehen. Dann hat er nichts mehr gesagt.',
      'Auf dem Stimmzettel stand eine einzige Frage, und der Kreis für Ja war viel größer gedruckt. Onkel Paul hat gesagt, man könne ja Nein ankreuzen. Tante Grete hat ihn angesehen, und dann hat er nichts mehr gesagt.',
    ),
    voice: L(
      '„Ich mach mein Kreuz bei Ja. Was soll ich mir Ärger einhandeln?“',
      '„Ich mache mein Kreuz, wo alle es machen. Was soll ich mir wegen einer Abstimmung Ärger einhandeln?“',
    ),
    context: L(
      'Im März 1938 besetzte Deutschland Österreich. Die Nazis nannten das „Anschluss“. Schon in den ersten Tagen wurden in Wien Tausende Menschen verhaftet. Jüdische Menschen wurden auf der Straße gedemütigt. Die Abstimmung einen Monat später war nicht frei.',
      'Im März 1938 besetzte Deutschland Österreich, das Regime nannte es „Anschluss“. Viele Österreicher jubelten. Zugleich wurden in Wien Tausende Menschen verhaftet, und jüdische Bürgerinnen und Bürger wurden öffentlich gedemütigt, oft vor lachenden Zuschauern. Die Abstimmung einen Monat später war weder frei noch geheim.',
    ),
    reflect: L(
      'In Wien lachten Zuschauer, als jüdische Menschen die Straße schrubben mussten. Warum machen Menschen bei so etwas mit?',
      'Die Demütigungen in Wien fanden vor Publikum statt. Welche Rolle spielen Zuschauer, die lachen oder schweigen, für die Täter?',
    ),
    lexicon: ['anschluss', 'scheinwahl', 'mitlaeufer'],
    effects: { moral: -3 },
    moodText: L('Das Reich wird größer. Die Angst auch.', 'Das Reich wird größer. Die Angst auch.'),
    event: {
      title: 'Die Wahlkabine',
      scene: L('Das Wahllokal in einer Schule, Sonntag, 10. April.', 'Das Wahllokal in einer Schule, Sonntag, der 10. April.'),
      speaker: 'Frau Pagel',
      speakerRole: L('Hauswartsfrau, jetzt Wahlhelferin', 'Hauswartsfrau, jetzt Wahlhelferin'),
      portrait: { gender: 'w', face: 'rund', headwear: 'welle', hairTone: 'grau', glasses: true, clothing: 'kleid' },
      text: L(
        'Frau Pagel sitzt am Tisch mit den Stimmzetteln. Sie trägt eine Armbinde. Sie gibt dir den Zettel und sagt laut, damit alle es hören: „Die Kabine brauchen Sie ja nicht, {name}.“ Dann ganz leise: „Oder doch?“',
        'Frau Pagel sitzt am Tisch mit den Stimmzetteln, eine Armbinde am Ärmel. Sie reicht dir den Zettel und sagt laut, so dass alle es hören: „Die Kabine brauchen Sie ja nicht, {name}.“ Dann, ganz leise: „Oder doch?“',
      ),
      choices: [
        {
          label: 'In die Kabine gehen und Nein ankreuzen',
          effects: { moral: 8, heatLeader: 15 },
          result: L(
            'Du gehst in die Kabine. Hinter dir wird es still. Du machst dein Kreuz bei Nein. Frau Pagel sieht dich nicht an. Aber sie lächelt ein ganz kleines bisschen.',
            'Du gehst in die Kabine. Hinter dir wird es still. Du machst dein Kreuz bei Nein. Frau Pagel sieht dich nicht an, als du den Zettel einwirfst. Aber sie lächelt kaum merklich.',
          ),
        },
        {
          label: 'Am Tisch das Kreuz bei Ja machen',
          effects: { moral: -4, heatLeader: -5 },
          result: L(
            'Du machst dein Kreuz am offenen Tisch. Frau Pagel nickt. „Ordentlich“, sagt sie laut. Sie sieht enttäuscht aus.',
            'Du machst dein Kreuz am offenen Tisch. Frau Pagel nickt. „Ordentlich“, sagt sie laut. Du glaubst, Enttäuschung in ihrem Gesicht zu sehen.',
          ),
        },
      ],
    },
  },
  // Woche 16
  {
    calendar: { day: 17, month: 'August', weekday: 'Mittwoch', year: 1938 },
    intertitle: L(
      'August 1938. Ein neues Gesetz nimmt jüdischen Menschen sogar ihren Namen.',
      'August 1938. Ein neues Gesetz nimmt jüdischen Menschen sogar ihren Namen.',
    ),
    dateLabel: 'Woche vom 15. August 1938',
    paperDate: 'Donnerstag, den 18. August 1938',
    headline: L('Neue Vorschrift über die Vornamen von Juden', 'Neue Vorschriften über die Vornamen der Juden'),
    subline: L(
      'Ab 1939 müssen Juden einen zweiten Vornamen tragen: „Israel“ oder „Sara“.',
      'Ab 1. Januar 1939 müssen Juden zusätzlich die Vornamen „Israel“ oder „Sara“ führen.',
    ),
    lead: L(
      'Eine neue Vorschrift sagt: Juden müssen ab dem 1. Januar 1939 einen zweiten Vornamen tragen. Männer müssen „Israel“ heißen, Frauen „Sara“. So erkennt man sie auf jedem Formular sofort.',
      'Nach einer neuen Verordnung des Reichsinnenministers müssen Juden, die keinen als jüdisch geltenden Vornamen tragen, ab dem 1. Januar 1939 einen weiteren Vornamen annehmen: Männer den Namen „Israel“, Frauen den Namen „Sara“. Die Änderung ist beim Standesamt zu melden.',
    ),
    articles: [
      {
        headline: L('Tausende Männer verhaftet', 'Aktion gegen „Asoziale“'),
        body: L(
          'Im Juni hat die Polizei im ganzen Reich fast zehntausend Männer verhaftet. Sie nannte sie „asozial“. Unter ihnen waren viele Juden. Alle kamen in Konzentrationslager.',
          'Im Juni hat die Polizei im ganzen Reich fast zehntausend Männer als „asozial“ festgenommen, darunter rund 2.300 Juden. Sie wurden in Konzentrationslager gebracht.',
        ),
      },
      {
        headline: 'Spannung um die Tschechoslowakei',
        body: L(
          'An der Grenze zur Tschechoslowakei wird die Lage gefährlicher. Jeden Tag schreiben die Zeitungen darüber.',
          'Die Lage an der Grenze zur Tschechoslowakei spitzt sich zu. In den Zeitungen ist täglich von der Not der Sudetendeutschen die Rede.',
        ),
      },
    ],
    illustration: 'pass',
    caption: 'Ein Reisepass',
    note: L(
      'Dr. Löwenthal ist unser Hausarzt. Ab Oktober darf er keine Kranken mehr behandeln. Er hat mir die Hand gegeben und gesagt: „Jetzt wissen Sie wenigstens auf jedem Formular, wer ich bin.“',
      'Dr. Löwenthal, unser Hausarzt, darf ab Oktober keine Patienten mehr behandeln. Er hat mir die Hand gegeben und gesagt: „Jetzt wissen Sie wenigstens auf jedem Formular, wer ich bin.“',
    ),
    voice: L(
      '„Das ist doch nur ein Name. Deswegen muss man nicht gleich so ein Theater machen.“',
      '„Ist doch nur ein Name auf einem Formular. Man muss nicht aus allem gleich ein Drama machen.“',
    ),
    context: L(
      'Schritt für Schritt nahmen die Nazis jüdischen Menschen ihre Rechte weg: ihre Arbeit, ihr Geld, die Schule und sogar ihren Namen. Ab Oktober 1938 wurde ein rotes „J“ in ihre Pässe gestempelt. Viele wollten jetzt Deutschland verlassen. Aber kaum ein Land wollte sie aufnehmen.',
      'Schritt für Schritt nahmen die Nationalsozialisten jüdischen Menschen ihre Rechte: Arbeit, Besitz, Schulbildung und sogar den eigenen Namen. Ab Oktober 1938 wurde in ihre Pässe ein rotes „J“ gestempelt. Viele versuchten jetzt verzweifelt auszuwandern. Auf der Konferenz von Évian im Juli 1938 hatten sich jedoch fast alle Staaten geweigert, mehr Flüchtlinge aufzunehmen.',
    ),
    reflect: L(
      'Frau Levy soll plötzlich Sara heißen. Warum ist ein Name so wichtig für einen Menschen?',
      'Die Namensverordnung wirkte klein gegen spätere Verbrechen. Warum ist gerade die schrittweise Ausgrenzung so gefährlich, und warum fällt es vielen schwer, sie zu erkennen?',
    ),
    lexicon: ['antisemitismus', 'kindertransport', 'rassismus'],
    effects: { moral: -3 },
    moodText: L('Jeden Tag werden jüdische Menschen mehr ausgegrenzt.', 'Die Ausgrenzung wird täglich enger.'),
    event: {
      title: 'Auf dem Standesamt',
      scene: L('Der Flur eines Amtes in Mitte, in dem Namen eingetragen werden.', 'Der Flur eines Standesamts in Mitte.'),
      speaker: 'Frau Levy',
      speakerRole: 'Nachbarin aus dem dritten Stock',
      portrait: { gender: 'w', face: 'oval', headwear: 'glocke', hairTone: 'dunkel', glasses: false, clothing: 'trenchcoat' },
      text: L(
        'Frau Levy steht im Flur des Amtes und hält ein Formular. Ihre Hände zittern. „Ich soll unterschreiben, dass ich jetzt Sara heiße. Ich heiße Clara. Seit sechzig Jahren.“ Hinter dem Schalter schaut ein Beamter ungeduldig auf die Uhr.',
        'Frau Levy steht im Flur des Standesamts und hält ein Formular in der Hand. Ihre Hände zittern. „Sie wollen, dass ich unterschreibe, dass ich jetzt Sara heiße. Ich heiße Clara. Seit sechzig Jahren.“ Hinter dem Schalter sieht ein Beamter ungeduldig auf die Uhr.',
      ),
      choices: [
        {
          label: L('Bei ihr bleiben und ihre Hand halten', 'Bei ihr bleiben und ihre Hand halten, während sie unterschreibt'),
          effects: { moral: 5, heatLeader: 5, helped: 1 },
          result: L(
            'Du bleibst neben ihr stehen. Der Beamte sieht dich lange an. Frau Levy unterschreibt mit fester Schrift. Draußen sagt sie: „Für Sie bleibe ich Clara.“',
            'Du bleibst neben ihr stehen. Der Beamte sieht dich lange an. Frau Levy unterschreibt mit fester Schrift. Draußen sagt sie: „Für Sie bleibe ich Clara.“',
          ),
        },
        {
          label: L('Ihr versprechen, einen Weg ins Ausland zu suchen', 'Ihr versprechen, mit ihr nach Wegen ins Ausland zu suchen'),
          effects: { moral: 4, flags: ['levy'], helped: 1 },
          result: L(
            'Frau Levy hat einen Sohn in New York. Du versprichst, ihr bei den Papieren zu helfen. Auf der Stadtkarte erscheinen jetzt Aufträge zur Ausreise.',
            'Frau Levy hat einen Sohn in New York. Du versprichst, ihr bei den Papieren zu helfen. In der Stadtkarte erscheinen jetzt Aufträge zur Ausreise.',
          ),
        },
      ],
    },
  },
  // Woche 17
  {
    calendar: { day: 9, month: 'November', weekday: 'Mittwoch', year: 1938 },
    intertitle: L(
      'Die Nacht vom 9. auf den 10. November 1938. In ganz Deutschland brennen die Synagogen.',
      'Die Nacht vom 9. auf den 10. November 1938. In ganz Deutschland brennen die Synagogen.',
    ),
    dateLabel: 'Woche vom 7. November 1938',
    paperDate: 'Freitag, den 11. November 1938',
    headline: L('„Kundgebungen“ gegen die Juden', '„Spontane Kundgebungen“ gegen die Juden'),
    subline: L(
      'Ein deutscher Diplomat ist in Paris gestorben. Die Zeitung behauptet: Das Volk war empört.',
      'Nach dem Tod des Gesandtschaftsrats vom Rath in Paris.',
    ),
    lead: L(
      'In Paris hat ein junger Jude auf den deutschen Diplomaten Ernst vom Rath geschossen. Vom Rath ist gestorben. In der Nacht zum 10. November wurden im ganzen Reich jüdische Geschäfte und Synagogen angegriffen. Minister Goebbels behauptet, das Volk sei eben empört gewesen.',
      'Nach dem Tod des deutschen Diplomaten Ernst vom Rath, auf den ein junger Jude in Paris geschossen hatte, kam es in der Nacht zum 10. November im ganzen Reich zu Aktionen gegen jüdische Geschäfte und Synagogen. Reichsminister Dr. Goebbels spricht von der „berechtigten Empörung des Volkes“ und hat zur Ruhe aufgerufen.',
    ),
    articles: [
      {
        headline: 'Zahlreiche Festnahmen',
        body: L(
          'Im ganzen Reich wurden jüdische Männer verhaftet. Viele kamen in die Lager Sachsenhausen, Buchenwald und Dachau.',
          'Im ganzen Reich wurden jüdische Männer in Schutzhaft genommen. Viele von ihnen wurden in die Lager Sachsenhausen, Buchenwald und Dachau gebracht.',
        ),
      },
      {
        headline: 'Scherben in der Tauentzienstraße',
        body: L(
          'In den Einkaufsstraßen liegen die Scherben zerschlagener Schaufenster.',
          'In den Geschäftsstraßen der Stadt liegen die Scherben zerschlagener Schaufenster. Die Aufräumarbeiten dauern an.',
        ),
      },
    ],
    illustration: 'synagoge',
    caption: 'Eine Berliner Synagoge in der Nacht zum 10. November',
    note: L(
      'Das Volk war nicht empört. Die SA kam mit Lastwagen, mit Benzin und Äxten. In der Oranienburger Straße hat ein Polizist die Feuerwehr gerufen und die Brandstifter weggejagt. Die Neue Synagoge steht noch.',
      'Es war kein Volkszorn. Die SA kam in Lastwagen, mit Benzinkanistern und Äxten. In der Oranienburger Straße hat ein Polizist die Feuerwehr gerufen und die Brandstifter fortgejagt. Die Neue Synagoge steht noch.',
    ),
    voice: L(
      '„Schlimm, die ganzen Scherben. Aber was hätte man denn machen sollen?“',
      '„Das ist schon schlimm mit den Scherben. Aber was hätte unsereins denn machen sollen? Man wäre doch gleich mit abgeholt worden.“',
    ),
    context: L(
      'In der Nacht vom 9. auf den 10. November 1938 zerstörten SA-Männer und Parteianhänger im ganzen Reich Synagogen, Geschäfte und Wohnungen jüdischer Menschen. In Berlin wurden fast alle Synagogen angezündet oder verwüstet. Etwa 30.000 jüdische Männer kamen in Konzentrationslager. Hunderte Menschen wurden ermordet oder starben an den Folgen. Die meisten Deutschen schauten zu oder weg.',
      'In der Nacht vom 9. auf den 10. November 1938 zerstörten SA, SS und Parteianhänger im ganzen Reich Synagogen, Geschäfte und Wohnungen jüdischer Menschen. Die Gewalt war von der Parteiführung angestoßen, nicht spontan. In Berlin wurden fast alle Synagogen in Brand gesetzt oder verwüstet. Etwa 30.000 jüdische Männer wurden in Konzentrationslager verschleppt, Hunderte Menschen wurden ermordet oder starben an den Folgen. Die meisten Deutschen sahen zu oder weg. Nur wenige halfen.',
    ),
    reflect: L(
      'Am Morgen nach dem Pogrom sahen alle die Scherben. Was hättest du an diesem Morgen tun können?',
      'Nach dem Pogrom konnte niemand mehr sagen, er habe nichts gewusst. Warum führte das dennoch kaum zu Widerspruch?',
    ),
    lexicon: ['novemberpogrom', 'kz', 'antisemitismus'],
    effects: { moral: -8, flags: ['levy'] },
    moodText: L(
      'Das Schlimmste passiert jetzt vor aller Augen.',
      'Das Schlimmste geschieht nicht mehr im Verborgenen.',
    ),
    event: {
      title: 'Herr Rosenthal',
      scene: L('Deine Wohnungstür, zwei Uhr nachts. Draußen klirrt Glas.', 'Deine Wohnungstür, zwei Uhr nachts. Draußen klirrt Glas.'),
      speaker: 'Herr Rosenthal',
      speakerRole: 'Kaufmann aus der Grenadierstraße',
      portrait: { gender: 'm', face: 'oval', headwear: 'fedora', hairTone: 'grau', glasses: true, clothing: 'weste' },
      text: L(
        'Vor deiner Tür steht Herr Rosenthal, der Kaufmann aus der Grenadierstraße. Er trägt einen Mantel über dem Nachthemd. Sein Laden ist zerschlagen, seine Wohnung auch. „Sie holen alle Männer ab, {name}. Meine Frau ist bei ihrer Schwester. Ich wusste nicht, wohin.“ Unten auf der Straße ruft jemand Befehle.',
        'Vor deiner Tür steht Herr Rosenthal, der Kaufmann aus der Grenadierstraße, im Mantel über dem Nachthemd. Sein Laden ist zerschlagen, seine Wohnung auch. „Sie holen alle Männer ab, {name}. Meine Frau ist bei ihrer Schwester. Ich wusste nicht, wohin.“ Unten auf der Straße ruft jemand Befehle.',
      ),
      choices: [
        {
          label: L('Ihn hereinlassen und verstecken', 'Ihn hereinlassen und verstecken, bis es vorbei ist'),
          effects: { moral: 12, heatLeader: 20, helped: 1 },
          result: L(
            'Herr Rosenthal bleibt drei Tage in deiner Kammer. Er spricht kaum. Er betet leise. Als die Verhaftungen weniger werden, holt ihn seine Frau. „Das vergessen wir Ihnen nie“, sagt sie.',
            'Herr Rosenthal verbringt drei Tage in deiner Kammer. Er spricht kaum, er betet leise. Als die Verhaftungen nachlassen, holt ihn seine Frau. „Das vergessen wir Ihnen nie“, sagt sie.',
          ),
        },
        {
          label: L('Ihm Geld geben und den Weg zu Freunden zeigen', 'Ihm Geld geben und den Weg zu Freunden aus der Gruppe zeigen'),
          needsKasse: 15,
          effects: { kasse: -15, moral: 6, heatLeader: 5, helped: 1 },
          result: L(
            'Du gibst ihm fünfzehn Reichsmark und eine Adresse in Neukölln. Er drückt deine Hand und verschwindet im Dunkeln. Zwei Tage später hörst du: Er ist dort angekommen.',
            'Du gibst ihm fünfzehn Reichsmark und eine Adresse in Neukölln. Er drückt deine Hand und verschwindet im Dunkeln. Zwei Tage später erfährst du: Er ist dort angekommen.',
          ),
        },
        {
          label: 'Die Tür nicht öffnen',
          effects: { moral: -12 },
          result: L(
            'Du stehst hinter der Tür, bis seine Schritte leiser werden. Am nächsten Tag hörst du: Viele Männer aus der Grenadierstraße wurden nach Sachsenhausen gebracht.',
            'Du stehst hinter der Tür, bis seine Schritte verklingen. Am nächsten Tag hörst du, dass viele Männer aus der Grenadierstraße nach Sachsenhausen gebracht wurden.',
          ),
        },
      ],
    },
  },
  // Woche 18
  {
    calendar: { day: 1, month: 'Dezember', weekday: 'Donnerstag', year: 1938 },
    intertitle: L(
      '1. Dezember 1938, Bahnhof Friedrichstraße. Ein Zug mit fast zweihundert Kindern fährt nach England. Ohne ihre Eltern.',
      '1. Dezember 1938, Bahnhof Friedrichstraße. Ein Zug mit fast zweihundert Kindern fährt nach England. Ohne ihre Eltern.',
    ),
    dateLabel: 'Woche vom 28. November 1938',
    paperDate: 'Freitag, den 2. Dezember 1938',
    headline: L('Juden dürfen nicht mehr ins Theater und Kino', 'Juden aus dem Kulturleben ausgeschlossen'),
    subline: L(
      'Jüdische Kinder dürfen nicht mehr auf deutsche Schulen gehen.',
      'Theater, Kinos, Konzerte und Ausstellungen für Juden verboten. Jüdische Kinder verlassen die deutschen Schulen.',
    ),
    lead: L(
      'Juden dürfen ab sofort nicht mehr ins Theater, ins Kino, ins Konzert oder in eine Ausstellung. Jüdische Kinder dürfen nicht mehr auf deutsche Schulen gehen. Außerdem müssen die Juden in Deutschland eine Milliarde Reichsmark bezahlen. Angeblich als Strafe für die Nacht vom 10. November. Dabei waren sie die Opfer.',
      'Juden ist der Besuch von Theatern, Kinos, Konzerten und Ausstellungen ab sofort untersagt. Jüdische Kinder dürfen keine deutschen Schulen mehr besuchen. Die Maßnahmen folgen auf die Ereignisse vom 10. November. Den Juden wurde zudem eine „Sühneleistung“ von einer Milliarde Reichsmark auferlegt.',
    ),
    articles: [
      {
        headline: 'Abreise jüdischer Kinder',
        body: L(
          'Gestern fuhr ein Zug mit jüdischen Kindern aus Berlin ab. Die Kinder sollen in England wohnen.',
          'Gestern verließ ein Zug mit jüdischen Kindern Berlin in Richtung Holland. Die Kinder sollen in England untergebracht werden.',
        ),
      },
      {
        headline: 'Die Winterhilfe sammelt',
        body: L(
          'Auf allen Plätzen klappern die Sammelbüchsen der Winterhilfe. Jeder soll etwas geben.',
          'Auf allen Plätzen der Stadt klappern die Sammelbüchsen des Winterhilfswerks. Jeder Volksgenosse ist aufgerufen zu geben.',
        ),
      },
    ],
    illustration: 'zug',
    caption: L('Ein Zug nach Holland', 'Ein Zug nach Hoek van Holland'),
    note: L(
      'Heute früh am Bahnhof Friedrichstraße: Hunderte Eltern haben gewinkt. Keiner hat geweint, solange der Zug noch zu sehen war. Danach haben alle geweint.',
      'Heute früh am Bahnhof Friedrichstraße: Hunderte Eltern, die winkten. Keiner hat geweint, solange der Zug noch zu sehen war. Danach haben alle geweint.',
    ),
    voice: L(
      '„Die haben es doch gut, die kommen nach England. Uns fragt keiner.“',
      '„Die Kinder kommen nach England, da geht es ihnen doch gut. Um uns kümmert sich keiner.“',
    ),
    context: L(
      'Nach dem Novemberpogrom nahm England etwa 10.000 jüdische Kinder aus Deutschland, Österreich und der Tschechoslowakei auf. Die Kinder durften nur einen Koffer mitnehmen. Ihre Eltern mussten zurückbleiben. Die meisten Kinder sahen ihre Eltern nie wieder, weil diese später ermordet wurden.',
      'Nach dem Novemberpogrom nahm Großbritannien etwa 10.000 jüdische Kinder aus Deutschland, Österreich und der Tschechoslowakei auf, ohne ihre Eltern. Möglich wurde das durch Hilfsorganisationen und Gastfamilien. Die meisten Kinder sahen ihre Eltern nie wieder, weil diese später deportiert und ermordet wurden.',
    ),
    reflect: L(
      'Frau Salomon muss ihr Kind allein fortschicken, um es zu retten. Was bedeutet Solidarität in so einem Moment?',
      'Die Kindertransporte waren Rettung und Trennung zugleich. Was sagt es über eine Gesellschaft, wenn Eltern ihre Kinder fortschicken müssen, damit sie überleben?',
    ),
    lexicon: ['kindertransport', 'novemberpogrom', 'solidaritaet'],
    effects: { moral: -4 },
    moodText: L('Wer helfen will, muss sich jetzt entscheiden.', 'Wer helfen will, muss sich jetzt entscheiden.'),
    event: {
      title: 'Der Koffer',
      scene: L('Eine Wohnung in der Grenadierstraße, am Abend vor der Abreise.', 'Eine Wohnung in der Grenadierstraße, am Abend vor der Abreise.'),
      speaker: 'Frau Salomon',
      speakerRole: 'Mutter eines Kindes auf der Liste',
      portrait: { gender: 'w', face: 'schmal', headwear: 'kurz', hairTone: 'dunkel', glasses: false, clothing: 'kleid' },
      text: L(
        'Frau Salomon packt den Koffer ihrer Tochter Lea. Lea ist acht Jahre alt. Ein Koffer, eine Tasche, zehn Reichsmark. Mehr ist nicht erlaubt. „Mein Mann ist noch in Sachsenhausen“, sagt sie. „Ich kann nicht mit zum Bahnhof. Wenn ich sie gehen sehe, lasse ich sie nicht los.“ Sie sieht dich an. „Würden Sie Lea hinbringen?“',
        'Frau Salomon packt den Koffer ihrer Tochter Lea, acht Jahre alt. Ein Koffer, eine Tasche, zehn Reichsmark, mehr ist nicht erlaubt. „Mein Mann ist noch in Sachsenhausen“, sagt sie. „Ich kann nicht mit zum Bahnhof. Wenn ich sie gehen sehe, lasse ich sie nicht los.“ Sie sieht dich an. „Würden Sie sie bringen?“',
      ),
      choices: [
        {
          helps: { name: 'Lea Salomon', gender: 'w', who: L('Mit dem Kindertransport nach England', 'Mit einem Kindertransport nach England gerettet') },
          label: 'Lea zum Bahnhof bringen',
          effects: { moral: 10, heatLeader: 5, helped: 1 },
          result: L(
            'Am Bahnhof hält Lea deine Hand, bis der Zug kommt. Sie winkt nicht. Sie schaut nur. Im Frühling kommt eine Postkarte aus England: „Mir geht es gut. Sag Mama, ich lerne Englisch.“',
            'Am Bahnhof Friedrichstraße hält Lea deine Hand, bis der Zug einfährt. Sie winkt nicht, sie sieht nur. Im Frühjahr kommt eine Postkarte aus England: „Mir geht es gut. Sag Mama, ich lerne Englisch.“',
          ),
        },
        {
          helps: { name: 'Lea Salomon', gender: 'w', who: L('Mit dem Kindertransport nach England', 'Mit einem Kindertransport nach England gerettet') },
          label: L('Frau Salomon Mut machen, selbst mitzugehen', 'Frau Salomon Mut machen, selbst zu gehen'),
          check: { stat: 'empathie', min: 4 },
          effects: { moral: 8, helped: 1 },
          result: L(
            'Ihr redet die halbe Nacht. Am Morgen steht Frau Salomon selbst am Bahnsteig. Sie lässt Lea los. Du stehst neben ihr, als der Zug abfährt.',
            'Ihr redet die halbe Nacht. Am Morgen steht Frau Salomon selbst am Bahnsteig. Sie lässt Lea los. Du stehst neben ihr, als der Zug abfährt.',
          ),
          failEffects: { moral: 2 },
          failResult: L(
            'Frau Salomon schafft es nicht. Eine Nachbarin bringt Lea zum Zug. Frau Salomon sitzt den ganzen Tag am Fenster.',
            'Frau Salomon schafft es nicht. Eine Nachbarin bringt Lea zum Zug. Frau Salomon sitzt den ganzen Tag am Fenster.',
          ),
        },
      ],
    },
  },
]
