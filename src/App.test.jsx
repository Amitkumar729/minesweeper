import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders game title and main controls', () => {
    render(<App />)
    expect(screen.getByText(/NEON_SWEEPER/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /LEVEL_01/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /INITIALIZE_SWEEP/i })).toBeInTheDocument()
  })

  it('renders stats labels', () => {
    render(<App />)
    expect(screen.getByText(/MINES_DETECTED/)).toBeInTheDocument()
    expect(screen.getByText(/ELAPSED_TIME/)).toBeInTheDocument()
    expect(screen.getByText(/FLAGS_DEPLOYED/)).toBeInTheDocument()
  })

  it('renders grid with cells', () => {
    render(<App />)
    const grid = screen.getByRole('grid', { name: /minesweeper grid/i })
    expect(grid).toBeInTheDocument()
    const cells = screen.getAllByRole('button', { name: /cell \d+ \d+/i })
    expect(cells.length).toBeGreaterThanOrEqual(81)
  })
})
