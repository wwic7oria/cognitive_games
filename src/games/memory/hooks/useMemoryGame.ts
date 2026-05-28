import { useState } from 'react'
import { generateCards, SIZE_MAP, type Card } from '../engine'
import { handleClick } from '../engine/handleClick'
import type { Difficulty } from '../engine/'

export function useMemoryGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')

  const [cards, setCards] = useState<Card[]>([])
  const [firstCard, setFirstCard] = useState<Card | null>(null)

  const [seenCards, setSeenCards] = useState<number[]>([])
  const [firstCardWasSeen, setFirstCardWasSeen] = useState(false)
  // Запрет кликов во время проверки пары
  const [disabled, setDisabled] = useState(false)

  const [score, setScore] = useState(0)
  const [scorePopup, setScorePopup] = useState('')

  const [result, setResult] = useState<'win' | 'idle'>('idle')
  // Ключ сессии
  // Каждая игра увеличивает, используется для создания новой сессии
  // Иначе кнопка "Начать заново" перезаписывает старую победу
  const [sessionKey, setSessionKey] = useState(0)

  const size = SIZE_MAP[difficulty]

  /* =========================
    ИНИЦИАЛИЗАЦИЯ ИГРЫ
  ========================= */
  const initGame = (diff: Difficulty) => {
    setDifficulty(diff)

    const newSize = SIZE_MAP[diff]

    setCards(generateCards(newSize))
    setFirstCard(null)
    setSeenCards([])
    setScore(0)
    setScorePopup('')
    setDisabled(false)
    setResult('idle')
    setSessionKey(prev => prev + 1)
  }

  // POPUP
  const showScorePopup = (text: string) => {
    setScorePopup(text)
    setTimeout(() => setScorePopup(''), 1000)
  }

  return {
    difficulty,
    setDifficulty,
    cards,
    score,
    scorePopup,
    size,
    initGame,
    handleClick: (card: Card) =>
      handleClick({
        card,
        disabled,
        seenCards,
        firstCard,
        firstCardWasSeen,
        difficulty,
        cards,
        showScorePopup,
        setSeenCards,
        setCards,
        setFirstCard,
        setFirstCardWasSeen,
        setDisabled,
        setScore,
        setResult,
      }),
    result,
    sessionKey,
  }
}
