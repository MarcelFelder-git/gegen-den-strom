import { Dices, Flag, HandHeart, Lightbulb, Lock } from 'lucide-react'
import s from '../styles/period.module.css'
import { Avatar } from './Avatar'
import { EffectChips } from './EffectChips'
import { Modal } from './ui/Modal'
import { StampButton } from './ui/StampButton'
import { MISSION_ICONS } from './icons'
import { getPlace } from '../game/data/districts'
import { goalById } from '../game/data/goals'
import { chapterOf } from '../game/data/chapters'
import { firstName, joinNames } from '../game/logic'
import type { Character, MissionResult } from '../game/types'
import { useGame } from '../store/GameStore'
import { quoted } from '../game/data/group'
import { useMissions, useT, useWeeks } from '../store/content'
import { difficultyOf } from '../game/difficulty'
import { useEffect } from 'react'
import { sound } from '../audio/sound'
import { LetterCard } from './HelpedWall'

export function WeekReport() {
  const report = useGame((g) => g.report)
  const members = useGame((g) => g.members)
  const moral = useGame((g) => g.moral)
  const nextWeek = useGame((g) => g.nextWeek)
  const groupName = useGame((g) => g.groupName)
  const level = useGame((g) => g.level)
  const weeks = useWeeks()
  const t = useT()
  const hasResults = (report?.results.length ?? 0) > 0
  useEffect(() => {
    if (!hasResults) return
    const t = setTimeout(() => sound.stamp(), 250)
    return () => clearTimeout(t)
  }, [hasResults])
  if (!report) return null

  const byId = (id: string) => members.find((m) => m.id === id)
  const names = (ids: string[]) => joinNames(ids.map((id) => byId(id)).filter((m): m is Character => !!m).map(firstName))
  const gameOver = difficultyOf(level).gameOver
  const allGone = members.every((m) => ['verhaftet', 'lager', 'tot', 'ausgewandert'].includes(m.status))
  const last = report.weekIndex === chapterOf(report.weekIndex).last
  const nextLabel = gameOver && (allGone || moral <= 0) ? 'Weiter' : last ? 'Das Kapitel abschließen' : 'Nächste Woche'
  const week = weeks[report.weekIndex]
  const goal = goalById(report.goalId, report.weekIndex)
  const helpedDelta = report.helpedAfter - report.helpedBefore
  const acting = report.actingLeader ? byId(report.actingLeader) : undefined

  return (
    <Modal label="Wochenbericht" width="max-w-3xl">
      <article className={`${s.paper} ${s.riseIn} px-5 py-7 sm:px-10`}>
        <header className="border-b-2 border-ink pb-4 text-center">
          <p className={`${s.typewriter} text-xs tracking-[0.15em] text-slate uppercase`}>Nur für die Gruppe. Nach dem Lesen verbrennen.</p>
          <h2 className="mt-2 font-serif text-4xl font-bold">Wochenbericht</h2>
          <p className="font-serif text-lg italic">der Widerstandsgruppe {quoted(groupName)}</p>
          <p className={`${s.typewriter} mt-1 text-base`}>{week.dateLabel}</p>
        </header>

        {report.letter && <LetterCard letter={report.letter} when={weeks[report.letter.week]?.dateLabel.replace('Woche vom ', '') ?? ''} />}

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

        {(report.released.length > 0 || report.sentenced.length > 0 || report.died.length > 0 || members.some((m) => m.status === 'verhaftet')) && (
          <section className="mt-4 border-2 border-crimson p-4" aria-labelledby="haft-titel">
            <h3 id="haft-titel" className="flex items-center gap-2 font-serif text-xl font-bold text-crimson">
              <Lock size={18} aria-hidden /> Nachrichten aus der Haft
            </h3>
            <ul className={`${s.typewriter} mt-2 space-y-1.5 text-[15px] leading-relaxed`}>
              {report.released.length > 0 && (
                <li>
                  {names(report.released)} {report.released.length === 1 ? 'ist' : 'sind'} aus der Haft zurück. Niemand spricht darüber,
                  was dort geschah. Die Polizei beobachtet {report.released.length === 1 ? 'diese Person' : 'sie'} jetzt genau.
                </li>
              )}
              {report.sentenced.length > 0 && (
                <li className="font-bold text-crimson">
                  {names(report.sentenced)} {report.sentenced.length === 1 ? 'kommt' : 'kommen'} nicht frei. Ein Gericht hat Jahre im
                  Zuchthaus verhängt, oder die Gestapo hat {report.sentenced.length === 1 ? 'die Person' : 'sie'} in ein Lager gebracht.
                </li>
              )}
              {report.died.length > 0 && (
                <li className="font-bold text-crimson">
                  {names(report.died)} {report.died.length === 1 ? 'hat' : 'haben'} die Haft nicht überlebt. Die Familie bekam nur einen
                  kurzen Brief. Die Gruppe trauert.
                </li>
              )}
              {members
                .filter((m) => m.status === 'verhaftet' && m.prison)
                .map((m) => (
                  <li key={m.id}>
                    {firstName(m)} sitzt {m.prison!.place}. Schickt Hilfe von außen, bei eurer Gruppe auf der Stadtkarte.
                  </li>
                ))}
            </ul>
          </section>
        )}

        {(acting || report.crisis || report.recruited.length > 0) && (
          <section className="mt-4 border-2 border-dashed border-ink p-4" aria-label="Die Gruppe hält zusammen">
            <ul className={`${s.typewriter} space-y-1.5 text-[15px] leading-relaxed`}>
              {acting && (
                <li>
                  Du bist in Haft. Bis du zurück bist, führt {firstName(acting)} die Gruppe. Über heimliche Zettel aus dem Gefängnis
                  entscheidest du weiter mit.
                </li>
              )}
              {report.crisis && (
                <li className="font-bold">
                  Die Gruppe war kurz davor aufzugeben. Dann hat jemand gesagt: „Wenn wir aufhören, hilft ihnen niemand mehr.“ Ihr macht
                  weiter, aber viele Unterstützer haben sich zurückgezogen.
                </li>
              )}
              {report.recruited.length > 0 && (
                <li>
                  Niemand aus der Gruppe war mehr frei. Zwei Unterstützer sind eingesprungen: {names(report.recruited)}. Die Gruppe lebt
                  weiter.
                </li>
              )}
            </ul>
          </section>
        )}

        <section className="mt-4 grid gap-3 sm:grid-cols-2" aria-label="Solidarität und Ziel der Woche">
          <div className="border-2 border-group bg-[#dfe9e8] p-4 text-group">
            <p className="flex items-center gap-2 font-type text-xs font-bold tracking-[0.15em] uppercase">
              <HandHeart size={16} aria-hidden /> Menschen geholfen
            </p>
            <p className="mt-1 font-serif text-3xl font-bold tabular-nums">
              {report.helpedAfter}
              {helpedDelta > 0 && <span className="ml-2 font-type text-base">+{helpedDelta} diese Woche</span>}
            </p>
          </div>
          <div className={`border-2 p-4 ${report.goalMet ? 'border-ink bg-paper-dark' : 'border-dashed border-slate'}`}>
            <p className="flex items-center gap-2 font-type text-xs font-bold tracking-[0.15em] uppercase">
              <Flag size={16} aria-hidden /> Ziel der Woche {report.goalMet ? 'erreicht' : 'nicht erreicht'}
            </p>
            <p className="mt-1 font-serif text-[15px] leading-snug">{t(goal.text)}</p>
            {report.goalMet && (
              <>
                <p className="mt-1 font-type text-sm font-bold">{t(goal.rewardText)}</p>
                <div className="mt-2">
                  <EffectChips effects={goal.reward} />
                </div>
              </>
            )}
          </div>
        </section>

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

        <section className="mt-6 border-2 border-ink bg-paper-dark p-4" aria-labelledby="nachdenken-woche">
          <h3 id="nachdenken-woche" className="flex items-center gap-2 font-type text-xs font-bold tracking-[0.12em] uppercase">
            <Lightbulb size={16} aria-hidden /> Zum Nachdenken
          </h3>
          <p className="mt-2 font-serif text-lg leading-relaxed">{week.reflect}</p>
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
  const t = useMissions()[r.type]
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
          <Avatar key={m.id} config={m.avatar} size={36} title={m.name} crossed={m.status === 'tot'} />
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
          {names(r.arrested)} {r.arrested.length === 1 ? 'wurde' : 'wurden'} verhaftet und in „Schutzhaft“ genommen.
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
