import { useState } from 'react'
import { GraduationCap, Paperclip } from 'lucide-react'
import { SourceTask } from './SourceTask'
import { SOURCES } from '../game/data/sources'
import { chapterOf } from '../game/data/chapters'
import s from '../styles/period.module.css'
import { EffectChips } from './EffectChips'
import { NewsIllustration } from './NewsIllustration'
import { Modal } from './ui/Modal'
import { StampButton } from './ui/StampButton'
import { WEEKS } from '../game/data/weeks'
import { getLexiconEntry } from '../game/data/lexicon'
import { useGame } from '../store/GameStore'
import { useUi } from '../store/UiStore'
import { useEffect } from 'react'
import { sound } from '../audio/sound'

export function NewspaperModal() {
  const weekIndex = useGame((g) => g.weekIndex)
  const notes = useGame((g) => g.weekNotes)
  const closeNewspaper = useGame((g) => g.closeNewspaper)
  const openLexicon = useUi((u) => u.openLexicon)
  const w = WEEKS[weekIndex]
  const [step, setStep] = useState<'zeitung' | 'quelle'>('zeitung')
  const hasSource = !!SOURCES[weekIndex]
  const later = chapterOf(weekIndex).id === 2
  useEffect(() => sound.whoosh(), [weekIndex])

  return (
    <Modal label={`Berliner Tageszeitung vom ${w.paperDate}`} width="max-w-5xl">
      {step === 'quelle' ? (
        <SourceTask onDone={closeNewspaper} />
      ) : (
        <article className={`${s.newsprint} ${s.spinIn} px-4 py-5 sm:px-8 sm:py-7`} lang="de">
          <div className={`${s.typewriter} flex flex-wrap justify-between gap-2 text-[11px] tracking-[0.15em] uppercase`}>
            <span>Morgenausgabe</span>
            <span>Nr. {23 + weekIndex * 11}</span>
            <span>Einzelpreis 15 Pfennig</span>
          </div>
          <h1 className={`${s.fraktur} mt-1 text-center text-5xl leading-none sm:text-7xl`}>Berliner Tageszeitung</h1>
          <hr className={`${s.rule} mt-3`} />
          <p className="flex flex-wrap justify-between gap-2 py-1 font-serif text-sm italic">
            <span>Berlin, {w.paperDate}</span>
            <span>{later ? 65 + (w.calendar.year ?? 1936) - 1936 : 62}. Jahrgang</span>
          </p>
          <hr className={s.rule} />

          <header className="mt-5 text-center">
            <h2 className="font-serif text-3xl leading-[1.05] font-bold sm:text-5xl">{w.headline}</h2>
            <p className="mx-auto mt-3 max-w-3xl font-serif text-lg leading-snug italic sm:text-xl">{w.subline}</p>
          </header>

          <div className="mt-6 grid gap-6 border-t border-ink pt-5 md:grid-cols-3">
            <div className="md:col-span-2">
              <NewsIllustration kind={w.illustration} caption={w.caption} />
              <p className="mt-4 text-justify font-serif text-[17px] leading-relaxed hyphens-auto first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.85] first-letter:font-bold">
                {w.lead}
              </p>
            </div>
            <div className="space-y-5 md:border-l md:border-ink md:pl-5">
              {w.articles.map((a) => (
                <section key={a.headline} className="border-b border-ink/50 pb-4 last:border-0">
                  <h3 className="font-serif text-xl leading-tight font-bold">{a.headline}</h3>
                  <p className="mt-1.5 font-serif text-[15px] leading-snug hyphens-auto">{a.body}</p>
                </section>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Notiz der Gruppe, zwischen die Seiten gelegt */}
            <aside className={`${s.paper} relative rotate-[-1.2deg] p-5 pt-6`} aria-label="Notiz zwischen den Zeilen">
              <Paperclip size={34} className="absolute -top-4 left-5 rotate-[20deg] text-slate" aria-hidden />
              <p className={`${s.typewriter} text-xs font-bold tracking-[0.2em] text-crimson uppercase`}>Was nicht in der Zeitung steht</p>
              <p className={`${s.typewriter} mt-2 text-[15px] leading-relaxed`}>{w.note}</p>
            </aside>

            <aside className="border-2 border-ink bg-paper p-5" aria-label="Zum Verständnis">
              <p className="flex items-center gap-2 font-type text-xs font-bold tracking-[0.2em] uppercase">
                <GraduationCap size={18} aria-hidden /> Zum Verständnis
              </p>
              <p className="mt-2 font-serif text-[16px] leading-relaxed">{w.context}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {w.lexicon.map((id) => {
                  const entry = getLexiconEntry(id)
                  if (!entry) return null
                  return (
                    <button
                      key={id}
                      onClick={() => openLexicon(id)}
                      className={`${s.chip} px-2.5 py-1 text-sm underline decoration-dotted underline-offset-2`}
                    >
                      {entry.term}
                    </button>
                  )
                })}
              </div>
            </aside>
          </div>

          <div className="mt-6 flex flex-col gap-4 bg-ink p-4 text-paper sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              {notes.map((n) => (
                <div key={n.text} className="space-y-1.5">
                  <p className="font-serif text-base italic">{n.text}</p>
                  <EffectChips effects={n.effects} onDark />
                </div>
              ))}
            </div>
            <StampButton
              onClick={() => (hasSource ? setStep('quelle') : closeNewspaper())}
              className="shrink-0"
              data-autofocus
            >
              {hasSource ? 'Zur Quelle der Woche' : 'Zeitung weglegen'}
            </StampButton>
          </div>
        </article>
      )}
    </Modal>
  )
}
