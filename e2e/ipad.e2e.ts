import { expect, test, type Page } from '@playwright/test'
import { play, scan, watch, type Problems } from './autoplay'

const SAVE_KEY = 'gegen-den-strom-spielstand'

/** Am Ende eines Tests: keine Fehler, nichts ragt über den Bildschirmrand */
function report(problems: Problems) {
  if (problems.smallTargets.size) console.log('Kleine Tippflächen:\n  ' + [...problems.smallTargets].join('\n  '))
  expect(problems.errors, 'Fehler im Browser').toEqual([])
  expect([...new Set(problems.overflow)], 'Seite breiter als der Bildschirm').toEqual([])
}

const onEndScreen = (s: Awaited<ReturnType<typeof scan>>) =>
  s.btns.some((b) => b.label === 'Neues Spiel') && !s.btns.some((b) => /^Weiter mit Kapitel 2/.test(b.label))

async function saved(page: Page) {
  return page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? 'null')?.state, SAVE_KEY)
}

test('beide Kapitel in der Stufe 6. bis 8. Klasse durchspielen', async ({ page }, info) => {
  test.skip(info.project.name !== 'iPad hochkant', 'ein langer Durchlauf pro Stufe genügt')
  const problems = watch(page)
  await page.goto('./')
  await play(page, problems, { level: 1, start: /^Neues Spiel beginnen/, until: onEndScreen })
  const state = await saved(page)
  expect(state.level).toBe('leicht')
  expect(state.endReason).toBe('kapitelende')
  expect(state.weekIndex).toBeGreaterThanOrEqual(17)
  expect(state.helped).toBeGreaterThan(0)
  await expect(page.getByText(/Menschen/).first()).toBeVisible()
  report(problems)
})

test('Kapitel 2 direkt in der Stufe ab 9. Klasse, mit Chronik bei Zerschlagung', async ({ page }, info) => {
  test.skip(info.project.name !== 'iPad quer', 'ein langer Durchlauf pro Stufe genügt')
  const problems = watch(page)
  await page.goto('./')
  // Mehr Aufträge pro Woche, damit die Gruppe auch einmal auffliegen kann
  await play(page, problems, { level: 2, start: /^Kapitel 2 direkt beginnen/, until: onEndScreen, missionsPerWeek: 3 })
  const state = await saved(page)
  expect(state.level).toBe('schwer')
  const chronik = page.getByRole('button', { name: /Chronik lesen/ })
  if (await chronik.isVisible()) {
    await chronik.tap()
    await expect(page.getByRole('dialog')).toBeVisible()
    // Durch die Chronik blättern, bis sie sich schließt
    let pages = 0
    for (; pages < 30 && (await page.getByRole('dialog').count()); pages++) {
      const next = page.getByRole('dialog').getByRole('button', { name: /^Nächste Woche/ })
      await (await next.count() ? next : page.getByRole('dialog').getByRole('button', { name: 'Chronik schließen' }).last()).tap()
      await page.waitForTimeout(200)
    }
    expect(pages, 'Chronik zeigt die restlichen Wochen').toBeGreaterThan(0)
    await expect(page.getByRole('dialog')).toHaveCount(0)
  }
  report(problems)
})

test('Spielstand übersteht Neuladen und Schließen des Tabs', async ({ page, context }) => {
  const problems = watch(page)
  await page.goto('./')
  await play(page, problems, {
    level: 1,
    start: /^Neues Spiel beginnen/,
    // Stoppen, sobald in Woche 2 die Karte zu sehen ist
    until: (s) => s.btns.some((b) => b.label === 'Woche beenden') && s.btns.some((b) => /Aussicht/.test(b.label)),
    maxSteps: 400,
  })
  const before = await saved(page)
  expect(before.members.length).toBeGreaterThan(0)

  // Tab schließen und neu öffnen, wie nach der Pause
  await page.close()
  const again = await context.newPage()
  const problems2 = watch(again)
  await again.goto('./')
  const cont = again.getByRole('button', { name: /Spiel fortsetzen/ })
  await expect(cont).toBeVisible()
  await expect(cont).toContainText(before.members.find((m: { isLeader: boolean }) => m.isLeader).name)
  await cont.tap()
  await expect(again.getByRole('button', { name: 'Woche beenden' })).toBeVisible()
  const after = await saved(again)
  expect(after.weekIndex).toBe(before.weekIndex)
  expect(after.missions).toEqual(before.missions)
  report(problems)
  report(problems2)
})

