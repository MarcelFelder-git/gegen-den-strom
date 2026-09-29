import { useState } from 'react'
import { Check, ChevronDown, CircleAlert, CircleHelp, Flag, HandHeart, Lightbulb } from 'lucide-react'
import s from '../styles/period.module.css'
import { Avatar } from './Avatar'
import { CityMap } from './CityMap'
import { MissionDossier } from './MissionDossier'
import { StampButton } from './ui/StampButton'
import { Tutorial } from './Tutorial'
import { MISSION_ICONS } from './icons'
import { DISTRICTS, getDistrict, getPlace, situationAt, surveillanceAt, surveillanceLevel } from '../game/data/districts'
import { MISSIONS } from '../game/data/missions'
import { goalById } from '../game/data/goals'
import { quoted } from '../game/data/group'
import {
  TRUST_MAX,
  TRUST_RISK_RELIEF,
  canAfford,
  dangerEstimate,
  dangerTier,
  detectionRisk,
  firstName,
  joinNames,
  successChance,
  type Trust,
} from '../game/logic'
import type { Character, DistrictKey, Mission } from '../game/types'
import { useGame } from '../store/GameStore'
import { useDifficulty, useMissions, useT } from '../store/content'
import type { MissionTemplate } from '../game/data/missions'
import type { Resolved } from '../game/text'

