import { useEffect, useState, type CSSProperties, type KeyboardEvent } from 'react'
import s from '../styles/period.module.css'
import { MISSION_ICONS } from './icons'
import {
  DISTRICTS,
  LANDMARKS,
  MAP_H,
  MAP_W,
  PLAQUE_H,
  PLAQUE_W,
  getDistrict,
  getPlace,
  surveillanceAt,
  surveillanceLabel,
  surveillanceLevel,
  toPath,
  type Landmark,
  type Point,
} from '../game/data/districts'
import { useDifficulty, useMissions } from '../store/content'
import { WEEKS } from '../game/data/weeks'
import { dangerEstimate, dangerTier, describeItem, firstName, joinNames } from '../game/logic'
import type { Character, DistrictKey, ItemKey, Mission } from '../game/types'
import { useGame } from '../store/GameStore'

const INK = '#0c0d10'
const PAPER = '#f4f1ea'
const FOG = '#b3ad9e'
const BLOOD = '#8b0000'
const EMBER = '#e0735f'
const LAMP = '#f0c96a'

/* Umland, nur zur Orientierung */
const CONTEXT: { name: string; poly: Point[]; label?: Point }[] = [
  { name: 'Moabit', poly: [[0, 0], [170, 40], [200, 200], [310, 246], [60, 250], [0, 240]], label: [86, 150] },
  { name: 'Tiergarten', poly: [[0, 240], [60, 250], [310, 246], [300, 330], [330, 420], [300, 500], [0, 500]], label: [96, 338] },
  { name: 'Schöneberg', poly: [[0, 500], [300, 500], [320, 620], [420, 670], [420, 700], [0, 700]], label: [150, 612] },
  { name: 'Tempelhof', poly: [[420, 670], [630, 660], [640, 700], [420, 700]] },
  { name: 'Prenzlauer Berg', poly: [[420, 24], [420, 0], [1000, 0], [1000, 150], [860, 230], [770, 300], [690, 236], [700, 120], [660, 40]], label: [838, 98] },
  { name: 'Friedrichshain', poly: [[770, 300], [860, 230], [1000, 150], [1000, 470], [900, 440], [760, 420]], label: [882, 340] },
  { name: 'Treptow', poly: [[900, 440], [1000, 470], [1000, 700], [640, 700], [640, 680], [920, 680], [950, 560]] },
]

const STREETS: Record<DistrictKey, string> = {
  wedding: 'M170 120 L700 92 M430 24 L468 250 M580 30 L540 250 M200 205 L690 170',
  mitte: 'M300 332 L770 318 M478 246 L486 440 M610 240 L640 436 M330 404 L760 384',
  kreuzberg: 'M300 560 L650 556 M420 430 L438 670 M530 436 L552 668 M330 470 L640 628',
  neukoelln: 'M640 590 L950 560 M708 430 L722 680 M820 428 L840 680 M660 500 L930 470',
}

const SPREE = 'M1000 392 C960 410 930 432 900 436 L760 421 L620 437 L460 441 L330 421 L302 332 C290 300 272 276 248 262 C180 244 90 250 0 238'
const CANAL = 'M0 540 C120 530 220 520 300 516 C400 512 470 532 560 532 C600 532 628 526 648 520'

function lampsFor(path: string): Point[] {
  const pts: Point[] = []
  const nums = path.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? []
  for (let i = 0; i + 3 < nums.length; i += 4) {
    const [x1, y1, x2, y2] = nums.slice(i, i + 4)
    for (const t of [0.18, 0.42, 0.66, 0.9]) pts.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t])
  }
  return pts
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return reduced
}

interface CityMapProps {
  weekIndex: number
  missions: Mission[]
  members: Character[]
  canPlan: (m: Mission) => boolean
  selected: DistrictKey | null
  onSelect: (d: DistrictKey | null) => void
  hovered: string | null
  onHover: (uid: string | null) => void
  onOpen: (uid: string) => void
}

