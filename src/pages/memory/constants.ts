export const EMOJIS = [
  '🍎',
  '🚗',
  '🐶',
  '⭐',
  '🔥',
  '⚽',
  '🎵',
  '🌈',
  '🍕',
  '🚀',
  '🐱',
  '🌙',
  '⚡',
  '🍩',
  '🎮',
  '📚',
  '🧠',
  '🎯',
] as const

export const SIZE_MAP = {
  easy: 4,
  medium: 6,
} as const

export type Difficulty = keyof typeof SIZE_MAP
