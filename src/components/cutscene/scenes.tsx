import type { CSSProperties, ReactNode } from 'react'
import c from './cinema.module.css'
import type { IllustrationKind } from '../../game/data/weeks'
import type { MissionType } from '../../game/types'

/*
 * Szenen der Wochenschau, gezeichnet als Scherenschnitt.
 * Regel: Ein Element mit Animation bekommt nie zusätzlich ein transform-Attribut,
 * sonst überschreibt die Animation die Position. Deshalb die vielen Hüllen.
 */

const SKY = '#0c0c0e'
const SIL = '#020203'
const HOUSE = '#1b1b1f'
const HOUSE2 = '#26262b'
const PAPER = '#e9e3d4'
const DIM = '#8f8a7e'
const BLOOD = '#8b0000'
const FIRE = '#e0735f'
const LAMP = '#f0c96a'

const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` })

function Frame({ children, sky = SKY }: { children: ReactNode; sky?: string }) {
  return (
    <svg viewBox="0 0 640 300" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="cs-fire">
          <stop offset="0" stopColor={FIRE} stopOpacity="0.75" />
          <stop offset="0.55" stopColor={FIRE} stopOpacity="0.25" />
          <stop offset="1" stopColor={FIRE} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cs-lamp">
          <stop offset="0" stopColor={LAMP} stopOpacity="0.35" />
          <stop offset="1" stopColor={LAMP} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="300" fill={sky} />
      {children}
    </svg>
  )
}

type Hat = 'fedora' | 'cap' | 'none' | 'hair'

/** Eine Person im Scherenschnitt, Füße bei (x, y) */
export function Figure({
  x,
  y,
  s = 1,
  hat = 'fedora',
  walking = false,
  band = false,
  fill = SIL,
  torch = false,
  bag = false,
}: {
  x: number
  y: number
  s?: number
  hat?: Hat
  walking?: boolean
  band?: boolean
  fill?: string
  torch?: boolean
  bag?: boolean
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className={walking ? c.bob : undefined}>
        <rect className={walking ? c.legA : undefined} x="-6" y="-30" width="5" height="30" fill={fill} />
        <rect className={walking ? c.legB : undefined} x="1" y="-30" width="5" height="30" fill={fill} />
        <path d="M-11 -30 L-9 -62 Q0 -69 9 -62 L11 -30 Z" fill={fill} />
        <circle cy="-73" r="7" fill={fill} />
        {hat === 'fedora' && (
          <>
            <rect x="-11" y="-80" width="22" height="3" fill={fill} />
            <rect x="-6" y="-87" width="12" height="8" fill={fill} />
          </>
        )}
        {hat === 'cap' && <path d="M-8 -78 Q0 -86 8 -78 L12 -76 L-8 -76 Z" fill={fill} />}
        {hat === 'hair' && <path d="M-8 -72 Q-9 -84 0 -83 Q9 -84 8 -72 L9 -66 L-9 -66 Z" fill={fill} />}
        {band && <rect x="6" y="-56" width="6" height="6" fill={PAPER} />}
        {bag && <rect x="9" y="-40" width="12" height="12" fill={fill} />}
        {torch && (
          <>
            <rect x="10" y="-80" width="3" height="40" fill={fill} transform="rotate(12 11 -60)" />
            <g transform="translate(18 -82)">
              <circle r="16" fill="url(#cs-fire)" className={c.glow} />
              <path className={c.flame} d="M0 0 C-6 -4 -5 -10 -2 -14 C-1 -9 1 -11 1 -16 C5 -10 7 -5 0 0 Z" fill={LAMP} />
            </g>
          </>
        )}
      </g>
    </g>
  )
}

function Ground({ y = 262, fill = SIL }: { y?: number; fill?: string }) {
  return <rect x="0" y={y} width="640" height={300 - y} fill={fill} />
}

function Lamp({ x, y = 262, h = 110 }: { x: number; y?: number; h?: number }) {
  return (
    <g>
      <rect x={x - 2} y={y - h} width="4" height={h} fill={SIL} />
      <ellipse cx={x} cy={y - h + 40} rx="46" ry="70" fill="url(#cs-lamp)" />
      <rect x={x - 8} y={y - h - 12} width="16" height="14" fill={SIL} />
      <rect x={x - 5} y={y - h - 9} width="10" height="8" fill={LAMP} className={c.glow} />
    </g>
  )
}

function Skyline({ lit = true, dark = false }: { lit?: boolean; dark?: boolean }) {
  const blocks: [number, number, number][] = [
    [0, 120, 90], [90, 150, 70], [160, 110, 100], [260, 160, 60], [320, 100, 120], [440, 140, 80], [520, 115, 120],
  ]
  const windows: [number, number][] = [
    [20, 150], [50, 180], [110, 170], [120, 200], [190, 140], [220, 190], [280, 190], [350, 130], [380, 170], [410, 210],
    [460, 170], [490, 200], [540, 150], [580, 190], [610, 140],
  ]
  return (
    <g>
      {blocks.map(([x, y, w]) => (
        <rect key={x} x={x} y={y} width={w} height={300 - y} fill={HOUSE} />
      ))}
      {lit &&
        windows.map(([x, y], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width="10"
            height="13"
            fill={LAMP}
            opacity="0.75"
            className={dark ? c.lightOff : undefined}
            style={dark ? delay(0.3 + i * 0.16) : undefined}
          />
        ))}
    </g>
  )
}

/* ---------- Kalender ---------- */

export interface CalendarDate {
  day: number
  month: string
  weekday: string
  year?: number
}

function CalendarPage({ date, coverYear = 1933 }: { date: CalendarDate | null; coverYear?: number }) {
  return (
    <g>
      <rect x="-80" y="-95" width="160" height="190" fill={PAPER} />
      <rect x="-80" y="-95" width="160" height="30" fill={BLOOD} />
      {date ? (
        <>
          <text y="-74" textAnchor="middle" fontFamily="Courier Prime, monospace" fontSize="14" fontWeight="700" fill={PAPER} letterSpacing="3">
            {date.month.toUpperCase()} {date.year ?? 1933}
          </text>
          <text y="45" textAnchor="middle" fontFamily="Old Standard TT, Georgia, serif" fontSize="104" fontWeight="700" fill={SIL}>
            {date.day}
          </text>
          <text y="78" textAnchor="middle" fontFamily="Old Standard TT, Georgia, serif" fontStyle="italic" fontSize="20" fill={SIL}>
            {date.weekday}
          </text>
        </>
      ) : (
        <>
          <text y="-74" textAnchor="middle" fontFamily="Courier Prime, monospace" fontSize="14" fontWeight="700" fill={PAPER} letterSpacing="3">
            ABREISSKALENDER
          </text>
          <text y="30" textAnchor="middle" fontFamily="UnifrakturMaguntia, serif" fontSize="62" fill={SIL}>
            {coverYear}
          </text>
        </>
      )}
    </g>
  )
}

export function CalendarScene({ from, to, reduced }: { from: CalendarDate | null; to: CalendarDate; reduced: boolean }) {
  return (
    <Frame sky="#141416">
      <rect x="0" y="0" width="640" height="300" fill="#1b1a1d" />
      <g transform="translate(320 152)">
        <rect x="-92" y="-112" width="184" height="222" fill="#2c2a2e" />
        <rect x="-30" y="-118" width="60" height="14" fill="#555" />
        <CalendarPage date={to} />
        {!reduced && (
          <g className={c.tearOff}>
            <CalendarPage date={from} coverYear={to.year ?? 1933} />
          </g>
        )}
      </g>
    </Frame>
  )
}

/* ---------- Ereignisse der Woche ---------- */

export function EventScene({ kind }: { kind: IllustrationKind }) {
  switch (kind) {
    case 'tor':
      return (
        <Frame>
          <ellipse cx="320" cy="240" rx="360" ry="70" fill="url(#cs-fire)" className={c.glow} />
          <g fill={HOUSE2}>
            <rect x="200" y="92" width="240" height="22" />
            <rect x="188" y="114" width="264" height="8" />
            {[206, 244, 282, 344, 382, 420].map((x) => (
              <rect key={x} x={x} y="122" width="14" height="140" />
            ))}
            <path d="M296 92 L300 70 L320 62 L340 70 L344 92 Z" />
          </g>
          <Ground />
          {[0, 1].map((row) => (
            <g key={row} className={c.march} style={delay(row * -5.5)}>
              {Array.from({ length: 13 }, (_, i) => (
                <Figure key={i} x={i * 28} y={272 + row * 12} s={0.72 + row * 0.1} hat="cap" walking torch />
              ))}
            </g>
          ))}
        </Frame>
      )
    case 'armbinde':
      return (
        <Frame>
          <Skyline />
          <Lamp x={120} />
          <Ground />
          <Figure x={560} y={268} s={0.9} hat="fedora" fill="#0a0a0c" />
          <g className={c.march} style={delay(-3)}>
            {[0, 1, 2, 3].map((i) => (
              <Figure key={i} x={i * 40} y={270} s={1.05} hat="cap" walking band />
            ))}
          </g>
        </Frame>
      )
    case 'reichstag':
      return (
        <Frame>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={300 + i * 12} cy="80" r="26" fill="#3a3336" className={c.smoke} style={delay(i * 0.9)} />
          ))}
          <ellipse cx="320" cy="110" rx="190" ry="120" fill="url(#cs-fire)" className={c.glow} />
          <g fill={HOUSE2}>
            <rect x="120" y="150" width="400" height="112" />
            <rect x="120" y="120" width="70" height="142" />
            <rect x="450" y="120" width="70" height="142" />
            <rect x="250" y="136" width="140" height="20" />
          </g>
          <path d="M262 136 Q320 70 378 136 Z" fill={SIL} stroke={FIRE} strokeWidth="2" />
          {[140, 165, 470, 495, 270, 300, 330, 360].map((x, i) => (
            <rect key={x} x={x} y={i < 4 ? 140 : 180} width="12" height={i < 4 ? 16 : 40} fill={FIRE} className={c.glow} style={delay(i * 0.2)} />
          ))}
          {[
            [290, 124, 1.6],
            [320, 112, 2.3],
            [350, 124, 1.8],
            [305, 132, 1.2],
            [338, 132, 1.3],
          ].map(([x, y, sc], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${sc})`}>
              <path className={c.flame} style={delay(i * 0.1)} d="M0 0 C-12 -6 -11 -18 -5 -28 C-3 -18 2 -22 2 -34 C10 -22 14 -10 0 0 Z" fill={FIRE} />
            </g>
          ))}
          <Ground />
          {[60, 90, 540, 575, 600].map((x) => (
            <Figure key={x} x={x} y={268} s={0.8} hat={x % 2 ? 'fedora' : 'cap'} />
          ))}
        </Frame>
      )
    case 'urne':
      return (
        <Frame sky="#161618">
          <Lamp x={320} y={80} h={0} />
          <rect x="250" y="160" width="140" height="102" fill={HOUSE2} />
          <rect x="238" y="150" width="164" height="14" fill={HOUSE2} />
          <rect x="296" y="153" width="48" height="5" fill={SIL} />
          {[0, 1, 2].map((i) => (
            <g key={i} className={c.drop} style={delay(i * 0.47)}>
              <rect x="304" y="100" width="32" height="44" fill={PAPER} />
              <rect x="310" y="108" width="20" height="2" fill={SIL} />
              <rect x="310" y="114" width="16" height="2" fill={SIL} />
            </g>
          ))}
          <Ground />
          {[60, 100, 140, 470, 510, 560].map((x) => (
            <Figure key={x} x={x} y={270} s={0.95} hat={x > 400 ? 'hair' : 'fedora'} />
          ))}
        </Frame>
      )
    case 'gesetz':
      return (
        <Frame sky="#141416">
          {Array.from({ length: 3 }, (_, row) =>
            Array.from({ length: 16 }, (_, i) => (
              <Figure key={`${row}-${i}`} x={20 + i * 40 + row * 10} y={120 + row * 26} s={0.45} hat="cap" fill="#1f1f23" />
            )),
          )}
          <rect x="170" y="140" width="300" height="150" fill={PAPER} />
          {[160, 176, 192, 208].map((y) => (
            <rect key={y} x="196" y={y} width="130" height="4" fill="#b5ae9d" />
          ))}
          <text x="410" y="228" textAnchor="middle" fontFamily="Old Standard TT, Georgia, serif" fontSize="80" fontWeight="700" fill={SIL}>
            §
          </text>
          <g transform="translate(300 246)">
            <g className={c.slam} style={delay(1.2)}>
              <rect x="-86" y="-20" width="172" height="40" fill="none" stroke={BLOOD} strokeWidth="4" />
              <text y="8" textAnchor="middle" fontFamily="Courier Prime, monospace" fontSize="22" fontWeight="700" fill={BLOOD} letterSpacing="3">
                ANGENOMMEN
              </text>
            </g>
          </g>
        </Frame>
      )
    case 'laden':
      return (
        <Frame>
          <rect x="140" y="70" width="360" height="192" fill={HOUSE} />
          <rect x="160" y="84" width="320" height="30" fill={HOUSE2} />
          <text x="320" y="106" textAnchor="middle" fontFamily="Old Standard TT, Georgia, serif" fontSize="20" fontWeight="700" fill={DIM} letterSpacing="4">
            KOLONIALWAREN
          </text>
          <rect x="170" y="130" width="170" height="110" fill={LAMP} opacity="0.2" />
          <rect x="370" y="130" width="70" height="132" fill={SIL} />
          <Ground />
          <Figure x={455} y={268} s={1.1} hat="cap" band />
          <rect x="468" y="186" width="54" height="36" fill={PAPER} />
          {[194, 202, 210].map((y) => (
            <rect key={y} x="474" y={y} width="42" height="3" fill={SIL} />
          ))}
          <Figure x={250} y={250} s={0.9} hat="fedora" fill="#141416" />
          <g className={c.walkAcross} style={delay(0.5)}>
            <Figure x={0} y={276} s={0.95} hat="hair" walking />
          </g>
          <g className={c.walkAcross} style={delay(3.4)}>
            <Figure x={0} y={280} s={1} hat="fedora" walking />
          </g>
        </Frame>
      )
    case 'schule':
      return (
        <Frame sky="#18181b">
          <rect x="130" y="70" width="380" height="192" fill={HOUSE} />
          <path d="M120 72 L320 20 L520 72 Z" fill={HOUSE} />
          <circle cx="320" cy="52" r="12" fill={DIM} />
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3, 4, 5].map((col) => (
              <rect key={`${row}-${col}`} x={152 + col * 60} y={88 + row * 50} width="26" height="32" fill={LAMP} opacity="0.55" className={row === 1 && col === 2 ? c.lightOff : undefined} style={delay(0.8)} />
            )),
          )}
          <g transform="translate(300 214)">
            <rect x="0" y="0" width="40" height="48" fill={LAMP} opacity="0.35" className={c.doorLight} />
            <rect x="0" y="0" width="40" height="48" fill={SIL} className={c.door} />
          </g>
          <Ground />
          <g className={c.walkAcross} style={{ animationDuration: '9s', animationDelay: '1.6s' }}>
            <Figure x={-180} y={274} s={0.95} hat="hair" walking bag />
          </g>
        </Frame>
      )
    case 'amt':
      return (
        <Frame>
          <rect x="80" y="60" width="480" height="202" fill={HOUSE} />
          <rect x="66" y="48" width="508" height="16" fill={HOUSE2} />
          {Array.from({ length: 3 }, (_, row) =>
            Array.from({ length: 10 }, (_, col) => (
              <rect
                key={`${row}-${col}`}
                x={102 + col * 45}
                y={80 + row * 56}
                width="20"
                height="34"
                fill={LAMP}
                opacity="0.8"
                className={c.lightOn}
                style={delay(0.3 + ((row * 10 + col) * 7) % 30 * 0.11)}
              />
            )),
          )}
          <Ground />
          <g className={c.walkToDoor} style={{ animationDuration: '3.2s' }}>
            <g transform="translate(300 272)">
              <rect x="-50" y="-26" width="100" height="20" rx="4" fill={SIL} />
              <rect x="-30" y="-40" width="54" height="16" rx="4" fill={SIL} />
              <circle cx="-30" cy="-4" r="8" fill={SIL} />
              <circle cx="32" cy="-4" r="8" fill={SIL} />
              <rect x="44" y="-22" width="6" height="5" fill={LAMP} />
            </g>
          </g>
        </Frame>
      )
    case 'fabrik':
      return (
        <Frame sky="#161618">
          {[0, 1, 2].map((i) => (
            <circle key={i} cx="150" cy="60" r="20" fill="#3a3a3f" className={c.smoke} style={delay(i * 1.4)} />
          ))}
          {[0, 1, 2].map((i) => (
            <circle key={i} cx="470" cy="50" r="18" fill="#3a3a3f" className={c.smoke} style={delay(0.7 + i * 1.4)} />
          ))}
          <rect x="138" y="60" width="24" height="120" fill={HOUSE2} />
          <rect x="460" y="50" width="22" height="130" fill={HOUSE2} />
          <path d="M40 262 L40 180 L100 150 L100 180 L160 150 L160 180 L220 150 L220 180 L280 150 L280 180 L340 150 L340 180 L400 150 L400 180 L460 150 L460 180 L600 180 L600 262 Z" fill={HOUSE} />
          <text x="480" y="216" textAnchor="middle" fontFamily="Courier Prime, monospace" fontSize="15" fontWeight="700" fill={DIM} letterSpacing="2">
            GEWERKSCHAFTSHAUS
          </text>
          <Ground />
          <g className={c.march} style={{ animationDuration: '9s' }}>
            {Array.from({ length: 8 }, (_, i) => (
              <Figure key={i} x={i * 32} y={276} s={0.9} hat="cap" walking band />
            ))}
          </g>
        </Frame>
      )
    case 'buecher':
      return (
        <Frame>
          <ellipse cx="320" cy="210" rx="240" ry="120" fill="url(#cs-fire)" className={c.glow} />
          {Array.from({ length: 5 }, (_, i) => (
            <circle key={i} cx={300 + i * 10} cy="150" r="4" fill={LAMP} className={c.smoke} style={delay(i * 0.6)} />
          ))}
          {[
            [290, 236, 2],
            [320, 232, 3],
            [352, 238, 2.2],
            [305, 240, 1.4],
            [336, 240, 1.5],
          ].map(([x, y, sc], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${sc})`}>
              <path className={c.flame} style={delay(i * 0.08)} d="M0 0 C-12 -6 -11 -18 -5 -28 C-3 -18 2 -22 2 -34 C10 -22 14 -10 0 0 Z" fill={FIRE} />
            </g>
          ))}
          <g fill={PAPER} stroke={SIL}>
            <rect x="270" y="236" width="50" height="10" transform="rotate(-8 295 241)" />
            <rect x="320" y="238" width="54" height="10" transform="rotate(6 347 243)" />
            <rect x="290" y="246" width="70" height="10" />
          </g>
          <g transform="translate(320 226)">
            <g className={c.throwBook}>
              <rect x="-10" y="-7" width="20" height="14" fill={PAPER} stroke={SIL} />
            </g>
          </g>
          <Ground />
          {[40, 70, 100, 130, 510, 545, 580, 610].map((x) => (
            <Figure key={x} x={x} y={272} s={0.9} hat={x < 300 ? 'cap' : 'fedora'} />
          ))}
          <g stroke={DIM} strokeWidth="1" opacity="0.5">
            {Array.from({ length: 40 }, (_, i) => (
              <line
                key={i}
                x1={(i * 53) % 660}
                y1={(i * 37) % 260}
                x2={(i * 53) % 660 - 4}
                y2={((i * 37) % 260) + 16}
                className={c.rain}
                style={delay(-(i % 7) * 0.1)}
              />
            ))}
          </g>
        </Frame>
      )
    case 'zaun':
      return (
        <Frame>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={70 + i * 170} y="170" width="130" height="92" fill={HOUSE2} />
              {[0, 1, 2, 3].map((j) => (
                <rect key={j} x={82 + i * 170 + j * 30} y="190" width="14" height="12" fill={LAMP} opacity="0.35" />
              ))}
            </g>
          ))}
          <g fill={SIL}>
            <rect x="560" y="80" width="8" height="182" />
            <rect x="600" y="80" width="8" height="182" />
            <rect x="548" y="60" width="72" height="26" />
          </g>
          <g className={c.sweep}>
            <path d="M584 70 L200 300 L360 300 Z" fill="url(#cs-lamp)" />
          </g>
          <Ground />
          <g stroke={DIM} strokeWidth="2">
            {Array.from({ length: 14 }, (_, i) => (
              <line key={i} x1={i * 48} y1="200" x2={i * 48} y2="262" />
            ))}
          </g>
          <g stroke={DIM} strokeWidth="1.2" fill="none">
            {[210, 228, 246].map((y) => (
              <path key={y} d={`M0 ${y} ${Array.from({ length: 40 }, (_, i) => `L${i * 17 + 8} ${y + (i % 2 ? 4 : -4)}`).join(' ')}`} />
            ))}
          </g>
        </Frame>
      )
    case 'stadion':
      return (
        <Frame>
          <g stroke={PAPER} strokeWidth="1" opacity="0.18">
            {[-40, -20, 0, 20, 40].map((a) => (
              <line key={a} x1="320" y1="300" x2={320 + a * 8} y2="0" />
            ))}
          </g>
          <path d="M60 262 L60 150 Q320 90 580 150 L580 262 Z" fill={HOUSE2} />
          <path d="M100 262 L100 175 Q320 125 540 175 L540 262 Z" fill={HOUSE} />
          {Array.from({ length: 60 }, (_, i) => (
            <circle key={i} cx={110 + (i * 37) % 420} cy={180 + ((i * 13) % 60)} r="2" fill={DIM} />
          ))}
          {[120, 220, 420, 520].map((x, i) => (
            <g key={x}>
              <rect x={x} y="80" width="3" height="70" fill={DIM} />
              <rect x={x + 3} y="82" width="26" height="16" fill={BLOOD} className={c.flame} style={delay(i * 0.2)} />
            </g>
          ))}
          <g transform="translate(320 120)">
            <rect x="-10" y="0" width="20" height="28" fill={SIL} />
            <circle r="26" fill="url(#cs-fire)" className={c.glow} />
            <path className={c.flame} d="M0 0 C-12 -6 -11 -18 -5 -28 C-3 -18 2 -22 2 -34 C10 -22 14 -10 0 0 Z" fill={FIRE} />
          </g>
          <Ground />
        </Frame>
      )
    case 'kirche':
      return (
        <Frame>
          <rect x="200" y="140" width="240" height="122" fill={HOUSE} />
          <path d="M190 142 L320 80 L450 142 Z" fill={HOUSE} />
          <rect x="420" y="40" width="50" height="222" fill={HOUSE2} />
          <path d="M415 42 L445 0 L475 42 Z" fill={HOUSE2} />
          <rect x="443" y="4" width="4" height="18" fill={DIM} />
          <rect x="437" y="10" width="16" height="4" fill={DIM} />
          {[230, 270, 350, 390].map((x) => (
            <path key={x} d={`M${x} 220 L${x} 180 Q${x + 10} 166 ${x + 20} 180 L${x + 20} 220 Z`} fill={LAMP} opacity="0.4" />
          ))}
          <g transform="translate(300 200)">
            <rect x="0" y="0" width="40" height="62" fill={LAMP} opacity="0.5" className={c.doorLight} />
            <rect x="0" y="0" width="40" height="62" fill={SIL} className={c.door} />
          </g>
          <Ground />
          <g className={c.walkToDoor}>
            <Figure x={290} y={268} s={1} hat="fedora" walking />
            <Figure x={256} y={270} s={1} hat="fedora" walking />
          </g>
        </Frame>
      )
    case 'grenze':
      return (
        <Frame sky="#161618">
          <path d="M0 262 L240 190 L400 190 L640 262 Z" fill={HOUSE} />
          <rect x="190" y="200" width="16" height="62" fill={HOUSE2} />
          <g transform="translate(206 206)">
            <g className={c.barrier}>
              <rect x="0" y="-5" width="220" height="10" fill={PAPER} />
              {[20, 60, 100, 140, 180].map((x) => (
                <rect key={x} x={x} y="-5" width="20" height="10" fill={BLOOD} />
              ))}
            </g>
          </g>
          <Ground />
          <g className={c.march} style={{ animationDuration: '8s' }}>
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${i * 110} 0)`}>
                <rect x="0" y="222" width="80" height="34" fill={SIL} />
                <rect x="80" y="232" width="24" height="24" fill={SIL} />
                <circle cx="18" cy="260" r="8" fill={SIL} />
                <circle cx="88" cy="260" r="8" fill={SIL} />
              </g>
            ))}
          </g>
        </Frame>
      )
    case 'pass':
      return (
        <Frame sky="#0a0a0b">
          <ellipse cx="320" cy="150" rx="220" ry="130" fill="url(#cs-lamp)" className={c.glow} />
          <rect x="0" y="220" width="640" height="80" fill={HOUSE2} />
          <rect x="210" y="70" width="220" height="160" fill="#3a3336" />
          <rect x="220" y="80" width="200" height="140" fill={PAPER} />
          <text x="320" y="108" textAnchor="middle" fontFamily="Old Standard TT, Georgia, serif" fontWeight="700" fontSize="18" fill={SIL} letterSpacing="3">
            REISEPASS
          </text>
          <rect x="236" y="122" width="54" height="70" fill="#b5ae9d" />
          {[128, 144, 160, 176].map((y) => (
            <rect key={y} x="304" y={y} width="100" height="4" fill="#b5ae9d" />
          ))}
          <g transform="translate(380 180)">
            <g className={c.slam} style={delay(1)}>
              <text textAnchor="middle" y="18" fontFamily="Old Standard TT, Georgia, serif" fontWeight="700" fontSize="64" fill={BLOOD}>
                J
              </text>
            </g>
          </g>
        </Frame>
      )
    case 'synagoge':
      return (
        <Frame>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={300 + i * 10} cy="70" r="24" fill="#3a3336" className={c.smoke} style={delay(i * 0.9)} />
          ))}
          <ellipse cx="320" cy="140" rx="200" ry="130" fill="url(#cs-fire)" className={c.glow} />
          <rect x="190" y="130" width="260" height="132" fill={HOUSE2} />
          <path d="M270 132 Q320 60 370 132 Z" fill={HOUSE} stroke={FIRE} strokeWidth="2" />
          <rect x="316" y="48" width="8" height="26" fill={HOUSE} />
          {[210, 250, 370, 410].map((x, i) => (
            <path
              key={x}
              d={`M${x} 200 L${x} 160 Q${x + 10} 146 ${x + 20} 160 L${x + 20} 200 Z`}
              fill={FIRE}
              className={c.glow}
              style={delay(i * 0.3)}
            />
          ))}
          <rect x="300" y="200" width="40" height="62" fill={SIL} />
          <Ground />
          {Array.from({ length: 10 }, (_, i) => (
            <g key={i} transform={`translate(${160 + i * 34} 150)`}>
              <g className={c.fall} style={delay(i * 0.35)}>
                <path d="M0 0 L6 2 L2 7 Z" fill={DIM} />
              </g>
            </g>
          ))}
          {[80, 110, 540, 575].map((x) => (
            <Figure key={x} x={x} y={270} s={0.85} hat={x < 300 ? 'cap' : 'fedora'} />
          ))}
        </Frame>
      )
    case 'zug':
      return (
        <Frame sky="#161618">
          <rect x="0" y="40" width="640" height="16" fill={HOUSE2} />
          {[60, 200, 340, 480].map((x) => (
            <rect key={x} x={x} y="56" width="10" height="150" fill={HOUSE2} />
          ))}
          <g className={c.walkAcross} style={{ animationDuration: '12s', animationDelay: '1.5s' }}>
            <g transform="translate(-420 0)">
              {[0, 1, 2].map((i) => (
                <g key={i} transform={`translate(${i * 150} 0)`}>
                  <rect x="0" y="150" width="140" height="80" fill={SIL} />
                  {[0, 1, 2, 3].map((j) => (
                    <rect key={j} x={12 + j * 32} y="164" width="22" height="20" fill={LAMP} opacity="0.5" />
                  ))}
                </g>
              ))}
              <rect x="450" y="160" width="110" height="70" fill={SIL} />
              <rect x="520" y="120" width="30" height="42" fill={SIL} />
              {[0, 1, 2].map((i) => (
                <circle key={i} cx="535" cy="110" r="16" fill="#3a3a3f" className={c.smoke} style={delay(i * 0.8)} />
              ))}
            </g>
          </g>
          <rect x="0" y="236" width="640" height="10" fill={HOUSE2} />
          <Ground y={246} />
          {[80, 120, 160, 440, 480, 520].map((x, i) => (
            <g key={x} className={c.bob} style={delay(i * 0.2)}>
              <Figure x={x} y={284} s={0.9} hat={i % 2 ? 'hair' : 'fedora'} />
            </g>
          ))}
        </Frame>
      )
  }
}

