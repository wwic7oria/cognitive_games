import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>Когнитивные тренажёры</h1>

      <button onClick={() => navigate('/memory')}>
        Поиск дубликатов карточек
      </button>

      <br />
      <br />

      <button onClick={() => navigate('/sequence')}>
        Повтори последовательность
      </button>

      <br />
      <br />

      <button onClick={() => navigate('/attention')}>
        Вспомни элементы
      </button>

      <br />
      <br />

      <button onClick={() => navigate('/stats')}>Статистика</button>
    </div>
  )
}
