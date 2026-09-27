import { useState } from 'react'
import { Crown, IdCard, Lock } from 'lucide-react'
import s from '../styles/period.module.css'
import { Avatar } from './Avatar'
import { StatPips } from './ui/StatPips'
import { STAT_LABELS, STAT_ORDER } from '../game/data/professions'
import { PRISON_HELP } from '../game/data/prison'
import { AUSWEIS_HEAT_RELIEF, actingLeader, isGone, isWanted } from '../game/logic'
import type { Character } from '../game/types'
import { useGame } from '../store/GameStore'
import { useMissions, useR, useT } from '../store/content'
import { GROUP_RULES, quoted } from '../game/data/group'

export function statusOf(c: Character): { label: string; tone: 'ink' | 'blood' | 'sepia' } {
  if (c.status === 'verhaftet') return { label: 'In Haft', tone: 'blood' }
  if (c.status === 'lager') return { label: 'Verurteilt', tone: 'blood' }
  if (c.status === 'tot') return { label: 'Nicht überlebt', tone: 'blood' }
  if (c.status === 'ausgewandert') return { label: 'Ausgewandert', tone: 'sepia' }
  if (c.status === 'verletzt') return { label: 'Verletzt', tone: 'sepia' }
  if (isWanted(c)) return { label: 'Gesucht', tone: 'blood' }
  return { label: 'Bereit', tone: 'ink' }
}

const TONE_CLASS = { ink: 'text-ink', blood: 'text-crimson', sepia: 'text-sepia' }

/** Gitterstäbe über dem Porträt einer verhafteten Person */
function Bars({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className="pointer-events-none absolute inset-0" aria-hidden>
      <rect x="0" y="0" width="64" height="64" fill="rgba(20,20,22,0.35)" />
      {[8, 20, 32, 44, 56].map((x) => (
        <rect key={x} x={x - 2} y="0" width="4" height="64" fill="#1c1c1e" />
      ))}
      <rect x="0" y="6" width="64" height="4" fill="#1c1c1e" />
      <rect x="0" y="54" width="64" height="4" fill="#1c1c1e" />
    </svg>
  )
}

export function GroupPanel() {
  const members = useGame((g) => g.members)
  const missions = useGame((g) => g.missions)
  const ausweise = useGame((g) => g.inventory.ausweise)
  const giveAusweis = useGame((g) => g.giveAusweis)
  const decisions = useGame((g) => g.decisions)
  const groupName = useGame((g) => g.groupName)
  const motto = useGame((g) => g.motto)
  const phase = useGame((g) => g.phase)
  const templates = useMissions()
  const lead = actingLeader(members)

  const assignment = (id: string) => missions.find((m) => m.assigned.includes(id))

  return (
    <section aria-labelledby="gruppe-titel" className="space-y-3">
      <div className="border-2 border-group-light/60 bg-group/40 p-3">
        <p className={`${s.typewriter} text-[10px] tracking-[0.2em] text-group-light uppercase`}>Eure Widerstandsgruppe</p>
        <h2 id="gruppe-titel" className="font-serif text-2xl leading-tight font-bold">
          {quoted(groupName)}
        </h2>
        <p className="mt-0.5 font-serif text-[15px] text-paper/90 italic">„{motto}“</p>
        <details className="mt-2">
          <summary className={`${s.typewriter} cursor-pointer text-xs text-fog underline decoration-dotted underline-offset-4`}>
            Unsere Regeln
          </summary>
          <ol className="mt-2 list-decimal space-y-1 pl-5 font-type text-xs leading-snug text-paper/90">
            {GROUP_RULES.map((r, i) => (
              <li key={r} className={i === 0 ? 'font-bold text-paper' : ''}>
                {r}
              </li>
            ))}
          </ol>
        </details>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {members.map((m) => (
          <MemberCard
            key={m.id}
            m={m}
            leads={lead?.id === m.id && !m.isLeader}
            job={assignment(m.id) ? templates[assignment(m.id)!.type].title : undefined}
            ausweise={ausweise}
            onAusweis={() => giveAusweis(m.id)}
            decisions={decisions.filter((d) => d.companion === m.name)}
            canHelp={phase === 'map'}
          />
        ))}
      </ul>
    </section>
  )
}

