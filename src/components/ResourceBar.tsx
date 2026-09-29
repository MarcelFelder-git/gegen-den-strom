import { useEffect, useRef, useState, type ReactNode } from 'react'
import { BookOpen, ChevronRight, HandHeart, House, Mail, Medal, Volume2, VolumeX } from 'lucide-react'
import s from '../styles/period.module.css'
import { chapterOf, weekInChapter, weeksInChapter } from '../game/data/chapters'
import { cardsOfChapter } from '../game/data/cards'
import { quoted } from '../game/data/group'
import { ITEM_LABELS } from '../game/logic'
import type { ItemKey } from '../game/types'
import { useGame } from '../store/GameStore'
import { useUi } from '../store/UiStore'
import { useWeeks } from '../store/content'
import { sound } from '../audio/sound'
import { ITEM_ICONS } from './icons'

const ITEM_ORDER: ItemKey[] = ['papier', 'farbe', 'flugblaetter', 'ausweise']
const ITEM_SHORT: Record<ItemKey, string> = { papier: 'Papier', farbe: 'Farbe', flugblaetter: 'Flugbl.', ausweise: 'Ausweise' }

/** Lässt eine Zahl kurz aufleuchten, wenn sie sich ändert */
function useFlash(value: number): string {
  const prev = useRef(value)
  const [cls, setCls] = useState('')
  useEffect(() => {
    if (value === prev.current) return
    setCls(value > prev.current ? s.flashUp : s.flashDown)
    prev.current = value
    const t = setTimeout(() => setCls(''), 900)
    return () => clearTimeout(t)
  }, [value])
  return cls
}

/**
 * Der Kopf des Spielbildschirms in höchstens drei flachen Zeilen:
 * oben Gruppe, Datum und Menü, darunter gleich hohe Karten für Geholfen, Moral, Unterstützer und Kasse,
 * der Vorrat daneben (quer) oder darunter (hochkant).
 */