/* ---------- Wetter ---------- */

export type Weather = 'schnee' | 'regen' | 'nebel' | 'klar'

/** Wetter je Woche. Am 10. Mai 1933 regnete es in Berlin tatsächlich in Strömen. */
export const WEEK_WEATHER: Weather[] = [
  'schnee', 'schnee', 'nebel', 'regen', 'nebel', 'regen', 'klar', 'klar', 'klar', 'regen',
  'regen', 'klar', 'klar', 'klar', 'regen', 'klar', 'nebel', 'schnee',
]

function WeatherLayer({ kind }: { kind: Weather }) {
  switch (kind) {
    case 'schnee':
      return (
        <g pointerEvents="none">
          <rect x="0" y="286" width="640" height="14" fill="#cfcac0" opacity="0.5" />
          {Array.from({ length: 46 }, (_, i) => (
            <circle
              key={i}
              cx={(i * 71) % 650}
              cy={(i * 29) % 90}
              r={1.2 + (i % 3) * 0.6}
              fill={PAPER}
              opacity="0.8"
              className={c.snow}
              style={delay(-(i % 9) * 0.7)}
            />
          ))}
        </g>
      )
    case 'regen':
      return (
        <g stroke={DIM} strokeWidth="1" opacity="0.45" pointerEvents="none">
          {Array.from({ length: 48 }, (_, i) => (
            <line
              key={i}
              x1={(i * 53) % 660}
              y1={(i * 37) % 260}
              x2={((i * 53) % 660) - 4}
              y2={((i * 37) % 260) + 16}
              className={c.rain}
              style={delay(-(i % 7) * 0.1)}
            />
          ))}
        </g>
      )
    case 'nebel':
      return (
        <g pointerEvents="none">
          {[150, 205, 250].map((y, i) => (
            <ellipse key={y} cx="320" cy={y} rx="420" ry="26" fill="#8f8a7e" opacity="0.13" className={c.fogDrift} style={delay(-i * 4)} />
          ))}
        </g>
      )
    case 'klar':
      return (
        <g pointerEvents="none">
          {Array.from({ length: 22 }, (_, i) => (
            <circle key={i} cx={(i * 97) % 640} cy={(i * 23) % 70 + 6} r="1" fill={PAPER} className={c.twinkle} style={delay((i % 5) * 0.4)} />
          ))}
        </g>
      )
  }
}

