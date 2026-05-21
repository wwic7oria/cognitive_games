import type { Shape, Color } from './constants'

export type AttentionItem = {
  shape: Shape
  color: Color
}

export type Item = AttentionItem

export type Phase = 'show' | 'question' | 'result'

export type AnswerOption = {
  label: string
  value: boolean
}
