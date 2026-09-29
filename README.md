# Solidarity is Resistance. Berlin 1933 bis 1938

Ein Geschichtsspiel für den Unterricht ab Klasse 6. Die Spielerinnen und Spieler führen eine kleine Widerstandsgruppe durch zwei Kapitel: zehn Wochen von Januar bis Mai 1933 und acht Wochen von März 1936 bis Dezember 1938. Die Gruppe besteht aus Menschen, die selbst nicht rassistisch verfolgt werden und sich trotzdem für die Verfolgten einsetzen. Gemessen wird nicht ein Sieg, sondern die Solidarität: wie vielen Menschen die Gruppe beigestanden hat.

Die Gruppenmitglieder sind erfunden. Die Ereignisse, Quellen, Zeitzeugenberichte, Vorbilder und Fotos sind echt und geprüft. Die Zeitungen sind nachgestellt.

## Zwei Stufen

| | 6. bis 8. Klasse | ab 9. Klasse und Oberstufe |
| --- | --- | --- |
| Sprache | einfache Sprache, kurze Sätze | ausführliche Texte, anspruchsvollere Quellenfragen |
| Aufträge | Erfolgsaussicht +10, Gefahr × 0,8, Tipps | realistische Werte, auch Unbekannte können verhaftet werden |
| Haft | Rückkehr nach 1 bis 2 Wochen | 2 Wochen (mit Anwalt 1), manche werden verurteilt oder überleben nicht |
| Ende | läuft immer bis zum Kapitelende | Gruppe kann zerschlagen werden, danach Chronik der restlichen Wochen |

## Starten

```bash
npm install
npm run dev
```

## Für den Unterricht bereitstellen

```bash
npm run build
```

Der Ordner `dist/` ist eine rein statische Seite und läuft auf jedem Webserver, auch in einem Unterordner (etwa bei Vercel). Es werden keine externen Dienste oder Schriften geladen, der Spielstand liegt nur im Browser des Geräts. In den Hinweisen für Lehrkräfte steht ein QR-Code der aktuellen Adresse zum Scannen mit den Schul-iPads.

## Prüfen

```bash
npm run typecheck
npm test
```

Vor einer Unterrichtsstunde lohnt zusätzlich der iPad-Test. Er baut das Spiel und spielt es in der Safari-Engine (WebKit) auf simulierten iPads automatisch durch: beide Kapitel in beiden Stufen, hochkant, quer, iPad mini und geteilter Bildschirm. Beim ersten Mal muss die Engine einmalig geladen werden.

```bash
npx playwright install webkit
npm run test:ipad
```

Der iPad-Test achtet auf Abstürze, Fehler in der Konsole, Fotos, die nicht laden, Seiten, die breiter als der Bildschirm sind, und darauf, dass der Spielstand Neuladen übersteht. Ein beschädigter Spielstand führt zu einer Fehlerseite mit Ausweg statt zu einer weißen Seite.

Die Tests prüfen Spiellogik, Haft und Nachfolge, beide Sprachstufen (keine Gedankenstriche, keine offenen Platzhalter, kurze Sätze in der leichten Stufe), die Bildnachweise und die Spielbalance, indem sie Hunderte Partien in beiden Stufen automatisch durchspielen.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `src/game/text.ts` | Zweistufige Texte: `L('leicht', 'schwer')` und `resolve()` |
| `src/game/difficulty.ts` | Die beiden Schwierigkeitsstufen |
| `src/game/data/weeks.ts`, `weeks1936.ts` | Die 18 Wochen: Zeitung, Tagebuch, Stimmen, Zeitzeugen, Einordnung, Begegnungen |
| `src/game/data/timeline.ts` | Die Vorgeschichte von 1918 bis 1933 für das Intro |
| `src/game/data/photos.ts` | Alle Fotos mit Bildnachweis (Dateien in `public/fotos`) |
| `src/game/data/missions.ts` | Die Auftragsarten, solidarische Aufträge zählen „Menschen geholfen“ |
| `src/game/data/prison.ts` | Haftorte nach Zeit und Hilfe von außen |
| `src/game/data/cards.ts` | Dreizehn echte Vorbilder |
| `src/game/logic.ts` | Würfel, Erfolgsaussicht, Gefahr, Effekte (rein und getestet) |
| `src/store/GameStore.ts` | Zustand-Store mit Wochenablauf, gespeichert im Browser |
| `src/components/week/` | Der Wochenablauf in vier Schritten mit Zurück-Blättern |
| `src/components/intro/` | Stufenwahl und Intro mit Zeitleiste |

## Bildnachweis

Alle Fotos stammen von Wikimedia Commons, überwiegend aus dem Bundesarchiv (CC BY-SA 3.0 de), einige sind gemeinfrei oder stehen unter CC BY 3.0 oder CC0. Die vollständige Liste mit Urhebern und Links steht im Spiel unter „Hinweise für Lehrkräfte“ und in `src/game/data/photos.ts`.
