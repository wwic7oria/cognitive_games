import { COLORS, SHAPES } from './constants'
import type { AttentionItem } from './types'

function randomShape() {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)]
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

export function generateItems(count: number): AttentionItem[] {
  const items: AttentionItem[] = []

  const shapeCount = new Map<string, number>()
  const colorCount = new Map<string, number>()

  for (let i = 0; i < count; i++) {
    const shape = randomShape()
    const color = randomColor()

    const shapeUsed = shapeCount.get(shape) || 0
    const colorUsed = colorCount.get(color) || 0

    // Не больше 3 повторений одной формы или цвета
    if (shapeUsed >= 3 || colorUsed >= 3) {
      i--
      continue
    }

    items.push({ shape, color })

    shapeCount.set(shape, shapeUsed + 1)
    colorCount.set(color, colorUsed + 1)
  }

  return items
}
