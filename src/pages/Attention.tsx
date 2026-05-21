/* 
На экране показывается набор элементов на несколько секунд. Далее вопрос - был ли элемент в этом наборе? 
Сложность зависит от скорости показа набора элементов и количества элементов. Уровни сложности:
Легкий - 5 элементов, 2 секунды. Вопросы простые - сколько было синих кругов?
Средний - 8 элементов, 2 секунды. Вопросы посложнее - была ли звездочка?
Сложный - 8 элементов, 3 секунды. Вопросы сложные - сколько звездочек?
*/
import { useNavigate } from 'react-router-dom'
import { useAttentionGame } from './attention/useAttentionGame'
import { SHAPE_EMOJI, COLOR_EMOJI, SIZE_MAP } from './attention/constants'

import { rulesByDifficulty } from './attention/rules'

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

  return (
    <div className="page">
      <h1 className="page-title">Визуальное внимание</h1>

      {/* ОЧКИ */}
      <div className="score-wrapper">
        <div className="score-container">
          <h2 className="score-title">Счет: {score}</h2>
          {popup && (
            <div
              className={`score-popup ${popup.startsWith('+') ? 'positive' : 'negative'}`}
            >
              {popup}
            </div>
          )}
        </div>
      </div>

      {/* СЛОЖНОСТЬ */}
      <div className="section">
        <h3>Сложность</h3>
        <div className="buttons-row">
          <button onClick={() => setDifficulty('easy')}>
            Легкий (5 элементов)
          </button>
          <button onClick={() => setDifficulty('medium')}>
            Средний (7 элементов)
          </button>
          <button onClick={() => setDifficulty('hard')}>
            Сложный (9 элементов)
          </button>
        </div>
      </div>

      {/* КНОПКА НАЧАЛА РАУНДА */}
      {phase === 'show' && items.length === 0 && (
        <button
          onClick={startRound}
          style={{ marginTop: '20px', fontSize: '20px' }}
        >
          Начать раунд
        </button>
      )}

      {/* ПОЛЕ */}
      {phase === 'show' && items.length > 0 && (
        <div className="section">
          <div
            className="game-grid"
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

      {phase === 'result' && (
        <button
          onClick={startRound}
          style={{ marginTop: '20px', fontSize: '20px' }}
        >
          Следующий раунд
        </button>
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
