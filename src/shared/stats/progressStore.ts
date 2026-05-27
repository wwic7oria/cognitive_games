export type GameId = 'memory' | 'sequence' | 'attention'

export type GameResult = {
  score?: number
  roundCount?: number
  bestScore?: number
  totalScore?: number
  difficulty: string
  playedAt: number
}

type ProgressState = Record<GameId, GameResult[]>

const STORAGE_KEY = 'app_progress'

// Инициализация
const initialState: ProgressState = {
  memory: [],
  sequence: [],
  attention: [],
}

function getState(): ProgressState {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return initialState

  try {
    return JSON.parse(raw)
  } catch {
    return initialState
  }
}

export const progressStore = {
  getAll() {
    return getState()
  },

  get(game: GameId) {
    return getState()[game]
  },

  addResult(game: GameId, result: GameResult) {
    const state = getState()

    state[game].push(result)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  },

  addScore(game: GameId, score: number, difficulty: string) {
    const state = getState()

    state[game].push({
      score,
      difficulty,
      playedAt: Date.now(),
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  },

  addSessionResult(
    game: GameId,
    roundCount: number,
    bestScore: number,
    totalScore: number,
    difficulty: string,
  ) {
    const state = getState()

    state[game].push({
      roundCount,
      bestScore,
      totalScore,
      difficulty,
      playedAt: Date.now(),
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  },

  // Migrate old attention/sequence data to new session format
  migrateOldData() {
    const state = getState()

    // Migrate old sequence data (individual scores instead of sessions)
    if (state.sequence.length > 0 && state.sequence[0].score !== undefined) {
      const oldSequence = state.sequence as Array<{
        score: number
        difficulty: string
        playedAt: number
      }>
      state.sequence = oldSequence.map(item => ({
        roundCount: 1,
        bestScore: Math.max(0, item.score),
        totalScore: item.score,
        difficulty: item.difficulty,
        playedAt: item.playedAt,
      }))
    }

    // Migrate old attention data (individual scores instead of sessions)
    if (state.attention.length > 0 && state.attention[0].score !== undefined) {
      const oldAttention = state.attention as Array<{
        score: number
        difficulty: string
        playedAt: number
      }>
      state.attention = oldAttention.map(item => ({
        roundCount: 1,
        bestScore: Math.max(0, item.score),
        totalScore: item.score,
        difficulty: item.difficulty,
        playedAt: item.playedAt,
      }))
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  },

  reset() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState))
  },
}
