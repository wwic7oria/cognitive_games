import { useEffect, useState } from 'react'

/**
 * Тип карточки
 */
type Card = {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

/**
 * Набор символов
 */
const EMOJIS = [
  '🍎',
  '🚗',
  '🐶',
  '⭐',
  '🔥',
  '⚽',
  '🎵',
  '🌈',
  '🍕',
  '🚀',
  '🐱',
  '🌙',
  '⚡',
  '🍩',
  '🎮',
  '📚',
  '🧠',
  '🎯',
]

/**
 * Генерация карточек под размер поля
 */
const generateCards = (size: number): Card[] => {
  const pairsCount = (size * size) / 2

  const values = EMOJIS.slice(0, pairsCount)
  const pairs = [...values, ...values]

  return pairs
    .sort(() => Math.random() - 0.5)
    .map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }))
}

export default function Memory() {
  /**
   * сложность игры
   */
  const [difficulty, setDifficulty] = useState<'easy' | 'medium'>('easy')

  /**
   * карточки
   */
  const [cards, setCards] = useState<Card[]>([])

  /**
   * первая карточка
   */
  const [firstCard, setFirstCard] = useState<Card | null>(null)

  /**
   * уже увиденные карточки
   */
  const [seenCards, setSeenCards] = useState<number[]>([])
  const [firstCardWasSeen, setFirstCardWasSeen] = useState(false)

  /**
   * блокировка кликов
   */
  const [disabled, setDisabled] = useState(false)

  /**
   * счёт
   */
  const [score, setScore] = useState(0)

  /**
   * popup очков
   */
  const [scorePopup, setScorePopup] = useState('')

  /**
   * размеры поля
   */
  const SIZE_MAP = {
    easy: 4,
    medium: 6,
  }

  /**
   * пересоздание игры при смене сложности
   */
  useEffect(() => {
    const size = SIZE_MAP[difficulty]

    setCards(generateCards(size))

    setFirstCard(null)
    setScore(0)
    setSeenCards([])
    setScorePopup('')
  }, [difficulty])

  /**
   * клик по карточке
   */
  const handleClick = (card: Card) => {
    if (disabled || card.isFlipped || card.isMatched) return

    const wasSeenBefore = seenCards.includes(card.id)

    // фиксируем первое открытие
    if (!wasSeenBefore) {
      setSeenCards(prev => [...prev, card.id])
    }

    const updated = cards.map(c =>
      c.id === card.id ? { ...c, isFlipped: true } : c,
    )

    setCards(updated)

    if (!firstCard) {
      setFirstCard(card)
      setFirstCardWasSeen(wasSeenBefore)
      return
    }

    setDisabled(true)

    setTimeout(() => {
      checkMatch(firstCard, card, firstCardWasSeen, wasSeenBefore)
    }, 700)
  }

  // Показывает popup с изменением счета
  const showScorePopup = (text: string) => {
    setScorePopup(text)

    setTimeout(() => {
      setScorePopup('')
    }, 1000)
  }

  // Проверка пары
  const checkMatch = (
    c1: Card,
    c2: Card,
    c1WasSeen: boolean,
    c2WasSeen: boolean,
  ) => {
    let updated = [...cards]

    const isMatch = c1.value === c2.value

    if (isMatch) {
      updated = updated.map(c =>
        c.value === c1.value ? { ...c, isMatched: true } : c,
      )

      const bonus = difficulty === 'easy' ? 10 : 15

      // За фактор "удачи" (обе карточки открываются впервые) даются бонусные очки +5
      const isLucky = !c1WasSeen && !c2WasSeen
      let totalBonus = bonus

      if (isLucky) {
        totalBonus += 5
        showScorePopup(`+${totalBonus} +5`)
      } else {
        showScorePopup(`+${totalBonus}`)
      }

      setScore(prev => prev + totalBonus)

      showScorePopup(`+${bonus}`)
    } else {
      // Пенальти за ошибку: -1 очко за каждую увиденную ранее карточку, макс. -2
      const penalty = (c1WasSeen ? 1 : 0) + (c2WasSeen ? 1 : 0)

      if (penalty > 0) {
        setScore(prev => prev - penalty)
        showScorePopup(`-${penalty}`)
      }

      updated = updated.map(c =>
        c.id === c1.id || c.id === c2.id ? { ...c, isFlipped: false } : c,
      )
    }

    setCards(updated)

    setFirstCard(null)
    setFirstCardWasSeen(false)
    setDisabled(false)
  }

  // Проверка победы
  const isWin = cards.length > 0 && cards.every(c => c.isMatched)

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        boxSizing: 'border-box',
      }}
    >
      <h2>Поиск карточек</h2>

      {/* Счет */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0 }}>Очки: {score}</h3>

          {/* Popup с изменением счета*/}
          {scorePopup && (
            <span
              style={{
                position: 'absolute',
                left: '100%',
                marginLeft: 8,
                fontSize: 20,
                fontWeight: 'bold',
                color: scorePopup.startsWith('+') ? 'green' : 'red',
              }}
            >
              {scorePopup}
            </span>
          )}
        </div>
      </div>

      {/* Выбор сложности */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          marginBottom: 10,
        }}
      >
        <button onClick={() => setDifficulty('easy')}>Лёгкий (4x4)</button>

        <button onClick={() => setDifficulty('medium')}>Средний (6x6)</button>
      </div>

      {/* Победа */}
      {isWin && <h3>Победа 🏆</h3>}

      {/* Поле */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${SIZE_MAP[difficulty]}, 80px)`,
            gap: 10,
          }}
        >
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => handleClick(card)}
              style={{
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
                background: card.isFlipped || card.isMatched ? '#fff' : '#444',
                border: '1px solid #000',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              {card.isFlipped || card.isMatched ? card.value : '?'}
            </div>
          ))}
        </div>
      </div>

      {/*Кнопка "Начать заново" */}
      <div style={{ marginTop: 15 }}>
        <button
          onClick={() => {
            const size = SIZE_MAP[difficulty]

            setCards(generateCards(size))
            setFirstCard(null)
            setSeenCards([])
            setScore(0)
            setScorePopup('')
            setDisabled(false)
          }}
        >
          Начать заново 🔄
        </button>
      </div>

      {/* Правила */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <h3>Правила</h3>

        {difficulty === 'easy' ? (
          <div>
            <p>
              <b style={{ color: 'green' }}>+10</b> очков за найденную пару
            </p>
            <p>
              <b style={{ color: 'green' }}>+5</b> бонус, если обе карточки ни
              разу не открывались
            </p>
            <p>
              <b style={{ color: 'red' }}>-1</b> очко за открытие каждой
              просмотренной карточки
            </p>
          </div>
        ) : (
          <div>
            <p>
              <b style={{ color: 'green' }}>+15</b> очков за найденную пару
            </p>
            <p>
              <b style={{ color: 'green' }}>+5</b> бонус, если обе карточки ни
              разу не открывались
            </p>
            <p>
              <b style={{ color: 'red' }}>-1</b> очко за открытие каждой
              просмотренной карточки
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
