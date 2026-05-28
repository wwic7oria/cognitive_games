import { useEffect } from 'react'
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
import { useGameResult } from '@/shared/hooks'
import '../styles/Sequence.css'
import '@/shared/styles/ui.css'

export default function Sequence() {
  const {
    changeDifficulty,
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

  // Инициализация сложности при загрузке страницы
  useEffect(() => {
    changeDifficulty('easy')
  }, [])

  // Смена сложности
  const handleDifficultyChange = (value: Difficulty) => {
    changeDifficulty(value)
  }

  // Сохранение результатов
  useGameResult({
    game: 'sequence',
    shouldSave: result === 'win' || result === 'lose',
    difficulty,
    roundCount,
    bestScore,
    score,
  })

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
