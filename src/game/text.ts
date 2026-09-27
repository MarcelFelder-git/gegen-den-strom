/**
 * Texte in zwei Stufen: „leicht“ für die Klassen 6 bis 8, „schwer“ ab Klasse 9.
 * Ein Text ist entweder für beide Stufen gleich (einfacher String)
 * oder hat zwei Fassungen, geschrieben mit L('leicht', 'schwer').
 */
export type Level = 'leicht' | 'schwer'

export interface Leveled {
  leicht: string
  schwer: string
}

export type Txt = string | Leveled

/** Zwei Fassungen eines Textes */
export const L = (leicht: string, schwer: string): Leveled => ({ leicht, schwer })

export function isLeveled(x: unknown): x is Leveled {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return false
  const keys = Object.keys(x)
  return keys.length === 2 && typeof (x as Leveled).leicht === 'string' && typeof (x as Leveled).schwer === 'string'
}

/** Wandelt alle zweistufigen Texte in einem Datenbaum in einfache Strings um */
export type Resolved<T> = T extends Leveled
  ? string
  : T extends string | number | boolean | null | undefined
    ? T
    : T extends (...args: never[]) => unknown
      ? T
      : T extends readonly (infer U)[]
        ? Resolved<U>[]
        : { [K in keyof T]: Resolved<T[K]> }

const caches: Record<Level, WeakMap<object, unknown>> = { leicht: new WeakMap(), schwer: new WeakMap() }

export function resolve<T>(value: T, level: Level): Resolved<T> {
  if (isLeveled(value)) return value[level] as Resolved<T>
  if (!value || typeof value !== 'object') return value as Resolved<T>
  const cache = caches[level]
  const hit = cache.get(value)
  if (hit) return hit as Resolved<T>
  let out: unknown
  if (Array.isArray(value)) out = value.map((v) => resolve(v, level))
  else {
    const obj: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) obj[k] = typeof v === 'function' ? v : resolve(v, level)
    out = obj
  }
  cache.set(value, out)
  return out as Resolved<T>
}

/** Ein einzelner Text in der gewählten Stufe */
export function t(value: Txt, level: Level): string {
  return typeof value === 'string' ? value : value[level]
}
