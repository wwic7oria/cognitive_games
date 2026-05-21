import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import {
  useMemoryGame,
  rulesByDifficulty,
  type Difficulty,
} from '../games/memory'
import {
  ScoreBlock,
  DifficultySelector,
  RulesBlock,
  GameLayout,
} from '../components'
import { MemoryGrid } from '../components/grids'
import { useGameResult } from '../hooks/useGameResult'

export default function Memory() {
  const { difficulty, cards, score, scorePopup, size, initGame, handleClick } =
    useMemoryGame()

  const navigate = useNavigate()

  // Защита от повторного сохранения результата
  const savedRef = useRef(false)

  // Старт игры и сброс флага сохранения
  useEffect(() => {
    initGame('easy')
    savedRef.current = false
  }, [])

  // Если меняется сложность флаг тоже сбрасывается, чтобы можно было сохранять результат при смене сложности
  useEffect(() => {
    savedRef.current = false
  }, [difficulty])

  const isWin = cards.length > 0 && cards.every(c => c.isMatched)

  // СОХРАНЕНИЕ РЕЗУЛЬТАТА
  useGameResult({
    game: 'memory',
    score,
    difficulty,
    shouldSave: isWin,
  })

  return (
    <GameLayout title="Поиск карточек">
      {/* ОЧКИ */}
      <ScoreBlock
        score={score}
        popup={scorePopup}
      />

      {/* СЛОЖНОСТЬ */}
      <DifficultySelector
        current={difficulty}
        onChange={value => initGame(value as Difficulty)}
        options={[
          { value: 'easy', label: 'Лёгкий (4x4)' },
          { value: 'medium', label: 'Средний (6x6)' },
        ]}
      />

      {/* ПОЛЕ */}
      <MemoryGrid
        cards={cards}
        onCardClick={handleClick}
        size={size}
        isWin={cards.length > 0 && cards.every(c => c.isMatched)}
      />

      {/* ПРОВЕРКА НА ПОБЕДУ */}
      {isWin && <h3 className="win-text">Победа 🏆</h3>}

      {/* ДЕЙСТВИЯ */}
      <div className="buttons-row section">
        <button onClick={() => initGame(difficulty)}>🔄 Начать заново</button>
      </div>

      {/* ПРАВИЛА */}
      <RulesBlock rules={rulesByDifficulty[difficulty]} />

      <div className="buttons-row section">
        <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
      </div>
    </GameLayout>
  )
}
