import { getBonus, getPenalty, isLuckyPair } from './'
import type { Card, Difficulty } from './'

type CheckMatchParams = {
  c1: Card
  c2: Card
  c1WasSeen: boolean
  c2WasSeen: boolean
  difficulty: Difficulty
  showScorePopup: (text: string) => void
  setCards: React.Dispatch<React.SetStateAction<Card[]>>
  setScore: React.Dispatch<React.SetStateAction<number>>
  setResult: React.Dispatch<React.SetStateAction<'win' | 'idle'>>
  setFirstCard: React.Dispatch<React.SetStateAction<Card | null>>
  setFirstCardWasSeen: React.Dispatch<React.SetStateAction<boolean>>
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

export function checkMatch({
  c1,
  c2,
  c1WasSeen,
  c2WasSeen,
  difficulty,
  showScorePopup,
  setCards,
  setScore,
  setResult,
  setFirstCard,
  setFirstCardWasSeen,
  setDisabled,
}: CheckMatchParams) {
  const isMatch = c1.value === c2.value

  let scoreDelta = 0

  /* =========================
    КАРТОЧКИ СОВПАЛИ
  ========================= */
  if (isMatch) {
    const bonus = getBonus(difficulty)
    // Если обе карточки открыты впервые, дается бонус +5 очков
    const isLucky = isLuckyPair(c1WasSeen, c2WasSeen)

    const totalBonus = isLucky ? bonus + 5 : bonus

    scoreDelta = totalBonus

    showScorePopup(isLucky ? `+${bonus}+5` : `+${bonus}`)
    // Пара отмечается как найденная
    setCards(prev =>
      prev.map(c => (c.value === c1.value ? { ...c, isMatched: true } : c)),
    )

    /* =========================
      КАРТОЧКИ НЕ СОВПАЛИ
    ========================= */
  } else {
    const penalty = getPenalty(c1WasSeen, c2WasSeen)
    // Штраф, если одну из карт уже видели
    if (penalty > 0) {
      scoreDelta = -penalty
      showScorePopup(`-${penalty}`)
    }

    // Карты переворачиваются обратно
    setCards(prev =>
      prev.map(c =>
        c.id === c1.id || c.id === c2.id ? { ...c, isFlipped: false } : c,
      ),
    )

    setResult('idle')
  }

  // score
  if (scoreDelta !== 0) {
    setScore(prev => prev + scoreDelta)
  }

  // WIN CHECK
  setCards(prev => {
    const isWinNow = prev.every(c => c.isMatched)

    if (isWinNow) {
      setResult('win')
    }

    return prev
  })

  setFirstCard(null)
  setFirstCardWasSeen(false)
  setDisabled(false)
}
