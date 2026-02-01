import { Layers } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { InfraVm, InfraTotals } from "@/types"
import { clamp, formatInt } from "@/lib/utils"

interface ManagementVmsCardProps {
  infraVms: InfraVm[]
  infraTotals: InfraTotals
  onUpdateInfraVm: (key: string, updates: Partial<InfraVm>) => void
}

export function ManagementVmsCard({
  infraVms,
  infraTotals,
  onUpdateInfraVm,
}: ManagementVmsCardProps) {
  return (
    <Card className="rounded-xl shadow-sm border border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Layers className="h-4 w-4 text-slate-500" /> 
          Management VMs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-slate-500">
          Defaults reflect vendor reference architecture sizing (editable). 
          Toggle components you deploy.
        </div>

        <div className="space-y-2">
          {infraVms.map((vm) => (
            <div 
              key={vm.key} 
              className="rounded-md border border-slate-200 bg-white p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 accent-blue-600"
                    checked={vm.enabled}
                    onChange={(e) => onUpdateInfraVm(vm.key, { 
                      enabled: e.target.checked 
                    })}
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {vm.label}
                    </div>
                    {vm.note && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        {vm.note}
                      </div>
                    )}
                  </div>
                </label>

                <div className="grid grid-cols-3 gap-2 min-w-[210px]">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-400">
                      Count
                    </div>
                    <input
                      className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-sm disabled:opacity-50 disabled:bg-slate-50"
                      type="number"
                      value={vm.count}
                      min={0}
                      onChange={(e) => onUpdateInfraVm(vm.key, { 
                        count: clamp(Number(e.target.value), 0, 20) 
                      })}
                      disabled={!vm.enabled}
                    />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-400">
                      vCPU
                    </div>
                    <input
                      className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-sm disabled:opacity-50 disabled:bg-slate-50"
                      type="number"
                      value={vm.vcpu}
                      min={1}
                      onChange={(e) => onUpdateInfraVm(vm.key, { 
                        vcpu: clamp(Number(e.target.value), 1, 64) 
                      })}
                      disabled={!vm.enabled}
                    />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-400">
                      RAM
                    </div>
                    <input
                      className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-sm disabled:opacity-50 disabled:bg-slate-50"
                      type="number"
                      value={vm.ramGb}
                      min={1}
                      onChange={(e) => onUpdateInfraVm(vm.key, { 
                        ramGb: clamp(Number(e.target.value), 1, 256) 
                      })}
                      disabled={!vm.enabled}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-md bg-slate-50 border border-slate-200 p-3">
          <div className="text-xs text-slate-500">Infra totals (enabled)</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-700">
            <div>Infra VM count</div>
            <div className="text-right font-semibold">
              {formatInt(infraTotals.infraVmCount)}
            </div>
            <div>Total infra vCPU</div>
            <div className="text-right font-semibold">
              {formatInt(infraTotals.infraVcpu)}
            </div>
            <div>Total infra RAM (GB)</div>
            <div className="text-right font-semibold">
              {formatInt(infraTotals.infraRamGb)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
