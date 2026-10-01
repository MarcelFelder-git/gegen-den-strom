import { useId } from 'react'
import type { AvatarConfig, AvatarDetail, Clothing as ClothingKey, ClothingTone, FaceShape } from '../game/types'

const INK = '#1c1c1e'
const PAPER = '#f4f1ea'
const SKIN = '#efe6d2'
const SLATE = '#4a4f57'
/** Filz des Glockenhuts: ein weiches Graubraun statt Schwarz */
const FELT = '#5f5862'

/**
 * Gedeckte Stofffarben der Zeit. Auf den dunklen Tönen sind Nähte und Knöpfe hell (mindestens 6,5 : 1),
 * auf dem hellen Ton dunkel (8,8 : 1).
 */
export const TONES: Record<ClothingTone, string> = {
  schwarz: INK,
  grau: SLATE,
  blau: '#283752',
  gruen: '#4f5b34',
  weinrot: '#5c2228',
  braun: '#56402f',
  hellblau: '#a9bdd0',
}
const LIGHT_TONES: ClothingTone[] = ['hellblau']
/** Grundfarbe jeder Kleidung, solange keine eigene Farbe gewählt ist */
export const DEFAULT_TONE: Record<ClothingKey, ClothingTone> = {
  arbeiterjacke: 'schwarz',
  trenchcoat: 'grau',
  weste: 'schwarz',
  kleid: 'schwarz',
  strickjacke: 'braun',
  bluse: 'blau',
  anzug: 'grau',
}
export const toneOf = (c: Pick<AvatarConfig, 'clothing' | 'tone'>): ClothingTone => c.tone ?? DEFAULT_TONE[c.clothing]

interface FaceGeo {
  path: string
  /** halbe Breite des Kopfes */
  w: number
  /** Oberkante des Kopfes */
  top: number
}

