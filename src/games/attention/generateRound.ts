import type { Item } from './types'
import { SHAPES, COLORS } from './constants'

function randomShape() {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)]
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

// EASY - "сколько было цветов?"
export function generateEasy(items: Item[]) {
  const color = randomColor()
  return {
    question: `Сколько ${color}?`,
    correctAnswer: items.filter(i => i.color === color).length,
  }
}

// MEDIUM - "была ли звездочка?"
export function generateMedium(items: Item[]) {
  const shape = randomShape()

  return {
    question: `Был ли ${shape}?`,
    correctAnswer: items.some(i => i.shape === shape),
  }
}

// HARD - "сколько звездочек?"
export function generateHard(items: Item[]) {
  const shape = randomShape()

  return {
    question: `Сколько ${shape}?`,
    correctAnswer: items.filter(i => i.shape === shape).length,
  }
}
