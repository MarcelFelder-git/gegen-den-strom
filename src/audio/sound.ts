/*
 * Alle Geräusche werden im Browser erzeugt, es gibt keine Tondateien.
 * Browser erlauben Ton erst nach einer Nutzeraktion; bis dahin bleibt alles still.
 */

const STORAGE_KEY = 'gegen-den-strom-ton'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = readMuted()
const loops = new Map<string, () => void>()

function readMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'aus'
  } catch {
    return false
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
    if (ctx.state === 'suspended') void ctx.resume()
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

function tone(opts: { freq: number; dur: number; gain: number; type?: OscillatorType; freqEnd?: number; when?: number }) {
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
  o.connect(g).connect(a.out)
  o.start(t)
  o.stop(t + opts.dur)
}

export const sound = {
  /** Eine Taste der Schreibmaschine */
  typeKey() {
    burst({ dur: 0.03, type: 'bandpass', freq: 2200 + Math.random() * 1400, q: 3, gain: 0.12 })
  },
  /** Die Glocke am Zeilenende */
  bell() {
    tone({ freq: 2093, dur: 0.7, gain: 0.05 })
    tone({ freq: 3136, dur: 0.5, gain: 0.025 })
  },
  /** Ein Gummistempel schlägt auf */
  stamp() {
    tone({ freq: 140, freqEnd: 45, dur: 0.18, gain: 0.35 })
    burst({ dur: 0.08, type: 'lowpass', freq: 900, gain: 0.25 })
  },
  /** Ein Kalenderblatt wird abgerissen */
  tear(when = 0) {
    burst({ dur: 0.35, type: 'bandpass', freq: 1400, freqEnd: 4200, q: 0.8, gain: 0.14, when })
  },
  /** Eine Zeitung wirbelt herein */
  whoosh() {
    burst({ dur: 0.7, type: 'bandpass', freq: 250, freqEnd: 1800, q: 0.7, gain: 0.12 })
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
  /** Leises Klicken für Knöpfe */
  click() {
    burst({ dur: 0.02, type: 'highpass', freq: 1800, gain: 0.05 })
  },

  /** Dauergeräusche: Projektor, Regen, Feuer */
  startLoop(kind: 'projektor' | 'regen' | 'feuer') {
    if (loops.has(kind)) return
    const a = audio()
    if (!a) return
    const src = a.ctx.createBufferSource()
    src.buffer = noise(a.ctx, 2)
    src.loop = true
    const f = a.ctx.createBiquadFilter()
    const g = a.ctx.createGain()
    const nodes: AudioNode[] = [src, f, g]
    let timer: number | undefined
    if (kind === 'projektor') {
      f.type = 'bandpass'
      f.frequency.value = 520
      f.Q.value = 2
      g.gain.value = 0.02
      // Das Rattern des Filmprojektors: 18 Bilder pro Sekunde
      const lfo = a.ctx.createOscillator()
      lfo.type = 'square'
      lfo.frequency.value = 18
      const depth = a.ctx.createGain()
      depth.gain.value = 0.012
      lfo.connect(depth).connect(g.gain)
      lfo.start()
      nodes.push(lfo, depth)
    } else if (kind === 'regen') {
      f.type = 'highpass'
      f.frequency.value = 1200
      g.gain.value = 0.05
    } else {
      f.type = 'lowpass'
      f.frequency.value = 500
      g.gain.value = 0.06
      timer = window.setInterval(() => {
        if (Math.random() < 0.6) burst({ dur: 0.02 + Math.random() * 0.03, type: 'highpass', freq: 2500, gain: 0.08 + Math.random() * 0.1 })
      }, 90)
    }
    src.connect(f).connect(g).connect(a.out)
    src.start()
    loops.set(kind, () => {
      if (timer) clearInterval(timer)
      try {
        g.gain.setTargetAtTime(0, a.ctx.currentTime, 0.15)
        src.stop(a.ctx.currentTime + 0.6)
        for (const n of nodes) if (n instanceof OscillatorNode) n.stop(a.ctx.currentTime + 0.6)
      } catch {
        /* bereits gestoppt */
      }
    })
  },
  stopLoop(kind: 'projektor' | 'regen' | 'feuer') {
    loops.get(kind)?.()
    loops.delete(kind)
  },
  stopAll() {
    for (const k of [...loops.keys()]) this.stopLoop(k as 'projektor')
  },
}

/**
 * iPad und iPhone erlauben Ton nur nach einer Berührung. Beim ersten Tippen
 * wird der Tonkanal geöffnet, danach funktionieren auch automatische Geräusche.
 */
export function unlockAudioOnFirstTouch() {
  const unlock = () => {
    const a = audio()
    if (a) {
      const src = a.ctx.createBufferSource()
      src.buffer = a.ctx.createBuffer(1, 1, 22050)
      src.connect(a.out)
      src.start(0)
    }
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('touchend', unlock)
  }
  window.addEventListener('pointerdown', unlock, { passive: true })
  window.addEventListener('touchend', unlock, { passive: true })
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
  if (value) sound.stopAll()
}
