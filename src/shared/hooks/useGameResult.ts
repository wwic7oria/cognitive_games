import { useEffect, useRef } from 'react'
import { progressStore, type GameId } from '@/shared/stats/progressStore'

type Params = {
  game: GameId
  difficulty: string
  shouldSave: boolean
  // restartKey относится только к memory
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
  // Хранится в ref, чтобы не вызывать ререндер + сохранять значения между useEffect
  const sessionIdRef = useRef<string>('')

  /* =========================
    СОЗДАНИЕ НОВОЙ СЕССИИ через уникальный идентификатор
  ========================= */
  const startSession = () => {
    sessionIdRef.current = `${game}-${Date.now()}`
  }

  /* =========================
    ОСНОВНОЙ EFFECT, срабатывает при изменениях
  ========================= */
  useEffect(() => {
    if (!shouldSave) return

    if (!sessionIdRef.current) {
      startSession()
    }

    const sessionId = sessionIdRef.current

    /* =========================
      MEMORY, сохраняется только score
    ========================= */
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

    /* =========================
      SEQUENCE + ATTENTION, сохраняется расширенная статистика
      В одной сессии может быть много раундов, сессия = раунды подряд до смены сложности/выхода на глав. страницу
    ========================= */
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

  /* =========================
    СБРОС СЕССИИ
    sessionId обнуляется для создания новой сессии следующей игрой
  ========================= */
  useEffect(() => {
    sessionIdRef.current = ''
  }, [difficulty, game, restartKey])

  return { startSession }
}
