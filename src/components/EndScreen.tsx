import { Medal, Printer } from 'lucide-react'
import s from '../styles/period.module.css'
import { Avatar } from './Avatar'
import { StampButton } from './ui/StampButton'
import { CARDS } from '../game/data/cards'
import { quoted } from '../game/data/group'
import { chapterOf } from '../game/data/chapters'
import { HONEST_NOTE, fateOf, leaderFate } from '../game/data/fates'
import { firstName } from '../game/logic'
import type { Character } from '../game/types'
import { selectLeader, useGame } from '../store/GameStore'
import { useUi } from '../store/UiStore'

export function EndScreen({ onNewGame }: { onNewGame: () => void }) {
  const { endReason, history, supporters, moral, members, weekIndex, sourceAnswers, cards, ideology, continueToChapter2, groupName } = useGame()
  const leader = useGame(selectLeader)
  const { openLexicon, openAlbum, resetCutscenes } = useUi()

  const chapter = chapterOf(weekIndex)
  const results = history.flatMap((h) => h.results)
  const succeeded = results.filter((r) => r.outcome === 'gelungen').length
  const hidden = results.filter((r) => r.type === 'unterschlupf' && r.outcome === 'gelungen').length
  const answers = Object.values(sourceAnswers)
  const rightAnswers = answers.filter(Boolean).length

  const survived = endReason === 'kapitelende'
  const canContinue = survived && chapter.id === 1
  const title = survived
    ? chapter.id === 1
      ? 'Ende des ersten Kapitels'
      : 'Ende des zweiten Kapitels'
    : endReason === 'moral'
      ? 'Die Gruppe zerbricht'
      : 'Verhaftet'
  const stamp = survived ? 'Überstanden' : endReason === 'moral' ? 'Aufgelöst' : 'Schutzhaft'
  const year = chapter.id === 1 ? '1933' : 'diesen Jahren'

  const verdict = !survived
    ? null
    : supporters >= 30
      ? {
          head: 'Ein Netz, das trägt',
          text: 'Aus einer Küche voller Menschen ist ein Netz geworden, das sich über halb Berlin spannt. Mehr als dreißig Menschen wissen nun, dass sie nicht allein sind. Das ist mehr, als die meisten gewagt haben.',
        }
      : supporters >= 15
        ? {
            head: 'Ein Funke in der Dunkelheit',
            text: 'Deine Gruppe hat durchgehalten. In einigen Straßen erzählt man sich leise von den Flugblättern und den Parolen an den Wänden. Die Angst ist groß, aber sie ist nicht überall.',
          }
        : {
            head: 'Wenige, aber nicht allein',
            text: 'Ihr seid nur eine Handvoll geblieben. Aber ihr habt nicht weggesehen. In einer Zeit, in der fast alle schweigen, ist auch das schon Widerstand.',
          }

  const ending = survived
    ? verdict!.text
    : endReason === 'moral'
      ? `Die Angst war stärker. Einer nach dem anderen blieb den Treffen fern. Zuletzt saß niemand mehr am Küchentisch. Viele Gruppen wie deine sind in ${year} so zerfallen, ohne dass jemand sie verraten musste. Die Einschüchterung allein genügte.`
      : `Am frühen Morgen klopfte es an die Tür. Zwei Männer in Mänteln, ein Wagen mit laufendem Motor vor dem Haus. ${leader ? firstName(leader) : 'Du'} wurde in Schutzhaft genommen. So erging es in ${year} Zehntausenden Menschen in Deutschland, die sich nicht fügen wollten.`

  const next = () => {
    resetCutscenes()
    continueToChapter2()
  }

  return (
    <main className={`${s.vignette} min-h-dvh px-4 py-8 sm:py-14`}>
      <article className={`${s.paper} ${s.riseIn} mx-auto max-w-3xl px-5 py-8 sm:px-10`}>
        <header className="flex flex-col items-center text-center">
          <p className={`${s.typewriter} text-sm tracking-[0.3em] text-slate uppercase`}>{chapter.title}</p>
          <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">{title}</h1>
          <p className="mt-1 font-serif text-lg italic">Widerstandsgruppe {quoted(groupName)}</p>
          <span className={`${s.rubber} ${s.stampIn} mt-4 text-xl ${survived ? 'text-ink' : 'text-crimson'}`}>{stamp}</span>
          {leader && (
            <div className="mt-6">
              <Avatar config={leader.avatar} size={120} title={`Porträt von ${leader.name}`} crossed={endReason === 'verhaftet'} />
            </div>
          )}
        </header>

        {verdict && <h2 className="mt-6 text-center font-serif text-2xl font-bold italic">{verdict.head}</h2>}
        <p className="mt-3 font-serif text-lg leading-relaxed">{ending}</p>

        {canContinue && (
          <div className="mt-6 border-2 border-ink bg-paper-dark p-5 text-center">
            <p className="font-serif text-lg">
              Die Geschichte geht weiter. Drei Jahre später, im März 1936, lebt deine Gruppe noch. Die Olympischen Spiele
              stehen bevor, und die Verfolgung wird schlimmer.
            </p>
            <StampButton variant="ink" onClick={next} className="mt-4" data-autofocus>
              Weiter mit Kapitel 2: 1936 bis 1938
            </StampButton>
          </div>
        )}

        <dl className={`${s.typewriter} mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3`}>
          <Fact label="Wochen gespielt" value={history.length} />
          <Fact label="Gelungene Aufträge" value={`${succeeded} von ${results.length}`} />
          <Fact label="Verfolgte versteckt" value={hidden} />
          <Fact label="Unterstützer" value={supporters} />
          <Fact label="Quellen richtig" value={`${rightAnswers} von ${answers.length}`} />
          <Fact label="Vorbilder entdeckt" value={`${cards.length} von ${CARDS.length}`} />
        </dl>
        <p className={`${s.typewriter} mt-3 text-sm text-slate`}>Moral der Gruppe zuletzt: {moral}%.</p>

        <section className="mt-8 border-t-2 border-ink pt-6" aria-labelledby="schicksale">
          <h2 id="schicksale" className="font-serif text-2xl font-bold">
            Was aus euch wahrscheinlich geworden wäre
          </h2>
          <p className="mt-1 font-serif text-[15px] italic text-sepia">
            Die Figuren sind erfunden. Ihre Wege sind es nicht: So erging es vielen Menschen in ihrer Lage.
          </p>
          <ul className="mt-4 space-y-4">
            {leader && (
              <Fate name={`${leader.name} (du)`} avatar={leader} text={leaderFate(ideology, leader.status === 'verhaftet')} />
            )}
            {members
              .filter((m) => !m.isLeader)
              .map((m) => (
                <Fate key={m.id} name={m.name} avatar={m} text={fateOf(m)} />
              ))}
          </ul>
          <p className="mt-5 border-l-4 border-crimson pl-4 font-serif text-[17px] leading-relaxed">{HONEST_NOTE}</p>
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
                  Trotzdem gab es bis 1945 immer wieder Menschen, die Widerstand leisteten. In deinem Album der Vorbilder
                  findest du einige von ihnen. Viele bezahlten ihren Mut mit dem Leben.
                </p>
              </>
            ) : (
              <>
                <p>
                  Im September 1939 begann Deutschland den Zweiten Weltkrieg. Ab Oktober 1941 wurden die jüdischen
                  Berlinerinnen und Berliner deportiert. Rund 55.000 von ihnen wurden ermordet. Nur etwa 1.500 überlebten
                  versteckt in der Stadt, mit Hilfe von Menschen, die sie nicht verrieten.
                </p>
                <p>
                  Am 20. Juli 1944 scheiterte ein Anschlag von Offizieren auf Hitler. Am 8. Mai 1945 endete der Krieg in
                  Europa.
                </p>
              </>
            )}
            <p>
              Die Gedenkstätte Deutscher Widerstand in der Stauffenbergstraße, die Gedenkstätte Stille Helden und die
              Topographie des Terrors auf dem Gelände der früheren Gestapo-Zentrale erzählen von diesen Menschen.
            </p>
          </div>
        </section>

        <section className="mt-8 border-2 border-ink p-5" aria-labelledby="nachdenken">
          <h2 id="nachdenken" className={`${s.typewriter} text-sm font-bold tracking-[0.2em] uppercase`}>
            Zum Nachdenken
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 font-serif text-[17px] leading-relaxed">
            <li>Welche Entscheidung ist dir im Spiel am schwersten gefallen? Warum?</li>
            <li>Die Zeitung berichtete über die Lager und die Verhaftungen. Warum haben trotzdem so wenige Menschen widersprochen?</li>
            <li>Was bedeutet es heute, nicht wegzusehen, wenn andere ausgegrenzt werden?</li>
          </ol>
        </section>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <StampButton variant={canContinue ? 'paper' : 'ink'} onClick={onNewGame} data-autofocus={canContinue ? undefined : true}>
            Neues Spiel
          </StampButton>
          <StampButton onClick={openAlbum}>
            <Medal size={16} aria-hidden /> Vorbilder
          </StampButton>
          <StampButton onClick={() => window.print()}>
            <Printer size={16} aria-hidden /> Abschlussblatt drucken
          </StampButton>
          <StampButton onClick={() => openLexicon()}>Worterklärungen</StampButton>
        </div>
      </article>
    </main>
  )
}

function Fate({ name, avatar, text }: { name: string; avatar: Character; text: string }) {
  return (
    <li className="flex gap-3">
      <Avatar config={avatar.avatar} size={52} title="" crossed={avatar.status === 'verhaftet'} />
      <div>
        <p className="font-serif text-lg leading-tight font-bold">
          {name}
          {avatar.status === 'verhaftet' && <span className="ml-2 font-type text-xs text-crimson">verhaftet</span>}
          {avatar.status === 'ausgewandert' && <span className="ml-2 font-type text-xs text-sepia">ausgewandert</span>}
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
