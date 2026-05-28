import { checkMatch } from '@/games/memory/engine'
import { vi } from 'vitest'

const makeSetters = () => ({
  setCards: vi.fn(fn => fn([])),
  setScore: vi.fn(fn => fn(0)),
  setResult: vi.fn(),
  setFirstCard: vi.fn(),
  setFirstCardWasSeen: vi.fn(),
  setDisabled: vi.fn(),
})

describe('checkMatch', () => {
  test('Совпадение дает очки', () => {
    const set = makeSetters()
    const showPopup = vi.fn()

    checkMatch({
      c1: { id: 1, value: 'A', isFlipped: false, isMatched: false },
      c2: { id: 2, value: 'A', isFlipped: false, isMatched: false },
      c1WasSeen: false,
      c2WasSeen: false,
      difficulty: 'easy',
      showPopup,
      ...set,
    })

    expect(set.setScore).toHaveBeenCalled()
    expect(set.setCards).toHaveBeenCalled()
    expect(showPopup).toHaveBeenCalled()
  })

  test('luckyPair дает бонус +5', () => {
    const set = makeSetters()
    const showPopup = vi.fn()

    checkMatch({
      c1: { id: 1, value: 'A', isFlipped: false, isMatched: false },
      c2: { id: 2, value: 'A', isFlipped: false, isMatched: false },
      c1WasSeen: false,
      c2WasSeen: false,
      difficulty: 'easy',
      showPopup,
      ...set,
    })

    // difficulty easy: bonus=10 + lucky=5 => +10+5
    expect(showPopup).toHaveBeenCalledWith('+10+5')
  })

  test('При несовпадении карты становятся isFlipped', () => {
    const set = makeSetters()
    const showPopup = vi.fn()

    checkMatch({
      c1: { id: 1, value: 'A', isFlipped: true, isMatched: false },
      c2: { id: 2, value: 'B', isFlipped: true, isMatched: false },
      c1WasSeen: true,
      c2WasSeen: true,
      difficulty: 'easy',
      showPopup,
      ...set,
    })

    expect(set.setResult).toHaveBeenCalledWith('idle')
    expect(set.setCards).toHaveBeenCalled()
  })

  test('Win Condition делает result=win когда все карты собранны', () => {
    const set = {
      ...makeSetters(),
      setCards: vi.fn(fn =>
        fn([
          { id: 1, value: 'A', isMatched: true },
          { id: 2, value: 'B', isMatched: true },
        ]),
      ),
    }

    const showPopup = vi.fn()

    checkMatch({
      c1: { id: 1, value: 'A', isFlipped: false, isMatched: true },
      c2: { id: 2, value: 'B', isFlipped: false, isMatched: true },
      c1WasSeen: true,
      c2WasSeen: true,
      difficulty: 'easy',
      showPopup,
      ...set,
    })

    expect(set.setResult).toHaveBeenCalledWith('win')
  })

  test('Несовпадение с увиденными картами применяет пенальти', () => {
    const set = makeSetters()
    const showPopup = vi.fn()

    checkMatch({
      c1: { id: 1, value: 'A', isFlipped: true, isMatched: false },
      c2: { id: 2, value: 'B', isFlipped: true, isMatched: false },
      c1WasSeen: true,
      c2WasSeen: false,
      difficulty: 'easy',
      showPopup,
      ...set,
    })

    expect(showPopup).toHaveBeenCalledWith(expect.stringContaining('-'))
    expect(set.setScore).toHaveBeenCalled()
  })

  test('Несовпадение без пенальти не показывает popup', () => {
    const set = makeSetters()
    const showPopup = vi.fn()

    checkMatch({
      c1: { id: 1, value: 'A', isFlipped: false, isMatched: false },
      c2: { id: 2, value: 'B', isFlipped: false, isMatched: false },
      c1WasSeen: false,
      c2WasSeen: false,
      difficulty: 'easy',
      showPopup,
      ...set,
    })

    expect(showPopup).not.toHaveBeenCalled()
  })

  test('Переворачивает карточки после их открытия', () => {
    const set = makeSetters()
    const showPopup = vi.fn()

    checkMatch({
      c1: { id: 1, value: 'A', isFlipped: false, isMatched: false },
      c2: { id: 2, value: 'B', isFlipped: false, isMatched: false },
      c1WasSeen: false,
      c2WasSeen: false,
      difficulty: 'easy',
      showPopup,
      ...set,
    })

    expect(set.setFirstCard).toHaveBeenCalledWith(null)
    expect(set.setDisabled).toHaveBeenCalledWith(false)
  })
})
