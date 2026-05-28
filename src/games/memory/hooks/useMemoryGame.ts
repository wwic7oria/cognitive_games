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
    // Создается новая сессия для нового сохранения в localStorage
    setSessionKey(prev => prev + 1)
  }

  // POPUP
  const showScorePopup = (text: string) => {
    setScorePopup(text)
    setTimeout(() => setScorePopup(''), 1000)
  }

  /* =========================
    ОБРАБОТКА КЛИКА
  ========================= */
  const handleClick = (card: Card) => {
    if (disabled || card.isFlipped || card.isMatched) return

    const wasSeenBefore = seenCards.includes(card.id)
    // Карта открыта впервые -> добавляется в seenCards
    if (!wasSeenBefore) {
      setSeenCards(prev => [...prev, card.id])
    }
    // Карточка открывается на поле (визуально)
    setCards(prev =>
      prev.map(c => (c.id === card.id ? { ...c, isFlipped: true } : c)),
    )

    /* =========================
      ВЫБОР ПЕРВОЙ КАРТОЧКИ ПАРЫ. Запоминается:
      1. первая карта пары
      2. видели ли карту ранее
      После этого ожидается второй клик
    ========================= */
    if (!firstCard) {
      setFirstCard(card)
      setFirstCardWasSeen(wasSeenBefore)
      return
    }
    /* =========================
      ВЫБОР ВТОРОЙ КАРТОЧКИ ПАРЫ. 
      Если firstCard уже есть, игрок выбирает вторую карту:
      Пара сформирована, клики временно блокируются + таймер 600 мс перед проверкой пары
    ========================= */
    setDisabled(true)

    setTimeout(() => {
      checkMatch(firstCard, card, firstCardWasSeen, wasSeenBefore)
    }, 600)
  }

  /* =========================
    ПРОВЕРКА ПАРЫ
  ========================= */
  const checkMatch = (
    c1: Card,
    c2: Card,
    c1WasSeen: boolean,
    c2WasSeen: boolean,
  ) => {
    const isMatch = c1.value === c2.value

    let scoreDelta = 0
    // Копия текущих карт, сюда вносятся изменения
    let updatedCards = [...cards]

    /* =========================
      КАРТОЧКИ СОВПАЛИ
    ========================= */
    if (isMatch) {
      const bonus = getBonus(difficulty)
      // Если обе карточки открыты впервые, дается бонус +5 очков
      const isLucky = isLuckyPair(c1WasSeen, c2WasSeen)

      const totalBonus = isLucky ? bonus + 5 : bonus

      scoreDelta = totalBonus

      showScorePopup(isLucky ? `+${bonus}+5` : `+${bonus}`)
      // Пара отмечается как найденная
      updatedCards = updatedCards.map(c =>
        c.value === c1.value ? { ...c, isMatched: true } : c,
      )

      /* =========================
      КАРТОЧКИ НЕ СОВПАЛИ
    ========================= */
    } else {
      const penalty = getPenalty(c1WasSeen, c2WasSeen)
      // Штраф, если одну из карт уже видели
      if (penalty > 0) {
        scoreDelta = -penalty
        showScorePopup(`-${penalty}`)
      }
      // Карты переворачиваются
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
    sessionKey,
  }
}
