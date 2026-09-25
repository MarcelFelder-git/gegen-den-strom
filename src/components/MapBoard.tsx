import { useState } from 'react'
import { Check, CircleAlert } from 'lucide-react'
import s from '../styles/period.module.css'
import { Avatar } from './Avatar'
import { CityMap } from './CityMap'
import { MissionDossier } from './MissionDossier'
import { StampButton } from './ui/StampButton'
import { MISSION_ICONS } from './icons'
import { DISTRICTS, getDistrict, getPlace, situationAt, surveillanceAt, surveillanceLevel } from '../game/data/districts'
import { MISSIONS } from '../game/data/missions'
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

export function MapBoard() {
  const { missions, members, weekIndex, kasse, inventory, endWeek, trust, flags, groupName } = useGame()
  const [openUid, setOpenUid] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [district, setDistrict] = useState<DistrictKey | null>(null)
  const [confirmIdle, setConfirmIdle] = useState(false)

  const open = missions.find((m) => m.uid === openUid)
  const canPlan = (m: Mission) => canAfford(MISSIONS[m.type], kasse, inventory)
  const visible = missions.filter((m) => !district || m.district === district)
  const selected = district ? getDistrict(district) : null

  const finish = () => {
    if (missions.every((m) => m.assigned.length === 0) && !confirmIdle) return setConfirmIdle(true)
    setConfirmIdle(false)
    endWeek()
  }

  return (
    <section aria-labelledby="karte-titel" className="min-w-0 space-y-4">
      <WeekSteps />
      <div>
        <div>
          <h2 id="karte-titel" className="font-serif text-2xl font-bold">
            Stadtkarte Berlin
          </h2>
          <p className={`${s.typewriter} text-sm text-fog`}>
            Plant hier die Einsätze eurer Widerstandsgruppe {quoted(groupName)}. Tippt einen Auftrag an, um Gefährten einzuteilen.
          </p>
        </div>
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
            onOpen={setOpenUid}
          />
        </div>
      </div>

      <Legend />

      <DistrictBar weekIndex={weekIndex} trust={trust} selected={district} onSelect={setDistrict} missions={missions} />

      {selected && (
        <div className={`${s.panel} ${s.riseIn} grid gap-3 p-4 sm:grid-cols-[1fr_auto]`}>
          <div>
            <p className={`${s.typewriter} text-[10px] tracking-[0.2em] text-fog uppercase`}>Lage in {selected.name}</p>
            <p className="mt-1 font-serif text-[17px] leading-relaxed">{situationAt(selected.key, weekIndex)}</p>
            <p className="mt-2 font-serif text-[15px] leading-relaxed text-paper/80">{selected.text}</p>
          </div>
          <div className={`${s.typewriter} space-y-1 text-xs text-fog sm:w-56`}>
            <p>Nur hier: {selected.special}</p>
            <p>
              Vertrauen {trust[selected.key]} von {TRUST_MAX}: Gefahr hier {trust[selected.key] * TRUST_RISK_RELIEF} Punkte niedriger
            </p>
            <button onClick={() => setDistrict(null)} className="mt-1 text-paper underline decoration-dotted underline-offset-4">
              Alle Bezirke zeigen
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_minmax(300px,380px)]">
        <div className="min-w-0">
          <h3 className={`${s.typewriter} mb-2 text-sm font-bold tracking-[0.2em] text-fog uppercase`}>
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
                onOpen={setOpenUid}
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
          onOpen={setOpenUid}
          confirmIdle={confirmIdle}
          onFinish={finish}
        />
      </div>

      {open && <MissionDossier mission={open} onClose={() => setOpenUid(null)} />}
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
        <span className="h-4 w-4 rounded-full border-2 border-ink bg-crimson" aria-hidden /> Eingeteilt
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
  const t = MISSIONS[m.type]
  const Icon = MISSION_ICONS[m.type]
  const place = getPlace(m.placeId)
  const assigned = m.assigned.length > 0
  const tier = dangerTier(dangerEstimate(t, m.district, weekIndex, trust))
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
            ? 'border-ember bg-crimson/25'
            : highlighted
              ? 'border-paper bg-paper/10'
              : 'border-paper/20 hover:border-paper hover:bg-paper/10'
        } ${plannable ? '' : 'opacity-70'}`}
      >
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 ${
            assigned ? 'border-ember bg-crimson text-paper' : plannable ? 'border-paper bg-paper text-ink' : 'border-dashed border-fog text-fog'
          }`}
        >
          <Icon size={19} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-serif text-base font-bold">{t.title}</span>
          <span className={`${s.typewriter} block truncate text-xs text-fog`}>
            {place.name}, {getDistrict(m.district).name}
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1">
          <span className={`border px-1.5 font-type text-[11px] font-bold tracking-wide uppercase ${TIER_CLASS[tier]}`}>
            Gefahr {tier}
          </span>
          <span className={`font-type text-[11px] ${assigned ? 'font-bold text-ember' : plannable ? 'text-fog' : 'text-ember'}`}>
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
  confirmIdle,
  onFinish,
}: {
  missions: Mission[]
  members: Character[]
  weekIndex: number
  trust: Trust
  flags: string[]
  onOpen: (uid: string) => void
  confirmIdle: boolean
  onFinish: () => void
}) {
  const planned = missions.filter((m) => m.assigned.length > 0)
  const busy = new Set(planned.flatMap((m) => m.assigned))
  const idle = members.filter((m) => m.status === 'bereit' && !busy.has(m.id))
  const byId = (id: string) => members.find((c) => c.id === id)

  return (
    <aside className={`${s.panel} flex flex-col gap-4 p-4`} aria-labelledby="plan-titel">
      <h3 id="plan-titel" className={`${s.typewriter} text-sm font-bold tracking-[0.2em] uppercase`}>
        Wochenplan
      </h3>

      <ProjectCard flags={flags} weekIndex={weekIndex} />

      {planned.length === 0 ? (
        <p className="font-serif text-[15px] leading-relaxed text-paper/85">
          Noch ist nichts geplant. Wähle einen Auftrag auf der Karte oder in der Liste.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {planned.map((m) => {
            const t = MISSIONS[m.type]
            const Icon = MISSION_ICONS[m.type]
            const team = m.assigned.map(byId).filter((c): c is Character => !!c)
            const chance = successChance(t, team)
            const risk = detectionRisk(t, m.district, team, weekIndex, trust[m.district])
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
                  <span className="mt-2 grid grid-cols-2 gap-3 font-type text-[11px]">
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

      <div className="mt-auto space-y-2 border-t border-paper/20 pt-3">
        {confirmIdle && (
          <p className="flex items-center gap-2 font-type text-sm text-ember" role="status">
            <CircleAlert size={16} aria-hidden /> Diese Woche wirklich nichts unternehmen?
          </p>
        )}
        <StampButton variant={confirmIdle ? 'blood' : 'paper'} onClick={onFinish} className="w-full">
          {confirmIdle ? 'Ja, stillhalten' : 'Woche beenden'}
        </StampButton>
      </div>
    </aside>
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
  { phase: 'newspaper', label: 'Zeitung lesen' },
  { phase: 'event', label: 'Entscheiden' },
  { phase: 'map', label: 'Aufträge planen' },
  { phase: 'report', label: 'Bericht' },
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
          className={`border-t-4 pt-1.5 font-type text-[11px] tracking-[0.1em] uppercase sm:text-xs ${
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
              <span className="font-type text-[11px] text-fog">{count} {count === 1 ? 'Auftrag' : 'Aufträge'}</span>
            </span>
            <span className="mt-1.5 flex items-center justify-between gap-2 font-type text-[11px] text-fog">
              Überwachung <Pips value={level} tone="ember" />
            </span>
            <span className="mt-1 flex items-center justify-between gap-2 font-type text-[11px] text-fog">
              Vertrauen <Pips value={trust[d.key]} tone="paper" />
            </span>
          </button>
        )
      })}
    </div>
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
      <p className="font-type text-[10px] tracking-[0.2em] text-fog uppercase">Vorhaben</p>
      <p className="font-serif text-[15px] font-bold">{finished ? 'Die eigene Druckerei läuft' : 'Eine eigene Druckerei'}</p>
      <ol className="mt-2 grid grid-cols-3 gap-1.5">
        {PROJECT_STEPS.map((st, i) => {
          const ok = flags.includes(st.flag)
          return (
            <li
              key={st.flag}
              className={`flex items-center gap-1 border px-1.5 py-1 font-type text-[11px] leading-tight ${
                ok ? 'border-paper bg-paper text-ink' : i === done ? 'border-ember text-paper' : 'border-paper/20 text-fog'
              }`}
            >
              {ok && <Check size={12} className="shrink-0" aria-hidden />}
              {st.label}
            </li>
          )
        })}
      </ol>
      <p className="mt-2 font-type text-[11px] leading-snug text-fog">
        {finished
          ? 'Drucken bringt jetzt 5 statt 3 Bündel. Neu: die eigene Zeitung.'
          : weekIndex === 0
            ? 'Ab nächster Woche erscheint der erste Schritt auf der Karte.'
            : 'Der nächste Schritt steht als Auftrag auf der Karte.'}
      </p>
    </div>
  )
}
