import { useState } from 'react'
import { CharacterCreator } from './components/CharacterCreator'
import { EndScreen } from './components/EndScreen'
import { GroupPanel } from './components/GroupPanel'
import { Lexicon } from './components/Lexicon'
import { MapBoard } from './components/MapBoard'
import { NarrativeEvent } from './components/NarrativeEvent'
import { NewspaperModal } from './components/NewspaperModal'
import { ResourceBar } from './components/ResourceBar'
import { TeacherNotes } from './components/TeacherNotes'
import { PrintSheet } from './components/PrintSheet'
import { CardAlbum, CardReveal } from './components/HeroCards'
import { TitleScreen } from './components/TitleScreen'
import { WeekReport } from './components/WeekReport'
import { NightSequence } from './components/cutscene/NightSequence'
import { WeekIntro } from './components/cutscene/WeekIntro'
import { hasSavedGame, useGame } from './store/GameStore'
import { useUi } from './store/UiStore'

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
  const { introSeen, nightSeen, markIntro, markNight, resetCutscenes } = useUi()
  const [atTitle, setAtTitle] = useState(true)

  const setStartChapter = useUi((u) => u.setStartChapter)
  const newGame = (chapter: 1 | 2 = 1) => {
    resetCutscenes()
    setStartChapter(chapter)
    goTo('creation')
    setAtTitle(false)
  }

  let screen
  if (atTitle || phase === 'title') {
    screen = <TitleScreen canContinue={canContinue} onNew={newGame} onContinue={() => setAtTitle(false)} />
  } else if (phase === 'creation') {
    screen = <CharacterCreator onBack={() => setAtTitle(true)} />
  } else if (phase === 'end') {
    screen = <EndScreen onNewGame={() => newGame(1)} />
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
        <ResourceBar onMenu={() => setAtTitle(true)} />
        <main className="mx-auto grid max-w-[1500px] gap-6 px-3 py-5 sm:px-5 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px]">
          <MapBoard />
          <aside className="min-w-0">
            <GroupPanel />
          </aside>
        </main>
        {phase === 'newspaper' &&
          (introSeen === weekIndex ? (
            <NewspaperModal />
          ) : (
            <WeekIntro
              weekIndex={weekIndex}
              onDone={() => markIntro(weekIndex)}
              founding={history.length === 0 && decisions.length === 0}
              groupName={groupName}
            />
          ))}
        {phase === 'event' && <NarrativeEvent />}
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

  return (
    <>
      {screen}
      {overlay === 'lexikon' && <Lexicon />}
      {overlay === 'lehrkraefte' && <TeacherNotes />}
      {overlay === 'vorbilder' && <CardAlbum />}
      {!atTitle && (phase === 'map' || (phase === 'report' && nightSeen === weekIndex)) && <CardReveal />}
      {phase === 'end' && <PrintSheet />}
    </>
  )
}
