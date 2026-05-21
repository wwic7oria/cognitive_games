type Rule = {
  value: string
  text: string
  color: string
}

type RulesBlockProps = {
  title?: string
  intro?: string
  rules: readonly Rule[]
}

export function RulesBlock({
  title = 'Правила',
  intro,
  rules,
}: RulesBlockProps) {
  return (
    <div className="rules">
      <h3>{title}</h3>

      {intro && <p style={{ fontSize: '18px' }}>{intro}</p>}

      {rules.map((rule, i) => (
        <p key={i}>
          <b className={rule.color}>{rule.value}</b> {rule.text}
        </p>
      ))}
    </div>
  )
}
