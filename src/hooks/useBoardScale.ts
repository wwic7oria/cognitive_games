import { useEffect, useState } from 'react'

export function useBoardScale(boardWidth: number) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      const padding = 32
      const screenWidth = window.innerWidth - padding

      const newScale = Math.min(screenWidth / boardWidth, 1)

      setScale(newScale)
    }

    update()
    window.addEventListener('resize', update)

    return () => window.removeEventListener('resize', update)
  }, [boardWidth])

  return scale
}
