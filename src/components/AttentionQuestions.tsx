type Option = {
  label: string
  value: boolean
}

type Props = {
  question: string | null
  options: Option[]
  onAnswer: (value: boolean) => void
}

export function QuestionBlock({ question, options, onAnswer }: Props) {
  return (
    <div
      className="section"
      style={{ marginTop: '0px' }}
    >
      <h2 className="status-text">{question}</h2>

      <div className="attention-buttons">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
