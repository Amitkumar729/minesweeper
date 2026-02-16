import { useState, useCallback, useRef, useEffect } from 'react'
import { CONFIG } from '../config'

function createEmptyGrid(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    }))
  )
}

function placeMines(grid, rows, cols, mines) {
  const next = grid.map(row => row.map(cell => ({ ...cell })))
  let placed = 0
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    if (!next[r][c].isMine) {
      next[r][c].isMine = true
      placed++
    }
  }
  return next
}

function countNeighbors(grid, rows, cols, r, c) {
  let count = 0
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const rr = r + i
      const cc = c + j
      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols && grid[rr][cc].isMine) count++
    }
  }
  return count
}

function calculateNeighbors(grid, rows, cols) {
  return grid.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      neighborMines: cell.isMine ? 0 : countNeighbors(grid, rows, cols, r, c),
    }))
  )
}

export function useMinesweeper() {
  const [difficulty, setDifficultyState] = useState('easy')
  const [grid, setGrid] = useState([])
  const [flags, setFlags] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [triggerCell, setTriggerCell] = useState(null) // [r, c] for explosion
  const [modal, setModal] = useState(null) // { title, message } or null
  const [terminalMessage, setTerminalMessage] = useState('System ready. Awaiting user input...')

  const timerRef = useRef(null)
  const config = CONFIG[difficulty]
  const { rows, cols, mines } = config

  const totalNonMines = rows * cols - mines

  const startGame = useCallback(() => {
    setModal(null)
    setTriggerCell(null)
    setIsGameOver(false)
    setFlags(0)
    setTimer(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    let initial = createEmptyGrid(rows, cols)
    initial = placeMines(initial, rows, cols, mines)
    initial = calculateNeighbors(initial, rows, cols)
    setGrid(initial)
    setTerminalMessage(`System initialized. Level: ${difficulty.toUpperCase()}. Ready for sweeping.`)
  }, [difficulty, rows, cols, mines])

  useEffect(() => {
    startGame()
  }, [difficulty, startGame])

  const cellsRevealed = grid.flat().filter(c => c.isRevealed).length

  const startTimer = useCallback(() => {
    if (timerRef.current) return
    timerRef.current = setInterval(() => {
      setTimer(t => t + 1)
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const revealCell = useCallback(
    (r, c) => {
      setGrid(prev => {
        const cell = prev[r][c]
        if (cell.isRevealed || cell.isFlagged) return prev
        const next = prev.map((row, ri) =>
          row.map((cell, ci) => {
            if (ri !== r || ci !== c) return cell
            return { ...cell, isRevealed: true }
          })
        )
        if (cell.neighborMines === 0) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const rr = r + i
              const cc = c + j
              if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) {
                const n = next[rr][cc]
                if (!n.isRevealed && !n.isFlagged) {
                  next[rr][cc] = { ...n, isRevealed: true }
                  if (n.neighborMines === 0) {
                    // recursive reveal for empty neighbors (handled in next render via effect or we do it here in one pass)
                  }
                }
              }
            }
          }
        }
        return next
      })
    },
    [rows, cols]
  )

  // Flood-fill: after state update we need to reveal all connected zeros. Do it in a single setGrid that does full flood.
  const revealCellWithFlood = useCallback(
    (r, c) => {
      setGrid(prev => {
        const stack = [[r, c]]
        const next = prev.map(row => row.map(cell => ({ ...cell })))
        const seen = new Set()
        const key = (rr, cc) => `${rr},${cc}`

        while (stack.length) {
          const [rr, cc] = stack.pop()
          if (rr < 0 || rr >= rows || cc < 0 || cc >= cols) continue
          if (seen.has(key(rr, cc))) continue
          const cell = next[rr][cc]
          if (cell.isRevealed || cell.isFlagged) continue
          seen.add(key(rr, cc))
          next[rr][cc] = { ...cell, isRevealed: true }
          if (cell.neighborMines === 0) {
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                stack.push([rr + i, cc + j])
              }
            }
          }
        }
        return next
      })
    },
    [rows, cols]
  )

  const handleCellClick = useCallback(
    (r, c) => {
      if (isGameOver) return
      const cell = grid[r]?.[c]
      if (!cell || cell.isRevealed || cell.isFlagged) return

      if (timer === 0) startTimer()

      if (cell.isMine) {
        stopTimer()
        setTriggerCell([r, c])
        setIsGameOver(true)
        setTerminalMessage(`CRITICAL_ERROR: Kinetic mine detonated at [${r},${c}]. System compromised.`)
        setModal({ title: 'MISSION_FAILED', message: 'System breach detected. Kinetic mine detonated.' })
        setGrid(prev =>
          prev.map((row, ri) =>
            row.map((cell, ci) =>
              cell.isMine ? { ...cell, isRevealed: true } : cell
            )
          )
        )
      } else {
        revealCellWithFlood(r, c)
      }
    },
    [grid, isGameOver, timer, startTimer, stopTimer, revealCellWithFlood]
  )

  useEffect(() => {
    if (isGameOver || grid.length === 0) return
    const revealed = grid.flat().filter(c => c.isRevealed).length
    if (revealed === totalNonMines) {
      stopTimer()
      setIsGameOver(true)
      setTerminalMessage('MISSION_SUCCESS: Sector cleared of all kinetic threats.')
      setModal({ title: 'MISSION_COMPLETE', message: 'All threats neutralized. Sector secure.' })
    }
  }, [grid, isGameOver, totalNonMines, stopTimer])

  const handleCellRightClick = useCallback(
    (r, c) => {
      if (isGameOver) return
      const cell = grid[r][c]
      if (cell.isRevealed) return

      setGrid(prev =>
        prev.map((row, ri) =>
          row.map((cell, ci) =>
            ri === r && ci === c ? { ...cell, isFlagged: !cell.isFlagged } : cell
          )
        )
      )
      setFlags(f => f + (cell.isFlagged ? -1 : 1))
      setTerminalMessage(
        cell.isFlagged
          ? `Flag retracted from [${r},${c}].`
          : `Flag deployed at [${r},${c}]. Sensors detecting anomalies.`
      )
    },
    [grid, isGameOver]
  )

  const setDifficulty = useCallback(level => {
    setDifficultyState(level)
  }, [])

  return {
    difficulty,
    setDifficulty,
    grid,
    rows,
    cols,
    mines,
    flags,
    timer,
    isGameOver,
    triggerCell,
    modal,
    terminalMessage,
    startGame,
    handleCellClick,
    handleCellRightClick,
  }
}
