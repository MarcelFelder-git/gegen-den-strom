import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import c from './cinema.module.css'
import s from '../../styles/period.module.css'
import { StampButton } from '../ui/StampButton'
import { sound } from '../../audio/sound'
import { RollPanel, type RollData } from './RollGauge'

export interface Shot {
  id: string
  scene: ReactNode
  caption: string
  /** Stempel, der nach dem Zwischentitel aufschlägt */
  stamp?: { text: string; tone: 'ink' | 'blood' }
  /** Nach so vielen Millisekunden automatisch weiter (nachdem der Titel steht) */
  auto?: number
  /** Geräusch zu Beginn der Szene, etwa ein Klopfen an der Tür */
  sfx?: () => void
  /** Der Wurf eines Auftrags, sichtbar als laufender Zeiger */
  roll?: RollData
}

export function usePrefersReducedMotion(): boolean {
  const [reduced] = useState(() => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      return false
    }
  })
  return reduced
}

/** Spielt eine Folge von Szenen ab, wie eine Wochenschau im Kino */
export function Cinema({ shots, label, onDone, doneLabel = 'Weiter' }: { shots: Shot[]; label: string; onDone: () => void; doneLabel?: string }) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState(0)
  // Wer zurückblättert, will in Ruhe lesen: dann läuft nichts mehr von allein weiter
  const [manual, setManual] = useState(false)
  const nextRef = useRef<HTMLButtonElement>(null)
  // Tippt jemand genau dann auf Weiter, wenn die Szene von selbst weiterläuft, darf der Zähler nie über das Ende hinaus
  const shot = shots[Math.min(index, shots.length - 1)]
  const full = typed >= shot.caption.length
  const last = index >= shots.length - 1
  // Bei Aufträgen läuft erst der Wurf, dann schlägt der Stempel auf
  const [rolledId, setRolledId] = useState<string | null>(null)
  const [skipRoll, setSkipRoll] = useState<string | null>(null)
  const rolled = !shot.roll || reduced || rolledId === shot.id
  const ready = full && rolled

  // Zwischentitel Buchstabe für Buchstabe. Abhängig von der Kennung, nicht vom Array,
  // damit ein neues Rendern der Eltern das Tippen nicht zurücksetzt.
  const shotId = shot.id
  const captionLength = shot.caption.length
  useEffect(() => {
    setTyped(reduced ? captionLength : 0)
  }, [shotId, reduced, captionLength])
  useEffect(() => {
    if (full) return
    const t = setTimeout(() => setTyped((n) => n + 1), 26)
    return () => clearTimeout(t)
  }, [typed, full])

  // Der Stempel schlägt auf, sobald der Titel steht
  const hasStamp = !!shot.stamp
  useEffect(() => {
    if (!ready || !hasStamp) return
    const t = setTimeout(() => sound.stamp(), 120)
    return () => clearTimeout(t)
  }, [ready, shotId, hasStamp])
  // Bei einem Wurf kommt das Geräusch erst mit dem Ergebnis, sonst verrät es den Ausgang
  const hasRoll = !!shot.roll
  useEffect(() => {
    if (ready && hasRoll) shot.sfx?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, hasRoll, shotId])
  useEffect(() => {
    if (!shot.roll) shot.sfx?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shotId])

  const next = useCallback(() => {
    if (!full) return setTyped(shot.caption.length)
    if (!rolled) return setSkipRoll(shotId)
    if (last) onDone()
    else setIndex((i) => Math.min(i + 1, shots.length - 1))
  }, [full, rolled, shotId, last, onDone, shot.caption.length, shots.length])

  // Automatisch weiter, wenn die Szene das vorsieht
  useEffect(() => {
    if (!ready || !shot.auto || last || manual) return
    const t = setTimeout(next, shot.auto)
    return () => clearTimeout(t)
  }, [ready, shot.auto, last, next, manual])

  useEffect(() => {
    nextRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDone()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onDone])

  return (
    <div className={c.root} role="dialog" aria-modal="true" aria-label={label} onClick={next}>
      <div className={c.letterTop} aria-hidden />
      <div className={c.letterBottom} aria-hidden />

      <div className={c.screen} key={shot.id}>
        {shot.scene}
        <span className={c.scratch} aria-hidden />
        {shot.roll && (
          <RollPanel key={shot.id} data={shot.roll} instant={reduced || skipRoll === shot.id} onDone={() => setRolledId(shot.id)} />
        )}
        {shot.stamp && ready && (
          <span
            className={`${s.rubber} ${s.stampIn} absolute right-[6%] bottom-[10%] z-10 bg-black/40 px-4 py-1 text-2xl sm:text-4xl ${
              shot.stamp.tone === 'blood' ? 'text-ember' : 'text-paper'
            }`}
          >
            {shot.stamp.text}
          </span>
        )}
      </div>

      <div className={c.title}>
        <p className={`font-serif text-lg leading-snug sm:text-2xl ${full ? '' : c.caret}`} aria-live="polite">
          {shot.caption.slice(0, typed)}
          <span className="sr-only">{full ? '' : shot.caption.slice(typed)}</span>
        </p>
      </div>

      <div className="relative z-10 mt-4 flex w-[max(var(--cinema-w),min(94vw,640px))] items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-1.5" aria-hidden>
          {shots.map((sh, i) => (
            <span key={sh.id} className={`h-1.5 w-5 ${i <= index ? 'bg-paper' : 'bg-paper/20'}`} />
          ))}
        </div>
        <div className="flex items-center gap-3">
          {index > 0 && (
            <button
              onClick={() => {
                setManual(true)
                setIndex((i) => Math.max(0, i - 1))
              }}
              className="tap-area font-type text-sm text-fog underline decoration-dotted underline-offset-4 hover:text-paper"
            >
              Zurück
            </button>
          )}
          {!last && (
            <button onClick={onDone} className="tap-area font-type text-sm text-fog underline decoration-dotted underline-offset-4 hover:text-paper">
              Überspringen
            </button>
          )}
          <StampButton ref={nextRef} variant="ink" onClick={next} className={ready ? c.continuePulse : ''}>
            {last && ready ? doneLabel : 'Weiter'}
          </StampButton>
        </div>
      </div>
    </div>
  )
}
