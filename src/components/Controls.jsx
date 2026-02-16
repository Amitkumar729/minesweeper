export function Controls({ difficulty, setDifficulty, onReset }) {
  return (
    <section className="controls-panel">
      <div className="difficulty-selectors">
        {['easy', 'medium', 'hard'].map(level => (
          <button
            key={level}
            type="button"
            className={`btn btn-diff ${difficulty === level ? 'active' : ''}`}
            onClick={() => setDifficulty(level)}
          >
            {level === 'easy' ? 'LEVEL_01' : level === 'medium' ? 'LEVEL_02' : 'LEVEL_03'}
          </button>
        ))}
      </div>
      <button type="button" className="btn btn-main" onClick={onReset}>
        INITIALIZE_SWEEP
      </button>
    </section>
  )
}
