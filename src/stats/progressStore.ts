export type GameId = 'memory' | 'sequence' | 'attention'

export type GameResult = {
  score: number
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

  reset() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState))
  },
}
