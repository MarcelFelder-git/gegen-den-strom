import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import s from '../styles/period.module.css'
import { Modal } from './ui/Modal'
import { useUi } from '../store/UiStore'

export function TeacherNotes() {
  const close = useUi((u) => u.close)
  return (
    <Modal label="Hinweise für Lehrkräfte" onClose={close} width="max-w-2xl">
      <div className={`${s.paper} relative px-5 py-7 sm:px-9`}>
        <button
          onClick={close}
          className="absolute top-3 right-3 grid h-10 w-10 place-items-center border-2 border-ink bg-paper hover:bg-ink hover:text-paper"
          aria-label="Hinweise schließen"
        >
          <X size={20} aria-hidden />
        </button>
        <h2 className="font-serif text-3xl font-bold">Hinweise für Lehrkräfte</h2>
        <div className="mt-4 space-y-4 font-serif text-[16px] leading-relaxed">
          <p>
            „Gegen den Strom“ lässt Schülerinnen und Schüler ab Klasse 6 eine kleine Widerstandsgruppe durch die ersten
            Monate der nationalsozialistischen Diktatur führen, vom 30. Januar bis zum 10. Mai 1933. Ein Durchgang dauert
            etwa 30 bis 40 Minuten und passt in eine Unterrichtsstunde.
          </p>
          <Block title="Was ist erfunden, was ist wahr?">
            Alle Figuren sind erfunden. Die Zeitungsmeldungen, Daten, Gesetze, Abstimmungsergebnisse und Orte beruhen auf
            den historischen Ereignissen. Die Zeitung ist bewusst im Ton der gleichgeschalteten Presse gehalten. Die
            Notiz „Was nicht in der Zeitung steht“ und der Kasten „Zum Verständnis“ ordnen jede Meldung ein und eignen
            sich als Einstieg in Quellenkritik.
          </Block>
          <Block title="Darstellung">
            Gewalt wird benannt, aber nicht gezeigt. Verfassungswidrige Kennzeichen erscheinen weder im Bild noch als
            Symbol. Antisemitische Losungen der Zeit werden nur dort zitiert, wo sie für das Verständnis des Boykotts
            nötig sind, und stets eingeordnet.
          </Block>
          <Block title="Spielprinzip">
            Jede Woche beginnt mit einer Zeitung und einer Entscheidung. Danach werden Aufträge auf der Stadtkarte
            verteilt. Erfolg und Entdeckung werden offen ausgewürfelt; der Wochenbericht zeigt jeden Wurf. So lässt sich
            besprechen, warum Vorsicht und Zusammenhalt im Widerstand überlebenswichtig waren.
          </Block>
          <Block title="Zwei Kapitel für zwei Stunden">
            Kapitel 1 spielt von Januar bis Mai 1933, Kapitel 2 von März 1936 bis Dezember 1938, mit den Olympischen
            Spielen, dem Zwangslager Marzahn, dem Novemberpogrom und den Kindertransporten. Wer Kapitel 1 übersteht, spielt
            mit derselben Gruppe weiter. Kapitel 2 lässt sich auf dem Titelbild auch direkt beginnen, etwa wenn die
            Schülerinnen und Schüler in der zweiten Stunde an einem anderen Rechner sitzen. Krieg und Holocaust werden am
            Ende nur benannt, nicht gespielt.
          </Block>
          <Block title="Quelle der Woche und echte Vorbilder">
            Jede Woche zeigt ein echtes Dokument mit einer kleinen Aufgabe, etwa den Wortlaut der Reichstagsbrandverordnung,
            den Satz von Otto Wels oder den Stimmzettel von 1938. Alle Zitate wurden im Wortlaut geprüft. Im Album der
            Vorbilder sammeln die Kinder dreizehn echte Menschen des Widerstands, von Carl von Ossietzky bis Wilhelm Krützfeld.
            Gesichter werden bewusst nicht gezeichnet.
          </Block>
          <Block title="Gefährten, Bezirke und Vorhaben">
            Jede Figur der Gruppe hat eigene Geschichten, die an echte Ereignisse von 1933 anknüpfen: das Berufsverbot
            für jüdische Anwälte, die Auswanderung, der Druck auf Pfarrer und Studenten. In jedem Bezirk gibt es eigene
            Aufträge, etwa die Hilfe für Familien Verhafteter nach dem Vorbild der Roten Hilfe. Über mehrere Wochen baut
            die Gruppe eine eigene Druckerei auf.
          </Block>
          <Block title="Abschlussblatt und Ton">
            Am Ende lässt sich ein Abschlussblatt drucken: alle Entscheidungen, die Einsätze und drei Fragen mit
            Schreiblinien. Die Geräusche werden im Browser erzeugt und lassen sich oben rechts mit „Ton an“ oder auf dem
            Titelbild ausschalten. Im Klassenraum empfehlen sich Kopfhörer.
          </Block>
          <Block title="Datenschutz">
            Das Spiel sendet keine Daten. Schriften werden mitgeliefert, es werden keine externen Dienste geladen. Der
            Spielstand liegt nur im Browser des jeweiligen Geräts und kann über „Neues Spiel“ verworfen werden.
          </Block>
          <Block title="Anregungen für die Nachbesprechung">
            Warum schlossen sich Menschen wie Rudi der SA an? Welche Rolle spielten Nachbarn, die schwiegen oder
            anzeigten? Welche Handlungsspielräume hatten gewöhnliche Menschen 1933, und welche haben wir heute? Am Ende
            des Spiels stehen drei Fragen für ein Gespräch in der Klasse.
          </Block>
        </div>
      </div>
    </Modal>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className={`${s.typewriter} text-sm font-bold tracking-[0.15em] uppercase`}>{title}</h3>
      <p className="mt-1">{children}</p>
    </section>
  )
}