/** Die Stadt bei Nacht: Bezirke, Laternen und die Aufträge der Woche */
export function CityMap({ weekIndex, missions, members, canPlan, selected, onSelect, hovered, onHover, onOpen }: CityMapProps) {
  const reduced = useReducedMotion()
  const trust = useGame((g) => g.trust)
  const templates = useMissions()
  const diff = useDifficulty()
  const hoveredMission = missions.find((m) => m.uid === hovered)
  const dread = weekIndex / 9

  const activate = (e: KeyboardEvent, fn: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fn()
    }
  }

  return (
    <div className="relative aspect-[10/7] w-full select-none" onMouseLeave={() => onHover(null)}>
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="absolute inset-0 h-full w-full"
        role="group"
        aria-label="Stadtplan von Berlin bei Nacht. Bezirke und Aufträge sind auswählbar."
      >
        <defs>
          <pattern id="cm-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={PAPER} strokeWidth="0.6" opacity="0.07" />
          </pattern>
          <pattern id="cm-hatch-ctx" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke={PAPER} strokeWidth="0.5" opacity="0.05" />
          </pattern>
          <pattern id="cm-danger" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
            <line x1="0" y1="0" x2="0" y2="7" stroke={BLOOD} strokeWidth="2.2" />
          </pattern>
          <pattern id="cm-trees" width="18" height="16" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="2.8" fill="none" stroke={PAPER} strokeWidth="0.8" opacity="0.14" />
            <circle cx="13" cy="12" r="2.3" fill="none" stroke={PAPER} strokeWidth="0.8" opacity="0.14" />
          </pattern>
          <radialGradient id="cm-lamp">
            <stop offset="0" stopColor={LAMP} stopOpacity="0.5" />
            <stop offset="1" stopColor={LAMP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cm-vignette" cx="0.5" cy="0.5" r="0.75">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#1a0000" stopOpacity={0.55 + dread * 0.25} />
          </radialGradient>
          {DISTRICTS.map((d) => (
            <clipPath key={d.key} id={`cm-clip-${d.key}`}>
              <path d={toPath(d.polygon)} />
            </clipPath>
          ))}
        </defs>

        {/* Nacht und Umland */}
        <rect width={MAP_W} height={MAP_H} fill="#101216" onClick={() => onSelect(null)} />
        {CONTEXT.map((c) => (
          <g key={c.name} onClick={() => onSelect(null)}>
            <path d={toPath(c.poly)} fill="#181b21" stroke="#2c3038" strokeWidth="1" strokeDasharray="3 5" />
            <path d={toPath(c.poly)} fill={c.name === 'Tiergarten' ? 'url(#cm-trees)' : 'url(#cm-hatch-ctx)'} />
            {c.label && (
              <text x={c.label[0]} y={c.label[1]} textAnchor="middle" fontFamily="Old Standard TT, Georgia, serif" fontStyle="italic" fontSize="17" fill="#8d887c">
                {c.name}
              </text>
            )}
          </g>
        ))}

        {/* Bezirke */}
        {DISTRICTS.map((d) => {
          const level = surveillanceLevel(surveillanceAt(d.key, weekIndex))
          const dim = selected !== null && selected !== d.key
          const lamps = lampsFor(STREETS[d.key])
          return (
            <g key={d.key} onClick={() => onSelect(selected === d.key ? null : d.key)} className="cursor-pointer">
              <path d={toPath(d.polygon)} fill={selected === d.key ? '#343943' : '#262a31'} />
              <path d={toPath(d.polygon)} fill="url(#cm-hatch)" />
              <path d={toPath(d.polygon)} fill="url(#cm-danger)" opacity={0.07 + level * 0.07} />
              <g clipPath={`url(#cm-clip-${d.key})`}>
                <path d={STREETS[d.key]} stroke="#575c66" strokeWidth="2.4" fill="none" opacity="0.8" />
                {lamps.map(([x, y], i) => (
                  <g key={i} className={i % 5 === 2 ? s.flicker : undefined}>
                    <circle cx={x} cy={y} r="11" fill="url(#cm-lamp)" />
                    <circle cx={x} cy={y} r="1.8" fill={LAMP} />
                  </g>
                ))}
              </g>
              <path d={toPath(d.polygon)} fill="none" stroke="#000" strokeWidth="6" strokeLinejoin="round" opacity="0.6" />
              <path
                d={toPath(d.polygon)}
                fill="none"
                stroke={selected === d.key ? PAPER : '#cfc6b0'}
                strokeWidth={selected === d.key ? 3.5 : 2}
                strokeLinejoin="round"
              />
              {dim && <path d={toPath(d.polygon)} fill="#000" opacity="0.45" />}
            </g>
          )
        })}

        {/* Wasser */}
        <g pointerEvents="none">
          <path d={SPREE} fill="none" stroke="#06080c" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
          <path d={SPREE} fill="none" stroke="#1d2b3f" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <path d={SPREE} fill="none" stroke="#3d5573" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          <path d={CANAL} fill="none" stroke="#06080c" strokeWidth="9" strokeLinecap="round" />
          <path d={CANAL} fill="none" stroke="#1d2b3f" strokeWidth="6" strokeLinecap="round" />
          <path d={CANAL} fill="none" stroke="#3d5573" strokeWidth="1" opacity="0.8" />
          <text x="960" y="390" fontFamily="Old Standard TT, Georgia, serif" fontStyle="italic" fontSize="14" fill="#7d8aa0" textAnchor="middle" transform="rotate(-20 960 390)">
            Spree
          </text>
        </g>

        {/* Wahrzeichen */}
        {LANDMARKS.filter((l) => weekIndex >= l.from).map((l) => (
          <LandmarkGlyph key={l.id} l={l} burnt={l.id === 'reichstag' && weekIndex >= 2} />
        ))}

        {weekIndex >= 11 && (
          <g pointerEvents="none" transform="translate(708 22)">
            <path d="M0 16 L0 -4 M-6 3 L0 -6 L6 3" stroke={EMBER} strokeWidth="2.5" fill="none" />
            <text x="12" y="10" fontFamily="Courier Prime, monospace" fontSize="14" fontWeight="700" fill={EMBER}>
              35 km bis Sachsenhausen: Lager
            </text>
          </g>
        )}
        {weekIndex >= 11 && (
          <g pointerEvents="none" transform="translate(860 262)">
            <path d="M-4 0 L20 0 M13 -6 L21 0 L13 6" stroke={EMBER} strokeWidth="2.5" fill="none" />
            <text x="-6" y="-8" textAnchor="end" fontFamily="Courier Prime, monospace" fontSize="13" fontWeight="700" fill={EMBER}>
              Marzahn: Zwangslager
            </text>
          </g>
        )}
        {weekIndex >= 4 && weekIndex < 10 && (
          <g pointerEvents="none" transform="translate(708 22)">
            <path d="M0 16 L0 -4 M-6 3 L0 -6 L6 3" stroke={EMBER} strokeWidth="2.5" fill="none" />
            <text x="12" y="10" fontFamily="Courier Prime, monospace" fontSize="14" fontWeight="700" fill={EMBER}>
              30 km bis Oranienburg: Lager
            </text>
          </g>
        )}

        {/* Bezirksschilder */}
        {DISTRICTS.map((d) => {
          const sv = surveillanceAt(d.key, weekIndex)
          const level = surveillanceLevel(sv)
          const active = selected === d.key
          return (
            <g
              key={`${d.key}-plaque`}
              transform={`translate(${d.plaque[0]} ${d.plaque[1]})`}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              aria-label={`Bezirk ${d.name}, Überwachung ${surveillanceLabel(sv)}. ${active ? 'Auswahl aufheben' : 'Nur Aufträge in diesem Bezirk zeigen'}`}
              onClick={() => onSelect(active ? null : d.key)}
              onKeyDown={(e) => activate(e, () => onSelect(active ? null : d.key))}
              className="cursor-pointer outline-none"
            >
              <rect width={PLAQUE_W} height={PLAQUE_H} fill={active ? PAPER : INK} stroke={PAPER} strokeWidth="1.5" />
              <rect x="3.5" y="3.5" width={PLAQUE_W - 7} height={PLAQUE_H - 7} fill="none" stroke={active ? INK : PAPER} strokeOpacity="0.35" />
              <text x="12" y="25" fontFamily="Old Standard TT, Georgia, serif" fontWeight="700" fontSize="21" letterSpacing="3" fill={active ? INK : PAPER}>
                {d.name.toUpperCase()}
              </text>
              <text x="12" y="41.5" fontFamily="Courier Prime, monospace" fontSize="9.5" letterSpacing="1.2" fill={active ? '#4a4f57' : FOG}>
                ÜBERWACHUNG
              </text>
              {[0, 1, 2, 3, 4].map((i) => (
                <rect
                  key={i}
                  x={104 + i * 13}
                  y="33"
                  width="10"
                  height="10"
                  fill={i < level ? (active ? BLOOD : EMBER) : 'none'}
                  stroke={active ? '#4a4f57' : FOG}
                  strokeWidth="1"
                />
              ))}
            </g>
          )
        })}

        {/* Aufträge */}
        {missions.map((m) => {
          const t = templates[m.type]
          const place = getPlace(m.placeId)
          const Icon = MISSION_ICONS[m.type]
          const assigned = m.assigned.length > 0
          const plannable = assigned || canPlan(m)
          const isHover = hovered === m.uid
          const risk = dangerEstimate(t, m.district, weekIndex, trust[m.district], diff.riskFactor)
          const circ = 2 * Math.PI * 26
          const dim = selected !== null && selected !== m.district
          return (
            <g
              key={m.uid}
              transform={`translate(${place.x} ${place.y})`}
              role="button"
              tabIndex={0}
              aria-label={`${t.title}, ${place.name}. Gefahr ${dangerTier(risk)}.${assigned ? ` ${m.assigned.length} eingeteilt.` : ''}${plannable ? '' : ' Es fehlen Mittel.'}`}
              onClick={() => onOpen(m.uid)}
              onKeyDown={(e) => activate(e, () => onOpen(m.uid))}
              onPointerEnter={(e) => e.pointerType === 'mouse' && onHover(m.uid)}
              onFocus={(e) => e.currentTarget.matches(':focus-visible') && onHover(m.uid)}
              onBlur={() => onHover(null)}
              opacity={dim ? 0.35 : 1}
              className="cursor-pointer outline-none"
            >
              {/* Unsichtbare, größere Fläche, damit Finger den Auftrag sicher treffen */}
              <circle r="40" fill="transparent" />
              {!assigned && plannable && !reduced && (
                <circle r="21" fill="none" stroke={PAPER} strokeWidth="2">
                  <animate attributeName="r" values="21;36" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0" dur="2.4s" repeatCount="indefinite" />
                </circle>
              )}
              {isHover && <circle r="33" fill="none" stroke={EMBER} strokeWidth="3" />}
              <circle r="26" fill="none" stroke={INK} strokeWidth="6" />
              <circle
                r="26"
                fill="none"
                stroke={BLOOD}
                strokeWidth="4"
                strokeDasharray={`${(circ * Math.min(risk, 60)) / 60} ${circ}`}
                transform="rotate(-90)"
              />
              <circle r="21" fill={assigned ? BLOOD : plannable ? PAPER : '#3a3d44'} stroke={INK} strokeWidth="2" />
              <Icon x={-11} y={-11} width={22} height={22} color={assigned ? PAPER : plannable ? '#1c1c1e' : '#9a968c'} aria-hidden />
              {assigned && (
                <g transform="translate(18 -18)">
                  <circle r="9.5" fill={INK} stroke={PAPER} strokeWidth="1.5" />
                  <text y="4" textAnchor="middle" fontFamily="Courier Prime, monospace" fontWeight="700" fontSize="12" fill={PAPER}>
                    {m.assigned.length}
                  </text>
                </g>
              )}
              <rect
                x="-38"
                y="30"
                width="76"
                height="19"
                fill={assigned ? BLOOD : plannable ? PAPER : '#2a2d33'}
                stroke={plannable ? INK : '#6b6860'}
                strokeDasharray={plannable ? undefined : '3 2'}
              />
              <text
                y="44"
                textAnchor="middle"
                fontFamily="Courier Prime, monospace"
                fontWeight="700"
                fontSize="12.5"
                fill={assigned ? PAPER : plannable ? '#1c1c1e' : '#b3ad9e'}
              >
                {t.tag}
              </text>
            </g>
          )
        })}

        {/* Kompass und Titel */}
        <g pointerEvents="none" transform="translate(960 640)">
          <circle r="24" fill={INK} stroke={FOG} strokeWidth="1.5" />
          <path d="M0 -20 L6 0 L0 20 L-6 0 Z" fill={FOG} />
          <path d="M0 -20 L6 0 L-6 0 Z" fill={EMBER} />
          <text y="-28" textAnchor="middle" fontFamily="Courier Prime, monospace" fontSize="12" fontWeight="700" fill={FOG}>
            N
          </text>
        </g>
        <g pointerEvents="none" transform="translate(14 14)">
          <rect width="228" height="34" fill={INK} stroke={FOG} strokeWidth="1" />
          <text x="12" y="23" fontFamily="Old Standard TT, Georgia, serif" fontSize="16" fontWeight="700" fill={PAPER}>
            Berlin bei Nacht, {WEEKS[weekIndex]?.calendar.year ?? 1933}
          </text>
        </g>

        <rect width={MAP_W} height={MAP_H} fill="url(#cm-vignette)" pointerEvents="none" />
      </svg>

      {hoveredMission && <HoverCard mission={hoveredMission} members={members} weekIndex={weekIndex} plannable={hoveredMission.assigned.length > 0 || canPlan(hoveredMission)} districtTrust={trust[hoveredMission.district]} />}
    </div>
  )
}

