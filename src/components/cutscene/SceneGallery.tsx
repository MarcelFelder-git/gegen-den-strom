import c from './cinema.module.css'
import { EventScene, MissionScene, NightfallScene, MorningScene, CalendarScene } from './scenes'
import { WEEKS } from '../../game/data/weeks'
import type { MissionType } from '../../game/types'

const MISSION_TYPES: MissionType[] = [
  'spenden', 'papier', 'druck', 'verteilen', 'parolen', 'unterschlupf', 'ausweise',
  'presse', 'transport', 'keller', 'zeitung', 'rotehilfe', 'warnung', 'nachrichten', 'sportverein',
]
const WEATHERS = ['schnee', 'regen', 'nebel', 'klar'] as const
const OUTCOMES = ['gelungen', 'entdeckt', 'gescheitert'] as const
const TEAMS: ('m' | 'w')[][] = [['m'], ['w', 'm'], ['m', 'w', 'w']]

/** Nur im Entwicklungsmodus: alle Szenen auf einen Blick (?szenen) */
export default function SceneGallery() {
  const onlyMissions = new URLSearchParams(location.search).get('szenen') === 'einsatz'
  const all = [
    ...WEEKS.map((w, i) => ({ id: `${i + 1}: ${w.illustration}`, node: <EventScene kind={w.illustration} /> })),
    ...MISSION_TYPES.map((t, i) => ({
      id: `${t}, ${WEATHERS[i % 4]}, ${OUTCOMES[i % 3]}, ${TEAMS[i % 3].length} Pers.`,
      node: <MissionScene type={t} team={TEAMS[i % 3]} weather={WEATHERS[i % 4]} outcome={OUTCOMES[i % 3]} seed={i} />,
    })),
    { id: 'nacht', node: <NightfallScene weekIndex={3} weather="schnee" /> },
    { id: 'morgen', node: <MorningScene weather="regen" troubled /> },
    { id: 'kalender', node: <CalendarScene from={null} to={WEEKS[2].calendar} reduced /> },
  ]
  const items = onlyMissions ? all.slice(WEEKS.length) : all
  return (
    <div className="grid grid-cols-3 gap-3 bg-black p-3">
      {items.map((it) => (
        <figure key={it.id} className="m-0">
          <div className={c.screen} style={{ width: '100%', animation: 'none' }}>
            {it.node}
          </div>
          <figcaption className="font-type text-xs text-fog">{it.id}</figcaption>
        </figure>
      ))}
    </div>
  )
}
