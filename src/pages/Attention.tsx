import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAttentionGame } from './attention/useAttentionGame'
import { SHAPE_EMOJI, COLOR_EMOJI, SIZE_MAP } from './attention/constants'
import { rulesByDifficulty } from './attention/rules'
import { progressStore } from './stats/progressStore'
import { ScoreBlock } from './ScoreBlock'

export default function Attention() {
  const navigate = useNavigate()
  const {
    difficulty,
    setDifficulty,
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

  useEffect(() => {
    if (phase !== 'result') return
    if (savedRef.current) return

    savedRef.current = true

    progressStore.addScore('attention', score, difficulty)
  }, [phase, score, difficulty])

  useEffect(() => {
    savedRef.current = false
  }, [difficulty])

  return (
    <div className="page">
      <h1 className="page-title">Визуальное внимание</h1>

      {/* ОЧКИ */}
      <ScoreBlock
        score={score}
        popup={popup}
      />

      {/* СЛОЖНОСТЬ */}
      <div className="section">
        <h3>Сложность</h3>
        <div className="buttons-row">
          <button
            className={difficulty === 'easy' ? 'selected' : ''}
            onClick={() => {
              setDifficulty('easy')
            }}
          >
            Легкий (6 элементов)
          </button>
          <button
            className={difficulty === 'medium' ? 'selected' : ''}
            onClick={() => {
              setDifficulty('medium')
            }}
          >
            Средний (8 элементов)
          </button>
          <button
            className={difficulty === 'hard' ? 'selected' : ''}
            onClick={() => {
              setDifficulty('hard')
            }}
          >
            Сложный (8 элементов)
          </button>
        </div>
      </div>

      {/* КНОПКА НАЧАЛА РАУНДА */}
      {phase === 'show' && items.length === 0 && (
        <button
          onClick={startRound}
          style={{ marginTop: '20px', fontSize: '20px' }}
        >
          Начать раунд ▶
        </button>
      )}

      {/* ПОЛЕ */}
      {phase === 'show' && items.length > 0 && (
        <div className="section">
          <div
            className="emoji-grid"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, 80px)`,
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="attention-card"
              >
                <div className="emoji-row">
                  {difficulty === 'easy' ? (
                    <span>{COLOR_EMOJI[item.color]}</span>
                  ) : (
                    <span>{SHAPE_EMOJI[item.shape]}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'question' && (
        <div className="section">
          <h2
            style={{
              marginTop: '30px',
              marginBottom: '30px',
              textAlign: 'center',
            }}
          >
            {question}
          </h2>
          <div className="buttons-row">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => submitAnswer(option.value)}
                style={{ minWidth: '80px' }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ПРАВИЛА */}
      <div className="rules">
        <h3>Правила</h3>
        <p style={{ fontSize: '18px' }}>
          На экране показываются элементы. Запомните их и ответьте на вопрос
          выше.
        </p>

        {rulesByDifficulty[difficulty].map((rule, i) => (
          <p key={i}>
            <b className={rule.color}>{rule.value}</b> {rule.text}
          </p>
        ))}
      </div>

      <div className="buttons-row">
        <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
      </div>
    </div>
  )
}
