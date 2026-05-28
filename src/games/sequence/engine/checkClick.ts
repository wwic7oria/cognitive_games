import type { GameState } from '.'

type Params = {
  id: number
  sequence: number[]
  userInput: number[]
  gameState: GameState

  score: number
  baseScore: number
  penalty: number
  currentLength: number
  maxLength: number

  setUserInput: (v: number[]) => void
  setScore: (fn: (v: number) => number) => void
  setBestScore: (fn: (v: number) => number) => void
  setRoundCount: (fn: (v: number) => number) => void
  setResult: (v: 'win' | 'lose') => void
  setGameState: (v: GameState) => void

  showPopup: (t: string) => void
  setLastClicked: (v: number | null) => void
  setWrongClick: (v: number | null) => void
  setCurrentLength: (fn: (v: number) => number) => void
}

export function checkClick(p: Params) {
  if (p.gameState !== 'input') return

  const newInput = [...p.userInput, p.id]
  p.setUserInput(newInput)

  const index = newInput.length - 1
  const isCorrect = newInput[index] === p.sequence[index]

  /* =========================
    НЕПРАВИЛЬНО
  ========================= */
  if (!isCorrect) {
    p.setWrongClick(p.id)
    setTimeout(() => p.setWrongClick(null), 300)

    p.setScore(prev => {
      const next = prev - p.penalty
      p.showPopup(`-${p.penalty}`)
      return next
    })

    p.setRoundCount(prev => prev + 1)

    p.setGameState('idle')
    p.setUserInput([])
    p.setResult('lose')
    return
  }

  /* =========================
    ПРАВИЛЬНО
  ========================= */

  p.setLastClicked(p.id)
  setTimeout(() => p.setLastClicked(null), 200)

  /* =========================
    ПОСЛЕДОВАТЕЛЬНОСТЬ ПОВТОРЕНА ПРАВИЛЬНО
  ========================= */
  if (newInput.length === p.sequence.length) {
    p.setScore(prev => {
      const next = prev + p.baseScore
      p.showPopup(`+${p.baseScore}`)
      p.setBestScore(b => Math.max(b, next))
      return next
    })

    p.setRoundCount(prev => prev + 1)

    p.setResult('win')
    p.setGameState('idle')

    if (p.currentLength < p.maxLength) {
      p.setCurrentLength(prev => prev + 1)
    }
  }
}
