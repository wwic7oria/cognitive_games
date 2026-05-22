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
import { progressStore } from '../stats/progressStore'

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
    roundCount,
    bestScore,
    startGame,
    handleClick,
  } = useSequenceGame()

  const navigate = useNavigate()

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

  // Initialize on mount
  useEffect(() => {
    setDifficulty('easy')
  }, [])

  // Save session on difficulty change
  const handleDifficultyChange = (value: Difficulty) => {
    if (sessionRef.current.roundCount > 0) {
      progressStore.addSessionResult(
        'sequence',
        sessionRef.current.roundCount,
        sessionRef.current.bestScore,
        sessionRef.current.score,
        sessionRef.current.difficulty,
      )
    }
    setDifficulty(value)
  }

  // Save session on unmount
  useEffect(() => {
    return () => {
      if (sessionRef.current.roundCount > 0) {
        progressStore.addSessionResult(
          'sequence',
          sessionRef.current.roundCount,
          sessionRef.current.bestScore,
          sessionRef.current.score,
          sessionRef.current.difficulty,
        )
      }
    }
  }, [])

  return (
    <GameLayout title="Повтор последовательности">
      {/* SCORE */}
      <ScoreBlock
        score={score}
        popup={scorePopup}
      />

      <DifficultySelector
        current={difficulty}
        onChange={value => handleDifficultyChange(value as Difficulty)}
        options={[
          { value: 'easy', label: 'Лёгкий (2x2)' },
          { value: 'medium', label: 'Средний (3x3)' },
          { value: 'hard', label: 'Сложный (4x4)' },
        ]}
      />

      {/* SEQUENCE LENGTH INFO */}
      <div
        className="section"
        style={{ fontWeight: 600 }}
      >
        Длина последовательности: {currentLength} из {maxLength}
      </div>

      {/* GRID */}
      <SequenceGrid
        cells={cells}
        size={size}
        activeCell={activeCell}
        wrongClick={wrongClick}
        lastClicked={lastClicked}
        gameState={gameState}
        onClick={handleClick}
      />

      {/* STATUS */}
      <div className="section">
        {gameState === 'showing' && <h3>Запоминай...</h3>}
        {gameState === 'input' && <h3>Повтори</h3>}
      </div>

      {/* RESULT */}
      {result === 'win' && <h3 className="win-text">Победа 🎉</h3>}
      {result === 'lose' && <h3 className="error-text">Ошибка ❌</h3>}

      {/* CONTROLS */}
      {gameState === 'idle' && <button onClick={startGame}>Начать ▶</button>}

      {/* RULES */}
      <RulesBlock rules={rulesByDifficulty[difficulty]} />

      <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
    </GameLayout>
  )
}
