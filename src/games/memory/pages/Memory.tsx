import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { rulesByDifficulty, baseRules, type Difficulty } from '../engine'

import {
  ScoreBlock,
  DifficultySelector,
  RulesBlock,
  GameLayout,
} from '@/shared/components'

import { useMemoryGame } from '../hooks'
import { MemoryGrid } from '../components'
import { useGameResult } from '@/shared/hooks/useGameResult'
import '../styles/Memory.css'
import '@/shared/styles/ui.css'

export default function Memory() {
  const {
    difficulty,
    cards,
    score,
    scorePopup,
    size,
    initGame,
    handleClick,
    result,
<<<<<<< HEAD
    sessionKey,
=======
    restartCount,
>>>>>>> 1f08562d1fd39183b7bc6edf37e7a81703780323
  } = useMemoryGame()

  const navigate = useNavigate()

  // Старт игры
  useEffect(() => {
    initGame('easy')
  }, [])

  // СОХРАНЕНИЕ РЕЗУЛЬТАТА
  useGameResult({
    game: 'memory',
    score,
    difficulty,
    shouldSave: result === 'win',
<<<<<<< HEAD
    restartKey: sessionKey,
=======
    restartKey: restartCount,
    lastResult: result,
>>>>>>> 1f08562d1fd39183b7bc6edf37e7a81703780323
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
          isWin={result === 'win'}
        />
      </div>

      {/* ДЕЙСТВИЯ */}
      <div className="status-text memory-status">
        {result === 'win' && (
          <h3 className="status-text win-text">Победа 🏆</h3>
        )}

        <div className="restart-button">
          <button onClick={() => initGame(difficulty)}>🔄 Начать заново</button>
        </div>
      </div>

      {/* ПРАВИЛА */}
      <RulesBlock rules={[...baseRules, ...rulesByDifficulty[difficulty]]} />

      <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
    </GameLayout>
  )
}
