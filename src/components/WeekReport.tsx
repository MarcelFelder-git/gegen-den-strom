import { Dices } from 'lucide-react'
import s from '../styles/period.module.css'
import { Avatar } from './Avatar'
import { EffectChips } from './EffectChips'
import { Modal } from './ui/Modal'
import { StampButton } from './ui/StampButton'
import { MISSION_ICONS } from './icons'
import { getPlace } from '../game/data/districts'
import { MISSIONS } from '../game/data/missions'
import { WEEKS } from '../game/data/weeks'
import { chapterOf } from '../game/data/chapters'
import { firstName, joinNames } from '../game/logic'
import type { Character, MissionResult } from '../game/types'
import { useGame } from '../store/GameStore'
import { quoted } from '../game/data/group'
import { useEffect } from 'react'
import { sound } from '../audio/sound'

export function WeekReport() {
  const report = useGame((g) => g.report)
  const members = useGame((g) => g.members)
  const moral = useGame((g) => g.moral)
  const nextWeek = useGame((g) => g.nextWeek)
  const groupName = useGame((g) => g.groupName)
  const hasResults = (report?.results.length ?? 0) > 0
  useEffect(() => {
    if (!hasResults) return
    const t = setTimeout(() => sound.stamp(), 250)
    return () => clearTimeout(t)
  }, [hasResults])
  if (!report) return null

  const byId = (id: string) => members.find((m) => m.id === id)
  const names = (ids: string[]) => joinNames(ids.map((id) => byId(id)).filter((m): m is Character => !!m).map(firstName))
  const leaderGone = members.find((m) => m.isLeader)?.status === 'verhaftet'
  const last = report.weekIndex === chapterOf(report.weekIndex).last
  const nextLabel = leaderGone || moral <= 0 ? 'Weiter' : last ? 'Das Kapitel abschließen' : 'Nächste Woche'

  return (
    <Modal label="Wochenbericht" width="max-w-3xl">
      <article className={`${s.paper} ${s.riseIn} px-5 py-7 sm:px-10`}>
        <header className="border-b-2 border-ink pb-4 text-center">
          <p className={`${s.typewriter} text-xs tracking-[0.3em] text-slate uppercase`}>Nur für die Gruppe. Nach dem Lesen verbrennen.</p>
          <h2 className="mt-2 font-serif text-4xl font-bold">Wochenbericht</h2>
          <p className="font-serif text-lg italic">der Widerstandsgruppe {quoted(groupName)}</p>
          <p className={`${s.typewriter} mt-1 text-base`}>{WEEKS[report.weekIndex].dateLabel}</p>
        </header>

        <div className="divide-y divide-dashed divide-ink/40">
          {report.results.length === 0 && (
            <p className={`${s.typewriter} py-6 text-[15px] leading-relaxed`}>
              Die Gruppe hat in dieser Woche stillgehalten. Niemand ist aufgefallen, aber es ist auch nichts geschehen,
              das den Menschen Mut gemacht hätte.
            </p>
          )}
          {report.results.map((r) => (
            <ResultEntry key={r.uid} r={r} team={r.team.map(byId).filter((m): m is Character => !!m)} names={names} />
          ))}
        </div>

        <section className="mt-4 border-t-2 border-ink pt-5" aria-labelledby="lage-titel">
          <h3 id="lage-titel" className="font-serif text-2xl font-bold">
            Lage der Gruppe
          </h3>
          <ul className={`${s.typewriter} mt-3 space-y-1.5 text-[15px] leading-relaxed`}>
            {report.income > 0 && <li>Die Unterstützer haben {report.income} Reichsmark gespendet.</li>}
            <li>Die bedrückende Zeit zehrt an allen: Moral −{report.moralDecay}.</li>
            {report.idleCooled.length > 0 && (
              <li>
                {names(report.idleCooled)} {report.idleCooled.length === 1 ? 'hat' : 'haben'} sich zurückgehalten. Der
                Verdacht gegen {report.idleCooled.length === 1 ? 'diese Person' : 'sie'} ist gesunken.
              </li>
            )}
            {report.healed.length > 0 && (
              <li>
                {names(report.healed)} {report.healed.length === 1 ? 'ist' : 'sind'} wieder bei Kräften.
              </li>
            )}
            {report.heatArrests.length > 0 && (
              <li className="font-bold text-crimson">
                {names(report.heatArrests)} {report.heatArrests.length === 1 ? 'wurde' : 'wurden'} in den frühen
                Morgenstunden abgeholt. Der Fahndungsdruck war zu groß geworden.
              </li>
            )}
          </ul>

          <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
            <Delta label="Moral" before={report.moralBefore} after={report.moralAfter} suffix="%" />
            <Delta label="Unterstützer" before={report.supportersBefore} after={report.supportersAfter} />
            <Delta label="Kasse" before={report.kasseBefore} after={report.kasseAfter} suffix=" RM" />
          </dl>
        </section>

        <div className="mt-7 flex justify-end">
          <StampButton variant="ink" onClick={nextWeek} data-autofocus>
            {nextLabel}
          </StampButton>
        </div>
      </article>
    </Modal>
  )
}

