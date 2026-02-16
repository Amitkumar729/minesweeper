import { describe, it, expect, beforeEach } from 'vitest'
import {
  createEmptyGrid,
  placeMines,
  countNeighbors,
  calculateNeighbors,
  applyFloodReveal,
  countRevealed,
} from './gameLogic'

describe('gameLogic', () => {
  describe('createEmptyGrid', () => {
    it('returns grid of correct dimensions', () => {
      const grid = createEmptyGrid(5, 7)
      expect(grid.length).toBe(5)
      expect(grid[0].length).toBe(7)
    })

    it('all cells are hidden, not mine, not flagged, 0 neighbors', () => {
      const grid = createEmptyGrid(3, 3)
      for (const row of grid) {
        for (const cell of row) {
          expect(cell.isMine).toBe(false)
          expect(cell.isRevealed).toBe(false)
          expect(cell.isFlagged).toBe(false)
          expect(cell.neighborMines).toBe(0)
        }
      }
    })
  })

  describe('placeMines', () => {
    it('places exactly the requested number of mines', () => {
      const grid = createEmptyGrid(10, 10)
      const result = placeMines(grid, 10, 10, 15)
      const count = result.flat().filter(c => c.isMine).length
      expect(count).toBe(15)
    })

    it('does not mutate original grid', () => {
      const grid = createEmptyGrid(5, 5)
      placeMines(grid, 5, 5, 3)
      expect(grid.flat().every(c => !c.isMine)).toBe(true)
    })
  })

  describe('countNeighbors', () => {
    it('returns 0 for cell with no adjacent mines', () => {
      const grid = createEmptyGrid(3, 3)
      expect(countNeighbors(grid, 3, 3, 1, 1)).toBe(0)
    })

    it('counts adjacent mines correctly', () => {
      const grid = createEmptyGrid(3, 3)
      grid[0][0].isMine = true
      grid[0][1].isMine = true
      expect(countNeighbors(grid, 3, 3, 1, 1)).toBe(2)
    })

    it('does not count the cell itself', () => {
      const grid = createEmptyGrid(3, 3)
      grid[1][1].isMine = true
      expect(countNeighbors(grid, 3, 3, 1, 1)).toBe(0)
    })
  })

  describe('calculateNeighbors', () => {
    it('sets neighborMines for non-mine cells', () => {
      const grid = createEmptyGrid(3, 3)
      grid[0][0].isMine = true
      const result = calculateNeighbors(grid, 3, 3)
      expect(result[0][0].neighborMines).toBe(0)
      expect(result[0][1].neighborMines).toBe(1)
      expect(result[1][0].neighborMines).toBe(1)
      expect(result[1][1].neighborMines).toBe(1)
    })
  })

  describe('applyFloodReveal', () => {
    it('reveals single cell when it has neighbors', () => {
      const grid = createEmptyGrid(3, 3)
      grid[1][1].neighborMines = 2
      const result = applyFloodReveal(grid, 3, 3, 1, 1)
      expect(result[1][1].isRevealed).toBe(true)
      expect(countRevealed(result)).toBe(1)
    })

    it('flood-fills connected zero-neighbor cells', () => {
      const grid = createEmptyGrid(3, 3)
      // all zeros
      const result = applyFloodReveal(grid, 3, 3, 1, 1)
      expect(countRevealed(result)).toBe(9)
    })

    it('does not reveal flagged cells', () => {
      const grid = createEmptyGrid(2, 2)
      grid[0][1].isFlagged = true
      const result = applyFloodReveal(grid, 2, 2, 0, 0)
      expect(result[0][0].isRevealed).toBe(true)
      expect(result[0][1].isRevealed).toBe(false)
    })

    it('does not mutate original grid', () => {
      const grid = createEmptyGrid(3, 3)
      applyFloodReveal(grid, 3, 3, 1, 1)
      expect(grid.flat().every(c => !c.isRevealed)).toBe(true)
    })
  })

  describe('countRevealed', () => {
    it('returns 0 for empty grid', () => {
      const grid = createEmptyGrid(2, 2)
      expect(countRevealed(grid)).toBe(0)
    })

    it('returns correct count', () => {
      const grid = createEmptyGrid(2, 2)
      grid[0][0].isRevealed = true
      grid[1][1].isRevealed = true
      expect(countRevealed(grid)).toBe(2)
    })
  })
})
