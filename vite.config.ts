import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' erlaubt das Hosten in jedem Unterordner, etwa auf einem Schulserver.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    // Alle Texte beider Kapitel in zwei Sprachstufen stecken im Bundle, gezippt rund 230 KB. Das ist gewollt.
    chunkSizeWarningLimit: 900,
  },
})
