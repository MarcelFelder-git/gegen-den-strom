import { STAT_MAX } from '../../game/data/professions'

interface StatPipsProps {
  value: number
  label: string
  /** helle Darstellung auf dunklem Grund */
  onDark?: boolean
  highlight?: boolean
}

/** Werte als gestempelte Kästchen, wie auf einer Karteikarte */
export function StatPips({ value, label, onDark, highlight }: StatPipsProps) {
  const on = onDark ? 'bg-paper border-paper' : highlight ? 'bg-crimson border-crimson' : 'bg-ink border-ink'
  const off = onDark ? 'border-fog/60' : 'border-slate/50'
  return (
    <span className="inline-flex gap-[3px]" role="img" aria-label={`${label}: ${value} von ${STAT_MAX}`}>
      {Array.from({ length: STAT_MAX }, (_, i) => (
        <span key={i} className={`h-2.5 w-2.5 border ${i < value ? on : off}`} />
      ))}
    </span>
  )
}
