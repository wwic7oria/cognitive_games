import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
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
import '../styles/Memory.css'
import '../styles/ui.css'

export default function Memory() {
  const { difficulty, cards, score, scorePopup, size, initGame, handleClick } =
    useMemoryGame()

  const navigate = useNavigate()

  // Старт игры
  useEffect(() => {
    initGame('easy')
  }, [])

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
      {/* СЧЁТ */}
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

      <div>
        {/* ПОЛЕ */}
        <MemoryGrid
          cards={cards}
          onCardClick={handleClick}
          size={size}
          isWin={cards.length > 0 && cards.every(c => c.isMatched)}
        />
      </div>

      {/* ДЕЙСТВИЯ */}
      <div className="status-text memory-status">
        {isWin && <h3 className="status-text win-text">Победа 🏆</h3>}

        <div className="restart-button">
          <button onClick={() => initGame(difficulty)}>🔄 Начать заново</button>
        </div>
      </div>

      {/* ПРАВИЛА */}
      <RulesBlock rules={rulesByDifficulty[difficulty]} />

      <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
    </GameLayout>
  )
}
