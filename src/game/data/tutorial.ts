import { L, type Txt } from '../text'

/**
 * Die Einführung beim ersten Blick auf die Stadtkarte: das Spielprinzip in wenigen Seiten.
 * Jede Seite hat eine Überschrift, kurze Absätze und ein Bild aus echten Spielelementen.
 */
export interface TutorialPage {
  id: 'ziel' | 'woche' | 'auftraege' | 'gefahr' | 'haft' | 'mittel' | 'los'
  title: Txt
  text: Txt[]
}

export const TUTORIAL: TutorialPage[] = [
  {
    id: 'ziel',
    title: L('Worum es geht', 'Worum es geht'),
    text: [
      L(
        'Ihr seid eine kleine Gruppe in Berlin. Euch geht es gut. Niemand verfolgt euch. Aber ihr seht, wie andere verfolgt werden. Ihr entscheidet: Wir sehen nicht weg.',
        'Ihr führt eine kleine Widerstandsgruppe in Berlin. Selbst werdet ihr nicht verfolgt, ihr könntet euch also heraushalten. Stattdessen entscheidet ihr, nicht wegzusehen.',
      ),
      L(
        'Ihr könnt die Nazis nicht besiegen. Das hat damals keine Gruppe geschafft. Aber ihr könnt Menschen helfen. Jede Hilfe zählt bei „Geholfen“ oben am Bildschirm. Tippt darauf, dann seht ihr die Gesichter.',
        'Den Nationalsozialismus besiegt ihr im Spiel nicht, das gelang keiner Gruppe im Widerstand. Gemessen wird, wie vielen Menschen ihr beisteht. Das zeigt die Anzeige „Geholfen“ oben am Bildschirm. Tippt ihr darauf, seht ihr die Menschen dahinter.',
      ),
    ],
  },
  {
    id: 'woche',
    title: L('So läuft eine Woche', 'So läuft eine Woche'),
    text: [
      L('Jede Woche hat vier Schritte. Dann beginnt die nächste Woche.', 'Jede Spielrunde ist eine Woche mit vier Schritten.'),
    ],
  },
  {
    id: 'auftraege',
    title: L('Aufträge planen', 'Aufträge planen'),
    text: [
      L(
        'Tippe einen Auftrag an. Auf der Karte oder in der Liste. Dann öffnet sich die Akte. Wähle bis zu drei Personen aus. Tippe dann auf „Einteilen“.',
        'Tippt einen Auftrag auf der Karte oder in der Liste an. In der Akte wählt ihr bis zu drei Personen und tippt auf „Einteilen“. Wer gut zum Auftrag passt, erhöht die Aussicht auf Erfolg.',
      ),
      L(
        'Aufträge mit einem Herz helfen verfolgten Menschen direkt.',
        'Aufträge mit einem Herz helfen verfolgten Menschen direkt und zählen für eure Solidarität.',
      ),
    ],
  },
  {
    id: 'gefahr',
    title: L('Aussicht und Gefahr', 'Aussicht, Gefahr und Fahndung'),
    text: [
      L(
        '„Aussicht“ heißt: So gut sind die Chancen, dass es klappt. „Gefahr“ heißt: So leicht werdet ihr entdeckt.',
        '„Aussicht“ ist die Chance auf Erfolg, „Gefahr“ die Wahrscheinlichkeit, entdeckt zu werden. Stark überwachte Bezirke sind gefährlicher. Vertrauen in einem Bezirk senkt die Gefahr.',
      ),
      L(
        'Wer oft unterwegs ist, fällt der Polizei auf. Das zeigt die Fahndung. Ab 70 wird die Person gesucht. Lasst sie dann eine Woche ausruhen.',
        'Jeder Einsatz erhöht die Fahndung einer Person. Ab 70 wird sie gesucht und bei einer Entdeckung leicht verhaftet. Wer eine Woche ruht, gerät aus dem Blick der Polizei.',
      ),
    ],
  },
  {
    id: 'haft',
    title: L('Wenn jemand verhaftet wird', 'Wenn jemand verhaftet wird'),
    text: [
      L(
        'Verhaftete fehlen der Gruppe für einige Wochen. Ihr könnt ihnen helfen. Schickt ein Paket, bezahlt einen Anwalt oder versorgt die Familie.',
        'Verhaftete fehlen der Gruppe für Wochen. Hilfe von außen ist möglich: Pakete ins Gefängnis, ein Anwalt, Unterstützung für die Familie.',
      ),
      L(
        'Ist die Person in Haft, die euch anführt? Dann übernimmt jemand anderes. Eure Gruppe macht weiter.',
        'Manche kommen nicht zurück. Wird die Person verhaftet, die euch anführt, oder verliert die Gruppe allen Mut, ist das Spiel vorbei. Eine Chronik erzählt dann, wie es weiterging.',
      ),
    ],
  },
  {
    id: 'mittel',
    title: L('Was eure Gruppe braucht', 'Was eure Gruppe braucht'),
    text: [
      L('Diese Werte stehen oben am Bildschirm.', 'Diese Werte stehen oben am Bildschirm.'),
    ],
  },
  {
    id: 'los',
    title: L('Los geht’s', 'Los geht’s'),
    text: [
      L(
        'Im Wochenplan steht das Ziel der Woche. Schafft ihr es, gibt es eine kleine Belohnung.',
        'Im Wochenplan steht ein Ziel der Woche. Wer es erreicht, bekommt im Wochenbericht eine kleine Belohnung.',
      ),
      L(
        'Habt ihr alles geplant? Dann tippt auf „Woche beenden“. Diese Erklärung findet ihr jederzeit unter „So geht’s“.',
        'Ist alles geplant, tippt ihr auf „Woche beenden“. Die Erklärung findet ihr jederzeit wieder unter „So geht’s“.',
      ),
    ],
  },
]

