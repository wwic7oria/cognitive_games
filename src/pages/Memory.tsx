import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

import { rulesByDifficulty } from './memory/rules'
import { useMemoryGame } from './memory/useMemoryGame'
import { progressStore } from './stats/progressStore'

export default function Memory() {
  const { difficulty, cards, score, scorePopup, size, initGame, handleClick } =
    useMemoryGame()

  const navigate = useNavigate()

  // Защита от повторного сохранения результата
  const savedRef = useRef(false)

  // Старт игры и сброс флага сохранения
  useEffect(() => {
    initGame('easy')
    savedRef.current = false
  }, [])

  // Если меняется сложность флаг тоже сбрасывается, чтобы можно было сохранять результат при смене сложности
  useEffect(() => {
    savedRef.current = false
  }, [difficulty])

  const isWin = cards.length > 0 && cards.every(c => c.isMatched)

  // СОХРАНЕНИЕ РЕЗУЛЬТАТА
  useEffect(() => {
    if (!isWin) return
    if (savedRef.current) return

    savedRef.current = true

    progressStore.addScore('memory', score, difficulty)
  }, [isWin, score, difficulty])

  return (
    <div className="page">
      <h2 className="page-title">Поиск карточек</h2>

      {/* ОЧКИ */}
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

      {/* СЛОЖНОСТЬ */}
      <div className="buttons-row">
        <button
          className={difficulty === 'easy' ? 'selected' : ''}
          onClick={() => initGame('easy')}
        >
          Лёгкий (4x4)
        </button>
        <button
          className={difficulty === 'medium' ? 'selected' : ''}
          onClick={() => initGame('medium')}
        >
          Средний (6x6)
        </button>
      </div>

      {/* ПОЛЕ */}
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
            className={`card ${
              card.isFlipped || card.isMatched ? 'flipped' : ''
            } ${card.isMatched ? 'matched' : ''}`}
          >
            {card.isFlipped || card.isMatched ? card.value : '?'}
          </div>
        ))}
      </div>

      {/* ПРОВЕРКА НА ПОБЕДУ */}
      {isWin && <h3 className="win-text">Победа 🏆</h3>}

      {/* ДЕЙСТВИЯ */}
      <div className="buttons-row section">
        <button onClick={() => initGame(difficulty)}>🔄 Начать заново</button>
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
      <div className="buttons-row section">
        <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
      </div>
    </div>
  )
}
