import { useNavigate } from 'react-router-dom'
import { progressStore } from '../stats/progressStore'

export default function Stats() {
  const navigate = useNavigate()

  const data = progressStore.getAll()

  const memoryScores = data.memory
  const sequenceScores = data.sequence
  const attentionScores = data.attention

  const getTotalScore = (arr: typeof memoryScores) =>
    arr.reduce((sum, r) => sum + r.score, 0)

  const getBestScore = (arr: typeof memoryScores) =>
    arr.length ? Math.max(...arr.map(r => r.score)) : 0

  const getAvgScore = (arr: typeof memoryScores) =>
    arr.length ? Math.round(getTotalScore(arr) / arr.length) : 0

  return (
    <div className="stats-wrapper">
      <div className="stats">
        <h2>📊 Статистика</h2>

        {/* MEMORY */}
        <div style={{ marginTop: 40 }}>
          <h3>🧠 Поиск карт</h3>
          <p>Игр сыграно: {memoryScores.length}</p>
          <p>Сумма очков: {getTotalScore(memoryScores)}</p>
          <p>Лучший результат: {getBestScore(memoryScores)}</p>
          <p>Средний результат: {getAvgScore(memoryScores)}</p>
        </div>

        {/* SEQUENCE */}
        <div style={{ marginTop: 40 }}>
          <h3>🔢 Повтори последовательность</h3>
          <p>Игр сыграно: {sequenceScores.length}</p>
          <p>Сумма очков: {getTotalScore(sequenceScores)}</p>
          <p>Лучший результат: {getBestScore(sequenceScores)}</p>
          <p>Средний результат: {getAvgScore(sequenceScores)}</p>
        </div>

        {/* ATTENTION */}
        <div style={{ marginTop: 40 }}>
          <h3>🎯 Вспомни элементы</h3>
          <p>Игр сыграно: {attentionScores.length}</p>
          <p>Сумма очков: {getTotalScore(attentionScores)}</p>
          <p>Лучший результат: {getBestScore(attentionScores)}</p>
          <p>Средний результат: {getAvgScore(attentionScores)}</p>
        </div>

        {/* Назад */}
        <div style={{ marginTop: 40 }}>
          <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
        </div>
      </div>
    </div>
  )
}