export function MapBoard() {
  const { missions, members, weekIndex, kasse, inventory, endWeek, trust, flags, groupName, history, tutorialSeen, markTutorial, phase } = useGame()
  const [openUid, setOpenUid] = useState<string | null>(null)
  // Beim ersten Mal auf der Karte erklärt eine kurze Einführung das Spielprinzip
  const [help, setHelp] = useState(false)
  // Erst wenn die Karte wirklich dran ist, nicht schon unter Wochenschau oder Zeitung
  const showHelp = help || (phase === 'map' && !tutorialSeen && history.length === 0)
  const closeHelp = () => {
    setHelp(false)
    markTutorial()
  }
  const [opened, setOpened] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [district, setDistrict] = useState<DistrictKey | null>(null)
  const [confirmIdle, setConfirmIdle] = useState(false)
  const [showDistricts, setShowDistricts] = useState(false)
  const t = useT()

  const open = missions.find((m) => m.uid === openUid)
  const canPlan = (m: Mission) => canAfford(MISSIONS[m.type], kasse, inventory)
  const visible = missions.filter((m) => !district || m.district === district)
  const selected = district ? getDistrict(district) : null

  const openMission = (uid: string) => {
    setOpened(true)
    setOpenUid(uid)
  }

  const finish = () => {
    if (missions.every((m) => m.assigned.length === 0) && !confirmIdle) return setConfirmIdle(true)
    setConfirmIdle(false)
    endWeek()
  }

  return (
    <section aria-labelledby="karte-titel" className="min-w-0 space-y-4">
      <WeekSteps />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="karte-titel" className="font-serif text-2xl font-bold">
            Stadtkarte Berlin
          </h2>
          <p className={`${s.typewriter} text-sm text-fog`}>
            Plant hier die Einsätze eurer Widerstandsgruppe {quoted(groupName)}. Tippt einen Auftrag an, um Gefährten einzuteilen.
          </p>
        </div>
        <button
          onClick={() => setHelp(true)}
          className={`${s.typewriter} flex h-11 shrink-0 items-center gap-1.5 border border-archive-light/60 px-3 text-xs font-bold tracking-[0.1em] text-archive-light uppercase hover:bg-archive-light hover:text-ink`}
        >
          <CircleHelp size={16} aria-hidden /> So geht’s
        </button>
      </div>

      <div className="-mx-3 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
        <div className="min-w-[680px] border-2 border-[#2c3038] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]">
          <CityMap
            weekIndex={weekIndex}
            missions={missions}
            members={members}
            canPlan={canPlan}
            selected={district}
            onSelect={setDistrict}
            hovered={hovered}
            onHover={setHovered}
            onOpen={openMission}
          />
        </div>
      </div>

      {/* Zeichenerklärung und Bezirke nur bei Bedarf, damit die Karte nicht überladen wirkt */}
      <button
        onClick={() => setShowDistricts((v) => !v)}
        aria-expanded={showDistricts}
        className={`${s.typewriter} flex min-h-11 w-full items-center justify-between gap-2 border border-paper/25 px-3 text-left text-sm text-fog hover:border-paper/60 hover:text-paper`}
      >
        <span>
          <span className="font-bold text-paper">Bezirke und Zeichen erklärt</span>: Überwachung, Vertrauen, was die Punkte auf der Karte bedeuten
        </span>
        <ChevronDown size={18} className={`shrink-0 transition-transform ${showDistricts ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {showDistricts && (
        <div className={`${s.riseIn} space-y-4`}>
          <Legend />
          <DistrictBar weekIndex={weekIndex} trust={trust} selected={district} onSelect={setDistrict} missions={missions} />
        </div>
      )}

      {selected && (
        <div className={`${s.panel} ${s.riseIn} grid gap-3 p-4 sm:grid-cols-[1fr_auto]`}>
          <div>
            <p className={`${s.typewriter} text-xs tracking-[0.12em] text-fog uppercase`}>Lage in {selected.name}</p>
            <p className="mt-1 font-serif text-[17px] leading-relaxed">{t(situationAt(selected.key, weekIndex))}</p>
            <p className="mt-2 font-serif text-[15px] leading-relaxed text-paper/80">{t(selected.text)}</p>
          </div>
          <div className={`${s.typewriter} space-y-1 text-xs text-fog sm:w-56`}>
            <p>Nur hier: {t(selected.special)}</p>
            <p>
              Vertrauen {trust[selected.key]} von {TRUST_MAX}: Gefahr hier {trust[selected.key] * TRUST_RISK_RELIEF} Punkte niedriger
            </p>
            <button onClick={() => setDistrict(null)} className="tap-area mt-1 text-paper underline decoration-dotted underline-offset-4">
              Alle Bezirke zeigen
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_minmax(300px,380px)]">
        <div className="min-w-0">
          <h3 className={`${s.typewriter} mb-2 text-sm font-bold tracking-[0.12em] text-fog uppercase`}>
            Aufträge {selected ? `in ${selected.name}` : 'dieser Woche'} ({visible.length})
          </h3>
          <ul className="grid grid-cols-1 gap-2 xl:grid-cols-2">
            {visible.map((m) => (
              <MissionRow
                key={m.uid}
                m={m}
                weekIndex={weekIndex}
                trust={trust[m.district]}
                plannable={m.assigned.length > 0 || canPlan(m)}
                highlighted={hovered === m.uid}
                onHover={setHovered}
                onOpen={openMission}
              />
            ))}
          </ul>
        </div>

        <WeekPlan
          missions={missions}
          members={members}
          weekIndex={weekIndex}
          trust={trust}
          flags={flags}
          onOpen={openMission}
          firstWeek={history.length === 0}
          opened={opened}
        />
      </div>

      <FinishBar missions={missions} members={members} confirmIdle={confirmIdle} onFinish={finish} onCancel={() => setConfirmIdle(false)} />

      {open && <MissionDossier mission={open} onClose={() => setOpenUid(null)} />}
      {showHelp && <Tutorial weekIndex={weekIndex} onClose={closeHelp} />}
    </section>
  )
}

function Legend() {
  return (
    <ul className={`${s.typewriter} flex flex-wrap gap-x-5 gap-y-2 text-xs text-fog`} aria-label="Legende">
      <li className="flex items-center gap-2">
        <span className="h-4 w-4 rounded-full border-2 border-ink bg-paper outline outline-2 outline-crimson" aria-hidden /> Auftrag
      </li>
      <li className="flex items-center gap-2">
        <span className="h-4 w-4 rounded-full border-2 border-ink bg-group" aria-hidden /> Eingeteilt
      </li>
      <li className="flex items-center gap-2">
        <span className="h-4 w-4 rounded-full border-2 border-dashed border-fog bg-[#3a3d44]" aria-hidden /> Mittel fehlen
      </li>
      <li className="flex items-center gap-2">
        <span className="h-1.5 w-6 bg-crimson" aria-hidden /> Roter Ring: je länger, desto gefährlicher
      </li>
      <li className="flex items-center gap-2">
        <span className="flex gap-0.5" aria-hidden>
          <span className="h-2 w-2 bg-ember" />
          <span className="h-2 w-2 bg-ember" />
          <span className="h-2 w-2 border border-fog" />
        </span>
        Überwachung im Bezirk
      </li>
    </ul>
  )
}

const TIER_CLASS = { gering: 'border-fog/60 text-fog', mittel: 'border-ember text-ember', hoch: 'border-ember bg-crimson text-paper' }

function MissionRow({
  m,
  weekIndex,
  trust,
  plannable,
  highlighted,
  onHover,
  onOpen,
}: {
  m: Mission
  weekIndex: number
  trust: number
  plannable: boolean
  highlighted: boolean
  onHover: (uid: string | null) => void
  onOpen: (uid: string) => void
}) {
  const templates = useMissions()
  const diff = useDifficulty()
  const t = templates[m.type]
  const Icon = MISSION_ICONS[m.type]
  const place = getPlace(m.placeId)
  const assigned = m.assigned.length > 0
  const tier = dangerTier(dangerEstimate(MISSIONS[m.type], m.district, weekIndex, trust, diff.riskFactor))
  return (
    <li>
      <button
        onClick={() => onOpen(m.uid)}
        onPointerEnter={(e) => e.pointerType === 'mouse' && onHover(m.uid)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && onHover(null)}
        onFocus={() => onHover(m.uid)}
        onBlur={() => onHover(null)}
        className={`flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-colors ${
          assigned
            ? 'border-group-light bg-group/40'
            : highlighted
              ? 'border-paper bg-paper/10'
              : 'border-paper/20 hover:border-paper hover:bg-paper/10'
        } ${plannable ? '' : 'border-dashed'}`}
      >
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 ${
            assigned ? 'border-group-light bg-group text-paper' : plannable ? 'border-paper bg-paper text-ink' : 'border-dashed border-fog text-fog'
          }`}
        >
          <Icon size={19} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 font-serif text-base font-bold">
            <span className="truncate">{t.title}</span>
            {t.solidarity && <HandHeart size={14} className="shrink-0 text-group-light" aria-label="hilft Verfolgten" />}
          </span>
          <span className={`${s.typewriter} block truncate text-xs text-fog`}>
            {place.name}, {getDistrict(m.district).name}
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1">
          <span className={`border px-1.5 font-type text-[13px] font-bold tracking-wide uppercase ${TIER_CLASS[tier]}`}>
            Gefahr {tier}
          </span>
          <span className={`font-type text-[13px] ${assigned ? 'font-bold text-group-light' : plannable ? 'text-fog' : 'text-ember'}`}>
            {assigned ? `${m.assigned.length} eingeteilt` : plannable ? 'frei' : 'Mittel fehlen'}
          </span>
        </span>
      </button>
    </li>
  )
}

