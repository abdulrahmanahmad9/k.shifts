const BASE_CYCLE = ['day', 'night', 'off', 'off']

const GROUP_OFFSETS = { A: 1, B: 0, C: 2, D: 3 }

const ANCHOR = new Date(2026, 0, 1) // Jan 1, 2026

function daysBetween(a, b) {
  const msPerDay = 86400000
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.floor((utcB - utcA) / msPerDay)
}

export function getShiftForDate(date, pattern) {
  const diff = daysBetween(ANCHOR, date)
  const offset = GROUP_OFFSETS[pattern]
  const index = ((diff + offset) % 4 + 4) % 4
  return BASE_CYCLE[index]
}

export function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDow = firstDay.getDay()

  const days = []

  // Pad with nulls for days before month starts (Sun = 0)
  for (let i = 0; i < startDow; i++) {
    days.push(null)
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d))
  }

  return days
}

export const SHIFT_CONFIG = {
  day: { label: 'D', bg: 'bg-amber-100', text: 'text-amber-900', dot: 'bg-amber-400' },
  night: { label: 'N', bg: 'bg-neutral-800', text: 'text-neutral-100', dot: 'bg-indigo-400' },
  off: { label: 'O', bg: 'bg-neutral-200', text: 'text-neutral-500', dot: 'bg-neutral-400' },
}
