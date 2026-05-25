type Props = {
  cells: number[]
  size: number
  activeCell: number | null
  wrongClick: number | null
  lastClicked: number | null
  gameState: string
  onClick: (id: number) => void
}

export function SequenceGrid({
  cells,
  size,
  activeCell,
  wrongClick,
  lastClicked,
  gameState,
  onClick,
}: Props) {
  return (
    <div
      className="game-grid"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
    >
      {cells.map(id => {
        const isActive = activeCell === id
        const isWrong = wrongClick === id
        const isRight = lastClicked === id

        return (
          <div
            onClick={() => onClick(id)}
            className={`
              card
              ${isActive ? 'activeCell' : ''}
              ${isWrong ? 'wrongClick' : ''}
              ${isRight ? 'rightClick' : ''}
            `}
            style={{
              cursor: gameState === 'input' ? 'pointer' : 'not-allowed',
            }}
          ></div>
        )
      })}
    </div>
  )
}
