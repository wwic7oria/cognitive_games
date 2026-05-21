type Props = {
  cards: any[]
  onCardClick: (card: any) => void
  size: number
  isWin: boolean
}

export function MemoryGrid({ cards, onCardClick, size, isWin }: Props) {
  return (
    <>
      <div
        className="game-grid"
        style={{ gridTemplateColumns: `repeat(${size}, 80px)` }}
      >
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => onCardClick(card)}
            className={`card ${
              card.isFlipped || card.isMatched ? 'flipped' : ''
            } ${card.isMatched ? 'matched' : ''}`}
          >
            {card.isFlipped || card.isMatched ? card.value : '?'}
          </div>
        ))}
      </div>

      {isWin && <h3 className="win-text">Победа 🏆</h3>}
    </>
  )
}
