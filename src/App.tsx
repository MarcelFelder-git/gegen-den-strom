import { useState } from 'react'
import { CharacterCreator } from './components/CharacterCreator'
import { EndScreen } from './components/EndScreen'
import { GroupPanel } from './components/GroupPanel'
import { Lexicon } from './components/Lexicon'
import { MapBoard } from './components/MapBoard'
import { ResourceBar } from './components/ResourceBar'
import { TeacherNotes } from './components/TeacherNotes'
import { PrintSheet } from './components/PrintSheet'
import { CardAlbum, CardReveal } from './components/HeroCards'
import { TitleScreen } from './components/TitleScreen'
import { WeekReport } from './components/WeekReport'
import { Chronicle } from './components/Chronicle'
import { PhotoCredits } from './components/PhotoCredits'
import { IntroTimeline } from './components/intro/IntroTimeline'
import { LevelSelect } from './components/intro/LevelSelect'
import { WeekFlow } from './components/week/WeekFlow'
import { NightSequence } from './components/cutscene/NightSequence'
import { WeekIntro } from './components/cutscene/WeekIntro'
import { hasSavedGame, useGame } from './store/GameStore'
import { useUi } from './store/UiStore'

/** Die Bildschirme vor dem Spiel: Titel, Stufe wählen, Vorgeschichte, eigene Figur */
type Before = 'title' | 'level' | 'intro' | 'prologue' | null

export default function App() {
  const phase = useGame((g) => g.phase)
  const canContinue = useGame(hasSavedGame)
  const goTo = useGame((g) => g.goTo)
  const overlay = useUi((u) => u.overlay)
  const weekIndex = useGame((g) => g.weekIndex)
  const report = useGame((g) => g.report)
  const members = useGame((g) => g.members)
  const history = useGame((g) => g.history)
  const decisions = useGame((g) => g.decisions)
  const groupName = useGame((g) => g.groupName)
  // Vorbild-Karten erst nach der Einführung, damit nicht zwei Fenster übereinanderliegen
  const tutorialPending = useGame((g) => !g.tutorialSeen && g.history.length === 0)
  const { introSeen, nightSeen, markIntro, markNight, resetCutscenes, draftLevel, setDraftLevel, startChapter } = useUi()
  const [before, setBefore] = useState<Before>('title')

  const setStartChapter = useUi((u) => u.setStartChapter)
  const newGame = (chapter: 1 | 2 = 1) => {
    resetCutscenes()
    setStartChapter(chapter)
    setBefore('level')
  }

  let screen
  if (before === 'title' || (before === null && phase === 'title')) {
    screen = (
      <TitleScreen
        canContinue={canContinue}
        onNew={newGame}
        onContinue={() => setBefore(null)}
        onPrologue={() => setBefore('prologue')}
      />
    )
  } else if (before === 'level') {
    screen = <LevelSelect value={draftLevel} onChange={setDraftLevel} onNext={() => setBefore('intro')} onBack={() => setBefore('title')} />
  } else if (before === 'intro' || before === 'prologue') {
    const prologue = before === 'prologue'
    screen = (
      <IntroTimeline
        level={draftLevel}
        chapter={prologue ? 1 : startChapter}
        onBack={() => setBefore(prologue ? 'title' : 'level')}
        onDone={() => {
          if (prologue) return setBefore('title')
          goTo('creation')
          setBefore(null)
        }}
      />
    )
  } else if (phase === 'creation') {
    screen = <CharacterCreator onBack={() => setBefore('intro')} />
  } else if (phase === 'end') {
    screen = <EndScreen onNewGame={() => newGame(1)} onNewChapter2={() => newGame(2)} />
  } else {
    screen = (
      <div className="relative isolate min-h-dvh">
        {/* Je weiter das Jahr voranschreitet, desto röter und dunkler wird der Rand */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background: `radial-gradient(ellipse at 50% 115%, rgba(139,0,0,${0.12 + weekIndex * 0.035}) 0%, transparent 60%), radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,${0.35 + weekIndex * 0.03}) 100%), #1f1f23`,
          }}
        />
        <ResourceBar onMenu={() => setBefore('title')} />
        <main className="mx-auto grid max-w-[1500px] gap-6 px-3 py-5 sm:px-5 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px]">
          <MapBoard />
          <aside className="min-w-0">
            <GroupPanel />
          </aside>
        </main>
        {(phase === 'newspaper' || phase === 'event') &&
          (introSeen === weekIndex || phase === 'event' ? (
            <WeekFlow />
          ) : (
            <WeekIntro
              weekIndex={weekIndex}
              onDone={() => markIntro(weekIndex)}
              founding={history.length === 0 && decisions.length === 0}
              groupName={groupName}
            />
          ))}
        {phase === 'report' &&
          report &&
          (nightSeen === weekIndex ? (
            <WeekReport />
          ) : (
            <NightSequence report={report} members={members} onDone={() => markNight(weekIndex)} />
          ))}
      </div>
    )
  }

  const inGame = before === null
  return (
    <>
      {screen}
      {overlay === 'lexikon' && <Lexicon />}
      {overlay === 'lehrkraefte' && <TeacherNotes />}
      {overlay === 'vorbilder' && <CardAlbum />}
      {overlay === 'chronik' && <Chronicle />}
      {overlay === 'bildnachweis' && <PhotoCredits />}
      {inGame && ((phase === 'map' && !tutorialPending) || (phase === 'report' && nightSeen === weekIndex)) && <CardReveal />}
      {phase === 'end' && <PrintSheet />}
    </>
  )
}
