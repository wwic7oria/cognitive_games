import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <h1 className="page-title">Когнитивные тренажёры</h1>
      <br />

      <button onClick={() => navigate('/memory')}>
        Поиск дубликатов карточек
      </button>

      <br />

      <button onClick={() => navigate('/sequence')}>
        Повтори последовательность
      </button>

      <br />

      <button onClick={() => navigate('/attention')}>Запомни элементы</button>

      <br />

      <button onClick={() => navigate('/stats')}>Статистика</button>
    </div>
  )
}
