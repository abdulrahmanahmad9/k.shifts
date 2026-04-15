import { useState, useEffect, useCallback } from 'react'
import Calendar from './components/Calendar'

const PATTERNS = ['A', 'B', 'C', 'D']

function getInitialPattern() {
  try {
    const saved = localStorage.getItem('k-shifts-pattern')
    if (saved && PATTERNS.includes(saved)) return saved
  } catch {}
  return 'A'
}

export default function App() {
  const [pattern, setPattern] = useState(getInitialPattern)

  useEffect(() => {
    localStorage.setItem('k-shifts-pattern', pattern)
  }, [pattern])

  const handlePattern = useCallback((p) => setPattern(p), [])

  return (
    <div className="w-full max-w-[430px] min-h-screen bg-white relative">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
        <div className="px-5 pt-14 pb-4">
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            K.Shifts
          </h1>
          <p className="text-sm text-neutral-400 mt-0.5">Shift calendar</p>
        </div>

        {/* Pattern Selector */}
        <div className="px-5 pb-4">
          <div className="flex gap-1.5 bg-neutral-100 p-1 rounded-2xl">
            {PATTERNS.map((p) => (
              <button
                key={p}
                onClick={() => handlePattern(p)}
                className={`
                  flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                  ${pattern === p
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-400 active:bg-neutral-200'
                  }
                `}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Calendar */}
      <main className="px-5 pb-10">
        <Calendar pattern={pattern} />
      </main>
    </div>
  )
}
