import { useState } from 'react'
import { ExternalLink, Lock, X } from 'lucide-react'
import s from '../styles/period.module.css'
import { Modal } from './ui/Modal'
import { StampButton } from './ui/StampButton'
import { CARDS, getCard, type HeroCard } from '../game/data/cards'
import { useGame } from '../store/GameStore'
import { useUi } from '../store/UiStore'

const initials = (name: string) =>
  name
    .replace(/^Die /, '')
    .split(/\s+/)
    .filter((w) => /^[A-ZÄÖÜ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

/** Ein Siegel mit Initialen. Bewusst kein Porträt: Wir erfinden keine Gesichter echter Menschen. */
function Seal({ card, size = 64 }: { card: HeroCard; size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden className="shrink-0">
      <circle cx="32" cy="32" r="30" fill="#1c1c1e" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="#f4f1ea" strokeWidth="1" strokeDasharray="2 2" />
      <text x="32" y="40" textAnchor="middle" fontFamily="Old Standard TT, Georgia, serif" fontWeight="700" fontSize="22" fill="#f4f1ea">
        {initials(card.name)}
      </text>
    </svg>
  )
}

export function HeroCardView({ card }: { card: HeroCard }) {
  return (
    <article className={`${s.paper} p-5`}>
      <header className="flex items-center gap-4 border-b-2 border-ink pb-3">
        <Seal card={card} />
        <div>
          <p className="font-type text-[11px] font-bold tracking-[0.2em] text-crimson uppercase">Ein echtes Vorbild</p>
          <h3 className="font-serif text-2xl leading-tight font-bold">{card.name}</h3>
          <p className="font-type text-sm text-slate">
            {card.years}, {card.role}
          </p>
        </div>
      </header>
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
          <dt className="font-type text-xs font-bold tracking-[0.15em] uppercase">Was aus ihm oder ihr wurde</dt>
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
    </article>
  )
}

/** Neu entdeckte Karten, direkt nach dem Ereignis */
export function CardReveal() {
  const pending = useGame((g) => g.pendingCards)
  const dismiss = useGame((g) => g.dismissCards)
  const cards = pending.map(getCard).filter((c): c is HeroCard => !!c)
  if (cards.length === 0) return null
  return (
    <Modal label="Ein Vorbild entdeckt" width="max-w-2xl">
      <div className={`${s.riseIn} space-y-4`}>
        <p className="text-center font-type text-sm font-bold tracking-[0.25em] text-paper uppercase">
          {cards.length === 1 ? 'Ein Vorbild entdeckt' : `${cards.length} Vorbilder entdeckt`}
        </p>
        {cards.map((c) => (
          <HeroCardView key={c.id} card={c} />
        ))}
        <div className="flex justify-center">
          <StampButton variant="ink" onClick={dismiss} data-autofocus>
            Ins Album legen
          </StampButton>
        </div>
      </div>
    </Modal>
  )
}

/** Das Album aller Vorbilder, auch der noch gesperrten */
export function CardAlbum() {
  const unlocked = useGame((g) => g.cards)
  const close = useUi((u) => u.close)
  const [open, setOpen] = useState<HeroCard | null>(null)

  return (
    <Modal label="Vorbilder" onClose={open ? () => setOpen(null) : close} width="max-w-4xl">
      <div className={`${s.paperDark} relative px-5 py-7 sm:px-8`}>
        <button
          onClick={open ? () => setOpen(null) : close}
          className="absolute top-3 right-3 grid h-10 w-10 place-items-center border-2 border-ink bg-paper hover:bg-ink hover:text-paper"
          aria-label={open ? 'Zurück zum Album' : 'Album schließen'}
        >
          <X size={20} aria-hidden />
        </button>
        {open ? (
          <HeroCardView card={open} />
        ) : (
          <>
            <p className="font-type text-xs tracking-[0.3em] text-slate uppercase">Echte Menschen im Widerstand</p>
            <h2 className="mt-1 font-serif text-3xl font-bold">Vorbilder</h2>
            <p className="mt-1 font-type text-sm text-slate">
              {unlocked.length} von {CARDS.length} entdeckt. Gesperrte Karten zeigen, wie du sie findest.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CARDS.map((c) => {
                const have = unlocked.includes(c.id)
                return (
                  <li key={c.id}>
                    {have ? (
                      <button onClick={() => setOpen(c)} className={`${s.chip} flex w-full items-center gap-3 p-3`}>
                        <Seal card={c} size={48} />
                        <span>
                          <span className="block font-serif text-lg leading-tight font-bold">{c.name}</span>
                          <span className="block font-type text-xs text-slate">{c.years}</span>
                        </span>
                      </button>
                    ) : (
                      <div className="flex h-full items-center gap-3 border-2 border-dashed border-slate/60 p-3">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-slate/20 text-slate">
                          <Lock size={18} aria-hidden />
                        </span>
                        <span className="font-type text-xs leading-snug text-slate">{c.hint}</span>
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
