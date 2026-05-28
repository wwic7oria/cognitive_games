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

export const baseRules = [
  {
    text: 'На поле находятся перевернутые карточки. Необходимо найти все пары.',
  },
] as const

export const rulesByDifficulty = {
  easy: [
    {
      value: '+10',
      color: 'rule-positive',
      text: 'очков за найденную пару',
    },
    {
      value: '+5',
      color: 'rule-positive',
      text: 'бонус, если обе карточки не были открыты ранее',
    },
    {
      value: '-1',
      color: 'rule-negative',
      text: 'за повторный просмотр карточки',
    },
  ],

  medium: [
    {
      value: '+15',
      color: 'rule-positive',
      text: 'очков за найденную пару',
    },
    {
      value: '+5',
      color: 'rule-positive',
      text: 'бонус, если обе карточки не были открыты ранее',
    },
    {
      value: '-1',
      color: 'rule-negative',
      text: 'за повторный просмотр карточки',
    },
  ],
} as const

// В таком виде удобнее
export const getBonus = (difficulty: 'easy' | 'medium') =>
  difficulty === 'easy' ? 10 : 15

export const getPenalty = (c1Seen: boolean, c2Seen: boolean) =>
  (c1Seen ? 1 : 0) + (c2Seen ? 1 : 0)

export const isLuckyPair = (c1Seen: boolean, c2Seen: boolean) =>
  !c1Seen && !c2Seen
