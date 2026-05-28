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

// Структура прогресса в localStorage
type ProgressState = Record<GameId, GameResult[]>

const STORAGE_KEY = 'app_progress'

// Нач. состояние
const initialState: ProgressState = {
  memory: [],
  sequence: [],
  attention: [],
}

/* =========================
  ЧТЕНИЕ СОСТОЯНИЯ ИЗ localStorage
========================= */
function getState(): ProgressState {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return structuredClone(initialState)

  // Пробуем распарсить, если данных нет = откат к нач. состояни.
  try {
    return JSON.parse(raw)
  } catch {
    return structuredClone(initialState)
  }
}

// СОХРАНЕНИЕ В localStorage
function saveState(state: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const progressStore = {
  // Получение ВСЕХ данных
  getAll() {
    return getState()
  },
  // Получение данных по игре
  get(game: GameId) {
    return getState()[game]
  },

  /* =========================
    СОХРАНИТЬ/ОБНОВИТЬ СЕССИЮ
  ========================= */
  saveSession(game: GameId, result: GameResult) {
    const state = getState()
    // Поиск sessionId
    const idx = state[game].findIndex(r => r.sessionId === result.sessionId)
    // Если sessionId уже есть, обновляем
    // Если нет, создаем запись
    if (idx !== -1) {
      state[game][idx] = result
    } else {
      state[game].push(result)
    }
    // Сохраняем
    saveState(state)
  },

  // Сброс прогресса, чтобы не удалять через F12
  // Находится на странице со статистикой
  reset() {
    saveState(structuredClone(initialState))
  },
}
