import { useState } from 'react'
import { BookOpen, GraduationCap, Volume2, VolumeX } from 'lucide-react'
import s from '../styles/period.module.css'
import { StampButton } from './ui/StampButton'
import { useUi } from '../store/UiStore'
import { useGame } from '../store/GameStore'
import { chapterOf, weekInChapter, weeksInChapter } from '../game/data/chapters'

interface TitleScreenProps {
  canContinue: boolean
  onNew: (chapter?: 1 | 2) => void
  onContinue: () => void
}

export function TitleScreen({ canContinue, onNew, onContinue }: TitleScreenProps) {
  const [confirming, setConfirming] = useState<false | 1 | 2>(false)
  const { openLexicon, openTeacherNotes, muted, toggleMuted } = useUi()
  const leaderName = useGame((g) => g.members.find((m) => m.isLeader)?.name)
  const weekIndex = useGame((g) => g.weekIndex)

  return (
    <main className={`${s.vignette} relative flex min-h-dvh flex-col overflow-hidden`}>
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 pt-12 pb-56 text-center sm:pb-64">
        <p className={`${s.typewriter} text-sm tracking-[0.35em] text-fog uppercase ${s.riseIn}`}>Kapitel 1. Das Jahr 1933</p>
        <h1
          className={`${s.flicker} mt-5 font-serif text-5xl leading-none font-bold tracking-tight text-paper sm:text-7xl`}
          style={{ textShadow: '3px 3px 0 #8b0000' }}
        >
          Gegen den Strom
        </h1>
        <p className={`${s.fraktur} mt-4 text-3xl text-paper sm:text-4xl`}>Berlin 1933</p>
        <hr className="my-7 w-40 border-t border-fog/50" />
        <p className={`${s.riseIn} max-w-xl font-serif text-lg leading-relaxed text-paper/90`}>
          Berlin, im Januar 1933. Die Republik liegt im Sterben. In den Hinterhöfen von Wedding und Neukölln flüstern
          Menschen miteinander, die nicht schweigen wollen. Sie haben keine Waffen und keine Macht. Sie haben nur Papier,
          Druckfarbe und ihren Mut. Du gründest mit ihnen eine Widerstandsgruppe.
        </p>

        <div className="mt-9 flex w-full max-w-sm flex-col gap-4">
          {canContinue && !confirming && (
            <StampButton variant="ink" onClick={onContinue} data-autofocus className="flex-col !gap-0.5">
              <span>Spiel fortsetzen</span>
              {leaderName && (
                <span className="text-[11px] font-normal tracking-[0.08em] normal-case opacity-80">
                  Spielstand von {leaderName}, {chapterOf(weekIndex).id === 1 ? '1933' : '1936 bis 1938'}, Woche {weekInChapter(weekIndex)} von{' '}
                  {weeksInChapter(chapterOf(weekIndex))}
                </span>
              )}
            </StampButton>
          )}
          {!confirming ? (
            <StampButton
              variant={canContinue ? 'paper' : 'ink'}
              onClick={() => (canContinue ? setConfirming(1) : onNew(1))}
            >
              Neues Spiel beginnen
            </StampButton>
          ) : (
            <div className={`${s.paper} p-4 text-left`} role="alertdialog" aria-label="Neues Spiel bestätigen">
              <p className="font-type text-sm">
                Auf diesem Rechner liegt schon ein Spiel{leaderName ? ` von ${leaderName}` : ''}. Wenn du neu beginnst, geht es verloren.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <StampButton variant="blood" onClick={() => onNew(confirming || 1)}>
                  Neu beginnen
                </StampButton>
                <StampButton onClick={() => setConfirming(false)}>Abbrechen</StampButton>
              </div>
            </div>
          )}
          {!confirming && (
            <StampButton variant="quiet" className="text-paper" onClick={() => (canContinue ? setConfirming(2) : onNew(2))}>
              Kapitel 2 direkt beginnen: 1936 bis 1938
            </StampButton>
          )}
          <div className="grid grid-cols-2 gap-3">
            <StampButton variant="quiet" className="text-paper" onClick={() => openLexicon()}>
              <BookOpen size={16} aria-hidden /> Wörter
            </StampButton>
            <StampButton variant="quiet" className="text-paper" onClick={openTeacherNotes}>
              <GraduationCap size={16} aria-hidden /> Lehrkräfte
            </StampButton>
          </div>
        </div>

        <button onClick={toggleMuted} className="mt-6 inline-flex items-center gap-2 font-type text-sm text-fog hover:text-paper">
          {muted ? <VolumeX size={16} aria-hidden /> : <Volume2 size={16} aria-hidden />}
          {muted ? 'Geräusche sind aus' : 'Geräusche sind an'}
        </button>

        <p className="mt-6 max-w-md font-type text-xs leading-relaxed text-fog">
          Die Menschen in diesem Spiel sind erfunden. Die Ereignisse, von denen die Zeitung berichtet, haben sich
          wirklich zugetragen.
        </p>
      </div>
      <Skyline />
    </main>
  )
}

/** Holzschnitt-Silhouette der Stadt bei Nacht */
function Skyline() {
  const windows: [number, number][] = [
    [38, 38], [52, 58], [118, 30], [130, 62], [214, 48], [226, 76], [310, 44], [468, 60], [480, 36],
    [612, 52], [626, 80], [700, 40], [772, 66], [786, 34], [884, 50], [896, 82], [960, 44], [1052, 58],
    [1120, 38], [1134, 70], [1210, 54], [1290, 40], [1302, 72], [1384, 58],
  ]
  return (
    <svg
      viewBox="0 0 1440 240"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full sm:h-64"
      aria-hidden
    >
      <g fill="#111113">
        <path d="M0 240 L0 120 L30 120 L30 96 L90 96 L90 128 L150 128 L150 84 L170 84 L170 70 L180 70 L180 84 L200 84 L200 110 L260 110 L260 88 L330 88 L330 124 L360 124 L360 40 L372 40 L372 124 L420 124 L420 100 L440 100 Z" />
        {/* Reichstag mit Kuppel */}
        <path d="M440 240 L440 110 L452 110 L452 90 L476 90 L476 110 L500 110 L500 76 Q540 30 580 76 L580 110 L604 110 L604 90 L628 90 L628 110 L640 110 L640 240 Z" />
        <path d="M640 240 L640 118 L700 118 L700 92 L760 92 L760 126 L780 126 L780 54 L790 54 L790 126 L840 126 L840 100 L900 100 L900 132 Z" />
        {/* Funkturm */}
        <path d="M1000 240 L1026 60 L1030 20 L1034 60 L1060 240 Z" />
        <path d="M900 240 L900 132 L960 132 L960 108 L1000 108 L1000 240 Z" />
        <path d="M1060 240 L1060 96 L1150 96 L1150 120 L1200 120 L1200 80 L1260 80 L1260 110 L1320 110 L1320 90 L1380 90 L1380 118 L1440 118 L1440 240 Z" />
      </g>
      <g fill="#e8d9a8">
        {windows.map(([x, y], i) => (
          <rect key={i} x={x} y={120 + (y % 60)} width="7" height="10" opacity={0.55 + (i % 3) * 0.15} />
        ))}
      </g>
      <rect x="0" y="228" width="1440" height="12" fill="#0b0b0c" />
    </svg>
  )
}
