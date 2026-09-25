import { useId } from 'react'
import type { IllustrationKind } from '../game/data/weeks'

const INK = '#1c1c1e'
const PAPER = '#efe9da'

/** Zeitungsbilder im Stil eines groben Holzschnitts */
export function NewsIllustration({ kind, caption }: { kind: IllustrationKind; caption: string }) {
  const uid = useId().replace(/:/g, '')
  const hatch = `hatch-${uid}`
  const night = kind === 'tor' || kind === 'reichstag' || kind === 'buecher' || kind === 'synagoge'
  return (
    <figure className="m-0">
      <svg viewBox="0 0 300 180" className="block w-full border-2 border-ink" role="img" aria-label={caption}>
        <defs>
          <pattern id={hatch} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke={night ? PAPER : INK} strokeWidth="0.8" opacity="0.35" />
          </pattern>
        </defs>
        <rect width="300" height="180" fill={night ? INK : PAPER} />
        <rect width="300" height="180" fill={`url(#${hatch})`} />
        <Scene kind={kind} />
      </svg>
      <figcaption className="mt-1 font-serif text-xs italic">{caption}</figcaption>
    </figure>
  )
}

function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M0 0 C-9 -3 -9 -11 -5 -17 C-5 -12 -3 -11 -2 -13 C-3 -19 0 -24 1 -29 C3 -22 7 -19 6 -12 C8 -14 9 -17 9 -19 C12 -12 11 -3 0 0 Z"
        fill={PAPER}
      />
      <path d="M0 -2 C-4 -4 -4 -8 -2 -11 C-1 -8 1 -9 1 -12 C4 -8 5 -4 0 -2 Z" fill={INK} />
    </g>
  )
}

