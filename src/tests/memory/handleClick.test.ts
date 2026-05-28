import { handleClick } from '@/games/memory/engine'
import { vi } from 'vitest'

vi.useFakeTimers()

const baseCard = {
  id: 1,
  value: 'A',
  isFlipped: false,
  isMatched: false,
}

const makeState = () => ({
  card: baseCard,
  disabled: false,
  seenCards: [],
  firstCard: null,
  firstCardWasSeen: false,
  difficulty: 'easy' as const,
  cards: [baseCard],
  showScorePopup: vi.fn(),

  setSeenCards: vi.fn(),
  setCards: vi.fn(),
  setFirstCard: vi.fn(),
  setFirstCardWasSeen: vi.fn(),
  setDisabled: vi.fn(),
  setScore: vi.fn(),
  setResult: vi.fn(),
})

describe('handleClick', () => {
  test('Игнор клика при disabled', () => {
    const state = makeState()

    handleClick({
      ...state,
      disabled: true,
    })

    expect(state.setCards).not.toHaveBeenCalled()
  })

  test('Открыть первую карту', () => {
    const state = makeState()

    handleClick(state)

    expect(state.setFirstCard).toHaveBeenCalled()
  })

  test('Вызов checkMatch после второго клика', () => {
    const state = makeState()

    handleClick(state)

    handleClick({
      ...state,
      firstCard: baseCard,
    })

    vi.runAllTimers()

    expect(state.setDisabled).toHaveBeenCalled()
  })
})
