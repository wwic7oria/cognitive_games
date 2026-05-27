import { useEffect, useRef } from 'react'
import { progressStore, type GameId } from '@/shared/stats/progressStore'

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

  // Ресет при смене сложности
  useEffect(() => {
    savedRef.current = false
  }, [difficulty])

  // Сохранение результата
  useEffect(() => {
    if (!shouldSave) return
    if (savedRef.current) return

    // Для sequence и attention
    if (roundCount !== undefined && roundCount === 0) return

    savedRef.current = true

    // Sequence и attention используют сохранение по сессии
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
    // Для memory
    else if (score !== undefined) {
      progressStore.addScore(game, score, difficulty)
    }
  }, [shouldSave, score, roundCount, bestScore, totalScore, difficulty, game])
}
