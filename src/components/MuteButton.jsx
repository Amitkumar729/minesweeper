export function MuteButton({ muted, onToggle }) {
  return (
    <button
      type="button"
      className="btn btn-icon"
      onClick={onToggle}
      title={muted ? 'Unmute' : 'Mute'}
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
