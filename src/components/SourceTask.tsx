import { useMemo, useState } from 'react'
import { Archive } from 'lucide-react'
import s from '../styles/period.module.css'
import { StampButton } from './ui/StampButton'
import { SOURCES } from '../game/data/sources'
import { useGame } from '../store/GameStore'
import { sound } from '../audio/sound'

/** Die Quelle der Woche: ein echtes Dokument und eine Frage dazu */
export function SourceTask({ onDone }: { onDone: () => void }) {
  const weekIndex = useGame((g) => g.weekIndex)
  const answers = useGame((g) => g.sourceAnswers)
  const answerSource = useGame((g) => g.answerSource)
  const src = SOURCES[weekIndex]
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
    <div className={`${s.paperDark} ${s.riseIn} px-5 py-6 sm:px-8`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-3">
        <p className="flex items-center gap-2 font-type text-xs font-bold tracking-[0.2em] uppercase">
          <Archive size={16} aria-hidden /> Quelle der Woche
        </p>
        <span className={`${s.rubber} text-xs text-sepia`}>{src.kind}</span>
      </div>

      <h3 className="mt-4 font-serif text-2xl font-bold">{src.title}</h3>
      <p className="mt-1 font-serif text-[15px] italic text-sepia">{src.origin}</p>

      <blockquote className="mt-4 border-l-4 border-crimson bg-paper px-4 py-3 font-serif text-lg leading-relaxed whitespace-pre-line shadow-[3px_3px_0_rgba(28,28,30,0.15)]">
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
                className={`${s.chip} w-full px-4 py-2.5 font-serif text-[16px] ${
                  isRight ? '!border-2 !border-ink !opacity-100' : answered ? 'opacity-60' : ''
                }`}
              >
                {src.options[i]}
                {isRight && <span className="ml-2 font-type text-xs font-bold text-ink">✓</span>}
              </button>
            </li>
          )
        })}
      </ul>

      {answered && (
        <div className="mt-5 border-t-2 border-ink pt-4" role="status">
          <span className={`${s.rubber} ${s.stampIn} text-base ${correct ? 'text-ink' : 'text-crimson'}`}>
            {correct ? 'Richtig' : 'Nicht ganz'}
          </span>
          {correct && <span className="ml-3 font-type text-sm font-bold">Moral +2: Wissen gibt Mut.</span>}
          <p className="mt-3 font-serif text-[16px] leading-relaxed">{src.explain}</p>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <StampButton variant="ink" onClick={onDone} disabled={!answered}>
          Weiter
        </StampButton>
      </div>
    </div>
  )
}
