import { describe, test, expect } from 'vitest'
import { generateSequence } from '@/games/sequence/engine'

describe('generateSequence', () => {
  test('Создает последовательность нужной длины', () => {
    const seq = generateSequence(5, 3)

    expect(seq).toHaveLength(5)
  })

  test('Все числа находятся в пределах поля', () => {
    const size = 4

    const seq = generateSequence(30, size)

    expect(seq.every(v => v >= 0 && v < size * size)).toBe(true)
  })

  test('Пустая последовательность при length = 0', () => {
    expect(generateSequence(0, 3)).toEqual([])
  })
})
