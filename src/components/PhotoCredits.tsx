import { X } from 'lucide-react'
import s from '../styles/period.module.css'
import { Modal } from './ui/Modal'
import { ALL_PHOTOS } from '../game/data/photos'
import { useUi } from '../store/UiStore'

/** Bildnachweis für alle echten Fotos im Spiel */
export function PhotoCredits() {
  const close = useUi((u) => u.close)
  return (
    <Modal label="Bildnachweis" onClose={close} width="max-w-3xl">
      <div className={`${s.paper} relative px-5 py-7 sm:px-9`}>
        <button
          onClick={close}
          className="absolute top-3 right-3 grid h-10 w-10 place-items-center border-2 border-ink bg-paper hover:bg-ink hover:text-paper"
          aria-label="Bildnachweis schließen"
        >
          <X size={20} aria-hidden />
        </button>
        <h2 className="font-serif text-3xl font-bold">Bildnachweis</h2>
        <p className="mt-2 font-serif text-[16px] leading-relaxed">
          Alle Fotos stammen von Wikimedia Commons, die meisten aus dem Bundesarchiv. Sie sind gemeinfrei oder stehen unter einer
          freien Lizenz, die die Nutzung mit Namensnennung erlaubt (CC BY-SA 3.0, CC BY 3.0, CC0). Die Fotos wurden für die
          Darstellung verkleinert und im Spiel schwarzweiß getönt.
        </p>
        <ul className="mt-5 divide-y divide-ink/25">
          {ALL_PHOTOS.map((p) => (
            <li key={p.src} className="flex gap-3 py-3">
              <img src={p.src} alt="" className="h-16 w-14 shrink-0 object-cover grayscale" loading="lazy" />
              <div className="min-w-0 font-type text-xs leading-relaxed">
                <p className="font-serif text-[15px] font-bold">{p.caption}</p>
                <p>
                  {p.credit}, Lizenz: {p.license}
                </p>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="break-all text-sepia underline decoration-dotted underline-offset-2">
                  {p.url}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  )
}
