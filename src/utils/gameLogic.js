/**
 * Pure minesweeper grid logic (testable, no React).
 * @module utils/gameLogic
 */

/**
 * @typedef {Object} Cell
 * @property {boolean} isMine
 * @property {boolean} isRevealed
 * @property {boolean} isFlagged
 * @property {number} neighborMines
 */

/**
 * Create an empty grid of cells.
 * @param {number} rows
 * @param {number} cols
 * @returns {Cell[][]}
 */
export function createEmptyGrid(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    }))
  )
}

/**
 * Place exactly `mines` mines at random positions (no duplicate cells).
 * @param {Cell[][]} grid
 * @param {number} rows
 * @param {number} cols
 * @param {number} mines
 * @returns {Cell[][]} New grid (shallow copy of rows/cells with isMine set)
 */
export function placeMines(grid, rows, cols, mines) {
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

/**
 * Count adjacent mines for a cell (does not include the cell itself).
 * @param {Cell[][]} grid
 * @param {number} rows
 * @param {number} cols
 * @param {number} r
 * @param {number} c
 * @returns {number}
 */
export function countNeighbors(grid, rows, cols, r, c) {
  let count = 0
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const rr = r + i
      const cc = c + j
      if (rr === r && cc === c) continue
      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols && grid[rr][cc].isMine) count++
    }
  }
  return count
}

/**
 * Set neighborMines for every cell (non-mine cells only).
 * @param {Cell[][]} grid
 * @param {number} rows
 * @param {number} cols
 * @returns {Cell[][]}
 */
export function calculateNeighbors(grid, rows, cols) {
  return grid.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      neighborMines: cell.isMine ? 0 : countNeighbors(grid, rows, cols, r, c),
    }))
  )
}

/**
 * Apply flood-fill reveal from (r, c): reveal that cell and all connected
 * cells with 0 neighbor mines. Returns a new grid.
 * @param {Cell[][]} grid
 * @param {number} rows
 * @param {number} cols
 * @param {number} r
 * @param {number} c
 * @returns {Cell[][]}
 */
export function applyFloodReveal(grid, rows, cols, r, c) {
  const stack = [[r, c]]
  const next = grid.map(row => row.map(cell => ({ ...cell })))
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
}

/**
 * Count revealed cells in grid.
 * @param {Cell[][]} grid
 * @returns {number}
 */
export function countRevealed(grid) {
  return grid.flat().filter(c => c.isRevealed).length
}
