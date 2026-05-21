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
