export function Cell({
  cell,
  row,
  col,
  isTrigger,
  onClick,
  onContextMenu,
  animationDelay,
}) {
  const { isMine, isRevealed, isFlagged, neighborMines } = cell

  const handleContextMenu = e => {
    e.preventDefault()
    onContextMenu(row, col)
  }

  let content = null
  if (isRevealed && !isMine && neighborMines > 0) {
    content = neighborMines
  }
  /* Flag (▲) and mine (✖) are drawn via CSS ::after */

  const classes = [
    'cell',
    isRevealed && 'revealed',
    isFlagged && 'flagged',
    isMine && isRevealed && 'mine',
    isTrigger && 'trigger',
    neighborMines > 0 && isRevealed && `n-${neighborMines}`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      role="button"
      tabIndex={0}
      className={classes}
      style={{ animationDelay }}
      onClick={() => onClick(row, col)}
      onContextMenu={handleContextMenu}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(row, col)
        }
      }}
      aria-label={`Cell ${row} ${col}${isFlagged ? ' flagged' : ''}${isRevealed ? ' revealed' : ''}`}
    >
      {content}
    </div>
  )
}