/* ---------- Nacht und Morgen ---------- */

export function NightfallScene({ weekIndex = 0, weather = 'klar' }: { weekIndex?: number; weather?: Weather }) {
  // Der Mond nimmt von Woche zu Woche eine andere Gestalt an
  const shift = ((weekIndex * 9) % 36) - 18
  return (
    <Frame>
      {weather === 'klar' && <WeatherLayer kind="klar" />}
      <g className={c.moonRise}>
        <circle cx="520" cy="70" r="26" fill={PAPER} opacity={weather === 'nebel' ? 0.45 : 0.85} />
        <circle cx={520 + shift} cy="63" r="24" fill={SKY} />
      </g>
      <Skyline dark />
      <Ground y={288} />
      {weather !== 'klar' && <WeatherLayer kind={weather} />}
    </Frame>
  )
}

export function MorningScene({ weather = 'klar', troubled = false }: { weather?: Weather; troubled?: boolean }) {
  return (
    <Frame sky={weather === 'regen' || weather === 'nebel' ? '#2e2e33' : '#3a3a3f'}>
      <rect x="0" y="180" width="640" height="120" fill="#4a4a50" opacity="0.4" />
      <Skyline lit={false} />
      <rect x="350" y="130" width="10" height="13" fill={LAMP} opacity="0.6" />
      <Ground y={288} />
      {troubled && (
        <g>
          <Figure x={470} y={288} s={1.1} hat="fedora" fill="#0a0a0c" />
          <rect x="478" y="222" width="3" height="10" fill="#0a0a0c" />
        </g>
      )}
      {weather !== 'klar' && <WeatherLayer kind={weather} />}
    </Frame>
  )
}

