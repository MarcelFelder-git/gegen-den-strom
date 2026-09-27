import { Component, type ErrorInfo, type ReactNode } from 'react'

const SAVE_KEY = 'gegen-den-strom-spielstand'

interface State {
  error: Error | null
}

/**
 * Fängt Fehler ab, damit auf dem Tablet nie eine leere weiße Seite bleibt.
 * Meist hilft Neuladen. Ist der Spielstand beschädigt, lässt er sich hier löschen.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Spiel abgestürzt', error, info.componentStack)
  }

  private reset = () => {
    if (!window.confirm('Den Spielstand auf diesem Gerät wirklich löschen? Das Spiel beginnt dann von vorn.')) return
    try {
      localStorage.removeItem(SAVE_KEY)
    } catch {
      /* Speicher nicht erreichbar, Neuladen hilft trotzdem oft */
    }
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div role="alert" className="grid min-h-dvh place-items-center bg-coal p-6 text-paper">
        <div className="max-w-lg border-4 border-paper/60 bg-ink p-8 font-serif">
          <h1 className="text-3xl font-bold">Hier ist etwas schiefgelaufen</h1>
          <p className="mt-3 text-lg leading-relaxed">
            Tippe auf „Neu laden“. Dein Spielstand bleibt dabei erhalten. Hilft das nicht, frag deine Lehrkraft.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => window.location.reload()}
              className="min-h-11 border-2 border-paper bg-paper px-5 py-2 font-type font-bold tracking-wider text-ink uppercase"
            >
              Neu laden
            </button>
            <button
              onClick={this.reset}
              className="min-h-11 border-2 border-paper/60 px-5 py-2 font-type text-sm tracking-wider uppercase"
            >
              Spielstand löschen
            </button>
          </div>
          <p className="mt-6 font-type text-xs break-words text-fog">Fehler: {this.state.error.message}</p>
        </div>
      </div>
    )
  }
}
