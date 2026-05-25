export function GameBoard({ scale, children }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          display: 'inline-block',
        }}
      >
        {children}
      </div>
    </div>
  )
}
