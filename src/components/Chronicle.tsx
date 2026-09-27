import { useState } from 'react'
import { ArrowLeft, ArrowRight, Archive, GraduationCap, X } from 'lucide-react'
import s from '../styles/period.module.css'
import { Modal } from './ui/Modal'
import { StampButton } from './ui/StampButton'
import { NewsIllustration } from './NewsIllustration'
import { chapterOf } from '../game/data/chapters'
import { SOURCES } from '../game/data/sources'
import { useGame } from '../store/GameStore'
import { useUi } from '../store/UiStore'
import { useR, useWeeks } from '../store/content'

/**
 * Die Chronik: Wurde die Gruppe zerschlagen, lassen sich die restlichen Wochen
 * des Kapitels trotzdem lesen. So verpasst niemand die Ereignisse.
 */
export function Chronicle() {
  const weekIndex = useGame((g) => g.weekIndex)
  const close = useUi((u) => u.close)
  const weeks = useWeeks()
  const r = useR()
  const chapter = chapterOf(weekIndex)
  const indices = Array.from({ length: Math.max(0, chapter.last - weekIndex) }, (_, i) => weekIndex + 1 + i)
  const [page, setPage] = useState(0)

  if (indices.length === 0) return null
  const index = indices[page]
  const w = weeks[index]
  const rawSource = SOURCES[index]
  const src = rawSource ? r(rawSource) : undefined

  return (
    <Modal label={`Chronik: ${w.dateLabel}`} onClose={close} width="max-w-4xl">
      <div className="mb-3 flex items-center justify-between gap-3 text-paper">
        <p className={`${s.typewriter} text-xs tracking-[0.2em] uppercase`}>
          Chronik · {page + 1} von {indices.length}
        </p>
        <button onClick={close} className="grid h-10 w-10 place-items-center border-2 border-paper/60 hover:bg-paper hover:text-ink" aria-label="Chronik schließen">
          <X size={20} aria-hidden />
        </button>
      </div>
      <article className={`${s.newsprint} px-5 py-6 sm:px-8`} key={index}>
        <p className={`${s.typewriter} text-xs tracking-[0.2em] text-slate uppercase`}>{w.dateLabel}</p>
        <h2 className="mt-1 font-serif text-3xl leading-tight font-bold sm:text-4xl">{w.headline}</h2>
        <p className="mt-2 font-serif text-lg italic">{w.subline}</p>
        <div className="mt-4 grid gap-5 md:grid-cols-[1fr_240px]">
          <div>
            <p className="font-serif text-[17px] leading-relaxed">{w.lead}</p>
            {w.articles.map((a) => (
              <section key={a.headline} className="mt-3 border-t border-ink/40 pt-2">
                <h3 className="font-serif text-lg font-bold">{a.headline}</h3>
                <p className="font-serif text-[15px] leading-snug">{a.body}</p>
              </section>
            ))}
          </div>
          <NewsIllustration kind={w.illustration} caption={w.caption} />
        </div>
        <aside className="mt-5 border-2 border-ink bg-paper p-4">
          <p className="flex items-center gap-2 font-type text-xs font-bold tracking-[0.2em] uppercase">
            <GraduationCap size={16} aria-hidden /> Zum Verständnis
          </p>
          <p className="mt-2 font-serif text-[16px] leading-relaxed">{w.context}</p>
        </aside>
        {src && (
          <aside className="mt-4 border-l-4 border-archive bg-paper-dark p-4">
            <p className="flex items-center gap-2 font-type text-xs font-bold tracking-[0.2em] text-archive uppercase">
              <Archive size={16} aria-hidden /> Quelle: {src.title}
            </p>
            <p className="mt-2 font-serif text-[16px] leading-relaxed whitespace-pre-line">{src.text}</p>
            <p className="mt-2 font-serif text-[15px] text-sepia italic">{src.explain}</p>
          </aside>
        )}
        {w.witnesses?.map((wt) => (
          <blockquote key={wt.text} className="mt-4 border-l-4 border-archive-light bg-ink p-4 text-paper">
            <p className="font-type text-[10px] font-bold tracking-[0.2em] text-archive-light uppercase">Zeitzeugenbericht, echt</p>
            <p className="mt-1 font-serif text-lg">{wt.text}</p>
            <footer className="mt-1 font-type text-xs text-fog">
              {wt.who}. Quelle: {wt.source}
            </footer>
          </blockquote>
        ))}
        <p className="mt-5 font-serif text-lg font-bold italic">{w.reflect}</p>
      </article>
      <nav className="mt-3 flex justify-between gap-3">
        <StampButton variant="quiet" className="text-paper" onClick={() => setPage(page - 1)} disabled={page === 0}>
          <ArrowLeft size={16} aria-hidden /> Zurück
        </StampButton>
        {page < indices.length - 1 ? (
          <StampButton variant="ink" onClick={() => setPage(page + 1)} data-autofocus>
            Nächste Woche <ArrowRight size={16} aria-hidden />
          </StampButton>
        ) : (
          <StampButton variant="ink" onClick={close}>
            Chronik schließen
          </StampButton>
        )}
      </nav>
    </Modal>
  )
}
