import { THEMES } from '../themes'

export function ThemeSelector({ theme, onThemeChange }) {
  return (
    <div className="theme-selector">
      <span className="theme-selector-label">THEME</span>
      <div className="theme-selector-buttons">
        {Object.values(THEMES).map(({ label, value }) => (
          <button
            key={value}
            type="button"
            className={`btn btn-theme ${theme === value ? 'active' : ''}`}
            onClick={() => onThemeChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
