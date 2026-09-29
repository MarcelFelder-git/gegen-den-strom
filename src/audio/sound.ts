/*
 * Die kurzen Geräusche werden im Browser erzeugt. Musik kommt als Aufnahme aus public/musik.
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
 * Echte Aufnahmen aus public/musik. Fehlt eine Datei, bleibt es still.
 * Jedes Stück läuft in einer nahtlosen Schleife, beim Wechsel blenden die Stücke ineinander über.
 * Gespeichert wird nur das Stück, das gerade läuft, als Mono-Puffer: Das schont den Speicher älterer iPads.
 */

export type Track = 'thema' | 'spiel' | null

const MUSIC_FILES: Record<Exclude<Track, null>, string> = {
  thema: 'musik/thema.mp3',
  spiel: 'musik/spiel.mp3',
}
/**
 * Lautstärke der Musik, dezent unter den Geräuschen. Gemessen: thema.mp3 liegt bei -16 dB (RMS),
 * spiel.mp3 bei -28 dB. So klingen beide etwa gleich leise, um -33 dB. Bei neuen Dateien neu abstimmen.
 */
const MUSIC_VOLUME: Record<Exclude<Track, null>, number> = { thema: 0.14, spiel: 0.55 }
/** Ein- und Ausblenden in Sekunden */
const FADE = 3

let track: Track = null
let playing: { track: Exclude<Track, null>; src: AudioBufferSourceNode; gain: GainNode } | null = null
/** Ein Stück als Mono-Puffer, dazu der Bereich ohne Stille am Anfang und Ende */
interface Loop {
  buffer: AudioBuffer
  start: number
  end: number
}
let cache: { track: Exclude<Track, null>; loop: Promise<Loop | null> } | null = null
let generation = 0

function loadTrack(c: AudioContext, t: Exclude<Track, null>): Promise<Loop | null> {
  if (cache?.track === t) return cache.loop
  const loop = fetch(import.meta.env.BASE_URL + MUSIC_FILES[t])
    .then((r) => (r.ok ? r.arrayBuffer() : null))
    .then((data) => (data ? c.decodeAudioData(data) : null))
    .then((b) => (b ? trimmed(toMono(c, b)) : null))
    .catch(() => null)
  cache = { track: t, loop }
  return loop
}

/** Stille am Anfang und Ende überspringen, sonst entsteht beim Wiederholen eine Pause */
function trimmed(buffer: AudioBuffer): Loop {
  const d = buffer.getChannelData(0)
  const quiet = 0.003 // etwa -50 dB
  let a = 0
  while (a < d.length && Math.abs(d[a]) < quiet) a++
  let b = d.length - 1
  while (b > a && Math.abs(d[b]) < quiet) b--
  if (b - a < buffer.sampleRate) return { buffer, start: 0, end: buffer.duration }
  return { buffer, start: a / buffer.sampleRate, end: (b + 1) / buffer.sampleRate }
}

function toMono(c: AudioContext, b: AudioBuffer): AudioBuffer {
  if (b.numberOfChannels === 1) return b
  const mono = c.createBuffer(1, b.length, b.sampleRate)
  const out = mono.getChannelData(0)
  const left = b.getChannelData(0)
  const right = b.getChannelData(1)
  for (let i = 0; i < out.length; i++) out[i] = (left[i] + right[i]) / 2
  return mono
}

function fadeOut(old: typeof playing) {
  if (!old || !ctx) return
  try {
    old.gain.gain.cancelScheduledValues(ctx.currentTime)
    old.gain.gain.setValueAtTime(old.gain.gain.value, ctx.currentTime)
    old.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE)
    old.src.stop(ctx.currentTime + FADE + 0.1)
  } catch {
    /* bereits gestoppt */
  }
}

function startMusic() {
  const a = audio()
  const t = track
  if (!a || !t || playing?.track === t) return
  const mine = ++generation
  void loadTrack(a.ctx, t).then((loop) => {
    // Inzwischen ein anderes Stück gewünscht oder Ton aus: nichts tun
    if (!loop || mine !== generation || muted || track !== t) return
    fadeOut(playing)
    const src = a.ctx.createBufferSource()
    src.buffer = loop.buffer
    src.loop = true
    src.loopStart = loop.start
    src.loopEnd = loop.end
    const gain = a.ctx.createGain()
    const now = a.ctx.currentTime
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(MUSIC_VOLUME[t], now + FADE)
    src.connect(gain).connect(a.out)
    src.start(now, loop.start)
    playing = { track: t, src, gain }
  })
}

function stopMusic() {
  generation++
  fadeOut(playing)
  playing = null
}

/** Welche Musik gerade laufen soll. Dasselbe Stück läuft einfach weiter, ohne Neustart. */
export function setMusic(next: Track) {
  if (next === track) return
  track = next
  if (!next) return stopMusic()
  if (!muted) startMusic()
}
