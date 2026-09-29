/*
 * Alle Geräusche werden im Browser erzeugt, es gibt keine Tondateien.
 * Browser erlauben Ton erst nach einer Nutzeraktion; bis dahin bleibt alles still.
 */

const STORAGE_KEY = 'gegen-den-strom-ton'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = readMuted()

function readMuted(): boolean {
  try {
    // Im Klassenraum ist der Ton zuerst aus. Nur wer ihn selbst einschaltet, hört ihn.
    return localStorage.getItem(STORAGE_KEY) !== 'an'
  } catch {
    return true
  }
}

function audio(): { ctx: AudioContext; out: GainNode } | null {
  if (muted) return null
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      ctx = new Ctor()
      master = ctx.createGain()
      master.gain.value = 0.8
      master.connect(ctx.destination)
    }
    // Safari meldet nach Sperrbildschirm oder App-Wechsel auch "interrupted"
    if (ctx.state !== 'running' && !document.hidden) void ctx.resume().catch(() => {})
    return { ctx, out: master! }
  } catch {
    return null
  }
}

function noise(c: AudioContext, seconds: number): AudioBuffer {
  const buf = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * seconds)), c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buf
}

/** Ein kurzer Rauschstoß durch einen Filter, Grundbaustein vieler Geräusche */
function burst(opts: { dur: number; type: BiquadFilterType; freq: number; q?: number; gain: number; freqEnd?: number; when?: number }) {
  const a = audio()
  if (!a) return
  const t = a.ctx.currentTime + (opts.when ?? 0)
  const src = a.ctx.createBufferSource()
  src.buffer = noise(a.ctx, opts.dur)
  const f = a.ctx.createBiquadFilter()
  f.type = opts.type
  f.frequency.setValueAtTime(opts.freq, t)
  if (opts.freqEnd) f.frequency.exponentialRampToValueAtTime(opts.freqEnd, t + opts.dur)
  f.Q.value = opts.q ?? 1
  const g = a.ctx.createGain()
  g.gain.setValueAtTime(opts.gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur)
  src.connect(f).connect(g).connect(a.out)
  src.start(t)
  src.stop(t + opts.dur)
}

function tone(opts: { freq: number; dur: number; gain: number; type?: OscillatorType; freqEnd?: number; when?: number; out?: AudioNode }) {
  const a = audio()
  if (!a) return
  const t = a.ctx.currentTime + (opts.when ?? 0)
  const o = a.ctx.createOscillator()
  o.type = opts.type ?? 'sine'
  o.frequency.setValueAtTime(opts.freq, t)
  if (opts.freqEnd) o.frequency.exponentialRampToValueAtTime(opts.freqEnd, t + opts.dur)
  const g = a.ctx.createGain()
  g.gain.setValueAtTime(opts.gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur)
  o.connect(g).connect(opts.out ?? a.out)
  o.start(t)
  o.stop(t + opts.dur)
}

/**
 * Nur wenige Töne an Stellen, die zählen: Stempel, Klopfen, Zellentür, Trillerpfeife,
 * Post, Hilfe und Vorbild. Keine Dauergeräusche, nichts beim Tippen oder Blättern.
 */
