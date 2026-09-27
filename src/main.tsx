import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/courier-prime/latin-400.css'
import '@fontsource/courier-prime/latin-700.css'
import '@fontsource/courier-prime/latin-400-italic.css'
import '@fontsource/old-standard-tt/latin-400.css'
import '@fontsource/old-standard-tt/latin-700.css'
import '@fontsource/old-standard-tt/latin-400-italic.css'
import '@fontsource/unifrakturmaguntia/400.css'
import './index.css'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { unlockAudioOnFirstTouch } from './audio/sound'

unlockAudioOnFirstTouch()

const root = createRoot(document.getElementById('root')!)

if (import.meta.env.DEV && new URLSearchParams(location.search).has('szenen')) {
  import('./components/cutscene/SceneGallery').then(({ default: SceneGallery }) => root.render(<SceneGallery />))
} else {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
}
