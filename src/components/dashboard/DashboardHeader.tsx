import { Box } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <div className="text-purple-600">
            <Box className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Cluster Resources
          </h1>
        </div>
        <div className="mt-1 text-sm text-slate-500">
          Datacenters{" "}
          <span className="mx-1">&gt;</span> Main-Site-A{" "}
          <span className="mx-1">&gt;</span> Compute-Cluster-01
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
          RISKY3
        </button>
        <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
          SAFE4
        </button>
        <button className="rounded-md border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
          ENTERPRISE
        </button>
      </div>
    </div>
  )
}
