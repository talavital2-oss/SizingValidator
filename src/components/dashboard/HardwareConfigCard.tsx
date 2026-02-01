import { SlidersHorizontal } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { SliderRow } from "./SliderRow"
import type { HardwareConfig, ClusterComputed } from "@/types"
import { formatInt, formatNumber, gbToTb } from "@/lib/utils"
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
    <Card className="rounded-xl shadow-sm border border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" /> 
          Hardware Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SliderRow
          label="Total Hosts"
          valueLabel={`${formatInt(hardware.hosts)} Nodes`}
          value={hardware.hosts}
          min={HARDWARE_LIMITS.hosts.min}
          max={HARDWARE_LIMITS.hosts.max}
          step={1}
          onChange={(v) => onUpdate({ hosts: v })}
        />

        <SliderRow
          label="RAM per Host"
          valueLabel={`${formatNumber(gbToTb(hardware.ramPerHostGb), 2)} TB (${formatInt(hardware.ramPerHostGb)} GB)`}
          value={hardware.ramPerHostGb}
          min={HARDWARE_LIMITS.ramPerHostGb.min}
          max={HARDWARE_LIMITS.ramPerHostGb.max}
          step={HARDWARE_LIMITS.ramPerHostGb.step}
          onChange={(v) => onUpdate({ ramPerHostGb: v })}
        />

        <SliderRow
          label="Cores per Host"
          valueLabel={`${formatInt(hardware.coresPerHost)} Cores`}
          value={hardware.coresPerHost}
          min={HARDWARE_LIMITS.coresPerHost.min}
          max={HARDWARE_LIMITS.coresPerHost.max}
          step={HARDWARE_LIMITS.coresPerHost.step}
          onChange={(v) => onUpdate({ coresPerHost: v })}
        />

        <div className="py-3">
          <div className="flex items-center justify-between text-sm text-slate-700">
            <div className="font-medium">Base GHz (per core)</div>
            <div className="text-blue-700 font-medium">
              {formatNumber(hardware.baseGhz, 1)} GHz
            </div>
          </div>
          <input
            className="mt-2 w-full accent-blue-600"
            type="range"
            min={HARDWARE_LIMITS.baseGhz.min}
            max={HARDWARE_LIMITS.baseGhz.max}
            step={HARDWARE_LIMITS.baseGhz.step}
            value={hardware.baseGhz}
            onChange={(e) => onUpdate({ baseGhz: Number(e.target.value) })}
          />
        </div>

        <div className="pt-2 rounded-md bg-slate-50 border border-slate-200 p-3 text-sm">
          <div className="grid grid-cols-2 gap-2 text-slate-700">
            <div>Total hosts</div>
            <div className="text-right font-semibold">{formatInt(computed.totalHosts)}</div>
            <div>N+{hardware.nPlusRedundancy} redundancy</div>
            <div className="text-right font-semibold text-amber-600">
              {formatInt(computed.totalHosts - hardware.nPlusRedundancy)} hosts during failover
            </div>
            <div>Physical cores ({computed.capacityView === "normal" ? "all" : "failover"})</div>
            <div className="text-right font-semibold">{formatInt(computed.totalPhysicalCores)}</div>
            <div>CPU capacity ({computed.capacityView === "normal" ? "all" : "failover"})</div>
            <div className="text-right font-semibold">{formatNumber(computed.cpuCapacityGhz, 1)} GHz</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
