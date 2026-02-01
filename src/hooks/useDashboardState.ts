import { useState, useCallback } from "react"
import type { 
  HardwareConfig, 
  WorkloadProfile, 
  CpuModeSettings, 
  SystemOverhead, 
  InfraVm,
  CpuMode,
  CapacityView,
  VsanMode,
  UserProfile,
} from "@/types"
import { 
  DEFAULT_HARDWARE, 
  DEFAULT_WORKLOAD, 
  DEFAULT_CPU_MODE, 
  DEFAULT_SYSTEM_OVERHEAD, 
  DEFAULT_INFRA_VMS,
  USER_PROFILES,
} from "@/constants"
import { clamp } from "@/lib/utils"

/**
 * Hook to manage all dashboard state
 */
export function useDashboardState() {
  // Hardware configuration
  const [hardware, setHardware] = useState<HardwareConfig>(DEFAULT_HARDWARE)
  
  // Workload profile
  const [workload, setWorkload] = useState<WorkloadProfile>(DEFAULT_WORKLOAD)
  
  // CPU mode settings
  const [cpuModeSettings, setCpuModeSettings] = useState<CpuModeSettings>(DEFAULT_CPU_MODE)
  
  // System overhead
  const [systemOverhead, setSystemOverhead] = useState<SystemOverhead>(DEFAULT_SYSTEM_OVERHEAD)
  
  // Infrastructure VMs
  const [infraVms, setInfraVms] = useState<InfraVm[]>(DEFAULT_INFRA_VMS)

  // Hardware update handlers
  const updateHardware = useCallback((updates: Partial<HardwareConfig>) => {
    setHardware((prev) => {
      const next = { ...prev, ...updates }
      // Ensure N+ redundancy doesn't exceed available hosts - 1
      if (updates.hosts !== undefined) {
        next.nPlusRedundancy = clamp(prev.nPlusRedundancy, 1, Math.max(1, next.hosts - 1))
      }
      return next
    })
  }, [])

  // Workload update handlers
  const updateWorkload = useCallback((updates: Partial<WorkloadProfile>) => {
    setWorkload((prev) => ({ ...prev, ...updates }))
  }, [])

  // User profile change handler - updates VM specs based on profile
  const updateUserProfile = useCallback((profile: UserProfile) => {
    const spec = USER_PROFILES[profile]
    setWorkload((prev) => ({
      ...prev,
      userProfile: profile,
      vCpuPerVm: spec.vcpus,
      ramGbPerVm: spec.memoryGb,
      avgCpuGhzPerVm: spec.avgCpuGhz,
      peakCpuGhzPerVm: spec.peakCpuGhz,
    }))
  }, [])

  // CPU mode update handlers
  const updateCpuMode = useCallback((mode: CpuMode) => {
    setCpuModeSettings((prev) => ({ ...prev, cpuMode: mode }))
  }, [])

  // Capacity view update handler
  const updateCapacityView = useCallback((view: CapacityView) => {
    setCpuModeSettings((prev) => ({ ...prev, capacityView: view }))
  }, [])

  // System overhead update handlers
  const updateSystemOverhead = useCallback((updates: Partial<SystemOverhead>) => {
    setSystemOverhead((prev) => ({ ...prev, ...updates }))
  }, [])

  const updateVsanMode = useCallback((mode: VsanMode) => {
    setSystemOverhead((prev) => ({ ...prev, vsanMode: mode }))
  }, [])

  // Infrastructure VM update handlers
  const updateInfraVm = useCallback((key: string, updates: Partial<InfraVm>) => {
    setInfraVms((prev) =>
      prev.map((vm) => (vm.key === key ? { ...vm, ...updates } : vm))
    )
  }, [])

  return {
    // State
    hardware,
    workload,
    cpuModeSettings,
    systemOverhead,
    infraVms,
    
    // Handlers
    updateHardware,
    updateWorkload,
    updateUserProfile,
    updateCpuMode,
    updateCapacityView,
    updateSystemOverhead,
    updateVsanMode,
    updateInfraVm,
  }
}
