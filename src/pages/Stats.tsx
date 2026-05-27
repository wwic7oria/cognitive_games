import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { progressStore } from '@/shared/stats/progressStore'
import '@/shared/styles/Stats.css'

export default function Stats() {
  const navigate = useNavigate()

  const memory = progressStore.getStats('memory')
  const sequence = progressStore.getStats('sequence')
  const attention = progressStore.getStats('attention')

  const renderBlock = (title: string, stats: typeof memory) => (
    <div style={{ marginTop: 40 }}>
      <h3>{title}</h3>
      <p>Игр сыграно: {stats.gamesPlayed}</p>
      <p>Сумма очков: {stats.totalScore}</p>
      <p>Лучший результат: {stats.bestScore}</p>
      <p>
        Средний результат:{' '}
        {stats.gamesPlayed
          ? Math.round(stats.totalScore / stats.gamesPlayed)
          : 0}
      </p>
    </div>
  )

  return (
    <div className="stats-wrapper">
      <div className="stats">
        <h2>📊 Статистика</h2>

        {renderBlock('🧠 Поиск карт', memory)}
        {renderBlock('🔢 Повтори последовательность', sequence)}
        {renderBlock('🎯 Вспомни элементы', attention)}

        <div style={{ marginTop: 40 }}>
          <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
        </div>
      </div>
    </div>
  )
}
