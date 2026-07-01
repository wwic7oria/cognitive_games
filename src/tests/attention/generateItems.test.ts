import { describe, test, expect } from 'vitest'
import { generateItems } from '@/games/attention/engine'
import {
  COLORS,
  SHAPES,
  type Shape,
  type Color,
} from '@/games/attention/engine/constants'

describe('generateItems', () => {
  test('Создаёт нужное количество элементов', () => {
    const items = generateItems(8)

    expect(items).toHaveLength(8)
  })

  test('Каждый элемент содержит shape и color', () => {
    const items = generateItems(8)

    items.forEach(item => {
      expect(item.shape).toBeTruthy()
      expect(item.color).toBeTruthy()
    })
  })

  test('Ни одна форма не повторяется больше 3 раз', () => {
    const items = generateItems(18)
    // MAX_COUNT = 6 * 3 = 18 для generateItems, можно выставить 20 для проверки

    const counts = new Map<string, number>()

    items.forEach(i => {
      counts.set(i.shape, (counts.get(i.shape) ?? 0) + 1)
    })

    counts.forEach(v => {
      expect(v).toBeLessThanOrEqual(3)
    })
  })

  test('Ни один цвет не повторяется больше 3 раз', () => {
    const items = generateItems(18)

    const counts = new Map<string, number>()

    items.forEach(i => {
      counts.set(i.color, (counts.get(i.color) ?? 0) + 1)
    })

    counts.forEach(v => {
      expect(v).toBeLessThanOrEqual(3)
    })
  })

  test('generateItems всегда возвращает валидные shape/color из списков', () => {
    const items = generateItems(10)

    const validShapes = new Set(SHAPES)
    const validColors = new Set(COLORS)

    items.forEach(i => {
      expect(validShapes.has(i.shape)).toBe(true)
      expect(validColors.has(i.color)).toBe(true)
    })
  })

  test('generateItems выбрасывает ошибку при превышении лимита', () => {
    const max = SHAPES.length * 3

    expect(() => generateItems(max)).not.toThrow()
    expect(() => generateItems(max + 1)).toThrow()
  })

  test('generateItems всегда возвращает валидные shape/color из списков', () => {
    const items = generateItems(18)

    const validShapes = new Set<Shape>(SHAPES)
    const validColors = new Set<Color>(COLORS)

    items.forEach(i => {
      expect(validShapes.has(i.shape)).toBe(true)
      expect(validColors.has(i.color)).toBe(true)
    })
  })
})
