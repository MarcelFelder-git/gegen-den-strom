import { Cinema, type Shot } from './Cinema'
import { ArrestScene, ArrivalScene, MissionScene, MorningScene, NightfallScene, WEEK_WEATHER, type SceneOutcome, type Weather } from './scenes'
import { getPlace } from '../../game/data/districts'
import { firstName, fillMissionText, joinNames } from '../../game/logic'
import type { Character, WeekReport } from '../../game/types'
import { sound } from '../../audio/sound'
import { useLevel, useMissions } from '../../store/content'

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

/**
 * Wer abgeholt wird, bekommt eine eigene Szene, damit niemand die Verhaftung übersieht.
 * Leicht: Die Person kommt bald zurück. Schwer: Ob sie zurückkommt, ist ungewiss.
 */
function arrestShot(id: string, people: Character[], atHome: boolean, level: 'leicht' | 'schwer'): Shot {
  const names = joinNames(people.map(firstName))
  const one = people.length === 1
  const w = one && people[0].avatar.gender === 'w'
  const ihn = one ? (w ? 'sie' : 'ihn') : 'sie'
  const er = one ? (w ? 'Sie' : 'Er') : 'Sie'
  const place = people[0]?.prison?.place ?? 'ins Polizeipräsidium am Alexanderplatz'
  const where = place.replace(/^im /, 'ins ').replace(/^in einem /, 'in einen ').replace(/^in der /, 'in die ')
  const start = atHome
    ? `Früh am Morgen klopft es bei ${names}. ${one ? `${er} war` : 'Sie waren'} der Polizei schon zu bekannt. Ein Wagen bringt ${ihn} ${where}.`
    : `Die Polizei nimmt ${names} fest. Ein Wagen bringt ${ihn} ${where}.`
  const end =
    level === 'leicht'
      ? ` ${er} ${one ? 'kommt' : 'kommen'} bald zurück. Bis dahin könnt ihr von außen helfen.`
      : ` Ob ${one ? (w ? 'sie' : 'er') : 'sie'} zurück${one ? 'kommt' : 'kommen'}, ist ungewiss. Ihr könnt von außen helfen.`
  return {
    id,
    scene: <ArrestScene team={people.map((m) => m.avatar.gender)} atHome={atHome} />,
    caption: start + end,
    stamp: { text: 'Verhaftet', tone: 'blood' },
    sfx: () => (atHome ? sound.knock() : sound.cellDoor()),
  }
}

/** Zwei Unterstützer stehen vor der Tür und bleiben in der Gruppe */
function arrivalShot(people: Character[]): Shot {
  const names = joinNames(people.map(firstName))
  return {
    id: 'neu-dabei',
    scene: <ArrivalScene team={people.map((m) => m.avatar.gender)} />,
    caption: `Jetzt ist niemand mehr frei. Am Abend klopft es leise. Vor der Tür stehen ${names}. Sie haben euch bisher heimlich mit Geld geholfen. „Wir haben gehört, was passiert ist. Wir machen mit.“`,
    stamp: { text: 'Neu dabei', tone: 'ink' },
    sfx: () => sound.knock(true),
  }
}

/** Die Nacht der Einsätze: jede Aktion als kurze Szene, am Ende der Stempel */
export function NightSequence({ report, members, onDone }: { report: WeekReport; members: Character[]; onDone: () => void }) {
  const missions = useMissions()
  const level = useLevel()
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
    },
    ...results.flatMap((r): Shot[] => {
      const team = r.team.map(byId).filter((m): m is Character => !!m)
      const outcome: SceneOutcome = r.detected ? 'entdeckt' : r.outcome
      const mission: Shot = {
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
        roll: { chance: r.chance, roll: r.roll, risk: r.risk, detectRoll: r.detectRoll },
        sfx: outcome === 'entdeckt' ? () => sound.whistle(1.4) : undefined,
      }
      const caught = r.arrested.map(byId).filter((m): m is Character => !!m)
      return caught.length ? [mission, arrestShot(`${r.uid}-haft`, caught, false, level)] : [mission]
    }),
    // Wer zu bekannt war, wird am Morgen zu Hause abgeholt, auch ohne entdeckt worden zu sein
    ...(report.heatArrests.length
      ? [arrestShot('abgeholt', report.heatArrests.map(byId).filter((m): m is Character => !!m), true, level)]
      : []),
    // Leichte Stufe: Ist niemand mehr frei, springen Unterstützer ein. Das soll man sehen, nicht nur lesen.
    ...(report.recruited.length ? [arrivalShot(report.recruited.map(byId).filter((m): m is Character => !!m))] : []),
    {
      id: 'morgen',
      scene: <MorningScene weather={weather} troubled={detected || arrested} />,
      caption: morning,
    },
  ]
  return <Cinema shots={shots} label="Die Nacht der Einsätze" onDone={onDone} doneLabel="Zum Bericht" />
}
