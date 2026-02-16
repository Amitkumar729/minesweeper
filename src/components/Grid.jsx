import { Cell } from './Cell'

export function Grid({ grid, cols, triggerCell, onCellClick, onCellRightClick }) {
  return (
    <div
      className="grid-container"
      style={{ gridTemplateColumns: `repeat(${cols}, 30px)` }}
      onContextMenu={e => e.preventDefault()}
      role="grid"
      aria-label="Minesweeper grid"
    >
      {grid.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            row={r}
            col={c}
            isTrigger={triggerCell && triggerCell[0] === r && triggerCell[1] === c}
            onClick={onCellClick}
            onContextMenu={onCellRightClick}
            animationDelay={`${(r * cols + c) * 0.005}s`}
          />
        ))
      )}
    </div>
  )
}
