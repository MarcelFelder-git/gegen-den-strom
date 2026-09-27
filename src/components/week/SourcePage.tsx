import { useMemo, useState } from 'react'
import { Archive } from 'lucide-react'
import s from '../../styles/period.module.css'
import { SOURCES } from '../../game/data/sources'
import { useGame } from '../../store/GameStore'
import { useR } from '../../store/content'
import { sound } from '../../audio/sound'

/** Schritt 2: die Quelle der Woche, ein echtes Dokument aus dem Archiv, mit einer Frage dazu */
export function SourcePage() {
  const weekIndex = useGame((g) => g.weekIndex)
  const answers = useGame((g) => g.sourceAnswers)
  const answerSource = useGame((g) => g.answerSource)
  const r = useR()
  const raw = SOURCES[weekIndex]
  const src = raw ? r(raw) : undefined
  const previous = answers[String(weekIndex)]
  const [picked, setPicked] = useState<number | null>(null)

  // Die richtige Antwort steht nicht immer an derselben Stelle
  const order = useMemo(() => {
    const shift = weekIndex % 3
    return [0, 1, 2].map((i) => (i + shift) % 3)
  }, [weekIndex])

  if (!src) return null
  const answered = picked !== null || previous !== undefined
  const correct = picked !== null ? picked === src.answer : previous

  const choose = (i: number) => {
    if (answered) return
    setPicked(i)
    answerSource(i)
    sound.stamp()
  }

  return (
    <div className={`${s.paperDark} ${s.riseIn} relative border-t-[10px] border-archive px-5 py-6 text-ink sm:px-8`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-archive pb-3">
        <p className="flex items-center gap-2 font-type text-xs font-bold tracking-[0.2em] text-archive uppercase">
          <Archive size={16} aria-hidden /> Quelle der Woche, echtes Dokument aus dem Archiv
        </p>
        <span className={`${s.rubber} text-xs text-archive`}>{src.kind}</span>
      </div>

      <h3 className="mt-4 font-serif text-2xl font-bold">{src.title}</h3>
      <p className="mt-1 font-serif text-[15px] text-sepia italic">{src.origin}</p>

      <blockquote className="mt-4 border-l-4 border-archive bg-paper px-4 py-3 font-serif text-lg leading-relaxed whitespace-pre-line shadow-[3px_3px_0_rgba(28,28,30,0.15)]">
        {src.text}
      </blockquote>

      <p className="mt-5 font-type text-sm font-bold">{src.question}</p>
      <ul className="mt-2 space-y-2">
        {order.map((i) => {
          const isPicked = picked === i
          const isRight = answered && i === src.answer
          return (
            <li key={i}>
              <button
                onClick={() => choose(i)}
                disabled={answered}
                aria-pressed={isPicked}
                className={`${s.chip} w-full px-4 py-3 font-serif text-[16px] ${isRight ? '!border-2 !border-ink !opacity-100' : answered ? 'opacity-60' : ''}`}
              >
                {src.options[i]}
                {isRight && <span className="ml-2 font-type text-xs font-bold text-ink">✓</span>}
              </button>
            </li>
          )
        })}
      </ul>

      {answered && (
        <div className="mt-5 border-t-2 border-archive pt-4" role="status">
          <span className={`${s.rubber} ${s.stampIn} text-base ${correct ? 'text-ink' : 'text-crimson'}`}>{correct ? 'Richtig' : 'Nicht ganz'}</span>
          {correct && <span className="ml-3 font-type text-sm font-bold">Moral +2: Wissen gibt Mut.</span>}
          <p className="mt-3 font-serif text-[16px] leading-relaxed">{src.explain}</p>
        </div>
      )}
    </div>
  )
}
