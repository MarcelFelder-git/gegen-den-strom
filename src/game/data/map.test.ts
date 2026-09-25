import { describe, expect, it } from 'vitest'
import { DISTRICTS, LANDMARKS, MAP_H, MAP_W, MARKER_BOX, PLAQUE_H, PLAQUE_W, type Point } from './districts'

interface Rect {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
}

function inside(poly: Point[], [x, y]: Point): boolean {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

/** Prüft Ecken und Kantenmitten, das genügt für die fast konvexen Bezirke */
function rectInside(poly: Point[], r: Rect): boolean {
  const xs = [r.x1, (r.x1 + r.x2) / 2, r.x2]
  const ys = [r.y1, (r.y1 + r.y2) / 2, r.y2]
  return xs.every((x) => ys.every((y) => inside(poly, [x, y])))
}

const overlaps = (a: Rect, b: Rect, gap = 4) =>
  a.x1 < b.x2 + gap && b.x1 < a.x2 + gap && a.y1 < b.y2 + gap && b.y1 < a.y2 + gap

const plaqueRect = (id: string, [x, y]: Point): Rect => ({ id, x1: x, y1: y, x2: x + PLAQUE_W, y2: y + PLAQUE_H })
const markerRect = (id: string, x: number, y: number): Rect => ({
  id,
  x1: x - MARKER_BOX.left,
  y1: y - MARKER_BOX.top,
  x2: x + MARKER_BOX.right,
  y2: y + MARKER_BOX.bottom,
})

describe('Stadtkarte', () => {
  const rects: Rect[] = []
  for (const d of DISTRICTS) {
    rects.push(plaqueRect(`Schild ${d.name}`, d.plaque))
    for (const p of d.places) rects.push(markerRect(p.id, p.x, p.y))
  }
  for (const l of LANDMARKS) {
    rects.push({ id: l.id, x1: l.x - l.box.left, y1: l.y - l.box.top, x2: l.x + l.box.right, y2: l.y + l.box.bottom })
  }

  it.each(DISTRICTS.map((d) => [d.name, d] as const))('Schild und Orte von %s liegen ganz im Bezirk', (_n, d) => {
    const outside: string[] = []
    if (!rectInside(d.polygon, plaqueRect('Schild', d.plaque))) outside.push('Schild')
    for (const p of d.places) if (!rectInside(d.polygon, markerRect(p.id, p.x, p.y))) outside.push(p.id)
    expect(outside).toEqual([])
  })

  it('nichts überschneidet sich', () => {
    const clashes: string[] = []
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) if (overlaps(rects[i], rects[j])) clashes.push(`${rects[i].id} / ${rects[j].id}`)
    expect(clashes).toEqual([])
  })

  it('alles liegt innerhalb der Karte', () => {
    for (const r of rects) {
      expect(r.x1).toBeGreaterThanOrEqual(0)
      expect(r.y1).toBeGreaterThanOrEqual(0)
      expect(r.x2).toBeLessThanOrEqual(MAP_W)
      expect(r.y2).toBeLessThanOrEqual(MAP_H)
    }
  })
})
