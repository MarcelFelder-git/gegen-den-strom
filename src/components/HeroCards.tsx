import { useEffect, useRef, useState } from 'react'
import { ExternalLink, Lock, Medal, X } from 'lucide-react'
import s from '../styles/period.module.css'
import h from './heroes.module.css'
import { Modal } from './ui/Modal'
import { StampButton } from './ui/StampButton'
import { CARDS, getCard, type HeroCard } from '../game/data/cards'
import { useGame } from '../store/GameStore'
import { useUi } from '../store/UiStore'
import { useR } from '../store/content'
import type { Resolved } from '../game/text'
import { sound } from '../audio/sound'

type Card = Resolved<HeroCard>

const initials = (name: string) =>
  name
    .replace(/^Die /, '')
    .split(/\s+/)
    .filter((w) => /^[A-ZÄÖÜ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

/** Das Porträt: ein echtes Foto, sonst ein Siegel mit Initialen. Gesichter werden nicht erfunden. */
function Portrait({ card, className = '' }: { card: Card; className?: string }) {
  if (card.photo) {
    return (
      <div className={`${h.portrait} ${className}`}>
        <img src={card.photo.src} alt={card.photo.alt} loading="lazy" decoding="async" className={card.photo.fit === 'contain' ? h.contain : undefined} />
      </div>
    )
  }
  return (
    <div className={`${h.portrait} grid place-items-center ${className}`} aria-hidden>
      <span className="font-serif text-5xl font-bold text-paper">{initials(card.name)}</span>
    </div>
  )
}

export function HeroCardView({ card, number }: { card: Card; number: number }) {
  return (
    <article className={`${h.card} px-5 pt-7 pb-5 sm:px-7`}>
      <span className={h.ribbon}>
        Vorbild {number} von {CARDS.length}
      </span>
      <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
        <div>
          <Portrait card={card} className="aspect-[3/4] w-full max-w-[180px]" />
          {card.photo && (
            <p className="mt-2 font-type text-xs leading-snug text-slate">
              {card.photo.caption}. {card.photo.fit === 'contain' ? 'Quelle' : 'Foto'}: {card.photo.credit}, {card.photo.license}
            </p>
          )}
        </div>
        <div>
          <p className="font-type text-[13px] font-bold tracking-[0.12em] text-crimson uppercase">Ein echter Mensch im Widerstand</p>
          <h3 className="font-serif text-3xl leading-tight font-bold">{card.name}</h3>
          <p className="font-type text-sm text-slate">
            {card.years}, {card.role}
          </p>
          {card.quote && (
            <blockquote className="mt-3 border-l-4 border-[#b08d3c] pl-3 font-serif text-lg leading-snug italic">
              {card.quote.text}
              <footer className="mt-1 font-type text-[13px] text-slate not-italic">{card.quote.source}</footer>
            </blockquote>
          )}
          <dl className="mt-3 space-y-3 font-serif text-[16px] leading-relaxed">
            <div>
              <dt className="font-type text-xs font-bold tracking-[0.15em] uppercase">Was tat dieser Mensch?</dt>
              <dd>{card.deed}</dd>
            </div>
            <div>
              <dt className="font-type text-xs font-bold tracking-[0.15em] uppercase">Und in deinem Spiel?</dt>
              <dd>{card.link}</dd>
            </div>
            <div>
              <dt className="font-type text-xs font-bold tracking-[0.15em] uppercase">Was aus diesem Menschen wurde</dt>
              <dd>{card.fate}</dd>
            </div>
          </dl>
          <a
            href={card.source}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 font-type text-sm text-sepia underline decoration-dotted underline-offset-4 hover:text-ink"
          >
            <ExternalLink size={14} aria-hidden /> Mehr erfahren
          </a>
        </div>
      </div>
    </article>
  )
}

/**
 * Ein neues Vorbild: Der Raum wird dunkel, ein Lichtkegel, die Karte dreht sich herein.
 * Mehrere Karten erscheinen nacheinander.
 */
export function CardReveal() {
  const pending = useGame((g) => g.pendingCards)
  const dismiss = useGame((g) => g.dismissCards)
  const r = useR()
  const cards = pending.map(getCard).filter((c): c is HeroCard => !!c)
  const [index, setIndex] = useState(0)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const card = cards[index]

  useEffect(() => {
    if (!card) return
    sound.honor()
    const t = setTimeout(() => buttonRef.current?.focus({ preventScroll: true }), 1400)
    return () => clearTimeout(t)
  }, [card])

  useEffect(() => {
    if (pending.length === 0) setIndex(0)
  }, [pending.length])

  if (!card) return null
  const last = index >= cards.length - 1
  const next = () => (last ? dismiss() : setIndex(index + 1))

  return (
    <div className={h.stage} role="dialog" aria-modal="true" aria-label={`Neues Vorbild: ${card.name}`}>
      <div className={h.beam} aria-hidden />
      <div className="relative mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center px-4 py-10">
        <p className={`${s.typewriter} ${h.fadeUp} mb-2 flex items-center gap-2 text-sm font-bold tracking-[0.15em] text-[#e0be6e] uppercase`}>
          <Medal size={18} aria-hidden /> Ein Vorbild entdeckt
        </p>
        <p className={`${h.fadeUp} mb-8 max-w-xl text-center font-serif text-lg text-paper/85`}>
          Dieser Mensch hat wirklich gelebt und hat nicht weggesehen.
        </p>
        <div key={card.id} className={`${h.reveal} w-full`}>
          <div className={h.glow}>
            <HeroCardView card={r(card)} number={CARDS.findIndex((c) => c.id === card.id) + 1} />
          </div>
        </div>
        <div className={`${h.fadeUp} mt-8 flex flex-col items-center gap-2`}>
          <StampButton ref={buttonRef} variant="paper" onClick={next}>
            {last ? 'Ins Album legen' : `Nächstes Vorbild (${index + 2} von ${cards.length})`}
          </StampButton>
        </div>
      </div>
    </div>
  )
}

/** Das Album aller Vorbilder, auch der noch gesperrten */
export function CardAlbum() {
  const unlocked = useGame((g) => g.cards)
  const close = useUi((u) => u.close)
  const r = useR()
  const [open, setOpen] = useState<HeroCard | null>(null)

  return (
    <Modal label="Vorbilder" onClose={open ? () => setOpen(null) : close} width="max-w-4xl">
      <div className={`${s.paperDark} relative px-5 py-7 sm:px-8`}>
        <button
          onClick={open ? () => setOpen(null) : close}
          className="absolute top-3 right-3 z-10 grid h-10 w-10 place-items-center border-2 border-ink bg-paper hover:bg-ink hover:text-paper"
          aria-label={open ? 'Zurück zum Album' : 'Album schließen'}
        >
          <X size={20} aria-hidden />
        </button>
        {open ? (
          <div className="pt-4">
            <HeroCardView card={r(open)} number={CARDS.findIndex((c) => c.id === open.id) + 1} />
          </div>
        ) : (
          <>
            <p className="font-type text-xs tracking-[0.15em] text-slate uppercase">Echte Menschen im Widerstand</p>
            <h2 className="mt-1 font-serif text-3xl font-bold">Vorbilder</h2>
            <p className="mt-1 font-type text-sm text-slate">
              {unlocked.length} von {CARDS.length} entdeckt. Gesperrte Karten zeigen, wie du sie findest.
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {CARDS.map((raw, i) => {
                const c = r(raw)
                const have = unlocked.includes(c.id)
                return (
                  <li key={c.id}>
                    {have ? (
                      <button onClick={() => setOpen(raw)} className={`${h.card} flex h-full w-full flex-col items-center p-2.5 text-center !outline-0`}>
                        <Portrait card={c} className="aspect-[3/4] w-full" />
                        <span className="mt-2 block font-serif text-base leading-tight font-bold">{c.name}</span>
                        <span className="block font-type text-[13px] text-slate">{c.years}</span>
                      </button>
                    ) : (
                      <div className="flex h-full flex-col items-center border-2 border-dashed border-slate/60 p-2.5 text-center">
                        <span className="grid aspect-[3/4] w-full place-items-center bg-slate/15 text-slate">
                          <Lock size={22} aria-hidden />
                        </span>
                        <span className="mt-2 font-type text-[13px] font-bold text-slate">Vorbild {i + 1}</span>
                        <span className="font-type text-[13px] leading-snug text-slate">{c.hint}</span>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>
    </Modal>
  )
}
