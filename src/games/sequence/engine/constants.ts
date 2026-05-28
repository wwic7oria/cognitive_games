export const SPEED_MAP = {
  easy: { show: 700, gap: 350 },
  medium: { show: 500, gap: 250 },
  hard: { show: 300, gap: 150 },
} as const

export const SIZE_MAP = {
  easy: 2,
  medium: 3,
  hard: 4,
} as const

export const MAX_LENGTH_MAP = {
  easy: 6,
  medium: 7,
  hard: 8,
} as const

export const baseRules = [
  {
    text: 'На экране будут подсвечиваться кнопки. Запомните последовательность и повторите её, кликая по кнопкам в правильном порядке.',
  },
] as const

export const rulesByDifficulty = {
  easy: [
    {
      value: '+10',
      color: 'rule-positive',
      text: 'очков за правильно повторенную последовательность',
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
      text: 'очков за правильно повторенную последовательность',
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
      text: 'очков за правильно повторенную последовательность',
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
