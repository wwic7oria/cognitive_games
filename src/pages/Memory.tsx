import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { rulesByDifficulty } from './memory/rules'
import { useMemoryGame } from './memory/useMemoryGame'

export default function Memory() {
  const { difficulty, cards, score, scorePopup, size, initGame, handleClick } =
    useMemoryGame()

  const navigate = useNavigate()

  useEffect(() => {
    initGame('easy')
  }, [])

  const isWin = cards.length > 0 && cards.every(c => c.isMatched)

  return (
    <div className="page">
      <h2 className="page-title">Поиск карточек</h2>

      {/* SCORE */}
      <div className="score-wrapper">
        <div className="score-container">
          <h3 className="score-title">Очки: {score}</h3>

          {scorePopup && (
            <span
              className={
                scorePopup.startsWith('+')
                  ? 'score-popup positive'
                  : 'score-popup negative'
              }
            >
              {scorePopup}
            </span>
          )}
        </div>
      </div>

      {/* DIFFICULTY */}
      <div className="buttons-row">
        <button onClick={() => initGame('easy')}>Лёгкий (4x4)</button>

        <button onClick={() => initGame('medium')}>Средний (6x6)</button>
      </div>

      {/* GRID */}
      <div
        className="game-grid"
        style={{
          gridTemplateColumns: `repeat(${size}, 80px)`,
        }}
      >
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => handleClick(card)}
            className={`memory-card ${
              card.isFlipped || card.isMatched ? 'flipped' : ''
            } ${card.isMatched ? 'matched' : ''}`}
          >
            {card.isFlipped || card.isMatched ? card.value : '?'}
          </div>
        ))}
      </div>

      {/* ПРОВЕРКА ПОБЕДЫ */}
      {isWin && <h3 className="win-text">Победа 🏆</h3>}

      {/* ДЕЙСТВИЯ */}
      <div className="buttons-row section">
        <button onClick={() => initGame(difficulty)}>🔄 Начать заново</button>

        <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
      </div>

      {/* ПРАВИЛА */}
      <div className="rules">
        <h3>Правила</h3>

        {rulesByDifficulty[difficulty].map((rule, i) => (
          <p key={i}>
            <b className={rule.color}>{rule.value}</b> {rule.text}
          </p>
        ))}
      </div>
    </div>
  )
}
