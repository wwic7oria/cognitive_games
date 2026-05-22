export type Difficulty = 'easy' | 'medium' | 'hard'

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
