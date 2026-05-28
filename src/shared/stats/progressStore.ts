export type GameId = 'memory' | 'sequence' | 'attention'

export type GameResult = {
  sessionId: string
  score?: number
  roundCount?: number
  bestScore?: number
  totalScore?: number
  difficulty: string
  playedAt: number
}

type ProgressState = Record<GameId, GameResult[]>

const STORAGE_KEY = 'app_progress'

const initialState: ProgressState = {
  memory: [],
  sequence: [],
  attention: [],
}

function getState(): ProgressState {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return structuredClone(initialState)

  try {
    return JSON.parse(raw)
  } catch {
    return structuredClone(initialState)
  }
}

function saveState(state: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const progressStore = {
  getAll() {
    return getState()
  },

  get(game: GameId) {
    return getState()[game]
  },

  /**
   * Создать или обновить сессию
   */
  saveSession(game: GameId, result: GameResult) {
    const state = getState()

    const idx = state[game].findIndex(r => r.sessionId === result.sessionId)

    if (idx !== -1) {
      state[game][idx] = result
    } else {
      state[game].push(result)
    }

    saveState(state)
  },

  reset() {
    saveState(structuredClone(initialState))
  },
}
