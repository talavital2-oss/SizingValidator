import { RefreshCcw, AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Meter } from "./Meter"
import type { ClusterComputed, InfraTotals, CpuModeSettings, VsanMode, HardwareConfig, CapacityView } from "@/types"
import { formatNumber, formatInt, gbToTb } from "@/lib/utils"
import { USER_PROFILES } from "@/constants"

interface ResourceUtilizationCardProps {
  computed: ClusterComputed
  infraTotals: InfraTotals
  cpuModeSettings: CpuModeSettings
  hardware: HardwareConfig
  vsanMode: VsanMode
  vsanCpuOverheadPct: number
  vmCount: number
  userProfile: string
  concurrencyPercent: number
  onRefresh?: () => void
  onUpdateCapacityView: (view: CapacityView) => void
}

function AssessmentBadge({ status }: { status: string }) {
  const colors = {
    OPTIMAL: "bg-emerald-100 text-emerald-700 border-emerald-200",
    ACCEPTABLE: "bg-blue-100 text-blue-700 border-blue-200",
    WARNING: "bg-amber-100 text-amber-700 border-amber-200",
    CRITICAL: "bg-red-100 text-red-700 border-red-200",
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
  userProfile,
  concurrencyPercent,
  onRefresh,
  onUpdateCapacityView,
}: ResourceUtilizationCardProps) {
  const profileSpec = USER_PROFILES[userProfile as keyof typeof USER_PROFILES]
  const infraCpuDemandGhz = computed.totalCpuDemandGhz - computed.vdiCpuDemandGhz
  const isFailoverView = cpuModeSettings.capacityView === "failover"
  
  return (
    <Card className="rounded-xl shadow-sm md:col-span-2 border border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-900">
            Cluster Resource Utilization
          </CardTitle>
          <Button variant="ghost" className="gap-2 text-slate-600" onClick={onRefresh}>
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
        </div>
        
        {/* Capacity View Toggle */}
        <div className="mt-3 flex items-center gap-2">
          <div className="text-xs text-slate-500">Capacity View:</div>
          <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5">
            <button
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                !isFailoverView 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => onUpdateCapacityView("normal")}
            >
              Normal ({computed.totalHosts} hosts)
            </button>
            <button
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                isFailoverView 
                  ? "bg-amber-500 text-white" 
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => onUpdateCapacityView("failover")}
            >
              Failover N-{hardware.nPlusRedundancy} ({computed.hostsForCapacity} hosts)
            </button>
          </div>
        </div>

        {isFailoverView && (
          <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            <AlertTriangle className="h-4 w-4" />
            Showing capacity after {hardware.nPlusRedundancy} host failure{hardware.nPlusRedundancy > 1 ? "s" : ""} (N+{hardware.nPlusRedundancy} scenario)
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1">
            Load: <span className="font-semibold text-slate-700">
              {cpuModeSettings.cpuMode === "peak" ? "Peak" : "Average"}
            </span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1">
            Hosts for capacity: <span className="font-semibold text-slate-700">
              {formatInt(computed.hostsForCapacity)}
            </span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1">
            Concurrent VMs: <span className="font-semibold text-slate-700">
              {formatInt(computed.concurrentVms)} ({concurrencyPercent}%)
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
                <span className="text-sm font-semibold text-slate-900">Memory Usage</span>
                <AssessmentBadge status={computed.memAssessment} />
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Consumed: {formatNumber(gbToTb(computed.memConsumedGb), 2)} TB ({formatInt(computed.memConsumedGb)} GB)
              </div>
            </div>
            <div className="text-sm font-semibold text-slate-700">
              {formatNumber(computed.memUtil, 1)}%
            </div>
          </div>

          <div className="mt-3">
            <Meter percent={computed.memUtil} />
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>0 TB</span>
              <span>
                {isFailoverView ? "Failover" : "Normal"} Capacity: {formatNumber(gbToTb(computed.memCapacityGb), 2)} TB
              </span>
            </div>
          </div>

          <div className="mt-3 rounded-md bg-slate-50 border border-slate-200 p-3">
            <div className="text-[11px] uppercase tracking-widest text-slate-500">
              Memory breakdown (GB)
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-700">
              <div>VDI VMs ({vmCount} × {formatInt(computed.vdiRamGb / vmCount)} GB)</div>
              <div className="text-right font-semibold">{formatInt(computed.vdiRamGb)}</div>
              <div>Infra VMs</div>
              <div className="text-right font-semibold">{formatInt(infraTotals.infraRamGb)}</div>
              <div>VM overhead (~100MB/VM)</div>
              <div className="text-right font-semibold">{formatNumber(computed.vmOverheadGb, 1)}</div>
              <div>ESXi + agents ({computed.hostsForCapacity} hosts)</div>
              <div className="text-right font-semibold">{formatInt(computed.systemOverheadGb)}</div>
              <div>vSAN overhead</div>
              <div className="text-right font-semibold">{formatInt(computed.vsanOverheadGb)}</div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* CPU Usage Section */}
        <div className="py-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">CPU Usage</span>
                <AssessmentBadge status={computed.cpuAssessment} />
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Demand: {formatNumber(computed.totalCpuDemandGhz, 1)} GHz
              </div>
            </div>
            <div className="text-sm font-semibold text-slate-700">
              {formatNumber(computed.cpuUtil, 1)}%
            </div>
          </div>

          <div className="mt-3">
            <Meter percent={computed.cpuUtil} />
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>0 GHz</span>
              <span>
                {isFailoverView ? "Failover" : "Normal"} Capacity: {formatNumber(computed.cpuCapacityGhz, 1)} GHz
              </span>
            </div>
          </div>

          <div className="mt-3 rounded-md bg-slate-50 border border-slate-200 p-3">
            <div className="text-[11px] uppercase tracking-widest text-slate-500">
              CPU demand breakdown (GHz)
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-700">
              <div>VDI workload ({computed.concurrentVms} VMs)</div>
              <div className="text-right font-semibold">{formatNumber(computed.vdiCpuDemandGhz, 1)}</div>
              <div>Infra workload</div>
              <div className="text-right font-semibold">{formatNumber(infraCpuDemandGhz, 1)}</div>
              <div>vSAN CPU overhead</div>
              <div className="text-right font-semibold">
                {vsanMode === "none" ? "0%" : `+${formatInt(vsanCpuOverheadPct)}%`}
              </div>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Based on LoginVSI {profileSpec?.name} profile: {cpuModeSettings.cpuMode === "peak" ? "peak" : "avg"} demand
            </div>
          </div>
        </div>

        <Separator className="my-5" />

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-500">
              VCPU RATIO
            </div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">
              {formatNumber(computed.vcpuRatio, 1)}<span className="text-slate-400 text-xl">:1</span>
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Target: {profileSpec?.vcpuRatioRecommended}:1 ({profileSpec?.name})
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-500">
              VMs PER HOST {isFailoverView && "(failover)"}
            </div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">
              {formatInt(computed.vmsPerHost)}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Across {computed.hostsForCapacity} {isFailoverView ? "surviving" : "active"} hosts
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-500">
              TOTAL VMs
            </div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">
              {formatInt(vmCount)}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              + {formatInt(infraTotals.infraVmCount)} Infra VMs
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