function LandmarkGlyph({ l, burnt }: { l: Landmark; burnt: boolean }) {
  const color = l.danger ? EMBER : FOG
  return (
    <g transform={`translate(${l.x} ${l.y})`} pointerEvents="none">
      {l.kind === 'dome' && (
        <>
          {burnt && (
            <circle r="26" fill={EMBER} opacity="0.22" className={s.flicker} />
          )}
          <rect x="-18" y="-4" width="36" height="13" fill={color} />
          <path d="M-10 -4 Q0 -22 10 -4 Z" fill={burnt ? '#101216' : color} stroke={color} strokeWidth="2" />
          {burnt && <path d="M-7 -8 Q-3 -26 0 -13 Q3 -28 7 -9" fill={EMBER} className={s.flicker} />}
        </>
      )}
      {l.kind === 'gate' && (
        <>
          <rect x="-16" y="-10" width="32" height="4" fill={color} />
          {[-14, -8, -2, 4, 10].map((px) => (
            <rect key={px} x={px} y="-6" width="3" height="13" fill={color} />
          ))}
        </>
      )}
      {l.kind === 'stadium' && (
        <>
          <ellipse cx="0" cy="0" rx="22" ry="12" fill="none" stroke={color} strokeWidth="4" />
          <ellipse cx="0" cy="0" rx="12" ry="5" fill={color} opacity="0.4" />
          <rect x="-3" y="-24" width="6" height="12" fill={color} />
        </>
      )}
      {l.kind === 'block' && <rect x="-11" y="-9" width="22" height="18" fill={BLOOD} stroke={EMBER} strokeWidth="1.5" />}
      <text
        y="24"
        textAnchor="middle"
        fontFamily="Courier Prime, monospace"
        fontSize="12.5"
        fontWeight="700"
        fill={color}
        stroke="#101216"
        strokeWidth="3.5"
        paintOrder="stroke"
      >
        {burnt ? 'Reichstag, verbrannt' : l.label}
      </text>
    </g>
  )
}

