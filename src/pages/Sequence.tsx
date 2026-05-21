import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useSequenceGame,
  rulesByDifficulty,
  type Difficulty,
} from '../games/sequence'
import {
  ScoreBlock,
  DifficultySelector,
  RulesBlock,
  GameLayout,
} from '../components'
import { SequenceGrid } from '../components/grids'
import { useGameResult } from '../hooks/useGameResult'

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
  useGameResult({
    game: 'sequence',
    score,
    difficulty,
    shouldSave: result === 'win',
  })

  return (
    <GameLayout title="Повтор последовательности">
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
      <RulesBlock rules={rulesByDifficulty[difficulty]} />

      <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
    </GameLayout>
  )
}
