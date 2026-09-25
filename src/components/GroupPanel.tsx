import { IdCard } from 'lucide-react'
import s from '../styles/period.module.css'
import { Avatar } from './Avatar'
import { StatPips } from './ui/StatPips'
import { MISSIONS } from '../game/data/missions'
import { STAT_LABELS, STAT_ORDER } from '../game/data/professions'
import { AUSWEIS_HEAT_RELIEF, isGone, isWanted } from '../game/logic'
import type { Character } from '../game/types'
import { useGame } from '../store/GameStore'
import { GROUP_RULES, quoted } from '../game/data/group'

export function statusOf(c: Character): { label: string; tone: 'ink' | 'blood' | 'sepia' } {
  if (c.status === 'verhaftet') return { label: 'Verhaftet', tone: 'blood' }
  if (c.status === 'ausgewandert') return { label: 'Ausgewandert', tone: 'sepia' }
  if (c.status === 'verletzt') return { label: 'Verletzt', tone: 'sepia' }
  if (isWanted(c)) return { label: 'Gesucht', tone: 'blood' }
  return { label: 'Bereit', tone: 'ink' }
}

const TONE_CLASS = { ink: 'text-ink', blood: 'text-crimson', sepia: 'text-sepia' }

export function GroupPanel() {
  const members = useGame((g) => g.members)
  const missions = useGame((g) => g.missions)
  const ausweise = useGame((g) => g.inventory.ausweise)
  const giveAusweis = useGame((g) => g.giveAusweis)
  const decisions = useGame((g) => g.decisions)
  const groupName = useGame((g) => g.groupName)
  const motto = useGame((g) => g.motto)

  const assignment = (id: string) => missions.find((m) => m.assigned.includes(id))

  return (
    <section aria-labelledby="gruppe-titel" className="space-y-3">
      <div className={`${s.panel} p-3`}>
        <p className={`${s.typewriter} text-[10px] tracking-[0.2em] text-fog uppercase`}>Eure Widerstandsgruppe</p>
        <h2 id="gruppe-titel" className="font-serif text-2xl leading-tight font-bold">
          {quoted(groupName)}
        </h2>
        <p className="mt-0.5 font-serif text-[15px] text-paper/90 italic">„{motto}“</p>
        <details className="mt-2">
          <summary className={`${s.typewriter} cursor-pointer text-xs text-fog underline decoration-dotted underline-offset-4`}>
            Unsere Regeln
          </summary>
          <ol className="mt-2 list-decimal space-y-1 pl-5 font-type text-xs leading-snug text-paper/90">
            {GROUP_RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </details>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {members.map((m) => {
          const st = statusOf(m)
          const job = assignment(m.id)
          const arrested = isGone(m)
          return (
            <li key={m.id} className={`${s.paper} relative p-3 ${arrested ? 'opacity-80' : ''}`}>
              <div className="flex gap-3">
                <Avatar config={m.avatar} size={64} title={`Porträt von ${m.name}`} crossed={arrested} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-serif text-lg leading-tight font-bold break-words">
                        {m.name}
                        {m.isLeader && <span className="ml-1.5 font-type text-xs text-sepia">(du)</span>}
                      </p>
                      <p className={`${s.typewriter} text-sm leading-snug text-slate`}>{m.beruf}</p>
                      {m.codename && (
                        <p className={`${s.typewriter} text-xs leading-snug text-crimson`}>Deckname „{m.codename}“</p>
                      )}
                    </div>
                    <span className={`${s.rubber} shrink-0 text-[11px] ${TONE_CLASS[st.tone]}`}>{st.label}</span>
                  </div>
                  {!arrested && (
                    <div className="mt-2">
                      <div className="flex items-baseline justify-between font-type text-xs">
                        <span className="text-slate">Fahndungsdruck</span>
                        <span className={`font-bold tabular-nums ${isWanted(m) ? 'text-crimson' : ''}`}>{m.heat}</span>
                      </div>
                      <div
                        className="mt-0.5 h-2 border border-ink/70"
                        role="meter"
                        aria-label={`Fahndungsdruck von ${m.name}`}
                        aria-valuenow={m.heat}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div className="h-full bg-crimson" style={{ width: `${m.heat}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <p className={`${s.typewriter} mt-2 text-sm`}>
                {arrested
                  ? m.status === 'ausgewandert'
                    ? 'Hat Deutschland verlassen, um in Sicherheit zu leben.'
                    : `In Schutzhaft. Niemand weiß, wohin man ${m.avatar.gender === 'w' ? 'sie' : 'ihn'} gebracht hat.`
                  : m.status === 'verletzt'
                    ? 'Muss sich eine Woche erholen.'
                    : job
                      ? <>Eingeteilt: <strong>{MISSIONS[job.type].title}</strong></>
                      : 'Ohne Auftrag. Wer ruht, gerät aus dem Blick.'}
              </p>

              {!arrested && ausweise > 0 && m.heat > 0 && (
                <button
                  onClick={() => giveAusweis(m.id)}
                  className={`${s.chip} mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 text-sm`}
                >
                  <IdCard size={15} aria-hidden /> Gefälschten Ausweis geben (−{AUSWEIS_HEAT_RELIEF})
                </button>
              )}

              <details className="mt-2 group">
                <summary className={`${s.typewriter} cursor-pointer text-sm text-sepia underline decoration-dotted underline-offset-4`}>
                  Werte und Lebenslauf
                </summary>
                <p className="mt-2 font-serif text-[15px] leading-snug">{m.bio}</p>
                {decisions.filter((d) => d.companion === m.name).length > 0 && (
                  <ul className="mt-2 space-y-1 border-l-2 border-crimson/60 pl-2">
                    {decisions
                      .filter((d) => d.companion === m.name)
                      .map((d) => (
                        <li key={d.title} className="font-type text-xs leading-snug">
                          <strong>{d.title}:</strong> {d.choice.replace(/[„“]/g, '')}
                        </li>
                      ))}
                  </ul>
                )}
                <dl className="mt-2 space-y-1">
                  {STAT_ORDER.map((k) => (
                    <div key={k} className="flex items-center justify-between">
                      <dt className="font-type text-xs">{STAT_LABELS[k]}</dt>
                      <dd>
                        <StatPips value={m.stats[k]} label={STAT_LABELS[k]} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </details>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
