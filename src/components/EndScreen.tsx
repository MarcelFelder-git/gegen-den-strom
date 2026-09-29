import { HelpedFaces } from './HelpedWall'
import { BookOpen, HandHeart, Medal, Printer, ScrollText } from 'lucide-react'
import s from '../styles/period.module.css'
import { Avatar } from './Avatar'
import { StampButton } from './ui/StampButton'
import { CARDS } from '../game/data/cards'
import { quoted } from '../game/data/group'
import { chapterOf } from '../game/data/chapters'
import { HONEST_NOTE, SOLIDARITY_RATINGS, fateOf, leaderFate } from '../game/data/fates'
import { difficultyOf } from '../game/difficulty'
import { firstName } from '../game/logic'
import type { Character } from '../game/types'
import { selectLeader, useGame } from '../store/GameStore'
import { useUi } from '../store/UiStore'
import { useT } from '../store/content'

/** Welche Stufe der Solidarität die Gruppe in diesem Kapitel erreicht hat */
export function solidarityStage(helped: number, goals: [number, number]): 1 | 2 | 3 {
  if (helped >= goals[1]) return 3
  if (helped >= goals[0]) return 2
  return 1
}

export function EndScreen({ onNewGame, onNewChapter2 }: { onNewGame: () => void; onNewChapter2: () => void }) {
  const { endReason, history, supporters, moral, members, weekIndex, sourceAnswers, cards, ideology, continueToChapter2, groupName, helped, level, chapterHelpedStart } =
    useGame()
  const leader = useGame(selectLeader)
  const { openLexicon, openAlbum, openChronicle, openHelped, resetCutscenes } = useUi()
  const helpedPeople = useGame((g) => g.helpedPeople)
  const t = useT()

  const chapter = chapterOf(weekIndex)
  const diff = difficultyOf(level)
  const results = history.flatMap((h) => h.results)
  const succeeded = results.filter((r) => r.outcome === 'gelungen').length
  const answers = Object.values(sourceAnswers)
  const rightAnswers = answers.filter(Boolean).length
  const chapterHelped = helped - chapterHelpedStart

  const survived = endReason === 'kapitelende'
  const canContinue = survived && chapter.id === 1
  const weeksLeft = survived ? 0 : chapter.last - weekIndex
  const stage = solidarityStage(chapterHelped, diff.helpedGoals[chapter.id])
  const rating = SOLIDARITY_RATINGS[stage - 1]

  const title = survived
    ? chapter.id === 1
      ? 'Ende des ersten Kapitels'
      : 'Ende des zweiten Kapitels'
    : endReason === 'moral'
      ? 'Die Gruppe zerbricht'
      : 'Verhaftet'
  const year = chapter.id === 1 ? '1933' : 'diesen Jahren'

  const ending = survived
    ? t(rating.text)
    : endReason === 'moral'
      ? `Die Angst war stärker. Einer nach dem anderen blieb den Treffen fern. Zuletzt saß niemand mehr am Küchentisch. Viele Gruppen wie deine sind in ${year} so zerfallen, ohne dass jemand sie verraten musste. Die Einschüchterung allein genügte.`
      : `Am frühen Morgen klopfte es an die Tür. Zwei Männer in Mänteln, ein Wagen mit laufendem Motor vor dem Haus. ${leader ? firstName(leader) : 'Du'} wurde in „Schutzhaft“ genommen. So erging es in ${year} Zehntausenden Menschen in Deutschland, die sich nicht fügen wollten.`

  const next = () => {
    resetCutscenes()
    continueToChapter2()
  }

  return (
    <main className={`${s.vignette} min-h-dvh px-4 py-8 sm:py-14`}>
      <article className={`${s.paper} ${s.riseIn} mx-auto max-w-3xl px-5 py-8 sm:px-10`}>
        <header className="flex flex-col items-center text-center">
          <p className={`${s.typewriter} text-sm tracking-[0.15em] text-slate uppercase`}>{chapter.title}</p>
          <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">{title}</h1>
          <p className="mt-1 font-serif text-lg italic">Widerstandsgruppe {quoted(groupName)}</p>
          {leader && (
            <div className="mt-6">
              <Avatar config={leader.avatar} size={120} title={`Porträt von ${leader.name}`} crossed={leader.status === 'tot'} />
            </div>
          )}
        </header>

        {/* Die Bewertung: nicht Sieg oder Niederlage, sondern wie vielen Menschen ihr beigestanden habt */}
        <section className="mt-6 border-4 border-double border-group bg-[#dfe9e8] p-5 text-center text-group" aria-labelledby="solidaritaet">
          <p className="flex items-center justify-center gap-2 font-type text-xs font-bold tracking-[0.12em] uppercase">
            <HandHeart size={16} aria-hidden /> Eure Solidarität in diesem Kapitel
          </p>
          <p className="mt-1 font-serif text-5xl font-bold tabular-nums">{chapterHelped}</p>
          <p className="font-type text-sm">{chapterHelped === 1 ? 'Mensch, dem ihr geholfen habt' : 'Menschen, denen ihr geholfen habt'}</p>
          {helpedPeople.length > 0 && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <HelpedFaces people={helpedPeople} max={14} />
              <button onClick={openHelped} className="font-type text-sm font-bold underline decoration-dotted underline-offset-4">
                Alle Gesichter ansehen
              </button>
            </div>
          )}
          <ol className="mt-4 flex justify-center gap-2" aria-label={`Stufe ${stage} von 3`}>
            {SOLIDARITY_RATINGS.map((r) => (
              <li
                key={r.stage}
                className={`${s.rubber} px-2 text-xs ${r.stage <= stage ? 'border-group text-group' : 'border-slate/40 text-slate/50'}`}
                aria-current={r.stage === stage ? 'step' : undefined}
              >
                {t(r.title)}
              </li>
            ))}
          </ol>
          <h2 id="solidaritaet" className="mt-4 font-serif text-2xl font-bold italic text-ink">
            {t(rating.title)}
          </h2>
        </section>

        <p className="mt-5 font-serif text-lg leading-relaxed">{ending}</p>

        {!survived && weeksLeft > 0 && (
          <div className="mt-6 border-2 border-ink bg-paper-dark p-5">
            <p className="font-serif text-lg">
              Deine Gruppe gibt es nicht mehr. Die Geschichte ging trotzdem weiter. Lies in der Chronik, was in den nächsten {weeksLeft}{' '}
              {weeksLeft === 1 ? 'Woche' : 'Wochen'} geschah.
            </p>
            <StampButton variant="ink" onClick={openChronicle} className="mt-4" data-autofocus>
              <ScrollText size={16} aria-hidden /> Chronik lesen
            </StampButton>
          </div>
        )}

        {canContinue && (
          <div className="mt-6 border-2 border-ink bg-paper-dark p-5 text-center">
            <p className="font-serif text-lg">
              Die Geschichte geht weiter. Drei Jahre später, im März 1936, gibt es deine Gruppe noch. Die Olympischen Spiele stehen
              bevor, und die Verfolgung wird schlimmer.
            </p>
            <StampButton variant="ink" onClick={next} className="mt-4" data-autofocus>
              Weiter mit Kapitel 2: 1936 bis 1938
            </StampButton>
          </div>
        )}
        {!survived && chapter.id === 1 && (
          <p className="mt-4 text-center">
            <button onClick={onNewChapter2} className="font-type text-sm text-sepia underline decoration-dotted underline-offset-4 hover:text-ink">
              Kapitel 2 mit einer neuen Gruppe beginnen
            </button>
          </p>
        )}

        <dl className={`${s.typewriter} mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3`}>
          <Fact label="Wochen gespielt" value={history.length} />
          <Fact label="Gelungene Aufträge" value={`${succeeded} von ${results.length}`} />
          <Fact label="Menschen geholfen" value={helped} />
          <Fact label="Unterstützer" value={supporters} />
          <Fact label="Quellen richtig" value={`${rightAnswers} von ${answers.length}`} />
          <Fact label="Vorbilder entdeckt" value={`${cards.length} von ${CARDS.length}`} />
        </dl>
        <p className={`${s.typewriter} mt-3 text-sm text-slate`}>
          Moral der Gruppe zuletzt: {moral}%. Stufe: {diff.label}.
        </p>

        <section className="mt-8 border-t-2 border-ink pt-6" aria-labelledby="schicksale">
          <h2 id="schicksale" className="font-serif text-2xl font-bold">
            Was aus euch wahrscheinlich geworden wäre
          </h2>
          <p className="mt-1 font-serif text-[15px] text-sepia italic">
            Die Figuren sind erfunden. Ihre Wege sind es nicht: So erging es vielen Menschen in ihrer Lage.
          </p>
          <ul className="mt-4 space-y-4">
            {leader && <Fate name={`${leader.name} (du)`} avatar={leader} text={t(leaderFate(ideology, leader.status))} />}
            {members
              .filter((m) => !m.isLeader)
              .map((m) => (
                <Fate key={m.id} name={m.name} avatar={m} text={t(fateOf(m))} />
              ))}
          </ul>
          <p className="mt-5 border-l-4 border-crimson pl-4 font-serif text-[17px] leading-relaxed">{t(HONEST_NOTE)}</p>
        </section>

        <section className="mt-8 border-t-2 border-ink pt-6" aria-labelledby="danach">
          <h2 id="danach" className="font-serif text-2xl font-bold">
            Wie es weiterging
          </h2>
          <div className="mt-3 space-y-3 font-serif text-[17px] leading-relaxed">
            {chapter.id === 1 ? (
              <>
                <p>
                  Am 22. Juni 1933 wurde die SPD verboten. Seit dem 14. Juli 1933 war die NSDAP die einzige erlaubte Partei in
                  Deutschland. Nach nur sechs Monaten gab es keine erlaubte Opposition mehr.
                </p>
                <p>
                  Trotzdem gab es bis 1945 immer wieder Menschen, die Widerstand leisteten und Verfolgten halfen. In deinem Album der
                  Vorbilder findest du einige von ihnen. Viele bezahlten ihren Mut mit dem Leben.
                </p>
              </>
            ) : (
              <>
                <p>
                  Im September 1939 begann Deutschland den Zweiten Weltkrieg. Ab Oktober 1941 wurden die jüdischen Berlinerinnen und
                  Berliner deportiert. Rund 55.000 von ihnen wurden ermordet. Etwa 1.700 überlebten versteckt in der Stadt, mit Hilfe von
                  Menschen, die sie nicht verrieten.
                </p>
                <p>
                  Am 20. Juli 1944 scheiterte ein Anschlag von Offizieren auf Hitler. Am 8. Mai 1945 endete der Krieg in Europa. Befreit
                  wurde Deutschland von den Alliierten.
                </p>
              </>
            )}
            <p>
              Die Gedenkstätte Deutscher Widerstand in der Stauffenbergstraße, die Gedenkstätte Stille Helden und die Topographie des
              Terrors auf dem Gelände der früheren Gestapo-Zentrale erzählen von diesen Menschen.
            </p>
          </div>
        </section>

        <section className="mt-8 border-2 border-ink p-5" aria-labelledby="nachdenken">
          <h2 id="nachdenken" className={`${s.typewriter} text-sm font-bold tracking-[0.12em] uppercase`}>
            Zum Nachdenken
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 font-serif text-[17px] leading-relaxed">
            <li>Welche Entscheidung ist dir im Spiel am schwersten gefallen? Warum?</li>
            <li>
              Eure Gruppe wurde nicht verfolgt. Ihr hättet sagen können: „Uns geht es doch gut.“ Warum haben die meisten Menschen genau das
              getan?
            </li>
            <li>Was bedeutet es heute, nicht wegzusehen, wenn andere ausgegrenzt werden? Wo erlebst du das?</li>
          </ol>
        </section>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <StampButton variant={canContinue ? 'paper' : 'ink'} onClick={onNewGame} data-autofocus={canContinue || weeksLeft > 0 ? undefined : true}>
            Neues Spiel
          </StampButton>
          <StampButton onClick={openAlbum}>
            <Medal size={16} aria-hidden /> Vorbilder
          </StampButton>
          <StampButton onClick={() => window.print()}>
            <Printer size={16} aria-hidden /> Abschlussblatt drucken
          </StampButton>
          <StampButton onClick={() => openLexicon()}>
            <BookOpen size={16} aria-hidden /> Worterklärungen
          </StampButton>
        </div>
      </article>
    </main>
  )
}

function Fate({ name, avatar, text }: { name: string; avatar: Character; text: string }) {
  const tag =
    avatar.status === 'verhaftet'
      ? 'in Haft'
      : avatar.status === 'lager'
        ? 'verurteilt'
        : avatar.status === 'tot'
          ? 'nicht überlebt'
          : avatar.status === 'ausgewandert'
            ? 'ausgewandert'
            : null
  return (
    <li className="flex gap-3">
      <Avatar config={avatar.avatar} size={52} title="" crossed={avatar.status === 'tot'} />
      <div>
        <p className="font-serif text-lg leading-tight font-bold">
          {name}
          {tag && <span className={`ml-2 font-type text-xs ${avatar.status === 'ausgewandert' ? 'text-sepia' : 'text-crimson'}`}>{tag}</span>}
        </p>
        <p className="mt-0.5 font-serif text-[16px] leading-relaxed">{text}</p>
      </div>
    </li>
  )
}

function Fact({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-ink p-3">
      <dt className="text-xs tracking-[0.12em] text-slate uppercase">{label}</dt>
      <dd className="mt-1 text-xl font-bold">{value}</dd>
    </div>
  )
}
