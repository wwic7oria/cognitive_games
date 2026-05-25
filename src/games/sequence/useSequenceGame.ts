import { useEffect, useRef, useState } from 'react'
import type { Difficulty, GameState } from './types'
import { SIZE_MAP, MAX_LENGTH_MAP } from './constants'
import { BASE_SCORE_MAP, PENALTY_MAP } from './scores'
import { generateSequence } from './utils'
import { SPEED_MAP } from './constants'

export function useSequenceGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')

  const [score, setScore] = useState(0)
  const [scorePopup, setScorePopup] = useState('')

  const [currentLength, setCurrentLength] = useState(3)

  const [sequence, setSequence] = useState<number[]>([])
  const [userInput, setUserInput] = useState<number[]>([])

  const [activeCell, setActiveCell] = useState<number | null>(null)
  const [lastClicked, setLastClicked] = useState<number | null>(null)
  const [wrongClick, setWrongClick] = useState<number | null>(null)

  const [gameState, setGameState] = useState<GameState>('idle')
  const [result, setResult] = useState<null | 'win' | 'lose'>(null)

  // SESSION STATS
  const [roundCount, setRoundCount] = useState(0)
  const [bestScore, setBestScore] = useState(0)

  const timeoutRef = useRef<number | null>(null)

  const size = SIZE_MAP[difficulty]
  const maxLength = MAX_LENGTH_MAP[difficulty]
  const baseScore = BASE_SCORE_MAP[difficulty]
  const penalty = PENALTY_MAP[difficulty]

  const speed = SPEED_MAP[difficulty]

  const cells = Array.from({ length: size * size }, (_, i) => i)

  const showPopup = (text: string) => {
    setScorePopup(text)
    setTimeout(() => setScorePopup(''), 1000)
  }

  const playSequence = (seq: number[]) => {
    setGameState('showing')

    let i = 0

    const playNext = () => {
      if (i >= seq.length) {
        setActiveCell(null)
        setGameState('input')
        return
      }

      setActiveCell(seq[i])

      timeoutRef.current = window.setTimeout(() => {
        setActiveCell(null)

        timeoutRef.current = window.setTimeout(() => {
          i++
          playNext()
        }, speed.gap)
      }, speed.show)
    }

    playNext()
  }

  const startGame = () => {
    const seq = generateSequence(currentLength, size)

    setSequence(seq)
    setUserInput([])
    setResult(null)

    // Задержка перед показом
    setGameState('showing')
    timeoutRef.current = window.setTimeout(() => {
      playSequence(seq)
    }, 1000)
  }

  const handleClick = (id: number) => {
    if (gameState !== 'input') return

    const newInput = [...userInput, id]
    setUserInput(newInput)

    const index = newInput.length - 1
    const isCorrect = newInput[index] === sequence[index]

    // lastClicked до проверки не трогается

    if (!isCorrect) {
      setWrongClick(id)
      setTimeout(() => setWrongClick(null), 300)

      const newScore = score - penalty
      setScore(newScore)
      showPopup(`-${penalty}`)

      setRoundCount(prev => prev + 1)

      setGameState('idle')
      setUserInput([])
      setResult('lose')
      return
    }

    setLastClicked(id)
    setTimeout(() => setLastClicked(null), 200)

    if (newInput.length === sequence.length) {
      const newScore = score + baseScore
      setScore(newScore)
      showPopup(`+${baseScore}`)

      setBestScore(prev => Math.max(prev, newScore))
      setRoundCount(prev => prev + 1)

      setResult('win')
      setGameState('idle')

      if (currentLength < maxLength) {
        setCurrentLength(prev => prev + 1)
      }
    }
  }

  useEffect(() => {
    setGameState('idle')
    setSequence([])
    setUserInput([])
    setResult(null)
    setScore(0)
    setCurrentLength(3)
    setRoundCount(0)
    setBestScore(0)
  }, [difficulty])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return {
    difficulty,
    setDifficulty,
    score,
    scorePopup,
    size,
    maxLength,
    currentLength,
    cells,
    activeCell,
    lastClicked,
    wrongClick,
    gameState,
    result,
    roundCount,
    bestScore,
    startGame,
    handleClick,
  }
}
