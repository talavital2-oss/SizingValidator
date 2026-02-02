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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" /> 
            Management VMs
          </CardTitle>
          
          {/* Totals inline with header */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">VMs:</span>
              <span className="font-bold text-cyan-400">{formatInt(infraTotals.infraVmCount)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">vCPU:</span>
              <span className="font-bold text-cyan-400">{formatInt(infraTotals.infraVcpu)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">RAM:</span>
              <span className="font-bold text-cyan-400">{formatInt(infraTotals.infraRamGb)} GB</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Horizontal grid of VMs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {infraVms.map((vm) => (
            <div 
              key={vm.key} 
              className={`
                rounded-lg border p-3 transition-all min-w-[140px]
                ${vm.enabled 
                  ? "border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10" 
                  : "border-slate-700/30 bg-slate-900/30 opacity-50"
                }
              `}
            >
              {/* Header with checkbox and short name */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-cyan-500 rounded w-4 h-4 flex-shrink-0 mt-0.5"
                  checked={vm.enabled}
                  onChange={(e) => onUpdateInfraVm(vm.key, { enabled: e.target.checked })}
                />
                <span 
                  className={`text-xs font-semibold leading-tight ${vm.enabled ? "text-white" : "text-slate-500"}`}
                  title={vm.label}
                >
                  {vm.label.split('(')[0].trim()}
                </span>
              </label>

              {/* Labels row */}
              <div className="mt-3 grid grid-cols-3 gap-1 text-[9px] text-slate-500 text-center">
                <span>QTY</span>
                <span>vCPU</span>
                <span>RAM</span>
              </div>

              {/* Inputs row */}
              <div className="mt-1 grid grid-cols-3 gap-1">
                <input
                  type="number"
                  value={vm.count}
                  min={0}
                  onChange={(e) => onUpdateInfraVm(vm.key, { count: clamp(Number(e.target.value), 0, 20) })}
                  disabled={!vm.enabled}
                  style={{ 
                    width: '100%',
                    padding: '6px 4px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: vm.enabled ? '#ffffff' : '#64748b',
                    backgroundColor: vm.enabled ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(71, 85, 105, 0.5)',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                />
                <input
                  type="number"
                  value={vm.vcpu}
                  min={1}
                  onChange={(e) => onUpdateInfraVm(vm.key, { vcpu: clamp(Number(e.target.value), 1, 64) })}
                  disabled={!vm.enabled}
                  style={{ 
                    width: '100%',
                    padding: '6px 4px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: vm.enabled ? '#ffffff' : '#64748b',
                    backgroundColor: vm.enabled ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(71, 85, 105, 0.5)',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                />
                <input
                  type="number"
                  value={vm.ramGb}
                  min={1}
                  onChange={(e) => onUpdateInfraVm(vm.key, { ramGb: clamp(Number(e.target.value), 1, 256) })}
                  disabled={!vm.enabled}
                  style={{ 
                    width: '100%',
                    padding: '6px 4px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: vm.enabled ? '#ffffff' : '#64748b',
                    backgroundColor: vm.enabled ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(71, 85, 105, 0.5)',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
