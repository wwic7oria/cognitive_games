/* 
Игра типа Simon says. Появляются объекты, нужно запомнить последовательность и восстановить ее.
Показывается поле, например, 2х2. В этом поле подсвечиваются элементы по порядку. Пользователь должен вспомнить порядок "загорания" кнопок и повторить его.
Уровни сложности:
Легкий - поле 2х2
Средний - поле 3х3
Сложный - поле 4х4
*/

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SIZE_MAP = {
  easy: 2,
  medium: 3,
  hard: 4,
} as const

type Difficulty = keyof typeof SIZE_MAP

type GameState = 'idle' | 'showing' | 'input' | 'paused'

const MAX_LENGTH_MAP = {
  easy: 6,
  medium: 7,
  hard: 8,
} as const

const BASE_SCORE_MAP = {
  easy: 10,
  medium: 15,
  hard: 20,
} as const

const PENALTY_MAP = {
  easy: 5,
  medium: 8,
  hard: 10,
} as const

export default function Sequence() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')

  const [score, setScore] = useState(0)
  const [scorePopup, setScorePopup] = useState('')

  const [currentLength, setCurrentLength] = useState(3)

  const [sequence, setSequence] = useState<number[]>([])
  const [userInput, setUserInput] = useState<number[]>([])

  const [activeCell, setActiveCell] = useState<number | null>(null)
  const [lastClicked, setLastClicked] = useState<number | null>(null)
  const [wrongClick, setWrongClick] = useState<number | null>(null)

  const [gameState, setGameState] = useState<GameState>('idle')
  const [result, setResult] = useState<null | 'win' | 'lose'>(null)

  const timeoutRef = useRef<number | null>(null)
  const navigate = useNavigate()

  const size = SIZE_MAP[difficulty]
  const maxLength = MAX_LENGTH_MAP[difficulty]
  const baseScore = BASE_SCORE_MAP[difficulty]
  const penalty = PENALTY_MAP[difficulty]

  const cells = Array.from({ length: size * size }, (_, i) => i)

  const showPopup = (text: string) => {
    setScorePopup(text)
    setTimeout(() => setScorePopup(''), 800)
  }

  const generateSequence = () => {
    return Array.from({ length: currentLength }, () =>
      Math.floor(Math.random() * (size * size)),
    )
  }

  const playSequence = (seq: number[]) => {
    setGameState('showing')

    let i = 0

    const playNext = () => {
      if (i >= seq.length) {
        setActiveCell(null)
        setGameState('input')
        return
      }

      const cell = seq[i]
      setActiveCell(cell)

      timeoutRef.current = window.setTimeout(() => {
        setActiveCell(null)

        timeoutRef.current = window.setTimeout(() => {
          i++
          playNext()
        }, 300)
      }, 600)
    }

    playNext()
  }

  const startGame = () => {
    const seq = generateSequence()
    setSequence(seq)
    setUserInput([])
    setResult(null)
    playSequence(seq)
  }

  const resumeGame = () => {
    playSequence(sequence)
  }

  const handleClick = (id: number) => {
    if (gameState !== 'input') return

    setLastClicked(id)
    setTimeout(() => setLastClicked(null), 200)

    const newInput = [...userInput, id]
    setUserInput(newInput)

    const index = newInput.length - 1

    if (newInput[index] !== sequence[index]) {
      setWrongClick(id)
      setTimeout(() => setWrongClick(null), 300)

      setScore(prev => prev - penalty)
      showPopup(`-${penalty}`)

      setGameState('idle')
      setUserInput([])
      setResult('lose')
      return
    }

    if (newInput.length === sequence.length) {
      setScore(prev => prev + baseScore)
      showPopup(`+${baseScore}`)

      setResult('win')
      setGameState('idle')

      if (currentLength < maxLength) {
        setCurrentLength(prev => prev + 1)
      }
    }
  }

  useEffect(() => {
    setGameState('idle')
    setSequence([])
    setUserInput([])
    setResult(null)
    setScore(0)
    setCurrentLength(3)
  }, [difficulty])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        boxSizing: 'border-box',
      }}
    >
      <h2>Повтор последовательности</h2>

      <div
        style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}
      >
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0 }}>Очки: {score}</h3>

          {scorePopup && (
            <span
              style={{
                position: 'absolute',
                left: '110%',
                top: 0,
                fontSize: 18,
                fontWeight: 'bold',
                color: scorePopup.startsWith('+') ? 'green' : 'red',
              }}
            >
              {scorePopup}
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <button onClick={() => setDifficulty('easy')}>Лёгкий (2х2)</button>
        <button onClick={() => setDifficulty('medium')}>Средний (3х3)</button>
        <button onClick={() => setDifficulty('hard')}>Сложный (4х4)</button>
      </div>

      <div style={{ marginTop: 15, fontWeight: 600 }}>
        Длина последовательности: {currentLength} из {maxLength}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 80px)`,
          gap: 10,
          marginTop: 20,
          justifyContent: 'center',
        }}
      >
        {cells.map(id => (
          <div
            key={id}
            onClick={() => handleClick(id)}
            style={{
              width: 80,
              height: 80,
              background:
                activeCell === id
                  ? 'yellow'
                  : wrongClick === id
                    ? 'red'
                    : lastClicked === id
                      ? 'lightgreen'
                      : '#444',
              border: '1px solid #000',
              cursor: gameState === 'input' ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              userSelect: 'none',
              transition: '0.1s',
            }}
          >
            {id}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 15 }}>
        {gameState === 'showing' && <h3>Запоминай...</h3>}
        {gameState === 'input' && <h3>Повтори</h3>}
      </div>

      {result === 'win' && <h3>Победа 🎉</h3>}

      {result === 'lose' && <h3>Ошибка ❌</h3>}

      <div
        style={{
          marginTop: 15,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {gameState === 'idle' && <button onClick={startGame}>Начать ▶</button>}

        {gameState === 'paused' && (
          <button onClick={resumeGame}>Продолжить ▶</button>
        )}

        <button onClick={() => navigate('/')}>🏠 Вернуться на главную</button>
      </div>

      {/* Правила */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <h3>Правила</h3>

        {difficulty === 'easy' ? (
          <div>
            <p>
              <b style={{ color: 'green' }}>+10</b> очков за правильное
              повторение
            </p>
            <p>
              <b style={{ color: 'red' }}>-5</b> очков за ошибку
            </p>
          </div>
        ) : difficulty === 'medium' ? (
          <div>
            <p>
              <b style={{ color: 'green' }}>+15</b> очков за правильное
              повторение
            </p>
            <p>
              <b style={{ color: 'red' }}>-8</b> очков за ошибку
            </p>
          </div>
        ) : (
          <div>
            <p>
              <b style={{ color: 'green' }}>+20</b> очков за правильное
              повторение
            </p>
            <p>
              <b style={{ color: 'red' }}>-10</b> очков за ошибку
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
