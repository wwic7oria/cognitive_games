import { useEffect, useRef, useState } from 'react'

import {
  SPEED_MAP,
  SIZE_MAP,
  MAX_LENGTH_MAP,
  BASE_SCORE_MAP,
  PENALTY_MAP,
  generateSequence,
  checkClick,
  type Difficulty,
  type GameState,
} from '../engine'

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

  const [roundCount, setRoundCount] = useState(0)
  const [bestScore, setBestScore] = useState(0)

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

  // ID всех таймеров
  const timersRef = useRef<number[]>([])

  // Сохраняет id таймеров
  const addTimer = (t: number) => {
    timersRef.current.push(t)
  }

  // Очистка таймеров
  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  /* =========================
    ПОКАЗ ПОСЛЕДОВАТЕЛЬНОСТИ
  ========================= */
  const playSequenceHandler = (seq: number[]) => {
    setGameState('showing')

    let i = 0

    const next = () => {
      if (i >= seq.length) {
        setActiveCell(null)
        setGameState('input')
        return
      }

      setActiveCell(seq[i])

      addTimer(
        window.setTimeout(() => {
          setActiveCell(null)

          addTimer(
            window.setTimeout(() => {
              i++
              next()
            }, speed.gap),
          )
        }, speed.show),
      )
    }

    next()
  }

  /* =========================
    СТАРТ РАУНДА
  ========================= */
  const startGame = () => {
    clearAllTimers()

    const seq = generateSequence(currentLength, size)

    setSequence(seq)
    setUserInput([])
    setResult(null)

    setGameState('showing')

    addTimer(
      window.setTimeout(() => {
        playSequenceHandler(seq)
      }, 1000),
    )
  }

  /* =========================
    ОБРАБОТКА КЛИКА
  ========================= */
  const handleClick = (id: number) => {
    checkClick({
      id,
      sequence,
      userInput,
      gameState,

      score,
      baseScore,
      penalty,
      currentLength,
      maxLength,

      setUserInput,
      setScore,
      setBestScore,
      setRoundCount,
      setResult,
      setGameState,

      showPopup,
      setLastClicked,
      setWrongClick,
      setCurrentLength,
    })
  }

  /* =========================
    РЕСЕТ
  ========================= */
  const reset = () => {
    clearAllTimers()

    setGameState('idle')
    setSequence([])
    setUserInput([])
    setResult(null)
    setScore(0)
    setCurrentLength(3)
    setRoundCount(0)
    setBestScore(0)
    setActiveCell(null)
  }

  const changeDifficulty = (diff: Difficulty) => {
    reset()
    setDifficulty(diff)
  }

  useEffect(() => {
    return () => clearAllTimers()
  }, [])

  return {
    difficulty,
    changeDifficulty,
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
