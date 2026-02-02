import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface TopTileProps {
  title: string
  value: ReactNode
  sub?: ReactNode
  tone?: "blue" | "green" | "cyan"
  icon: ReactNode
}

export function TopTile({ title, value, sub, tone = "cyan", icon }: TopTileProps) {
  const borderColor = {
    green: "border-t-4 border-t-emerald-500",
    blue: "border-t-4 border-t-blue-500",
    cyan: "border-t-4 border-t-cyan-500",
  }[tone]

  return (
    <Card className={`${borderColor}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] tracking-widest uppercase text-slate-400">
              {title}
            </div>
            <div className="mt-2 text-3xl font-bold text-white leading-none">
              {value}
            </div>
            {sub && (
              <div className="mt-2 text-sm text-slate-400">{sub}</div>
            )}
          </div>
          <div className="mt-1 text-slate-600">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
