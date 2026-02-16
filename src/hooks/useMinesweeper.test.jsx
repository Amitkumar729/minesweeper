import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMinesweeper } from './useMinesweeper'

describe('useMinesweeper', () => {
  beforeEach(() => {
    // useMinesweeper starts a game on mount; difficulty effect runs startGame
  })

  it('returns initial state and handlers', () => {
    const { result } = renderHook(() => useMinesweeper({}))
    expect(result.current.difficulty).toBe('easy')
    expect(result.current.grid).toBeDefined()
    expect(result.current.rows).toBe(9)
    expect(result.current.cols).toBe(9)
    expect(result.current.mines).toBe(10)
    expect(result.current.flags).toBe(0)
    expect(result.current.timer).toBe(0)
    expect(result.current.isGameOver).toBe(false)
    expect(result.current.modal).toBe(null)
    expect(typeof result.current.startGame).toBe('function')
    expect(typeof result.current.handleCellClick).toBe('function')
    expect(typeof result.current.handleCellRightClick).toBe('function')
  })

  it('grid has correct dimensions for easy', () => {
    const { result } = renderHook(() => useMinesweeper({}))
    expect(result.current.grid.length).toBe(9)
    expect(result.current.grid[0].length).toBe(9)
  })

  it('setDifficulty changes level and grid size', () => {
    const { result } = renderHook(() => useMinesweeper({}))
    act(() => {
      result.current.setDifficulty('medium')
    })
    expect(result.current.difficulty).toBe('medium')
    expect(result.current.rows).toBe(16)
    expect(result.current.cols).toBe(16)
    expect(result.current.mines).toBe(40)
    expect(result.current.grid.length).toBe(16)
    expect(result.current.grid[0].length).toBe(16)
  })

  it('handleCellClick reveals cell (no mine)', () => {
    const { result } = renderHook(() => useMinesweeper({}))
    const gridBefore = result.current.grid
    let revealedRow = -1
    let revealedCol = -1
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!gridBefore[r][c].isMine) {
          revealedRow = r
          revealedCol = c
          break
        }
      }
      if (revealedRow >= 0) break
    }
    act(() => {
      result.current.handleCellClick(revealedRow, revealedCol)
    })
    expect(result.current.grid[revealedRow][revealedCol].isRevealed).toBe(true)
  })

  it('handleCellRightClick toggles flag', () => {
    const { result } = renderHook(() => useMinesweeper({}))
    expect(result.current.flags).toBe(0)
    act(() => {
      result.current.handleCellRightClick(0, 0)
    })
    expect(result.current.flags).toBe(1)
    expect(result.current.grid[0][0].isFlagged).toBe(true)
    act(() => {
      result.current.handleCellRightClick(0, 0)
    })
    expect(result.current.flags).toBe(0)
    expect(result.current.grid[0][0].isFlagged).toBe(false)
  })

  it('startGame resets flags and timer', () => {
    const { result } = renderHook(() => useMinesweeper({}))
    act(() => {
      result.current.handleCellRightClick(0, 0)
      result.current.handleCellClick(1, 1)
    })
    act(() => {
      result.current.startGame()
    })
    expect(result.current.flags).toBe(0)
    expect(result.current.timer).toBe(0)
    expect(result.current.modal).toBe(null)
    expect(result.current.isGameOver).toBe(false)
  })

  it('calls onReveal when revealing safe cell', () => {
    const onReveal = vi.fn()
    const { result } = renderHook(() => useMinesweeper({ onReveal }))
    let r = 0,
      c = 0
    for (r = 0; r < 9; r++) {
      for (c = 0; c < 9; c++) {
        if (!result.current.grid[r][c].isMine) break
      }
      if (!result.current.grid[r][c].isMine) break
    }
    act(() => result.current.handleCellClick(r, c))
    expect(onReveal).toHaveBeenCalledTimes(1)
  })
})
