export function TerminalFooter({ message }) {
  return (
    <footer className="terminal-footer">
      <div className="terminal-prompt">
        &gt; <span className="typing-text">{message}</span>
        <span className="cursor">_</span>
      </div>
    </footer>
  )
}
