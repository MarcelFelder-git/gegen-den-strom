import { Cinema, type Shot } from './Cinema'
import { MissionScene, MorningScene, NightfallScene, WEEK_WEATHER, type SceneOutcome, type Weather } from './scenes'
import { getPlace } from '../../game/data/districts'
import { fillMissionText } from '../../game/logic'
import type { Character, WeekReport } from '../../game/types'
import { sound } from '../../audio/sound'
import { useMissions } from '../../store/content'

const NIGHT_CAPTION: Record<Weather, string> = {
  schnee: 'Es schneit über Berlin. Die Schritte auf dem Pflaster klingen gedämpft. Gut für alle, die nicht gehört werden wollen.',
  nebel: 'Nebel liegt über der Spree. Man sieht kaum bis zur nächsten Laterne.',
  regen: 'Regen trommelt auf die Dächer. Die Streifen stellen sich in die Hauseingänge.',
  klar: 'Eine klare, kalte Nacht. Jeder Schritt ist weit zu hören.',
}

/** Kleine, beständige Zahl aus einer Kennung, damit jede Szene ihre eigene Variante bekommt */
function hash(text: string): number {
  let h = 0
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}

/** Die Nacht der Einsätze: jede Aktion als kurze Szene, am Ende der Stempel */
export function NightSequence({ report, members, onDone }: { report: WeekReport; members: Character[]; onDone: () => void }) {
  const missions = useMissions()
  const byId = (id: string) => members.find((m) => m.id === id)
  const weather = WEEK_WEATHER[report.weekIndex] ?? 'klar'
  const results = report.results
  const arrested = results.some((r) => r.arrested.length > 0) || report.heatArrests.length > 0
  const detected = results.some((r) => r.detected)
  const allGood = results.length > 0 && results.every((r) => r.outcome === 'gelungen' && !r.detected)

  const morning = arrested
    ? 'Am nächsten Morgen fehlt jemand am Küchentisch. Eine Zellentür ist ins Schloss gefallen.'
    : detected
      ? 'Am nächsten Morgen. Vor dem Haus steht ein Mann, der dort nicht hingehört.'
      : results.length === 0
        ? 'Am nächsten Morgen. Nichts ist geschehen. Auch das ist eine Entscheidung.'
        : allGood
          ? 'Am nächsten Morgen. Für einen Augenblick wirkt die Stadt weniger kalt.'
          : 'Am nächsten Morgen. Nicht alles ist gelungen, aber alle sind zurück.'

  const shots: Shot[] = [
    {
      id: 'nacht',
      scene: <NightfallScene weekIndex={report.weekIndex} weather={weather} />,
      caption: results.length === 0 ? 'Die Gruppe hält still. In dieser Nacht verlässt niemand das Haus.' : NIGHT_CAPTION[weather],
      auto: 2400,
      ambience: weather === 'regen' ? 'regen' : undefined,
    },
    ...results.map((r): Shot => {
      const team = r.team.map(byId).filter((m): m is Character => !!m)
      const outcome: SceneOutcome = r.detected ? 'entdeckt' : r.outcome
      return {
        id: r.uid,
        scene: (
          <MissionScene
            type={r.type}
            team={team.map((m) => m.avatar.gender)}
            weather={weather}
            outcome={outcome}
            seed={hash(r.uid)}
          />
        ),
        caption: fillMissionText(missions[r.type].night, team, getPlace(r.placeId).at),
        stamp: r.detected
          ? { text: r.outcome === 'gelungen' ? 'Gesehen' : 'Entdeckt', tone: 'blood' }
          : r.outcome === 'gelungen'
            ? { text: 'Gelungen', tone: 'ink' }
            : { text: 'Gescheitert', tone: 'blood' },
        auto: 2800,
        ambience: weather === 'regen' ? 'regen' : undefined,
        sfx: r.arrested.length > 0 ? () => sound.cellDoor() : outcome === 'entdeckt' ? () => sound.whistle(1.4) : undefined,
      }
    }),
    {
      id: 'morgen',
      scene: <MorningScene weather={weather} troubled={detected || arrested} />,
      caption: morning,
    },
  ]
  return <Cinema shots={shots} label="Die Nacht der Einsätze" onDone={onDone} doneLabel="Zum Bericht" />
}
