import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import {
  useAttentionGame,
  SIZE_MAP,
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

export default function Attention() {
  const navigate = useNavigate()
  const {
    difficulty,
    changeDifficulty,
    items,
    phase,
    question,
    options,
    score,
    popup,
    roundCount,
    bestScore,
    startRound,
    submitAnswer,
  } = useAttentionGame()

  const size = SIZE_MAP[difficulty]
  const gridCols = Math.ceil(Math.sqrt(size))

  // Ref for current session state
  const sessionRef = useRef({
    roundCount: 0,
    bestScore: 0,
    score: 0,
    difficulty: 'easy',
  })

  // Update ref whenever these values change
  useEffect(() => {
    sessionRef.current = { roundCount, bestScore, score, difficulty }
  }, [roundCount, bestScore, score, difficulty])

  // Save session on difficulty change
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

  // Save session on unmount
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

  const isIdle = items.length === 0 && !question

  return (
    <GameLayout title="Запомни элементы">
      {/* ОЧКИ */}
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

      {/* КНОПКА НАЧАЛА РАУНДА */}
      {isIdle && (
        <button
          onClick={startRound}
          style={{ marginTop: '20px', fontSize: '20px' }}
        >
          Начать раунд ▶
        </button>
      )}

      {/* ПОЛЕ */}
      {phase === 'show' && items.length > 0 && (
        <AttentionGrid
          items={items}
          gridCols={gridCols}
          difficulty={difficulty}
          SHAPE_EMOJI={SHAPE_EMOJI}
          COLOR_EMOJI={COLOR_EMOJI}
        />
      )}

      {/* ВОПРОСЫ */}
      {phase === 'question' && (
        <QuestionBlock
          question={question}
          options={options}
          onAnswer={submitAnswer}
        />
      )}

      {/* ПРАВИЛА */}
      <RulesBlock
        intro="На экране показываются элементы. Запомните их и ответьте на вопрос выше."
        rules={rulesByDifficulty[difficulty]}
      />

      <div className="buttons-row">
        <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
      </div>
    </GameLayout>
  )
}
