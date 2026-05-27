export const getBonus = (difficulty: 'easy' | 'medium') =>
  difficulty === 'easy' ? 10 : 15

export const getPenalty = (c1Seen: boolean, c2Seen: boolean) =>
  (c1Seen ? 1 : 0) + (c2Seen ? 1 : 0)

export const isLuckyPair = (c1Seen: boolean, c2Seen: boolean) =>
  !c1Seen && !c2Seen
