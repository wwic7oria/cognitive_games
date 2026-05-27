export const generateSequence = (length: number, size: number): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * (size * size)))
}
