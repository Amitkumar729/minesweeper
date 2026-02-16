/**
 * Terminal-style sounds via Web Audio API (no external files).
 * Call init() after user gesture (e.g. first click) to unlock audio context.
 */

let audioContext = null

function getContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

function beep(options = {}) {
  const ctx = getContext()
  const {
    frequency = 440,
    duration = 0.05,
    type = 'sine',
    volume = 0.15,
  } = options

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = frequency
  osc.type = type
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

export function playReveal() {
  beep({ frequency: 520, duration: 0.04, volume: 0.12 })
}

export function playFlag() {
  beep({ frequency: 380, duration: 0.06, volume: 0.12 })
}

export function playExplosion() {
  const ctx = getContext()
  const bufferSize = ctx.sampleRate * 0.15
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.4, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
  noise.connect(gain)
  gain.connect(ctx.destination)
  noise.start(ctx.currentTime)
  noise.stop(ctx.currentTime + 0.2)
  // Low boom
  beep({ frequency: 80, duration: 0.2, type: 'sawtooth', volume: 0.25 })
}

export function playWin() {
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, i) => {
    setTimeout(() => {
      beep({ frequency: freq, duration: 0.12, volume: 0.15 })
    }, i * 90)
  })
}

export function initAudio() {
  getContext().resume?.()
}
