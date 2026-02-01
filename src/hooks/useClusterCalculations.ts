import { useMemo } from "react"
import type { 
  HardwareConfig, 
  WorkloadProfile, 
  CpuModeSettings, 
  SystemOverhead, 
  InfraTotals, 
  ClusterComputed 
} from "@/types"
import { gbToTb, ghzToThz } from "@/lib/utils"
import { VSAN_MEM_OVERHEAD, UTILIZATION_THRESHOLDS } from "@/constants"

interface UseClusterCalculationsProps {
  hardware: HardwareConfig
  workload: WorkloadProfile
  cpuModeSettings: CpuModeSettings
  systemOverhead: SystemOverhead
  infraTotals: InfraTotals
}

/**
 * Get assessment level based on utilization percentage
 */
function getAssessment(util: number, thresholds: { optimal: number; acceptable: number; warning: number }) {
  if (util <= thresholds.optimal) return "OPTIMAL" as const
  if (util <= thresholds.acceptable) return "ACCEPTABLE" as const
  if (util <= thresholds.warning) return "WARNING" as const
  return "CRITICAL" as const
}

/**
 * Hook to calculate cluster resource utilization using N+1 driven methodology
 * 
 * Capacity Views:
 * - Normal: All hosts are active and contributing to capacity
 * - Failover: Shows capacity after N host failures (N+1 means 1 host fails)
 * 
 * This is the correct VMware HA model:
 * - All hosts run VMs during normal operation
 * - When a host fails, VMs restart on remaining hosts
 * - N+1 means you can tolerate 1 host failure
 * 
 * Sources: Login VSI, Cisco UCS VDI Guide, Dell VxRail Guide, Broadcom KB
 */
export function useClusterCalculations({
  hardware,
  workload,
  cpuModeSettings,
  systemOverhead,
  infraTotals,
}: UseClusterCalculationsProps): ClusterComputed {
  return useMemo(() => {
    const { hosts, nPlusRedundancy, coresPerHost, baseGhz, ramPerHostGb } = hardware
    const { vmCount, vCpuPerVm, ramGbPerVm, avgCpuGhzPerVm, peakCpuGhzPerVm, concurrencyPercent } = workload
    const { cpuMode, capacityView } = cpuModeSettings
    const { esxiOverheadGbPerHost, vmMemoryOverheadMb, vsanMode, vsanCpuOverheadPct } = systemOverhead

    const vsanMemGbPerHost = VSAN_MEM_OVERHEAD[vsanMode] ?? 0
    
    // ===== Host Calculations =====
    const totalHosts = hosts
    // In normal mode: all hosts contribute capacity
    // In failover mode: capacity is reduced (simulating N host failures)
    const hostsForCapacity = capacityView === "normal" 
      ? hosts 
      : Math.max(hosts - nPlusRedundancy, 1)
    
    const totalPhysicalCores = hostsForCapacity * coresPerHost

    // ===== VDI VM Calculations =====
    // Apply concurrency factor (not all users may be active simultaneously)
    const concurrentVms = Math.ceil(vmCount * (concurrencyPercent / 100))
    
    // vCPU totals
    const vdiVCpu = concurrentVms * vCpuPerVm
    
    // Memory: configured RAM (no reduction for concurrency - VMs stay provisioned)
    const vdiRamGb = vmCount * ramGbPerVm
    
    // CPU demand in GHz based on mode (average for typical, peak for stress testing)
    const cpuGhzPerVm = cpuMode === "peak" ? peakCpuGhzPerVm : avgCpuGhzPerVm
    const vdiCpuDemandGhz = concurrentVms * cpuGhzPerVm

    // ===== Infrastructure VM Calculations =====
    // Infra VMs typically run at 20-35% of their allocated CPU
    const infraCpuFactor = cpuMode === "peak" ? 0.5 : 0.25
    const infraCpuDemandGhz = infraTotals.infraVcpu * baseGhz * infraCpuFactor

    // ===== Combined Totals =====
    const totalVCpu = vdiVCpu + infraTotals.infraVcpu
    
    // ===== Memory Overhead Calculations =====
    // ESXi host overhead (for capacity hosts)
    const systemOverheadGb = hostsForCapacity * esxiOverheadGbPerHost
    
    // vSAN overhead (for capacity hosts)
    const vsanOverheadGb = hostsForCapacity * vsanMemGbPerHost
    
    // Per-VM overhead (ESXi needs memory to run each VM)
    const vmOverheadGb = (vmCount * vmMemoryOverheadMb) / 1024

    // Total memory consumed (demand side - doesn't change with capacity view)
    const totalRamDemandGb = vdiRamGb + infraTotals.infraRamGb
    const memConsumedGb = totalRamDemandGb + systemOverheadGb + vsanOverheadGb + vmOverheadGb

    // ===== CPU Calculations =====
    // Apply vSAN CPU overhead if enabled
    const vsanCpuMultiplier = vsanMode === "none" ? 1 : 1 + vsanCpuOverheadPct / 100
    const totalCpuDemandGhz = (vdiCpuDemandGhz + infraCpuDemandGhz) * vsanCpuMultiplier

    // ===== Capacity Calculations =====
    // Capacity is based on hostsForCapacity (all hosts normally, N-X in failover)
    const cpuCapacityGhz = hostsForCapacity * coresPerHost * baseGhz
    const memCapacityGb = hostsForCapacity * ramPerHostGb

    // ===== Utilization =====
    const cpuUtil = cpuCapacityGhz > 0 ? (totalCpuDemandGhz / cpuCapacityGhz) * 100 : 0
    const memUtil = memCapacityGb > 0 ? (memConsumedGb / memCapacityGb) * 100 : 0

    // ===== Consolidation Metrics =====
    const vcpuRatio = totalPhysicalCores > 0 ? totalVCpu / totalPhysicalCores : 0
    const vmsPerHost = hostsForCapacity > 0 ? Math.ceil(vmCount / hostsForCapacity) : 0

    // ===== Cluster Raw Totals (always full cluster) =====
    const clusterMemRawTb = gbToTb(hosts * ramPerHostGb)
    const clusterCpuRawThz = ghzToThz(hosts * coresPerHost * baseGhz)

    // ===== Assessments =====
    const cpuAssessment = getAssessment(cpuUtil, UTILIZATION_THRESHOLDS.cpu)
    const memAssessment = getAssessment(memUtil, UTILIZATION_THRESHOLDS.memory)

    return {
      totalHosts,
      hostsForCapacity,
      totalPhysicalCores,
      capacityView,
      concurrentVms,
      vdiVCpu,
      vdiRamGb,
      vdiCpuDemandGhz,
      totalVCpu,
      totalRamDemandGb,
      totalCpuDemandGhz,
      systemOverheadGb,
      vsanOverheadGb,
      vmOverheadGb,
      memCapacityGb,
      cpuCapacityGhz,
      memConsumedGb,
      memUtil,
      cpuUtil,
      vcpuRatio,
      vmsPerHost,
      clusterMemRawTb,
      clusterCpuRawThz,
      cpuAssessment,
      memAssessment,
    }
  }, [hardware, workload, cpuModeSettings, systemOverhead, infraTotals])
}