/* ---------- Verhaftung ---------- */

/** Der Wagen der Polizei, ein geschlossener Kastenwagen mit Scheinwerfern */
function PoliceVan({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={c.glow}>
        <path d="M-4 -26 L-170 -2 L-170 26 L-4 -12 Z" fill={LAMP} opacity="0.3" />
      </g>
      <rect x="0" y="-78" width="118" height="62" fill="#3a3a42" stroke={DIM} strokeWidth="1.5" />
      <rect x="-26" y="-56" width="30" height="40" fill="#3a3a42" stroke={DIM} strokeWidth="1.5" />
      <rect x="-20" y="-50" width="18" height="14" fill={LAMP} opacity="0.3" />
      <rect x="8" y="-60" width="70" height="4" fill={DIM} opacity="0.5" />
      <rect x="92" y="-72" width="20" height="46" fill="#24242a" stroke={DIM} strokeWidth="1" className={c.vanDoor} />
      <circle cx="-14" cy="-24" r="4" fill={LAMP} />
      <circle cx="10" cy="-12" r="12" fill={SIL} />
      <circle cx="92" cy="-12" r="12" fill={SIL} />
    </g>
  )
}

/**
 * Jemand aus der Gruppe wird abgeführt: auf der Straße nach einem entdeckten Auftrag
 * oder früh am Morgen an der eigenen Haustür, wenn der Fahndungsdruck zu hoch war.
 */
