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
import { useGameResult } from '../hooks/useGameResult'

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
    startRound,
    submitAnswer,
  } = useAttentionGame()

  const size = SIZE_MAP[difficulty]
  const gridCols = Math.ceil(Math.sqrt(size))

  const savedRef = useRef(false)

  useGameResult({
    game: 'attention',
    score,
    difficulty,
    shouldSave: phase === 'result',
  })

  useEffect(() => {
    savedRef.current = false
  }, [difficulty])

  const isIdle = items.length === 0 && !question

  return (
    <GameLayout title="Визуальное внимание">
      {/* ОЧКИ */}
      <ScoreBlock
        score={score}
        popup={popup}
      />

      {/* СЛОЖНОСТЬ */}
      <DifficultySelector
        current={difficulty}
        onChange={value => changeDifficulty(value as Difficulty)}
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
