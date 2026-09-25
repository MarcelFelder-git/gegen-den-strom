import { useMemo, useState } from 'react'
import { Check, TriangleAlert, X } from 'lucide-react'
import s from '../styles/period.module.css'
import { Avatar } from './Avatar'
import { Modal } from './ui/Modal'
import { Gauge } from './ui/Gauge'
import { StampButton } from './ui/StampButton'
import { StatPips } from './ui/StatPips'
import { MISSION_ICONS } from './icons'
import { statusOf } from './GroupPanel'
import { getDistrict, getPlace, surveillanceAt, surveillanceLabel } from '../game/data/districts'
import { DETECTION_HEAT, MISSIONS } from '../game/data/missions'
import { STAT_LABELS } from '../game/data/professions'
import {
  MAX_TEAM,
  TRUST_RISK_RELIEF,
  canAfford,
  describeItem,
  detectionRisk,
  firstName,
  isAvailable,
  isWanted,
  joinNames,
  successChance,
} from '../game/logic'
import type { ItemKey, Mission } from '../game/types'
import { useGame } from '../store/GameStore'

interface MissionDossierProps {
  mission: Mission
  onClose: () => void
}

export function MissionDossier({ mission, onClose }: MissionDossierProps) {
  const { members, missions, kasse, inventory, weekIndex, assign, unassign, trust } = useGame()
  const [selected, setSelected] = useState<string[]>(mission.assigned)
  const [error, setError] = useState<string | null>(null)

  const t = MISSIONS[mission.type]
  const place = getPlace(mission.placeId)
  const district = getDistrict(mission.district)
  const Icon = MISSION_ICONS[mission.type]
  const alreadyPlanned = mission.assigned.length > 0
  const affordable = alreadyPlanned || canAfford(t, kasse, inventory)

  const busyElsewhere = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of missions) if (m.uid !== mission.uid) for (const id of m.assigned) map.set(id, MISSIONS[m.type].title)
    return map
  }, [missions, mission.uid])

  const team = selected.map((id) => members.find((m) => m.id === id)).filter((m) => !!m)
  const chance = successChance(t, team)
  const districtTrust = trust[mission.district]
  const risk = detectionRisk(t, mission.district, team, weekIndex, districtTrust)
  const wanted = team.filter(isWanted)

  const toggle = (id: string) => {
    setError(null)
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= MAX_TEAM ? cur : [...cur, id]))
  }

  const confirm = () => {
    const err = assign(mission.uid, selected)
    if (err) setError(err)
    else onClose()
  }

  const withdraw = () => {
    unassign(mission.uid)
    onClose()
  }

  const costLines: { text: string; ok: boolean }[] = []
  if (t.cost.kasse) costLines.push({ text: `${t.cost.kasse} Reichsmark`, ok: alreadyPlanned || kasse >= t.cost.kasse })
  for (const [k, v] of Object.entries(t.cost.items ?? {}) as [ItemKey, number][]) {
    costLines.push({ text: describeItem(k, v), ok: alreadyPlanned || inventory[k] >= v })
  }

  return (
    <Modal label={`Akte: ${t.title}`} onClose={onClose} width="max-w-5xl">
      <div className={`${s.folder} ${s.riseIn} relative mt-6 px-4 pt-8 pb-6 sm:px-8`}>
        {/* Reiter der Akte */}
        <div className="absolute -top-7 left-6 h-8 w-44 bg-[#d8c59b] px-3 pt-1.5 font-type text-xs font-bold tracking-[0.2em] uppercase shadow-[0_-2px_0_rgba(0,0,0,0.12)]">
          Akte Nr. {weekIndex + 1}/{mission.uid.split('-')[1]}
        </div>
        <span className={s.clip} style={{ left: '46%' }} aria-hidden />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 grid h-10 w-10 place-items-center border-2 border-ink bg-paper hover:bg-ink hover:text-paper"
          aria-label="Akte schließen"
        >
          <X size={20} aria-hidden />
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Linke Seite: der Auftrag */}
          <div className={`${s.paper} p-5 sm:p-6`}>
            <div className="flex items-start gap-3 pr-10 lg:pr-0">
              <span className="grid h-12 w-12 shrink-0 place-items-center border-2 border-ink bg-ink text-paper">
                <Icon size={24} aria-hidden />
              </span>
              <div>
                <h2 className="font-serif text-2xl leading-tight font-bold sm:text-3xl">{t.title}</h2>
                <p className={`${s.typewriter} mt-1 text-sm text-slate`}>
                  {place.name}, {district.name}
                </p>
              </div>
            </div>

            <p className={`${s.typewriter} mt-4 text-[15px] leading-relaxed`}>{t.dossier}</p>

            <p className={`${s.typewriter} mt-3 text-sm ${surveillanceAt(mission.district, weekIndex) >= 20 ? 'text-crimson' : 'text-slate'}`}>
              Überwachung in {district.name}: {surveillanceLabel(surveillanceAt(mission.district, weekIndex))}.
              {districtTrust > 0 && ` Die Nachbarn vertrauen euch hier, das senkt die Gefahr um ${districtTrust * TRUST_RISK_RELIEF} Punkte.`}
            </p>

            <hr className={`${s.rule} my-4`} />

            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="font-type text-xs font-bold tracking-[0.15em] text-slate uppercase">Nötige Fähigkeiten</dt>
                <dd className="mt-1.5 space-y-1 font-type text-sm">
                  <p>
                    <strong>{STAT_LABELS[t.primary]}</strong> zählt voll
                  </p>
                  <p>
                    <strong>{STAT_LABELS[t.secondary]}</strong> zählt halb
                  </p>
                </dd>
              </div>
              <div>
                <dt className="font-type text-xs font-bold tracking-[0.15em] text-slate uppercase">Benötigt</dt>
                <dd className="mt-1.5 space-y-1 font-type text-sm">
                  {costLines.length === 0 && <p>Nur Mut und Geduld.</p>}
                  {costLines.map((c) => (
                    <p key={c.text} className={`flex items-center gap-1.5 ${c.ok ? '' : 'font-bold text-crimson'}`}>
                      {c.ok ? <Check size={15} aria-hidden /> : <X size={15} aria-hidden />}
                      {c.text}
                      <span className="sr-only">{c.ok ? '(vorhanden)' : '(fehlt)'}</span>
                    </p>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="font-type text-xs font-bold tracking-[0.15em] text-slate uppercase">Bei Erfolg</dt>
                <dd className="mt-1.5 font-type text-sm">{t.rewardLabel}</dd>
              </div>
              <div>
                <dt className="font-type text-xs font-bold tracking-[0.15em] text-slate uppercase">Fahndungsdruck</dt>
                <dd className="mt-1.5 font-type text-sm">
                  +{t.heat} für jeden Teilnehmer, bei Entdeckung {DETECTION_HEAT} mehr
                </dd>
              </div>
            </dl>
          </div>

          {/* Rechte Seite: Einteilung */}
          <div className="flex flex-col gap-4">
            <fieldset>
              <legend className="font-type text-sm font-bold tracking-[0.15em] uppercase">
                Gefährten einteilen ({selected.length} von höchstens {MAX_TEAM})
              </legend>
              <ul className="mt-2 grid gap-2">
                {members.map((m) => {
                  const other = busyElsewhere.get(m.id)
                  const available = isAvailable(m) && !other
                  const checked = selected.includes(m.id)
                  const full = !checked && selected.length >= MAX_TEAM
                  const st = statusOf(m)
                  const reason = m.status === 'verhaftet'
                    ? 'Verhaftet'
                    : m.status === 'ausgewandert'
                      ? 'Ausgewandert'
                    : m.status === 'verletzt'
                      ? 'Verletzt, erholt sich'
                      : other
                        ? `Eingeteilt: ${other}`
                        : null
                  return (
                    <li key={m.id}>
                      <button
                        role="checkbox"
                        aria-checked={checked}
                        disabled={!available || full}
                        onClick={() => toggle(m.id)}
                        className={`${s.chip} flex w-full items-center gap-3 p-2`}
                      >
                        <Avatar config={m.avatar} size={48} title="" crossed={m.status === 'verhaftet'} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate font-serif text-base font-bold">{m.name}</span>
                            {isWanted(m) && m.status === 'bereit' && (
                              <span className="font-type text-[11px] font-bold tracking-wider text-crimson uppercase">{st.label}</span>
                            )}
                          </span>
                          {reason ? (
                            <span className="block truncate font-type text-xs text-slate">{reason}</span>
                          ) : (
                            <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-type text-xs">
                              <span className="inline-flex items-center gap-1.5">
                                {STAT_LABELS[t.primary]} <StatPips value={m.stats[t.primary]} label={STAT_LABELS[t.primary]} highlight />
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                {STAT_LABELS[t.secondary]} <StatPips value={m.stats[t.secondary]} label={STAT_LABELS[t.secondary]} />
                              </span>
                              <span className={isWanted(m) ? 'font-bold text-crimson' : 'text-slate'}>Fahndung {m.heat}</span>
                            </span>
                          )}
                        </span>
                        <span
                          className={`grid h-6 w-6 shrink-0 place-items-center border-2 ${checked ? 'border-ink bg-ink text-paper' : 'border-slate'}`}
                          aria-hidden
                        >
                          {checked && <Check size={16} />}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </fieldset>

            <div className="grid grid-cols-2 gap-3">
              <Gauge label="Erfolgsaussicht" value={chance} tone="hope" />
              <Gauge label="Gefahr" value={risk} tone="danger" />
            </div>
            <p className="font-type text-xs leading-relaxed text-ink/80">
              Mehr Gefährten erhöhen die Aussicht auf Erfolg. Aber je mehr Menschen unterwegs sind, desto leichter
              werden sie gesehen. Wer Heimlichkeit besitzt, senkt die Gefahr für alle.
            </p>

            {wanted.length > 0 && (
              <p className="flex gap-2 border-2 border-crimson bg-paper p-3 font-type text-sm text-crimson" role="alert">
                <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden />
                <span>
                  {joinNames(wanted.map(firstName))} {wanted.length === 1 ? 'wird' : 'werden'} gesucht. Wird der Auftrag
                  entdeckt, droht die Verhaftung.
                </span>
              </p>
            )}
            {!affordable && (
              <p className="border-2 border-crimson bg-paper p-3 font-type text-sm text-crimson" role="alert">
                Dafür fehlen der Gruppe noch die Mittel. Sammelt zuerst Geld oder beschafft Material.
              </p>
            )}
            {error && (
              <p className="border-2 border-crimson bg-paper p-3 font-type text-sm text-crimson" role="alert">
                {error}
              </p>
            )}

            <div className="mt-auto flex flex-wrap gap-3">
              <StampButton variant="ink" onClick={confirm} disabled={selected.length === 0 || !affordable} data-autofocus>
                {alreadyPlanned ? 'Einteilung ändern' : 'Einteilen'}
              </StampButton>
              {alreadyPlanned && (
                <StampButton variant="blood" onClick={withdraw}>
                  Auftrag zurückziehen
                </StampButton>
              )}
              <StampButton onClick={onClose}>Schließen</StampButton>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
