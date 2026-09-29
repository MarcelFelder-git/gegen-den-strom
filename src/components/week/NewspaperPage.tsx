import type { ReactNode } from 'react'
import { BookOpenCheck, ExternalLink, GraduationCap, MessageSquareQuote, NotebookPen } from 'lucide-react'
import s from '../../styles/period.module.css'
import { EffectChips } from '../EffectChips'
import { NewsIllustration } from '../NewsIllustration'
import { chapterOf } from '../../game/data/chapters'
import { getLexiconEntry } from '../../game/data/lexicon'
import { useGame } from '../../store/GameStore'
import { useUi } from '../../store/UiStore'
import { useWeeks } from '../../store/content'

/** Schritt 1: die Zeitung, dazu erfundenes Tagebuch, Stimmen von der Straße und echte Zeitzeugen, klar getrennt */
export function NewspaperPage() {
  const weekIndex = useGame((g) => g.weekIndex)
  const notes = useGame((g) => g.weekNotes)
  const openLexicon = useUi((u) => u.openLexicon)
  const w = useWeeks()[weekIndex]
  const later = chapterOf(weekIndex).id === 2

  return (
    <div className="space-y-4">
      <article className={`${s.newsprint} ${s.spinIn} px-4 py-5 sm:px-8 sm:py-7`} lang="de">
        <div className={`${s.typewriter} flex flex-wrap justify-between gap-2 text-[13px] tracking-[0.15em] uppercase`}>
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
          <h2 className="font-serif text-3xl leading-[1.05] font-bold text-balance sm:text-5xl">{w.headline}</h2>
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
        <p className="mt-5 border-t border-ink/40 pt-2 font-type text-[13px] text-slate">
          Nachgestellte Zeitung. Die Meldungen berichten über echte Ereignisse, im Ton der Presse jener Zeit.
        </p>
      </article>

      {/* Neben der Zeitung, klar gekennzeichnet: was erfunden ist und was echt */}
      <div className="grid gap-4 md:grid-cols-2">
        <aside className={`${s.paper} relative p-5`} aria-label="Tagebuch der Gruppe, erfunden">
          <Label icon={<NotebookPen size={16} aria-hidden />} title="Was nicht in der Zeitung steht" tag="Tagebuch der Gruppe, erfunden" tone="crimson" />
          <p className={`${s.typewriter} mt-3 text-[15px] leading-relaxed`}>{w.note}</p>
        </aside>

        <aside className="border-2 border-dashed border-paper/40 bg-coal p-5 text-paper" aria-label="Auf der Straße gehört, erfunden">
          <Label icon={<MessageSquareQuote size={16} aria-hidden />} title="Auf der Straße gehört" tag="So redeten viele, erfunden" tone="fog" />
          <p className="mt-3 font-serif text-lg leading-relaxed italic">{w.voice}</p>
        </aside>
      </div>

      {w.witnesses && w.witnesses.length > 0 && (
        <section className="border-l-8 border-archive-light bg-[#1a1a1d] p-5 text-paper" aria-label="Zeitzeugenbericht, echt">
          <Label icon={<BookOpenCheck size={16} aria-hidden />} title="Zeitzeugenbericht" tag="Echt, mit Quelle" tone="archive" />
          {w.witnessIntro && <p className="mt-2 font-serif text-[16px] text-paper/85">{w.witnessIntro}</p>}
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {w.witnesses.map((wt) => (
              <blockquote key={wt.text} className="border border-paper/20 p-4">
                <p className="font-serif text-xl leading-snug">{wt.text}</p>
                <footer className="mt-2 font-type text-xs text-fog">
                  {wt.who}
                  <span className="mt-1 block">
                    Quelle: {wt.source}
                    {wt.url && (
                      <a href={wt.url} target="_blank" rel="noopener noreferrer" className="ml-1.5 inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 hover:text-paper">
                        <ExternalLink size={12} aria-hidden /> ansehen
                      </a>
                    )}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      <aside className="border-2 border-ink bg-paper p-5 text-ink" aria-label="Zum Verständnis">
        <p className="flex items-center gap-2 font-type text-xs font-bold tracking-[0.12em] uppercase">
          <GraduationCap size={18} aria-hidden /> Zum Verständnis
        </p>
        <p className="mt-2 font-serif text-[17px] leading-relaxed">{w.context}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {w.lexicon.map((id) => {
            const entry = getLexiconEntry(id)
            if (!entry) return null
            return (
              <button key={id} onClick={() => openLexicon(id)} className={`${s.chip} px-2.5 py-1 text-sm underline decoration-dotted underline-offset-2`}>
                {entry.term}
              </button>
            )
          })}
        </div>
      </aside>

      <div className="space-y-2 bg-ink p-4 text-paper">
        {notes.map((n) => (
          <div key={n.text} className="space-y-1.5">
            <p className="font-serif text-base italic">{n.text}</p>
            <EffectChips effects={n.effects} onDark />
          </div>
        ))}
      </div>
    </div>
  )
}

function Label({ icon, title, tag, tone }: { icon: ReactNode; title: string; tag: string; tone: 'crimson' | 'fog' | 'archive' }) {
  const color = tone === 'crimson' ? 'text-crimson' : tone === 'archive' ? 'text-archive-light' : 'text-fog'
  const tagClass =
    tone === 'crimson' ? 'border-crimson text-crimson' : tone === 'archive' ? 'border-archive-light text-archive-light' : 'border-fog text-fog'
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className={`${s.typewriter} flex items-center gap-2 text-xs font-bold tracking-[0.12em] uppercase ${color}`}>
        {icon}
        {title}
      </p>
      <span className={`border px-1.5 py-0.5 font-type text-xs font-bold tracking-[0.1em] uppercase ${tagClass}`}>{tag}</span>
    </div>
  )
}
