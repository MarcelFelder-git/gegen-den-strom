import { useEffect, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Flag, HandHeart, Lock, MapPinned, MoonStar, Newspaper, Users, X } from 'lucide-react'
import s from '../styles/period.module.css'
import { Modal } from './ui/Modal'
import { StampButton } from './ui/StampButton'
import { TUTORIAL, TUTORIAL_RESOURCES, TUTORIAL_WEEK, type TutorialPage } from '../game/data/tutorial'
import { PRISON_HELP } from '../game/data/prison'
import { WANTED_THRESHOLD } from '../game/logic'
import { goalById } from '../game/data/goals'
import { useGame } from '../store/GameStore'
import { MISSION_ICONS } from './icons'
import { useMissions, useT } from '../store/content'
import { sound } from '../audio/sound'

/**
 * Die Einführung: das Spielprinzip auf wenigen Seiten, beim ersten Mal auf der Stadtkarte.
 * Jede Seite zeigt ein kleines Bild aus echten Spielelementen, damit die Kinder sie auf der Karte wiedererkennen.
 */
export function Tutorial({ weekIndex, onClose }: { weekIndex: number; onClose: () => void }) {
  const t = useT()
  const [page, setPage] = useState(0)
  const p = TUTORIAL[page]
  const last = page === TUTORIAL.length - 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !last) setPage(page + 1)
      if (e.key === 'ArrowLeft' && page > 0) setPage(page - 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [page, last])

  const go = (to: number) => {
    sound.tear()
    setPage(to)
  }

  return (
    <Modal label={`So geht’s, Seite ${page + 1} von ${TUTORIAL.length}`} onClose={onClose} width="max-w-2xl" closeOnBackdrop={false}>
      <div className={`${s.panel} relative px-5 py-6 sm:px-8`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 grid h-11 w-11 place-items-center border border-paper/40 hover:bg-paper hover:text-ink"
          aria-label="Erklärung schließen"
        >
          <X size={20} aria-hidden />
        </button>
        <p className={`${s.typewriter} text-[13px] font-bold tracking-[0.15em] text-archive-light uppercase`}>
          So geht’s · {page + 1} von {TUTORIAL.length}
        </p>
        <h2 key={p.id} className={`${s.riseIn} mt-1 pr-12 font-serif text-3xl leading-tight font-bold`}>
          {t(p.title)}
        </h2>

        <div key={p.id + '-bild'} className={`${s.riseIn} mt-5`}>
          <Picture id={p.id} weekIndex={weekIndex} />
        </div>

        <div className="mt-5 space-y-3 font-serif text-[18px] leading-relaxed">
          {p.text.map((x, i) => (
            <p key={i}>{t(x)}</p>
          ))}
        </div>

        <ol className="mt-6 flex justify-center gap-2" aria-hidden>
          {TUTORIAL.map((q, i) => (
            <li key={q.id} className={`h-2 w-6 ${i === page ? 'bg-ember' : i < page ? 'bg-paper' : 'bg-paper/20'}`} />
          ))}
        </ol>

        <nav className="mt-5 flex items-center justify-between gap-3">
          {page > 0 ? (
            <StampButton variant="quiet" className="text-paper" onClick={() => go(page - 1)}>
              <ArrowLeft size={16} aria-hidden /> Zurück
            </StampButton>
          ) : (
            <button onClick={onClose} className="tap-area font-type text-sm text-fog underline decoration-dotted underline-offset-4 hover:text-paper">
              Überspringen
            </button>
          )}
          {last ? (
            <StampButton variant="paper" onClick={onClose} data-autofocus>
              Los geht’s
            </StampButton>
          ) : (
            <StampButton variant="paper" onClick={() => go(page + 1)} data-autofocus>
              Weiter <ArrowRight size={16} aria-hidden />
            </StampButton>
          )}
        </nav>
      </div>
    </Modal>
  )
}

