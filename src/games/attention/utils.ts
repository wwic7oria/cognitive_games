import { COLORS, SHAPES } from './constants'
import type { AttentionItem } from './types'

function randomShape() {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)]
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

function isValid(items: AttentionItem[]) {
  for (let i = 3; i < items.length; i++) {
    if (
      items[i].shape === items[i - 1].shape &&
      items[i].shape === items[i - 2].shape &&
      items[i].shape === items[i - 3].shape
    )
      return false

    if (
      items[i].color === items[i - 1].color &&
      items[i].color === items[i - 2].color &&
      items[i].shape === items[i - 3].shape
    )
      return false
  }
  return true
}

export function generateItems(count: number): AttentionItem[] {
  let attempts = 0

  while (attempts < 1000) {
    const items = Array.from({ length: count }, () => ({
      shape: randomShape(),
      color: randomColor(),
    }))

    if (isValid(items)) return items
    attempts++
  }

  // fallback (никогда почти не используется)
  return Array.from({ length: count }, () => ({
    shape: randomShape(),
    color: randomColor(),
  }))
}