const ellipsePath = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`

const FACES: Record<FaceShape, FaceGeo> = {
  oval: { path: ellipsePath(50, 56, 17, 22), w: 17, top: 34 },
  rund: { path: ellipsePath(50, 57, 19, 20.5), w: 19, top: 36.5 },
  kantig: {
    path: 'M33 46 Q33 34 50 34 Q67 34 67 46 L67 64 Q66 75 58 78.5 L42 78.5 Q34 75 33 64 Z',
    w: 17,
    top: 34,
  },
  schmal: { path: ellipsePath(50, 56, 14.5, 23), w: 14.5, top: 33 },
}

interface AvatarProps {
  config: AvatarConfig
  size?: number
  className?: string
  title?: string
  /** Verhaftete Gefährten werden grau und durchgestrichen dargestellt */
  crossed?: boolean
}

export function Avatar({ config, size = 96, className, title, crossed }: AvatarProps) {
  const uid = useId().replace(/:/g, '')
  const id = (n: string) => `${n}-${uid}`
  const f = FACES[config.face]
  const { w, top } = f
  const L = 50 - w
  const R = 50 + w
  const female = config.gender === 'w'
  const hairFill =
    config.hairTone === 'dunkel'
      ? INK
      : config.hairTone === 'grau'
        ? '#8e9094'
        : config.hairTone === 'rot'
          ? `url(#${id('hairRed')})`
          : `url(#${id('hairHatch')})`
  // Mehrere Besonderheiten zugleich; ältere Spielstände hatten nur eine
  const has = (d: AvatarDetail) => !!config.details?.includes(d) || config.detail === d
  const tone = TONES[toneOf(config)]
  // Nähte, Knöpfe und Tupfen: hell auf dunklem Stoff, dunkel auf hellem
  const stitch = LIGHT_TONES.includes(toneOf(config)) ? INK : PAPER

  return (
    <svg
      viewBox="0 0 100 120"
      width={size}
      height={(size * 120) / 100}
      className={className}
      role={title === '' ? undefined : 'img'}
      aria-hidden={title === '' ? true : undefined}
      aria-label={title === '' ? undefined : (title ?? 'Porträt')}
      style={crossed ? { filter: 'grayscale(1) contrast(0.8)', opacity: 0.7 } : undefined}
    >
      <defs>
        <pattern id={id('bg')} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2="5" stroke={INK} strokeWidth="0.7" opacity="0.2" />
        </pattern>
        <pattern id={id('shade')} width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <line x1="0" y1="0" x2="0" y2="2.6" stroke={INK} strokeWidth="0.75" opacity="0.75" />
        </pattern>
        <pattern id={id('hairHatch')} width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
          <rect width="2.2" height="2.2" fill="#b5a47f" />
          <line x1="0" y1="0" x2="0" y2="2.2" stroke={INK} strokeWidth="0.9" />
        </pattern>
        <pattern id={id('hairRed')} width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
          <rect width="2.2" height="2.2" fill="#a8643f" />
          <line x1="0" y1="0" x2="0" y2="2.2" stroke={INK} strokeWidth="0.8" />
        </pattern>
        <pattern id={id('stripes')} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
          <rect width="4" height="4" fill="#7a2a22" />
          <line x1="0" y1="0" x2="0" y2="4" stroke={PAPER} strokeWidth="1.1" opacity="0.8" />
        </pattern>
        <pattern id={id('dots')} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill={tone} />
          <circle cx="3" cy="3" r="0.9" fill={stitch} />
        </pattern>
        <clipPath id={id('face')}>
          <path d={f.path} />
        </clipPath>
        <clipPath id={id('frame')}>
          <rect x="0" y="0" width="100" height="120" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id('frame')})`}>
        {/* Hintergrund mit Holzschnitt-Schraffur */}
        <rect width="100" height="120" fill="#d9cfb6" />
        <rect width="100" height="120" fill={`url(#${id('bg')})`} />
        <circle cx="50" cy="54" r="36" fill={INK} opacity="0.1" />

        <HairBack config={config} L={L} R={R} top={top} fill={hairFill} />

        {/* Hals */}
        <path d="M42.5 74 L42.5 94 L57.5 94 L57.5 74 Z" fill={SKIN} stroke={INK} strokeWidth="1.6" />
        <path d="M50 78 L57.5 76 L57.5 92 Z" fill={`url(#${id('shade')})`} />

        <Clothing config={config} dots={`url(#${id('dots')})`} tone={tone} stitch={stitch} />

        {/* Schal um den Hals */}
        {has('schal') && (
          <g stroke={INK} strokeWidth="1.3" strokeLinejoin="round">
            <path d="M54 88 L60 88 L61.5 106 L55 106 Z" fill={`url(#${id('stripes')})`} />
            <path d="M37 82 Q50 89 63 82 L64 90 Q50 98 36 90 Z" fill={`url(#${id('stripes')})`} />
          </g>
        )}

        {/* Ohren */}
        <ellipse cx={L + 0.5} cy="58" rx="3" ry="4.6" fill={SKIN} stroke={INK} strokeWidth="1.4" />
        <ellipse cx={R - 0.5} cy="58" rx="3" ry="4.6" fill={SKIN} stroke={INK} strokeWidth="1.4" />

        {/* Gesicht mit Schattenseite */}
        <path d={f.path} fill={SKIN} />
        <g clipPath={`url(#${id('face')})`}>
          <path d={`M53 20 L${R + 4} 20 L${R + 4} 90 L50 90 Q58 70 53 20 Z`} fill={`url(#${id('shade')})`} />
        </g>
        <path d={f.path} fill="none" stroke={INK} strokeWidth="1.8" />

        {/* Züge */}
        <path d="M38.5 50.5 Q42.5 48 46.5 50" fill="none" stroke={INK} strokeWidth={female ? 1.1 : 1.8} strokeLinecap="round" />
        <path d="M53.5 50 Q57.5 48 61.5 50.5" fill="none" stroke={INK} strokeWidth={female ? 1.1 : 1.8} strokeLinecap="round" />
        <ellipse cx="42.5" cy="55" rx="1.9" ry="1.35" fill={INK} />
        <ellipse cx="57.5" cy="55" rx="1.9" ry="1.35" fill={INK} />
        {female && (
          <>
            <path d="M39.5 54 L40.8 53.2 M59.2 53.2 L60.5 54" stroke={INK} strokeWidth="0.9" strokeLinecap="round" />
          </>
        )}
        <path d="M50.5 56 L48.3 64.2 L51.8 64.8" fill="none" stroke={INK} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        {female ? (
          <>
            <path d="M45.5 70 Q48 68.8 50 69.6 Q52 68.8 54.5 70 Q50 71.4 45.5 70 Z" fill={INK} />
            <path d="M47 71.6 Q50 73.2 53 71.6" fill="none" stroke={INK} strokeWidth="0.9" />
          </>
        ) : (
          <path d="M44.5 70.2 Q50 71.8 55.5 70" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
        )}
        <path d={`M${L + 3.5} 62 Q${L + 5} 71 ${L + 11} 75.5`} fill="none" stroke={INK} strokeWidth="0.8" opacity="0.7" />

        {has('sommersprossen') && (
          <g fill={INK} opacity="0.55">
            {[
              [39, 60.5],
              [42, 62.3],
              [44.5, 60.2],
              [40.5, 64],
              [55.5, 60.2],
              [58, 62.3],
              [61, 60.5],
              [59.5, 64],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="0.65" />
            ))}
          </g>
        )}
        {has('schnurrbart') && (
          <path
            d="M43.5 67.8 Q46.5 65.2 50 66.8 Q53.5 65.2 56.5 67.8 Q53.5 69.4 50 68.3 Q46.5 69.4 43.5 67.8 Z"
            fill={hairFill}
            stroke={INK}
            strokeWidth="0.9"
          />
        )}

        <HairFront config={config} L={L} R={R} top={top} fill={hairFill} />

        {config.glasses && (
          <g fill="none" stroke={INK} strokeWidth="1.3">
            <circle cx="42.5" cy="55" r="5.2" fill={PAPER} fillOpacity="0.18" />
            <circle cx="57.5" cy="55" r="5.2" fill={PAPER} fillOpacity="0.18" />
            <path d="M47.7 55 Q50 53.2 52.3 55" />
            <path d={`M37.3 54.5 L${L + 1} 56`} />
            <path d={`M62.7 54.5 L${R - 1} 56`} />
          </g>
        )}

        {/* Ohrringe als kleine Goldperlen an den Ohrläppchen, über den Haaren */}
        {has('ohrringe') && (
          <g fill="#d8b04a" stroke={INK} strokeWidth="0.7">
            <circle cx={L + 0.5} cy="64.2" r="1.6" />
            <circle cx={R - 0.5} cy="64.2" r="1.6" />
          </g>
        )}

        {crossed && (
          <g stroke="#8b0000" strokeWidth="5" opacity="0.85">
            <line x1="8" y1="10" x2="92" y2="112" />
            <line x1="92" y1="10" x2="8" y2="112" />
          </g>
        )}
      </g>
      <rect x="1.25" y="1.25" width="97.5" height="117.5" fill="none" stroke={INK} strokeWidth="2.5" />
      <rect x="4.5" y="4.5" width="91" height="111" fill="none" stroke={INK} strokeWidth="0.6" />
    </svg>
  )
}

