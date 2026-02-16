import { Header } from './components/Header'
import { Controls } from './components/Controls'
import { StatsBar } from './components/StatsBar'
import { Grid } from './components/Grid'
import { TerminalFooter } from './components/TerminalFooter'
import { Modal } from './components/Modal'
import { useMinesweeper } from './hooks/useMinesweeper'

function App() {
  const {
    difficulty,
    setDifficulty,
    grid,
    rows,
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
  } = useMinesweeper()

  return (
    <div className="terminal-theme">
      <div className="scanlines" aria-hidden="true" />
      <div className="crt-overlay" aria-hidden="true" />

      <main className="game-container">
        <Header />
        <Controls
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          onReset={startGame}
        />
        <StatsBar mines={mines} timer={timer} flags={flags} />
        {grid.length > 0 && (
          <Grid
            grid={grid}
            cols={cols}
            triggerCell={triggerCell}
            onCellClick={handleCellClick}
            onCellRightClick={handleCellRightClick}
          />
        )}
        <TerminalFooter message={terminalMessage} />
      </main>

      <Modal
        show={!!modal}
        title={modal?.title}
        message={modal?.message}
        onRestart={startGame}
      />
    </div>
  )
}

export default App
