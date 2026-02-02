import { clamp } from "@/lib/utils"

interface MeterProps {
  percent: number
  className?: string
}

export function Meter({ percent, className = "" }: MeterProps) {
  const p = clamp(percent, 0, 100)
  
  // Color based on percentage
  const getColor = () => {
    if (p <= 60) return "bg-gradient-to-r from-cyan-500 to-cyan-400"
    if (p <= 75) return "bg-gradient-to-r from-cyan-500 to-blue-500"
    if (p <= 85) return "bg-gradient-to-r from-amber-500 to-amber-400"
    return "bg-gradient-to-r from-red-500 to-red-400"
  }
  
  return (
    <div className={`h-3 w-full rounded-full bg-slate-800 overflow-hidden ${className}`}>
      <div 
        className={`h-full ${getColor()} transition-all duration-300`}
        style={{ width: `${p}%` }} 
      />
    </div>
  )
}
