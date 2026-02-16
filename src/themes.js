/**
 * Theme options for the UI. Keys are theme ids; values are { label, value }.
 */
export const THEMES = {
  neon: { label: 'NEON', value: 'neon' },
  matrix: { label: 'MATRIX', value: 'matrix' },
  amber: { label: 'AMBER', value: 'amber' },
  nuclear: { label: 'NUCLEAR', value: 'nuclear' },
}

export const THEME_STORAGE_KEY = 'neon-sweeper-theme'

/**
 * Read persisted theme from localStorage. Returns 'neon' if missing or invalid.
 * @returns {string}
 */
export function getStoredTheme() {
  try {
    const t = localStorage.getItem(THEME_STORAGE_KEY)
    if (THEMES[t]) return t
  } catch (_) {}
  return 'neon'
}

/**
 * Persist theme to localStorage.
 * @param {string} value - Theme id (e.g. 'neon', 'matrix').
 */
export function setStoredTheme(value) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, value)
  } catch (_) {}
}
