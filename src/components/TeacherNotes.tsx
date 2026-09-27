import { useEffect, useState, type ReactNode } from 'react'
import { Images, QrCode, X } from 'lucide-react'
import s from '../styles/period.module.css'
import { Modal } from './ui/Modal'
import { StampButton } from './ui/StampButton'
import { useUi } from '../store/UiStore'

/** QR-Code der aktuellen Adresse, damit die Klasse das Spiel mit dem Tablet öffnen kann */
function ClassQr({ big }: { big: boolean }) {
  const [svg, setSvg] = useState('')
  const url = typeof window === 'undefined' ? '' : window.location.origin + window.location.pathname
  useEffect(() => {
    // Die QR-Bibliothek wird erst geladen, wenn jemand die Hinweise öffnet
    import('qrcode')
      .then((m) => m.default.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1c1c1e', light: '#f4f1ea' } }))
      .then(setSvg)
      .catch(() => setSvg(''))
  }, [url])
  return (
    <figure className="m-0 flex flex-col items-center">
      <div
        className={`${big ? 'w-[min(80vw,520px)]' : 'w-48'} border-4 border-ink bg-paper p-2`}
        role="img"
        aria-label={`QR-Code für ${url}`}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <figcaption className="mt-2 font-type text-sm break-all">{url}</figcaption>
    </figure>
  )
}

export function TeacherNotes() {
  const close = useUi((u) => u.close)
  const openCredits = useUi((u) => u.openCredits)
  const [bigQr, setBigQr] = useState(false)

  if (bigQr) {
    return (
      <Modal label="QR-Code für die Klasse" onClose={() => setBigQr(false)} width="max-w-3xl">
        <div className={`${s.paper} flex flex-col items-center px-5 py-8`}>
          <h2 className="font-serif text-3xl font-bold">Scannt diesen Code mit dem Tablet</h2>
          <p className="mt-1 font-serif text-lg">Kamera öffnen, auf den Code halten, Link antippen.</p>
          <div className="mt-6">
            <ClassQr big />
          </div>
          <StampButton className="mt-6" onClick={() => setBigQr(false)}>
            Zurück zu den Hinweisen
          </StampButton>
        </div>
      </Modal>
    )
  }

  return (
    <Modal label="Hinweise für Lehrkräfte" onClose={close} width="max-w-3xl">
      <div className={`${s.paper} relative px-5 py-7 sm:px-9`}>
        <button
          onClick={close}
          className="absolute top-3 right-3 grid h-10 w-10 place-items-center border-2 border-ink bg-paper hover:bg-ink hover:text-paper"
          aria-label="Hinweise schließen"
        >
          <X size={20} aria-hidden />
        </button>
        <h2 className="font-serif text-3xl font-bold">Hinweise für Lehrkräfte</h2>
        <div className="mt-4 space-y-5 font-serif text-[16px] leading-relaxed">
          <p>
            In <em lang="en">Solidarity is Resistance</em> führen Schülerinnen und Schüler eine kleine Widerstandsgruppe durch Berlin,
            von Januar bis Mai 1933 (Kapitel 1) und von März 1936 bis Dezember 1938 (Kapitel 2). Die Gruppe besteht aus Menschen, die
            selbst nicht rassistisch verfolgt werden. Sie könnten wegsehen und sagen: „Uns geht es doch gut.“ Das Spiel zeigt, dass
            Widerstand gerade darin bestand, es nicht zu tun.
          </p>

          <section className="grid gap-4 border-2 border-ink bg-paper-dark p-4 sm:grid-cols-[auto_1fr] sm:items-center">
            <ClassQr big={false} />
            <div>
              <h3 className={`${s.typewriter} text-sm font-bold tracking-[0.15em] uppercase`}>Mit der Klasse starten</h3>
              <p className="mt-1">
                Das Spiel läuft im Browser, auch im Safari der Schul-iPads. Es muss nichts installiert werden. Zeigt den QR-Code am
                Beamer, die Kinder scannen ihn mit der Kamera.
              </p>
              <StampButton variant="ink" className="mt-3" onClick={() => setBigQr(true)}>
                <QrCode size={16} aria-hidden /> QR-Code groß zeigen
              </StampButton>
            </div>
          </section>

          <Block title="Zwei Stufen">
            Vor jedem Spiel wählen die Kinder eine Stufe. <strong>6. bis 8. Klasse</strong>: alle Texte in einfacher Sprache mit
            kurzen Sätzen, etwas höhere Erfolgsaussichten, Hinweise auf der Karte. Verhaftete kehren nach einigen Wochen zurück, das
            Spiel läuft immer bis zum Ende des Kapitels. <strong>Ab 9. Klasse und Oberstufe</strong>: ausführlichere Texte, anspruchsvollere
            Quellenfragen, realistische Gefahren. Manche Verhaftete werden verurteilt oder überleben die Haft nicht. Wird die Gruppe
            zerschlagen, lesen die Spielenden in einer Chronik, wie es weiterging. Die Ereignisse sind in beiden Stufen dieselben und
            werden nicht entschärft.
          </Block>

          <Block title="Spielziel: Solidarität">
            Niemand besiegt im Spiel den Faschismus, denn das wäre eine historische Falschaussage. Gemessen wird, wie vielen Menschen
            die Gruppe beigestanden hat: Verfolgte verstecken, Familien von Gefangenen versorgen, jüdischen Nachbarn beistehen,
            Menschen warnen. Am Ende jedes Kapitels steht eine Bewertung in drei Stufen, von „Ihr habt nicht weggesehen“ bis „Ein Netz
            der Solidarität“.
          </Block>

          <Block title="Pädagogischer Ansatz">
            Leitgedanke ist Theodor W. Adornos Vortrag „Erziehung nach Auschwitz“ (1966): „Die Forderung, daß Auschwitz nicht noch
            einmal sei, ist die allererste an Erziehung.“ Adorno setzt auf Autonomie, die „Kraft zur Reflexion, zur
            Selbstbestimmung, zum Nicht-Mitmachen“. Das Spiel greift das auf: Jede Woche zeigt eine erfundene Stimme aus der
            Nachbarschaft, wie Mitläufer redeten, und endet mit einer Frage zum Nachdenken. Widerstand erscheint nicht als
            Heldentum, sondern als Entscheidung gewöhnlicher Menschen, nicht mitzumachen. Die Täterperspektive wird nie übernommen,
            NS-Begriffe stehen in Anführungszeichen und werden eingeordnet.
          </Block>

          <Block title="Was ist erfunden, was ist echt?">
            Die Mitglieder der Gruppe sind erfunden, ebenso die Tagebuchnotizen („Was nicht in der Zeitung steht“) und die Stimmen
            von der Straße. Beide sind im Spiel als erfunden gekennzeichnet. Echt und belegt sind die Ereignisse, die Quelle der
            Woche, die Zeitzeugenberichte, die Vorbilder und die Fotos. Die Zeitungen sind nachgestellt: Sie berichten über echte
            Ereignisse im Ton der Presse jener Zeit. Das eignet sich als Einstieg in Quellenkritik.
          </Block>

          <Block title="Darstellung und Fotos">
            Das Intro und die Karten der Vorbilder zeigen echte Fotos, überwiegend aus dem Bundesarchiv. Auf einigen Fotos im Intro
            sind Hakenkreuze zu sehen. Ihre Verwendung dient der historischen Aufklärung im Unterricht. Die Zwischensequenzen sind
            bewusst gezeichnet. Gewalt wird benannt, aber nicht ausgemalt.
            <button onClick={openCredits} className="mt-2 flex items-center gap-1.5 font-type text-sm text-sepia underline decoration-dotted underline-offset-4">
              <Images size={15} aria-hidden /> Bildnachweis ansehen
            </button>
          </Block>

          <Block title="Ablauf einer Woche">
            Wochenschau, dann vier klar getrennte Schritte: Zeitung, Quelle der Woche, Begegnung mit Menschen aus der Stadt und
            Geschichten aus der eigenen Gruppe. Mit „Zurück“ lässt sich alles noch einmal lesen, Entscheidungen bleiben bestehen.
            Danach werden Aufträge auf der Stadtkarte verteilt. Erfolg und Entdeckung werden offen ausgewürfelt, der Wochenbericht
            zeigt jeden Wurf. Ein Kapitel dauert je nach Lesetempo ungefähr 40 bis 60 Minuten.
          </Block>

          <Block title="Spielstand auf dem iPad">
            Der Spielstand liegt nur im Browser des jeweiligen Geräts, es werden keine Daten gesendet. Safari löscht gespeicherte
            Daten einer Seite, wenn sie sieben Tage lang nicht geöffnet wurde. Wird ein Kapitel über mehrere Stunden gespielt, sollte
            zwischen zwei Stunden also höchstens eine Woche liegen. Kapitel 2 lässt sich auf dem Titelbild jederzeit direkt beginnen.
          </Block>

          <Block title="Ton und Datenschutz">
            Die Geräusche werden im Browser erzeugt und lassen sich oben rechts ausschalten. Im Klassenraum empfehlen sich Kopfhörer.
            Schriften und Fotos werden mitgeliefert, es werden keine externen Dienste geladen. Nur die Links „Mehr erfahren“ und
            „ansehen“ führen auf fremde Seiten.
          </Block>

          <Block title="Anregungen für die Nachbesprechung">
            Warum sagten so viele „Uns geht es doch gut“? Welche Gründe hatten Mitläufer wie Rudi oder Frau Pagel? Welche
            Handlungsspielräume hatten Menschen, die nicht verfolgt wurden, und welche haben wir heute? Wo beginnt Solidarität im
            eigenen Alltag? Am Ende des Spiels stehen drei Fragen für ein Gespräch, das Abschlussblatt lässt sich drucken.
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
      <div className="mt-1">{children}</div>
    </section>
  )
}
