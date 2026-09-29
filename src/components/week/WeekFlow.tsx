import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Archive, Newspaper, UserRound, UsersRound, type LucideIcon } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { StampButton } from '../ui/StampButton'
import { NewspaperPage } from './NewspaperPage'
import { SourcePage } from './SourcePage'
import { EncounterPage } from './EncounterPage'
import { SOURCES } from '../../game/data/sources'
import { getStory } from '../../game/data/stories'
import { isGone } from '../../game/logic'
import { useGame } from '../../store/GameStore'

export type StepKind = 'zeitung' | 'quelle' | 'begegnung' | 'gruppe'

export interface WeekStep {
  kind: StepKind
  label: string
  /** Bei Geschichten aus der Gruppe: welche */
  storyId?: string
  /** 0 = Begegnung, danach die Geschichten, wie im Spielstand */
  eventStage?: number
}

/** Farben und Symbole: Jeder Schritt der Woche sieht anders aus, damit man nie durcheinanderkommt */
export const STEP_STYLE: Record<StepKind, { icon: LucideIcon; name: string; chip: string; active: string }> = {
  zeitung: { icon: Newspaper, name: 'Zeitung', chip: 'border-paper/40 text-paper', active: 'border-paper bg-paper text-ink' },
  quelle: { icon: Archive, name: 'Quelle der Woche', chip: 'border-archive-light/50 text-archive-light', active: 'border-archive-light bg-archive-light text-ink' },
  begegnung: { icon: UserRound, name: 'Begegnung', chip: 'border-ember/60 text-ember', active: 'border-ember bg-ember text-ink' },
  gruppe: { icon: UsersRound, name: 'Aus eurer Gruppe', chip: 'border-group-light/50 text-group-light', active: 'border-group-light bg-group-light text-ink' },
}

/**
 * Der Anfang jeder Woche in klar getrennten Schritten:
 * Zeitung, Quelle der Woche, Begegnung und Geschichten aus der eigenen Gruppe.
 * Mit „Zurück“ lässt sich alles noch einmal lesen, Entscheidungen bleiben aber bestehen.
 */
export function WeekFlow() {
  const phase = useGame((g) => g.phase)
  const weekIndex = useGame((g) => g.weekIndex)
  const storyIds = useGame((g) => g.storyIds)
  const eventStage = useGame((g) => g.eventStage)
  const members = useGame((g) => g.members)
  const closeNewspaper = useGame((g) => g.closeNewspaper)
  const outcome = useGame((g) => g.eventOutcome)

  const hasSource = !!SOURCES[weekIndex]
  const [paperStep, setPaperStep] = useState(0)
  const [view, setView] = useState<number | null>(null)

  const steps = useMemo<WeekStep[]>(() => {
    const list: WeekStep[] = [{ kind: 'zeitung', label: 'Zeitung' }]
    if (hasSource) list.push({ kind: 'quelle', label: 'Quelle' })
    list.push({ kind: 'begegnung', label: 'Begegnung', eventStage: 0 })
    storyIds.forEach((id, i) => {
      const st = getStory(id)
      const who = st && members.find((m) => m.name === st.companion)
      // Wer vor der eigenen Geschichte die Gruppe verlassen hat, taucht nicht mehr auf
      if (!st || !who || (isGone(who) && eventStage < i + 1)) return
      list.push({ kind: 'gruppe', label: who.name.split(' ')[0], storyId: id, eventStage: i + 1 })
    })
    return list
  }, [hasSource, storyIds, members, eventStage])

  const live = phase === 'newspaper' ? Math.min(paperStep, hasSource ? 1 : 0) : Math.max(0, steps.findIndex((st) => st.eventStage === eventStage))
  const shown = view ?? live
  const step = steps[shown] ?? steps[0]
  const reading = view !== null && view < live

  const goBack = () => {
    if (shown > 0) setView(shown - 1)
  }
  const goForwardReading = () => setView(shown + 1 >= live ? null : shown + 1)

  // Weiter im laufenden Ablauf
  const advanceLive = () => {
    if (step.kind === 'zeitung' && hasSource) return setPaperStep(1)
    closeNewspaper()
  }

  const label = `${STEP_STYLE[step.kind].name}, Schritt ${shown + 1} von ${steps.length}`

  return (
    <Modal label={label} width="max-w-5xl" top>
      <StepHeader steps={steps} shown={shown} live={live} onJump={(i) => setView(i >= live ? null : i)} />
      <div key={`${shown}-${step.storyId ?? ''}`}>
        {step.kind === 'zeitung' && <NewspaperPage />}
        {step.kind === 'quelle' && <SourcePage />}
        {(step.kind === 'begegnung' || step.kind === 'gruppe') && <EncounterPage stage={step.eventStage ?? 0} readOnly={reading} />}
      </div>

      <nav className="mt-3 flex items-center justify-between gap-3" aria-label="Blättern">
        <StampButton variant="quiet" className="text-paper" onClick={goBack} disabled={shown === 0}>
          <ArrowLeft size={16} aria-hidden /> Zurück
        </StampButton>
        {reading ? (
          <StampButton variant="paper" onClick={goForwardReading}>
            Weiter lesen <ArrowRight size={16} aria-hidden />
          </StampButton>
        ) : step.kind === 'zeitung' || step.kind === 'quelle' ? (
          <LiveNext kind={step.kind} hasSource={hasSource} onNext={advanceLive} />
        ) : outcome ? (
          <span />
        ) : (
          <span className="font-type text-xs text-fog">Triff oben eine Entscheidung.</span>
        )}
      </nav>
    </Modal>
  )
}

function LiveNext({ kind, hasSource, onNext }: { kind: StepKind; hasSource: boolean; onNext: () => void }) {
  const answered = useGame((g) => String(g.weekIndex) in g.sourceAnswers)
  if (kind === 'quelle' && !answered) return <span className="font-type text-xs text-fog">Beantworte zuerst die Frage zur Quelle.</span>
  return (
    <StampButton variant="ink" onClick={onNext} data-autofocus>
      {kind === 'zeitung' && hasSource ? 'Zur Quelle der Woche' : 'Zur Begegnung'} <ArrowRight size={16} aria-hidden />
    </StampButton>
  )
}

/** Oben die Schritte der Woche: wo man ist, was schon gelesen wurde */
function StepHeader({ steps, shown, live, onJump }: { steps: WeekStep[]; shown: number; live: number; onJump: (i: number) => void }) {
  return (
    <ol className="sticky top-0 z-20 -mx-4 mb-3 flex flex-wrap gap-2 bg-coal px-4 pt-4 pb-3 shadow-[0_8px_16px_-8px_rgba(0,0,0,0.8)]" aria-label="Schritte dieser Woche">
      {steps.map((st, i) => {
        const style = STEP_STYLE[st.kind]
        const Icon = style.icon
        const reachable = i <= live
        const current = i === shown
        return (
          <li key={`${st.kind}-${st.storyId ?? i}`}>
            <button
              onClick={() => reachable && onJump(i)}
              disabled={!reachable}
              aria-current={current ? 'step' : undefined}
              className={`flex min-h-11 items-center gap-1.5 border-2 px-3 py-2 font-type text-[13px] font-bold tracking-[0.04em] uppercase transition-colors disabled:cursor-default disabled:border-dashed disabled:border-fog/50 disabled:text-fog ${
                current ? style.active : style.chip
              }`}
            >
              <Icon size={15} aria-hidden />
              {st.kind === 'gruppe' ? `Gruppe: ${st.label}` : style.name}
            </button>
          </li>
        )
      })}
    </ol>
  )
}
