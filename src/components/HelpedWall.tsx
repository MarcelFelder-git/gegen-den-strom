import { useEffect, useState } from 'react'
import { HandHeart, Mail, X } from 'lucide-react'
import s from '../styles/period.module.css'
import { Avatar } from './Avatar'
import { Modal } from './ui/Modal'
import { letterFor, type HelpedPerson } from '../game/data/helped'
import { chapterOf } from '../game/data/chapters'
import type { AvatarConfig } from '../game/types'
import { useGame } from '../store/GameStore'
import { useUi } from '../store/UiStore'
import { useT, useWeeks } from '../store/content'

/**
 * Die Wand der Menschen, denen die Gruppe beigestanden hat: Gesichter statt einer Zahl.
 * Oben die Post, die von ihnen kam, darunter alle Gesichter.
 */
export function HelpedWall() {
  const close = useUi((u) => u.close)
  const people = useGame((g) => g.helpedPeople)
  const helped = useGame((g) => g.helped)
  const groupName = useGame((g) => g.groupName)
  const readLetters = useGame((g) => g.readLetters)
  // Wie viele Briefe schon gelesen waren, bevor die Wand geöffnet wurde: Die übrigen sind neu
  const [readBefore] = useState(() => useGame.getState().lettersRead ?? 0)
  const weeks = useWeeks()
  const t = useT()
  const named = people.reduce((sum, p) => sum + p.count, 0)
  const unnamed = Math.max(0, helped - named)
  const newestFirst = [...people].reverse()
  // Briefe in der Reihenfolge, in der sie ankamen, der neueste oben
  const letters = people
    .filter((p) => p.letter)
    .map((p, i) => ({ p, order: i, week: p.letterWeek ?? p.week }))
    .sort((a, b) => b.week - a.week || b.order - a.order)
  const lettersInOrder = [...letters].sort((a, b) => a.week - b.week || a.order - b.order)
  const isNew = (id: string) => lettersInOrder.findIndex((l) => l.p.id === id) >= readBefore

  useEffect(() => {
    readLetters()
  }, [readLetters])

  const dateOf = (week: number) => weeks[week]?.dateLabel.replace('Woche vom ', '') ?? ''

  return (
    <Modal label="Menschen, denen ihr geholfen habt" onClose={close} width="max-w-4xl">
      <div className={`${s.paper} relative px-5 py-7 sm:px-9`}>
        <button
          onClick={close}
          className="absolute top-3 right-3 grid h-11 w-11 place-items-center border-2 border-ink bg-paper hover:bg-ink hover:text-paper"
          aria-label="Schließen"
        >
          <X size={20} aria-hidden />
        </button>
        <p className={`${s.typewriter} flex items-center gap-1.5 text-xs font-bold tracking-[0.12em] text-group uppercase`}>
          <HandHeart size={15} aria-hidden /> Gruppe „{groupName}“
        </p>
        <h2 className="mt-1 pr-12 font-serif text-3xl leading-tight font-bold">
          {helped === 0 ? 'Noch habt ihr niemandem geholfen' : `${helped} ${helped === 1 ? 'Mensch' : 'Menschen'}, denen ihr beigestanden habt`}
        </h2>
        <p className="mt-2 max-w-2xl font-serif text-[17px] leading-relaxed text-sepia">
          {helped === 0
            ? 'Aufträge mit einem Herz und viele Entscheidungen helfen verfolgten Menschen. Hier erscheinen ihre Gesichter.'
            : 'Hinter jeder Zahl steht ein Mensch. Die Namen sind erfunden, ihre Lage war damals Alltag in Berlin. Manchmal kommt Post von ihnen.'}
        </p>

        {letters.length > 0 && (
          <section className="mt-6" aria-labelledby="post-wand">
            <h3 id="post-wand" className={`${s.typewriter} flex items-center gap-2 text-sm font-bold tracking-[0.1em] text-group uppercase`}>
              <Mail size={16} aria-hidden /> Post ({letters.length})
            </h3>
            <ul className="mt-2 space-y-3">
              {letters.map(({ p, week }) => (
                <li key={p.id} id={`brief-${p.id}`}>
                  <LetterCard
                    letter={{ name: p.name, who: p.who, avatar: p.avatar, text: t(letterFor(p, chapterOf(week).id === 2)) }}
                    when={dateOf(p.week)}
                    arrived={dateOf(week)}
                    fresh={isNew(p.id)}
                    compact
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {people.length > 0 && (
          <>
            <h3 className={`${s.typewriter} mt-7 flex items-center gap-2 text-sm font-bold tracking-[0.1em] text-group uppercase`}>
              <HandHeart size={16} aria-hidden /> Alle Gesichter
            </h3>
            <ul className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {newestFirst.map((p) => (
                <PersonCard key={p.id} p={p} when={dateOf(p.week)} />
              ))}
            </ul>
          </>
        )}
        {unnamed > 0 && (
          <p className={`${s.typewriter} mt-4 text-sm text-slate`}>
            Dazu {unnamed} {unnamed === 1 ? 'weiterer Mensch' : 'weitere Menschen'} aus älteren Wochen.
          </p>
        )}
      </div>
    </Modal>
  )
}

function PersonCard({ p, when }: { p: HelpedPerson; when: string }) {
  return (
    <li className={`${s.riseIn} flex gap-3 border border-ink/30 bg-paper-dark p-3`}>
      <span className="shrink-0 self-start">
        <Avatar config={p.avatar} size={56} title="" />
      </span>
      <span className="min-w-0">
        <span className="block font-serif text-lg leading-tight font-bold">{p.name}</span>
        <span className="mt-0.5 block font-serif text-[15px] leading-snug">{p.who}</span>
        {p.count > 1 && <span className="mt-0.5 block font-type text-xs font-bold text-group">{p.count} Menschen</span>}
        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-type text-xs text-slate">
          {when}
          {p.letter && (
            <button
              onClick={() => document.getElementById(`brief-${p.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="tap-area inline-flex items-center gap-1 font-bold text-group underline decoration-dotted underline-offset-2"
            >
              <Mail size={12} aria-hidden /> Brief lesen
            </button>
          )}
        </span>
      </span>
    </li>
  )
}

/** Eine Reihe kleiner Gesichter, etwa auf dem Abschlussbildschirm */
export function HelpedFaces({ people, max = 12 }: { people: { id: string; avatar: AvatarConfig; name: string }[]; max?: number }) {
  const shown = people.slice(-max)
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Gesichter der Menschen, denen ihr geholfen habt">
      {shown.map((p) => (
        <li key={p.id} title={p.name}>
          <Avatar config={p.avatar} size={40} title={p.name} />
        </li>
      ))}
    </ul>
  )
}

/** Ein Brief von jemandem, dem die Gruppe früher geholfen hat: im Wochenbericht und in der Post der Gesichter-Wand */
export function LetterCard({
  letter,
  when,
  arrived,
  fresh = false,
  compact = false,
}: {
  letter: { name: string; who: string; avatar: AvatarConfig; text: string }
  when: string
  arrived?: string
  fresh?: boolean
  compact?: boolean
}) {
  return (
    <section className={`${s.riseIn} ${compact ? '' : 'mt-5'} relative border-2 border-group bg-[#e4ece9] p-4 sm:p-5`} aria-label={`Brief von ${letter.name}`}>
      {!compact && (
        <p className="flex items-center gap-2 font-type text-xs font-bold tracking-[0.12em] text-group uppercase">
          <Mail size={16} aria-hidden /> Post für die Gruppe
        </p>
      )}
      {fresh && (
        <span className={`${s.rubber} absolute top-3 right-3 bg-paper text-xs text-group`} style={{ transform: 'rotate(4deg)' }}>
          Neu
        </span>
      )}
      <div className={`${compact ? '' : 'mt-3'} flex gap-4`}>
        <span className="shrink-0 -rotate-2 self-start border border-ink/40 bg-paper p-1.5 shadow-[3px_4px_0_rgba(28,28,30,0.2)]">
          <Avatar config={letter.avatar} size={compact ? 52 : 64} title="" />
        </span>
        <div className="min-w-0 pr-10">
          <p className="font-serif text-lg font-bold">{letter.name}</p>
          <p className="font-type text-xs text-slate">{letter.who}</p>
          <p className="font-type text-xs text-slate">
            {when && `Eure Hilfe: ${when}`}
            {arrived && ` · Post aus der Woche vom ${arrived}`}
          </p>
          <p className="mt-2 font-serif text-[17px] leading-relaxed italic">{letter.text}</p>
          {!compact && (
            <p className="mt-2 font-type text-xs text-slate">Alle Briefe findet ihr jederzeit oben unter „Geholfen“.</p>
          )}
        </div>
      </div>
    </section>
  )
}
