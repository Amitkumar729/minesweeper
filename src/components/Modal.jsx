export function Modal({ title, message, onRestart, show }) {
  if (!show) return null
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        <h2 id="modal-title">{title}</h2>
        <p id="modal-message">{message}</p>
        <button type="button" className="btn btn-main" onClick={onRestart}>
          REBOOT_SYSTEM
        </button>
      </div>
    </div>
  )
}
