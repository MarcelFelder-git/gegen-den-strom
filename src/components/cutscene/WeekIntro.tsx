import { Cinema, usePrefersReducedMotion, type Shot } from './Cinema'
import { CalendarScene, EventScene, FoundingScene, NightfallScene } from './scenes'
import { quoted } from '../../game/data/group'
import { WEEKS } from '../../game/data/weeks'
import { CHAPTERS } from '../../game/data/chapters'
import { L, t, type Level } from '../../game/text'
import { useLevel } from '../../store/content'
import { sound } from '../../audio/sound'

/** Was zwischen den beiden Kapiteln geschah, 1934 und 1935 im Zeitraffer */
function interlude(level: Level): Shot[] {
  return [
    {
      id: 'zwischen-1934-juni',
      scene: <NightfallScene weekIndex={3} weather="nebel" />,
      caption: t(
        L(
          '30. Juni 1934. Hitler lässt die Führung der SA und viele andere Gegner ermorden. Die Zeitungen lügen: Man habe einen Umsturz verhindert.',
          '30. Juni 1934. Hitler lässt die Führung der SA und viele andere Gegner ermorden. Die Zeitungen schreiben, man habe einen Putsch verhindert.',
        ),
        level,
      ),
    },
    {
      id: 'zwischen-1934-august',
      scene: <EventScene kind="gesetz" />,
      caption: t(
        L(
          '2. August 1934. Reichspräsident Hindenburg stirbt. Jetzt ist Hitler Kanzler und Präsident zugleich. Jeder Soldat muss ihm Treue schwören.',
          '2. August 1934. Reichspräsident Hindenburg stirbt. Hitler ist jetzt „Führer und Reichskanzler“. Jeder Soldat muss ihm persönlich Treue schwören.',
        ),
        level,
      ),
    },
    {
      id: 'zwischen-1935',
      scene: <EventScene kind="pass" />,
      caption: t(
        L(
          '15. September 1935. Neue Gesetze nehmen jüdischen Deutschen viele Rechte. Die meisten Nachbarn sagen nichts.',
          '15. September 1935. Die Nürnberger Gesetze nehmen jüdischen Deutschen ihre vollen Bürgerrechte. Die meisten Deutschen nehmen es hin.',
        ),
        level,
      ),
    },
  ]
}

/** Die Gründung der Gruppe, beim Start eines neuen Spiels */
function foundingShots(groupName: string, later: boolean, level: Level): Shot[] {
  const say = (leicht: string, schwer: string) => t(L(leicht, schwer), level)
  return later
    ? [
        {
          id: 'gruendung-1936',
          scene: <FoundingScene />,
          caption: say(
            `Seit drei Jahren trifft sich die Widerstandsgruppe ${quoted(groupName)} heimlich in einer Küche. Viele Freunde von damals sind verhaftet oder geflohen. Ihr seid geblieben.`,
            `Seit drei Jahren trifft sich die Widerstandsgruppe ${quoted(groupName)} heimlich in einer Küche im Hinterhaus. Viele Freunde von damals sind verhaftet oder geflohen. Ihr seid geblieben.`,
          ),
        },
        {
          id: 'regeln-1936',
          scene: <FoundingScene variant="regeln" />,
          caption: say(
            'Eure wichtigste Regel: Wir helfen denen, die verfolgt werden. Auch wenn es uns selbst gut geht.',
            'Eure erste Regel gilt noch immer: Wir helfen denen, die verfolgt werden, auch wenn es uns selbst gut geht.',
          ),
        },
      ]
    : [
        {
          id: 'gruendung',
          scene: <FoundingScene />,
          caption: say(
            'Berlin, im Januar 1933. In einer Küche im Hinterhaus sitzen vier Menschen um einen Tisch. Draußen ziehen Fackeln vorbei.',
            'Berlin, im Januar 1933. In einer Küche im Hinterhaus sitzen vier Menschen um einen Tisch. Draußen ziehen Fackeln vorbei.',
          ),
        },
        {
          id: 'gruendung-name',
          scene: <FoundingScene />,
          caption: say(
            `Den vier geht es gut. Niemand verfolgt sie. Sie könnten wegsehen. Aber sie wollen nicht schweigen. Ab heute sind sie eine Widerstandsgruppe: ${quoted(groupName)}.`,
            `Keiner von ihnen wird verfolgt. Sie könnten sich heraushalten, wie so viele. Sie beschließen, es nicht zu tun. Von heute an sind sie eine Widerstandsgruppe: ${quoted(groupName)}.`,
          ),
        },
        {
          id: 'gruendung-regeln',
          scene: <FoundingScene variant="regeln" />,
          caption: say(
            'Ihre erste Regel: Wir helfen denen, die verfolgt werden. Dann: Jeder bekommt einen Decknamen. Keiner schreibt Namen auf. Wer verhaftet wird, verrät niemanden.',
            'Ihre erste Regel: Wir helfen denen, die verfolgt werden. Dann die Regeln der Vorsicht: Decknamen statt echter Namen, nichts aufschreiben, niemanden verraten. Den Zettel verbrennen sie noch am selben Abend.',
          ),
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
  const level = useLevel()
  const week = WEEKS[weekIndex]
  const chapterStart = weekIndex === 0 || weekIndex === CHAPTERS[2].first
  const from = chapterStart ? null : WEEKS[weekIndex - 1].calendar
  const to = week.calendar
  const year = to.year ?? 1933
  const shots: Shot[] = [
    ...(founding ? foundingShots(groupName, weekIndex >= CHAPTERS[2].first, level) : []),
    ...(weekIndex === CHAPTERS[2].first ? interlude(level) : []),
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
      caption: t(week.intertitle, level),
      ambience: ['tor', 'reichstag', 'buecher', 'synagoge', 'stadion'].includes(week.illustration) ? 'feuer' : undefined,
    },
  ]
  return <Cinema shots={shots} label={`Wochenschau: ${week.dateLabel}`} onDone={onDone} doneLabel="Zur Zeitung" />
}
