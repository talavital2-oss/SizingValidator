import { clamp } from "@/lib/utils"

interface MeterProps {
  percent: number
  className?: string
}

export function Meter({ percent, className = "" }: MeterProps) {
  const p = clamp(percent, 0, 100)
  
  return (
    <div className={`h-3 w-full rounded bg-slate-200 overflow-hidden ${className}`}>
      <div 
        className="h-full bg-emerald-500 transition-all duration-300" 
        style={{ width: `${p}%` }} 
      />
    </div>
  )
}
