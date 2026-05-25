type Props = {
  cards: any[]
  onCardClick: (card: any) => void
  size: number
  isWin: boolean
}

export const CELL_SIZE = 80
export const GAP_SIZE = 10

export function MemoryGrid({ cards, onCardClick, size }: Props) {
  return (
    <>
      <div
        className="game-grid"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => onCardClick(card)}
            className={`card ${
              card.isFlipped || card.isMatched ? 'flipped' : ''
            } ${card.isMatched ? 'matched' : ''}`}
          >
            {card.isFlipped || card.isMatched ? card.value : ''}
          </div>
        ))}
      </div>
    </>
  )
}