function MemberCard({
  m,
  leads,
  job,
  ausweise,
  onAusweis,
  decisions,
  canHelp,
}: {
  m: Character
  leads: boolean
  job?: string
  ausweise: number
  onAusweis: () => void
  decisions: { title: string; choice: string }[]
  canHelp: boolean
}) {
  const st = statusOf(m)
  const gone = isGone(m)
  const inPrison = m.status === 'verhaftet'
  const lost = m.status === 'lager' || m.status === 'tot'
  return (
    <li className={`${s.paper} relative p-3 ${gone ? 'grayscale-[0.6]' : ''} ${inPrison ? 'border-2 border-crimson' : ''}`}>
      <div className="flex gap-3">
        <div className="relative h-16 w-16 shrink-0">
          <Avatar config={m.avatar} size={64} title={`Porträt von ${m.name}`} crossed={m.status === 'tot'} />
          {(inPrison || m.status === 'lager') && <Bars size={64} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-serif text-lg leading-tight font-bold break-words">
                {m.name}
                {m.isLeader && <span className="ml-1.5 font-type text-xs text-sepia">(du)</span>}
              </p>
              <p className={`${s.typewriter} text-sm leading-snug text-slate`}>{m.beruf}</p>
              {m.codename && <p className={`${s.typewriter} text-xs leading-snug text-group`}>Deckname „{m.codename}“</p>}
              {leads && (
                <p className={`${s.typewriter} mt-0.5 flex items-center gap-1 text-xs font-bold text-crimson`}>
                  <Crown size={12} aria-hidden /> Führt die Gruppe, solange du in Haft bist
                </p>
              )}
            </div>
            <span className={`${s.rubber} shrink-0 text-[11px] ${TONE_CLASS[st.tone]}`}>{st.label}</span>
          </div>
          {!gone && (
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
        {inPrison && m.prison ? (
          <>
            <Lock size={13} className="mr-1 inline" aria-hidden />
            In Haft {m.prison.place}. {m.prison.weeks === 1 ? 'Nächste Woche' : `In etwa ${m.prison.weeks} Wochen`} entscheidet sich, was
            mit {m.avatar.gender === 'w' ? 'ihr' : 'ihm'} geschieht.
          </>
        ) : m.status === 'lager' ? (
          `Verurteilt oder ins Lager verschleppt. ${m.avatar.gender === 'w' ? 'Sie' : 'Er'} kommt vorerst nicht zurück.`
        ) : m.status === 'tot' ? (
          `Hat die Haft nicht überlebt. Die Gruppe trägt ${m.avatar.gender === 'w' ? 'ihren' : 'seinen'} Namen im Herzen.`
        ) : m.status === 'ausgewandert' ? (
          'Hat Deutschland verlassen, um in Sicherheit zu leben.'
        ) : m.status === 'verletzt' ? (
          'Muss sich eine Woche erholen.'
        ) : job ? (
          <>
            Eingeteilt: <strong>{job}</strong>
          </>
        ) : (
          'Ohne Auftrag. Wer ruht, gerät aus dem Blick.'
        )}
      </p>

      {inPrison && m.prison && <PrisonHelpBox m={m} canHelp={canHelp} />}

      {!gone && ausweise > 0 && m.heat > 0 && (
        <button onClick={onAusweis} className={`${s.chip} mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 text-sm`}>
          <IdCard size={15} aria-hidden /> Falschen Ausweis geben (−{AUSWEIS_HEAT_RELIEF})
        </button>
      )}

      {!lost && (
        <details className="group mt-2">
          <summary className={`${s.typewriter} cursor-pointer text-sm text-sepia underline decoration-dotted underline-offset-4`}>
            Werte und Lebenslauf
          </summary>
          <p className="mt-2 font-serif text-[15px] leading-snug">{m.bio}</p>
          {decisions.length > 0 && (
            <ul className="mt-2 space-y-1 border-l-2 border-group/60 pl-2">
              {decisions.map((d) => (
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
      )}
    </li>
  )
}

/** Hilfe von außen: Pakete, ein Anwalt, Geld für die Familie */
function PrisonHelpBox({ m, canHelp }: { m: Character; canHelp: boolean }) {
  const kasse = useGame((g) => g.kasse)
  const helpPrisoner = useGame((g) => g.helpPrisoner)
  const t = useT()
  const r = useR()
  const [msg, setMsg] = useState<string | null>(null)
  const done = m.prison?.helpedThisWeek
  return (
    <div className="mt-2 border border-dashed border-crimson/60 bg-paper-dark p-2.5">
      <p className="font-type text-xs font-bold tracking-[0.1em] text-crimson uppercase">Hilfe von außen</p>
      {done ? (
        <p className="mt-1 font-type text-xs">Diese Woche ist schon Hilfe unterwegs.</p>
      ) : (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {PRISON_HELP.map((o) => {
            const disabled = !canHelp || kasse < o.cost || (o.kind === 'anwalt' && m.prison?.lawyer)
            return (
              <button
                key={o.kind}
                disabled={disabled}
                title={t(o.text)}
                onClick={() => {
                  const err = helpPrisoner(m.id, o.kind)
                  setMsg(err ?? r(o.text))
                }}
                className={`${s.chip} px-2 py-1 text-xs`}
              >
                {t(o.label)} ({o.cost} RM)
              </button>
            )
          })}
        </div>
      )}
      {m.prison?.lawyer && <p className="mt-1 font-type text-[11px] text-slate">Ein Anwalt kümmert sich.</p>}
      {(m.prison?.packages ?? 0) > 0 && <p className="font-type text-[11px] text-slate">Pakete geschickt: {m.prison?.packages}</p>}
      {msg && (
        <p className="mt-1 font-serif text-[13px] leading-snug" role="status">
          {msg}
        </p>
      )}
    </div>
  )
}