export function ArrestScene({ team = ['m'], atHome = false }: { team?: Gender[]; atHome?: boolean }) {
  return (
    <Frame sky={atHome ? '#24242a' : '#1a1a20'}>
      {atHome ? (
        <g>
          <rect x="120" y="60" width="260" height="228" fill={HOUSE} />
          <rect x="150" y="90" width="34" height="44" fill={HOUSE2} />
          <rect x="310" y="90" width="34" height="44" fill={LAMP} opacity="0.5" className={c.lightOn} style={delay(0.4)} />
          <rect x="228" y="190" width="44" height="98" fill="#0a0a0c" />
          <rect x="228" y="190" width="44" height="98" fill={LAMP} opacity="0" className={c.doorLight} />
        </g>
      ) : (
        <>
          <Skyline />
          <circle cx="250" cy="150" r="130" fill="url(#cs-lamp)" />
          <Lamp x={330} y={288} h={150} />
        </>
      )}
      <Ground y={288} fill="#0d0d10" />
      <PoliceVan x={480} y={288} />
      {/* Die Festgenommenen werden zwischen zwei Männern in Mänteln zum Wagen geführt */}
      <g className={c.ledAway}>
        <Team team={team} x={atHome ? 262 : 250} y={288} spacing={30} fill="#6a6860" />
        <g className={c.officersIn}>
          <Figure x={(atHome ? 262 : 250) + 34} y={288} s={1.08} hat="fedora" fill="#0a0a0c" />
          <Figure x={(atHome ? 262 : 250) - team.length * 30 - 6} y={288} s={1.08} hat="fedora" fill="#0a0a0c" />
        </g>
      </g>
      <rect width="640" height="300" fill={BLOOD} opacity="0.16" className={c.alarm} />
    </Frame>
  )
}

