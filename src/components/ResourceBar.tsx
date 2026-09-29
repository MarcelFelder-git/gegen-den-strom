import { useEffect, useRef, useState, type ReactNode } from 'react'
import { BookOpen, ChevronRight, HandHeart, House, Medal, Volume2, VolumeX } from 'lucide-react'
import s from '../styles/period.module.css'
import { chapterOf, weekInChapter, weeksInChapter } from '../game/data/chapters'
import { CARDS } from '../game/data/cards'
import { quoted } from '../game/data/group'
import { ITEM_LABELS } from '../game/logic'
import type { ItemKey } from '../game/types'
import { useGame } from '../store/GameStore'
import { useUi } from '../store/UiStore'
import { useWeeks } from '../store/content'
import { DIFFICULTIES } from '../game/difficulty'
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

export function ResourceBar({ onMenu }: { onMenu: () => void }) {
  const { moral, supporters, kasse, inventory, weekIndex, helped, level } = useGame()
  const weeks = useWeeks()
  const openLexicon = useUi((u) => u.openLexicon)
  const openAlbum = useUi((u) => u.openAlbum)
  const cardCount = useGame((g) => g.cards.length)
  const chapter = chapterOf(weekIndex)
  const groupName = useGame((g) => g.groupName)
  const muted = useUi((u) => u.muted)
  const toggleMuted = useUi((u) => u.toggleMuted)
  const low = moral < 25
  const moralFlash = useFlash(moral)

  return (
    <header className={`${s.panel} z-30 xl:sticky xl:top-0`}>
      <div className="mx-auto grid max-w-[1500px] grid-cols-[1fr_auto] items-stretch gap-x-5 gap-y-3 px-3 py-3 sm:px-5 lg:grid-cols-[auto_1fr_auto] xl:grid-cols-[auto_minmax(180px,260px)_auto_auto_1fr_auto] xl:gap-x-0 xl:divide-x xl:divide-paper/15">
        {/* Datum und Fortschritt */}
        <div className="lg:order-1 xl:order-none xl:pr-5">
          <p className={`${s.typewriter} max-w-[240px] truncate text-xs font-bold tracking-[0.15em] text-ember uppercase`}>
            Widerstandsgruppe {quoted(groupName)}
          </p>
          <p className={`${s.typewriter} text-xs tracking-[0.12em] text-fog uppercase`}>
            {chapter.id === 1 ? '1933' : '1936 bis 1938'} · Woche {weekInChapter(weekIndex)} von {weeksInChapter(chapter)} · {DIFFICULTIES[level].label}
          </p>
          <p className="font-serif text-xl leading-tight font-bold whitespace-nowrap">{weeks[weekIndex].dateLabel.replace('Woche vom ', '')}</p>
          <div className="mt-1.5 flex gap-1" aria-hidden>
            {weeks.slice(chapter.first, chapter.last + 1).map((w, j) => {
              const i = chapter.first + j
              return (
              <span
                key={w.dateLabel}
                title={w.dateLabel}
                className={`h-1.5 w-3 ${i < weekIndex ? 'bg-fog' : i === weekIndex ? 'bg-ember' : 'border border-paper/25'}`}
              />
              )
            })}
          </div>
        </div>

        {/* Menü */}
        <nav className="flex items-start justify-end gap-2 lg:order-3 lg:items-center xl:order-last xl:pl-5" aria-label="Spielmenü">
          <MenuButton label={muted ? 'Ton aus' : 'Ton an'} title={muted ? 'Geräusche einschalten' : 'Geräusche ausschalten'} onClick={toggleMuted}>
            {muted ? <VolumeX size={16} aria-hidden /> : <Volume2 size={16} aria-hidden />}
          </MenuButton>
          <MenuButton label={`Vorbilder ${cardCount}/${CARDS.length}`} title="Album der echten Vorbilder" onClick={openAlbum}>
            <Medal size={16} aria-hidden />
          </MenuButton>
          <MenuButton label="Wörter" title="Worterklärungen" onClick={() => openLexicon()}>
            <BookOpen size={16} aria-hidden />
          </MenuButton>
          <MenuButton label="Menü" title="Zum Titel, das Spiel bleibt gespeichert" onClick={onMenu}>
            <House size={16} aria-hidden />
          </MenuButton>
        </nav>

        {/* Moral */}
        <div className={`col-span-2 self-center lg:order-2 lg:col-span-1 xl:order-none xl:px-5 ${moralFlash}`}>
          <div className="flex items-baseline justify-between">
            <span className={`${s.typewriter} text-xs tracking-[0.12em] uppercase ${low ? 'text-ember' : 'text-fog'}`}>
              {low ? 'Die Gruppe wankt' : 'Moral der Gruppe'}
            </span>
            <span className={`${s.typewriter} text-xl font-bold tabular-nums ${low ? 'text-ember' : ''}`}>{moral}%</span>
          </div>
          <div className="mt-1 h-3 border border-paper/60" role="meter" aria-label="Moral der Gruppe" aria-valuenow={moral} aria-valuemin={0} aria-valuemax={100}>
            <div className={`h-full ${low ? 'bg-ember' : 'bg-paper'} transition-[width] duration-700`} style={{ width: `${moral}%` }} />
          </div>
        </div>

        {/* Kennzahlen */}
        <dl className="col-span-2 grid grid-cols-3 gap-2 md:col-span-1 lg:order-4 xl:order-none xl:col-span-2 xl:flex xl:gap-0 xl:divide-x xl:divide-paper/15">
          <HelpedTile value={helped} />
          <Tile label="Unterstützer" value={supporters} />
          <Tile label="Kasse" value={kasse} unit="RM" />
        </dl>

        {/* Vorrat */}
        <div className="col-span-2 md:col-span-1 lg:order-5 lg:col-span-2 xl:order-none xl:col-span-1 xl:px-5">
          <p className={`${s.typewriter} text-xs tracking-[0.12em] text-fog uppercase`}>Vorrat</p>
          <dl className="mt-1 grid grid-cols-4 gap-1.5 xl:flex xl:gap-2">
            {ITEM_ORDER.map((k) => (
              <Item key={k} k={k} value={inventory[k]} />
            ))}
          </dl>
        </div>
      </div>
    </header>
  )
}

