export const generateSequence = (length: number, size: number): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * (size * size)))
}

/* =========================
   ЛОГИКА ПОКАЗА  ПОСЛЕДОВАТЕЛЬНОСТИ
========================= */
export const playSequence = (
  seq: number[],
  speed: { show: number; gap: number },
  onShow: (id: number) => void,
  onHide: () => void,
  onDone: () => void,
  setTimeoutRef: (t: number) => void,
) => {
  let i = 0

  const next = () => {
    if (i >= seq.length) {
      onHide()
      onDone()
      return
    }

    onShow(seq[i])

    setTimeoutRef(
      window.setTimeout(() => {
        onHide()

        setTimeoutRef(
          window.setTimeout(() => {
            i++
            next()
          }, speed.gap),
        )
      }, speed.show),
    )
  }

  next()
}
