import type React from 'react'
import type { Card, Difficulty } from './'
import { checkMatch } from './checkMatch'

type HandleClickParams = {
  card: Card
  disabled: boolean
  seenCards: number[]
  firstCard: Card | null
  firstCardWasSeen: boolean
  difficulty: Difficulty
  cards: Card[]
  showScorePopup: (text: string) => void
  setSeenCards: React.Dispatch<React.SetStateAction<number[]>>
  setCards: React.Dispatch<React.SetStateAction<Card[]>>
  setFirstCard: React.Dispatch<React.SetStateAction<Card | null>>
  setFirstCardWasSeen: React.Dispatch<React.SetStateAction<boolean>>
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
  setScore: React.Dispatch<React.SetStateAction<number>>
  setResult: React.Dispatch<React.SetStateAction<'win' | 'idle'>>
  setSessionKey?: React.Dispatch<React.SetStateAction<number>>
}

export function handleClick({
  card,
  disabled,
  seenCards,
  firstCard,
  firstCardWasSeen,
  difficulty,
  showScorePopup,
  setSeenCards,
  setCards,
  setFirstCard,
  setFirstCardWasSeen,
  setDisabled,
  setScore,
  setResult,
}: HandleClickParams) {
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

  const currentFirstCard = firstCard
  const currentFirstCardWasSeen = firstCardWasSeen

  setTimeout(() => {
    checkMatch({
      c1: currentFirstCard,
      c2: card,
      c1WasSeen: currentFirstCardWasSeen,
      c2WasSeen: wasSeenBefore,
      difficulty,
      showScorePopup,
      setCards,
      setScore,
      setResult,
      setFirstCard,
      setFirstCardWasSeen,
      setDisabled,
    })
  }, 600)
}