function WeekPlan({
  missions,
  members,
  weekIndex,
  trust,
  flags,
  onOpen,
  firstWeek,
  opened,
}: {
  missions: Mission[]
  members: Character[]
  weekIndex: number
  trust: Trust
  flags: string[]
  onOpen: (uid: string) => void
  firstWeek: boolean
  opened: boolean
}) {
  const templates = useMissions()
  const diff = useDifficulty()
  const planned = missions.filter((m) => m.assigned.length > 0)
  const busy = new Set(planned.flatMap((m) => m.assigned))
  const idle = members.filter((m) => m.status === 'bereit' && !busy.has(m.id))
  const byId = (id: string) => members.find((c) => c.id === id)

  return (
    <aside className={`${s.panel} flex flex-col gap-4 p-4`} aria-labelledby="plan-titel">
      <h3 id="plan-titel" className={`${s.typewriter} text-sm font-bold tracking-[0.12em] uppercase`}>
        Wochenplan
      </h3>

      {firstWeek && <FirstSteps opened={opened || planned.length > 0} planned={planned.length > 0} />}
      <GoalCard weekIndex={weekIndex} />
      <ProjectCard flags={flags} weekIndex={weekIndex} />

      {planned.length === 0 ? (
        <p className="font-serif text-[15px] leading-relaxed text-paper/85">
          Noch ist nichts geplant. Wähle einen Auftrag auf der Karte oder in der Liste.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {planned.map((m) => {
            const t: Resolved<MissionTemplate> = templates[m.type]
            const Icon = MISSION_ICONS[m.type]
            const team = m.assigned.map(byId).filter((c): c is Character => !!c)
            const chance = successChance(t, team, diff.successBonus)
            const risk = detectionRisk(t, m.district, team, weekIndex, trust[m.district], diff.riskFactor)
            return (
              <li key={m.uid}>
                <button onClick={() => onOpen(m.uid)} className="w-full border border-paper/25 p-2.5 text-left hover:border-paper">
                  <span className="flex items-center gap-2">
                    <Icon size={16} className="shrink-0 text-ember" aria-hidden />
                    <span className="truncate font-serif text-[15px] font-bold">{t.title}</span>
                  </span>
                  <span className="mt-2 flex items-center gap-2">
                    <span className="flex -space-x-1.5">
                      {team.map((c) => (
                        <span key={c.id} className="block border border-paper/60 bg-paper">
                          <Avatar config={c.avatar} size={26} title="" />
                        </span>
                      ))}
                    </span>
                    <span className="truncate font-type text-xs text-fog">{joinNames(team.map(firstName))}</span>
                  </span>
                  <span className="mt-2 grid grid-cols-2 gap-3 font-type text-[13px]">
                    <MiniBar label="Aussicht" value={chance} tone="hope" />
                    <MiniBar label="Gefahr" value={risk} tone="danger" />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {idle.length > 0 && (
        <p className="font-type text-xs leading-relaxed text-fog">
          Ohne Auftrag: {joinNames(idle.map(firstName))}. Wer ruht, gerät aus dem Blick der Polizei.
        </p>
      )}
      {diff.level === 'leicht' && <Tip weekIndex={weekIndex} />}
    </aside>
  )
}

/**
 * Immer am unteren Bildschirmrand: wie viel geplant ist und „Woche beenden“.
 * So muss auf dem iPad niemand bis ganz nach unten scrollen.
 */
function FinishBar({
  missions,
  members,
  confirmIdle,
  onFinish,
  onCancel,
}: {
  missions: Mission[]
  members: Character[]
  confirmIdle: boolean
  onFinish: () => void
  onCancel: () => void
}) {
  const planned = missions.filter((m) => m.assigned.length > 0)
  const busy = new Set(planned.flatMap((m) => m.assigned))
  const idle = members.filter((m) => m.status === 'bereit' && !busy.has(m.id)).length
  return (
    <div className="sticky bottom-0 z-20 -mx-3 border-t-2 border-paper/30 bg-navy/95 px-3 py-3 shadow-[0_-12px_30px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:mx-0 sm:px-4 [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {confirmIdle ? (
          <p className="flex items-center gap-2 font-type text-sm font-bold text-ember" role="status">
            <CircleAlert size={18} aria-hidden /> Diese Woche wirklich nichts unternehmen?
          </p>
        ) : (
          <p className="font-type text-sm" role="status">
            <span className="font-bold text-paper">
              {planned.length === 0 ? 'Noch kein Auftrag geplant' : `${planned.length} ${planned.length === 1 ? 'Auftrag' : 'Aufträge'} geplant`}
            </span>
            {idle > 0 && <span className="text-fog">, {idle === 1 ? '1 Person ruht' : `${idle} Personen ruhen`}</span>}
          </p>
        )}
        <div className="flex items-center gap-3">
          {confirmIdle && (
            <button onClick={onCancel} className="tap-area font-type text-sm text-fog underline decoration-dotted underline-offset-4 hover:text-paper">
              Doch planen
            </button>
          )}
          <StampButton variant={confirmIdle ? 'blood' : 'paper'} onClick={onFinish}>
            {confirmIdle ? 'Ja, stillhalten' : 'Woche beenden'}
          </StampButton>
        </div>
      </div>
    </div>
  )
}

function MiniBar({ label, value, tone }: { label: string; value: number; tone: 'hope' | 'danger' }) {
  return (
    <span className="block">
      <span className="flex justify-between">
        <span className="text-fog">{label}</span>
        <span className={`font-bold ${tone === 'danger' ? 'text-ember' : 'text-paper'}`}>{value}%</span>
      </span>
      <span className="mt-0.5 block h-1.5 border border-paper/40">
        <span className={`block h-full ${tone === 'danger' ? 'bg-ember' : 'bg-paper'}`} style={{ width: `${value}%` }} />
      </span>
    </span>
  )
}

const STEPS = [
  { phase: 'newspaper', label: 'Zeitung und Quelle' },
  { phase: 'event', label: 'Begegnungen' },
  { phase: 'map', label: 'Aufträge planen' },
  { phase: 'report', label: 'Die Nacht' },
] as const

/** Zeigt, wo in der Woche man gerade steht */
function WeekSteps() {
  const phase = useGame((g) => g.phase)
  const current = STEPS.findIndex((st) => st.phase === phase)
  return (
    <ol className="grid grid-cols-4 gap-1" aria-label="Ablauf der Woche">
      {STEPS.map((st, i) => (
        <li
          key={st.phase}
          aria-current={i === current ? 'step' : undefined}
          className={`border-t-4 pt-1.5 font-type text-xs tracking-[0.08em] uppercase sm:text-sm ${
            i === current ? 'border-ember font-bold text-paper' : i < current ? 'border-fog/60 text-fog' : 'border-paper/15 text-fog'
          }`}
        >
          <span className="mr-1">{i + 1}.</span>
          {st.label}
        </li>
      ))}
    </ol>
  )
}

function Pips({ value, max = 5, tone }: { value: number; max?: number; tone: 'ember' | 'paper' }) {
  return (
    <span className="flex gap-0.5" aria-hidden>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`h-2 w-2 ${i < value ? (tone === 'ember' ? 'bg-ember' : 'bg-paper') : 'border border-fog/50'}`} />
      ))}
    </span>
  )
}

