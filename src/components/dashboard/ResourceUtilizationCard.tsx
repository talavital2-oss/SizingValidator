import { RefreshCcw, AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Meter } from "./Meter"
import type { ClusterComputed, InfraTotals, CpuModeSettings, VsanMode, HardwareConfig, CapacityView } from "@/types"
import { formatNumber, formatInt, gbToTb } from "@/lib/utils"

interface ResourceUtilizationCardProps {
  computed: ClusterComputed
  infraTotals: InfraTotals
  cpuModeSettings: CpuModeSettings
  hardware: HardwareConfig
  vsanMode: VsanMode
  vsanCpuOverheadPct: number
  vmCount: number
  onRefresh?: () => void
  onUpdateCapacityView: (view: CapacityView) => void
}

function AssessmentBadge({ status }: { status: string }) {
  const colors = {
    OPTIMAL: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    ACCEPTABLE: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    WARNING: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    CRITICAL: "bg-red-500/20 text-red-400 border-red-500/30",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[status as keyof typeof colors] || colors.ACCEPTABLE}`}>
      {status}
    </span>
  )
}

export function ResourceUtilizationCard({
  computed,
  infraTotals,
  cpuModeSettings,
  hardware,
  vsanMode,
  vsanCpuOverheadPct,
  vmCount,
  onRefresh,
  onUpdateCapacityView,
}: ResourceUtilizationCardProps) {
  const infraCpuDemandGhz = computed.totalCpuDemandGhz - computed.vdiCpuDemandGhz
  const isFailoverView = cpuModeSettings.capacityView === "failover"
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Resource Utilization
          </CardTitle>
          <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white" onClick={onRefresh}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Capacity View Toggle */}
        <div className="mt-3 flex items-center gap-2">
          <div className="text-xs text-slate-400">View:</div>
          <div className="inline-flex rounded-md border border-slate-700 bg-slate-800/50 p-0.5">
            <button
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                !isFailoverView 
                  ? "bg-cyan-600 text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
              onClick={() => onUpdateCapacityView("normal")}
            >
              Normal ({computed.totalHosts})
            </button>
            <button
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                isFailoverView 
                  ? "bg-amber-600 text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
              onClick={() => onUpdateCapacityView("failover")}
            >
              Failover ({computed.hostsForCapacity})
            </button>
          </div>
        </div>

        {isFailoverView && (
          <div className="mt-2 flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-md px-3 py-2">
            <AlertTriangle className="h-4 w-4" />
            Showing N+{hardware.nPlusRedundancy} failover scenario
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800/50 px-2 py-1">
            Load: <span className="font-semibold text-cyan-400">
              {cpuModeSettings.cpuMode === "peak" ? "Peak" : "Avg"}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800/50 px-2 py-1">
            VMs: <span className="font-semibold text-cyan-400">
              {formatInt(computed.concurrentVms)}
            </span>
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {/* Memory Usage Section */}
        <div className="py-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Memory</span>
                <AssessmentBadge status={computed.memAssessment} />
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {formatNumber(gbToTb(computed.memConsumedGb), 2)} TB consumed
              </div>
            </div>
            <div className="text-lg font-bold text-white">
              {formatNumber(computed.memUtil, 1)}%
            </div>
          </div>

          <div className="mt-3">
            <Meter percent={computed.memUtil} />
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
              <span>0</span>
              <span>{formatNumber(gbToTb(computed.memCapacityGb), 2)} TB capacity</span>
            </div>
          </div>

          <div className="mt-3 rounded-md bg-slate-800/50 border border-slate-700/50 p-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
              Breakdown (GB)
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="text-slate-400">VDI VMs</div>
              <div className="text-right text-cyan-400">{formatInt(computed.vdiRamGb)}</div>
              <div className="text-slate-400">Infra VMs</div>
              <div className="text-right text-cyan-400">{formatInt(infraTotals.infraRamGb)}</div>
              <div className="text-slate-400">Overhead</div>
              <div className="text-right text-cyan-400">{formatInt(computed.systemOverheadGb + computed.vsanOverheadGb + computed.vmOverheadGb)}</div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* CPU Usage Section */}
        <div className="py-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">CPU</span>
                <AssessmentBadge status={computed.cpuAssessment} />
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {formatNumber(computed.totalCpuDemandGhz, 1)} GHz demand
              </div>
            </div>
            <div className="text-lg font-bold text-white">
              {formatNumber(computed.cpuUtil, 1)}%
            </div>
          </div>

          <div className="mt-3">
            <Meter percent={computed.cpuUtil} />
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
              <span>0</span>
              <span>{formatNumber(computed.cpuCapacityGhz, 0)} GHz capacity</span>
            </div>
          </div>

          <div className="mt-3 rounded-md bg-slate-800/50 border border-slate-700/50 p-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
              Breakdown (GHz)
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="text-slate-400">VDI ({computed.concurrentVms} VMs)</div>
              <div className="text-right text-cyan-400">{formatNumber(computed.vdiCpuDemandGhz, 1)}</div>
              <div className="text-slate-400">Infra</div>
              <div className="text-right text-cyan-400">{formatNumber(infraCpuDemandGhz, 1)}</div>
              {vsanMode !== "none" && (
                <>
                  <div className="text-slate-400">vSAN overhead</div>
                  <div className="text-right text-cyan-400">+{formatInt(vsanCpuOverheadPct)}%</div>
                </>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Bottom Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500">vCPU Ratio</div>
            <div className="mt-1 text-2xl font-bold text-white">
              {formatNumber(computed.vcpuRatio, 1)}<span className="text-slate-500 text-sm">:1</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500">VMs/Host</div>
            <div className="mt-1 text-2xl font-bold text-white">{formatInt(computed.vmsPerHost)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Total VMs</div>
            <div className="mt-1 text-2xl font-bold text-white">{formatInt(vmCount)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
