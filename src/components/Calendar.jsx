import { useState, useMemo, useRef } from 'react'
import { getShiftForDate, getCalendarDays, SHIFT_CONFIG } from '../utils/shifts'
import DayCell from './DayCell'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function formatToday() {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
}

export default function Calendar({ pattern }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const todayKey = useRef(formatToday()).current

  const days = useMemo(() => getCalendarDays(year, month), [year, month])

  const shifts = useMemo(() => {
    return days.map((d) => (d ? getShiftForDate(d, pattern) : null))
  }, [days, pattern])

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  function goToday() {
    setYear(now.getFullYear())
    setMonth(now.getMonth())
  }

  // Swipe support
  const touchStart = useRef(null)
  function onTouchStart(e) {
    touchStart.current = e.touches[0].clientX
  }
  function onTouchEnd(e) {
    if (touchStart.current === null) return
    const diff = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(diff) > 60) {
      diff > 0 ? prevMonth() : nextMonth()
    }
    touchStart.current = null
  }

  // Legend counts
  const counts = useMemo(() => {
    const c = { day: 0, night: 0, off: 0 }
    shifts.forEach(s => { if (s) c[s]++ })
    return c
  }, [shifts])

  return (
    <div className="mt-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 active:bg-neutral-200 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft />
        </button>

        <button onClick={goToday} className="text-center active:opacity-60 transition-opacity">
          <span className="text-lg font-semibold text-neutral-900">
            {MONTHS[month]}
          </span>
          <span className="text-lg font-semibold text-neutral-300 ml-2">
            {year}
          </span>
        </button>

        <button
          onClick={nextMonth}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 active:bg-neutral-200 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-neutral-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div
        className="grid grid-cols-7 gap-1.5"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />

          const shift = shifts[i]
          const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
          const isToday = key === todayKey

          return (
            <DayCell
              key={key}
              day={date.getDate()}
              shift={shift}
              isToday={isToday}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-6 py-3">
        {Object.entries(SHIFT_CONFIG).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            <span className="text-xs text-neutral-500 font-medium capitalize">
              {type} <span className="text-neutral-300">{counts[type]}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5l-5 5 5 5" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 5l5 5-5 5" />
    </svg>
  )
}