function HoverCard({
  mission,
  members,
  weekIndex,
  plannable,
  districtTrust,
}: {
  mission: Mission
  members: Character[]
  weekIndex: number
  plannable: boolean
  districtTrust: number
}) {
  const t = useMissions()[mission.type]
  const diff = useDifficulty()
  const place = getPlace(mission.placeId)
  const risk = dangerEstimate(t, mission.district, weekIndex, districtTrust, diff.riskFactor)
  const tier = dangerTier(risk)
  const team = mission.assigned.map((id) => members.find((c) => c.id === id)).filter((c): c is Character => !!c)
  const costs: string[] = []
  if (t.cost.kasse) costs.push(`${t.cost.kasse} Reichsmark`)
  for (const [k, v] of Object.entries(t.cost.items ?? {}) as [ItemKey, number][]) costs.push(describeItem(k, v))

  const below = place.y < 330
  const style: CSSProperties = {
    left: `${(place.x / MAP_W) * 100}%`,
    transform: `translateX(${place.x < 180 ? '-15%' : place.x > 820 ? '-85%' : '-50%'})`,
    ...(below ? { top: `${((place.y + 56) / MAP_H) * 100}%` } : { bottom: `${((MAP_H - place.y + 34) / MAP_H) * 100}%` }),
  }

  return (
    <div className={`${s.paper} pointer-events-none absolute z-20 w-64 p-3 ${s.riseIn}`} style={style} role="tooltip">
      <p className="font-serif text-base leading-tight font-bold">{t.title}</p>
      <p className="mt-0.5 font-type text-xs text-slate">
        {place.name}, {getDistrict(mission.district).name}
      </p>
      <dl className="mt-2 space-y-1 font-type text-xs">
        <div className="flex justify-between gap-2">
          <dt>Gefahr</dt>
          <dd className={`font-bold ${tier === 'gering' ? '' : 'text-crimson'}`}>{tier}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Braucht</dt>
          <dd className={`text-right font-bold ${plannable ? '' : 'text-crimson'}`}>{costs.length ? costs.join(', ') : 'nichts'}</dd>
        </div>
        <div>
          <dt className="sr-only">Bei Erfolg</dt>
          <dd className="border-t border-dashed border-slate pt-1">{t.rewardLabel}</dd>
        </div>
      </dl>
      <p className="mt-2 font-type text-xs font-bold">
        {team.length > 0
          ? `Eingeteilt: ${joinNames(team.map(firstName))}`
          : plannable
            ? 'Anklicken, um Gefährten einzuteilen'
            : 'Dafür fehlen noch Mittel'}
      </p>
    </div>
  )
}
