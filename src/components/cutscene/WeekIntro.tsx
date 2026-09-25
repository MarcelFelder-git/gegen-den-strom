import { Cinema, usePrefersReducedMotion, type Shot } from './Cinema'
import { CalendarScene, EventScene, FoundingScene, NightfallScene } from './scenes'
import { quoted } from '../../game/data/group'
import { WEEKS } from '../../game/data/weeks'
import { CHAPTERS } from '../../game/data/chapters'
import { sound } from '../../audio/sound'

/** Was zwischen den beiden Kapiteln geschah, 1934 und 1935 im Zeitraffer */
const INTERLUDE: Shot[] = [
  {
    id: 'zwischen-1934-juni',
    scene: <NightfallScene weekIndex={3} weather="nebel" />,
    caption:
      '30. Juni 1934. Hitler lässt die Führung der SA und viele andere Gegner ermorden. Die Zeitungen schreiben, man habe einen Putsch verhindert.',
  },
  {
    id: 'zwischen-1934-august',
    scene: <EventScene kind="gesetz" />,
    caption: '2. August 1934. Reichspräsident Hindenburg stirbt. Hitler ist jetzt „Führer und Reichskanzler“. Jeder Soldat muss ihm persönlich Treue schwören.',
  },
  {
    id: 'zwischen-1935',
    scene: <EventScene kind="pass" />,
    caption: '15. September 1935. Die Nürnberger Gesetze nehmen jüdischen Deutschen ihre vollen Bürgerrechte.',
  },
]

/** Die Gründung der Gruppe, beim Start eines neuen Spiels */
function foundingShots(groupName: string, later: boolean): Shot[] {
  return later
    ? [
        {
          id: 'gruendung-1936',
          scene: <FoundingScene />,
          caption: `Seit drei Jahren trifft sich die Widerstandsgruppe ${quoted(groupName)} heimlich in einer Küche im Hinterhaus. Viele Freunde von damals sind verhaftet oder geflohen. Ihr seid geblieben.`,
        },
        {
          id: 'regeln-1936',
          scene: <FoundingScene variant="regeln" />,
          caption: 'Eure Regeln haben euch bis heute geschützt: Decknamen statt echter Namen. Nichts aufschreiben. Niemanden verraten.',
        },
      ]
    : [
        {
          id: 'gruendung',
          scene: <FoundingScene />,
          caption: 'Berlin, im Januar 1933. In einer Küche im Hinterhaus sitzen vier Menschen um einen Tisch. Draußen ziehen Fackeln vorbei.',
        },
        {
          id: 'gruendung-name',
          scene: <FoundingScene />,
          caption: `Sie beschließen, nicht zu schweigen. Von heute an sind sie eine Widerstandsgruppe und geben sich einen Namen: ${quoted(groupName)}. Sie wollen heimlich gegen das Unrecht handeln.`,
        },
        {
          id: 'gruendung-regeln',
          scene: <FoundingScene variant="regeln" />,
          caption: 'Ihre Regeln: Jeder bekommt einen Decknamen. Niemand schreibt Namen auf. Und wer verhaftet wird, verrät niemanden. Den Zettel mit den Namen verbrennen sie noch am selben Abend.',
        },
      ]
}

/** Wochenschau zu Beginn jeder Woche: Kalender, dann das Ereignis */
export function WeekIntro({
  weekIndex,
  onDone,
  founding = false,
  groupName = '',
}: {
  weekIndex: number
  onDone: () => void
  /** Beim Start eines neuen Spiels zuerst die Gründung der Gruppe zeigen */
  founding?: boolean
  groupName?: string
}) {
  const reduced = usePrefersReducedMotion()
  const week = WEEKS[weekIndex]
  const chapterStart = weekIndex === 0 || weekIndex === CHAPTERS[2].first
  const from = chapterStart ? null : WEEKS[weekIndex - 1].calendar
  const to = week.calendar
  const year = to.year ?? 1933
  const shots: Shot[] = [
    ...(founding ? foundingShots(groupName, weekIndex >= CHAPTERS[2].first) : []),
    ...(weekIndex === CHAPTERS[2].first ? INTERLUDE : []),
    {
      id: `kalender-${weekIndex}`,
      scene: <CalendarScene from={from} to={to} reduced={reduced} />,
      caption:
        weekIndex === 0
          ? 'Berlin, im Winter 1933. Ein neues Jahr hat begonnen.'
          : weekIndex === CHAPTERS[2].first
            ? 'Berlin, im Frühjahr 1936. Die Gruppe gibt es noch.'
            : `${to.weekday}, der ${to.day}. ${to.month} ${year}.`,
      auto: 1600,
      sfx: reduced ? undefined : () => sound.tear(0.55),
    },
    {
      id: `ereignis-${weekIndex}`,
      scene: <EventScene kind={week.illustration} />,
      caption: week.intertitle,
      ambience: ['tor', 'reichstag', 'buecher', 'synagoge', 'stadion'].includes(week.illustration) ? 'feuer' : undefined,
    },
  ]
  return <Cinema shots={shots} label={`Wochenschau: ${week.dateLabel}`} onDone={onDone} doneLabel="Zur Zeitung" />
}
