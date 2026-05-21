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

// Загрузка из localStorage
function load(): ProgressState {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) return initialState

  try {
    return JSON.parse(raw)
  } catch {
    return initialState
  }
}

// Сохранение
function save(state: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// Текущее состояние (в памяти)
let state: ProgressState = load()

export const progressStore = {
  // Получить все и по игре
  getAll() {
    return state
  },

  get(game: GameId) {
    return state[game]
  },

  // Добавить результат
  addResult(game: GameId, result: GameResult) {
    state[game].push(result)
    save(state)
  },

  addScore(game: GameId, score: number, difficulty: string) {
    state[game].push({
      score,
      difficulty,
      playedAt: Date.now(),
    })

    save(state)
  },

  // Очистка всего
  reset() {
    state = { ...initialState }
    save(state)
  },
}
