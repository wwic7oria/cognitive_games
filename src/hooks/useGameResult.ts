import { useEffect, useRef } from 'react'
import { progressStore } from '../stats/progressStore'
import type { GameId } from '../stats/progressStore'

type Params = {
  game: GameId
  score?: number
  difficulty: string
  shouldSave: boolean
  roundCount?: number
  bestScore?: number
  totalScore?: number
}

export function useGameResult({
  game,
  score,
  difficulty,
  shouldSave,
  roundCount,
  bestScore,
  totalScore,
}: Params) {
  const savedRef = useRef(false)

  // Reset when difficulty changes
  useEffect(() => {
    savedRef.current = false
  }, [difficulty])

  // Save result
  useEffect(() => {
    if (!shouldSave) return
    if (savedRef.current) return

    // For sequence: check roundCount
    if (roundCount !== undefined && roundCount === 0) return

    savedRef.current = true

    // Sequence uses session-based saving
    if (
      roundCount !== undefined &&
      bestScore !== undefined &&
      totalScore !== undefined
    ) {
      progressStore.addSessionResult(
        game,
        roundCount,
        bestScore,
        totalScore,
        difficulty,
      )
    }
    // Memory and Attention use single-game saving
    else if (score !== undefined) {
      progressStore.addScore(game, score, difficulty)
    }
  }, [shouldSave, score, roundCount, bestScore, totalScore, difficulty, game])
}