export const sound = {
  /** Ein Gummistempel schlägt auf */
  stamp() {
    tone({ freq: 140, freqEnd: 45, dur: 0.18, gain: 0.35 })
    burst({ dur: 0.08, type: 'lowpass', freq: 900, gain: 0.25 })
  },
  /** Die Trillerpfeife einer Streife */
  whistle(when = 0) {
    const a = audio()
    if (!a) return
    const t = a.ctx.currentTime + when
    const o = a.ctx.createOscillator()
    o.frequency.value = 2600
    const lfo = a.ctx.createOscillator()
    lfo.frequency.value = 28
    const depth = a.ctx.createGain()
    depth.gain.value = 120
    lfo.connect(depth).connect(o.frequency)
    const g = a.ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.045, t + 0.03)
    g.gain.setValueAtTime(0.045, t + 0.5)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7)
    o.connect(g).connect(a.out)
    o.start(t)
    lfo.start(t)
    o.stop(t + 0.75)
    lfo.stop(t + 0.75)
  },
  /** Klopfen an der Wohnungstür: hart am frühen Morgen, leise am Abend */
  knock(soft = false) {
    const v = soft ? 0.45 : 1
    for (let i = 0; i < 3; i++) {
      const when = i * (soft ? 0.26 : 0.2)
      tone({ freq: 170, freqEnd: 80, dur: 0.09, gain: 0.32 * v, when })
      burst({ dur: 0.05, type: 'lowpass', freq: 650, gain: 0.28 * v, when })
    }
  },
  /** Ein Brief ist angekommen: zwei leise Töne */
  post() {
    tone({ freq: 880, dur: 0.6, gain: 0.04, type: 'triangle' })
    tone({ freq: 698.46, dur: 0.9, gain: 0.04, type: 'triangle', when: 0.22 })
  },
  /** Ein neues Vorbild: ein ruhiger, feierlicher Akkord wie von einer Spieluhr */
  honor() {
    const notes = [261.63, 329.63, 392.0, 523.25]
    notes.forEach((freq, i) => {
      tone({ freq, dur: 2.2, gain: 0.06, type: 'triangle', when: i * 0.18 })
      tone({ freq: freq * 2, dur: 1.4, gain: 0.015, when: i * 0.18 })
    })
    tone({ freq: 130.81, dur: 2.8, gain: 0.05, when: 0.72 })
  },
  /** Ein Auftrag ist gelungen: ein kurzer, warmer Dreiklang */
  success() {
    ;[523.25, 659.25, 783.99].forEach((freq, i) => tone({ freq, dur: 1.2 - i * 0.2, gain: 0.05, type: 'triangle', when: i * 0.09 }))
  },
  /** Jemandem wurde geholfen: ein heller, warmer Ton */
  helped() {
    tone({ freq: 659.25, dur: 0.9, gain: 0.05, type: 'triangle' })
    tone({ freq: 987.77, dur: 1.1, gain: 0.03, type: 'triangle', when: 0.12 })
  },
  /** Eine Zellentür fällt ins Schloss */
  cellDoor() {
    tone({ freq: 90, freqEnd: 40, dur: 0.6, gain: 0.3, type: 'square' })
    burst({ dur: 0.25, type: 'lowpass', freq: 700, gain: 0.3 })
    burst({ dur: 0.12, type: 'bandpass', freq: 2400, q: 6, gain: 0.08, when: 0.08 })
  },
  /** Leises Klicken, nur beim Einschalten des Tons */
  click() {
    burst({ dur: 0.02, type: 'highpass', freq: 1800, gain: 0.05 })
  },
}

/**
 * iPad und iPhone erlauben Ton nur nach einer Berührung. Beim ersten Tippen
 * wird der Tonkanal geöffnet, danach funktionieren auch automatische Geräusche.
 * Nach Sperrbildschirm, App-Wechsel oder einem Anruf hält Safari den Tonkanal an.
 * Dann öffnet ihn die nächste Berührung wieder. Ist die Seite verborgen, pausiert der Ton.
 */
export function unlockAudioOnFirstTouch() {
  let primed = false
  const wake = () => {
    if (muted) return
    if (!primed) {
      const a = audio()
      if (!a) return
      const src = a.ctx.createBufferSource()
      src.buffer = a.ctx.createBuffer(1, 1, 22050)
      src.connect(a.out)
      src.start(0)
      primed = true
    } else if (ctx && ctx.state !== 'running') {
      void ctx.resume().catch(() => {})
    }
  }
  window.addEventListener('pointerdown', wake, { passive: true, capture: true })
  window.addEventListener('touchend', wake, { passive: true, capture: true })
  window.addEventListener('keydown', wake, { capture: true })
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return
    if (document.hidden) void ctx.suspend().catch(() => {})
    else if (!muted) void ctx.resume().catch(() => {})
  })
}

export function isMuted(): boolean {
  return muted
}

export function setMuted(value: boolean) {
  muted = value
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'aus' : 'an')
  } catch {
    /* Speichern nicht möglich, dann gilt die Einstellung nur für diese Sitzung */
  }
  if (value) stopMusic()
  else if (track) startMusic()
}

/* ---------- Musik ----------
 * Eine Spieluhr, im Browser erzeugt. Auf Titel und Ende „Die Gedanken sind frei“ (Volkslied um 1800, gemeinfrei),
 * in den Wochen leise, warme Akkorde mit langen Pausen. In der Nacht, der Wochenschau und der Vorgeschichte schweigt sie.
 */

export type Track = 'thema' | 'woche' | null

let track: Track = null
let bus: GainNode | null = null
let timer: number | undefined

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12)

/** Ein Ton der Spieluhr: klarer Anschlag, langes Ausklingen */
function pluck(out: AudioNode, when: number, midi: number, gain: number, ring = 2.2) {
  const f = hz(midi)
  tone({ freq: f, dur: ring, gain, when, out })
  tone({ freq: f * 2, dur: ring * 0.45, gain: gain * 0.22, when, out })
  tone({ freq: f * 3, dur: ring * 0.2, gain: gain * 0.06, when, out })
}

/** Ein weicher, tiefer Ton als Grundlage */
function bass(out: AudioNode, when: number, midi: number, dur: number, gain = 0.05) {
  tone({ freq: hz(midi), dur, gain, type: 'triangle', when, out })
}

