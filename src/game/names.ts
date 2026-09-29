import type { Character } from './types'

/**
 * Ersatz-Vornamen für Gefährten, die so heißen wie die eigene Figur. Der Nachname bleibt.
 * Je zwei, falls die Figur zufällig auch wie der erste Ersatz heißt.
 */
const ALT_FIRST_NAMES: Record<string, [string, string]> = {
  Hans: ['Willi', 'Otto'],
  Lotte: ['Liesel', 'Hilde'],
  Erich: ['Kurt', 'Ernst'],
  Trude: ['Hedwig', 'Else'],
  Heinrich: ['Paul', 'Fritz'],
  Grete: ['Ilse', 'Erna'],
  Johannes: ['Walter', 'Max'],
  Anni: ['Käthe', 'Frieda'],
  August: ['Emil', 'Karl'],
}

const first = (name: string) => name.trim().split(/\s+/)[0] ?? ''

/** Der Name, unter dem ein Gefährte im Spiel auftritt: bei gleichem Vornamen wie die eigene Figur ein Ersatz */
export function companionName(name: string, leaderName: string): string {
  const own = first(leaderName).toLowerCase()
  const given = first(name)
  if (!own || given.toLowerCase() !== own) return name
  const alt = (ALT_FIRST_NAMES[given] ?? ['Paul', 'Else']).find((a) => a.toLowerCase() !== own) ?? 'Paul'
  return alt + name.trim().slice(given.length)
}

/** Unter diesem Namen stehen Geschichten und Schicksale einer Person in den Daten */
export const templateName = (m: Pick<Character, 'name' | 'template'>): string => m.template ?? m.name

/**
 * Tauscht in Texten über eine umbenannte Person den alten Vornamen gegen den neuen, auch im Genitiv
 * („Lottes Küche“ wird „Liesels Küche“, „Hans’ Küche“ wird „Willis Küche“). Ohne Lookbehind, damit es auch auf älteren iPads läuft.
 */
export function renamed<T>(value: T, m?: Pick<Character, 'name' | 'template'>): T {
  if (!m?.template) return value
  const from = first(m.template)
  const to = first(m.name)
  if (!from || from === to) return value
  const genitive = /[sßxz]$/.test(to) ? `${to}’` : `${to}s`
  const pattern = new RegExp(`(^|[^\\p{L}])${from}(s|’)?(?!\\p{L})`, 'gu')
  const swap = (text: string) => text.replace(pattern, (_, before: string, gen?: string) => before + (gen ? genitive : to))
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') return swap(v)
    if (Array.isArray(v)) return v.map(walk)
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]))
    return v
  }
  return walk(value) as T
}