test('Worterklärungen, Hinweise, QR-Code, Bildnachweis und Vorgeschichte', async ({ page }) => {
  const problems = watch(page)
  await page.goto('./')

  await page.getByRole('button', { name: 'Wörter' }).tap()
  const lex = page.getByRole('dialog')
  await expect(lex).toBeVisible()
  await expect(lex.getByText(/Faschismus/).first()).toBeVisible()
  expect((await scan(page)).overflow).toBeLessThanOrEqual(1)
  await page.keyboard.press('Escape')
  await expect(lex).toBeHidden()

  await page.getByRole('button', { name: 'Lehrkräfte' }).tap()
  await expect(page.locator('[role=img][aria-label^="QR-Code"] svg')).toBeVisible()
  await page.getByRole('button', { name: /QR-Code groß zeigen/ }).tap()
  const big = page.locator('[role=img][aria-label^="QR-Code"]')
  expect((await big.boundingBox())!.width).toBeGreaterThan(300)
  await page.getByRole('button', { name: /Zurück zu den Hinweisen/ }).tap()
  await page.getByRole('button', { name: /Bildnachweis ansehen/ }).tap()
  // Alle Fotos müssen tatsächlich laden
  const imgs = page.getByRole('dialog').locator('img')
  const n = await imgs.count()
  expect(n).toBeGreaterThanOrEqual(19)
  for (let i = 0; i < n; i++) {
    await imgs.nth(i).scrollIntoViewIfNeeded()
    await expect.poll(() => imgs.nth(i).evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
  }
  await page.keyboard.press('Escape')

  await page.getByRole('button', { name: /Vorgeschichte/ }).tap()
  for (let i = 0; i < 12; i++) {
    const s = await scan(page)
    expect(s.overflow, 'Vorgeschichte zu breit').toBeLessThanOrEqual(1)
    const img = page.locator('main img').first()
    if (await img.count()) await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
    const next = page.getByRole('button', { name: /^Weiter/ })
    if (!(await next.count())) break
    await next.first().tap()
  }
  report(problems)
})

test('beschädigter Spielstand führt nicht zu einer weißen Seite', async ({ page }) => {
  await page.goto('./')
  await page.evaluate((k) => {
    localStorage.setItem(k, JSON.stringify({ state: { phase: 'map', weekIndex: 3, members: [{ id: 'x' }], missions: 'kaputt' }, version: 3 }))
  }, SAVE_KEY)
  await page.reload()
  const cont = page.getByRole('button', { name: /Spiel fortsetzen/ })
  if (await cont.isVisible()) await cont.tap()
  // Entweder läuft das Spiel trotzdem, oder die Fehlerseite bietet einen Ausweg
  const alert = page.getByRole('alert')
  if (await alert.isVisible()) {
    await expect(alert).toContainText('Neu laden')
    page.once('dialog', (d) => d.accept())
    await alert.getByRole('button', { name: 'Spielstand löschen' }).tap()
    await expect(page.getByRole('button', { name: /Neues Spiel beginnen/ })).toBeVisible()
  } else {
    await expect(page.locator('#root')).not.toBeEmpty()
  }
})

test('Einführung erklärt beim ersten Mal das Spielprinzip und lässt sich wieder öffnen', async ({ page }) => {
  const problems = watch(page)
  await page.goto('./')
  // Bis zur ersten Seite der Einführung spielen
  await play(page, problems, { level: 1, start: /^Neues Spiel beginnen/, until: () => false, stopAtDialog: /^So geht’s/, maxSteps: 300 })
  const dialog = page.getByRole('dialog', { name: /^So geht’s/ })
  await expect(dialog).toContainText('Worum es geht')
  for (let i = 0; i < 6; i++) await dialog.getByRole('button', { name: /^Weiter/ }).tap()
  await dialog.getByRole('button', { name: /Los geht/ }).tap()
  await expect(dialog).toHaveCount(0)
  await expect(page.getByText('Erste Schritte')).toBeVisible()
  // Nach dem Neuladen kommt die Einführung nicht noch einmal von selbst
  await page.reload()
  await page.getByRole('button', { name: /Spiel fortsetzen/ }).tap()
  await expect(page.getByRole('button', { name: 'Woche beenden' })).toBeVisible()
  await expect(dialog).toHaveCount(0)
  await page.getByRole('button', { name: /So geht/ }).tap()
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Erklärung schließen' }).tap()
  await expect(dialog).toHaveCount(0)
  report(problems)
})
