import { useEffect, useState, type ReactNode } from 'react'
import { Eye, Images, QrCode, X } from 'lucide-react'
import s from '../styles/period.module.css'
import { Modal } from './ui/Modal'
import { StampButton } from './ui/StampButton'
import { useUi } from '../store/UiStore'
import { hasSavedGame, useGame } from '../store/GameStore'
import type { Level } from '../game/text'

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
  const [previewLevel, setPreviewLevel] = useState<Level>('leicht')
  const startPreview = useGame((g) => g.startPreview)
  const requestGame = useUi((u) => u.requestGame)
  const hasGame = useGame(hasSavedGame)

  const preview = (week: number) => {
    // Ein laufendes Spiel auf diesem Gerät würde ersetzt: lieber einmal nachfragen
    if (hasGame && !window.confirm('Das ersetzt das laufende Spiel auf diesem Gerät. Trotzdem ansehen?')) return
    startPreview(week, previewLevel)
    requestGame()
  }

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
            In <em lang="en">Solidarity</em> führen Schülerinnen und Schüler eine kleine Widerstandsgruppe durch Berlin,
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
            kurzen Sätzen, etwas höhere Erfolgsaussichten, Hinweise auf der Karte. Bei Entscheidungen ist markiert, welche Wahl
            Verfolgten hilft. <strong>Ab 9. Klasse und Oberstufe</strong>: ausführlichere Texte, anspruchsvollere Quellenfragen,
            realistische Gefahren. Hier ist nichts markiert, und Wegsehen bringt echte Vorteile wie weniger Verdacht. So wird spürbar,
            warum so viele wegsahen. Die Ereignisse und ihre Grausamkeit sind in beiden Stufen dieselben. Die leichte Stufe mildert
            aber die Folgen für die eigene Gruppe: Verhaftete kehren dort immer zurück, und das Spiel läuft immer bis zum Ende des
            Kapitels. Sind einmal alle zugleich in Haft, springen zwei Unterstützer ein und führen die Gruppe weiter. In der
            schweren Stufe werden manche Verhaftete verurteilt oder überleben die Haft nicht. Unterstützer springen dort nur einmal
            pro Kapitel ein. Ist danach wieder niemand frei oder verliert die Gruppe allen Mut, ist sie zerschlagen. Dann erzählt
            eine Chronik, wie es weiterging. Die schwere Stufe ist so eingestellt, dass auch mutig spielende Gruppen das Kapitel
            meist schaffen: Der Ernst liegt in den Verlusten, nicht im frühen Spielende.
          </Block>

          <Block title="Sensible Inhalte">
            Gewalt wird benannt, aber nicht ausgemalt. Am stärksten belasten Szenen, in denen Kinder von ihren Eltern getrennt werden
            oder nachts die Polizei kommt. Das kann Kinder mit eigener Flucht- oder Verfolgungserfahrung besonders treffen. Einige
            Vorschläge:
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Vorher ansagen: Es geht um echte Verfolgung. Wer eine Pause braucht, darf sie nehmen, ohne sich zu erklären.</li>
              <li>Betroffene Kinder nie als Expertinnen oder Experten aufrufen und nie auffordern, eigene Erfahrungen zu erzählen.</li>
              <li>Eine Begegnung darf man auch nur lesen und still eine Wahl treffen. Niemand muss die eigene Wahl vorstellen.</li>
              <li>Vor Kapitel 2 (Novemberpogrom, Kindertransporte) die Eltern kurz informieren.</li>
            </ul>
            <div className="mt-4 border-2 border-ink bg-paper-dark p-3">
              <p className="font-serif text-[15px] leading-snug">
                <strong>Vorschau:</strong> Mit „Ansehen“ springt ihr direkt in eine Woche, mit einer fertigen Beispielgruppe. So lässt
                sich etwa das Novemberpogrom zeigen, ohne vorher alle Wochen zu spielen. Ein laufendes Spiel auf diesem Gerät wird
                dabei ersetzt.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Stufe der Vorschau">
                <span className="font-type text-[13px] font-bold">Stufe:</span>
                {(['leicht', 'schwer'] as const).map((l) => (
                  <button
                    key={l}
                    role="radio"
                    aria-checked={previewLevel === l}
                    onClick={() => setPreviewLevel(l)}
                    className={`${s.chip} px-3 py-1.5 font-type text-[13px]`}
                  >
                    {l === 'leicht' ? '6. bis 8. Klasse' : 'ab 9. Klasse'}
                  </button>
                ))}
              </div>
            </div>
            <table className="mt-3 w-full border-collapse font-type text-[13px] leading-snug">
              <caption className="mb-1 text-left font-bold">Übersicht der Wochen</caption>
              <thead>
                <tr className="border-b-2 border-ink text-left">
                  <th className="py-1 pr-2">Woche</th>
                  <th className="py-1 pr-2">Thema</th>
                  <th className="py-1 pr-2">Belastung</th>
                  <th className="py-1">
                    <span className="sr-only">Vorschau</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {WEEK_OVERVIEW.map((w, i) => (
                  <tr key={w.week} className="border-b border-ink/20 align-top">
                    <td className="py-1 pr-2 whitespace-nowrap">{w.week}</td>
                    <td className="py-1 pr-2">{w.theme}</td>
                    <td className={`py-1 pr-2 ${w.load === 'hoch' ? 'font-bold text-crimson' : ''}`}>{w.load}</td>
                    <td className="py-1 text-right">
                      <button
                        onClick={() => preview(i)}
                        className="inline-flex min-h-8 items-center gap-1 border border-ink px-2 font-bold whitespace-nowrap hover:bg-ink hover:text-paper"
                        aria-label={`Woche ${w.week} ansehen`}
                      >
                        <Eye size={14} aria-hidden /> Ansehen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Block>

          <Block title="Namen und Rollen">
            Die Kinder spielen eine erfundene Person aus Berlin, die selbst nicht verfolgt wird. Sie dürfen ihren eigenen Vornamen
            nehmen, sich einen ausdenken oder einen Namen auswürfeln. Kinder mit eigener Rassismus- oder Fluchterfahrung sollten
            ausdrücklich ermutigt werden, einen ausgedachten Namen zu wählen: Sie spielen eine Rolle, nicht sich selbst. Die
            Perspektive der Nicht-Verfolgten ist bewusst gewählt. Sie zeigt, wer hätte helfen können und warum die meisten es nicht
            taten. Sie ist keine Aussage darüber, wer im Klassenraum zu welcher Gruppe gehört.
          </Block>

          <Block title="Spielziel: Solidarität">
            Niemand besiegt im Spiel den Faschismus, denn das wäre eine historische Falschaussage. Gemessen wird, wie vielen Menschen
            die Gruppe beigestanden hat: Verfolgte verstecken, Familien von Gefangenen versorgen, jüdischen Nachbarn beistehen,
            Menschen warnen. Hinter der Zahl stehen Gesichter und Namen: Ein Tipp auf „Geholfen“ zeigt, wem die Gruppe beigestanden hat,
            und ab und zu kommt Post von diesen Menschen. Nicht jeder Brief ist tröstlich. Am Ende jedes Kapitels steht eine Bewertung
            in drei Stufen, von „Ihr habt nicht weggesehen“ bis „Ein Netz der Solidarität“.
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
            Jedes Kapitel hat eigene Vorbilder, acht in Kapitel 1 und fünf in Kapitel 2. Wem die Gruppe im Spiel nicht begegnet,
            stellt der Abschluss des Kapitels vor. Das Intro und die Karten der Vorbilder zeigen echte Fotos, überwiegend aus dem Bundesarchiv. Auf einigen Fotos im Intro
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
            zeigt jeden Wurf. Beim ersten Mal auf der Stadtkarte erklärt eine kurze Einführung das Spielprinzip, danach führt die
            Liste „Erste Schritte“ durch den ersten Auftrag. Über „So geht’s“ lässt sich die Einführung jederzeit wieder öffnen.
            Ein Kapitel dauert je nach Lesetempo etwa 60 bis 120 Minuten. Das Spiel speichert nach jedem Schritt: Die Kinder können
            jederzeit aufhören und in der nächsten Stunde mit „Spiel fortsetzen“ genau dort weitermachen. Der Nationalsozialismus steht
            im Berliner Rahmenlehrplan erst in Klasse 9 und 10. Eine 6. Klasse braucht vorher einen kurzen Einstieg zu Demokratie,
            Parteien und Judenfeindschaft. Die Vorgeschichte im Spiel kann das nicht ganz ersetzen.
          </Block>

          <Block title="Spielstand auf dem iPad">
            Der Spielstand liegt nur im Browser des jeweiligen Geräts, es werden keine Daten gesendet. Safari löscht gespeicherte
            Daten einer Seite, wenn sie sieben Tage lang nicht geöffnet wurde. Wird ein Kapitel über mehrere Stunden gespielt, sollte
            zwischen zwei Stunden also höchstens eine Woche liegen. Kapitel 2 lässt sich auf dem Titelbild jederzeit direkt beginnen.
          </Block>

          <Block title="Ton und Datenschutz">
            Der Ton ist zu Beginn aus und lässt sich oben mit „Ton“ einschalten. Dann läuft leise Musik: vom Titel bis zur eigenen
            Figur und am Ende das Volkslied „Die Gedanken sind frei“ am Klavier, im Spiel eine ruhige Hintergrundmusik. Dazu kommen
            wenige kurze Geräusche an wichtigen Stellen, etwa ein Stempel, ein Klopfen an der Tür oder ein warmer Ton, wenn ein
            Auftrag gelingt. Im Klassenraum empfehlen sich Kopfhörer.
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

/** Themen und Belastung jeder Woche, damit sich die Lehrkraft vorbereiten kann. Die Reihenfolge entspricht WEEKS. */
const WEEK_OVERVIEW: { week: string; theme: string; load: 'gering' | 'mittel' | 'hoch' }[] = [
  { week: 'K1, W1', theme: 'Hitler wird Reichskanzler, die Gruppe gründet sich', load: 'gering' },
  { week: 'K1, W2', theme: 'SA und SS werden Hilfspolizei, die Hauswartsfrau Frau Pagel', load: 'mittel' },
  { week: 'K1, W3', theme: 'Reichstagsbrand, ein Verfolgter klopft nachts an die Tür', load: 'mittel' },
  { week: 'K1, W4', theme: 'Wahl vom 5. März, ein Kollege geht zur SA, Hausdurchsuchung', load: 'mittel' },
  { week: 'K1, W5', theme: 'Ermächtigungsgesetz, die Mutter eines Verhafteten bittet um Hilfe', load: 'mittel' },
  { week: 'K1, W6', theme: 'Boykott jüdischer Geschäfte, offener Judenhass auf der Straße', load: 'hoch' },
  { week: 'K1, W7', theme: 'Jüdische und politisch unliebsame Beamte werden entlassen', load: 'mittel' },
  { week: 'K1, W8', theme: 'Gestapo und Denunziation, eine jüdische Familie will fort', load: 'mittel' },
  { week: 'K1, W9', theme: 'Zerschlagung der Gewerkschaften, Mitgliederlisten', load: 'mittel' },
  { week: 'K1, W10', theme: 'Bücherverbrennung', load: 'gering' },
  { week: 'K2, W1', theme: 'Scheinwahl 1936, der Blockwart', load: 'gering' },
  { week: 'K2, W2', theme: 'Zwangslager Marzahn für Sinti und Roma, ein Junge ohne seine Eltern', load: 'hoch' },
  { week: 'K2, W3', theme: 'Olympische Spiele und was die Welt nicht sehen soll', load: 'gering' },
  { week: 'K2, W4', theme: 'Verhaftung Martin Niemöllers, Fürbitten für Gefangene', load: 'mittel' },
  { week: 'K2, W5', theme: 'Volksabstimmung über den „Anschluss“ Österreichs', load: 'gering' },
  { week: 'K2, W6', theme: 'Zwangsvornamen für Juden, Verhaftungen im Juni 1938', load: 'mittel' },
  { week: 'K2, W7', theme: 'Novemberpogrom, ein Nachbar sucht nachts Schutz', load: 'hoch' },
  { week: 'K2, W8', theme: 'Kindertransporte, Kinder werden von ihren Eltern getrennt', load: 'hoch' },
]

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className={`${s.typewriter} text-sm font-bold tracking-[0.15em] uppercase`}>{title}</h3>
      <div className="mt-1">{children}</div>
    </section>
  )
}
