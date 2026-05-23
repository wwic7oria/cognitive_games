import { useRef, useState } from 'react'
import type { Difficulty } from './constants'
import {
  SIZE_MAP,
  SHOW_TIME,
  SHAPES,
  COLORS,
  SHAPE_EMOJI,
  COLOR_EMOJI,
} from './constants'
import type { AttentionItem, Phase, AnswerOption } from './types'
import { generateItems } from './utils'
import { BASE_SCORE_MAP, PENALTY_MAP } from './scores'

export function useAttentionGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')

  const [items, setItems] = useState<AttentionItem[]>([])
  const [phase, setPhase] = useState<Phase>('show')

  const [question, setQuestion] = useState<string | null>(null)
  const [options, setOptions] = useState<AnswerOption[]>([])

  const [score, setScore] = useState(0)
  const [popup, setPopup] = useState<string | null>(null)

  const [isCorrect, setIsCorrect] = useState(false)

  // SESSION STATS
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
    setPhase('show')
    setPopup(null)

    setScore(0)
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
    setPhase('show')

    timeoutRef.current = window.setTimeout(() => {
      buildQuestion(newItems, difficulty)
      setPhase('question')
    }, SHOW_TIME[difficulty])
  }

  const submitAnswer = (value: boolean) => {
    if (phase !== 'question') return

    const base = BASE_SCORE_MAP[difficulty]
    const penalty = PENALTY_MAP[difficulty]

    let delta = 0

    if (value) {
      delta = base
      showPopup(`+${base}`)
    } else {
      delta = -penalty
      showPopup(`-${penalty}`)
    }

    setScore(prev => {
      const newScore = prev + delta

      setBestScore(b => Math.max(b, newScore))

      return newScore
    })

    setRoundCount(prev => prev + 1)

    setItems([])
    setQuestion(null)
    setOptions([])
    setPhase('show')

    setIsCorrect(value)
  }

  return {
    difficulty,
    changeDifficulty,

    items,
    phase,
    question,
    options,

    score,
    popup,
    isCorrect,

    roundCount,
    bestScore,

    startRound,
    submitAnswer,
  }
}
