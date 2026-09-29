import { useEffect, useRef, useState } from 'react'

export interface RollData {
  /** Erfolgsaussicht in Prozent, gelungen bei Wurf kleiner oder gleich */
  chance: number
  roll: number
  /** Gefahr, entdeckt zu werden, in Prozent */
  risk: number
  detectRoll: number
}

const SWEEP_MS = 1500

/**
 * Der Wurf der Nacht, sichtbar gemacht: Ein Zeiger fährt über die Skala und bleibt beim
 * Würfelergebnis stehen. Erst der Erfolg, dann die Frage, ob jemand etwas gesehen hat.
 */
export function RollPanel({ data, instant, onDone }: { data: RollData; instant: boolean; onDone: () => void }) {
  const [stage, setStage] = useState<0 | 1 | 2>(instant ? 2 : 0)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    if (instant) setStage(2)
  }, [instant])
  useEffect(() => {
    if (stage === 2) done.current()
  }, [stage])

  const success = data.roll <= data.chance
  const seen = data.detectRoll <= data.risk
  return (
    <div className="pointer-events-none absolute inset-x-[3%] top-[5%] z-10 space-y-2 bg-black/70 px-3 py-2 font-type text-paper sm:px-4 sm:py-3">
      <Gauge
        label="Gelingt es?"
        zone={data.chance}
        zoneClass="bg-paper/35"
        value={data.roll}
        running={stage === 0}
        finished={stage >= 1}
        result={success ? 'geschafft' : 'daneben'}
        good={success}
        onStop={() => setStage((s) => (s === 0 ? 1 : s))}
      />
      {stage >= 1 && (
        <Gauge
          label="Sieht euch jemand?"
          zone={data.risk}
          zoneClass="bg-crimson/80"
          value={data.detectRoll}
          running={stage === 1}
          finished={stage >= 2}
          result={seen ? 'gesehen!' : 'unbemerkt'}
          good={!seen}
          onStop={() => setStage(2)}
        />
      )}
    </div>
  )
}

function Gauge({
  label,
  zone,
  zoneClass,
  value,
  running,
  finished,
  result,
  good,
  onStop,
}: {
  label: string
  zone: number
  zoneClass: string
  value: number
  running: boolean
  finished: boolean
  result: string
  good: boolean
  onStop: () => void
}) {
  const [pos, setPos] = useState(finished ? value : 0)
  const stop = useRef(onStop)
  stop.current = onStop

  useEffect(() => {
    if (!running) {
      if (finished) setPos(value)
      return
    }
    // Zweimal über die ganze Skala, dann langsamer werdend bis zum Ergebnis
    const distance = 200 + value
    const start = performance.now()
    let frame = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / SWEEP_MS)
      const eased = 1 - Math.pow(1 - t, 3)
      const d = eased * distance
      const cycle = d % 200
      const p = t >= 1 ? value : cycle <= 100 ? cycle : 200 - cycle
      setPos(p)
      if (t < 1) frame = requestAnimationFrame(step)
      else stop.current()
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [running, finished, value])

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-[13px] sm:text-sm">
        <span>
          {label} <span className="text-fog">{zone} %</span>
        </span>
        {finished && <span className={`font-bold ${good ? 'text-paper' : 'text-ember'}`}>{result}</span>}
      </div>
      <div className="relative mt-1 h-2.5 border border-paper/60 sm:h-3.5">
        <div className={`absolute inset-y-0 left-0 ${zoneClass}`} style={{ width: `${zone}%` }} />
        <div
          className={`absolute -inset-y-1 w-1 -translate-x-1/2 ${finished ? (good ? 'bg-paper' : 'bg-ember') : 'bg-paper'}`}
          style={{ left: `${Math.max(0, Math.min(100, pos))}%` }}
        />
      </div>
    </div>
  )
}
