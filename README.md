# Gegen den Strom. Berlin 1933

Ein Geschichtsspiel für den Unterricht ab Klasse 6. Die Spielerinnen und Spieler führen eine kleine Widerstandsgruppe durch zwei Kapitel: zehn Wochen von Januar bis Mai 1933 und acht Wochen von März 1936 bis Dezember 1938. Die Figuren sind erfunden, die Ereignisse, Quellen und Vorbilder sind historisch und im Wortlaut geprüft.

## Starten

```bash
npm install
npm run dev
```

## Für den Unterricht bereitstellen

```bash
npm run build
```

Der Ordner `dist/` ist eine rein statische Seite und läuft auf jedem Webserver, auch in einem Unterordner (etwa auf dem Schulserver, bei Netlify, Vercel oder GitHub Pages). Es werden keine externen Dienste oder Schriften geladen, der Spielstand liegt nur im Browser des Geräts.

## Prüfen

```bash
npm run typecheck
npm test
```

Die Tests prüfen Spiellogik, Textbausteine (keine Gedankenstriche, keine offenen Platzhalter) und die Spielbalance, indem sie 240 Partien automatisch durchspielen.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `src/game/data/weeks.ts` | Die zehn Wochen: Zeitungsseiten, Einordnung, Entscheidungsszenen |
| `src/game/data/missions.ts` | Die sieben Auftragsarten mit Kosten, Werten und Berichtstexten |
| `src/game/data/districts.ts` | Wedding, Mitte, Kreuzberg, Neukölln mit Orten und Überwachung je Woche |
| `src/game/data/lexicon.ts` | Worterklärungen für Schülerinnen und Schüler |
| `src/game/logic.ts` | Würfel, Erfolgsaussicht, Gefahr, Effekte (rein und getestet) |
| `src/store/GameStore.ts` | Zustand-Store mit Wochenablauf, gespeichert im Browser |
| `src/components/` | `CharacterCreator`, `MapBoard`, `NewspaperModal`, `MissionDossier`, `NarrativeEvent`, `WeekReport`, `EndScreen`, `Avatar` |
| `src/styles/period.module.css` | Papier, Stempel, Siegel, Akten |

## Spielregeln in Kürze

Erfolgsaussicht: 45 % plus 9 Punkte je Teamstärke über der Schwierigkeit. Die Teamstärke ist die Summe aus Hauptwert und halbem Nebenwert aller Teilnehmer, begrenzt auf 5 bis 95 %.

Gefahr: Grundrisiko des Auftrags, Überwachung des Bezirks, 5 Punkte je weiterem Teilnehmer, abzüglich dreimal die beste Heimlichkeit, zuzüglich eines Fünftels des mittleren Fahndungsdrucks.

Wer entdeckt wird, erhält 20 Punkte Fahndungsdruck. Wer dabei schon gesucht wird (ab 70), wird zur Hälfte verhaftet. Bei 100 Punkten holt die Polizei die Person ab. Wird die Anführerin oder der Anführer verhaftet oder sinkt die Moral auf null, endet das Spiel.
