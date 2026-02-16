import { useState, useCallback, useRef } from 'react'
import * as sounds from '../utils/sounds'

const STORAGE_KEY = 'neon-sweeper-mute'

/**
 * Hook for game sound effects and mute state (persisted to localStorage).
 * @returns {{ muted: boolean, setMuted: (v: boolean) => void, playReveal: () => void, playFlag: () => void, playExplosion: () => void, playWin: () => void }}
 */

function getStoredMute() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function setStoredMute(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false')
  } catch {}
}

export function useSound() {
  const [muted, setMutedState] = useState(getStoredMute)
  const initialized = useRef(false)

  const initOnce = useCallback(() => {
    if (initialized.current) return
    initialized.current = true
    sounds.initAudio()
  }, [])

  const setMuted = useCallback(value => {
    setMutedState(value)
    setStoredMute(value)
  }, [])

  const playReveal = useCallback(() => {
    if (!muted) {
      initOnce()
      sounds.playReveal()
    }
  }, [muted, initOnce])

  const playFlag = useCallback(() => {
    if (!muted) {
      initOnce()
      sounds.playFlag()
    }
  }, [muted, initOnce])

  const playExplosion = useCallback(() => {
    if (!muted) {
      initOnce()
      sounds.playExplosion()
    }
  }, [muted, initOnce])

  const playWin = useCallback(() => {
    if (!muted) {
      initOnce()
      sounds.playWin()
    }
  }, [muted, initOnce])

  return {
    muted,
    setMuted,
    playReveal,
    playFlag,
    playExplosion,
    playWin,
  }
}
