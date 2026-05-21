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
    <div className="section">
      <h2
        style={{
          marginTop: '30px',
          marginBottom: '30px',
          textAlign: 'center',
        }}
      >
        {question}
      </h2>

      <div className="buttons-row">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option.value)}
            style={{ minWidth: '80px' }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
