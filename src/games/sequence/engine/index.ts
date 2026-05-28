export {
  SPEED_MAP,
  SIZE_MAP,
  MAX_LENGTH_MAP,
  baseRules,
  rulesByDifficulty,
  BASE_SCORE_MAP,
  PENALTY_MAP,
} from './constants'
export { generateSequence, playSequence } from './utils'

export { checkClick } from './checkClick'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type GameState = 'idle' | 'showing' | 'input' | 'paused'
