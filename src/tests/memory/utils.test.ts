import { generateCards } from '@/games/memory/engine'

describe('generateCards', () => {
  test('Создает  нужное количество карт', () => {
    const size = 4
    const cards = generateCards(size)

    expect(cards.length).toBe(size * size)
  })

  test('У каждой карты есть нужные свойства', () => {
    const cards = generateCards(2)

    cards.forEach(card => {
      expect(card).toHaveProperty('id')
      expect(card).toHaveProperty('value')
      expect(card).toHaveProperty('isFlipped')
      expect(card).toHaveProperty('isMatched')
    })
  })

  test('Карты парные (одно значение встречается дважды)', () => {
    const cards = generateCards(2)

    const values = cards.map(c => c.value)
    const unique = new Set(values)

    expect(values.length).toBe(4)
    expect(unique.size).toBe(2)
  })
})
