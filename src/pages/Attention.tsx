import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import {
  useAttentionGame,
  SIZE_MAP,
  baseRules,
  rulesByDifficulty,
  SHAPE_EMOJI,
  COLOR_EMOJI,
  type Difficulty,
} from '../games/attention'
import {
  ScoreBlock,
  DifficultySelector,
  RulesBlock,
  GameLayout,
  QuestionBlock,
} from '../components'
import { AttentionGrid } from '../components/grids'
import { progressStore } from '../stats/progressStore'
import '../styles/Attention.css'
import '../styles/ui.css'

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

  // Ref для хранения текущей игровой сессии
  const sessionRef = useRef({
    roundCount: 0,
    bestScore: 0,
    score: 0,
    difficulty: 'easy' as Difficulty,
  })

  // Обновление ref
  useEffect(() => {
    sessionRef.current = {
      roundCount,
      bestScore,
      score,
      difficulty,
    }
  }, [roundCount, bestScore, score, difficulty])

  // Сохранение результатов при смене сложности
  const handleDifficultyChange = (value: Difficulty) => {
    if (sessionRef.current.roundCount > 0) {
      progressStore.addSessionResult(
        'attention',
        sessionRef.current.roundCount,
        sessionRef.current.bestScore,
        sessionRef.current.score,
        sessionRef.current.difficulty,
      )
    }
    changeDifficulty(value)
  }

  // Сохранение результатов при уходе со страницы
  useEffect(() => {
    return () => {
      if (sessionRef.current.roundCount > 0) {
        progressStore.addSessionResult(
          'attention',
          sessionRef.current.roundCount,
          sessionRef.current.bestScore,
          sessionRef.current.score,
          sessionRef.current.difficulty,
        )
      }
    }
  }, [])

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
