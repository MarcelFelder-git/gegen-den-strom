import { useEffect, useRef } from 'react'
import { sound } from '../audio/sound'
import s from '../styles/period.module.css'
import { Avatar } from './Avatar'
import { EffectChips } from './EffectChips'
import { Modal } from './ui/Modal'
import { StampButton } from './ui/StampButton'
import { STAT_LABELS } from '../game/data/professions'
import { fillNames, isGone } from '../game/logic'
import { checkChance, currentEvent, eventNames, selectLeader, useGame } from '../store/GameStore'

export function NarrativeEvent() {
  const weekIndex = useGame((g) => g.weekIndex)
  const eventStage = useGame((g) => g.eventStage)
  const storyIds = useGame((g) => g.storyIds)
  const members = useGame((g) => g.members)
  const kasse = useGame((g) => g.kasse)
  const outcome = useGame((g) => g.eventOutcome)
  const leader = useGame(selectLeader)
  const choose = useGame((g) => g.chooseEventOption)
  const finish = useGame((g) => g.finishEvent)

  const nextRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!outcome) return
    nextRef.current?.focus({ preventScroll: true })
    if (outcome.success !== null) sound.stamp()
  }, [outcome])

  const { event: ev, self } = currentEvent({ weekIndex, eventStage, storyIds, members })
  const names = eventNames(members, self)
  const fill = (t: string) => fillNames(t, names)
  const personal = !!self

  // Spricht ein Gefährte, zeigen wir sein eigenes Porträt
  const companion = self ?? (ev.speaker === '{g1}' ? members.find((m) => !m.isLeader && !isGone(m)) : undefined)
  const portrait = companion?.avatar ?? ev.portrait
  const speakerRole = companion ? companion.beruf : ev.speakerRole

  return (
    <Modal label={`Begegnung: ${ev.title}`} width="max-w-4xl">
      <div className={`${s.paper} ${s.riseIn} grid gap-6 p-5 sm:p-8 md:grid-cols-[220px_1fr]`}>
        <div className="flex flex-row items-center gap-4 md:flex-col md:items-start">
          <div className="w-fit rotate-[-1.5deg] border border-ink/40 bg-paper-dark p-2 shadow-[4px_5px_0_rgba(28,28,30,0.25)]">
            <Avatar config={portrait} size={180} title={`Porträt von ${fill(ev.speaker)}`} className="max-md:h-auto max-md:w-[110px]" />
          </div>
          <div>
            <p className="font-serif text-2xl leading-tight font-bold">{fill(ev.speaker)}</p>
            <p className={`${s.typewriter} text-sm text-slate`}>{speakerRole}</p>
          </div>
        </div>

        <div>
          <p className={`${s.typewriter} text-xs font-bold tracking-[0.25em] text-crimson uppercase`}>
            {personal ? `Aus dem Leben von ${companion?.name}` : 'Begegnung'}
          </p>
          <h2 className="mt-1 font-serif text-3xl leading-tight font-bold">{ev.title}</h2>
          <p className="mt-1 font-serif text-base italic text-sepia">{ev.scene}</p>
          <p className="mt-4 font-serif text-lg leading-relaxed">{fill(ev.text)}</p>

          {!outcome ? (
            <ol className="mt-6 space-y-3" aria-label="Deine Entscheidung">
              {ev.choices.map((c, i) => {
                const chance = checkChance(c, leader)
                const tooPoor = (c.needsKasse ?? 0) > kasse
                return (
                  <li key={i}>
                    <button
                      onClick={() => choose(i)}
                      disabled={tooPoor}
                      className={`${s.chip} w-full px-4 py-3`}
                      data-autofocus={i === 0 ? true : undefined}
                    >
                      <span className="block font-serif text-lg leading-snug">{fill(c.label)}</span>
                      {(c.check || c.needsKasse) && (
                        <span className="mt-1 flex flex-wrap gap-x-4 font-type text-xs text-slate">
                          {c.check && chance !== null && (
                            <span>
                              Probe auf {STAT_LABELS[c.check.stat]}: Aussicht {chance}%
                            </span>
                          )}
                          {c.needsKasse && (
                            <span className={tooPoor ? 'font-bold text-crimson' : ''}>
                              Kostet {c.needsKasse} Reichsmark{tooPoor ? ', die Kasse reicht nicht' : ''}
                            </span>
                          )}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ol>
          ) : (
            <div className="mt-6 border-t-2 border-ink pt-5" role="status">
              {outcome.success !== null && (
                <span className={`${s.rubber} ${s.stampIn} mb-3 text-base ${outcome.success ? 'text-ink' : 'text-crimson'}`}>
                  {outcome.success ? 'Gelungen' : 'Misslungen'}
                </span>
              )}
              <p className={`${s.typewriter} text-[16px] leading-relaxed`}>{fill(outcome.text)}</p>
              <div className="mt-4">
                <EffectChips effects={outcome.effects} />
              </div>
              <StampButton ref={nextRef} variant="ink" onClick={finish} className="mt-6">
                {eventStage < storyIds.length ? 'Weiter' : 'Zur Stadtkarte'}
              </StampButton>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
