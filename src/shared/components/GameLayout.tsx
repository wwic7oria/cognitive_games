type GameLayoutProps = {
  title: string
  children: React.ReactNode
}

export function GameLayout({ title, children }: GameLayoutProps) {
  return (
    <div className="page">
      <h1 className="page-title">{title}</h1>
      {children}
    </div>
  )
}
