import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import c from './cinema.module.css'
import s from '../../styles/period.module.css'
import { StampButton } from '../ui/StampButton'
import { sound } from '../../audio/sound'

export interface Shot {
  id: string
  scene: ReactNode
  caption: string
  /** Stempel, der nach dem Zwischentitel aufschlägt */
  stamp?: { text: string; tone: 'ink' | 'blood' }
  /** Nach so vielen Millisekunden automatisch weiter (nachdem der Titel steht) */
  auto?: number
  /** Dauergeräusch während der Szene */
  ambience?: 'regen' | 'feuer'
  /** Geräusch zu Beginn der Szene, etwa das Abreißen des Kalenderblatts */
  sfx?: () => void
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
  const nextRef = useRef<HTMLButtonElement>(null)
  const shot = shots[index]
  const full = typed >= shot.caption.length
  const last = index === shots.length - 1

  // Zwischentitel Buchstabe für Buchstabe. Abhängig von der Kennung, nicht vom Array,
  // damit ein neues Rendern der Eltern das Tippen nicht zurücksetzt.
  const shotId = shot.id
  const captionLength = shot.caption.length
  useEffect(() => {
    setTyped(reduced ? captionLength : 0)
  }, [shotId, reduced, captionLength])
  useEffect(() => {
    if (full) return
    const t = setTimeout(() => {
      setTyped((n) => n + 1)
      if (typed % 2 === 0 && shot.caption[typed] !== ' ') sound.typeKey()
    }, 26)
    return () => clearTimeout(t)
  }, [typed, full, shot.caption])

  // Glocke am Zeilenende, Stempel, Geräusche der Szene
  const hasStamp = !!shot.stamp
  useEffect(() => {
    if (!full) return
    sound.bell()
    if (hasStamp) {
      const t = setTimeout(() => sound.stamp(), 120)
      return () => clearTimeout(t)
    }
  }, [full, shotId, hasStamp])
  useEffect(() => {
    shot.sfx?.()
    if (!shot.ambience) return
    const kind = shot.ambience
    sound.startLoop(kind)
    return () => sound.stopLoop(kind)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shotId])
  useEffect(() => {
    sound.startLoop('projektor')
    return () => sound.stopLoop('projektor')
  }, [])

  const next = useCallback(() => {
    if (!full) return setTyped(shot.caption.length)
    if (last) onDone()
    else setIndex((i) => i + 1)
  }, [full, last, onDone, shot.caption.length])

  // Automatisch weiter, wenn die Szene das vorsieht
  useEffect(() => {
    if (!full || !shot.auto || last) return
    const t = setTimeout(next, shot.auto)
    return () => clearTimeout(t)
  }, [full, shot.auto, last, next])

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
        {shot.stamp && full && (
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
        <div className="flex gap-3">
          {!last && (
            <button onClick={onDone} className="font-type text-sm text-fog underline decoration-dotted underline-offset-4 hover:text-paper">
              Überspringen
            </button>
          )}
          <StampButton ref={nextRef} variant="ink" onClick={next} className={full ? c.continuePulse : ''}>
            {last && full ? doneLabel : 'Weiter'}
          </StampButton>
        </div>
      </div>
    </div>
  )
}