function ResultEntry({ r, team, names }: { r: MissionResult; team: Character[]; names: (ids: string[]) => string }) {
  const t = MISSIONS[r.type]
  const Icon = MISSION_ICONS[r.type]
  const stamp = r.detected
    ? { text: r.outcome === 'gelungen' ? 'Gelungen, gesehen' : 'Entdeckt', cls: 'text-crimson' }
    : r.outcome === 'gelungen'
      ? { text: 'Gelungen', cls: 'text-ink' }
      : { text: 'Gescheitert', cls: 'text-sepia' }

  return (
    <section className="py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-ink">
            <Icon size={20} aria-hidden />
          </span>
          <div>
            <h3 className="font-serif text-xl leading-tight font-bold">{t.title}</h3>
            <p className={`${s.typewriter} text-sm text-slate`}>{getPlace(r.placeId).name}</p>
          </div>
        </div>
        <span className={`${s.rubber} ${s.stampIn} text-sm ${stamp.cls}`}>{stamp.text}</span>
      </div>

      <div className="mt-3 flex gap-1.5">
        {team.map((m) => (
          <Avatar key={m.id} config={m.avatar} size={36} title={m.name} crossed={r.arrested.includes(m.id)} />
        ))}
      </div>

      <p className={`${s.typewriter} mt-3 text-[15px] leading-relaxed`}>{r.text}</p>

      {r.injured.length > 0 && (
        <p className={`${s.typewriter} mt-2 text-[15px] font-bold text-sepia`}>
          {names(r.injured)} {r.injured.length === 1 ? 'hat' : 'haben'} sich auf der Flucht verletzt und {r.injured.length === 1 ? 'fällt' : 'fallen'} eine Woche aus.
        </p>
      )}
      {r.arrested.length > 0 && (
        <p className={`${s.typewriter} mt-2 text-[15px] font-bold text-crimson`}>
          {names(r.arrested)} {r.arrested.length === 1 ? 'wurde' : 'wurden'} verhaftet und in Schutzhaft genommen.
        </p>
      )}

      <div className="mt-3">
        <EffectChips effects={r.effects} />
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-type text-xs text-slate">
        <Dices size={14} aria-hidden />
        <span>
          Erfolgswurf {r.roll}, nötig höchstens {r.chance}
        </span>
        <span>
          Entdeckungswurf {r.detectRoll}, Gefahr bei {r.risk} oder weniger
        </span>
      </p>
    </section>
  )
}

function Delta({ label, before, after, suffix = '' }: { label: string; before: number; after: number; suffix?: string }) {
  const diff = after - before
  return (
    <div className="border-2 border-ink p-2">
      <dt className="font-type text-xs font-bold tracking-[0.15em] uppercase">{label}</dt>
      <dd className="mt-1 font-type text-xl font-bold tabular-nums">
        {after}
        {suffix}
      </dd>
      <dd className={`font-type text-sm tabular-nums ${diff < 0 ? 'text-crimson' : diff > 0 ? 'text-ink' : 'text-slate'}`}>
        {diff === 0 ? 'unverändert' : `${diff > 0 ? '+' : '−'}${Math.abs(diff)}`}
      </dd>
    </div>
  )
}
