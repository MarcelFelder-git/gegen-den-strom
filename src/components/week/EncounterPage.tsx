import { useEffect, useRef } from 'react'
import { UserRound, UsersRound } from 'lucide-react'
import { sound } from '../../audio/sound'
import s from '../../styles/period.module.css'
import { Avatar } from '../Avatar'
import { EffectChips } from '../EffectChips'
import { StampButton } from '../ui/StampButton'
import { STAT_LABELS } from '../../game/data/professions'
import { getStory } from '../../game/data/stories'
import { WEEKS } from '../../game/data/weeks'
import { actingLeader, fillNames, isGone } from '../../game/logic'
import { renamed, templateName } from '../../game/names'
import { checkChance, eventNames, useGame } from '../../store/GameStore'
import { useLevel, useR } from '../../store/content'

/**
 * Schritt 3 und folgende: eine Begegnung mit Menschen aus der Stadt oder eine Geschichte
 * aus der eigenen Gruppe. Beide sehen bewusst verschieden aus.
 */
export function EncounterPage({ stage, readOnly }: { stage: number; readOnly: boolean }) {
  const weekIndex = useGame((g) => g.weekIndex)
  const storyIds = useGame((g) => g.storyIds)
  const members = useGame((g) => g.members)
  const kasse = useGame((g) => g.kasse)
  const liveOutcome = useGame((g) => g.eventOutcome)
  const liveStage = useGame((g) => g.eventStage)
  const decisions = useGame((g) => g.decisions)
  const choose = useGame((g) => g.chooseEventOption)
  const finish = useGame((g) => g.finishEvent)
  const level = useLevel()
  const r = useR()

  const story = stage > 0 ? getStory(storyIds[stage - 1]) : undefined
  const self = story ? members.find((m) => templateName(m) === story.companion) : undefined
  const ev = r(story ? renamed(story.event, self) : WEEKS[weekIndex].event)
  const names = eventNames(members, self)
  const fill = (t: string) => fillNames(t, names)
  const personal = !!self
  const lead = actingLeader(members)

  // Spricht ein Gefährte in der Begegnung, zeigen wir sein eigenes Porträt
  const companion = self ?? (ev.speaker === '{g1}' ? members.find((m) => !m.isLeader && !isGone(m)) : undefined)
  const portrait = companion?.avatar ?? ev.portrait
  const speakerRole = companion ? companion.beruf : ev.speakerRole

  const isLive = !readOnly && stage === liveStage
  const outcome = isLive ? liveOutcome : null
  const past = !isLive
    ? decisions.find((d) => d.weekIndex === weekIndex && d.title === ev.title && (d.companion ?? '') === (self?.name ?? ''))
    : undefined

  const nextRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!outcome) return
    nextRef.current?.focus({ preventScroll: true })
    if (outcome.success !== null) sound.stamp()
  }, [outcome])

  const moreStories = storyIds.slice(liveStage).some((id) => {
    const st = getStory(id)
    const who = st && members.find((m) => templateName(m) === st.companion)
    return who && !isGone(who)
  })

  return (
    <div className={`${s.paper} ${s.riseIn} overflow-hidden text-ink`}>
      {personal ? (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-group px-5 py-3 text-paper sm:px-8">
          <p className="flex items-center gap-2 font-type text-xs font-bold tracking-[0.12em] uppercase">
            <UsersRound size={16} aria-hidden /> Aus eurer Gruppe
          </p>
          <p className="font-type text-xs">
            {self?.name}
            {self?.codename && <> · Deckname „{self.codename}“</>}
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-crimson px-5 py-3 text-paper sm:px-8">
          <p className="flex items-center gap-2 font-type text-xs font-bold tracking-[0.12em] uppercase">
            <UserRound size={16} aria-hidden /> Begegnung
          </p>
          <p className="font-type text-xs">Ein Mensch aus der Stadt braucht eure Antwort</p>
        </div>
      )}

      <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[220px_1fr]">
        <div className="flex flex-row items-center gap-4 md:flex-col md:items-start">
          <div className={`w-fit rotate-[-1.5deg] border p-2 shadow-[4px_5px_0_rgba(28,28,30,0.25)] ${personal ? 'border-group bg-[#dfe9e8]' : 'border-ink/40 bg-paper-dark'}`}>
            <Avatar config={portrait} size={180} title={`Porträt von ${fill(ev.speaker)}`} className="max-md:h-auto max-md:w-[110px]" />
          </div>
          <div>
            <p className="font-serif text-2xl leading-tight font-bold">{fill(ev.speaker)}</p>
            <p className={`${s.typewriter} text-sm text-slate`}>{speakerRole}</p>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-3xl leading-tight font-bold">{ev.title}</h2>
          <p className="mt-1 font-serif text-base text-sepia italic">{ev.scene}</p>
          <p className="mt-4 font-serif text-lg leading-relaxed">{fill(ev.text)}</p>

          {isLive && !outcome && (
            <ol className="mt-6 space-y-3" aria-label="Deine Entscheidung">
              {ev.choices.map((c, i) => {
                const raw = (story ? story.event : WEEKS[weekIndex].event).choices[i]
                const chance = checkChance(raw, lead, level)
                const tooPoor = (c.needsKasse ?? 0) > kasse
                return (
                  <li key={i}>
                    <button onClick={() => choose(i)} disabled={tooPoor} className={`${s.chip} w-full px-4 py-3`} data-autofocus={i === 0 ? true : undefined}>
                      <span className="block font-serif text-lg leading-snug">{fill(c.label)}</span>
                      {(c.check || c.needsKasse || c.effects.helped) && (
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
                          {level === 'leicht' && c.effects.helped ? <span className="font-bold text-group">Hilft Menschen in Not</span> : null}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ol>
          )}

          {outcome && (
            <div className="mt-6 border-t-2 border-ink pt-5" role="status">
              {outcome.success !== null && (
                <span className={`${s.rubber} ${s.stampIn} mb-3 text-base ${outcome.success ? 'text-ink' : 'text-crimson'}`}>
                  {outcome.success ? 'Gelungen' : 'Misslungen'}
                </span>
              )}
              <p className={`${s.typewriter} text-[16px] leading-relaxed`}>{fill(outcome.text)}</p>
              <div className="mt-4">
                <EffectChips effects={outcome.effects} selfName={self ? self.name.split(' ')[0] : undefined} />
              </div>
              <StampButton ref={nextRef} variant="ink" onClick={finish} className="mt-6">
                {moreStories ? 'Weiter zu eurer Gruppe' : 'Zur Stadtkarte'}
              </StampButton>
            </div>
          )}

          {!isLive && past && (
            <div className="mt-6 border-t-2 border-dashed border-ink/50 pt-5">
              <p className="font-type text-xs font-bold tracking-[0.15em] text-slate uppercase">Eure Entscheidung</p>
              <p className="mt-1 font-serif text-lg font-bold">{past.choice}</p>
              <p className={`${s.typewriter} mt-2 text-[15px] leading-relaxed`}>{past.result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
