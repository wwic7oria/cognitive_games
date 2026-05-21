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
