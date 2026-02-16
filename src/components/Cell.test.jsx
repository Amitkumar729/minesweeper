import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Cell } from './Cell'

describe('Cell', () => {
  const defaultCell = {
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    neighborMines: 0,
  }

  it('renders hidden cell', () => {
    render(
      <Cell
        cell={defaultCell}
        row={0}
        col={0}
        isTrigger={false}
        onClick={vi.fn()}
        onContextMenu={vi.fn()}
      />
    )
    const cell = screen.getByRole('button', { name: /cell 0 0/i })
    expect(cell).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(
      <Cell
        cell={defaultCell}
        row={1}
        col={2}
        isTrigger={false}
        onClick={onClick}
        onContextMenu={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledWith(1, 2)
  })

  it('calls onContextMenu on right-click', () => {
    const onContextMenu = vi.fn()
    render(
      <Cell
        cell={defaultCell}
        row={0}
        col={0}
        isTrigger={false}
        onClick={vi.fn()}
        onContextMenu={onContextMenu}
      />
    )
    fireEvent.contextMenu(screen.getByRole('button'))
    expect(onContextMenu).toHaveBeenCalledWith(0, 0)
  })

  it('shows number when revealed and neighborMines > 0', () => {
    render(
      <Cell
        cell={{ ...defaultCell, isRevealed: true, neighborMines: 3 }}
        row={0}
        col={0}
        isTrigger={false}
        onClick={vi.fn()}
        onContextMenu={vi.fn()}
      />
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('has accessible label for flagged cell', () => {
    render(
      <Cell
        cell={{ ...defaultCell, isFlagged: true }}
        row={0}
        col={0}
        isTrigger={false}
        onClick={vi.fn()}
        onContextMenu={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: /flagged/i })).toBeInTheDocument()
  })
})
