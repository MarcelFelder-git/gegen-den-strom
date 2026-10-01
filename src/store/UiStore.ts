import { create } from 'zustand'
import { isMuted, setMuted, sound } from '../audio/sound'
import type { Level } from '../game/text'

type Overlay = 'lexikon' | 'lehrkraefte' | 'vorbilder' | 'chronik' | 'bildnachweis' | 'geholfen' | null

interface UiState {
  overlay: Overlay
  lexiconId: string | null
  openLexicon: (id?: string) => void
  openTeacherNotes: () => void
  openAlbum: () => void
  openChronicle: () => void
  openCredits: () => void
  /** Die Gesichter der Menschen, denen die Gruppe geholfen hat */
  openHelped: () => void
  /** Mit welchem Kapitel ein neues Spiel beginnt */
  startChapter: 1 | 2
  setStartChapter: (c: 1 | 2) => void
  /** Gewählte Stufe, bevor das Spiel beginnt */
  draftLevel: Level
  setDraftLevel: (l: Level) => void
  close: () => void
  /** Welche Zwischensequenzen in dieser Sitzung schon liefen */
  introSeen: number | null
  nightSeen: number | null
  markIntro: (week: number) => void
  markNight: (week: number) => void
  resetCutscenes: () => void
  muted: boolean
  toggleMuted: () => void
  /** Zählt hoch, wenn ein Spiel von außerhalb des Titels gestartet wurde, etwa die Vorschau für Lehrkräfte */
  gameRequest: number
  requestGame: () => void
}

/** Flüchtiger Oberflächenzustand, wird nicht gespeichert */
export const useUi = create<UiState>()((set) => ({
  overlay: null,
  lexiconId: null,
  openLexicon: (id) => set({ overlay: 'lexikon', lexiconId: id ?? null }),
  openTeacherNotes: () => set({ overlay: 'lehrkraefte' }),
  openAlbum: () => set({ overlay: 'vorbilder' }),
  openChronicle: () => set({ overlay: 'chronik' }),
  openCredits: () => set({ overlay: 'bildnachweis' }),
  openHelped: () => set({ overlay: 'geholfen' }),
  startChapter: 1,
  setStartChapter: (c) => set({ startChapter: c }),
  draftLevel: 'leicht',
  setDraftLevel: (l) => set({ draftLevel: l }),
  close: () => set({ overlay: null, lexiconId: null }),
  introSeen: null,
  nightSeen: null,
  markIntro: (week) => set({ introSeen: week }),
  markNight: (week) => set({ nightSeen: week }),
  resetCutscenes: () => set({ introSeen: null, nightSeen: null }),
  gameRequest: 0,
  requestGame: () => set((u) => ({ gameRequest: u.gameRequest + 1, overlay: null, introSeen: null, nightSeen: null })),
  muted: isMuted(),
  toggleMuted: () =>
    set((u) => {
      setMuted(!u.muted)
      // Beim Einschalten sofort ein leiser Klick: So öffnet das iPad den Tonkanal während der Berührung
      if (u.muted) sound.click()
      return { muted: !u.muted }
    }),
}))
