import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { progressStore } from './stats/progressStore'
import { useSequenceGame } from './games/sequence/useSequenceGame'
import { rulesByDifficulty } from './games/sequence/rules'
import { ScoreBlock } from './components/ScoreBlock'
import type { Difficulty } from './games/attention/constants'
import { DifficultySelector } from './components/DifficultySelector'

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
      <ScoreBlock
        score={score}
        popup={scorePopup}
      />

      <DifficultySelector
        current={difficulty}
        onChange={value => setDifficulty(value as Difficulty)}
        options={[
          { value: 'easy', label: 'Лёгкий (2x2)' },
          { value: 'medium', label: 'Средний (3x3)' },
          { value: 'hard', label: 'Сложный (4x4)' },
        ]}
      />

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
