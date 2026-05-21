import { useEffect, useRef } from 'react'
import { progressStore } from '../stats/progressStore'
import type { GameId } from '../stats/progressStore'

type Params = {
  game: GameId
  score: number
  difficulty: string
  shouldSave: boolean
}

export function useGameResult({ game, score, difficulty, shouldSave }: Params) {
  const savedRef = useRef(false)

  // сброс при смене сложности
  useEffect(() => {
    savedRef.current = false
  }, [difficulty])

  // сохранение результата
  useEffect(() => {
    if (!shouldSave) return
    if (savedRef.current) return

    savedRef.current = true

    progressStore.addScore(game, score, difficulty)
  }, [shouldSave, score, difficulty, game])
}
