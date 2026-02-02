import { SlidersHorizontal } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { SliderRow } from "./SliderRow"
import type { HardwareConfig, ClusterComputed } from "@/types"
import { formatInt, formatNumber } from "@/lib/utils"
import { HARDWARE_LIMITS } from "@/constants"

interface HardwareConfigCardProps {
  hardware: HardwareConfig
  computed: ClusterComputed
  onUpdate: (updates: Partial<HardwareConfig>) => void
}

export function HardwareConfigCard({ 
  hardware, 
  computed, 
  onUpdate 
}: HardwareConfigCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-cyan-400" /> 
          Hardware
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <SliderRow
          label="Hosts"
          valueLabel={`${formatInt(hardware.hosts)}`}
          value={hardware.hosts}
          min={HARDWARE_LIMITS.hosts.min}
          max={HARDWARE_LIMITS.hosts.max}
          step={1}
          onChange={(v) => onUpdate({ hosts: v })}
        />

        <SliderRow
          label="RAM / Host"
          valueLabel={`${formatInt(hardware.ramPerHostGb)} GB`}
          value={hardware.ramPerHostGb}
          min={HARDWARE_LIMITS.ramPerHostGb.min}
          max={HARDWARE_LIMITS.ramPerHostGb.max}
          step={HARDWARE_LIMITS.ramPerHostGb.step}
          onChange={(v) => onUpdate({ ramPerHostGb: v })}
        />

        <SliderRow
          label="Cores / Host"
          valueLabel={`${formatInt(hardware.coresPerHost)}`}
          value={hardware.coresPerHost}
          min={HARDWARE_LIMITS.coresPerHost.min}
          max={HARDWARE_LIMITS.coresPerHost.max}
          step={HARDWARE_LIMITS.coresPerHost.step}
          onChange={(v) => onUpdate({ coresPerHost: v })}
        />

        <SliderRow
          label="GHz / Core"
          valueLabel={`${formatNumber(hardware.baseGhz, 1)}`}
          value={hardware.baseGhz}
          min={HARDWARE_LIMITS.baseGhz.min}
          max={HARDWARE_LIMITS.baseGhz.max}
          step={HARDWARE_LIMITS.baseGhz.step}
          onChange={(v) => onUpdate({ baseGhz: v })}
        />

        <div className="pt-2 rounded-md bg-slate-800/50 border border-slate-700/50 p-3 text-xs">
          <div className="grid grid-cols-2 gap-1 text-slate-300">
            <div>Physical cores</div>
            <div className="text-right font-semibold text-cyan-400">{formatInt(computed.totalPhysicalCores)}</div>
            <div>CPU capacity</div>
            <div className="text-right font-semibold text-cyan-400">{formatNumber(computed.cpuCapacityGhz, 0)} GHz</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
