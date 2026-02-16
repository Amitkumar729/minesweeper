export function StatsBar({ mines, timer, flags }) {
  return (
    <section className="stats-bar">
      <div className="stat-box">
        <label>MINES_DETECTED</label>
        <div className="stat-value">{String(mines).padStart(3, '0')}</div>
      </div>
      <div className="stat-box">
        <label>ELAPSED_TIME</label>
        <div className="stat-value">{String(timer).padStart(3, '0')}</div>
      </div>
      <div className="stat-box">
        <label>FLAGS_DEPLOYED</label>
        <div className="stat-value">{String(flags).padStart(3, '0')}</div>
      </div>
    </section>
  )
}
