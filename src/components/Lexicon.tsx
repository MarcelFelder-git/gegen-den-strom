import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import s from '../styles/period.module.css'
import { Modal } from './ui/Modal'
import { LEXICON } from '../game/data/lexicon'
import { useUi } from '../store/UiStore'
import { useGame } from '../store/GameStore'
import { t } from '../game/text'

/** Kleines Wörterbuch der schwierigen Begriffe */
export function Lexicon() {
  const { lexiconId, close } = useUi()
  const target = useRef<HTMLElement>(null)
  // Vor dem Spiel gilt die gewählte Stufe, im Spiel die Stufe des Spielstands
  const phase = useGame((g) => g.phase)
  const gameLevel = useGame((g) => g.level)
  const draftLevel = useUi((u) => u.draftLevel)
  const level = phase === 'title' || phase === 'creation' ? draftLevel : gameLevel

  useEffect(() => {
    target.current?.scrollIntoView({ block: 'center' })
  }, [lexiconId])

  return (
    <Modal label="Worterklärungen" onClose={close} width="max-w-2xl">
      <div className={`${s.paper} relative px-5 py-7 sm:px-9`}>
        <button
          onClick={close}
          className="absolute top-3 right-3 grid h-10 w-10 place-items-center border-2 border-ink bg-paper hover:bg-ink hover:text-paper"
          aria-label="Worterklärungen schließen"
        >
          <X size={20} aria-hidden />
        </button>
        <p className={`${s.typewriter} text-xs tracking-[0.15em] text-slate uppercase`}>Für das Geschichtsheft</p>
        <h2 className="mt-1 font-serif text-3xl font-bold">Worterklärungen</h2>
        <dl className="mt-5 divide-y divide-ink/25">
          {LEXICON.map((e) => {
            const active = e.id === lexiconId
            return (
              <div
                key={e.id}
                ref={active ? (el) => { target.current = el } : undefined}
                className={`py-3 ${active ? '-mx-3 border-l-4 border-crimson bg-paper-dark px-3' : ''}`}
              >
                <dt className="font-serif text-xl font-bold">{e.term}</dt>
                <dd className="mt-1 font-serif text-[16px] leading-relaxed">{t(e.text, level)}</dd>
              </div>
            )
          })}
        </dl>
      </div>
    </Modal>
  )
}
