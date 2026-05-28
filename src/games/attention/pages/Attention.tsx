import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import {
  SIZE_MAP,
  baseRules,
  rulesByDifficulty,
  SHAPE_EMOJI,
  COLOR_EMOJI,
  type Difficulty,
} from '../engine'

import {
  ScoreBlock,
  DifficultySelector,
  RulesBlock,
  GameLayout,
} from '@/shared/components'

import { useAttentionGame } from '../hooks'
import { AttentionGrid, QuestionBlock } from '../components'
import { useGameResult } from '@/shared/hooks'
import '../styles/Attention.css'
import '@/shared/styles/ui.css'

export default function Attention() {
  const {
    difficulty,
    changeDifficulty,
    items,
    gameState,
    result,
    question,
    options,
    score,
    popup,
    roundCount,
    bestScore,
    startRound,
    submitAnswer,
  } = useAttentionGame()

  const navigate = useNavigate()

  const size = SIZE_MAP[difficulty]
  const gridCols = Math.ceil(Math.sqrt(size))

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
    game: 'attention',
    shouldSave: result === 'win' || result === 'lose',
    difficulty,
    roundCount,
    bestScore,
    score,
  })

  return (
    <GameLayout title="Запомни элементы">
      {/* СЧЁТ */}
      <ScoreBlock
        score={score}
        popup={popup}
      />

      {/* СЛОЖНОСТЬ */}
      <DifficultySelector
        current={difficulty}
        onChange={value => handleDifficultyChange(value as Difficulty)}
        options={[
          { value: 'easy', label: 'Легкий (6 элементов)' },
          { value: 'medium', label: 'Средний (8 элементов)' },
          { value: 'hard', label: 'Сложный (8 элементов)' },
        ]}
      />

      {/* ПОЛЕ */}

      <div className="attention-area">
        {gameState === 'showing' && (
          <AttentionGrid
            items={items}
            gridCols={gridCols}
            difficulty={difficulty}
            SHAPE_EMOJI={SHAPE_EMOJI}
            COLOR_EMOJI={COLOR_EMOJI}
          />
        )}
      </div>

      {/* КНОПКА */}
      <div className="attention-status">
        {gameState === 'showing' && (
          <h3 className="status-text">Запоминай...</h3>
        )}

        {/* РЕЗУЛЬТАТ */}
        {result === 'win' && (
          <h3 className="status-text win-text">Правильно 🎉</h3>
        )}
        {result === 'lose' && (
          <h3 className="status-text error-text">Ошибка ❌</h3>
        )}

        {/* НАЧАЛО РАУНДА */}
        {gameState === 'idle' && (
          <button
            className="restart-button"
            onClick={startRound}
          >
            Начать раунд ▶
          </button>
        )}

        {/* ВОПРОС */}
        {gameState === 'question' && (
          <QuestionBlock
            question={question}
            options={options}
            onAnswer={submitAnswer}
          />
        )}
      </div>

      {/* ПРАВИЛА */}
      <RulesBlock rules={[...baseRules, ...rulesByDifficulty[difficulty]]} />

      <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
    </GameLayout>
  )
}
