import { HandHeart, Mail, X } from 'lucide-react'
import s from '../styles/period.module.css'
import { Avatar } from './Avatar'
import { Modal } from './ui/Modal'
import type { HelpedPerson } from '../game/data/helped'
import type { AvatarConfig } from '../game/types'
import { useGame } from '../store/GameStore'
import { useUi } from '../store/UiStore'
import { useWeeks } from '../store/content'

/** Die Wand der Menschen, denen die Gruppe beigestanden hat: Gesichter statt einer Zahl */
export function HelpedWall() {
  const close = useUi((u) => u.close)
  const people = useGame((g) => g.helpedPeople)
  const helped = useGame((g) => g.helped)
  const groupName = useGame((g) => g.groupName)
  const weeks = useWeeks()
  const named = people.reduce((sum, p) => sum + p.count, 0)
  const unnamed = Math.max(0, helped - named)
  const newestFirst = [...people].reverse()

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
            : 'Hinter jeder Zahl steht ein Mensch. Die Namen sind erfunden, ihre Lage war damals Alltag in Berlin.'}
        </p>

        {people.length > 0 && (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {newestFirst.map((p) => (
              <PersonCard key={p.id} p={p} when={weeks[p.week]?.dateLabel.replace('Woche vom ', '') ?? ''} />
            ))}
          </ul>
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
      <span className="relative shrink-0">
        <Avatar config={p.avatar} size={56} title="" />
        {p.count > 1 && (
          <span className="absolute -right-2 -bottom-2 grid h-7 min-w-7 place-items-center rounded-full border-2 border-paper bg-group px-1 font-type text-xs font-bold text-paper">
            {p.count}
          </span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block font-serif text-lg leading-tight font-bold">{p.name}</span>
        <span className="mt-0.5 block font-serif text-[15px] leading-snug">{p.who}</span>
        <span className="mt-1 flex items-center gap-1.5 font-type text-xs text-slate">
          {when}
          {p.letter && (
            <span className="inline-flex items-center gap-1 text-group">
              <Mail size={12} aria-hidden /> hat geschrieben
            </span>
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

/** Post im Wochenbericht: ein Brief von jemandem, dem die Gruppe früher geholfen hat */
export function LetterCard({ letter, when }: { letter: { name: string; who: string; avatar: AvatarConfig; text: string }; when: string }) {
  return (
    <section className={`${s.riseIn} mt-5 border-2 border-group bg-[#e4ece9] p-4 sm:p-5`} aria-labelledby="post-titel">
      <p id="post-titel" className="flex items-center gap-2 font-type text-xs font-bold tracking-[0.12em] text-group uppercase">
        <Mail size={16} aria-hidden /> Post für die Gruppe
      </p>
      <div className="mt-3 flex gap-4">
        <span className="shrink-0 -rotate-2 border border-ink/40 bg-paper p-1.5 shadow-[3px_4px_0_rgba(28,28,30,0.2)]">
          <Avatar config={letter.avatar} size={64} title="" />
        </span>
        <div className="min-w-0">
          <p className="font-serif text-lg font-bold">{letter.name}</p>
          <p className="font-type text-xs text-slate">{letter.who}</p>
          {when && <p className="font-type text-xs text-slate">Eure Hilfe: {when}</p>}
          <p className="mt-2 font-serif text-[17px] leading-relaxed italic">{letter.text}</p>
        </div>
      </div>
    </section>
  )
}
