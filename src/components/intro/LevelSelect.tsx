import { ArrowLeft, Check } from 'lucide-react'
import s from '../../styles/period.module.css'
import { StampButton } from '../ui/StampButton'
import { DIFFICULTIES } from '../../game/difficulty'
import type { Level } from '../../game/text'

/** Vor dem Spiel: Welche Klasse spielt? Davon hängen Sprache und Schwierigkeit ab. */
export function LevelSelect({ value, onChange, onNext, onBack }: { value: Level; onChange: (l: Level) => void; onNext: () => void; onBack: () => void }) {
  return (
    <main className={`${s.vignette} flex min-h-dvh flex-col items-center justify-center px-4 py-8`}>
      <div className="w-full max-w-4xl">
        <button onClick={onBack} className={`${s.typewriter} mb-4 inline-flex items-center gap-2 text-sm text-fog hover:text-paper`}>
          <ArrowLeft size={16} aria-hidden /> Zurück zum Titel
        </button>
        <p className={`${s.typewriter} text-center text-sm tracking-[0.3em] text-fog uppercase`}>Bevor es losgeht</p>
        <h1 className="mt-2 text-center font-serif text-4xl font-bold text-paper sm:text-5xl">Wer spielt?</h1>
        <p className="mx-auto mt-3 max-w-2xl text-center font-serif text-lg text-paper/85">
          Die Geschichte ist in beiden Stufen dieselbe. Nichts wird beschönigt. Die Stufen unterscheiden sich in der Sprache,
          den Hilfen und darin, wie hart die Folgen sind.
        </p>

        <div role="radiogroup" aria-label="Schwierigkeitsstufe" className="mt-8 grid gap-4 md:grid-cols-2">
          {(Object.keys(DIFFICULTIES) as Level[]).map((key) => {
            const d = DIFFICULTIES[key]
            const active = value === key
            return (
              <button
                key={key}
                role="radio"
                aria-checked={active}
                onClick={() => onChange(key)}
                className={`${s.paper} relative p-5 text-left text-ink transition-transform sm:p-6 ${
                  active ? 'outline outline-4 outline-ember' : 'opacity-85 hover:opacity-100'
                }`}
              >
                {active && (
                  <span className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-crimson text-paper" aria-hidden>
                    <Check size={18} />
                  </span>
                )}
                <span className={`${s.typewriter} block text-xs font-bold tracking-[0.2em] text-crimson uppercase`}>
                  {key === 'leicht' ? 'Stufe 1' : 'Stufe 2'}
                </span>
                <span className="mt-1 block font-serif text-3xl font-bold">{d.label}</span>
                <span className="mt-2 block font-serif text-lg leading-snug">{d.pitch}</span>
                <ul className="mt-4 space-y-1.5">
                  {d.details.map((line) => (
                    <li key={line} className="flex items-start gap-2 font-type text-sm">
                      <span className="mt-1.5 h-2 w-2 shrink-0 bg-crimson" aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <StampButton variant="ink" onClick={onNext} className="min-w-64 text-base" data-autofocus>
            Weiter zur Vorgeschichte
          </StampButton>
        </div>
      </div>
    </main>
  )
}