export function ResourceBar({ onMenu }: { onMenu: () => void }) {
  const { moral, supporters, kasse, inventory, weekIndex, helped } = useGame()
  const weeks = useWeeks()
  const openLexicon = useUi((u) => u.openLexicon)
  const openAlbum = useUi((u) => u.openAlbum)
  const chapter = chapterOf(weekIndex)
  // Das Album zählt nur die Vorbilder des Kapitels, das gerade gespielt wird
  const chapterCards = cardsOfChapter(chapter.id)
  const cardCount = useGame((g) => chapterCards.filter((c) => g.cards.includes(c.id)).length)
  const groupName = useGame((g) => g.groupName)
  const muted = useUi((u) => u.muted)
  const toggleMuted = useUi((u) => u.toggleMuted)

  return (
    <header className={`${s.panel} z-30 xl:sticky xl:top-0`}>
      <div className="mx-auto max-w-[1500px] space-y-2.5 px-3 py-2.5 sm:px-5">
        {/* Gruppe, Datum und Menü */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className={`${s.typewriter} flex min-w-0 gap-1.5 text-xs text-fog`}>
              <span className="truncate font-bold text-ember">{quoted(groupName)}</span>
              <span className="shrink-0 whitespace-nowrap">
                · Woche {weekInChapter(weekIndex)} von {weeksInChapter(chapter)}
              </span>
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="font-serif text-xl leading-tight font-bold whitespace-nowrap">{weeks[weekIndex].dateLabel.replace('Woche vom ', '')}</p>
              <div className="flex gap-1" aria-hidden>
                {weeks.slice(chapter.first, chapter.last + 1).map((w, j) => {
                  const i = chapter.first + j
                  return (
                    <span
                      key={w.dateLabel}
                      className={`h-1.5 w-3 ${i < weekIndex ? 'bg-fog' : i === weekIndex ? 'bg-ember' : 'border border-paper/25'}`}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          <nav className="flex shrink-0 items-center gap-2" aria-label="Spielmenü">
            <MenuButton label={muted ? 'Ton: aus' : 'Ton: an'} title={muted ? 'Ton ist aus. Einschalten' : 'Ton ist an. Ausschalten'} onClick={toggleMuted}>
              {muted ? <VolumeX size={16} aria-hidden /> : <Volume2 size={16} aria-hidden />}
            </MenuButton>
            <MenuButton label={`Vorbilder ${cardCount}/${chapterCards.length}`} title="Album der echten Vorbilder" onClick={openAlbum}>
              <Medal size={16} aria-hidden />
            </MenuButton>
            <MenuButton label="Wörter" title="Worterklärungen" onClick={() => openLexicon()}>
              <BookOpen size={16} aria-hidden />
            </MenuButton>
            <MenuButton label="Menü" title="Zum Titel, das Spiel bleibt gespeichert" onClick={onMenu}>
              <House size={16} aria-hidden />
            </MenuButton>
          </nav>
        </div>

        {/* Kennzahlen: alle gleich hoch, der Vorrat quer daneben, hochkant darunter */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-[1.25fr_1.25fr_1fr_1fr_1.9fr]">
          <HelpedCard value={helped} />
          <MoralCard value={moral} />
          <StatCard label="Unterstützer" value={supporters} />
          <StatCard label="Kasse" value={kasse} unit="RM" />
          <div className="col-span-2 flex items-center gap-2 sm:col-span-4 lg:col-span-1 lg:border lg:border-paper/20 lg:px-2.5 lg:py-1.5">
            <p className={`${s.typewriter} text-xs tracking-[0.06em] text-fog uppercase lg:sr-only`}>Vorrat</p>
            <dl className="grid flex-1 grid-cols-4 gap-1.5 lg:grid-cols-2" aria-label="Vorrat">
              {ITEM_ORDER.map((k) => (
                <Item key={k} k={k} value={inventory[k]} />
              ))}
            </dl>
          </div>
        </div>
      </div>
    </header>
  )
}

const CARD = 'flex min-h-[68px] min-w-0 flex-col justify-between border px-3 py-2'
const LABEL = `${s.typewriter} flex items-center gap-1 text-xs font-bold tracking-[0.06em] uppercase`

function StatCard({ label, value, unit }: { label: string; value: number; unit?: string }) {
  const flash = useFlash(value)
  return (
    <dl className={`${CARD} border-paper/20 ${flash}`}>
      <dt className={`${LABEL} text-fog`}>{label}</dt>
      <dd className={`${s.typewriter} text-2xl leading-none font-bold tabular-nums`}>
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-fog">{unit}</span>}
      </dd>
    </dl>
  )
}

/** Moral als Karte mit Balken, damit sie keine eigene Zeile braucht */
function MoralCard({ value }: { value: number }) {
  const flash = useFlash(value)
  const low = value < 25
  return (
    <dl className={`${CARD} ${low ? 'border-ember' : 'border-paper/20'} ${flash}`}>
      <dt className={`${LABEL} ${low ? 'text-ember' : 'text-fog'}`}>{low ? 'Die Gruppe wankt' : 'Moral'}</dt>
      <dd>
        <span className={`${s.typewriter} text-2xl leading-none font-bold tabular-nums ${low ? 'text-ember' : ''}`}>{value} %</span>
        <span className="mt-1.5 block h-2 border border-paper/50" role="meter" aria-label="Moral der Gruppe" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
          <span className={`block h-full ${low ? 'bg-ember' : 'bg-paper'} transition-[width] duration-700`} style={{ width: `${value}%` }} />
        </span>
      </dd>
    </dl>
  )
}

/** Die wichtigste Zahl im Spiel: wie vielen Menschen die Gruppe beigestanden hat. Ein Tipp zeigt die Gesichter und die Post. */
function HelpedCard({ value }: { value: number }) {
  const flash = useFlash(value)
  const prev = useRef(value)
  const openHelped = useUi((u) => u.openHelped)
  const unread = useGame((g) => g.helpedPeople.filter((p) => p.letter).length - (g.lettersRead ?? 0))
  useEffect(() => {
    if (value > prev.current) sound.helped()
    prev.current = value
  }, [value])
  return (
    <button
      onClick={openHelped}
      className={`${CARD} relative border-2 border-group-light/70 bg-group/50 text-left hover:bg-group/70 ${flash}`}
      aria-label={`${value} ${value === 1 ? 'Mensch' : 'Menschen'} geholfen${unread > 0 ? `, ${unread} neue ${unread === 1 ? 'Nachricht' : 'Nachrichten'}` : ''}. Gesichter ansehen`}
      title="Menschen, denen eure Gruppe geholfen hat. Darum geht es im Spiel."
    >
      <span className={`${LABEL} w-full text-group-light`}>
        <HandHeart size={13} aria-hidden /> Geholfen
        {unread > 0 && (
          <span className={`${s.pulse} ml-auto flex items-center gap-1 rounded-full bg-archive-light px-2 py-0.5 text-ink`} aria-hidden>
            <Mail size={12} /> {unread}
          </span>
        )}
        <ChevronRight size={14} className={unread > 0 ? '' : 'ml-auto'} aria-hidden />
      </span>
      <span className={`${s.typewriter} text-2xl leading-none font-bold tabular-nums`}>
        {value}
        <span className="ml-1.5 text-sm font-normal text-group-light">{value === 1 ? 'Mensch' : 'Menschen'}</span>
      </span>
    </button>
  )
}

function Item({ k, value }: { k: ItemKey; value: number }) {
  const Icon = ITEM_ICONS[k]
  const flash = useFlash(value)
  return (
    <div
      className={`flex min-w-0 items-center gap-1.5 border px-2 py-1 ${value > 0 ? 'border-paper/40' : 'border-paper/15 text-fog'} ${flash}`}
      title={ITEM_LABELS[k].name}
    >
      <dt className="flex min-w-0 items-center gap-1">
        <Icon size={15} className="shrink-0" aria-hidden />
        <span className={`${s.typewriter} truncate text-[13px] max-sm:sr-only`}>{ITEM_SHORT[k]}</span>
      </dt>
      <dd className={`${s.typewriter} ml-auto text-sm font-bold tabular-nums`}>{value}</dd>
    </div>
  )
}

function MenuButton({ label, title, onClick, children }: { label: string; title: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`${s.typewriter} flex h-11 min-w-11 items-center justify-center gap-1.5 border border-paper/40 px-3 text-xs font-bold tracking-[0.06em] uppercase transition-colors hover:border-paper hover:bg-paper hover:text-ink`}
    >
      {children}
      <span className="hidden md:inline xl:hidden 2xl:inline" aria-hidden>
        {label}
      </span>
    </button>
  )
}
