import { memo } from 'react'
import { SHIFT_CONFIG } from '../utils/shifts'

const DayCell = memo(function DayCell({ day, shift, isToday }) {
  const cfg = SHIFT_CONFIG[shift]

  return (
    <div
      className={`
        aspect-square rounded-2xl flex flex-col items-center justify-center
        transition-all duration-150
        ${cfg.bg} ${cfg.text}
        ${isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
      `}
    >
      <span className="text-[15px] font-semibold leading-none">{day}</span>
      <span className="text-[10px] font-medium mt-0.5 opacity-70">{cfg.label}</span>
    </div>
  )
})

export default DayCell
