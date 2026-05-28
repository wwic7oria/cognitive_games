import { useEffect, useRef, useState } from 'react'

import {
  SPEED_MAP,
  SIZE_MAP,
  MAX_LENGTH_MAP,
  BASE_SCORE_MAP,
  PENALTY_MAP,
  generateSequence,
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

  const timeoutRef = useRef<number | null>(null)

  const size = SIZE_MAP[difficulty]
  const maxLength = MAX_LENGTH_MAP[difficulty]
  const baseScore = BASE_SCORE_MAP[difficulty]
  const penalty = PENALTY_MAP[difficulty]

  const speed = SPEED_MAP[difficulty]

  // Массив клеток для рендера
  const cells = Array.from({ length: size * size }, (_, i) => i)

  const showPopup = (text: string) => {
    setScorePopup(text)
    setTimeout(() => setScorePopup(''), 1000)
  }

  /* =========================
    ПОКАЗ ПОСЛЕДОВАТЕЛЬНОСТИ
========================= */
  const playSequence = (seq: number[]) => {
    // Блок ввода
    setGameState('showing')

    let i = 0

    const playNext = () => {
      // Последовательность закончилась
      if (i >= seq.length) {
        setActiveCell(null)
        setGameState('input')
        return
      }

      // Подсветка клетки
      setActiveCell(seq[i])

      timeoutRef.current = window.setTimeout(() => {
        setActiveCell(null)
        // Пауза между подсветкой
        timeoutRef.current = window.setTimeout(() => {
          i++
          playNext()
        }, speed.gap)
      }, speed.show)
    }

    playNext()
  }

  /* =========================
    СТАРТ РАУНДА
  ========================= */
  const startGame = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

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

  /* =========================
    ОБРАБОТКА КЛИКА
  ========================= */
  const handleClick = (id: number) => {
    // Клики только во время ввода (input)
    if (gameState !== 'input') return
    // Добавляется клик
    const newInput = [...userInput, id]
    setUserInput(newInput)

    const index = newInput.length - 1
    const isCorrect = newInput[index] === sequence[index]

    // lastClicked до проверки не трогается

    /* =========================
      НЕПРАВИЛЬНО
    ========================= */
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

    /* =========================
      ПРАВИЛЬНО
    ========================= */

    setLastClicked(id)
    setTimeout(() => setLastClicked(null), 200)

    /* =========================
      ПОСЛЕДОВАТЕЛЬНОСТЬ ПОВТОРЕНА ПРАВИЛЬНО
    ========================= */
    if (newInput.length === sequence.length) {
      const newScore = score + baseScore
      setScore(newScore)
      showPopup(`+${baseScore}`)

      setBestScore(prev => Math.max(prev, newScore))
      setRoundCount(prev => prev + 1)

      setResult('win')
      setGameState('idle')

      // Длина последовательности увеличивается
      if (currentLength < maxLength) {
        setCurrentLength(prev => prev + 1)
      }
    }
  }

  /* =========================
    РЕСЕТ ИГРЫ
    Вызывается при смене сложности
  ========================= */
  const reset = () => {
    // Убираем таймеры, игровое состояние сбрасывается
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setGameState('idle')
    setSequence([])
    setUserInput([])
    setResult(null)
    setScore(0)
    setCurrentLength(3)
    setRoundCount(0)
    setBestScore(0)
  }

  /* =========================
    СБРОС ПРИ СМЕНЕ СЛОЖНОСТИ
  ========================= */
  const changeDifficulty = (diff: Difficulty) => {
    reset()
    setDifficulty(diff)
  }

  /* =========================
    ОЧИСТКА ПРИ РАЗМОНТИРОВАНИИ
  ========================= */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
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
