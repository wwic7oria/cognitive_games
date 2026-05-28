export type { Card } from './types'
export { generateCards } from './utils'
export {
  SIZE_MAP,
  baseRules,
  rulesByDifficulty,
  getBonus,
  getPenalty,
  isLuckyPair,
} from './constants'

import { SIZE_MAP } from './constants'
export type Difficulty = keyof typeof SIZE_MAP
export { checkMatch } from './checkMatch'
export { handleClick } from './handleClick'