interface HairProps {
  config: AvatarConfig
  L: number
  R: number
  top: number
  fill: string
}

function HairBack({ config, L, R, top, fill }: HairProps) {
  switch (config.headwear) {
    case 'welle':
      return (
        <path
          d={`M${L - 5} 70 Q${L - 7} ${top - 9} 50 ${top - 9} Q${R + 7} ${top - 9} ${R + 5} 70 Q${R + 1} 74 ${R - 1} 64 L${L + 1} 64 Q${L - 1} 74 ${L - 5} 70 Z`}
          fill={fill}
          stroke={INK}
          strokeWidth="1.4"
        />
      )
    case 'zoepfe':
      return (
        <g fill={fill} stroke={INK} strokeWidth="1.2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <ellipse cx={L - 1.5} cy={62 + i * 6.2} rx="3.6" ry="3.9" />
              <ellipse cx={R + 1.5} cy={62 + i * 6.2} rx="3.6" ry="3.9" />
            </g>
          ))}
          <path d={`M${L - 1.5} 97 l-2.5 6 l5 0 Z M${R + 1.5} 97 l-2.5 6 l5 0 Z`} fill={INK} />
          <rect x={L - 4} y="94" width="5" height="2.4" fill="#8b0000" stroke="none" />
          <rect x={R - 1} y="94" width="5" height="2.4" fill="#8b0000" stroke="none" />
        </g>
      )
    case 'glocke':
      return (
        <path
          d={`M${L - 4} 64 Q${L - 5} ${top} 50 ${top} Q${R + 5} ${top} ${R + 4} 64 Q${R + 1} 67 ${R - 1} 62 L${L + 1} 62 Q${L - 1} 67 ${L - 4} 64 Z`}
          fill={fill}
          stroke={INK}
          strokeWidth="1.2"
        />
      )
    case 'knoten':
      // Der Knoten sitzt hinten oben und schaut über den Kopf
      return (
        <g fill={fill} stroke={INK} strokeWidth="1.3">
          <circle cx="50" cy={top - 7} r="7.5" />
          <path d={`M44 ${top - 8} Q50 ${top - 12} 56 ${top - 8}`} fill="none" stroke={PAPER} strokeWidth="0.7" opacity="0.8" />
        </g>
      )
    case 'baskenmuetze':
      // Frauen tragen darunter einen kurzen Bob, Männer kurzes Haar
      return config.gender === 'w' ? (
        <path
          d={`M${L - 4} 66 Q${L - 5} ${top} 50 ${top} Q${R + 5} ${top} ${R + 4} 66 Q${R + 1} 68 ${R - 1} 63 L${L + 1} 63 Q${L - 1} 68 ${L - 4} 66 Z`}
          fill={fill}
          stroke={INK}
          strokeWidth="1.3"
        />
      ) : null
    default:
      return null
  }
}

