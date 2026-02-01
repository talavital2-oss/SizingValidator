import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface TopTileProps {
  title: string
  value: ReactNode
  sub?: ReactNode
  tone?: "blue" | "green"
  icon: ReactNode
}

export function TopTile({ title, value, sub, tone = "blue", icon }: TopTileProps) {
  const borderColor = tone === "green" 
    ? "border-t-4 border-t-emerald-500" 
    : "border-t-4 border-t-blue-600"

  return (
    <Card className={`rounded-xl shadow-sm border ${borderColor}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] tracking-widest uppercase text-slate-500">
              {title}
            </div>
            <div className="mt-2 text-3xl font-semibold text-slate-900 leading-none">
              {value}
            </div>
            {sub && (
              <div className="mt-2 text-sm text-slate-500">{sub}</div>
            )}
          </div>
          <div className="mt-1 text-slate-300">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
