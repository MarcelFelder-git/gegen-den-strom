import { COMPANIONS } from './companions'
import type { EventChoice, StoryEvent } from './weeks'

/**
 * Persönliche Geschichten der Gefährten. Sie erscheinen nach der Begegnung der Woche,
 * wenn die Person zur Gruppe gehört. Platzhalter: {self} (die Person), {name} (Anführer).
 * Die Wirkung „self“ trifft nur die Person selbst.
 */
export interface CompanionStory {
  id: string
  companion: string
  /** Woche als Index, 0 = erste Woche */
  week: number
  event: StoryEvent
}

function story(
  companion: string,
  week: number,
  title: string,
  scene: string,
  text: string,
  choices: EventChoice[],
): CompanionStory {
  const c = COMPANIONS.find((x) => x.name === companion)
  if (!c) throw new Error(`Unbekannte Person: ${companion}`)
  return {
    id: `${companion}#${week}`,
    companion,
    week,
    event: { title, scene, speaker: companion, speakerRole: c.beruf, portrait: c.avatar, text, choices },
  }
}

export const STORIES: CompanionStory[] = [
  // Hans Wendt, Schriftsetzer
  story(
    'Hans Wendt',
    2,
    'Die Bleilettern',
    'Hans’ Küche, spät am Abend.',
    'Hans stellt einen schweren Holzkasten auf den Tisch. Seine Hände sind schwarz von Druckfarbe. „Die Druckerei ist versiegelt, die Zeitung verboten. Aber das hier haben sie nicht gefunden.“ Im Kasten liegen Bleilettern, sauber nach Buchstaben sortiert. „Damit kann man hundert Flugblätter setzen, {name}.“',
    [
      {
        label: '„Wir behalten die Lettern und drucken damit.“',
        effects: { items: { flugblaetter: 2 }, self: { heat: 10 } },
        result: 'Noch in derselben Woche setzt Hans zwei Bündel Flugblätter. Seine Augen leuchten dabei zum ersten Mal seit Tagen. Doch wer die Lettern bei ihm findet, weiß sofort, woher sie stammen.',
      },
      {
        label: '„Zu gefährlich. Wirf sie in die Spree.“',
        effects: { self: { heat: -10 }, moral: -2 },
        result: 'Hans trägt den Kasten schweigend zur Brücke. Man hört das Wasser kaum. Er redet den ganzen Abend nicht mehr.',
      },
    ],
  ),
  story(
    'Hans Wendt',
    8,
    'Ohne Gewerkschaft',
    'Vor dem besetzten Gewerkschaftshaus.',
    'Hans steht vor dem Haus, in dem er dreißig Jahre lang Mitglied war. An der Tür hängt ein neues Schild, davor stehen SA-Männer. Hans ballt die Fäuste. „Ich gehe da jetzt rein und hole unsere Fahne. Und wenn mich einer aufhält, dann soll er sehen.“',
    [
      {
        label: 'Ihn mit ruhigen Worten zurückhalten',
        check: { stat: 'empathie', min: 4 },
        effects: { moral: 4 },
        result: 'Du legst ihm die Hand auf den Arm und redest leise, bis er die Fäuste öffnet. „Du hast recht“, sagt er schließlich. „Die kriegen mich nicht so billig.“',
        failEffects: { self: { heat: 20 }, moral: -2 },
        failResult: 'Hans reißt sich los und schreit die Posten an. Sie lachen und notieren seinen Namen. Nur mit Mühe bringst du ihn fort.',
      },
      {
        label: '„Schreib deine Wut auf. Wir drucken sie.“',
        effects: { items: { flugblaetter: 1 }, moral: 3, self: { heat: 5 } },
        result: 'Hans schreibt die ganze Nacht. Am Morgen liegt ein Text auf dem Tisch, so zornig und klar, dass alle ihn zweimal lesen.',
      },
    ],
  ),

  // Lotte Krause, Näherin
  story(
    'Lotte Krause',
    1,
    'Die Geheimtaschen',
    'Lottes Heimwerkstatt in einem Kreuzberger Hinterhaus.',
    'Zwischen Stoffballen und Garnrollen zeigt dir Lotte einen alten Mantel. Sie klappt das Futter um: Darunter ist eine flache Tasche eingenäht, gerade groß genug für ein Bündel Papier. „Bei einer Kontrolle tasten sie die Manteltaschen ab. Hier sucht keiner. Soll ich für alle so etwas nähen?“',
    [
      {
        label: '„Ja, für die ganze Gruppe.“ (Stoff kostet 5 Reichsmark)',
        needsKasse: 5,
        effects: { kasse: -5, heatAll: -5, moral: 2 },
        result: 'Drei Nächte sitzt Lotte an der Nähmaschine. Nun trägt jeder in der Gruppe ein Geheimnis im Futter. Man geht ruhiger an den Streifen vorbei.',
      },
      {
        label: '„Nur für dich selbst, das fällt weniger auf.“',
        effects: { self: { stat: 'heimlichkeit', statDelta: 1 } },
        result: 'Lotte nickt. Mit ihrem neuen Mantel wird sie noch unauffälliger, als sie ohnehin schon ist.',
      },
    ],
  ),
  story(
    'Lotte Krause',
    6,
    'Die Nachbarin',
    'Das Treppenhaus vor Lottes Wohnung.',
    'Lotte kommt blass zum Treffen. „Frau Gerlach von gegenüber hat mich gefragt, warum bei mir nachts so viele Leute ein und aus gehen. Ihr Mann ist bei der SA.“ Sie knetet ihre Hände. „Ich weiß nicht, ob sie nur neugierig ist oder ob sie etwas ahnt.“',
    [
      {
        label: '„Du ziehst für eine Weile zu deiner Schwester.“',
        needsKasse: 10,
        effects: { kasse: -10, self: { heat: -20 } },
        result: 'Lotte packt noch am selben Abend. Die Gruppe legt Geld für die Miete zusammen. Frau Gerlach sieht nur noch eine verschlossene Tür.',
      },
      {
        label: 'Mit Frau Gerlach reden und auf ihr Schweigen hoffen',
        check: { stat: 'empathie', min: 5 },
        effects: { supporters: 1, moral: 4 },
        result: 'Frau Gerlach hört zu. Dann sagt sie leise: „Mein Mann ist ein Dummkopf. Von mir hört er nichts.“ Manchmal steht seitdem ein Topf Suppe vor Lottes Tür.',
        failEffects: { self: { heat: 25 } },
        failResult: 'Frau Gerlach lächelt freundlich und sagt nichts. Zwei Tage später steht ein Mann in Zivil vor dem Haus.',
      },
    ],
  ),

  // Erich Vogt, Student
  story(
    'Erich Vogt',
    4,
    'Im Hörsaal',
    'Ein Hörsaal der Friedrich-Wilhelms-Universität.',
    'Erich erzählt mit bebender Stimme. „Heute kamen Studenten in SA-Uniform in die Vorlesung von Professor Lehmann. Sie haben gebrüllt, bis er gegangen ist. Keiner hat etwas gesagt. Ich auch nicht.“ Er sieht dich an. „Nächste Woche kommen sie wieder. Soll ich aufstehen und widersprechen?“',
    [
      {
        label: '„Steh auf. Einer muss es tun.“',
        effects: { moral: 6, supporters: 1, self: { heat: 20 } },
        result: 'Erich steht auf und sagt laut, dass dies eine Universität sei und keine Kaserne. Es wird still im Saal. Zwei Studentinnen suchen ihn danach heimlich auf. Aber sein Name steht jetzt auf einer Liste.',
      },
      {
        label: '„Schweig und merk dir, wer mitmacht und wer nicht.“',
        effects: { supporters: 1, moral: -1 },
        result: 'Erich schweigt. Er schämt sich dafür. Aber er findet zwei Kommilitonen, die genauso denken wie er.',
      },
    ],
  ),
  story(
    'Erich Vogt',
    9,
    'Die Bücherkarren',
    'Der Hof des Studentenhauses, am Nachmittag des 10. Mai.',
    'Die Studentenschaft hat alle Studenten aufgerufen, beim Beladen der Lastwagen zu helfen. Erich soll Bücher aus den Leihbüchereien schleppen, die heute Nacht brennen werden. „Wer sich weigert, fliegt von der Universität“, sagt er. „Was soll ich tun?“',
    [
      {
        label: '„Weigere dich.“',
        effects: { moral: 5, self: { heat: 15 } },
        result: 'Erich geht nicht hin. Am nächsten Morgen hängt sein Name am Schwarzen Brett, zusammen mit sieben anderen. Er ist stolz und hat Angst zugleich.',
      },
      {
        label: '„Geh hin und rette heimlich, was du kannst.“',
        effects: { moral: 3, supporters: 1, self: { heat: 5 } },
        result: 'Erich trägt Kisten und lässt jedes Mal ein Buch unter seinem Mantel verschwinden. Am Abend liegen elf Bücher unter seinem Bett. Darunter ist ein Gedichtband von Erich Kästner.',
      },
    ],
  ),

  // Trude Kowalski, Verkäuferin
  story(
    'Trude Kowalski',
    3,
    'Die Fahnen im Schaufenster',
    'Das Warenhaus am Hermannplatz, nach Ladenschluss.',
    'Trude zeigt dir ein Rundschreiben der Geschäftsleitung. Alle Verkäuferinnen sollen die Schaufenster mit den neuen Fahnen schmücken und am Sonntag geschlossen zur Kundgebung gehen. „Wenn ich nicht hingehe, fällt das auf“, sagt sie. „Wenn ich hingehe, schäme ich mich.“',
    [
      {
        label: '„Geh hin. Wir brauchen dich unauffällig.“',
        effects: { self: { heat: -10 }, moral: -3 },
        result: 'Trude steht am Sonntag in der Menge und hebt den Arm, wenn alle ihn heben. Hinterher sitzt sie lange stumm in der Küche.',
      },
      {
        label: '„Melde dich krank.“',
        effects: { self: { heat: 10 }, moral: 3 },
        result: 'Trude bleibt im Bett. Am Montag fragt der Abteilungsleiter spitz, ob es ihr wieder besser gehe. Sie lächelt und sagt ja.',
      },
    ],
  ),
  story(
    'Trude Kowalski',
    7,
    'Was die Kundschaft erzählt',
    'Die Strumpfabteilung, während einer ruhigen Stunde.',
    'Eine Stammkundin, die Frau eines Polizeiwachtmeisters, plaudert gern. Heute erzählt sie Trude, ihr Mann müsse am Freitag früh raus: „In Neukölln wird aufgeräumt, sagt er. Ganze Straßenzüge.“ Trude kommt sofort zu dir. „Das müssen die Leute wissen.“',
    [
      {
        label: 'Die Warnung sofort in Neukölln weitergeben',
        effects: { heatAll: -8, supporters: 2, trust: { neukoelln: 1 } },
        result: 'Noch am selben Abend geht die Nachricht von Tür zu Tür. Am Freitag finden die Beamten in vielen Wohnungen niemanden mehr vor.',
      },
      {
        label: '„Finde erst heraus, welche Straßen gemeint sind.“',
        effects: { heatAll: -4, self: { heat: 10 } },
        result: 'Trude fragt vorsichtig nach und erfährt zwei Straßennamen. Die Warnung kommt an, aber die Kundin sieht Trude seitdem manchmal nachdenklich an.',
      },
    ],
  ),

  // Heinrich Schulz, Straßenbahnschaffner
  story(
    'Heinrich Schulz',
    1,
    'In der Straßenbahn',
    'Das Straßenbahndepot, nach der Spätschicht.',
    'Heinrich hat Schnee auf der Mütze und zittert, nicht vor Kälte. „Heute haben Hilfspolizisten einen Mann aus meinem Wagen gezerrt. Er hatte nur eine Zeitung gelesen, die ihnen nicht passte. Die Fahrgäste haben aus dem Fenster geschaut. Ich auch.“ Er legt einen zerknitterten Fahrschein auf den Tisch. „Den hat er verloren. Da steht eine Adresse drauf.“',
    [
      {
        label: '„Wir sagen seiner Familie Bescheid.“',
        effects: { supporters: 1, moral: 3, self: { heat: 5 } },
        result: 'Heinrich bringt die Nachricht noch in der Nacht zu der Adresse. Eine junge Frau öffnet. Sie hatte gedacht, ihr Mann sei einfach nicht nach Hause gekommen.',
      },
      {
        label: '„Wirf ihn weg. Du kannst ihm nicht helfen.“',
        effects: { moral: -4 },
        result: 'Heinrich zerreißt den Fahrschein. Die Schnipsel liegen noch lange auf dem Tisch, weil niemand sie wegräumen mag.',
      },
    ],
  ),
  story(
    'Heinrich Schulz',
    5,
    'Die Anzeige',
    'Hinter dem Straßenbahndepot.',
    'Heinrich ist aufgeregt. „Beim Betriebsleiter liegt ein Brief. Ohne Namen. Darin steht, ich sei ein Roter und würde Hetzschriften verteilen.“ Er schluckt. „Einer von den Kollegen muss das geschrieben haben. Morgen soll ich zum Gespräch.“',
    [
      {
        label: '„Streite alles ab. Wir halten eine Weile Abstand.“',
        effects: { self: { heat: -5 }, moral: -2 },
        result: 'Heinrich bleibt ruhig und sagt, er wisse von nichts. Der Betriebsleiter glaubt ihm halb. Die Gruppe trifft sich eine Woche lang ohne ihn.',
      },
      {
        label: '„Tauch unter. Wir sorgen für deine Familie.“',
        needsKasse: 10,
        effects: { kasse: -10, self: { heat: -25 } },
        result: 'Heinrich meldet sich krank und schläft bei Verwandten in Pankow. Die Gruppe bringt seiner Frau Geld für die Miete. Der Brief verläuft im Sand.',
      },
    ],
  ),

  // Ruth Levin, Studentin der Medizin
  story(
    'Ruth Levin',
    5,
    'Die Praxis des Vaters',
    'Eine Arztpraxis in der Neuen Königstraße, Sonnabend, der 1. April.',
    'Ruth steht vor dir, die Arme verschränkt. „Vor der Praxis meines Vaters steht ein SA-Mann mit einem Schild. Die Patienten trauen sich nicht hinein. Mein Vater hat vielen von ihnen umsonst geholfen, als sie kein Geld hatten.“ Sie holt tief Luft. „Ich gehe jetzt hin und stelle mich neben ihn. Kommst du mit?“',
    [
      {
        label: '„Ich komme mit.“',
        effects: { moral: 8, heatLeader: 10, self: { heat: 10 } },
        result: 'Ihr steht zu zweit neben dem alten Arzt, stundenlang. Gegen Mittag kommt eine Arbeiterfrau mit ihrem Kind, sieht den Posten an und geht trotzdem hinein. Ruths Vater muss sich abwenden.',
      },
      {
        label: '„Bleib zu Hause. Sie werden sich dein Gesicht merken.“',
        effects: { moral: -3 },
        result: 'Ruth bleibt. Sie sagt kein Wort mehr an diesem Tag. Am Abend erfährst du, dass nicht ein einziger Patient gekommen ist.',
      },
    ],
  ),
  story(
    'Ruth Levin',
    7,
    'Die Ausreise',
    'Ruths Zimmer, zwischen gepackten Koffern.',
    'Ein neues Gesetz beschränkt die Zahl jüdischer Studenten an den Universitäten. Ruth darf ihr Studium wohl nicht beenden. Ihre Eltern wollen nach London auswandern, solange es noch geht. „Sie wollen, dass ich mitkomme“, sagt Ruth. „Aber hier ist meine Stadt. Und hier seid ihr.“',
    [
      {
        label: '„Geh mit deiner Familie. Bring dich in Sicherheit.“',
        effects: { moral: -2, self: { emigrates: true } },
        result: 'Am Bahnhof Friedrichstraße umarmt Ruth jeden aus der Gruppe. „Eines Tages komme ich zurück“, sagt sie. Dann fährt der Zug. Du wirst später oft an diesen Satz denken.',
      },
      {
        label: '„Wenn du bleiben willst, bleibst du bei uns.“',
        effects: { moral: 6, self: { heat: 10 } },
        result: 'Ruth packt die Koffer wieder aus. Ihre Eltern fahren ohne sie. Niemand in der Gruppe kann wissen, was noch alles kommen wird.',
      },
    ],
  ),

  // Johannes Hartmann, Hilfsprediger
  story(
    'Johannes Hartmann',
    4,
    'Die Predigt',
    'Die Sakristei einer evangelischen Kirche in Kreuzberg.',
    'Johannes hält einen Brief seines Superintendenten in der Hand. Zum Tag von Potsdam soll in allen Kirchen für die „nationale Erhebung“ gedankt werden. „Sie wollen, dass ich den neuen Staat segne“, sagt er leise. „Am Sonntag stehe ich vor dreihundert Menschen.“',
    [
      {
        label: '„Predige über die Nächstenliebe. Nur über sie.“',
        effects: { moral: 4, supporters: 1, self: { heat: 5 } },
        result: 'Johannes spricht über den barmherzigen Samariter, der dem Fremden hilft, an dem alle anderen vorbeigehen. Kein Wort über die Regierung. Jeder in der Kirche versteht trotzdem, was er meint.',
      },
      {
        label: '„Halte die Predigt, die sie wollen. Du darfst nicht auffallen.“',
        effects: { self: { heat: -10 }, moral: -4 },
        result: 'Johannes liest den vorgeschriebenen Text vor. Seine Stimme klingt fremd. Nach dem Gottesdienst geht er als Letzter aus der Kirche.',
      },
    ],
  ),
  story(
    'Johannes Hartmann',
    9,
    'Die Deutschen Christen',
    'Eine Sitzung des Gemeindekirchenrats.',
    'In Johannes’ Gemeinde verlangen die „Deutschen Christen“, dass nur noch „arische“ Christen im Kirchenvorstand sitzen dürfen. Ein getaufter Jude, der seit zwanzig Jahren die Orgel spielt, soll gehen. „Ich soll morgen dafür stimmen“, sagt Johannes. „Wie kann ich das?“',
    [
      {
        label: '„Widersprich offen.“',
        effects: { moral: 6, supporters: 2, self: { heat: 15 } },
        result: 'Johannes steht auf und sagt, Christus habe nicht nach der Abstammung gefragt. Die Abstimmung verliert er. Aber drei Pfarrer aus anderen Gemeinden schreiben ihm noch in derselben Woche.',
      },
      {
        label: '„Sammle im Stillen Gleichgesinnte.“',
        effects: { supporters: 2, moral: 2 },
        result: 'Johannes enthält sich und besucht danach einen Pfarrer nach dem anderen. Viele denken wie er. Sie beginnen, sich zu treffen.',
      },
    ],
  ),

  // Anni Neumann, Stenotypistin
  story(
    'Anni Neumann',
    2,
    'Die Akten der Kanzlei',
    'Eine Anwaltskanzlei am Hackeschen Markt, nach Büroschluss.',
    'Anni tippt die Schriftsätze ihres Chefs, eines Anwalts, der jetzt fast nur noch Familien von Verhafteten vertritt. „In diesen Akten stehen die Adressen von vierzig Familien, deren Männer in Schutzhaft sitzen“, flüstert sie. „Ich könnte sie abschreiben. Dann wüsstet ihr, wo Hilfe gebraucht wird.“',
    [
      {
        label: '„Schreib sie ab.“',
        effects: { supporters: 2, self: { heat: 10 }, trust: { mitte: 1 } },
        result: 'Anni tippt die Liste in einer halben Stunde und verbrennt das Kohlepapier. Mit ihrer Hilfe erreicht die Gruppe Familien, die sonst niemand besucht hätte.',
      },
      {
        label: '„Lass die Akten, wo sie sind.“',
        effects: { moral: -1 },
        result: 'Anni nickt erleichtert. Aber sie sieht die Aktendeckel jetzt jeden Morgen anders an.',
      },
    ],
  ),
  story(
    'Anni Neumann',
    6,
    'Der Anwalt',
    'Die ausgeräumte Kanzlei.',
    'Annis Chef, Dr. Frankel, ist Jude. Nach einem neuen Gesetz darf er nicht mehr als Anwalt arbeiten. Die Kanzlei wird geschlossen, Anni verliert ihre Stelle. Zum Abschied schiebt er ihr seine Schreibmaschine hin. „Nehmen Sie sie, Fräulein Neumann. Sie wissen besser als ich, was man damit heute schreiben muss.“',
    [
      {
        label: '„Nimm sie an.“',
        effects: { items: { flugblaetter: 2 }, self: { heat: 5 } },
        result: 'Die Schreibmaschine steht jetzt in Annis Kammer, unter einer Decke. In der ersten Nacht tippt sie zwei Bündel Flugblätter.',
      },
      {
        label: '„Lass sie ihm. Er wird das Geld brauchen.“',
        effects: { moral: 3 },
        result: 'Anni hilft Dr. Frankel beim Verkauf der Möbel. Beim Abschied sagt er, sie sei die anständigste Sekretärin gewesen, die er je hatte.',
      },
    ],
  ),

  // August Brenner, Kohlenträger
  story(
    'August Brenner',
    3,
    'Die Razzia im Hinterhaus',
    'Augusts Mietskaserne im Wedding, im Morgengrauen.',
    'Um fünf Uhr früh stürmt die SA das Hinterhaus. Sie suchen Waffen und Schriften. August hat im Kohlenkeller die Fahne und die Bücher seines verhafteten Nachbarn versteckt. „Wenn sie in den Keller gehen, finden sie alles“, flüstert er dir am Mittag zu.',
    [
      {
        label: '„Bleib ruhig. Du bist nur der Kohlenträger.“',
        check: { stat: 'staerke', min: 3 },
        effects: { moral: 4, self: { heat: 5 } },
        result: 'Als die SA-Männer in den Keller wollen, schüttet August gerade einen Zentner Briketts aus. Staub und Lärm. Die Männer fluchen und gehen wieder.',
        failEffects: { self: { heat: 20 } },
        failResult: 'Die SA-Männer durchwühlen die Kohlen nicht, aber sie nehmen Augusts Namen auf. „Wir kommen wieder“, sagt einer.',
      },
      {
        label: '„Verbrenn heute Nacht alles im Ofen.“',
        effects: { self: { heat: -10 }, moral: -2 },
        result: 'August verbrennt die Bücher Seite für Seite. Die Fahne behält er, zusammengefaltet unter der Matratze. „Die nicht“, sagt er.',
      },
    ],
  ),
  story(
    'August Brenner',
    8,
    'Der Kohlenplatz',
    'Ein Kohlenplatz am Nordhafen.',
    'Auf dem Kohlenplatz hat die nationalsozialistische Betriebszelle das Sagen. Alle Männer sollen eintreten. Wer nicht will, bekommt die schlechten Schichten. „Ich könnte zum Schein eintreten“, brummt August. „Dann höre ich, was die vorhaben.“',
    [
      {
        label: '„Tritt zum Schein ein und halte die Ohren offen.“',
        effects: { self: { heat: -15 }, supporters: 1, moral: -2 },
        result: 'August trägt jetzt ein Abzeichen, das er hasst. Aber er hört, wer auf dem Platz noch anders denkt, und bringt der Gruppe einen neuen Helfer.',
      },
      {
        label: '„Weigere dich.“',
        effects: { moral: 5, kasse: -5, self: { heat: 15 } },
        result: 'August weigert sich. Er bekommt nur noch die Nachtschichten und weniger Lohn. „Dafür kann ich mir morgens noch ins Gesicht sehen“, sagt er.',
      },
    ],
  ),
]

export function storiesFor(week: number, companions: string[]): CompanionStory[] {
  return STORIES.filter((st) => st.week === week && companions.includes(st.companion))
}

export function getStory(id: string): CompanionStory | undefined {
  return STORIES.find((st) => st.id === id)
}
