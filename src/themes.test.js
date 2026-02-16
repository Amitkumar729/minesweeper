import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { THEMES, getStoredTheme, setStoredTheme, THEME_STORAGE_KEY } from './themes'

describe('themes', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('THEMES', () => {
    it('has neon, matrix, amber, nuclear', () => {
      expect(THEMES.neon).toEqual({ label: 'NEON', value: 'neon' })
      expect(THEMES.matrix).toBeDefined()
      expect(THEMES.amber).toBeDefined()
      expect(THEMES.nuclear).toBeDefined()
    })
  })

  describe('getStoredTheme', () => {
    it('returns neon when nothing stored', () => {
      expect(getStoredTheme()).toBe('neon')
    })

    it('returns stored theme when valid', () => {
      setStoredTheme('matrix')
      expect(getStoredTheme()).toBe('matrix')
      setStoredTheme('amber')
      expect(getStoredTheme()).toBe('amber')
    })

    it('returns neon for invalid stored value', () => {
      localStorage.setItem(THEME_STORAGE_KEY, 'invalid')
      expect(getStoredTheme()).toBe('neon')
    })
  })

  describe('setStoredTheme', () => {
    it('persists theme to localStorage', () => {
      setStoredTheme('nuclear')
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('nuclear')
    })
  })
})