function HairFront({ config, L, R, top, fill }: HairProps) {
  switch (config.headwear) {
    case 'kurz':
      return (
        <g>
          <path
            d={`M${L - 1} 53 Q${L - 2.5} ${top - 7} 50 ${top - 7} Q${R + 2.5} ${top - 7} ${R + 1} 53 Q${R - 1} 45 ${R - 5} 44 Q56 ${top + 3} 44 ${top + 6} Q${L + 3} 44 ${L - 1} 53 Z`}
            fill={fill}
            stroke={INK}
            strokeWidth="1.5"
          />
          <path d={`M44 ${top - 5} Q43 ${top + 1} 44.5 ${top + 5}`} fill="none" stroke={PAPER} strokeWidth="0.9" />
        </g>
      )
    case 'welle':
      return (
        <g>
          <path
            d={`M${L - 1.5} 57 Q${L - 2} ${top - 6} 50 ${top - 7} Q${R + 2} ${top - 6} ${R + 1.5} 57 Q${R - 2} 46 ${R - 7} 44 Q58 ${top + 8} 50 ${top + 5} Q44 ${top + 10} ${L + 5} 44 Q${L} 47 ${L - 1.5} 57 Z`}
            fill={fill}
            stroke={INK}
            strokeWidth="1.5"
          />
          <g fill="none" stroke={PAPER} strokeWidth="0.9" opacity="0.9">
            <path d={`M${L + 1} ${top + 2} q4 -4 8 0 q4 4 8 0`} />
            <path d={`M${R - 16} ${top + 1} q4 -4 8 0 q4 4 8 0`} />
          </g>
        </g>
      )
    case 'zoepfe':
      return (
        <g>
          <path
            d={`M${L - 1} 58 Q${L - 2} ${top - 6} 50 ${top - 6} Q${R + 2} ${top - 6} ${R + 1} 58 Q${R - 1} 47 ${R - 5} 44 Q56 ${top + 5} 50 ${top + 2} Q44 ${top + 5} ${L + 5} 44 Q${L + 1} 47 ${L - 1} 58 Z`}
            fill={fill}
            stroke={INK}
            strokeWidth="1.5"
          />
          <path d={`M50 ${top - 5} L50 ${top + 2}`} stroke={PAPER} strokeWidth="1.1" />
        </g>
      )
    case 'glocke':
      // Weicher Filzhut, tief in der Stirn, darunter schauen Locken hervor. Statt eines Streifens eine kleine Schleife.
      return (
        <g>
          <g fill={fill} stroke={INK} strokeWidth="1.1">
            <circle cx={L - 0.5} cy={top + 17.5} r="3.3" />
            <circle cx={L + 0.8} cy={top + 22.5} r="2.7" />
            <circle cx={R + 0.5} cy={top + 17.5} r="3.3" />
            <circle cx={R - 0.8} cy={top + 22.5} r="2.7" />
          </g>
          <path
            d={`M${L - 3} ${top + 10} Q${L - 4} ${top - 11} 50 ${top - 12} Q${R + 4} ${top - 11} ${R + 3} ${top + 10} Z`}
            fill={FELT}
            stroke={INK}
            strokeWidth="1.4"
          />
          <path d={`M${L + 2} ${top - 3} Q50 ${top - 10} ${R - 5} ${top - 6}`} fill="none" stroke={PAPER} strokeWidth="0.8" opacity="0.45" />
          <path
            d={`M${L - 6} ${top + 16} Q${L - 5} ${top + 8} ${L - 2} ${top + 7.5} Q50 ${top + 4.5} ${R + 2} ${top + 7.5} Q${R + 5} ${top + 8} ${R + 6} ${top + 16} Q50 ${top + 10.5} ${L - 6} ${top + 16} Z`}
            fill={FELT}
            stroke={INK}
            strokeWidth="1.4"
          />
          <path d={`M${L - 2.5} ${top + 6} Q50 ${top + 2} ${R + 2.5} ${top + 6}`} fill="none" stroke={INK} strokeWidth="2.4" />
          <g fill={PAPER} stroke={INK} strokeWidth="0.6">
            <path d={`M${R - 4} ${top + 4} q-4.5 -3.2 -5.5 0.8 q3.2 2.2 5.5 -0.8 Z`} />
            <path d={`M${R - 4} ${top + 4} q4.5 -3.2 5.5 0.8 q-3.2 2.2 -5.5 -0.8 Z`} />
            <circle cx={R - 4} cy={top + 4} r="1.1" />
          </g>
        </g>
      )
    case 'knoten':
      // Straff zurückgekämmt, mit Mittelscheitel
      return (
        <g>
          <path
            d={`M${L - 0.5} 55 Q${L - 1.5} ${top - 5} 50 ${top - 5} Q${R + 1.5} ${top - 5} ${R + 0.5} 55 Q${R - 1} 46 ${R - 5} ${top + 8} Q56 ${top + 3} 50 ${top + 1.5} Q44 ${top + 3} ${L + 5} ${top + 8} Q${L + 1} 46 ${L - 0.5} 55 Z`}
            fill={fill}
            stroke={INK}
            strokeWidth="1.5"
          />
          <path d={`M50 ${top - 4} L50 ${top + 1.5}`} stroke={PAPER} strokeWidth="1" />
          <g fill="none" stroke={PAPER} strokeWidth="0.6" opacity="0.6">
            <path d={`M47 ${top - 3} Q${L + 4} ${top} ${L + 1} 50`} />
            <path d={`M53 ${top - 3} Q${R - 4} ${top} ${R - 1} 50`} />
          </g>
        </g>
      )
    case 'locken':
      return (
        <g>
          <path
            d={`M${L - 1} 52 Q${L - 2} ${top - 5} 50 ${top - 6} Q${R + 2} ${top - 5} ${R + 1} 52 Q${R - 2} 46 ${R - 5} ${top + 9} Q50 ${top + 6} ${L + 5} ${top + 9} Q${L + 2} 46 ${L - 1} 52 Z`}
            fill={fill}
            stroke={INK}
            strokeWidth="1.3"
          />
          <g fill={fill} stroke={INK} strokeWidth="1.1">
            {[200, 218, 236, 254, 272, 290, 308, 326, 344].map((deg) => {
              const a = (deg * Math.PI) / 180
              return <circle key={deg} cx={50 + (R - 50 + 1.5) * Math.cos(a)} cy={top + 8 + 14 * Math.sin(a)} r="4.2" />
            })}
            <circle cx="44" cy={top + 8.5} r="2.6" />
            <circle cx="50" cy={top + 7.5} r="2.6" />
            <circle cx="56" cy={top + 8.5} r="2.6" />
          </g>
        </g>
      )
    case 'baskenmuetze':
      // Tief und leicht schräg aufgesetzt, darunter das eigene Haar
      return (
        <g>
          {config.gender === 'w' ? (
            <path
              d={`M${L - 2} 60 Q${L - 3} ${top - 5} 50 ${top - 5} Q${R + 3} ${top - 5} ${R + 2} 60 L${R - 1} 60 Q${R - 2} 47 ${R - 6} ${top + 10} Q50 ${top + 6} ${L + 6} ${top + 10} Q${L + 2} 47 ${L + 1} 60 Z`}
              fill={fill}
              stroke={INK}
              strokeWidth="1.4"
            />
          ) : (
            <path
              d={`M${L - 1} 53 Q${L - 2.5} ${top - 5} 50 ${top - 5} Q${R + 2.5} ${top - 5} ${R + 1} 53 Q${R - 1} 45 ${R - 5} ${top + 10} Q50 ${top + 7} ${L + 5} ${top + 10} Q${L + 3} 45 ${L - 1} 53 Z`}
              fill={fill}
              stroke={INK}
              strokeWidth="1.4"
            />
          )}
          <g transform={`rotate(-8 50 ${top + 2})`}>
            <ellipse cx="50" cy={top + 0.5} rx={R - 50 + 8.5} ry="8" fill={INK} />
            <path d={`M${L - 3} ${top + 4.5} Q50 ${top + 8.5} ${R + 3} ${top + 4.5}`} fill="none" stroke={PAPER} strokeWidth="0.7" opacity="0.55" />
            <path d={`M${L} ${top - 3} Q50 ${top - 8.5} ${R + 3} ${top - 3}`} fill="none" stroke={PAPER} strokeWidth="0.7" opacity="0.6" />
            <path d={`M50 ${top - 7.5} L50.6 ${top - 11}`} stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </g>
      )
    case 'schiebermuetze':
      return (
        <g>
          <path d={`M${L - 1} 52 L${L - 1} ${top + 8} L${L + 4} ${top + 8} L${L + 3} 50 Z`} fill={fill} stroke={INK} strokeWidth="1" />
          <path d={`M${R + 1} 52 L${R + 1} ${top + 8} L${R - 4} ${top + 8} L${R - 3} 50 Z`} fill={fill} stroke={INK} strokeWidth="1" />
          <path
            d={`M${L - 3.5} ${top + 10} Q${L - 3} ${top - 7} 53 ${top - 9} Q${R + 7} ${top - 7} ${R + 4} ${top + 9} Z`}
            fill={INK}
          />
          <path d={`M${L} ${top + 1} Q52 ${top - 7} ${R + 1} ${top}`} fill="none" stroke={PAPER} strokeWidth="0.7" opacity="0.8" />
          <path d={`M52 ${top - 8} L50 ${top + 8}`} fill="none" stroke={PAPER} strokeWidth="0.6" opacity="0.7" />
          <ellipse cx="51" cy={top + 11} rx={R - L > 32 ? 22 : 20} ry="4.2" fill={INK} />
          <path d={`M${L - 1} ${top + 9.5} Q51 ${top + 6.5} ${R + 3} ${top + 9.5}`} fill="none" stroke={PAPER} strokeWidth="0.9" />
          <circle cx="53" cy={top - 8.5} r="1.6" fill={INK} stroke={PAPER} strokeWidth="0.6" />
        </g>
      )
    case 'fedora':
      return (
        <g>
          <path d={`M${L - 1} 53 L${L - 1} ${top + 8} L${L + 4} ${top + 8} L${L + 3} 51 Z`} fill={fill} stroke={INK} strokeWidth="1" />
          <path d={`M${R + 1} 53 L${R + 1} ${top + 8} L${R - 4} ${top + 8} L${R - 3} 51 Z`} fill={fill} stroke={INK} strokeWidth="1" />
          <path
            d={`M${L + 1} ${top + 6} L${L + 3} ${top - 13} Q50 ${top - 7} ${R - 3} ${top - 13} L${R - 1} ${top + 6} Z`}
            fill={INK}
          />
          <path d={`M50 ${top - 9} L50 ${top - 2}`} stroke={PAPER} strokeWidth="0.8" opacity="0.8" />
          <rect x={L + 1.5} y={top} width={R - L - 3} height="4.5" fill={SLATE} />
          <line x1={L + 1.5} y1={top} x2={R - 1.5} y2={top} stroke={PAPER} strokeWidth="0.6" />
          <ellipse cx="50" cy={top + 7} rx={w(L, R) + 13} ry="4.6" fill={INK} />
          <path d={`M${L - 11} ${top + 6} Q50 ${top + 2.5} ${R + 11} ${top + 6}`} fill="none" stroke={PAPER} strokeWidth="0.8" />
        </g>
      )
  }
}

