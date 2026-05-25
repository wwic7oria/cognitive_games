type Props = {
  items: any[]
  gridCols: number
  difficulty: string
  SHAPE_EMOJI: any
  COLOR_EMOJI: any
}

export function AttentionGrid({
  items,
  gridCols,
  difficulty,
  SHAPE_EMOJI,
  COLOR_EMOJI,
}: Props) {
  return (
    <div className="section">
      <div
        className="attention-grid"
        style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="attention-card"
          >
            <div className="attention-emoji-row">
              {difficulty === 'easy' ? (
                <span>{COLOR_EMOJI[item.color]}</span>
              ) : (
                <span>{SHAPE_EMOJI[item.shape]}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
