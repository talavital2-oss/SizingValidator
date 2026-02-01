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
  const currentProfile = USER_PROFILES[workload.userProfile]

  return (
    <Card className="rounded-xl shadow-sm border border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-500" /> 
          Workload Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Profile Selection */}
        <div>
          <div className="text-[11px] uppercase tracking-widest text-slate-500 mb-2">
            User Profile (LoginVSI Benchmark)
          </div>
          <select
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            value={workload.userProfile}
            onChange={(e) => onUpdateUserProfile(e.target.value as UserProfile)}
          >
            {Object.entries(USER_PROFILES).map(([key, profile]) => (
              <option key={key} value={key}>
                {profile.name} - {profile.description}
              </option>
            ))}
          </select>
          <div className="mt-2 text-xs text-slate-500">
            Recommended: {currentProfile.vcpus} vCPU, {currentProfile.memoryGb} GB RAM, 
            {currentProfile.vcpuRatioRecommended}:1 ratio
          </div>
        </div>

        <Separator />

        {/* VM Count and Concurrency */}
        <div className="grid grid-cols-2 gap-3">
          <InputBox
            label="VM COUNT"
            value={workload.vmCount}
            onChange={(v) => onUpdateWorkload({ 
              vmCount: clamp(v, WORKLOAD_LIMITS.vmCount.min, WORKLOAD_LIMITS.vmCount.max) 
            })}
          />
          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-500">
              CONCURRENCY %
            </div>
            <input
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              type="number"
              min={WORKLOAD_LIMITS.concurrencyPercent.min}
              max={WORKLOAD_LIMITS.concurrencyPercent.max}
              value={workload.concurrencyPercent}
              onChange={(e) => onUpdateWorkload({ 
                concurrencyPercent: clamp(Number(e.target.value), WORKLOAD_LIMITS.concurrencyPercent.min, WORKLOAD_LIMITS.concurrencyPercent.max) 
              })}
            />
          </div>
        </div>

        {/* VM Specs */}
        <div className="grid grid-cols-2 gap-3">
          <InputBox
            label="VCPU / VM"
            value={workload.vCpuPerVm}
            onChange={(v) => onUpdateWorkload({ 
              vCpuPerVm: clamp(v, WORKLOAD_LIMITS.vCpuPerVm.min, WORKLOAD_LIMITS.vCpuPerVm.max) 
            })}
          />
          <InputBox
            label="RAM (GB) / VM"
            value={workload.ramGbPerVm}
            onChange={(v) => onUpdateWorkload({ 
              ramGbPerVm: clamp(v, WORKLOAD_LIMITS.ramGbPerVm.min, WORKLOAD_LIMITS.ramGbPerVm.max) 
            })}
          />
        </div>

        <Separator />

        {/* CPU GHz Settings */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <div className="text-xs font-medium text-slate-700 mb-2">
            CPU Demand (GHz per VM) - from LoginVSI
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400">Average</div>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-sm"
                type="number"
                step={WORKLOAD_LIMITS.avgCpuGhzPerVm.step}
                min={WORKLOAD_LIMITS.avgCpuGhzPerVm.min}
                max={WORKLOAD_LIMITS.avgCpuGhzPerVm.max}
                value={workload.avgCpuGhzPerVm}
                onChange={(e) => onUpdateWorkload({ 
                  avgCpuGhzPerVm: clamp(Number(e.target.value), WORKLOAD_LIMITS.avgCpuGhzPerVm.min, WORKLOAD_LIMITS.avgCpuGhzPerVm.max) 
                })}
              />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400">Peak</div>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-sm"
                type="number"
                step={WORKLOAD_LIMITS.peakCpuGhzPerVm.step}
                min={WORKLOAD_LIMITS.peakCpuGhzPerVm.min}
                max={WORKLOAD_LIMITS.peakCpuGhzPerVm.max}
                value={workload.peakCpuGhzPerVm}
                onChange={(e) => onUpdateWorkload({ 
                  peakCpuGhzPerVm: clamp(Number(e.target.value), WORKLOAD_LIMITS.peakCpuGhzPerVm.min, WORKLOAD_LIMITS.peakCpuGhzPerVm.max) 
                })}
              />
            </div>
          </div>
        </div>

        {/* HA Settings */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-500">
              N+ REDUNDANCY
            </div>
            <select
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              value={hardware.nPlusRedundancy}
              onChange={(e) => onUpdateNPlusRedundancy(Number(e.target.value))}
            >
              {Array.from({ length: Math.min(hardware.hosts - 1, 4) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  N+{n} (tolerate {n} host failure{n > 1 ? "s" : ""})
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-500">
              LOAD MODE
            </div>
            <select
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              value={cpuModeSettings.cpuMode}
              onChange={(e) => onUpdateCpuMode(e.target.value as CpuMode)}
            >
              <option value="average">Average (typical day)</option>
              <option value="peak">Peak (stress test)</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-slate-500">
          {cpuModeSettings.cpuMode === "average" 
            ? `Using ${formatNumber(workload.avgCpuGhzPerVm, 2)} GHz/VM - typical workday usage`
            : `Using ${formatNumber(workload.peakCpuGhzPerVm, 2)} GHz/VM - boot storm / peak load`
          }
        </div>
      </CardContent>
    </Card>
  )
}
