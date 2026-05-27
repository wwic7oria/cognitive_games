import type { Card } from './types'
import { EMOJIS } from './constants'

// Генерация карточек

export const generateCards = (size: number): Card[] => {
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
