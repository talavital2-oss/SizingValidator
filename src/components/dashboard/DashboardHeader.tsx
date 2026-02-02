import { Server } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-2 rounded-lg">
          <Server className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            VDI Sizing Validator
          </h1>
          <div className="text-sm text-slate-400">
            Powered by TeraSky
          </div>
        </div>
      </div>
    </div>
  )
}