function Tile({ label, value, unit }: { label: string; value: number; unit?: string }) {
  const flash = useFlash(value)
  return (
    <div className={`border border-paper/15 px-3 py-1.5 xl:border-0 xl:px-5 xl:py-0 ${flash}`}>
      <dt className={`${s.typewriter} text-xs tracking-[0.12em] text-fog uppercase`}>{label}</dt>
      <dd className={`${s.typewriter} text-xl leading-tight font-bold tabular-nums whitespace-nowrap`}>
        {value}
        {unit && <span className="ml-1 text-sm text-fog">{unit}</span>}
      </dd>
    </div>
  )
}

/** Die wichtigste Zahl im Spiel: wie vielen Menschen die Gruppe beigestanden hat */
function HelpedTile({ value }: { value: number }) {
  const flash = useFlash(value)
  const prev = useRef(value)
  const openHelped = useUi((u) => u.openHelped)
  useEffect(() => {
    if (value > prev.current) sound.helped()
    prev.current = value
  }, [value])
  return (
    <div
      className={`relative border-2 border-group-light/70 bg-group/50 px-3 py-1.5 xl:border-y-0 xl:border-r-0 xl:border-l-2 xl:px-5 xl:py-0 ${flash}`}
      title="Menschen, denen eure Gruppe geholfen hat. Darum geht es im Spiel."
    >
      {/* Die ganze Kachel öffnet die Gesichter hinter der Zahl */}
      <button onClick={openHelped} className="absolute inset-0 z-10 hover:bg-group-light/10" aria-label={`${value} Menschen geholfen. Gesichter ansehen`} />
      <dt className={`${s.typewriter} flex items-center gap-1 text-xs font-bold tracking-[0.15em] text-group-light uppercase`}>
        <HandHeart size={12} aria-hidden /> Geholfen
        <ChevronRight size={12} className="ml-auto" aria-hidden />
      </dt>
      <dd className={`${s.typewriter} text-xl leading-tight font-bold tabular-nums whitespace-nowrap`}>
        {value}
        <span className="ml-1 text-sm text-group-light max-xl:hidden">{value === 1 ? 'Mensch' : 'Menschen'}</span>

      </dd>
    </div>
  )
}

function Item({ k, value }: { k: ItemKey; value: number }) {
  const Icon = ITEM_ICONS[k]
  const flash = useFlash(value)
  return (
    <div
      className={`flex items-center gap-1.5 border px-2 py-1 ${value > 0 ? 'border-paper/40' : 'border-paper/15 text-fog'} ${flash}`}
      title={ITEM_LABELS[k].name}
    >
      <dt className="flex items-center gap-1">
        <Icon size={15} aria-hidden />
        <span className={`${s.typewriter} text-[13px]`}>{ITEM_SHORT[k]}</span>
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
      className={`${s.typewriter} flex h-11 min-w-11 items-center justify-center gap-1.5 border border-paper/40 px-3 text-xs font-bold tracking-[0.1em] uppercase transition-colors hover:border-paper hover:bg-paper hover:text-ink`}
    >
      {children}
      <span className="hidden md:inline xl:hidden 2xl:inline" aria-hidden>
        {label}
      </span>
    </button>
  )
}
