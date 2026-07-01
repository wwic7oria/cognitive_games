import { describe, test, expect, vi } from 'vitest'
import { generateRound } from '@/games/attention/engine'
import type { AttentionItem } from '@/games/attention/engine'

describe('generateRound', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('Сложность easy создаёт вопрос про цвет', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const items: AttentionItem[] = [
      { shape: 'heart', color: 'red' },
      { shape: 'star', color: 'red' },
      { shape: 'bolt', color: 'blue' },
    ]

    const round = generateRound(items, 'easy')

    expect(round.question).toContain('🔴')
    expect(round.options).toHaveLength(4)

    const correct = round.options.filter(o => o.value)

    expect(correct).toHaveLength(1)
    expect(correct[0].label).toBe('2')
  })

  test('Сложность medium создаёт вопрос Да/Нет', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const items: AttentionItem[] = [{ shape: 'heart', color: 'red' }]

    const round = generateRound(items, 'medium')

    expect(round.options).toEqual([
      { label: 'Да', value: true },
      { label: 'Нет', value: false },
    ])
  })

  test('Сложность hard создаёт вопрос с четырьмя вариантами', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const items: AttentionItem[] = [
      { shape: 'heart', color: 'red' },
      { shape: 'heart', color: 'blue' },
    ]

    const round = generateRound(items, 'hard')

    expect(round.options).toHaveLength(4)

    const correct = round.options.filter(o => o.value)

    expect(correct).toHaveLength(1)
    expect(correct[0].label).toBe('2')
  })

  test('если объекта нет, правильный ответ 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const items: AttentionItem[] = [{ shape: 'star', color: 'blue' }]

    const round = generateRound(items, 'hard')

    const correct = round.options.find(o => o.value)

    expect(correct?.label).toBe('0')
  })
})
