import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { progressStore } from './stats/progressStore'
import { useSequenceGame } from './sequence/useSequenceGame'
import { rulesByDifficulty } from './sequence/rules'

export default function Sequence() {
  const {
    setDifficulty,
    difficulty,
    score,
    scorePopup,
    size,
    maxLength,
    currentLength,
    cells,
    activeCell,
    lastClicked,
    wrongClick,
    gameState,
    result,
    startGame,
    handleClick,
  } = useSequenceGame()

  const navigate = useNavigate()

  // Защита от повторного сохранения
  const savedRef = useRef(false)

  // Стартовая инициализация
  useEffect(() => {
    setDifficulty('easy')
    savedRef.current = false
  }, [])

  // Сброс флага при смене сложности
  useEffect(() => {
    savedRef.current = false
  }, [difficulty])

  // СОХРАНЕНИЕ РЕЗУЛЬТАТА
  useEffect(() => {
    if (result !== 'win') return
    if (savedRef.current) return

    savedRef.current = true

    progressStore.addScore('sequence', score, difficulty)
  }, [result, score, difficulty])

  return (
    <div className="page">
      <h2 className="page-title">Повтор последовательности</h2>

      {/* ОЧКИ */}
      <div className="score-wrapper">
        <div className="score-container">
          <h3 className="score-title">Очки: {score}</h3>

          {scorePopup && (
            <span
              className={`score-popup ${
                scorePopup.startsWith('+') ? 'positive' : 'negative'
              }`}
            >
              {scorePopup}
            </span>
          )}
        </div>
      </div>

      {/* СЛОЖНОСТЬ */}
      <div className="buttons-row">
        <button onClick={() => setDifficulty('easy')}>Лёгкий (2x2)</button>
        <button onClick={() => setDifficulty('medium')}>Средний (3x3)</button>
        <button onClick={() => setDifficulty('hard')}>Сложный (4x4)</button>
      </div>

      {/* ИНФОРМАЦИЯ О ДЛИНЕ ПОСЛЕДОВАТЕЛЬНОСТИ */}
      <div
        className="section"
        style={{ fontWeight: 600 }}
      >
        Длина последовательности: {currentLength} из {maxLength}
      </div>

      {/* ПОЛЕ */}
      <div
        className="game-grid"
        style={{
          gridTemplateColumns: `repeat(${size}, 80px)`,
        }}
      >
        {cells.map(id => {
          const isActive = activeCell === id
          const isWrong = wrongClick === id
          const isRight = lastClicked === id

          return (
            <div
              key={id}
              onClick={() => handleClick(id)}
              className={`
          card
          ${isActive ? 'activeCell' : ''}
          ${isWrong ? 'wrongClick' : ''}
          ${isRight ? 'rightClick' : ''}
        `}
              style={{
                cursor: gameState === 'input' ? 'pointer' : 'not-allowed',
              }}
            >
              {id}
            </div>
          )
        })}
      </div>

      {/* СТАТУС */}
      <div className="section">
        {gameState === 'showing' && <h3>Запоминай...</h3>}
        {gameState === 'input' && <h3>Повтори</h3>}
      </div>

      {/* РЕЗУЛЬТАТ */}
      {result === 'win' && <h3 className="win-text">Победа 🎉</h3>}
      {result === 'lose' && <h3 className="error-text">Ошибка ❌</h3>}

      {/* УПРАВЛЕНИЕ */}
      {gameState === 'idle' && <button onClick={startGame}>Начать ▶</button>}

      {/* ПРАВИЛА */}
      <div className="rules">
        <h3>Правила</h3>

        {rulesByDifficulty[difficulty].map((rule, i) => (
          <p key={i}>
            <b className={rule.color}>{rule.value}</b> {rule.text}
          </p>
        ))}
      </div>

      <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
    </div>
  )
}