/** Kleine Nachbildungen der echten Spielelemente, nur zur Anschauung */
function Picture({ id, weekIndex }: { id: TutorialPage['id']; weekIndex: number }) {
  const t = useT()
  const missions = useMissions()
  const Hide = MISSION_ICONS.unterschlupf
  const goalId = useGame((g) => g.goalId)
  switch (id) {
    case 'ziel':
      return (
        <Frame>
          <div className="inline-flex flex-col border-2 border-group-light/70 bg-group/50 px-4 py-2" aria-hidden>
            <span className={`${s.typewriter} flex items-center gap-1 text-[13px] font-bold tracking-[0.15em] text-group-light uppercase`}>
              <HandHeart size={13} /> Geholfen
            </span>
            <span className={`${s.typewriter} text-2xl font-bold`}>
              12 <span className="text-base text-group-light">Menschen</span>
            </span>
          </div>
        </Frame>
      )
    case 'woche':
      return (
        <ol className="grid gap-2 sm:grid-cols-2">
          {TUTORIAL_WEEK.map((w, i) => {
            const Icon = [Newspaper, Users, MapPinned, MoonStar][i]
            return (
              <li key={w.label} className="flex gap-3 border border-paper/25 p-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-paper font-type font-bold">{i + 1}</span>
                <span>
                  <span className="flex items-center gap-1.5 font-serif text-[17px] font-bold">
                    <Icon size={16} className="text-archive-light" aria-hidden /> {w.label}
                  </span>
                  <span className="block font-type text-sm leading-snug text-paper/85">{t(w.text)}</span>
                </span>
              </li>
            )
          })}
        </ol>
      )
    case 'auftraege':
      return (
        <Frame>
          <div className="w-full max-w-md space-y-3" aria-hidden>
            <div className="flex items-center gap-3 border border-paper/40 px-3 py-2.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-paper bg-paper text-ink">
                <Hide size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 font-serif text-base font-bold">
                  {missions.unterschlupf.title} <HandHeart size={14} className="shrink-0 text-group-light" />
                </span>
                <span className={`${s.typewriter} block text-xs text-fog`}>Hinterhof, Neukölln</span>
              </span>
              <span className="border border-ember px-1.5 font-type text-[13px] font-bold text-ember uppercase">Gefahr mittel</span>
            </div>
            <div className="flex items-center justify-end gap-2 font-type text-sm text-fog">
              Person wählen, dann <span className={`${s.stampInk} pointer-events-none`}>Einteilen</span>
            </div>
          </div>
        </Frame>
      )
    case 'gefahr':
      return (
        <Frame>
          <div className="grid w-full max-w-md gap-4" aria-hidden>
            <div className="grid grid-cols-2 gap-4 font-type text-sm">
              <Bar label="Aussicht" value={65} tone="hope" />
              <Bar label="Gefahr" value={20} tone="danger" />
            </div>
            <div className="font-type text-sm">
              <span className="flex justify-between">
                <span className="text-fog">Fahndungsdruck</span>
                <span className="font-bold text-ember">74, gesucht</span>
              </span>
              <span className="relative mt-1 block h-2.5 border border-paper/40">
                <span className="block h-full bg-crimson" style={{ width: '74%' }} />
                <span className="absolute top-[-4px] bottom-[-4px] w-0.5 bg-paper" style={{ left: `${WANTED_THRESHOLD}%` }} />
              </span>
              <span className="mt-1 block text-right text-xs text-fog">ab {WANTED_THRESHOLD} gesucht</span>
            </div>
          </div>
        </Frame>
      )
    case 'haft':
      return (
        <Frame>
          <div className="flex w-full max-w-md flex-col gap-2" aria-hidden>
            <span className="flex items-center gap-2 font-type text-sm text-ember">
              <Lock size={15} /> In Haft, noch 2 Wochen
            </span>
            <span className="flex flex-wrap gap-2">
              {PRISON_HELP.map((o) => (
                <span key={o.kind} className={`${s.chip} px-2 py-2 text-xs`}>
                  {t(o.label)} ({o.cost} RM)
                </span>
              ))}
            </span>
          </div>
        </Frame>
      )
    case 'mittel':
      return (
        <dl className="grid gap-2 sm:grid-cols-2">
          {TUTORIAL_RESOURCES.map((r) => (
            <div key={r.label} className="border border-paper/25 p-3">
              <dt className={`${s.typewriter} text-[13px] font-bold tracking-[0.12em] text-fog uppercase`}>{r.label}</dt>
              <dd className="mt-0.5 font-serif text-[16px] leading-snug">{t(r.text)}</dd>
            </div>
          ))}
        </dl>
      )
    case 'los':
      return (
        <Frame>
          <div className="flex w-full max-w-md flex-col gap-3" aria-hidden>
            <div className="border-2 border-group-light/60 bg-group/30 p-3">
              <p className="flex items-center gap-1.5 font-type text-xs font-bold tracking-[0.12em] text-group-light uppercase">
                <Flag size={12} /> Ziel der Woche
              </p>
              <p className="mt-1 font-serif text-[15px] font-bold">{t(goalById(goalId, weekIndex).text)}</p>
            </div>
            <span className={`${s.stamp} pointer-events-none w-full`}>Woche beenden</span>
          </div>
        </Frame>
      )
  }
}

function Frame({ children }: { children: ReactNode }) {
  return <div className="flex justify-center border border-dashed border-paper/25 bg-black/20 p-4">{children}</div>
}

function Bar({ label, value, tone }: { label: string; value: number; tone: 'hope' | 'danger' }) {
  return (
    <span className="block">
      <span className="flex justify-between">
        <span className="text-fog">{label}</span>
        <span className={`font-bold ${tone === 'danger' ? 'text-ember' : 'text-paper'}`}>{value}%</span>
      </span>
      <span className="mt-1 block h-2.5 border border-paper/40">
        <span className={`block h-full ${tone === 'danger' ? 'bg-ember' : 'bg-paper'}`} style={{ width: `${value}%` }} />
      </span>
    </span>
  )
}
