import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import { Header } from './components/Header'
import { Controls } from './components/Controls'
import { StatsBar } from './components/StatsBar'
import { Grid } from './components/Grid'
import { TerminalFooter } from './components/TerminalFooter'
import { ThemeSelector } from './components/ThemeSelector'
import { MuteButton } from './components/MuteButton'
import { useMinesweeper } from './hooks/useMinesweeper'
import { useSound } from './hooks/useSound'
import { getStoredTheme, setStoredTheme } from './themes'
import './lib/firebase'

const Modal = lazy(() => import('./components/Modal').then(m => ({ default: m.Modal })))

function App() {
  const [theme, setThemeState] = useState(getStoredTheme)
  const [gameOverEffect, setGameOverEffect] = useState(false)

  const {
    muted,
    setMuted,
    playReveal,
    playFlag,
    playExplosion,
    playWin,
  } = useSound()

  const {
    difficulty,
    setDifficulty,
    grid,
    cols,
    mines,
    flags,
    timer,
    triggerCell,
    modal,
    terminalMessage,
    startGame,
    handleCellClick,
    handleCellRightClick,
  } = useMinesweeper(
    useMemo(
      () => ({
        onReveal: playReveal,
        onFlag: playFlag,
        onExplosion: playExplosion,
        onWin: playWin,
      }),
      [playReveal, playFlag, playExplosion, playWin]
    )
  )

  const setTheme = useCallback(value => {
    setThemeState(value)
    setStoredTheme(value)
  }, [])

  useEffect(() => {
    if (modal?.title === 'MISSION_FAILED') {
      setGameOverEffect(true)
      const t = setTimeout(() => setGameOverEffect(false), 1500)
      return () => clearTimeout(t)
    }
  }, [modal?.title])

  return (
    <div
      className={`terminal-theme ${gameOverEffect ? 'game-over-effect' : ''}`}
      data-theme={theme}
    >
      {gameOverEffect && (
        <>
          <div className="game-over-flash" aria-hidden="true" />
          <div className="game-over-static" aria-hidden="true" />
        </>
      )}
      <div className="scanlines" aria-hidden="true" />
      <div className="crt-overlay" aria-hidden="true" />

      <main className="game-container">
        <Header
          muteButton={<MuteButton muted={muted} onToggle={() => setMuted(!muted)} />}
          themeSelector={
            <ThemeSelector theme={theme} onThemeChange={setTheme} />
          }
        />
        <Controls
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          onReset={startGame}
        />
        <StatsBar mines={mines} timer={timer} flags={flags} />
        <div className="grid-wrapper">
          {grid.length > 0 && (
            <Grid
              grid={grid}
              cols={cols}
              triggerCell={triggerCell}
              onCellClick={handleCellClick}
              onCellRightClick={handleCellRightClick}
            />
          )}
        </div>
        <TerminalFooter message={terminalMessage} />
      </main>

      <Suspense fallback={null}>
        <Modal
          show={!!modal}
          title={modal?.title}
          message={modal?.message}
          onRestart={startGame}
        />
      </Suspense>
    </div>
  )
}

export default App
