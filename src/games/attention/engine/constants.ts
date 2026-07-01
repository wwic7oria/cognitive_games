export type Difficulty = 'easy' | 'medium' | 'hard'

export type Shape = 'heart' | 'star' | 'rocket' | 'bolt' | 'fire' | 'cloud'
export type Color = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'black'

export const SIZE_MAP: Record<Difficulty, number> = {
  easy: 6,
  medium: 8,
  hard: 8,
}

export const SHOW_TIME: Record<Difficulty, number> = {
  easy: 2000,
  medium: 2000,
  hard: 3000,
}

export const SHAPES: Shape[] = [
  'heart',
  'star',
  'rocket',
  'bolt',
  'fire',
  'cloud',
]
export const COLORS: Color[] = [
  'red',
  'green',
  'blue',
  'yellow',
  'purple',
  'black',
]

export const SHAPE_EMOJI: Record<Shape, string> = {
  heart: '❤️',
  star: '⭐',
  rocket: '🚀',
  bolt: '⚡',
  fire: '🔥',
  cloud: '☁️',
}

export const COLOR_EMOJI: Record<Color, string> = {
  red: '🔴',
  green: '🟢',
  blue: '🔵',
  yellow: '🟡',
  purple: '🟣',
  black: '⚫',
}

export const baseRules = [
  {
    text: 'На экране будут появляться эмодзи. Запомните их и ответьте на вопрос.',
  },
] as const

export const rulesByDifficulty = {
  easy: [
    {
      value: '+10',
      color: 'rule-positive',
      text: 'очков за правильный ответ',
    },
    {
      value: '-5',
      color: 'rule-negative',
      text: 'за ошибку',
    },
  ],

  medium: [
    {
      value: '+15',
      color: 'rule-positive',
      text: 'очков за правильный ответ',
    },
    {
      value: '-8',
      color: 'rule-negative',
      text: 'за ошибку',
    },
  ],

  hard: [
    {
      value: '+20',
      color: 'rule-positive',
      text: 'очков за правильный ответ',
    },
    {
      value: '-10',
      color: 'rule-negative',
      text: 'за ошибку',
    },
  ],
} as const

export const BASE_SCORE_MAP = {
  easy: 10,
  medium: 15,
  hard: 20,
} as const

export const PENALTY_MAP = {
  easy: 5,
  medium: 8,
  hard: 10,
} as const