/** Die vier Schritte einer Woche, für die zweite Seite */
export const TUTORIAL_WEEK: { label: string; text: Txt }[] = [
  { label: 'Zeitung und Quelle', text: L('Ihr lest, was in Berlin passiert.', 'Ihr lest die Nachrichten der Woche und prüft eine echte Quelle.') },
  { label: 'Begegnungen', text: L('Menschen bitten euch um Hilfe. Ihr entscheidet.', 'Menschen aus der Stadt und aus eurer Gruppe stellen euch vor Entscheidungen.') },
  { label: 'Aufträge planen', text: L('Auf der Karte teilt ihr eure Leute ein.', 'Auf der Stadtkarte teilt ihr eure Leute für Aufträge ein.') },
  { label: 'Die Nacht', text: L('Die Würfel entscheiden, ob es klappt.', 'Der Würfel entscheidet über Erfolg und Entdeckung. Am Morgen folgt der Bericht.') },
]

/** Die Werte der Gruppe, für die Seite „Was eure Gruppe braucht“ */
export const TUTORIAL_RESOURCES: { label: string; text: Txt }[] = [
  {
    label: 'Moral',
    text: L(
      'Der Mut eurer Gruppe. Er sinkt jede Woche ein wenig. Erfolge und Hilfe machen wieder Mut.',
      'Der Mut der Gruppe. Er sinkt jede Woche und bei Rückschlägen, Erfolge und gelungene Hilfe heben ihn.',
    ),
  },
  { label: 'Kasse', text: L('Geld für Material und für Hilfe. Jede Woche kommt etwas dazu.', 'Geld für Material und Hilfe. Jede Woche kommt etwas hinzu.') },
  {
    label: 'Unterstützer',
    text: L(
      'Menschen, die euch heimlich helfen. Je mehr es sind, desto mehr Geld kommt jede Woche.',
      'Menschen, die euch heimlich unterstützen. Sie spenden, je mehr, desto mehr Geld kommt jede Woche in die Kasse.',
    ),
  },
  {
    label: 'Material',
    text: L('Papier, Farbe, Flugblätter und falsche Ausweise. Manche Aufträge brauchen das.', 'Papier, Druckfarbe, Flugblätter und falsche Ausweise, die manche Aufträge verbrauchen.'),
  },
]
