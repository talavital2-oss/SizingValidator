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
    <Card className="rounded-xl shadow-sm border border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Settings className="h-4 w-4 text-slate-500" /> 
          System Overhead
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <InputBox
            label="ESXi overhead / host (GB)"
            value={systemOverhead.esxiOverheadGbPerHost}
            onChange={(v) => onUpdateSystemOverhead({ 
              esxiOverheadGbPerHost: clamp(v, 8, 128) 
            })}
          />
          <InputBox
            label="VM overhead (MB/VM)"
            value={systemOverhead.vmMemoryOverheadMb}
            onChange={(v) => onUpdateSystemOverhead({ 
              vmMemoryOverheadMb: clamp(v, 50, 500) 
            })}
          />
        </div>

        <div className="text-xs text-slate-500">
          ESXi overhead: 16GB typical for small hosts, 32-64GB for 512GB+ RAM hosts.
          VM overhead: ~100MB avg per VM (varies by vCPU count).
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-widest text-slate-500">
            vSAN mode
          </div>
          <select
            className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            value={systemOverhead.vsanMode}
            onChange={(e) => onUpdateVsanMode(e.target.value as VsanMode)}
          >
            <option value="none">None (external storage)</option>
            <option value="osa">vSAN OSA (~10GB/host)</option>
            <option value="esa">vSAN ESA (128GB/host min)</option>
          </select>
        </div>

        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">
              vSAN memory per host
            </div>
            <div className="text-sm font-semibold text-blue-700">
              {formatInt(vsanMemGbPerHost)} GB
            </div>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            OSA: ~10GB (formula-based) • ESA: 128GB minimum
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>vSAN CPU overhead</span>
              <span className="font-semibold text-slate-700">
                {formatInt(systemOverhead.vsanCpuOverheadPct)}%
              </span>
            </div>
            <input
              className="mt-2 w-full accent-blue-600"
              type="range"
              min={0}
              max={25}
              step={1}
              value={systemOverhead.vsanCpuOverheadPct}
              onChange={(e) => onUpdateSystemOverhead({ 
                vsanCpuOverheadPct: Number(e.target.value) 
              })}
              disabled={systemOverhead.vsanMode === "none"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
