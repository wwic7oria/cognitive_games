import type { AttentionItem, AnswerOption, Difficulty } from './'
import { SHAPES, COLORS, SHAPE_EMOJI, COLOR_EMOJI } from './constants'

function randomShape() {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)]
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

/* =========================
  ПОСТРОЕНИЕ ВОПРОСОВ
========================= */
export function generateRound(items: AttentionItem[], diff: Difficulty) {
  const shape = randomShape()
  const color = randomColor()

  if (diff === 'easy') {
    const count = items.filter(i => i.color === color).length

    return {
      question: `Сколько ${COLOR_EMOJI[color]}?`,
      options: [0, 1, 2, 3].map(n => ({
        label: String(n),
        value: n === count,
      })) satisfies AnswerOption[],
    }
  }

  if (diff === 'medium') {
    const count = items.filter(i => i.shape === shape).length

    return {
      question: `Был ли ${SHAPE_EMOJI[shape]}?`,
      options: [
        { label: 'Да', value: count > 0 },
        { label: 'Нет', value: count === 0 },
      ] satisfies AnswerOption[],
    }
  }

  const count = items.filter(i => i.shape === shape).length

  return {
    question: `Сколько ${SHAPE_EMOJI[shape]}?`,
    options: [0, 1, 2, 3].map(n => ({
      label: String(n),
      value: n === count,
    })) satisfies AnswerOption[],
  }
}
