import { useState } from 'react'
import {
  generateCards,
  SIZE_MAP,
  getBonus,
  getPenalty,
  isLuckyPair,
  type Card,
} from '../engine'

export type Difficulty = keyof typeof SIZE_MAP

export function useMemoryGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')

  const [cards, setCards] = useState<Card[]>([])
  const [firstCard, setFirstCard] = useState<Card | null>(null)

  const [seenCards, setSeenCards] = useState<number[]>([])
  const [firstCardWasSeen, setFirstCardWasSeen] = useState(false)

  const [disabled, setDisabled] = useState(false)

  const [score, setScore] = useState(0)
  const [scorePopup, setScorePopup] = useState('')

  const [result, setResult] = useState<'win' | 'idle'>()
  const [restartCount, setRestartCount] = useState(0)

  const size = SIZE_MAP[difficulty]

  // ИНИЦИАЛИЗАЦИЯ ИГРЫ
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
    setRestartCount(prev => prev + 1)
  }

  // POPUP
  const showScorePopup = (text: string) => {
    setScorePopup(text)
    setTimeout(() => setScorePopup(''), 1000)
  }

  // CLICK
  const handleClick = (card: Card) => {
    if (disabled || card.isFlipped || card.isMatched) return

    const wasSeenBefore = seenCards.includes(card.id)

    if (!wasSeenBefore) {
      setSeenCards(prev => [...prev, card.id])
    }

    setCards(prev =>
      prev.map(c => (c.id === card.id ? { ...c, isFlipped: true } : c)),
    )

    if (!firstCard) {
      setFirstCard(card)
      setFirstCardWasSeen(wasSeenBefore)
      return
    }

    setDisabled(true)

    setTimeout(() => {
      checkMatch(firstCard, card, firstCardWasSeen, wasSeenBefore)
    }, 600)
  }

  // ПРОВЕРКА ПАРЫ
  const checkMatch = (
    c1: Card,
    c2: Card,
    c1WasSeen: boolean,
    c2WasSeen: boolean,
  ) => {
    const isMatch = c1.value === c2.value

    let scoreDelta = 0

    let updatedCards = [...cards] // 👈 ВАЖНО: берём текущие карты

    if (isMatch) {
      const bonus = getBonus(difficulty)
      const isLucky = isLuckyPair(c1WasSeen, c2WasSeen)

      const totalBonus = isLucky ? bonus + 5 : bonus

      scoreDelta = totalBonus

      showScorePopup(isLucky ? `+${bonus}+5` : `+${bonus}`)

      updatedCards = updatedCards.map(c =>
        c.value === c1.value ? { ...c, isMatched: true } : c,
      )
    } else {
      const penalty = getPenalty(c1WasSeen, c2WasSeen)

      if (penalty > 0) {
        scoreDelta = -penalty
        showScorePopup(`-${penalty}`)
      }

      updatedCards = updatedCards.map(c =>
        c.id === c1.id || c.id === c2.id ? { ...c, isFlipped: false } : c,
      )

      setResult('idle')
    }

    // обновляем карты ОДИН РАЗ
    setCards(updatedCards)

    // score
    if (scoreDelta !== 0) {
      setScore(prev => prev + scoreDelta)
    }

    // WIN CHECK
    const isWinNow = updatedCards.every(c => c.isMatched)

    if (isWinNow) {
      setResult('win')
    }

    setFirstCard(null)
    setFirstCardWasSeen(false)
    setDisabled(false)
  }

  return {
    difficulty,
    setDifficulty,
    cards,
    score,
    scorePopup,
    size,
    initGame,
    handleClick,
    result,
    restartCount,
  }
}