/** Die vier Bezirke als Karteikarten: Überwachung, Vertrauen und Zahl der Aufträge */
function DistrictBar({
  weekIndex,
  trust,
  selected,
  onSelect,
  missions,
}: {
  weekIndex: number
  trust: Trust
  selected: DistrictKey | null
  onSelect: (d: DistrictKey | null) => void
  missions: Mission[]
}) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="group" aria-label="Bezirk wählen">
      {DISTRICTS.map((d) => {
        const active = selected === d.key
        const level = surveillanceLevel(surveillanceAt(d.key, weekIndex))
        const count = missions.filter((m) => m.district === d.key).length
        return (
          <button
            key={d.key}
            onClick={() => onSelect(active ? null : d.key)}
            aria-pressed={active}
            className={`border p-2.5 text-left transition-colors ${active ? 'border-paper bg-paper/10' : 'border-paper/20 hover:border-paper/60'}`}
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="font-serif text-base font-bold">{d.name}</span>
              <span className="font-type text-[13px] text-fog">{count} {count === 1 ? 'Auftrag' : 'Aufträge'}</span>
            </span>
            <span className="mt-1.5 flex items-center justify-between gap-2 font-type text-[13px] text-fog">
              Überwachung <Pips value={level} tone="ember" />
            </span>
            <span className="mt-1 flex items-center justify-between gap-2 font-type text-[13px] text-fog">
              Vertrauen <Pips value={trust[d.key]} tone="paper" />
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** In der ersten Woche: drei Schritte zum Abhaken, damit jedes Kind den Ablauf einmal selbst macht */
function FirstSteps({ opened, planned }: { opened: boolean; planned: boolean }) {
  const steps = [
    { done: opened, text: 'Einen Auftrag antippen' },
    { done: planned, text: 'Leute auswählen und „Einteilen“ tippen' },
    { done: false, text: 'Unten „Woche beenden“ tippen' },
  ]
  const current = steps.findIndex((st) => !st.done)
  return (
    <div className="border-2 border-archive-light/60 bg-archive/40 p-3">
      <p className="font-type text-xs font-bold tracking-[0.12em] text-archive-light uppercase">Erste Schritte</p>
      <ol className="mt-2 space-y-1.5">
        {steps.map((st, i) => (
          <li
            key={st.text}
            className={`flex items-center gap-2 font-type text-sm ${st.done ? 'text-fog line-through' : i === current ? 'font-bold text-paper' : 'text-paper/70'}`}
          >
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center border ${
                st.done ? 'border-archive-light bg-archive-light text-ink' : i === current ? 'border-paper' : 'border-paper/40'
              }`}
              aria-hidden
            >
              {st.done ? <Check size={13} /> : <span className="text-[13px]">{i + 1}</span>}
            </span>
            <span>
              {st.text}
              {st.done && <span className="sr-only"> (erledigt)</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Das Ziel der Woche: klein, erreichbar, mit Belohnung im Wochenbericht */
function GoalCard({ weekIndex }: { weekIndex: number }) {
  const t = useT()
  const goalId = useGame((g) => g.goalId)
  const goal = goalById(goalId, weekIndex)
  return (
    <div className="border-2 border-group-light/60 bg-group/30 p-3">
      <p className="flex items-center gap-1.5 font-type text-xs font-bold tracking-[0.12em] text-group-light uppercase">
        <Flag size={12} aria-hidden /> Ziel der Woche
      </p>
      <p className="mt-1 font-serif text-[15px] leading-snug font-bold">{t(goal.text)}</p>
    </div>
  )
}

const TIPS = [
  'Tippe einen Auftrag auf der Karte an. Dann kannst du Leute aus deiner Gruppe einteilen.',
  'Aufträge mit einem Herz-Zeichen helfen verfolgten Menschen direkt. Sie zählen für eure Solidarität.',
  'Wer oft unterwegs ist, wird von der Polizei gesucht. Lass diese Person eine Woche ausruhen.',
  'Druckt erst Flugblätter, bevor ihr sie verteilt. Dafür braucht ihr Papier und Farbe.',
  'Kein Geld mehr? Dann sammelt heimlich Spenden.',
  'Ist jemand verhaftet? Bei eurer Gruppe könnt ihr Hilfe von außen schicken.',
]

function Tip({ weekIndex }: { weekIndex: number }) {
  return (
    <p className="flex gap-2 border border-dashed border-paper/30 p-2.5 font-type text-xs leading-relaxed text-paper/85">
      <Lightbulb size={15} className="mt-0.5 shrink-0 text-archive-light" aria-hidden />
      {TIPS[weekIndex % TIPS.length]}
    </p>
  )
}

const PROJECT_STEPS = [
  { flag: 'presse', label: 'Presse kaufen' },
  { flag: 'transport', label: 'Presse fortschaffen' },
  { flag: 'druckerei', label: 'Keller einrichten' },
]

/** Das Vorhaben über mehrere Wochen: eine eigene Druckerei */
function ProjectCard({ flags, weekIndex }: { flags: string[]; weekIndex: number }) {
  const done = PROJECT_STEPS.filter((st) => flags.includes(st.flag)).length
  const finished = done === PROJECT_STEPS.length
  return (
    <div className="border border-dashed border-paper/40 p-3">
      <p className="font-type text-xs tracking-[0.12em] text-fog uppercase">Vorhaben</p>
      <p className="font-serif text-[15px] font-bold">{finished ? 'Die eigene Druckerei läuft' : 'Eine eigene Druckerei'}</p>
      <ol className="mt-2 grid grid-cols-3 gap-1.5">
        {PROJECT_STEPS.map((st, i) => {
          const ok = flags.includes(st.flag)
          return (
            <li
              key={st.flag}
              className={`flex items-center gap-1 border px-1.5 py-1 font-type text-[13px] leading-tight ${
                ok ? 'border-paper bg-paper text-ink' : i === done ? 'border-ember text-paper' : 'border-paper/20 text-fog'
              }`}
            >
              {ok && <Check size={12} className="shrink-0" aria-hidden />}
              {st.label}
            </li>
          )
        })}
      </ol>
      <p className="mt-2 font-type text-[13px] leading-snug text-fog">
        {finished
          ? 'Drucken bringt jetzt 5 statt 3 Bündel. Neu: die eigene Zeitung.'
          : weekIndex === 0
            ? 'Ab nächster Woche erscheint der erste Schritt auf der Karte.'
            : 'Der nächste Schritt steht als Auftrag auf der Karte.'}
      </p>
    </div>
  )
}
