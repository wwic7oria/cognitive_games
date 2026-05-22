import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { progressStore } from '../stats/progressStore'

export default function Stats() {
  const navigate = useNavigate()

  // Migrate old data on first load
  useEffect(() => {
    progressStore.migrateOldData()
  }, [])

  const data = progressStore.getAll()

  const memoryResults = data.memory
  const sequenceResults = data.sequence
  const attentionResults = data.attention

  const getGamesPlayed = (arr: typeof memoryResults) => {
    return arr.reduce((sum, r) => {
      // For sequence (session-based)
      if (r.roundCount !== undefined) {
        return sum + r.roundCount
      }
      // For memory/attention (single-game based)
      return sum + 1
    }, 0)
  }

  const getTotalScore = (arr: typeof memoryResults) => {
    return arr.reduce((sum, r) => {
      // For sequence (session-based)
      if (r.totalScore !== undefined) {
        return sum + r.totalScore
      }
      // For memory/attention (single-game based)
      if (r.score !== undefined) {
        return sum + r.score
      }
      return sum
    }, 0)
  }

  // Calculate best score for attention (consecutive winning runs)
  const getAttentionBestScore = (arr: typeof attentionResults) => {
    if (!arr.length) return 0

    let maxSum = 0
    let currentSum = 0

    for (const result of arr) {
      const score = result.totalScore || result.score || 0
      currentSum += score
      maxSum = Math.max(maxSum, currentSum)
      // Reset if we hit negative
      if (currentSum < 0) {
        currentSum = 0
      }
    }

    return maxSum
  }

  const getBestScore = (arr: typeof memoryResults, gameType?: 'attention') => {
    if (!arr.length) return 0

    // For attention, use consecutive win calculation
    if (gameType === 'attention') {
      return getAttentionBestScore(arr)
    }

    return Math.max(
      ...arr.map(r => {
        // For sequence (session-based)
        if (r.bestScore !== undefined) {
          return r.bestScore
        }
        // For memory/attention (single-game based)
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
          <p>Лучший результат: {getBestScore(attentionResults, 'attention')}</p>
          <p>Средний результат: {getAvgScore(attentionResults)}</p>
        </div>

        {/* Back */}
        <div style={{ marginTop: 40 }}>
          <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
        </div>
      </div>
    </div>
  )
}
