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
  }

  const changeDifficulty = (d: Difficulty) => {
    reset()
    setDifficulty(d)
  }

  const showPopup = (t: string) => {
    setPopup(t)
    setTimeout(() => setPopup(''), 10)
  }

  const buildQuestion = (
    data: AttentionItem[],
    currentDifficulty: Difficulty,
  ) => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]

    if (currentDifficulty === 'easy') {
      const count = data.filter(i => i.color === color).length

      setQuestion(`Сколько ${COLOR_EMOJI[color]}?`)
      setOptions(
        [0, 1, 2, 3].map(n => ({
          label: String(n),
          value: n === count,
        })),
      )
    }

    if (currentDifficulty === 'medium') {
      const count = data.filter(i => i.shape === shape).length

      setQuestion(`Был ли ${SHAPE_EMOJI[shape]}?`)
      setOptions([
        { label: 'Да', value: count > 0 },
        { label: 'Нет', value: count === 0 },
      ])
    }

    if (currentDifficulty === 'hard') {
      const count = data.filter(i => i.shape === shape).length

      setQuestion(`Сколько ${SHAPE_EMOJI[shape]}?`)
      setOptions(
        [0, 1, 2, 3, 4].map(n => ({
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

    const currentDifficulty = difficulty
    const currentSize = SIZE_MAP[currentDifficulty]

    const newItems = generateItems(currentSize)

    setItems(newItems)
    setPhase('show')

    timeoutRef.current = window.setTimeout(() => {
      buildQuestion(newItems, currentDifficulty)
      setPhase('question')
    }, SHOW_TIME[currentDifficulty])
  }

  const submitAnswer = (value: boolean) => {
    if (phase !== 'question') return

    const base = BASE_SCORE_MAP[difficulty]
    const penalty = PENALTY_MAP[difficulty]

    if (value) {
      setScore(s => s + base)
      showPopup(`+${base}`)
    } else {
      setScore(s => s - penalty)
      showPopup(`-${penalty}`)
    }

    setPhase('result')

    setItems([])
    setQuestion(null)
    setOptions([])

    setTimeout(() => {
      setPhase('show')
    }, 0)
  }

  return {
    reset,
    difficulty,
    changeDifficulty,
    items,
    phase,
    question,
    options,
    score,
    popup,
    startRound,
    submitAnswer,
  }
}
