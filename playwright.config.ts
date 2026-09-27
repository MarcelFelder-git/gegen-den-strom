import { defineConfig, devices } from '@playwright/test'

/**
 * Tests in der Safari-Engine (WebKit) mit iPad-Bildschirm und Touch.
 * Start: npm run test:ipad (baut das Spiel und spielt es automatisch durch).
 */
export default defineConfig({
  testDir: 'e2e',
  testMatch: '*.e2e.ts',
  timeout: 40 * 60_000,
  workers: 3,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'iPad hochkant', use: { ...devices['iPad (gen 7)'], browserName: 'webkit' } },
    { name: 'iPad quer', use: { ...devices['iPad (gen 7) landscape'], browserName: 'webkit' } },
    { name: 'iPad mini hochkant', use: { ...devices['iPad Mini'], browserName: 'webkit' } },
    // Falls ein Kind Safari aus Versehen in die geteilte Ansicht schiebt
    { name: 'iPad geteilter Bildschirm', use: { ...devices['iPad (gen 7) landscape'], viewport: { width: 507, height: 810 }, browserName: 'webkit' } },
  ],
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173/',
    // Immer frisch bauen, damit nie ein alter Stand getestet wird
    reuseExistingServer: false,
    timeout: 180_000,
  },
})
