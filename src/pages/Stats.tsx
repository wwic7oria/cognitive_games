import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { progressStore } from '../stats/progressStore'
import '../styles/Stats.css'

export default function Stats() {
  const navigate = useNavigate()

  // Миграция старых данных при загрузке страницы
  useEffect(() => {
    progressStore.migrateOldData()
  }, [])

  const data = progressStore.getAll()

  const memoryResults = data.memory
  const sequenceResults = data.sequence
  const attentionResults = data.attention

  const getGamesPlayed = (arr: typeof memoryResults) => {
    return arr.reduce((sum, r) => {
      // Для sequense и attention (session-based)
      if (r.roundCount !== undefined) {
        return sum + r.roundCount
      }
      // Для memory (single-game based)
      return sum + 1
    }, 0)
  }

  const getTotalScore = (arr: typeof memoryResults) => {
    return arr.reduce((sum, r) => {
      // Для sequense и attention
      if (r.totalScore !== undefined) {
        return sum + r.totalScore
      }
      // Для memory
      if (r.score !== undefined) {
        return sum + r.score
      }
      return sum
    }, 0)
  }

  const getBestScore = (arr: typeof memoryResults) => {
    if (!arr.length) return 0

    return Math.max(
      ...arr.map(r => {
        // Для sequense и attention
        if (r.bestScore !== undefined) {
          return r.bestScore
        }
        // Для memory
        if (r.score !== undefined) {
          return r.score
        }
        return 0
      }),
    )
  }

  const getAvgScore = (arr: typeof memoryResults) => {
    const totalRounds = getGamesPlayed(arr)
    return totalRounds ? Math.round(getTotalScore(arr) / totalRounds) : 0
  }

  return (
    <div className="stats-wrapper">
      <div className="stats">
        <h2>📊 Статистика</h2>

        {/* MEMORY */}
        <div style={{ marginTop: 40 }}>
          <h3>🧠 Поиск карт</h3>
          <p>Игр сыграно: {getGamesPlayed(memoryResults)}</p>
          <p>Сумма очков: {getTotalScore(memoryResults)}</p>
          <p>Лучший результат: {getBestScore(memoryResults)}</p>
          <p>Средний результат: {getAvgScore(memoryResults)}</p>
        </div>

        {/* SEQUENCE */}
        <div style={{ marginTop: 40 }}>
          <h3>🔢 Повтори последовательность</h3>
          <p>Игр сыграно: {getGamesPlayed(sequenceResults)}</p>
          <p>Сумма очков: {getTotalScore(sequenceResults)}</p>
          <p>Лучший результат: {getBestScore(sequenceResults)}</p>
          <p>Средний результат: {getAvgScore(sequenceResults)}</p>
        </div>

        {/* ATTENTION */}
        <div style={{ marginTop: 40 }}>
          <h3>🎯 Вспомни элементы</h3>
          <p>Игр сыграно: {getGamesPlayed(attentionResults)}</p>
          <p>Сумма очков: {getTotalScore(attentionResults)}</p>
          <p>Лучший результат: {getBestScore(attentionResults)}</p>
          <p>Средний результат: {getAvgScore(attentionResults)}</p>
        </div>

        {/* НАЗАД */}
        <div style={{ marginTop: 40 }}>
          <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
        </div>
      </div>
    </div>
  )
}
