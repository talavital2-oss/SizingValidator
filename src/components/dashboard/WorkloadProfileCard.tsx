import { Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { InputBox } from "./InputBox"
import type { WorkloadProfile, HardwareConfig, CpuModeSettings, CpuMode, UserProfile } from "@/types"
import { clamp, formatNumber } from "@/lib/utils"
import { WORKLOAD_LIMITS, USER_PROFILES } from "@/constants"

interface WorkloadProfileCardProps {
  workload: WorkloadProfile
  hardware: HardwareConfig
  cpuModeSettings: CpuModeSettings
  onUpdateWorkload: (updates: Partial<WorkloadProfile>) => void
  onUpdateUserProfile: (profile: UserProfile) => void
  onUpdateCpuMode: (mode: CpuMode) => void
  onUpdateNPlusRedundancy: (n: number) => void
}

export function WorkloadProfileCard({
  workload,
  hardware,
  cpuModeSettings,
  onUpdateWorkload,
  onUpdateUserProfile,
  onUpdateCpuMode,
  onUpdateNPlusRedundancy,
}: WorkloadProfileCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4 text-cyan-400" /> 
          Workload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* User Profile Selection */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">
            Profile
          </div>
          <select
            className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500/50"
            value={workload.userProfile}
            onChange={(e) => onUpdateUserProfile(e.target.value as UserProfile)}
          >
            {Object.entries(USER_PROFILES).map(([key, profile]) => (
              <option key={key} value={key}>
                {profile.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <InputBox
            label="VMs"
            value={workload.vmCount}
            onChange={(v) => onUpdateWorkload({ 
              vmCount: clamp(v, WORKLOAD_LIMITS.vmCount.min, WORKLOAD_LIMITS.vmCount.max) 
            })}
          />
          <InputBox
            label="Concurrency %"
            value={workload.concurrencyPercent}
            onChange={(v) => onUpdateWorkload({ 
              concurrencyPercent: clamp(v, WORKLOAD_LIMITS.concurrencyPercent.min, WORKLOAD_LIMITS.concurrencyPercent.max) 
            })}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <InputBox
            label="vCPU/VM"
            value={workload.vCpuPerVm}
            onChange={(v) => onUpdateWorkload({ 
              vCpuPerVm: clamp(v, WORKLOAD_LIMITS.vCpuPerVm.min, WORKLOAD_LIMITS.vCpuPerVm.max) 
            })}
          />
          <InputBox
            label="RAM/VM (GB)"
            value={workload.ramGbPerVm}
            onChange={(v) => onUpdateWorkload({ 
              ramGbPerVm: clamp(v, WORKLOAD_LIMITS.ramGbPerVm.min, WORKLOAD_LIMITS.ramGbPerVm.max) 
            })}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">
              N+ Redundancy
            </div>
            <select
              className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500/50"
              value={hardware.nPlusRedundancy}
              onChange={(e) => onUpdateNPlusRedundancy(Number(e.target.value))}
            >
              {Array.from({ length: Math.min(hardware.hosts - 1, 4) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>N+{n}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">
              Load Mode
            </div>
            <select
              className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500/50"
              value={cpuModeSettings.cpuMode}
              onChange={(e) => onUpdateCpuMode(e.target.value as CpuMode)}
            >
              <option value="average">Average</option>
              <option value="peak">Peak</option>
            </select>
          </div>
        </div>

        <div className="text-[10px] text-slate-500">
          {cpuModeSettings.cpuMode === "average" 
            ? `${formatNumber(workload.avgCpuGhzPerVm, 2)} GHz/VM typical`
            : `${formatNumber(workload.peakCpuGhzPerVm, 2)} GHz/VM peak`
          }
        </div>
      </CardContent>
    </Card>
  )
}