const w = (L: number, R: number) => (R - L) / 2

function Clothing({ config, dots, tone, stitch }: { config: AvatarConfig; dots: string; tone: string; stitch: string }) {
  const shoulders = 'M4 121 Q7 99 29 93 L42.5 90 L57.5 90 L71 93 Q93 99 96 121 Z'
  switch (config.clothing) {
    case 'arbeiterjacke':
      return (
        <g>
          <path d={shoulders} fill={tone} stroke={INK} strokeWidth="1.5" />
          <path d="M43 90 L50 103 L57 90 Z" fill={PAPER} stroke={INK} strokeWidth="1" />
          <path d="M42.5 90 L50 104 L40 111 L35 95 Z" fill={tone} stroke={stitch} strokeWidth="0.9" />
          <path d="M57.5 90 L50 104 L60 111 L65 95 Z" fill={tone} stroke={stitch} strokeWidth="0.9" />
          <g stroke={stitch} strokeWidth="0.7" opacity="0.6">
            <path d="M18 104 L20 116 M24 101 L25 114 M76 101 L75 114 M82 104 L80 116" />
          </g>
          <circle cx="50" cy="110" r="1.4" fill={stitch} />
          <circle cx="50" cy="117" r="1.4" fill={stitch} />
        </g>
      )
    case 'trenchcoat':
      return (
        <g>
          <path d={shoulders} fill={tone} stroke={INK} strokeWidth="1.5" />
          <path d="M44 90 L50 100 L56 90 Z" fill={PAPER} stroke={INK} strokeWidth="1" />
          <path d="M48.5 91 L51.5 91 L52.5 99 L50 102 L47.5 99 Z" fill={INK} />
          <path d="M42.5 88 L36 84 L33 97 L41 101 L50 104 Z" fill={tone} stroke={INK} strokeWidth="1.3" />
          <path d="M57.5 88 L64 84 L67 97 L59 101 L50 104 Z" fill={tone} stroke={INK} strokeWidth="1.3" />
          <path d="M50 104 L44 121 M50 104 L58 121" stroke={INK} strokeWidth="1.3" />
          <g fill={INK}>
            <circle cx="42" cy="111" r="1.3" />
            <circle cx="58" cy="111" r="1.3" />
            <circle cx="41" cy="118" r="1.3" />
            <circle cx="59" cy="118" r="1.3" />
          </g>
          <path d="M22 99 L27 104" stroke={INK} strokeWidth="1.2" />
          <path d="M78 99 L73 104" stroke={INK} strokeWidth="1.2" />
        </g>
      )
    case 'weste':
      return (
        <g>
          <path d={shoulders} fill={PAPER} stroke={INK} strokeWidth="1.5" />
          <path d="M42.5 90 L46 96 L50 91 Z M57.5 90 L54 96 L50 91 Z" fill={PAPER} stroke={INK} strokeWidth="1" />
          <path d="M22 121 L28 97 L43 92 L50 112 L57 92 L72 97 L78 121 Z" fill={tone} stroke={INK} strokeWidth="1" />
          <path d="M48.3 92 L51.7 92 L52.8 104 L50 108 L47.2 104 Z" fill="#8b0000" stroke={INK} strokeWidth="0.8" />
          <g fill={stitch}>
            <circle cx="50" cy="114" r="1.1" />
            <circle cx="50" cy="119" r="1.1" />
          </g>
          <path d="M35 104 L42 102" stroke={stitch} strokeWidth="0.9" />
          <path d="M65 104 L58 102" stroke={stitch} strokeWidth="0.9" />
        </g>
      )
    case 'kleid':
      return (
        <g>
          <path d={shoulders} fill={dots} stroke={INK} strokeWidth="1.5" />
          <path d="M42.5 90 Q36 92 37.5 99 Q44 102 50 96 Z" fill={PAPER} stroke={INK} strokeWidth="1.2" />
          <path d="M57.5 90 Q64 92 62.5 99 Q56 102 50 96 Z" fill={PAPER} stroke={INK} strokeWidth="1.2" />
          <circle cx="50" cy="99" r="1.8" fill="#8b0000" stroke={INK} strokeWidth="0.6" />
        </g>
      )
    case 'strickjacke':
      return (
        <g>
          <path d={shoulders} fill={tone} stroke={INK} strokeWidth="1.5" />
          {/* Gerippter Strick */}
          <g stroke={stitch} strokeWidth="0.6" opacity="0.35">
            <path d="M14 106 L15 121 M20 101 L21 121 M26 98 L27 121 M74 98 L73 121 M80 101 L79 121 M86 106 L85 121" />
          </g>
          {/* Hemd oder Bluse im V-Ausschnitt */}
          <path d="M42.5 90 L50 112 L57.5 90 Z" fill={PAPER} stroke={INK} strokeWidth="1.1" />
          <path d="M42.5 90 L46.5 96 L50 91.5 Z M57.5 90 L53.5 96 L50 91.5 Z" fill={PAPER} stroke={INK} strokeWidth="0.9" />
          <path d="M50 112 L50 121" stroke={INK} strokeWidth="1.2" />
          <g fill={PAPER} stroke={INK} strokeWidth="0.5">
            <circle cx="50" cy="115" r="1.3" />
            <circle cx="50" cy="119.5" r="1.3" />
          </g>
        </g>
      )
    case 'bluse':
      return (
        <g>
          <path d={shoulders} fill={PAPER} stroke={INK} strokeWidth="1.5" />
          <path d="M10 112 Q14 100 24 97 M90 112 Q86 100 76 97" fill="none" stroke={INK} strokeWidth="0.9" />
          {/* Rock mit Trägern in der gewählten Farbe */}
          <path d="M33 95 L38 95 L41 121 L35 121 Z M67 95 L62 95 L59 121 L65 121 Z" fill={tone} stroke={INK} strokeWidth="1" />
          <path d="M5.9 113 L94.1 113 L96 121 L4 121 Z" fill={tone} stroke={INK} strokeWidth="1.2" />
          {/* Bubikragen mit Schleife */}
          <path d="M42.5 90 Q35 91 37 98 Q44 100 50 94 Z" fill={PAPER} stroke={INK} strokeWidth="1.1" />
          <path d="M57.5 90 Q65 91 63 98 Q56 100 50 94 Z" fill={PAPER} stroke={INK} strokeWidth="1.1" />
          <path d="M50 97 L44.5 94 L44.5 100 Z M50 97 L55.5 94 L55.5 100 Z" fill={tone} stroke={INK} strokeWidth="0.7" />
          <circle cx="50" cy="97" r="1.4" fill={tone} stroke={INK} strokeWidth="0.7" />
          <g fill={INK}>
            <circle cx="50" cy="104" r="0.9" />
            <circle cx="50" cy="109" r="0.9" />
          </g>
        </g>
      )
    case 'anzug':
      return (
        <g>
          <path d={shoulders} fill={tone} stroke={INK} strokeWidth="1.5" />
          {/* Hemd und Krawatte */}
          <path d="M42.5 90 L50 108 L57.5 90 Z" fill={PAPER} stroke={INK} strokeWidth="1" />
          <path d="M48.4 91.5 L51.6 91.5 L52.6 103 L50 107 L47.4 103 Z" fill={INK} />
          <path d="M42.5 90 L46.5 95.5 L50 91 Z M57.5 90 L53.5 95.5 L50 91 Z" fill={PAPER} stroke={INK} strokeWidth="0.9" />
          {/* Revers */}
          <path d="M42.5 90 L50 108 L44 112 L38 100 L41 96 L36 94 Z" fill={tone} stroke={stitch} strokeWidth="0.8" />
          <path d="M57.5 90 L50 108 L56 112 L62 100 L59 96 L64 94 Z" fill={tone} stroke={stitch} strokeWidth="0.8" />
          {/* Einstecktuch und Knopf */}
          <path d="M66 103 L72 103 L71.2 106 L66.8 106 Z" fill={PAPER} stroke={INK} strokeWidth="0.6" />
          <circle cx="50" cy="116" r="1.3" fill={stitch} />
        </g>
      )
  }
}
