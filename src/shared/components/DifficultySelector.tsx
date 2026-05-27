type DifficultyOption = {
  value: string
  label: string
}

type DifficultySelectorProps = {
  current: string
  options: DifficultyOption[]
  onChange: (value: string) => void
}

export function DifficultySelector({
  current,
  options,
  onChange,
}: DifficultySelectorProps) {
  return (
    <div className="buttons-row">
      {options.map(option => (
        <button
          key={option.value}
          className={current === option.value ? 'selected' : ''}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
