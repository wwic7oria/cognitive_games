type ScoreBlockProps = {
  score: number
  popup: string | null
}

export function ScoreBlock({ score, popup }: ScoreBlockProps) {
  return (
    <div className="score-wrapper">
      <div className="score-container">
        <h3 className="score-title">Счёт: {score}</h3>

        {popup && (
          <span
            className={
              popup.startsWith('+')
                ? 'score-popup positive'
                : 'score-popup negative'
            }
          >
            {' '}
            {popup}
          </span>
        )}
      </div>
    </div>
  )
}
