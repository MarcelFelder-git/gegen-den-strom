import { COMPANIONS } from './companions'
import { L, type Txt } from '../text'
import type { EventChoice, StoryEvent } from './weeks'

/**
 * Persönliche Geschichten der Gefährten. Sie erscheinen nach der Begegnung der Woche,
 * wenn die Person zur Gruppe gehört. Platzhalter: {self} (die Person), {name} (wer die Gruppe führt).
 * Die Wirkung „self“ trifft nur die Person selbst.
 */
export interface CompanionStory {
  id: string
  companion: string
  /** Woche als Index, 0 = erste Woche */
  week: number
  event: StoryEvent
}

function story(companion: string, week: number, title: Txt, scene: Txt, text: Txt, choices: EventChoice[]): CompanionStory {
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
    L('Die Buchstaben aus Blei', 'Die Bleilettern'),
    L('Die Küche von Hans, spät am Abend.', 'Hans’ Küche, spät am Abend.'),
    L(
      'Hans stellt einen schweren Holzkasten auf den Tisch. Seine Hände sind schwarz von Druckfarbe. „Die Druckerei ist zugesperrt, die Zeitung verboten. Aber das hier haben sie nicht gefunden.“ Im Kasten liegen kleine Buchstaben aus Blei, sauber sortiert. „Damit kann man hundert Flugblätter drucken, {name}.“',
      'Hans stellt einen schweren Holzkasten auf den Tisch. Seine Hände sind schwarz von Druckfarbe. „Die Druckerei ist versiegelt, die Zeitung verboten. Aber das hier haben sie nicht gefunden.“ Im Kasten liegen Bleilettern, sauber nach Buchstaben sortiert. „Damit kann man hundert Flugblätter setzen, {name}.“',
    ),
    [
      {
        label: '„Wir behalten die Buchstaben und drucken damit.“',
        effects: { items: { flugblaetter: 2 }, self: { heat: 10 } },
        result: L(
          'Noch in derselben Woche druckt Hans zwei Bündel Flugblätter. Seine Augen leuchten zum ersten Mal seit Tagen. Aber wer die Buchstaben bei ihm findet, weiß sofort, woher sie kommen.',
          'Noch in derselben Woche setzt Hans zwei Bündel Flugblätter. Seine Augen leuchten dabei zum ersten Mal seit Tagen. Doch wer die Lettern bei ihm findet, weiß sofort, woher sie stammen.',
        ),
      },
      {
        label: '„Zu gefährlich. Wirf sie in die Spree.“',
        effects: { self: { heat: -10 }, moral: -2 },
        result: L(
          'Hans trägt den Kasten still zur Brücke. Man hört das Wasser kaum. Er redet den ganzen Abend nicht mehr.',
          'Hans trägt den Kasten schweigend zur Brücke. Man hört das Wasser kaum. Er redet den ganzen Abend nicht mehr.',
        ),
      },
    ],
  ),
  story(
    'Hans Wendt',
    8,
    'Ohne Gewerkschaft',
    L('Vor dem besetzten Haus der Gewerkschaft.', 'Vor dem besetzten Gewerkschaftshaus.'),
    L(
      'Hans steht vor dem Haus, in dem er dreißig Jahre lang Mitglied war. An der Tür hängt ein neues Schild. Davor stehen SA-Männer. Hans ballt die Fäuste. „Ich gehe da jetzt rein und hole unsere Fahne. Und wenn mich einer aufhält, dann soll er sehen.“',
      'Hans steht vor dem Haus, in dem er dreißig Jahre lang Mitglied war. An der Tür hängt ein neues Schild, davor stehen SA-Männer. Hans ballt die Fäuste. „Ich gehe da jetzt rein und hole unsere Fahne. Und wenn mich einer aufhält, dann soll er sehen.“',
    ),
    [
      {
        label: 'Ihn mit ruhigen Worten zurückhalten',
        check: { stat: 'empathie', min: 4 },
        effects: { moral: 4 },
        result: L(
          'Du legst ihm die Hand auf den Arm und redest leise, bis er die Fäuste öffnet. „Du hast recht“, sagt er. „So leicht kriegen die mich nicht.“',
          'Du legst ihm die Hand auf den Arm und redest leise, bis er die Fäuste öffnet. „Du hast recht“, sagt er schließlich. „Die kriegen mich nicht so billig.“',
        ),
        failEffects: { self: { heat: 20 }, moral: -2 },
        failResult: L(
          'Hans reißt sich los und schreit die Männer an. Sie lachen und schreiben seinen Namen auf. Nur mit Mühe bringst du ihn weg.',
          'Hans reißt sich los und schreit die Posten an. Sie lachen und notieren seinen Namen. Nur mit Mühe bringst du ihn fort.',
        ),
      },
      {
        label: L('„Schreib deine Wut auf. Wir drucken sie.“', '„Schreib deine Wut auf. Wir drucken sie.“'),
        effects: { items: { flugblaetter: 1 }, moral: 3, self: { heat: 5 } },
        result: L(
          'Hans schreibt die ganze Nacht. Am Morgen liegt ein Text auf dem Tisch. Er ist so wütend und so klar, dass alle ihn zweimal lesen.',
          'Hans schreibt die ganze Nacht. Am Morgen liegt ein Text auf dem Tisch, so zornig und klar, dass alle ihn zweimal lesen.',
        ),
      },
    ],
  ),

  // Lotte Krause, Näherin
  story(
    'Lotte Krause',
    1,
    'Die Geheimtaschen',
    L('Lottes Nähstube in einem Hinterhaus in Kreuzberg.', 'Lottes Heimwerkstatt in einem Kreuzberger Hinterhaus.'),
    L(
      'Zwischen Stoffen und Garnrollen zeigt dir Lotte einen alten Mantel. Sie klappt das Futter um. Darunter ist eine flache Tasche eingenäht, gerade groß genug für ein Bündel Papier. „Bei einer Kontrolle tasten sie die Manteltaschen ab. Hier sucht keiner. Soll ich für alle so etwas nähen?“',
      'Zwischen Stoffballen und Garnrollen zeigt dir Lotte einen alten Mantel. Sie klappt das Futter um: Darunter ist eine flache Tasche eingenäht, gerade groß genug für ein Bündel Papier. „Bei einer Kontrolle tasten sie die Manteltaschen ab. Hier sucht keiner. Soll ich für alle so etwas nähen?“',
    ),
    [
      {
        label: L('„Ja, für die ganze Gruppe.“ (Stoff kostet 5 Reichsmark)', '„Ja, für die ganze Gruppe.“ (Stoff kostet 5 Reichsmark)'),
        needsKasse: 5,
        effects: { kasse: -5, heatAll: -5, moral: 2 },
        result: L(
          'Drei Nächte sitzt Lotte an der Nähmaschine. Jetzt hat jeder in der Gruppe ein Geheimnis im Mantel. Man geht ruhiger an den Streifen vorbei.',
          'Drei Nächte sitzt Lotte an der Nähmaschine. Nun trägt jeder in der Gruppe ein Geheimnis im Futter. Man geht ruhiger an den Streifen vorbei.',
        ),
      },
      {
        label: '„Nur für dich selbst, das fällt weniger auf.“',
        effects: { self: { stat: 'heimlichkeit', statDelta: 1 } },
        result: L(
          'Lotte nickt. Mit ihrem neuen Mantel fällt sie noch weniger auf als sonst.',
          'Lotte nickt. Mit ihrem neuen Mantel wird sie noch unauffälliger, als sie ohnehin schon ist.',
        ),
      },
    ],
  ),
  story(
    'Lotte Krause',
    6,
    'Die Nachbarin',
    L('Das Treppenhaus vor Lottes Wohnung.', 'Das Treppenhaus vor Lottes Wohnung.'),
    L(
      'Lotte kommt blass zum Treffen. „Frau Gerlach von gegenüber hat mich gefragt, warum nachts so viele Leute zu mir kommen. Ihr Mann ist bei der SA.“ Sie knetet ihre Hände. „Ich weiß nicht, ob sie nur neugierig ist. Oder ob sie etwas ahnt.“',
      'Lotte kommt blass zum Treffen. „Frau Gerlach von gegenüber hat mich gefragt, warum bei mir nachts so viele Leute ein und aus gehen. Ihr Mann ist bei der SA.“ Sie knetet ihre Hände. „Ich weiß nicht, ob sie nur neugierig ist oder ob sie etwas ahnt.“',
    ),
    [
      {
        label: '„Du ziehst eine Weile zu deiner Schwester.“',
        needsKasse: 10,
        effects: { kasse: -10, self: { heat: -20 } },
        result: L(
          'Lotte packt noch am selben Abend. Die Gruppe legt Geld für die Miete zusammen. Frau Gerlach sieht nur noch eine verschlossene Tür.',
          'Lotte packt noch am selben Abend. Die Gruppe legt Geld für die Miete zusammen. Frau Gerlach sieht nur noch eine verschlossene Tür.',
        ),
      },
      {
        label: 'Mit Frau Gerlach reden und hoffen, dass sie schweigt',
        check: { stat: 'empathie', min: 5 },
        effects: { supporters: 1, moral: 4 },
        result: L(
          'Frau Gerlach hört zu. Dann sagt sie leise: „Mein Mann ist ein Dummkopf. Von mir erfährt er nichts.“ Seitdem steht manchmal ein Topf Suppe vor Lottes Tür.',
          'Frau Gerlach hört zu. Dann sagt sie leise: „Mein Mann ist ein Dummkopf. Von mir hört er nichts.“ Manchmal steht seitdem ein Topf Suppe vor Lottes Tür.',
        ),
        failEffects: { self: { heat: 25 } },
        failResult: L(
          'Frau Gerlach lächelt freundlich und sagt nichts. Zwei Tage später steht ein Mann in normaler Kleidung vor dem Haus.',
          'Frau Gerlach lächelt freundlich und sagt nichts. Zwei Tage später steht ein Mann in Zivil vor dem Haus.',
        ),
      },
    ],
  ),

  // Erich Vogt, Student
  story(
    'Erich Vogt',
    4,
    'Im Hörsaal',
    L('Ein Hörsaal der Universität in Berlin.', 'Ein Hörsaal der Friedrich-Wilhelms-Universität.'),
    L(
      'Erichs Stimme zittert. „Heute kamen Studenten in SA-Uniform in die Vorlesung von Professor Lehmann. Sie haben gebrüllt, bis er gegangen ist. Keiner hat etwas gesagt. Ich auch nicht.“ Er sieht dich an. „Nächste Woche kommen sie wieder. Soll ich aufstehen und widersprechen?“',
      'Erich erzählt mit bebender Stimme. „Heute kamen Studenten in SA-Uniform in die Vorlesung von Professor Lehmann. Sie haben gebrüllt, bis er gegangen ist. Keiner hat etwas gesagt. Ich auch nicht.“ Er sieht dich an. „Nächste Woche kommen sie wieder. Soll ich aufstehen und widersprechen?“',
    ),
    [
      {
        label: '„Steh auf. Einer muss es tun.“',
        effects: { moral: 6, supporters: 1, self: { heat: 20 } },
        result: L(
          'Erich steht auf. Er sagt laut: Das ist eine Universität und keine Kaserne. Es wird still im Saal. Danach suchen ihn zwei Studentinnen heimlich auf. Aber sein Name steht jetzt auf einer Liste.',
          'Erich steht auf und sagt laut, dass dies eine Universität sei und keine Kaserne. Es wird still im Saal. Zwei Studentinnen suchen ihn danach heimlich auf. Aber sein Name steht jetzt auf einer Liste.',
        ),
      },
      {
        label: L('„Sag nichts. Aber merk dir, wer mitmacht und wer nicht.“', '„Schweig und merk dir, wer mitmacht und wer nicht.“'),
        effects: { supporters: 1, moral: -1 },
        result: L(
          'Erich schweigt. Er schämt sich dafür. Aber er findet zwei andere Studenten, die genauso denken wie er.',
          'Erich schweigt. Er schämt sich dafür. Aber er findet zwei Kommilitonen, die genauso denken wie er.',
        ),
      },
    ],
  ),
  story(
    'Erich Vogt',
    9,
    L('Die Bücherwagen', 'Die Bücherkarren'),
    L('Der Hof des Studentenhauses, am Nachmittag des 10. Mai.', 'Der Hof des Studentenhauses, am Nachmittag des 10. Mai.'),
    L(
      'Alle Studenten sollen helfen, die Lastwagen zu beladen. Erich soll Bücher aus den Büchereien schleppen. Heute Nacht werden sie verbrannt. „Wer nicht mitmacht, fliegt von der Uni“, sagt er. „Was soll ich tun?“',
      'Die Studentenschaft hat alle Studenten aufgerufen, beim Beladen der Lastwagen zu helfen. Erich soll Bücher aus den Leihbüchereien schleppen, die heute Nacht brennen werden. „Wer sich weigert, fliegt von der Universität“, sagt er. „Was soll ich tun?“',
    ),
    [
      {
        label: '„Weigere dich.“',
        effects: { moral: 5, self: { heat: 15 } },
        result: L(
          'Erich geht nicht hin. Am nächsten Morgen hängt sein Name am Schwarzen Brett, zusammen mit sieben anderen. Er ist stolz. Und er hat Angst.',
          'Erich geht nicht hin. Am nächsten Morgen hängt sein Name am Schwarzen Brett, zusammen mit sieben anderen. Er ist stolz und hat Angst zugleich.',
        ),
      },
      {
        label: '„Geh hin und rette heimlich, was du kannst.“',
        effects: { moral: 3, supporters: 1, self: { heat: 5 } },
        result: L(
          'Erich trägt Kisten. Jedes Mal lässt er ein Buch unter seinem Mantel verschwinden. Am Abend liegen elf Bücher unter seinem Bett. Eines davon sind Gedichte von Erich Kästner.',
          'Erich trägt Kisten und lässt jedes Mal ein Buch unter seinem Mantel verschwinden. Am Abend liegen elf Bücher unter seinem Bett. Darunter ist ein Gedichtband von Erich Kästner.',
        ),
      },
    ],
  ),

  // Trude Kowalski, Verkäuferin
  story(
    'Trude Kowalski',
    3,
    'Die Fahnen im Schaufenster',
    L('Das Kaufhaus am Hermannplatz, nach Feierabend.', 'Das Warenhaus am Hermannplatz, nach Ladenschluss.'),
    L(
      'Trude zeigt dir einen Brief vom Chef. Alle Verkäuferinnen sollen die Schaufenster mit den neuen Fahnen schmücken. Am Sonntag sollen alle zusammen zur Kundgebung gehen. „Wenn ich nicht hingehe, fällt das auf“, sagt sie. „Wenn ich hingehe, schäme ich mich.“',
      'Trude zeigt dir ein Rundschreiben der Geschäftsleitung. Alle Verkäuferinnen sollen die Schaufenster mit den neuen Fahnen schmücken und am Sonntag geschlossen zur Kundgebung gehen. „Wenn ich nicht hingehe, fällt das auf“, sagt sie. „Wenn ich hingehe, schäme ich mich.“',
    ),
    [
      {
        label: '„Geh hin. Wir brauchen dich unauffällig.“',
        effects: { self: { heat: -10 }, moral: -3 },
        result: L(
          'Am Sonntag steht Trude in der Menge. Sie hebt den Arm, wenn alle ihn heben. Danach sitzt sie lange still in der Küche.',
          'Trude steht am Sonntag in der Menge und hebt den Arm, wenn alle ihn heben. Hinterher sitzt sie lange stumm in der Küche.',
        ),
      },
      {
        label: '„Melde dich krank.“',
        effects: { self: { heat: 10 }, moral: 3 },
        result: L(
          'Trude bleibt im Bett. Am Montag fragt ihr Chef spitz, ob es ihr wieder besser geht. Sie lächelt und sagt ja.',
          'Trude bleibt im Bett. Am Montag fragt der Abteilungsleiter spitz, ob es ihr wieder besser gehe. Sie lächelt und sagt ja.',
        ),
      },
    ],
  ),
  story(
    'Trude Kowalski',
    7,
    'Was die Kundschaft erzählt',
    L('Die Abteilung für Strümpfe, in einer ruhigen Stunde.', 'Die Strumpfabteilung, während einer ruhigen Stunde.'),
    L(
      'Eine Stammkundin ist mit einem Polizisten verheiratet. Sie plaudert gern. Heute erzählt sie Trude: Ihr Mann muss am Freitag früh raus. „In Neukölln wird aufgeräumt, sagt er. Ganze Straßen.“ Trude kommt sofort zu dir. „Das müssen die Leute wissen.“',
      'Eine Stammkundin, die Frau eines Polizeiwachtmeisters, plaudert gern. Heute erzählt sie Trude, ihr Mann müsse am Freitag früh raus: „In Neukölln wird aufgeräumt, sagt er. Ganze Straßenzüge.“ Trude kommt sofort zu dir. „Das müssen die Leute wissen.“',
    ),
    [
      {
        helps: { name: 'Familien in Neukölln', gender: 'w', who: L('Vor einer Razzia gewarnt', 'Rechtzeitig vor einer Razzia gewarnt') },
        label: 'Die Warnung sofort in Neukölln weitergeben',
        effects: { heatAll: -8, supporters: 2, trust: { neukoelln: 1 }, helped: 2 },
        result: L(
          'Noch am selben Abend geht die Nachricht von Tür zu Tür. Am Freitag finden die Polizisten in vielen Wohnungen niemanden mehr.',
          'Noch am selben Abend geht die Nachricht von Tür zu Tür. Am Freitag finden die Beamten in vielen Wohnungen niemanden mehr vor.',
        ),
      },
      {
        helps: { name: 'Familien in Neukölln', gender: 'w', who: L('Vor einer Razzia gewarnt', 'Rechtzeitig vor einer Razzia gewarnt') },
        label: '„Finde erst heraus, welche Straßen gemeint sind.“',
        effects: { heatAll: -4, self: { heat: 10 }, helped: 1 },
        result: L(
          'Trude fragt vorsichtig nach und erfährt zwei Straßennamen. Die Warnung kommt an. Aber die Kundin schaut Trude seitdem manchmal nachdenklich an.',
          'Trude fragt vorsichtig nach und erfährt zwei Straßennamen. Die Warnung kommt an, aber die Kundin sieht Trude seitdem manchmal nachdenklich an.',
        ),
      },
    ],
  ),

  // Heinrich Schulz, Straßenbahnschaffner
  story(
    'Heinrich Schulz',
    1,
    'In der Straßenbahn',
    L('Das Straßenbahndepot, nach der Spätschicht.', 'Das Straßenbahndepot, nach der Spätschicht.'),
    L(
      'Heinrich hat Schnee auf der Mütze. Er zittert, aber nicht vor Kälte. „Heute haben Hilfspolizisten einen Mann aus meiner Bahn gezerrt. Er hatte nur eine Zeitung gelesen, die ihnen nicht passte. Die Fahrgäste haben aus dem Fenster geschaut. Ich auch.“ Er legt einen Fahrschein auf den Tisch. „Den hat er verloren. Da steht eine Adresse drauf.“',
      'Heinrich hat Schnee auf der Mütze und zittert, nicht vor Kälte. „Heute haben Hilfspolizisten einen Mann aus meinem Wagen gezerrt. Er hatte nur eine Zeitung gelesen, die ihnen nicht passte. Die Fahrgäste haben aus dem Fenster geschaut. Ich auch.“ Er legt einen zerknitterten Fahrschein auf den Tisch. „Den hat er verloren. Da steht eine Adresse drauf.“',
    ),
    [
      {
        helps: { name: 'Frau eines Verhafteten', gender: 'w', who: L('Ihr habt ihr gesagt, was mit ihrem Mann geschah', 'Benachrichtigt, als ihr Mann verschleppt wurde') },
        label: '„Wir sagen seiner Familie Bescheid.“',
        effects: { supporters: 1, moral: 3, self: { heat: 5 }, helped: 1 },
        result: L(
          'Heinrich bringt die Nachricht noch in der Nacht zu der Adresse. Eine junge Frau öffnet. Sie dachte, ihr Mann sei einfach nicht nach Hause gekommen.',
          'Heinrich bringt die Nachricht noch in der Nacht zu der Adresse. Eine junge Frau öffnet. Sie hatte gedacht, ihr Mann sei einfach nicht nach Hause gekommen.',
        ),
      },
      {
        label: '„Wirf ihn weg. Du kannst ihm nicht helfen.“',
        effects: { moral: -4 },
        result: L(
          'Heinrich zerreißt den Fahrschein. Die Schnipsel liegen noch lange auf dem Tisch. Niemand mag sie wegräumen.',
          'Heinrich zerreißt den Fahrschein. Die Schnipsel liegen noch lange auf dem Tisch, weil niemand sie wegräumen mag.',
        ),
      },
    ],
  ),
  story(
    'Heinrich Schulz',
    5,
    'Die Anzeige',
    L('Hinter dem Straßenbahndepot.', 'Hinter dem Straßenbahndepot.'),
    L(
      'Heinrich ist aufgeregt. „Beim Chef liegt ein Brief. Ohne Namen. Darin steht, ich sei ein Roter und würde Hetzschriften verteilen.“ Er schluckt. „Einer von den Kollegen hat das geschrieben. Morgen muss ich zum Gespräch.“',
      'Heinrich ist aufgeregt. „Beim Betriebsleiter liegt ein Brief. Ohne Namen. Darin steht, ich sei ein Roter und würde Hetzschriften verteilen.“ Er schluckt. „Einer von den Kollegen muss das geschrieben haben. Morgen soll ich zum Gespräch.“',
    ),
    [
      {
        label: '„Sag, dass alles gelogen ist. Wir halten eine Weile Abstand.“',
        effects: { self: { heat: -5 }, moral: -2 },
        result: L(
          'Heinrich bleibt ruhig und sagt, er wisse von nichts. Der Chef glaubt ihm halb. Die Gruppe trifft sich eine Woche ohne ihn.',
          'Heinrich bleibt ruhig und sagt, er wisse von nichts. Der Betriebsleiter glaubt ihm halb. Die Gruppe trifft sich eine Woche lang ohne ihn.',
        ),
      },
      {
        label: '„Tauch unter. Wir sorgen für deine Familie.“',
        needsKasse: 10,
        effects: { kasse: -10, self: { heat: -25 } },
        result: L(
          'Heinrich meldet sich krank und schläft bei Verwandten in Pankow. Die Gruppe bringt seiner Frau Geld für die Miete. Der Brief wird vergessen.',
          'Heinrich meldet sich krank und schläft bei Verwandten in Pankow. Die Gruppe bringt seiner Frau Geld für die Miete. Der Brief verläuft im Sand.',
        ),
      },
    ],
  ),

  // Grete Hoffmann, Sprechstundenhilfe bei einem jüdischen Arzt
  story(
    'Grete Hoffmann',
    5,
    'Die Praxis von Dr. Levin',
    L('Eine Arztpraxis in der Neuen Königstraße, Sonnabend, 1. April.', 'Eine Arztpraxis in der Neuen Königstraße, Sonnabend, der 1. April.'),
    L(
      'Grete steht mit verschränkten Armen vor dir. „Vor der Praxis von Dr. Levin steht ein SA-Mann mit einem Schild. Die Kranken trauen sich nicht hinein. Dr. Levin hat vielen umsonst geholfen, als sie kein Geld hatten.“ Sie atmet tief ein. „Mir tut keiner was. Ich bin ja keine Jüdin. Also stelle ich mich jetzt neben ihn. Kommst du mit?“',
      'Grete steht vor dir, die Arme verschränkt. „Vor der Praxis von Dr. Levin steht ein SA-Mann mit einem Schild. Die Patienten trauen sich nicht hinein. Er hat vielen von ihnen umsonst geholfen, als sie kein Geld hatten.“ Sie holt tief Luft. „Mir können sie nicht viel. Ich bin keine Jüdin, ich bin nur die Sprechstundenhilfe. Gerade deshalb stelle ich mich jetzt neben ihn. Kommst du mit?“',
    ),
    [
      {
        helps: { name: 'Dr. Levin', gender: 'm', who: L('Jüdischer Arzt, ihr habt beim Boykott zu ihm gehalten', 'Jüdischer Arzt, dem ihr am Tag des Boykotts beigestanden habt') },
        label: '„Ich komme mit.“',
        effects: { moral: 8, heatLeader: 10, self: { heat: 10 }, helped: 1 },
        result: L(
          'Ihr steht zu zweit neben dem alten Arzt, stundenlang. Gegen Mittag kommt eine Arbeiterfrau mit ihrem Kind. Sie sieht den SA-Mann an und geht trotzdem hinein. Dr. Levin muss sich wegdrehen, damit keiner seine Tränen sieht.',
          'Ihr steht zu zweit neben dem alten Arzt, stundenlang. Gegen Mittag kommt eine Arbeiterfrau mit ihrem Kind, sieht den Posten an und geht trotzdem hinein. Dr. Levin muss sich abwenden.',
        ),
      },
      {
        label: '„Bleib zu Hause. Sie werden sich dein Gesicht merken.“',
        effects: { moral: -3 },
        result: L(
          'Grete bleibt zu Hause. Sie sagt an diesem Tag kein Wort mehr. Am Abend hörst du: Kein einziger Kranker war bei Dr. Levin.',
          'Grete bleibt. Sie sagt kein Wort mehr an diesem Tag. Am Abend erfährst du, dass nicht ein einziger Patient gekommen ist.',
        ),
      },
    ],
  ),
  story(
    'Grete Hoffmann',
    7,
    'Die Familie Levin will fort',
    L('Die Wohnung der Familie Levin, zwischen gepackten Koffern.', 'Die Wohnung der Familie Levin, zwischen gepackten Koffern.'),
    L(
      'Dr. Levins Tochter Ruth darf nicht weiter Medizin studieren. Ein neues Gesetz lässt kaum noch jüdische Studenten an die Universität. Die Familie will nach London. Aber sie braucht Geld für die Reise, und die Möbel müssen verkauft werden. Grete sieht dich an. „Helfen wir ihnen? Mein Bruder sagt: Uns geht es gut, das ist nicht unsere Sache.“',
      'Ein neues Gesetz beschränkt die Zahl jüdischer Studenten an den Universitäten. Ruth, die Tochter von Dr. Levin, darf ihr Medizinstudium wohl nicht beenden. Die Familie will nach London auswandern, solange es noch geht. Dafür müssen Möbel verkauft, Papiere beschafft und Fahrkarten bezahlt werden. Grete sieht dich an. „Mein Bruder sagt, uns geht es doch gut, das sei nicht unsere Sache. Aber wessen Sache ist es denn dann?“',
    ),
    [
      {
        helps: { name: 'Familie Levin', gender: 'w', who: L('Mit eurer Hilfe ausgewandert', 'Mit eurer Hilfe bei Verkauf und Papieren ausgewandert') },
        label: L('Mit der Gruppe beim Verkauf und den Papieren helfen', 'Mit der ganzen Gruppe beim Verkauf und bei den Papieren helfen'),
        needsKasse: 10,
        effects: { kasse: -10, moral: 5, helped: 3, self: { heat: 5 } },
        result: L(
          'Eine Woche lang packt ihr Kisten, fragt bei Ämtern nach und legt Geld zusammen. Am Bahnhof umarmt Ruth jeden aus der Gruppe. „Ihr habt uns nicht allein gelassen“, sagt sie. Dann fährt der Zug.',
          'Eine Woche lang packt ihr Kisten, lauft von Amt zu Amt und legt Geld für die Fahrkarten zusammen. Am Bahnhof Friedrichstraße umarmt Ruth jeden aus der Gruppe. „Ihr seid die Einzigen, die nicht weggesehen haben“, sagt sie. Dann fährt der Zug. Viele ihrer Verwandten, die bleiben, werden den Krieg nicht überleben.',
        ),
      },
      {
        label: L('„Dein Bruder hat recht. Wir können nicht allen helfen.“', '„Dein Bruder hat recht. Wir können nicht allen helfen.“'),
        effects: { moral: -5 },
        result: L(
          'Grete sagt nichts. Die Levins schaffen es trotzdem, aber viel später und viel ärmer. Grete sieht dich seitdem anders an.',
          'Grete schweigt. Die Levins schaffen es später doch, allein, um die Hälfte ihres Besitzes ärmer. Grete sieht dich seitdem anders an. Der Satz ihres Bruders geht dir nicht aus dem Kopf.',
        ),
      },
    ],
  ),

  // Johannes Hartmann, Hilfsprediger
  story(
    'Johannes Hartmann',
    4,
    'Die Predigt',
    L('Ein Raum neben der Kirche in Kreuzberg.', 'Die Sakristei einer evangelischen Kirche in Kreuzberg.'),
    L(
      'Johannes hält einen Brief in der Hand. Zum Tag von Potsdam soll in allen Kirchen für die neue Regierung gedankt werden. „Ich soll den neuen Staat segnen“, sagt er leise. „Am Sonntag stehe ich vor dreihundert Menschen.“',
      'Johannes hält einen Brief seines Superintendenten in der Hand. Zum Tag von Potsdam soll in allen Kirchen für die „nationale Erhebung“ gedankt werden. „Sie wollen, dass ich den neuen Staat segne“, sagt er leise. „Am Sonntag stehe ich vor dreihundert Menschen.“',
    ),
    [
      {
        label: '„Predige über die Nächstenliebe. Nur über sie.“',
        effects: { moral: 4, supporters: 1, self: { heat: 5 } },
        result: L(
          'Johannes erzählt von einem Mann, der einem Fremden hilft. Alle anderen sind an dem Fremden vorbeigegangen. Kein Wort über die Regierung. Trotzdem versteht jeder in der Kirche, was er meint.',
          'Johannes spricht über den barmherzigen Samariter, der dem Fremden hilft, an dem alle anderen vorbeigehen. Kein Wort über die Regierung. Jeder in der Kirche versteht trotzdem, was er meint.',
        ),
      },
      {
        label: '„Halte die Predigt, die sie wollen. Du darfst nicht auffallen.“',
        effects: { self: { heat: -10 }, moral: -4 },
        result: L(
          'Johannes liest den Text vor, der verlangt wird. Seine Stimme klingt fremd. Nach dem Gottesdienst geht er als Letzter aus der Kirche.',
          'Johannes liest den vorgeschriebenen Text vor. Seine Stimme klingt fremd. Nach dem Gottesdienst geht er als Letzter aus der Kirche.',
        ),
      },
    ],
  ),
  story(
    'Johannes Hartmann',
    9,
    'Die Deutschen Christen',
    L('Eine Sitzung der Gemeinde.', 'Eine Sitzung des Gemeindekirchenrats.'),
    L(
      'In Johannes’ Gemeinde gibt es Christen, die mit den Nazis gehen. Sie wollen, dass nur noch „arische“ Christen im Vorstand der Gemeinde sitzen. Ein getaufter Jude spielt seit zwanzig Jahren die Orgel. Er soll gehen. „Ich soll morgen dafür stimmen“, sagt Johannes. „Wie kann ich das?“',
      'In Johannes’ Gemeinde verlangen die „Deutschen Christen“, dass nur noch „arische“ Christen im Kirchenvorstand sitzen dürfen. Ein getaufter Jude, der seit zwanzig Jahren die Orgel spielt, soll gehen. „Ich soll morgen dafür stimmen“, sagt Johannes. „Wie kann ich das?“ Im September 1933 wird die preußische Landeskirche einen solchen „Arierparagraphen“ tatsächlich beschließen.',
    ),
    [
      {
        helps: { name: 'Christen jüdischer Herkunft', gender: 'm', who: L('Johannes hat sich offen für sie eingesetzt', 'Gemeindemitglieder, für die Johannes offen eingetreten ist') },
        label: '„Widersprich offen.“',
        effects: { moral: 6, supporters: 2, self: { heat: 15 }, helped: 1 },
        result: L(
          'Johannes steht auf. Er sagt: Jesus hat nie gefragt, woher jemand kommt. Die Abstimmung verliert er. Aber drei Pfarrer aus anderen Gemeinden schreiben ihm noch in dieser Woche.',
          'Johannes steht auf und sagt, Christus habe nicht nach der Abstammung gefragt. Die Abstimmung verliert er. Aber drei Pfarrer aus anderen Gemeinden schreiben ihm noch in derselben Woche.',
        ),
      },
      {
        label: '„Sammle heimlich Menschen, die so denken wie du.“',
        effects: { supporters: 2, moral: 2 },
        result: L(
          'Johannes stimmt nicht mit ab. Danach besucht er einen Pfarrer nach dem anderen. Viele denken wie er. Sie beginnen, sich zu treffen.',
          'Johannes enthält sich und besucht danach einen Pfarrer nach dem anderen. Viele denken wie er. Sie beginnen, sich zu treffen. Der Organist aber muss gehen.',
        ),
      },
    ],
  ),

  // Anni Neumann, Stenotypistin
  story(
    'Anni Neumann',
    2,
    'Die Akten im Büro',
    L('Ein Anwaltsbüro am Hackeschen Markt, nach Feierabend.', 'Eine Anwaltskanzlei am Hackeschen Markt, nach Büroschluss.'),
    L(
      'Anni tippt die Briefe ihres Chefs. Er ist Anwalt und hilft jetzt vor allem den Familien von Verhafteten. „In diesen Akten stehen die Adressen von vierzig Familien. Die Männer sind alle verhaftet“, flüstert sie. „Ich könnte sie abschreiben. Dann wüsstet ihr, wo Hilfe gebraucht wird.“',
      'Anni tippt die Schriftsätze ihres Chefs, eines Anwalts, der jetzt fast nur noch Familien von Verhafteten vertritt. „In diesen Akten stehen die Adressen von vierzig Familien, deren Männer in Schutzhaft sitzen“, flüstert sie. „Ich könnte sie abschreiben. Dann wüsstet ihr, wo Hilfe gebraucht wird.“',
    ),
    [
      {
        helps: { name: 'Familien von Gefangenen', gender: 'w', who: L('Mit Annis Liste gefunden und besucht', 'Über Annis abgeschriebene Liste gefunden und unterstützt') },
        label: '„Schreib sie ab.“',
        effects: { supporters: 2, self: { heat: 10 }, trust: { mitte: 1 }, helped: 2 },
        result: L(
          'Anni tippt die Liste in einer halben Stunde und verbrennt das Kohlepapier. Mit ihrer Hilfe findet die Gruppe Familien, die sonst niemand besucht hätte.',
          'Anni tippt die Liste in einer halben Stunde und verbrennt das Kohlepapier. Mit ihrer Hilfe erreicht die Gruppe Familien, die sonst niemand besucht hätte.',
        ),
      },
      {
        label: '„Lass die Akten, wo sie sind.“',
        effects: { moral: -1 },
        result: L(
          'Anni nickt erleichtert. Aber sie sieht die Akten jetzt jeden Morgen anders an.',
          'Anni nickt erleichtert. Aber sie sieht die Aktendeckel jetzt jeden Morgen anders an.',
        ),
      },
    ],
  ),
  story(
    'Anni Neumann',
    6,
    'Der Anwalt',
    L('Das leer geräumte Büro.', 'Die ausgeräumte Kanzlei.'),
    L(
      'Annis Chef, Dr. Frankel, ist Jude. Nach einem neuen Gesetz darf er nicht mehr als Anwalt arbeiten. Das Büro wird geschlossen. Anni verliert ihre Arbeit. Zum Abschied schiebt er ihr seine Schreibmaschine hin. „Nehmen Sie sie, Fräulein Neumann. Sie wissen besser als ich, was man damit heute schreiben muss.“',
      'Annis Chef, Dr. Frankel, ist Jude. Nach einem neuen Gesetz darf er nicht mehr als Anwalt arbeiten. Die Kanzlei wird geschlossen, Anni verliert ihre Stelle. Zum Abschied schiebt er ihr seine Schreibmaschine hin. „Nehmen Sie sie, Fräulein Neumann. Sie wissen besser als ich, was man damit heute schreiben muss.“',
    ),
    [
      {
        label: '„Nimm sie an.“',
        effects: { items: { flugblaetter: 2 }, self: { heat: 5 } },
        result: L(
          'Die Schreibmaschine steht jetzt in Annis Kammer, unter einer Decke. In der ersten Nacht tippt sie zwei Bündel Flugblätter.',
          'Die Schreibmaschine steht jetzt in Annis Kammer, unter einer Decke. In der ersten Nacht tippt sie zwei Bündel Flugblätter.',
        ),
      },
      {
        helps: { name: 'Dr. Frankel', gender: 'm', who: L('Jüdischer Anwalt, ihr habt ihm beim Verkauf geholfen', 'Jüdischer Anwalt mit Berufsverbot, dem ihr beim Verkauf geholfen habt') },
        label: '„Lass sie ihm. Er wird das Geld brauchen.“',
        effects: { moral: 3, helped: 1 },
        result: L(
          'Anni hilft Dr. Frankel beim Verkauf der Möbel. Beim Abschied sagt er, sie sei die anständigste Mitarbeiterin, die er je hatte.',
          'Anni hilft Dr. Frankel beim Verkauf der Möbel. Beim Abschied sagt er, sie sei die anständigste Sekretärin gewesen, die er je hatte.',
        ),
      },
    ],
  ),

  // August Brenner, Kohlenträger
  story(
    'August Brenner',
    3,
    'Die Durchsuchung im Hinterhaus',
    L('Augusts Mietshaus im Wedding, früh am Morgen.', 'Augusts Mietskaserne im Wedding, im Morgengrauen.'),
    L(
      'Um fünf Uhr früh stürmt die SA das Hinterhaus. Sie suchen Waffen und verbotene Schriften. August hat im Kohlenkeller die Fahne und die Bücher seines verhafteten Nachbarn versteckt. „Wenn sie in den Keller gehen, finden sie alles“, flüstert er dir am Mittag zu.',
      'Um fünf Uhr früh stürmt die SA das Hinterhaus. Sie suchen Waffen und Schriften. August hat im Kohlenkeller die Fahne und die Bücher seines verhafteten Nachbarn versteckt. „Wenn sie in den Keller gehen, finden sie alles“, flüstert er dir am Mittag zu.',
    ),
    [
      {
        label: '„Bleib ruhig. Du bist nur der Kohlenträger.“',
        check: { stat: 'staerke', min: 3 },
        effects: { moral: 4, self: { heat: 5 } },
        result: L(
          'Als die SA-Männer in den Keller wollen, schüttet August gerade einen großen Sack Kohlen aus. Staub und Lärm. Die Männer fluchen und gehen wieder.',
          'Als die SA-Männer in den Keller wollen, schüttet August gerade einen Zentner Briketts aus. Staub und Lärm. Die Männer fluchen und gehen wieder.',
        ),
        failEffects: { self: { heat: 20 } },
        failResult: L(
          'Die SA-Männer suchen nicht in den Kohlen. Aber sie schreiben Augusts Namen auf. „Wir kommen wieder“, sagt einer.',
          'Die SA-Männer durchwühlen die Kohlen nicht, aber sie nehmen Augusts Namen auf. „Wir kommen wieder“, sagt einer.',
        ),
      },
      {
        label: '„Verbrenn heute Nacht alles im Ofen.“',
        effects: { self: { heat: -10 }, moral: -2 },
        result: L(
          'August verbrennt die Bücher Seite für Seite. Die Fahne behält er, gefaltet unter der Matratze. „Die nicht“, sagt er.',
          'August verbrennt die Bücher Seite für Seite. Die Fahne behält er, zusammengefaltet unter der Matratze. „Die nicht“, sagt er.',
        ),
      },
    ],
  ),
  story(
    'August Brenner',
    8,
    'Der Kohlenplatz',
    L('Ein Kohlenplatz am Nordhafen.', 'Ein Kohlenplatz am Nordhafen.'),
    L(
      'Auf dem Kohlenplatz haben jetzt die Nazis das Sagen. Alle Männer sollen in ihre Gruppe eintreten. Wer nicht will, bekommt die schlechten Schichten. „Ich könnte nur so tun, als ob“, brummt August. „Dann höre ich, was die vorhaben.“',
      'Auf dem Kohlenplatz hat die nationalsozialistische Betriebszelle das Sagen. Alle Männer sollen eintreten. Wer nicht will, bekommt die schlechten Schichten. „Ich könnte zum Schein eintreten“, brummt August. „Dann höre ich, was die vorhaben.“',
    ),
    [
      {
        label: '„Tritt zum Schein ein und halte die Ohren offen.“',
        effects: { self: { heat: -15 }, supporters: 1, moral: -2 },
        result: L(
          'August trägt jetzt ein Abzeichen, das er hasst. Aber er hört, wer auf dem Platz noch anders denkt. So findet er einen neuen Helfer für die Gruppe.',
          'August trägt jetzt ein Abzeichen, das er hasst. Aber er hört, wer auf dem Platz noch anders denkt, und bringt der Gruppe einen neuen Helfer.',
        ),
      },
      {
        label: '„Weigere dich.“',
        effects: { moral: 5, kasse: -5, self: { heat: 15 } },
        result: L(
          'August sagt Nein. Er bekommt nur noch Nachtschichten und weniger Geld. „Dafür kann ich mir morgens noch in die Augen sehen“, sagt er.',
          'August weigert sich. Er bekommt nur noch die Nachtschichten und weniger Lohn. „Dafür kann ich mir morgens noch ins Gesicht sehen“, sagt er.',
        ),
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
