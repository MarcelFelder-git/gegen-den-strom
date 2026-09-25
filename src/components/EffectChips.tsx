import { describeItem } from '../game/logic'
import type { DistrictKey, Effects, ItemKey } from '../game/types'
import { STAT_LABELS } from '../game/data/professions'
import { getDistrict } from '../game/data/districts'

interface Chip {
  text: string
  good: boolean
}

const signed = (n: number) => (n > 0 ? `+${n}` : `−${Math.abs(n)}`)

export function effectChips(e: Effects): Chip[] {
  const chips: Chip[] = []
  if (e.moral) chips.push({ text: `Moral ${signed(e.moral)}`, good: e.moral > 0 })
  if (e.supporters) chips.push({ text: `Unterstützer ${signed(e.supporters)}`, good: e.supporters > 0 })
  if (e.kasse) chips.push({ text: `Kasse ${signed(e.kasse)} RM`, good: e.kasse > 0 })
  for (const [k, v] of Object.entries(e.items ?? {}) as [ItemKey, number][]) {
    if (v) chips.push({ text: `${v > 0 ? '+' : '−'} ${describeItem(k, Math.abs(v))}`, good: v > 0 })
  }
  if (e.heatAll) chips.push({ text: `Fahndungsdruck aller ${signed(e.heatAll)}`, good: e.heatAll < 0 })
  if (e.heatLeader) chips.push({ text: `Dein Fahndungsdruck ${signed(e.heatLeader)}`, good: e.heatLeader < 0 })
  if (e.self?.heat) chips.push({ text: `Fahndungsdruck ${signed(e.self.heat)}`, good: e.self.heat < 0 })
  if (e.self?.stat && e.self.statDelta)
    chips.push({ text: `${STAT_LABELS[e.self.stat]} ${signed(e.self.statDelta)}`, good: e.self.statDelta > 0 })
  if (e.self?.emigrates) chips.push({ text: 'Verlässt die Gruppe', good: false })
  for (const [k, v] of Object.entries(e.trust ?? {}) as [DistrictKey, number][]) {
    if (v) chips.push({ text: `Vertrauen in ${getDistrict(k).name} ${signed(v)}`, good: v > 0 })
  }
  if (e.flags?.includes('druckerei')) chips.push({ text: 'Eigene Druckerei', good: true })
  return chips
}

/** Auswirkungen als kleine Etiketten, wie mit dem Stempelkasten gesetzt */
export function EffectChips({ effects, onDark = false }: { effects: Effects; onDark?: boolean }) {
  const chips = effectChips(effects)
  if (chips.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Auswirkungen">
      {chips.map((c) => (
        <li
          key={c.text}
          className={`border px-2 py-0.5 font-type text-sm font-bold ${
            c.good
              ? onDark
                ? 'border-paper text-paper'
                : 'border-ink text-ink'
              : onDark
                ? 'border-ember text-ember'
                : 'border-crimson text-crimson'
          }`}
        >
          {c.text}
        </li>
      ))}
    </ul>
  )
}
