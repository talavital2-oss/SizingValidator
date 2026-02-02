import { Settings } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { InputBox } from "./InputBox"
import type { SystemOverhead, VsanMode } from "@/types"
import { clamp, formatInt } from "@/lib/utils"
import { VSAN_MEM_OVERHEAD } from "@/constants"

interface SystemOverheadCardProps {
  systemOverhead: SystemOverhead
  onUpdateSystemOverhead: (updates: Partial<SystemOverhead>) => void
  onUpdateVsanMode: (mode: VsanMode) => void
}

export function SystemOverheadCard({
  systemOverhead,
  onUpdateSystemOverhead,
  onUpdateVsanMode,
}: SystemOverheadCardProps) {
  const vsanMemGbPerHost = VSAN_MEM_OVERHEAD[systemOverhead.vsanMode] ?? 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Settings className="h-4 w-4 text-cyan-400" /> 
          System Overhead
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <InputBox
            label="ESXi/Host (GB)"
            value={systemOverhead.esxiOverheadGbPerHost}
            onChange={(v) => onUpdateSystemOverhead({ 
              esxiOverheadGbPerHost: clamp(v, 8, 128) 
            })}
          />
          <InputBox
            label="VM Overhead (MB)"
            value={systemOverhead.vmMemoryOverheadMb}
            onChange={(v) => onUpdateSystemOverhead({ 
              vmMemoryOverheadMb: clamp(v, 50, 500) 
            })}
          />
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">
            vSAN Mode
          </div>
          <select
            className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500/50"
            value={systemOverhead.vsanMode}
            onChange={(e) => onUpdateVsanMode(e.target.value as VsanMode)}
          >
            <option value="none">None</option>
            <option value="osa">vSAN OSA</option>
            <option value="esa">vSAN ESA</option>
          </select>
        </div>

        <div className="rounded-md bg-slate-800/50 border border-slate-700/50 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">vSAN mem/host</span>
            <span className="font-semibold text-cyan-400">{formatInt(vsanMemGbPerHost)} GB</span>
          </div>
          
          {systemOverhead.vsanMode !== "none" && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>vSAN CPU overhead</span>
                <span className="text-cyan-400">{formatInt(systemOverhead.vsanCpuOverheadPct)}%</span>
              </div>
              <input
                className="mt-1 w-full accent-cyan-500"
                type="range"
                min={0}
                max={25}
                step={1}
                value={systemOverhead.vsanCpuOverheadPct}
                onChange={(e) => onUpdateSystemOverhead({ 
                  vsanCpuOverheadPct: Number(e.target.value) 
                })}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
