export const THEMES = {
  neon: { label: 'NEON', value: 'neon' },
  matrix: { label: 'MATRIX', value: 'matrix' },
  amber: { label: 'AMBER', value: 'amber' },
  nuclear: { label: 'NUCLEAR', value: 'nuclear' },
}

export const THEME_STORAGE_KEY = 'neon-sweeper-theme'

export function getStoredTheme() {
  try {
    const t = localStorage.getItem(THEME_STORAGE_KEY)
    if (THEMES[t]) return t
  } catch {}
  return 'neon'
}

export function setStoredTheme(value) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, value)
  } catch {}
}
