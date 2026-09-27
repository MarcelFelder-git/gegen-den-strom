import type { Page } from '@playwright/test'

/**
 * Spielt das Spiel wie ein Kind auf dem iPad: tippt sich durch Intro, Zeitung,
 * Quelle, Begegnung und Karte, verteilt Aufträge und trifft zufällige Entscheidungen.
 * Prüft dabei auf jedem Bildschirm, dass nichts über den Rand ragt und keine Fehler auftreten.
 */

export interface Problems {
  errors: string[]
  overflow: string[]
  smallTargets: Set<string>
}

export function watch(page: Page): Problems {
  const p: Problems = { errors: [], overflow: [], smallTargets: new Set() }
  page.on('pageerror', (e) => p.errors.push(`Absturz: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() === 'error') p.errors.push(`Konsole: ${m.text()}`)
  })
  page.on('requestfailed', (r) => p.errors.push(`Laden fehlgeschlagen: ${r.url()}`))
  return p
}

interface Btn {
  i: number
  label: string
}

interface Screen {
  dialog: string | null
  btns: Btn[]
  overflow: number
  small: string[]
}

/** Sichtbare, aktive Buttons im obersten Dialog oder, falls keiner offen ist, auf der Seite */
export function scan(page: Page): Promise<Screen> {
  return page.evaluate(() => {
    const dialogs = [...document.querySelectorAll('[role=dialog][aria-modal=true]')]
    const top = dialogs.length ? dialogs[dialogs.length - 1] : null
    const scope = top ?? document
    document.querySelectorAll('[data-e2e]').forEach((e) => e.removeAttribute('data-e2e'))
    const small: string[] = []
    const btns = [...scope.querySelectorAll('button')]
      .filter((e) => {
        const r = e.getBoundingClientRect()
        return r.width > 0 && r.height > 0 && !e.disabled
      })
      .map((e, i) => {
        e.setAttribute('data-e2e', String(i))
        const label = (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70)
        const r = e.getBoundingClientRect()
        // Apple empfiehlt 44 Punkte, darunter 32 wird es für Kinderfinger fummelig
        if ((r.width < 32 || r.height < 32) && !e.classList.contains('tap-area')) small.push(`${label} (${Math.round(r.width)}×${Math.round(r.height)})`)
        return { i, label }
      })
    const overflow = document.documentElement.scrollWidth - window.innerWidth
    return { dialog: top?.getAttribute('aria-label') ?? null, btns, overflow, small }
  })
}

const SKIP =
  /Zurück|schließen|Schließen|Menü|Titel|Ton|Geräusch|Wörter|Worterkl|Vorbilder|Lexikon|Lehrkräfte|^\d+\.|Album|Neu beginnen|Chronik|Bildnachweis|drucken|Drucken|Bezirk|Neues Spiel|Kapitel 2 mit einer neuen/
const FORWARD = [/^Weiter/, /^Nächstes Vorbild/, /^Ins Album legen/, /Überspringen/, /gründen$/, /^Zur /, /^Los/, /^Nächste Woche/, /^Das Kapitel abschließen/]

export interface PlayOptions {
  /** 1 = 6. bis 8. Klasse, 2 = ab 9. Klasse */
  level: 1 | 2
  start: RegExp
  /** Beendet das Spielen, sobald dieser Bildschirm erreicht ist */
  until: (s: Screen) => boolean
  maxSteps?: number
  missionsPerWeek?: number
}

export async function play(page: Page, problems: Problems, o: PlayOptions): Promise<string[]> {
  const log: string[] = []
  const tried = new Set<string>()
  let started = false
  let levelSet = false
  let planned = 0
  let week = 0
  let idle = 0
  for (let step = 0; step < (o.maxSteps ?? 3000); step++) {
    await page.waitForTimeout(150)
    const s = await scan(page)
    if (s.overflow > 1) problems.overflow.push(`${s.dialog ?? 'Seite'}: ${s.overflow}px zu breit`)
    for (const x of s.small) problems.smallTargets.add(`${s.dialog ?? 'Seite'}: ${x}`)
    if (started && s.dialog === null && o.until(s)) return log
    const find = (re: RegExp) => s.btns.find((b) => re.test(b.label))
    let hit: Btn | undefined
    if (!started) {
      hit = find(o.start)
      started = !!hit
    } else if (!levelSet && find(/^Stufe 1/)) {
      hit = find(new RegExp('^Stufe ' + o.level))
      levelSet = true
    } else if (s.dialog && find(/^Akte schließen$/)) {
      // Akte eines Auftrags: eine Person einteilen, dann schließen
      const key = 'akte:' + s.dialog
      hit = find(/^Einteilen$/) ?? (tried.has(key) ? find(/^Akte schließen$/) : s.btns.find((b) => /Fahndung/.test(b.label)))
      if (hit && /Fahndung/.test(hit.label)) tried.add(key)
      if (hit?.label === 'Einteilen') planned++
    } else if (!s.dialog && find(/^Woche beenden/)) {
      const missions = s.btns.filter((b) => /Gefahr/.test(b.label) && !tried.has(b.label))
      if (planned < (o.missionsPerWeek ?? 2) && missions.length) {
        hit = missions[Math.floor(Math.random() * missions.length)]
        tried.add(hit.label)
      } else {
        hit = find(/^Woche beenden/)
        planned = 0
        week++
        tried.clear()
      }
    }
    if (!hit) for (const r of FORWARD) if ((hit = find(r))) break
    if (!hit && idle >= 3) {
      // Eine Entscheidung treffen, wie ein Kind es tun würde: irgendeine
      const cand = s.btns.filter((b) => !SKIP.test(b.label) && !tried.has(b.label))
      if (cand.length) {
        hit = cand[Math.floor(Math.random() * cand.length)]
        tried.add(hit.label)
      }
    }
    if (!hit) {
      if (++idle < 60) {
        step--
        continue
      }
      throw new Error(`Festgefahren in „${s.dialog ?? 'Seite'}“. Buttons: ${s.btns.map((b) => b.label).join(' | ')}\n${log.slice(-15).join('\n')}`)
    }
    idle = 0
    if (/^Weiter|^Zur |^Nächste Woche/.test(hit.label)) tried.clear()
    log.push(`W${week} [${s.dialog ?? '-'}] ${hit.label}`)
    await page.tap(`[data-e2e="${hit.i}"]`)
  }
  throw new Error('Zu viele Schritte\n' + log.slice(-15).join('\n'))
}
