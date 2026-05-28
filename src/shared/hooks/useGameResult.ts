import { useEffect, useRef } from 'react'
import { progressStore, type GameId } from '@/shared/stats/progressStore'

type Params = {
  game: GameId
  difficulty: string
  shouldSave: boolean
  restartKey?: string | number

  score?: number
  roundCount?: number
  bestScore?: number
}

export function useGameResult({
  game,
  score,
  difficulty,
  shouldSave,
  restartKey,
  roundCount,
  bestScore,
}: Params) {
  // 💥 sessionId ВСЕГДА string (никаких null)
  const sessionIdRef = useRef<string>('')

  // =========================
  // START NEW SESSION
  // =========================
  const startSession = () => {
    sessionIdRef.current = `${game}-${Date.now()}-${Math.random()}`
  }

  // =========================
  // AUTO INIT SESSION (first save only)
  // =========================
  useEffect(() => {
    if (!shouldSave) return

    if (!sessionIdRef.current) {
      startSession()
    }

    const sessionId = sessionIdRef.current

    // =========================
    // MEMORY GAME
    // =========================
    if (game === 'memory') {
      if (score === undefined) return

      progressStore.saveSession(game, {
        sessionId,
        score,
        difficulty,
        playedAt: Date.now(),
      })

      return
    }

    // =========================
    // SEQUENCE / ATTENTION
    // =========================
    if (roundCount === undefined || bestScore === undefined) return

    progressStore.saveSession(game, {
      sessionId,
      roundCount,
      bestScore,
      totalScore: score ?? 0,
      difficulty,
      playedAt: Date.now(),
    })
  }, [shouldSave, score, roundCount, bestScore, difficulty, game])

  // =========================
  // MANUAL SESSION CONTROL
  // =========================
  useEffect(() => {
    sessionIdRef.current = ''
  }, [difficulty, game, restartKey])

  return { startSession }
}
