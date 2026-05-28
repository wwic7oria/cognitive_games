import { useEffect, useRef, useState } from 'react'
import {
  SIZE_MAP,
  SHOW_TIME,
  BASE_SCORE_MAP,
  PENALTY_MAP,
  generateItems,
  generateRound,
  type Difficulty,
  type AttentionItem,
  type AnswerOption,
} from '../engine'

type GameState = 'idle' | 'showing' | 'question'

export function useAttentionGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')

  const [items, setItems] = useState<AttentionItem[]>([])
  const [question, setQuestion] = useState<string | null>(null)
  const [options, setOptions] = useState<AnswerOption[]>([])

  const [score, setScore] = useState(0)
  const [popup, setPopup] = useState<string | null>(null)

  const [gameState, setGameState] = useState<GameState>('idle')
  const [result, setResult] = useState<null | 'win' | 'lose'>(null)

  const [roundCount, setRoundCount] = useState(0)
  const [bestScore, setBestScore] = useState(0)

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
    РЕСЕТ ИГРЫ
  ========================= */
  const reset = () => {
    clearAllTimers()

    setItems([])
    setQuestion(null)
    setOptions([])
    setGameState('idle')
    setResult(null)

    setScore(0)
    setPopup(null)
    setRoundCount(0)
    setBestScore(0)
  }

  /* =========================
    СМЕНА СЛОЖНОСТИ
  ========================= */
  const changeDifficulty = (diff: Difficulty) => {
    reset()
    setDifficulty(diff)
  }

  const showPopup = (t: string) => {
    setPopup(t)
    setTimeout(() => setPopup(null), 1000)
  }

  /* =========================
    СТАРТ РАУНДА
  ========================= */
  const startRound = () => {
    clearAllTimers()

    setResult(null)
    setGameState('showing')

    addTimer(
      window.setTimeout(() => {
        const newItems = generateItems(SIZE_MAP[difficulty])
        setItems(newItems)

        addTimer(
          window.setTimeout(() => {
            const round = generateRound(newItems, difficulty)

            setQuestion(round.question)
            setOptions(round.options)

            setGameState('question')
          }, SHOW_TIME[difficulty]),
        )
      }, 1000),
    )
  }

  /* =========================
    ОТВЕТ
  ========================= */
  const submitAnswer = (value: boolean) => {
    if (gameState !== 'question') return

    const base = BASE_SCORE_MAP[difficulty]
    const penalty = PENALTY_MAP[difficulty]

    const delta = value ? base : -penalty

    showPopup(value ? `+${base}` : `-${penalty}`)

    setScore(prev => {
      const next = prev + delta
      setBestScore(b => Math.max(b, next))
      return next
    })

    setRoundCount(prev => prev + 1)

    setItems([])
    setQuestion(null)
    setOptions([])
    setGameState('idle')

    setResult(value ? 'win' : 'lose')
  }

  /* =========================
    CLEANUP
  ========================= */
  useEffect(() => {
    return () => clearAllTimers()
  }, [])

  return {
    difficulty,
    changeDifficulty,

    items,
    question,
    options,

    score,
    popup,

    gameState,
    result,

    roundCount,
    bestScore,

    startRound,
    submitAnswer,
  }
}