/** Zwei Unterstützer kommen am Abend zur Tür, um weiterzumachen, als niemand mehr frei ist */
export function ArrivalScene({ team = ['m', 'w'] }: { team?: Gender[] }) {
  return (
    <Frame sky="#22222a">
      <Skyline />
      {/* Haus und Tür links, damit der Stempel unten rechts niemanden verdeckt */}
      <rect x="40" y="80" width="250" height="208" fill={HOUSE} />
      <rect x="70" y="110" width="34" height="44" fill={LAMP} opacity="0.55" />
      <rect x="210" y="110" width="34" height="44" fill={HOUSE2} />
      <rect x="170" y="190" width="44" height="98" fill="#0a0a0c" />
      <rect x="170" y="190" width="44" height="98" fill={LAMP} opacity="0" className={c.doorLight} />
      <Lamp x={330} y={288} h={140} />
      <Ground y={288} fill="#0d0d10" />
      <g className={c.walkFromRight}>
        <Team team={team} x={258} y={288} spacing={-30} walking fill="#6a6860" />
      </g>
    </Frame>
  )
}

/* ---------- Einsätze in der Nacht ---------- */

export type SceneOutcome = 'gelungen' | 'gescheitert' | 'entdeckt'

type Gender = 'm' | 'w'

/** Die eingeteilten Gefährten als Silhouetten, Frauen mit Frisur statt Hut */
function Team({ team, x, y, spacing = 34, s = 1, walking = false, bag = false, fill }: {
  team: Gender[]
  x: number
  y: number
  spacing?: number
  s?: number
  walking?: boolean
  bag?: boolean
  fill?: string
}) {
  return (
    <g>
      {team.map((g, i) => (
        <Figure
          key={i}
          x={x - i * spacing}
          y={y + (i % 2) * 4}
          s={s * (i === 0 ? 1 : 0.94)}
          hat={g === 'w' ? 'hair' : i % 2 ? 'cap' : 'fedora'}
          walking={walking}
          bag={bag && i === 0}
          fill={fill}
        />
      ))}
    </g>
  )
}

