import { useNavigate } from 'react-router-dom'

export default function Stats() {
  const navigate = useNavigate()
  return (
    <div>
      <h2>Статистика</h2>
      <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
    </div>
  )
}