function Scene({ kind }: { kind: IllustrationKind }) {
  switch (kind) {
    case 'tor':
      return (
        <g>
          {/* Strahlen */}
          <g stroke={PAPER} strokeWidth="1" opacity="0.25">
            {Array.from({ length: 14 }, (_, i) => (
              <line key={i} x1="150" y1="60" x2={-40 + i * 28} y2="0" />
            ))}
          </g>
          <g fill={PAPER}>
            <rect x="70" y="52" width="160" height="16" />
            <rect x="60" y="68" width="180" height="6" />
            {[76, 100, 124, 164, 188, 212].map((x) => (
              <rect key={x} x={x} y="74" width="10" height="64" />
            ))}
            <rect x="60" y="138" width="180" height="6" />
            <path d="M136 52 L138 36 L150 30 L164 36 L166 52 Z" />
          </g>
          <rect x="0" y="144" width="300" height="36" fill={INK} />
          {Array.from({ length: 16 }, (_, i) => {
            const x = 8 + i * 18.5
            return (
              <g key={i}>
                <rect x={x} y="136" width="7" height="30" fill={INK} stroke={PAPER} strokeWidth="0.6" />
                <circle cx={x + 3.5} cy="132" r="4" fill={INK} stroke={PAPER} strokeWidth="0.6" />
                <line x1={x + 8} y1="150" x2={x + 12} y2="126" stroke={PAPER} strokeWidth="1.2" />
                <Flame x={x + 12} y={126} s={0.7} />
              </g>
            )
          })}
        </g>
      )
    case 'armbinde':
      return (
        <g>
          <path d="M-10 60 L200 40 Q240 36 260 60 L300 90 L300 180 L220 180 L190 130 L-10 150 Z" fill={INK} />
          <path d="M120 49 L150 45 L156 138 L126 142 Z" fill={PAPER} stroke={INK} strokeWidth="1.5" />
          <text
            x="138"
            y="95"
            transform="rotate(-86 138 95)"
            textAnchor="middle"
            fontFamily="Old Standard TT, Georgia, serif"
            fontSize="13"
            fontWeight="700"
            fill={INK}
          >
            Hilfspolizei
          </text>
          <g stroke={PAPER} strokeWidth="1" opacity="0.5">
            <path d="M20 70 L100 60 M30 90 L100 82 M200 70 L250 66" />
          </g>
          <circle cx="232" cy="92" r="4" fill={PAPER} />
          <circle cx="248" cy="120" r="4" fill={PAPER} />
        </g>
      )
    case 'reichstag':
      return (
        <g>
          <g fill={PAPER} opacity="0.2">
            <path d="M120 70 Q90 20 140 0 L200 0 Q170 30 190 70 Z" />
          </g>
          <g fill={INK} stroke={PAPER} strokeWidth="1">
            <rect x="30" y="100" width="240" height="60" />
            <rect x="30" y="80" width="40" height="80" />
            <rect x="230" y="80" width="40" height="80" />
            <rect x="110" y="88" width="80" height="14" />
          </g>
          {[44, 56, 244, 256].map((x) => (
            <rect key={x} x={x} y="92" width="5" height="10" fill={PAPER} />
          ))}
          {[120, 134, 148, 162, 176].map((x) => (
            <rect key={x} x={x} y="104" width="6" height="40" fill={PAPER} opacity="0.85" />
          ))}
          <path d="M114 88 Q150 40 186 88 Z" fill={INK} stroke={PAPER} strokeWidth="2.5" />
          <g stroke={PAPER} strokeWidth="1.2">
            {[124, 136, 150, 164, 176].map((x) => (
              <line key={x} x1={x} y1="88" x2="150" y2="54" />
            ))}
            <path d="M120 76 Q150 66 180 76" fill="none" />
          </g>
          <Flame x={150} y={70} s={2.4} />
          <Flame x={132} y={82} s={1.4} />
          <Flame x={168} y={80} s={1.6} />
          <rect x="0" y="160" width="300" height="20" fill={INK} />
        </g>
      )
    case 'urne':
      return (
        <g>
          <rect x="95" y="80" width="110" height="80" fill={INK} />
          <rect x="85" y="72" width="130" height="12" fill={INK} />
          <rect x="130" y="75" width="40" height="5" fill={PAPER} />
          <text x="150" y="126" textAnchor="middle" fontFamily="Courier Prime, monospace" fontSize="12" fontWeight="700" fill={PAPER}>
            WAHLURNE
          </text>
          <path d="M142 14 L176 10 L180 60 L146 64 Z" fill={PAPER} stroke={INK} strokeWidth="2" />
          <g stroke={INK} strokeWidth="1">
            <line x1="150" y1="24" x2="170" y2="22" />
            <line x1="151" y1="32" x2="171" y2="30" />
            <line x1="152" y1="40" x2="172" y2="38" />
          </g>
          <path d="M200 50 Q230 30 260 44 L270 60 L220 70 Q205 64 200 50 Z" fill={INK} />
          <path d="M176 40 L205 46" stroke={INK} strokeWidth="6" strokeLinecap="round" />
          <rect x="0" y="160" width="300" height="20" fill={INK} />
        </g>
      )
    case 'gesetz':
      return (
        <g>
          <path d="M40 150 L150 132 L260 150 L260 60 L150 44 L40 60 Z" fill={PAPER} stroke={INK} strokeWidth="3" />
          <line x1="150" y1="44" x2="150" y2="132" stroke={INK} strokeWidth="3" />
          <g stroke={INK} strokeWidth="1.2">
            {[70, 80, 90, 100, 110].map((y) => (
              <line key={y} x1="60" y1={y} x2="135" y2={y - 8} />
            ))}
          </g>
          <text x="205" y="118" textAnchor="middle" fontFamily="Old Standard TT, Georgia, serif" fontSize="74" fontWeight="700" fill={INK}>
            §
          </text>
          <g transform="translate(90 108) rotate(-10)">
            <rect x="-44" y="-14" width="88" height="28" fill="none" stroke="#8b0000" strokeWidth="3" />
            <text textAnchor="middle" y="5" fontFamily="Courier Prime, monospace" fontSize="12" fontWeight="700" fill="#8b0000">
              ANGENOMMEN
            </text>
          </g>
          <rect x="0" y="160" width="300" height="20" fill={INK} />
        </g>
      )
    case 'laden':
      return (
        <g>
          <rect x="30" y="20" width="240" height="140" fill={INK} />
          <rect x="45" y="34" width="210" height="22" fill={PAPER} />
          <text x="150" y="50" textAnchor="middle" fontFamily="Old Standard TT, Georgia, serif" fontSize="14" fontWeight="700" fill={INK}>
            KOLONIALWAREN
          </text>
          <rect x="50" y="66" width="110" height="80" fill={PAPER} opacity="0.9" />
          <g fill={INK}>
            {[60, 78, 96, 114, 132].map((x) => (
              <rect key={x} x={x} y="120" width="10" height="16" />
            ))}
            {[62, 84, 106, 128].map((x) => (
              <circle key={x} cx={x + 4} cy="100" r="5" />
            ))}
          </g>
          <rect x="175" y="66" width="60" height="94" fill={PAPER} opacity="0.2" />
          {/* Posten mit Schild */}
          <g fill={INK} stroke={PAPER} strokeWidth="1.2">
            <circle cx="215" cy="92" r="9" />
            <path d="M204 104 L226 104 L230 160 L200 160 Z" />
          </g>
          <rect x="228" y="96" width="44" height="30" fill={PAPER} stroke={INK} strokeWidth="1.5" />
          <g stroke={INK} strokeWidth="2">
            <line x1="234" y1="104" x2="266" y2="104" />
            <line x1="234" y1="111" x2="262" y2="111" />
            <line x1="234" y1="118" x2="266" y2="118" />
          </g>
          <rect x="0" y="160" width="300" height="20" fill={INK} />
        </g>
      )
    case 'schule':
      return (
        <g>
          <rect x="40" y="40" width="220" height="120" fill={INK} />
          <path d="M30 42 L150 10 L270 42 Z" fill={INK} />
          <circle cx="150" cy="30" r="8" fill={PAPER} />
          <line x1="150" y1="30" x2="150" y2="25" stroke={INK} strokeWidth="1.5" />
          <line x1="150" y1="30" x2="154" y2="30" stroke={INK} strokeWidth="1.5" />
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3, 4, 5].map((col) => (
              <rect key={`${row}-${col}`} x={56 + col * 34} y={54 + row * 32} width="16" height="20" fill={PAPER} opacity={col === 2 && row === 1 ? 0.2 : 0.85} />
            )),
          )}
          <rect x="136" y="126" width="28" height="34" fill={PAPER} opacity="0.3" />
          <g fill={PAPER} stroke={INK} strokeWidth="1.2">
            <circle cx="236" cy="142" r="5" />
            <path d="M230 148 L242 148 L244 172 L228 172 Z" />
            <rect x="242" y="152" width="14" height="10" />
          </g>
          <rect x="0" y="170" width="300" height="10" fill={INK} />
        </g>
      )
    case 'amt':
      return (
        <g>
          <rect x="20" y="50" width="260" height="110" fill={INK} />
          <rect x="10" y="40" width="280" height="14" fill={INK} />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={34 + i * 28} y="64" width="10" height="80" fill={PAPER} opacity={i % 3 === 1 ? 0.9 : 0.25} />
          ))}
          <rect x="130" y="110" width="40" height="50" fill={PAPER} opacity="0.12" />
          <g fill={INK} stroke={PAPER} strokeWidth="1">
            <rect x="200" y="148" width="70" height="16" rx="3" />
            <rect x="214" y="138" width="36" height="12" rx="3" />
            <circle cx="214" cy="166" r="6" />
            <circle cx="256" cy="166" r="6" />
          </g>
          <rect x="0" y="170" width="300" height="10" fill={INK} />
        </g>
      )
    case 'fabrik':
      return (
        <g>
          <g fill={INK} opacity="0.35">
            <path d="M60 30 Q80 10 110 18 Q140 4 170 16 Q150 26 120 30 Q90 40 60 30 Z" />
            <path d="M200 26 Q220 8 250 14 Q270 20 240 30 Q220 34 200 26 Z" />
          </g>
          <rect x="60" y="30" width="16" height="80" fill={INK} />
          <rect x="210" y="26" width="14" height="84" fill={INK} />
          <path d="M20 160 L20 110 L60 90 L60 110 L100 90 L100 110 L140 90 L140 110 L180 90 L180 110 L220 90 L220 110 L260 90 L260 110 L280 110 L280 160 Z" fill={INK} />
          {[40, 80, 120, 160, 200, 240].map((x) => (
            <rect key={x} x={x} y="124" width="18" height="12" fill={PAPER} opacity="0.8" />
          ))}
          <rect x="0" y="160" width="300" height="20" fill={INK} />
        </g>
      )
    case 'buecher':
      return (
        <g>
          <g stroke={PAPER} strokeWidth="1" opacity="0.3">
            {Array.from({ length: 10 }, (_, i) => (
              <line key={i} x1="150" y1="120" x2={i * 34} y2="0" />
            ))}
          </g>
          <Flame x={150} y={118} s={5.6} />
          <Flame x={112} y={122} s={3} />
          <Flame x={190} y={122} s={3.2} />
          <g stroke={INK} strokeWidth="1.5">
            <rect x="80" y="118" width="60" height="14" fill={PAPER} transform="rotate(-8 110 125)" />
            <rect x="150" y="116" width="70" height="14" fill={PAPER} transform="rotate(6 185 123)" />
            <rect x="100" y="130" width="90" height="14" fill={PAPER} />
            <rect x="70" y="144" width="80" height="14" fill={PAPER} transform="rotate(3 110 151)" />
            <rect x="150" y="144" width="80" height="14" fill={PAPER} transform="rotate(-4 190 151)" />
          </g>
          {[40, 70, 230, 262].map((x, i) => (
            <circle key={x} cx={x} cy={40 + i * 12} r="1.6" fill={PAPER} />
          ))}
          <rect x="0" y="162" width="300" height="18" fill={PAPER} opacity="0.15" />
        </g>
      )
    case 'zaun':
      return (
        <g>
          {[0, 1].map((i) => (
            <rect key={i} x={30 + i * 110} y="90" width="90" height="60" fill={INK} />
          ))}
          <g fill={INK}>
            <rect x="240" y="40" width="6" height="120" />
            <rect x="268" y="40" width="6" height="120" />
            <rect x="232" y="28" width="50" height="18" />
          </g>
          <g stroke={INK} strokeWidth="1.5">
            {Array.from({ length: 11 }, (_, i) => (
              <line key={i} x1={i * 30} y1="110" x2={i * 30} y2="165" />
            ))}
          </g>
          <g stroke={INK} strokeWidth="1" fill="none">
            {[120, 135, 150].map((y) => (
              <path key={y} d={`M0 ${y} ${Array.from({ length: 30 }, (_, i) => `L${i * 11 + 5} ${y + (i % 2 ? 3 : -3)}`).join(' ')}`} />
            ))}
          </g>
          <rect x="0" y="165" width="300" height="15" fill={INK} />
        </g>
      )
    case 'stadion':
      return (
        <g>
          <path d="M20 160 L20 90 Q150 50 280 90 L280 160 Z" fill={INK} />
          <path d="M45 160 L45 105 Q150 75 255 105 L255 160 Z" fill={PAPER} opacity="0.25" />
          {Array.from({ length: 40 }, (_, i) => (
            <circle key={i} cx={50 + (i * 29) % 200} cy={110 + ((i * 7) % 40)} r="1.6" fill={INK} />
          ))}
          {[40, 100, 200, 260].map((x) => (
            <g key={x}>
              <rect x={x} y="30" width="2" height="50" fill={INK} />
              <rect x={x + 2} y="32" width="18" height="11" fill={INK} />
            </g>
          ))}
          <rect x="0" y="160" width="300" height="20" fill={INK} />
        </g>
      )
    case 'kirche':
      return (
        <g>
          <rect x="70" y="80" width="130" height="80" fill={INK} />
          <path d="M62 82 L135 40 L208 82 Z" fill={INK} />
          <rect x="190" y="20" width="34" height="140" fill={INK} />
          <path d="M186 22 L207 -2 L228 22 Z" fill={INK} />
          <rect x="205" y="4" width="3" height="14" fill={PAPER} />
          <rect x="200" y="9" width="13" height="3" fill={PAPER} />
          {[90, 120, 150].map((x) => (
            <path key={x} d={`M${x} 140 L${x} 110 Q${x + 7} 100 ${x + 14} 110 L${x + 14} 140 Z`} fill={PAPER} opacity="0.8" />
          ))}
          <rect x="0" y="160" width="300" height="20" fill={INK} />
        </g>
      )
    case 'grenze':
      return (
        <g>
          <path d="M0 160 L110 100 L190 100 L300 160 Z" fill={INK} opacity="0.25" />
          <rect x="80" y="100" width="10" height="60" fill={INK} />
          <g transform="rotate(-60 90 104)">
            <rect x="90" y="100" width="150" height="8" fill={PAPER} stroke={INK} strokeWidth="1.5" />
            {[100, 130, 160, 190, 220].map((x) => (
              <rect key={x} x={x} y="100" width="15" height="8" fill={INK} />
            ))}
          </g>
          <rect x="170" y="120" width="60" height="26" fill={INK} />
          <rect x="230" y="128" width="18" height="18" fill={INK} />
          <circle cx="184" cy="150" r="6" fill={INK} />
          <circle cx="236" cy="150" r="6" fill={INK} />
          <rect x="0" y="160" width="300" height="20" fill={INK} />
        </g>
      )
    case 'pass':
      return (
        <g>
          <rect x="80" y="20" width="140" height="145" fill={INK} />
          <rect x="88" y="28" width="124" height="129" fill={PAPER} />
          <text x="150" y="52" textAnchor="middle" fontFamily="Old Standard TT, Georgia, serif" fontSize="14" fontWeight="700" fill={INK} letterSpacing="2">
            REISEPASS
          </text>
          <rect x="98" y="64" width="40" height="52" fill={INK} opacity="0.25" />
          {[70, 82, 94, 106].map((y) => (
            <rect key={y} x="146" y={y} width="56" height="3" fill={INK} opacity="0.5" />
          ))}
          <text x="176" y="148" textAnchor="middle" fontFamily="Old Standard TT, Georgia, serif" fontSize="40" fontWeight="700" fill="#8b0000">
            J
          </text>
        </g>
      )
    case 'synagoge':
      return (
        <g>
          <rect x="80" y="80" width="140" height="80" fill={INK} stroke={PAPER} strokeWidth="1" />
          <path d="M120 82 Q150 36 180 82 Z" fill={INK} stroke={PAPER} strokeWidth="1.5" />
          <rect x="147" y="24" width="6" height="16" fill={PAPER} />
          {[95, 120, 165, 190].map((x) => (
            <path key={x} d={`M${x} 130 L${x} 104 Q${x + 7} 95 ${x + 14} 104 L${x + 14} 130 Z`} fill={PAPER} opacity="0.85" />
          ))}
          <Flame x={150} y={80} s={1.6} />
          <Flame x={100} y={96} s={1} />
          <Flame x={200} y={96} s={1.1} />
          <rect x="0" y="160" width="300" height="20" fill={INK} />
        </g>
      )
    case 'zug':
      return (
        <g>
          {[0, 1].map((i) => (
            <g key={i}>
              <rect x={20 + i * 90} y="90" width="82" height="50" fill={INK} />
              {[0, 1, 2].map((j) => (
                <rect key={j} x={28 + i * 90 + j * 25} y="100" width="16" height="14" fill={PAPER} opacity="0.85" />
              ))}
            </g>
          ))}
          <rect x="200" y="96" width="70" height="44" fill={INK} />
          <rect x="245" y="70" width="18" height="28" fill={INK} />
          <circle cx="254" cy="58" r="10" fill={INK} opacity="0.3" />
          <circle cx="262" cy="42" r="13" fill={INK} opacity="0.2" />
          <rect x="0" y="140" width="300" height="6" fill={INK} />
          {[40, 60, 200, 220].map((x) => (
            <g key={x} fill={INK}>
              <circle cx={x} cy="150" r="4" />
              <rect x={x - 4} y="154" width="8" height="12" />
            </g>
          ))}
          <rect x="0" y="166" width="300" height="14" fill={INK} />
        </g>
      )
  }
}
