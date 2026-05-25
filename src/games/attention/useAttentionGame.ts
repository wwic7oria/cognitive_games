import { useEffect, useRef, useState } from 'react'
import type { Difficulty } from './constants'
import {
  SIZE_MAP,
  SHOW_TIME,
  SHAPES,
  COLORS,
  SHAPE_EMOJI,
  COLOR_EMOJI,
} from './constants'
import type { AttentionItem, AnswerOption } from './types'
import { generateItems } from './utils'
import { BASE_SCORE_MAP, PENALTY_MAP } from './scores'

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

  const timeoutRef = useRef<number | null>(null)

  const reset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

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

  const changeDifficulty = (diff: Difficulty) => {
    reset()
    setDifficulty(diff)
  }

  const showPopup = (t: string) => {
    setPopup(t)
    setTimeout(() => setPopup(null), 1000)
  }

  const buildQuestion = (data: AttentionItem[], diff: Difficulty) => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]

    if (diff === 'easy') {
      const count = data.filter(i => i.color === color).length

      setQuestion(`Сколько ${COLOR_EMOJI[color]}?`)
      setOptions(
        [0, 1, 2, 3].map(n => ({
          label: String(n),
          value: n === count,
        })),
      )
    }

    if (diff === 'medium') {
      const count = data.filter(i => i.shape === shape).length

      setQuestion(`Был ли ${SHAPE_EMOJI[shape]}?`)
      setOptions([
        { label: 'Да', value: count > 0 },
        { label: 'Нет', value: count === 0 },
      ])
    }

    if (diff === 'hard') {
      const count = data.filter(i => i.shape === shape).length

      setQuestion(`Сколько ${SHAPE_EMOJI[shape]}?`)
      setOptions(
        [0, 1, 2, 3].map(n => ({
          label: String(n),
          value: n === count,
        })),
      )
    }
  }

  const startRound = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const newItems = generateItems(SIZE_MAP[difficulty])

    setItems(newItems)
    setGameState('showing')
    setResult(null)

    timeoutRef.current = window.setTimeout(() => {
      buildQuestion(newItems, difficulty)
      setGameState('question')
    }, SHOW_TIME[difficulty])
  }

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

    // Результат - правильно или ошибка
    setResult(value ? 'win' : 'lose')
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
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
