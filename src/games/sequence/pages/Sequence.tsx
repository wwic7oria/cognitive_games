import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { rulesByDifficulty, baseRules, type Difficulty } from '../engine'
import {
  ScoreBlock,
  DifficultySelector,
  RulesBlock,
  GameLayout,
} from '@/shared/components'

import { useSequenceGame } from '../hooks'
import { SequenceGrid } from '../components'
import { progressStore } from '@/shared/stats/progressStore'
import '../styles/Sequence.css'
import '@/shared/styles/ui.css'

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
    roundCount,
    bestScore,
    startGame,
    handleClick,
  } = useSequenceGame()

  const navigate = useNavigate()

  // Ref для хранения текущей игровой сессии
  const sessionRef = useRef({
    roundCount: 0,
    bestScore: 0,
    score: 0,
    difficulty: 'easy',
  })

  // Обновление ref
  useEffect(() => {
    sessionRef.current = { roundCount, bestScore, score, difficulty }
  }, [roundCount, bestScore, score, difficulty])

  // Инициализация сложности при загрузке страницы
  useEffect(() => {
    setDifficulty('easy')
  }, [])

  // Сохранение результатов при смене сложности
  const handleDifficultyChange = (value: Difficulty) => {
    if (sessionRef.current.roundCount > 0) {
      progressStore.addSessionResult(
        'sequence',
        sessionRef.current.roundCount,
        sessionRef.current.bestScore,
        sessionRef.current.score,
        sessionRef.current.difficulty,
      )
    }
    setDifficulty(value)
  }

  // Сохранение результатов при уходе со страницы
  useEffect(() => {
    return () => {
      if (sessionRef.current.roundCount > 0) {
        progressStore.addSessionResult(
          'sequence',
          sessionRef.current.roundCount,
          sessionRef.current.bestScore,
          sessionRef.current.score,
          sessionRef.current.difficulty,
        )
      }
    }
  }, [])

  return (
    <GameLayout title="Повтор последовательности">
      {/* СЧЁТ */}
      <ScoreBlock
        score={score}
        popup={scorePopup}
      />

      <DifficultySelector
        current={difficulty}
        onChange={value => handleDifficultyChange(value as Difficulty)}
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
      <SequenceGrid
        cells={cells}
        size={size}
        activeCell={activeCell}
        wrongClick={wrongClick}
        lastClicked={lastClicked}
        gameState={gameState}
        onClick={handleClick}
      />

      {/* СТАТУС */}
      <div className="sequence-status">
        <div className="status-text">
          {gameState === 'showing' && <h3>Запоминай...</h3>}
          {gameState === 'input' && <h3>Повтори</h3>}
        </div>

        {/* РЕЗУЛЬТАТ */}
        {result === 'win' && (
          <h3 className="status-text win-text">Правильно 🎉</h3>
        )}
        {result === 'lose' && (
          <h3 className="status-text error-text">Ошибка ❌</h3>
        )}

        {/* УПРАВЛЕНИЕ */}
        <div className="restart-button">
          {gameState === 'idle' && (
            <button onClick={startGame}>Начать раунд ▶</button>
          )}
        </div>
      </div>

      {/* ПРАВИЛА */}
      <RulesBlock rules={[...baseRules, ...rulesByDifficulty[difficulty]]} />

      <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
    </GameLayout>
  )
}