function OutcomeLayer({ outcome }: { outcome: SceneOutcome }) {
  if (outcome === 'entdeckt') {
    return (
      <g pointerEvents="none">
        <defs>
          <linearGradient id="cs-beam" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={PAPER} stopOpacity="0.55" />
            <stop offset="1" stopColor={PAPER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className={c.sweep}>
          <path d="M620 20 L240 300 L420 300 Z" fill="url(#cs-beam)" />
        </g>
        <rect width="640" height="300" fill={BLOOD} opacity="0.2" className={c.alarm} />
      </g>
    )
  }
  if (outcome === 'gescheitert') {
    return (
      <g pointerEvents="none">
        <rect x="560" y="40" width="22" height="30" fill={LAMP} className={c.lightOn} style={delay(1.6)} />
        <rect width="640" height="300" fill="#000" opacity="0.4" className={c.dimLater} />
      </g>
    )
  }
  return null
}

const SLOGANS = ['FREIHEIT!', 'NIEDER MIT HITLER!', 'WIR SIND NOCH DA!']
const SIGNS: Partial<Record<MissionType, string>> = {
  papier: 'PAPIER UND SCHREIBWAREN',
  presse: 'BUCHDRUCKEREI',
  nachrichten: 'ZEITUNGEN AUS DEM AUSLAND',
  besorgung: 'BÄCKEREI',
}

type Base = 'tuer' | 'laden' | 'presse' | 'strasse' | 'wand' | 'haus' | 'ausweis' | 'handwagen' | 'treffen'

const BASE: Record<MissionType, Base> = {
  spenden: 'tuer',
  rotehilfe: 'tuer',
  papier: 'laden',
  presse: 'laden',
  nachrichten: 'laden',
  druck: 'presse',
  keller: 'presse',
  zeitung: 'presse',
  verteilen: 'strasse',
  parolen: 'wand',
  unterschlupf: 'haus',
  warnung: 'haus',
  ausweise: 'ausweis',
  transport: 'handwagen',
  sportverein: 'treffen',
  ausreise: 'haus',
  pakete: 'tuer',
  reporter: 'strasse',
  besorgung: 'laden',
}

export function MissionScene({
  type,
  team = ['m'],
  weather = 'klar',
  outcome = 'gelungen',
  seed = 0,
}: {
  type: MissionType
  team?: Gender[]
  weather?: Weather
  outcome?: SceneOutcome
  seed?: number
}) {
  return (
    <Frame sky={type === 'druck' || type === 'keller' || type === 'zeitung' || type === 'ausweise' ? '#0a0a0b' : SKY}>
      <MissionBase base={BASE[type]} type={type} team={team} seed={seed} />
      {BASE[type] !== 'presse' && BASE[type] !== 'ausweis' && <WeatherLayer kind={weather} />}
      <OutcomeLayer outcome={outcome} />
    </Frame>
  )
}

function MissionBase({ base, type, team, seed }: { base: Base; type: MissionType; team: Gender[]; seed: number }) {
  const lampX = [470, 150, 540][seed % 3]
  switch (base) {
    case 'tuer':
      return (
        <g>
          <rect x="200" y="40" width="240" height="222" fill={HOUSE} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={222 + i * 70} y="70" width="22" height="30" fill={LAMP} opacity={(seed + i) % 2 ? 0.55 : 0.08} />
          ))}
          <rect x="300" y="150" width="50" height="112" fill={SIL} />
          <rect x="304" y="154" width="42" height="104" fill={LAMP} opacity="0.12" />
          <Lamp x={lampX === 150 ? 150 : 470} />
          <Ground />
          <Team team={team} x={280} y={264} spacing={30} />
          {type === 'spenden' ? (
            <g transform="translate(470 250)">
              <rect x="-16" y="-24" width="32" height="30" fill={HOUSE2} stroke={DIM} />
              {[0, 1, 2].map((i) => (
                <g key={i} className={c.drop} style={delay(i * 0.45)}>
                  <circle cx="0" cy="-40" r="6" fill={LAMP} />
                </g>
              ))}
            </g>
          ) : (
            <g transform="translate(350 246)">
              <rect x="0" y="-18" width="30" height="20" fill={DIM} />
              <rect x="4" y="-26" width="8" height="10" fill={PAPER} />
              <rect x="14" y="-24" width="10" height="8" fill="#b5ae9d" />
            </g>
          )}
        </g>
      )
    case 'laden':
      return (
        <g>
          <rect x="120" y="80" width="400" height="182" fill={HOUSE} />
          <rect x="150" y="130" width="140" height="100" fill={LAMP} opacity="0.22" />
          <text x="320" y="112" textAnchor="middle" fontFamily="Old Standard TT, Georgia, serif" fontSize="17" fontWeight="700" fill={DIM} letterSpacing="3">
            {SIGNS[type] ?? 'PAPIER UND SCHREIBWAREN'}
          </text>
          <rect x="360" y="140" width="70" height="122" fill={SIL} />
          <Ground />
          <g className={c.walkAcross} style={{ animationDuration: '5.5s' }}>
            <Team team={team} x={0} y={276} spacing={36} walking bag={type === 'papier'} />
          </g>
        </g>
      )
    case 'presse':
      return (
        <g>
          <ellipse cx="320" cy="150" rx="220" ry="130" fill="url(#cs-lamp)" className={c.glow} />
          <rect x="60" y="30" width="80" height="40" fill={HOUSE2} />
          <rect x="66" y="36" width="68" height="28" fill="#3a3a3f" />
          <g fill={HOUSE2}>
            <rect x="240" y="120" width="160" height="16" />
            <rect x="250" y="136" width="14" height="126" />
            <rect x="376" y="136" width="14" height="126" />
            <rect x="262" y="190" width="116" height="26" />
          </g>
          <g transform="translate(400 128)">
            <g className={c.pump}>
              <rect x="0" y="-4" width="96" height="8" fill={DIM} />
              <circle cx="96" cy="0" r="8" fill={DIM} />
            </g>
          </g>
          {type !== 'keller' && (
            <g transform="translate(250 200)">
              {[0, 1, 2].map((i) => (
                <g key={i} className={c.sheet} style={delay(i * 0.33)}>
                  <rect x="0" y="-12" width={type === 'zeitung' ? 34 : 44} height={type === 'zeitung' ? 44 : 30} fill={PAPER} />
                </g>
              ))}
            </g>
          )}
          {type === 'keller' && (
            <g fill={DIM}>
              <rect x="70" y="36" width="60" height="28" className={c.lightOff} style={delay(1.2)} />
            </g>
          )}
          <Ground />
          <Team team={team.slice(0, 1)} x={200} y={266} />
          {team.slice(1).map((g, i) => (
            <Figure key={i} x={470 + i * 44} y={266} s={0.98} hat={g === 'w' ? 'hair' : 'cap'} />
          ))}
        </g>
      )
    case 'strasse':
      return (
        <g>
          <Skyline />
          <Lamp x={lampX} />
          <Ground />
          {Array.from({ length: 12 }, (_, i) => (
            <g key={i} transform={`translate(${40 + i * 50} 0)`}>
              <g className={c.fall} style={delay(i * 0.33)}>
                <rect x="0" y="0" width="16" height="11" fill={PAPER} />
              </g>
            </g>
          ))}
          <g className={c.walkAcross} style={{ animationDuration: '6s' }}>
            <Team team={team} x={0} y={276} spacing={38} walking />
          </g>
        </g>
      )
    case 'wand': {
      const slogan = SLOGANS[seed % SLOGANS.length]
      return (
        <g>
          <rect x="0" y="40" width="640" height="222" fill={HOUSE} />
          <g stroke="#101013" strokeWidth="1.5">
            {Array.from({ length: 11 }, (_, i) => (
              <line key={i} x1="0" y1={60 + i * 20} x2="640" y2={60 + i * 20} />
            ))}
          </g>
          <g className={c.reveal}>
            <text
              x="320"
              y="170"
              textAnchor="middle"
              fontFamily="Old Standard TT, Georgia, serif"
              fontSize="60"
              fontWeight="700"
              fill={PAPER}
              letterSpacing="4"
              textLength={slogan.length > 10 ? 560 : undefined}
              lengthAdjust="spacingAndGlyphs"
            >
              {slogan}
            </text>
          </g>
          <Ground />
          <g transform="translate(150 0)">
            <g className={c.brush}>
              <Figure x={0} y={276} s={1.1} hat={team[0] === 'w' ? 'hair' : 'cap'} />
              <rect x="10" y="150" width="4" height="60" fill={SIL} transform="rotate(30 12 180)" />
            </g>
          </g>
          {team.slice(1).map((g, i) => (
            <Figure key={i} x={560 - i * 40} y={276} s={1} hat={g === 'w' ? 'hair' : 'fedora'} />
          ))}
        </g>
      )
    }
    case 'haus':
      return (
        <g>
          <rect x="220" y="50" width="240" height="212" fill={HOUSE} />
          <rect x="380" y="90" width="30" height="40" fill={LAMP} opacity="0.7" className={c.lightOff} style={delay(4.4)} />
          <g transform="translate(300 172)">
            <rect x="0" y="0" width="46" height="90" fill={LAMP} opacity="0.55" className={c.doorLight} />
            <rect x="0" y="0" width="46" height="90" fill={SIL} className={c.door} />
          </g>
          <Ground />
          <g className={c.vanish}>
            <g className={c.walkToDoor}>
              <Team team={team} x={320} y={266} spacing={34} walking />
            </g>
          </g>
        </g>
      )
    case 'ausweis':
      return (
        <g>
          <ellipse cx="320" cy="150" rx="200" ry="120" fill="url(#cs-lamp)" className={c.glow} />
          <rect x="0" y="210" width="640" height="90" fill={HOUSE2} />
          <rect x="220" y="110" width="200" height="130" fill={PAPER} />
          <rect x="236" y="126" width="60" height="76" fill="#b5ae9d" />
          {[134, 150, 166, 182].map((y) => (
            <rect key={y} x="312" y={y} width="92" height="4" fill="#b5ae9d" />
          ))}
          <g transform="translate(350 205)">
            <g className={c.slam} style={delay(0.9)}>
              <circle r="26" fill="none" stroke={BLOOD} strokeWidth="4" />
              <circle r="18" fill="none" stroke={BLOOD} strokeWidth="1.5" />
            </g>
          </g>
        </g>
      )
    case 'handwagen':
      return (
        <g>
          <Skyline />
          <Lamp x={lampX} />
          <Ground />
          <g className={c.walkAcross} style={{ animationDuration: '8s' }}>
            <g transform="translate(40 0)">
              <path d="M0 250 L70 250 L64 224 L6 224 Z" fill={HOUSE2} />
              <path d="M6 224 Q35 200 64 224 Z" fill="#050506" />
              <rect x="70" y="236" width="40" height="4" fill={HOUSE2} />
              <g transform="translate(18 258)">
                <g className={c.spin}>
                  <circle r="11" fill="none" stroke={DIM} strokeWidth="3" />
                  <line x1="-11" y1="0" x2="11" y2="0" stroke={DIM} strokeWidth="2" />
                  <line x1="0" y1="-11" x2="0" y2="11" stroke={DIM} strokeWidth="2" />
                </g>
              </g>
              <g transform="translate(54 258)">
                <g className={c.spin}>
                  <circle r="11" fill="none" stroke={DIM} strokeWidth="3" />
                  <line x1="-11" y1="0" x2="11" y2="0" stroke={DIM} strokeWidth="2" />
                  <line x1="0" y1="-11" x2="0" y2="11" stroke={DIM} strokeWidth="2" />
                </g>
              </g>
            </g>
            <Team team={team} x={130} y={276} spacing={30} walking />
          </g>
        </g>
      )
    case 'treffen':
      return (
        <g>
          <path d="M140 262 L140 170 L220 130 L300 170 L300 262 Z" fill={HOUSE} />
          <rect x="200" y="200" width="40" height="30" fill={LAMP} opacity="0.5" />
          <g stroke={HOUSE2} strokeWidth="4">
            {Array.from({ length: 10 }, (_, i) => (
              <line key={i} x1={320 + i * 30} y1="262" x2={320 + i * 30} y2="226" />
            ))}
            <line x1="310" y1="236" x2="610" y2="236" />
          </g>
          <ellipse cx="420" cy="240" rx="120" ry="60" fill="url(#cs-lamp)" className={c.glow} />
          <rect x="414" y="226" width="12" height="14" fill={LAMP} />
          <Ground />
          {[360, 392, 448, 480].map((x, i) => (
            <Figure key={x} x={x} y={272} s={0.78} hat={i % 2 ? 'cap' : 'hair'} />
          ))}
          <g className={c.walkToDoor}>
            <Team team={team} x={560} y={272} spacing={30} s={0.9} walking />
          </g>
        </g>
      )
  }
}

