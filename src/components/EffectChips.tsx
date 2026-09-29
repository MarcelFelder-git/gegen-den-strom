import s from '../styles/period.module.css'
import { describeItem } from '../game/logic'
import type { DistrictKey, Effects, ItemKey } from '../game/types'
import { STAT_LABELS } from '../game/data/professions'
import { getDistrict } from '../game/data/districts'

interface Chip {
  text: string
  good: boolean
  /** Richtung der Zahl: steigt sie oder sinkt sie */
  dir?: 'up' | 'down'
}

const signed = (n: number) => (n > 0 ? `+${n}` : `−${Math.abs(n)}`)
const dirOf = (n: number): 'up' | 'down' => (n > 0 ? 'up' : 'down')

export function effectChips(e: Effects, selfName?: string): Chip[] {
  const chips: Chip[] = []
  if (e.helped) chips.push({ text: `${e.helped} ${e.helped === 1 ? 'Mensch' : 'Menschen'} geholfen`, good: e.helped > 0, dir: dirOf(e.helped) })
  if (e.moral) chips.push({ text: `Moral ${signed(e.moral)}`, good: e.moral > 0, dir: dirOf(e.moral) })
  if (e.supporters) chips.push({ text: `Unterstützer ${signed(e.supporters)}`, good: e.supporters > 0, dir: dirOf(e.supporters) })
  if (e.kasse) chips.push({ text: `Kasse ${signed(e.kasse)} RM`, good: e.kasse > 0, dir: dirOf(e.kasse) })
  for (const [k, v] of Object.entries(e.items ?? {}) as [ItemKey, number][]) {
    if (v) chips.push({ text: `${v > 0 ? '+' : '−'} ${describeItem(k, Math.abs(v))}`, good: v > 0, dir: dirOf(v) })
  }
  if (e.heatAll) chips.push({ text: `Fahndungsdruck aller ${signed(e.heatAll)}`, good: e.heatAll < 0, dir: dirOf(e.heatAll) })
  if (e.heatLeader) chips.push({ text: `Dein Fahndungsdruck ${signed(e.heatLeader)}`, good: e.heatLeader < 0, dir: dirOf(e.heatLeader) })
  if (e.self?.heat)
    chips.push({ text: `${selfName ? `${selfName}: ` : ''}Fahndungsdruck ${signed(e.self.heat)}`, good: e.self.heat < 0, dir: dirOf(e.self.heat) })
  if (e.self?.stat && e.self.statDelta)
    chips.push({
      text: `${selfName ? `${selfName}: ` : ''}${STAT_LABELS[e.self.stat]} ${signed(e.self.statDelta)}`,
      good: e.self.statDelta > 0,
      dir: dirOf(e.self.statDelta),
    })
  if (e.self?.emigrates) chips.push({ text: `${selfName ?? 'Die Person'} verlässt die Gruppe`, good: false })
  for (const [k, v] of Object.entries(e.trust ?? {}) as [DistrictKey, number][]) {
    if (v) chips.push({ text: `Vertrauen in ${getDistrict(k).name} ${signed(v)}`, good: v > 0, dir: dirOf(v) })
  }
  if (e.flags?.includes('druckerei')) chips.push({ text: 'Eigene Druckerei', good: true })
  return chips
}

/**
 * Auswirkungen als Etiketten, wie mit dem Stempelkasten gesetzt. Der Pfeil zeigt, ob eine Zahl steigt oder sinkt.
 * Ob das gut oder schlecht ist, zeigen Farbe und Rahmen: gute Folgen durchgezogen in der Farbe der Solidarität,
 * schlechte gestrichelt in Rot. Sie schlagen nacheinander auf, damit man jede Folge einzeln wahrnimmt.
 */
export function EffectChips({ effects, onDark = false, selfName }: { effects: Effects; onDark?: boolean; selfName?: string }) {
  const chips = effectChips(effects, selfName)
  if (chips.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Auswirkungen">
      {chips.map((c, i) => (
        <li
          key={c.text}
          style={{ animationDelay: `${150 + i * 140}ms` }}
          className={`${s.stampIn} flex items-center gap-1 border-2 px-2.5 py-1 font-type text-[15px] font-bold ${c.good ? '' : 'border-dashed'} ${
            c.good
              ? onDark
                ? 'border-group-light bg-group/40 text-group-light'
                : 'border-group bg-group/10 text-group'
              : onDark
                ? 'border-ember bg-crimson/25 text-ember'
                : 'border-crimson bg-crimson/10 text-crimson'
          }`}
        >
          {c.dir && <span aria-hidden>{c.dir === 'up' ? '▲' : '▼'}</span>}
          {c.text}
          <span className="sr-only">{c.good ? ' (gut)' : ' (schlecht)'}</span>
        </li>
      ))}
    </ul>
  )
}
