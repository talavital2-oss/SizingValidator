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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" /> 
            Management VMs
          </CardTitle>
          
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-slate-400">Total: </span>
              <span className="font-bold text-cyan-400">{formatInt(infraTotals.infraVmCount)}</span>
              <span className="text-slate-400"> VMs</span>
            </div>
            <div>
              <span className="font-bold text-cyan-400">{formatInt(infraTotals.infraVcpu)}</span>
              <span className="text-slate-400"> vCPU</span>
            </div>
            <div>
              <span className="font-bold text-cyan-400">{formatInt(infraTotals.infraRamGb)}</span>
              <span className="text-slate-400"> GB RAM</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] text-slate-500 uppercase tracking-wider">
              <th className="text-left py-2 pr-4 font-medium">Component</th>
              <th className="text-center py-2 px-2 font-medium w-16">Qty</th>
              <th className="text-center py-2 px-2 font-medium w-16">vCPU</th>
              <th className="text-center py-2 px-2 font-medium w-16">RAM</th>
              <th className="text-right py-2 pl-2 font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {infraVms.map((vm) => {
              const subtotalVcpu = vm.enabled ? vm.count * vm.vcpu : 0
              const subtotalRam = vm.enabled ? vm.count * vm.ramGb : 0
              
              return (
                <tr 
                  key={vm.key} 
                  className={`border-t border-slate-800 ${!vm.enabled ? 'opacity-40' : ''}`}
                >
                  <td className="py-1.5 pr-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={vm.enabled}
                        onChange={(e) => onUpdateInfraVm(vm.key, { enabled: e.target.checked })}
                        className="w-4 h-4 accent-cyan-500 rounded"
                      />
                      <span className={`text-xs ${vm.enabled ? 'text-white' : 'text-slate-500'}`}>
                        {vm.label.split('(')[0].trim()}
                      </span>
                    </label>
                  </td>
                  <td className="py-1.5 px-1">
                    <input
                      type="number"
                      value={vm.count}
                      min={0}
                      max={20}
                      disabled={!vm.enabled}
                      onChange={(e) => onUpdateInfraVm(vm.key, { count: clamp(Number(e.target.value), 0, 20) })}
                      className="w-full h-7 px-1 text-center text-xs font-semibold rounded border border-slate-700 bg-slate-800 text-white disabled:opacity-50 disabled:bg-slate-900 focus:border-cyan-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-1.5 px-1">
                    <input
                      type="number"
                      value={vm.vcpu}
                      min={1}
                      max={64}
                      disabled={!vm.enabled}
                      onChange={(e) => onUpdateInfraVm(vm.key, { vcpu: clamp(Number(e.target.value), 1, 64) })}
                      className="w-full h-7 px-1 text-center text-xs font-semibold rounded border border-slate-700 bg-slate-800 text-white disabled:opacity-50 disabled:bg-slate-900 focus:border-cyan-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-1.5 px-1">
                    <input
                      type="number"
                      value={vm.ramGb}
                      min={1}
                      max={256}
                      disabled={!vm.enabled}
                      onChange={(e) => onUpdateInfraVm(vm.key, { ramGb: clamp(Number(e.target.value), 1, 256) })}
                      className="w-full h-7 px-1 text-center text-xs font-semibold rounded border border-slate-700 bg-slate-800 text-white disabled:opacity-50 disabled:bg-slate-900 focus:border-cyan-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-1.5 pl-2 text-right">
                    {vm.enabled && (
                      <span className="text-[10px] text-slate-400">
                        {subtotalVcpu}c / {subtotalRam}G
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