// „Die Gedanken sind frei“ in C-Dur, 3/4-Takt, [MIDI-Ton, Dauer in Schlägen]
// Nach dem Satz im LilyPond-Wiki (lilypond.miraheze.org/wiki/Die_Gedanken_sind_frei)
const G4 = 67, A4 = 69, B4 = 71, C5 = 72, D5 = 74, E5 = 76, F4 = 65, D4 = 62, E4 = 64, C4 = 60
const MELODY: [number, number][] = [
  [G4, 0.5], [G4, 0.5],
  [C5, 1], [C5, 1], [E5, 0.5], [C5, 0.5], [G4, 2], [G4, 1], [F4, 1], [D4, 1], [G4, 1], [E4, 1], [C4, 1],
  [G4, 1], [C5, 1], [C5, 1], [E5, 0.5], [C5, 0.5], [G4, 2], [G4, 1], [F4, 1], [D4, 1], [G4, 1], [E4, 1], [C4, 1],
  [C5, 1], [B4, 1], [D5, 1], [B4, 1], [C5, 1], [E5, 1], [C5, 1], [B4, 1], [D5, 1], [B4, 1], [C5, 1], [E5, 1],
  [C5, 1], [A4, 1], [A4, 1], [C5, 0.5], [A4, 0.5], [G4, 2],
  [C5, 0.5], [E5, 0.5], [E5, 0.5], [D5, 0.5], [C5, 1], [B4, 1], [C5, 2],
]
// Grundtöne je Takt: C, C, G, C, C, C, G, C, G, C, G, C, F, C, G, C
const BASS_BARS = [48, 48, 43, 48, 48, 48, 43, 48, 43, 48, 43, 48, 41, 48, 43, 48]

/** Ohne laufenden Tonkanal nichts vormerken, sonst stauen sich die Töne und kommen alle auf einmal */
function running(): boolean {
  const a = audio()
  return !!a && a.ctx.state === 'running' && !document.hidden
}

/** Spielt das Thema einmal und liefert seine Dauer in Sekunden */
function playTheme(out: GainNode, slow = 1): number {
  const beat = 0.62 * slow
  const start = 0.3
  let t = 0
  for (const [midi, dur] of MELODY) {
    pluck(out, start + t * beat, midi, 0.07)
    t += dur
  }
  // Der Auftakt dauert einen Schlag, danach 16 Takte zu je drei Schlägen
  BASS_BARS.forEach((m, i) => bass(out, start + (1 + i * 3) * beat, m, 3 * beat))
  return t * beat
}

// Leise Akkorde für die Wochen: C, a-Moll, F, G. Aus jedem Akkord erklingen nur zwei oder drei Töne.
const CHORDS = [
  { root: 48, notes: [64, 67, 72, 76] },
  { root: 45, notes: [64, 69, 72, 76] },
  { root: 41, notes: [65, 69, 72, 77] },
  { root: 43, notes: [62, 67, 71, 74] },
]

/** Spielt die vier Akkorde einmal und liefert ihre Dauer in Sekunden */
function playWeek(out: GainNode): number {
  const len = 3.8
  CHORDS.forEach((c, i) => {
    const start = 0.3 + i * len
    bass(out, start, c.root, len * 1.1, 0.035)
    const count = 2 + Math.floor(Math.random() * 2)
    for (let k = 0; k < count; k++) {
      const note = c.notes[Math.floor(Math.random() * c.notes.length)]
      pluck(out, start + 0.2 + k * (0.9 + Math.random() * 0.5), note, 0.045, 2.6)
    }
  })
  return CHORDS.length * len
}

function schedule() {
  if (!track || muted) return
  if (!running() || !bus) {
    timer = window.setTimeout(schedule, 1000)
    return
  }
  let wait: number
  if (track === 'thema') {
    wait = playTheme(bus) + 7
  } else {
    // Ab und zu klingt das Thema langsam an, sonst nur Akkorde, dazwischen Stille
    wait = Math.random() < 0.25 ? playTheme(bus, 1.25) + 10 : playWeek(bus) + 6 + Math.random() * 10
  }
  timer = window.setTimeout(schedule, wait * 1000)
}

function startMusic() {
  stopMusic()
  const a = audio()
  if (!a || !track) return
  bus = a.ctx.createGain()
  bus.gain.value = 0.55
  bus.connect(a.out)
  schedule()
}

function stopMusic() {
  if (timer) clearTimeout(timer)
  timer = undefined
  const old = bus
  bus = null
  if (!old || !ctx) return
  try {
    old.gain.setTargetAtTime(0, ctx.currentTime, 0.25)
    window.setTimeout(() => old.disconnect(), 1500)
  } catch {
    /* bereits getrennt */
  }
}

/** Welche Musik gerade laufen soll. Dieselbe Musik wird nicht neu begonnen. */
export function setMusic(next: Track) {
  if (next === track) return
  track = next
  if (!next) return stopMusic()
  if (!muted) startMusic()
}
