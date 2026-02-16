export function Header({ muteButton, themeSelector }) {
  return (
    <header className="terminal-header">
      <h1 className="glitch" data-text="NEON_SWEEPER">
        NEON_SWEEPER
      </h1>
      <div className="header-right">
        {themeSelector}
        {muteButton}
        <div className="system-status">
          <span className="status-item">LOC: <span>SECTOR_07</span></span>
          <span className="status-item">OS: <span>KROM_OS_v4.2</span></span>
        </div>
      </div>
    </header>
  )
}
