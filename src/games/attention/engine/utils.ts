import { COLORS, SHAPES } from './constants'
import type { AttentionItem } from './types'

const MAX_PER = 3

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

export function generateItems(count: number): AttentionItem[] {
  const maxShape = SHAPES.length * MAX_PER
  const maxColor = COLORS.length * MAX_PER
  const maxPossible = Math.max(maxShape, maxColor)

  if (count > maxPossible) {
    throw new Error(`Ошибка: сгенерировано ${count}, максимум ${maxPossible}`)
  }

  // FIX: сохраняем типы
  const shapesPool = SHAPES.flatMap(s =>
    Array(MAX_PER).fill(s),
  ) as (typeof SHAPES)[number][]
  const colorsPool = COLORS.flatMap(c =>
    Array(MAX_PER).fill(c),
  ) as (typeof COLORS)[number][]

  shuffle(shapesPool)
  shuffle(colorsPool)

  const result: AttentionItem[] = []

  for (let i = 0; i < count; i++) {
    result.push({
      shape: shapesPool[i],
      color: colorsPool[i],
    })
  }

  return result
}
