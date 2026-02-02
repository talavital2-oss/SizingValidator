import { Server, Database, Cpu, CheckCircle2, Shield } from "lucide-react"
import { TopTile } from "./TopTile"
import type { HardwareConfig, ClusterComputed } from "@/types"
import { formatInt, formatNumber } from "@/lib/utils"

interface TopTilesSectionProps {
  hardware: HardwareConfig
  computed: ClusterComputed
}

export function TopTilesSection({ hardware, computed }: TopTilesSectionProps) {
  const isFailoverView = computed.capacityView === "failover"
  const isCompliant = computed.memAssessment !== "CRITICAL" && computed.cpuAssessment !== "CRITICAL"
  const hasWarning = computed.memAssessment === "WARNING" || computed.cpuAssessment === "WARNING"

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <TopTile
        title="CLUSTER HOSTS"
        tone="cyan"
        icon={<Server className="h-8 w-8" />}
        value={formatInt(hardware.hosts)}
        sub={
          <span className="inline-flex items-center gap-2">
            <Shield className="h-3 w-3 text-amber-400" />
            N+{hardware.nPlusRedundancy} protected
          </span>
        }
      />

      <TopTile
        title="MEMORY CAPACITY"
        tone="cyan"
        icon={<Database className="h-8 w-8" />}
        value={`${formatNumber(computed.clusterMemRawTb, 2)} TB`}
        sub={
          isFailoverView 
            ? `${formatNumber(computed.memCapacityGb / 1024, 2)} TB in failover`
            : `${formatInt(hardware.ramPerHostGb)} GB × ${hardware.hosts} hosts`
        }
      />

      <TopTile
        title="CPU CAPACITY"
        tone="cyan"
        icon={<Cpu className="h-8 w-8" />}
        value={`${formatNumber(computed.clusterCpuRawThz, 2)} THz`}
        sub={
          isFailoverView
            ? `${formatNumber(computed.cpuCapacityGhz, 0)} GHz in failover`
            : `${formatInt(hardware.coresPerHost)} cores × ${hardware.hosts} hosts`
        }
      />

      <TopTile
        title={isFailoverView ? "FAILOVER STATUS" : "SIZING STATUS"}
        tone={isCompliant ? "green" : "cyan"}
        icon={<CheckCircle2 className={`h-8 w-8 ${isCompliant ? "text-emerald-400" : hasWarning ? "text-amber-400" : "text-red-400"}`} />}
        value={
          <span className={isCompliant ? "text-emerald-400" : hasWarning ? "text-amber-400" : "text-red-400"}>
            {computed.cpuAssessment === "CRITICAL" || computed.memAssessment === "CRITICAL" 
              ? "Over Capacity" 
              : hasWarning 
                ? "Warning" 
                : isFailoverView ? "HA Ready" : "Good"}
          </span>
        }
        sub={
          <span className="text-slate-400">
            CPU: {formatNumber(computed.cpuUtil, 0)}% • Mem: {formatNumber(computed.memUtil, 0)}%
          </span>
        }
      />
    </div>
  )
}