/* ---------- Die Gründung der Gruppe ---------- */

/** Eine Küche im Hinterhaus: hier entsteht die Widerstandsgruppe */
export function FoundingScene({ variant = 'tisch' }: { variant?: 'tisch' | 'regeln' }) {
  return (
    <Frame sky="#141214">
      <rect x="0" y="0" width="640" height="300" fill="#1d1a1b" />
      <g>
        <rect x="440" y="40" width="120" height="110" fill="#0b0b0d" stroke={HOUSE2} strokeWidth="6" />
        <line x1="500" y1="40" x2="500" y2="150" stroke={HOUSE2} strokeWidth="4" />
        <line x1="440" y1="95" x2="560" y2="95" stroke={HOUSE2} strokeWidth="4" />
        <ellipse cx="500" cy="120" rx="70" ry="40" fill="url(#cs-fire)" className={c.glow} />
      </g>
      <line x1="300" y1="0" x2="300" y2="70" stroke={SIL} strokeWidth="2" />
      <path d="M280 70 L320 70 L310 86 L290 86 Z" fill={SIL} />
      <ellipse cx="300" cy="170" rx="210" ry="120" fill="url(#cs-lamp)" className={c.glow} />
      {[
        [170, 216, 'cap'],
        [240, 212, 'hair'],
        [360, 212, 'fedora'],
        [430, 216, 'hair'],
      ].map(([x, y, hat], i) => (
        <g key={i} className={c.bob} style={delay(i * 0.3)}>
          <Figure x={x as number} y={y as number} s={1.05} hat={hat as 'cap' | 'hair' | 'fedora'} />
        </g>
      ))}
      <rect x="130" y="196" width="340" height="16" fill={HOUSE2} />
      <rect x="150" y="212" width="12" height="78" fill={HOUSE2} />
      <rect x="440" y="212" width="12" height="78" fill={HOUSE2} />
      {variant === 'tisch' ? (
        <g>
          <rect x="270" y="186" width="60" height="10" fill={PAPER} />
          {[200, 400].map((x, i) => (
            <g key={x}>
              <rect x={x} y="180" width="14" height="16" fill={DIM} />
              <circle cx={x + 7} cy="170" r="5" fill="#3a3a3f" className={c.smoke} style={delay(i * 1.2)} />
            </g>
          ))}
        </g>
      ) : (
        <g transform="translate(300 192)">
          <rect x="-16" y="-4" width="32" height="6" fill={DIM} />
          <rect x="-8" y="-16" width="16" height="12" fill={PAPER} />
          <path className={c.flame} d="M0 -14 C-6 -18 -5 -24 -2 -30 C-1 -25 1 -27 1 -32 C5 -26 7 -20 0 -14 Z" fill={FIRE} />
        </g>
      )}
    </Frame>
  )
}
