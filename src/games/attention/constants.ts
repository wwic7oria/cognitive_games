export type Difficulty = 'easy' | 'medium' | 'hard'

export type Shape = 'heart' | 'star' | 'rocket' | 'bolt' | 'fire' | 'cloud'
export type Color =
  | 'red'
  | 'white'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'black'

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
  'white',
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
  white: '⚪',
  green: '🟢',
  blue: '🔵',
  yellow: '🟡',
  purple: '🟣',
  black: '⚫',
}
