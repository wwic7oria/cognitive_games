import { describe, test, expect, vi } from 'vitest'
import { checkClick } from '@/games/sequence/engine'

const makeSetters = () => ({
  setUserInput: vi.fn(),
  setScore: vi.fn(fn => fn(0)),
  setBestScore: vi.fn(fn => fn(0)),
  setRoundCount: vi.fn(fn => fn(0)),
  setResult: vi.fn(),
  setGameState: vi.fn(),

  setLastClicked: vi.fn(),
  setWrongClick: vi.fn(),
  setCurrentLength: vi.fn(),
})

describe('checkClick', () => {
  test('Игнорирует клик если gameState не input', () => {
    const set = makeSetters()

    checkClick({
      id: 1,
      sequence: [1, 2],
      userInput: [],
      gameState: 'idle',

      score: 0,
      baseScore: 10,
      penalty: 5,
      currentLength: 3,
      maxLength: 5,

      showPopup: vi.fn(),

      ...set,
    })

    expect(set.setUserInput).not.toHaveBeenCalled()
  })

  test('Неправильный клик => lose + штраф + reset input', () => {
    const set = makeSetters()
    const showPopup = vi.fn()

    checkClick({
      id: 9,
      sequence: [1, 2],
      userInput: [1],
      gameState: 'input',

      score: 10,
      baseScore: 10,
      penalty: 5,
      currentLength: 3,
      maxLength: 5,

      showPopup,

      ...set,
    })

    expect(set.setResult).toHaveBeenCalledWith('lose')
    expect(set.setGameState).toHaveBeenCalledWith('idle')
    expect(set.setUserInput).toHaveBeenCalledWith([])
    expect(set.setWrongClick).toHaveBeenCalledWith(9)

    expect(set.setScore).toHaveBeenCalled()
    expect(showPopup).toHaveBeenCalledWith(expect.stringContaining('-'))
  })

  test('Правильный последний клик => win', () => {
    const set = makeSetters()
    const showPopup = vi.fn()

    checkClick({
      id: 2,
      sequence: [1, 2],
      userInput: [1],
      gameState: 'input',

      score: 0,
      baseScore: 10,
      penalty: 5,
      currentLength: 3,
      maxLength: 5,

      showPopup,

      ...set,
    })

    expect(set.setResult).toHaveBeenCalledWith('win')
    expect(set.setGameState).toHaveBeenCalledWith('idle')
    expect(set.setRoundCount).toHaveBeenCalled()
  })

  test('Правильный НЕ последний клик => не завершается игра', () => {
    const set = makeSetters()
    const showPopup = vi.fn()

    checkClick({
      id: 1,
      sequence: [1, 2],
      userInput: [],
      gameState: 'input',

      score: 0,
      baseScore: 10,
      penalty: 5,
      currentLength: 3,
      maxLength: 5,

      showPopup,

      ...set,
    })

    expect(set.setResult).not.toHaveBeenCalled()
    expect(set.setGameState).not.toHaveBeenCalledWith('win')
  })

  test('Увеличивает длину последовательности при победе (если не max)', () => {
    const set = makeSetters()
    const showPopup = vi.fn()

    checkClick({
      id: 2,
      sequence: [1, 2],
      userInput: [1],
      gameState: 'input',

      score: 0,
      baseScore: 10,
      penalty: 5,
      currentLength: 3,
      maxLength: 5,

      showPopup,

      ...set,
    })

    expect(set.setCurrentLength).toHaveBeenCalled()
  })
})
