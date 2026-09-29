import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import s from '../../styles/period.module.css'
import c from './intro.module.css'
import { StampButton } from '../ui/StampButton'
import { PhotoFigure } from './PhotoFigure'
import { TIMELINE, TIMELINE_INTRO, TIMELINE_OUTRO } from '../../game/data/timeline'
import { resolve, type Level } from '../../game/text'

interface IntroTimelineProps {
  level: Level
  /** Beim direkten Einstieg in Kapitel 2 kommen 1934 und 1935 dazu */
  chapter: 1 | 2
  onDone: () => void
  onBack: () => void
}

/**
 * Das Intro vor dem Spiel: eine Zeitleiste von 1918 bis 1933 mit echten Fotos.
 * Man kann jederzeit vor und zurück blättern.
 */
export function IntroTimeline({ level, chapter, onDone, onBack }: IntroTimelineProps) {
  const entries = useMemo(
    () => resolve(TIMELINE.filter((e) => chapter === 2 || !e.chapter2), level),
    [chapter, level],
  )
  const intro = resolve(TIMELINE_INTRO, level)
  const outro = resolve(TIMELINE_OUTRO, level)
  // Seite 0 ist die Einleitung, danach die Einträge, am Ende eure Rolle
  const pages = entries.length + 2
  const [page, setPage] = useState(0)
  const entry = page > 0 && page <= entries.length ? entries[page - 1] : null
  const last = page === pages - 1

  const go = useCallback(
    (to: number) => {
      if (to < 0) return onBack()
      if (to >= pages) return onDone()
      setPage(to)
    },
    [pages, onBack, onDone],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(page + 1)
      if (e.key === 'ArrowLeft' && page > 0) go(page - 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [go, page])

  // Die Fotos schon beim Lesen der Einleitung laden, damit sie im langsamen Schul-WLAN sofort da sind
  useEffect(() => {
    for (const e of entries) if (e.photo) new Image().src = e.photo.src
  }, [entries])

  return (
    <main className={`${s.vignette} relative flex min-h-dvh flex-col bg-[#101012] px-4 py-5 sm:px-8`} aria-label="Vorgeschichte">
      {/* Zeitleiste oben: jedes Jahr ein Punkt */}
      <nav aria-label="Zeitleiste" className="mx-auto w-full max-w-5xl">
        <ol className="relative flex items-center justify-between gap-1 border-b border-paper/20 pb-3">
          {entries.map((e, i) => {
            const active = page === i + 1
            const done = page > i + 1
            return (
              <li key={e.id} className="flex flex-1 flex-col items-center">
                <button
                  onClick={() => go(i + 1)}
                  aria-current={active ? 'step' : undefined}
                  aria-label={`${e.date}: ${e.title}`}
                  className={`tap-area tap-area-round h-3.5 w-3.5 rounded-full border-2 transition-colors ${
                    active ? 'border-ember bg-ember' : done ? 'border-paper bg-paper' : 'border-paper/40 bg-transparent'
                  }`}
                />
                <span className={`${s.typewriter} mt-1.5 text-[13px] tabular-nums ${active ? 'text-paper' : 'text-fog'}`}>{e.year}</span>
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="mx-auto flex w-full max-w-5xl flex-1 items-center py-6">
        {page === 0 ? (
          <section key="intro" className={`${c.fadeIn} mx-auto max-w-2xl text-center`}>
            <p className={`${s.typewriter} text-sm tracking-[0.35em] text-fog uppercase`}>Vorgeschichte</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight font-bold text-paper sm:text-6xl" style={{ textShadow: '3px 3px 0 #8b0000' }}>
              {intro.title}
            </h1>
            <p className="mt-6 font-serif text-xl leading-relaxed text-paper/90">{intro.text}</p>
          </section>
        ) : entry ? (
          <section key={entry.id} className="grid w-full items-center gap-6 md:grid-cols-[1.15fr_1fr] md:gap-10">
            {entry.photo ? (
              <PhotoFigure photo={entry.photo} className={c.fadeIn} />
            ) : (
              <div className={`${c.fadeIn} ${c.photo} grid aspect-[4/3] place-items-center`} aria-hidden>
                <span className={`${c.year} font-serif text-8xl font-bold text-paper/80`}>{entry.year}</span>
              </div>
            )}
            <div className={c.fadeIn}>
              <p className={`${s.typewriter} text-sm tracking-[0.15em] text-ember uppercase`}>{entry.date}</p>
              <h2 className="mt-2 font-serif text-3xl leading-tight font-bold text-paper sm:text-4xl">{entry.title}</h2>
              <p className="mt-4 font-serif text-lg leading-relaxed text-paper/90 sm:text-xl">{entry.text}</p>
            </div>
          </section>
        ) : (
          <section key="outro" className={`${c.fadeIn} mx-auto max-w-2xl text-center`}>
            <p className={`${s.typewriter} text-sm tracking-[0.35em] text-fog uppercase`}>{chapter === 2 ? 'Berlin, März 1936' : 'Berlin, Januar 1933'}</p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-paper sm:text-5xl" style={{ textShadow: '3px 3px 0 #8b0000' }}>
              {outro.title}
            </h2>
            <p className="mt-6 font-serif text-xl leading-relaxed text-paper/90">{outro.text}</p>
          </section>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 border-t border-paper/20 pt-4">
        <StampButton variant="quiet" className="text-paper" onClick={() => go(page - 1)}>
          <ArrowLeft size={16} aria-hidden /> Zurück
        </StampButton>
        <span className={`${s.typewriter} text-xs text-fog tabular-nums`} aria-live="polite">
          {page + 1} / {pages}
        </span>
        <div className="flex items-center gap-4">
          {!last && (
            <button onClick={onDone} className="tap-area font-type text-sm text-fog underline decoration-dotted underline-offset-4 hover:text-paper">
              Überspringen
            </button>
          )}
          <StampButton variant="ink" onClick={() => go(page + 1)} data-autofocus>
            {last ? 'Die Gruppe gründen' : 'Weiter'} <ArrowRight size={16} aria-hidden />
          </StampButton>
        </div>
      </div>
    </main>
  )
}
