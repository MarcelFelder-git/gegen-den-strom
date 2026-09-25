interface GaugeProps {
  label: string
  value: number
  tone: 'hope' | 'danger'
  hint?: string
}

/** Große Prozentanzeige mit Balken, wie auf einem Messinstrument aus Papier */
export function Gauge({ label, value, tone, hint }: GaugeProps) {
  const bar = tone === 'hope' ? 'bg-ink' : 'bg-crimson'
  const text = tone === 'hope' ? 'text-ink' : 'text-crimson'
  return (
    <div className="border-2 border-ink bg-paper/70 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-type text-xs font-bold tracking-[0.15em] uppercase">{label}</span>
        <span className={`font-type text-3xl font-bold tabular-nums ${text}`}>
          {value}
          <span className="text-lg">%</span>
        </span>
      </div>
      <div
        className="mt-2 h-3 border border-ink bg-paper"
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`h-full ${bar} transition-[width] duration-300`} style={{ width: `${value}%` }} />
      </div>
      {hint && <p className="mt-2 font-type text-xs text-slate">{hint}</p>}
    </div>
  )
}
