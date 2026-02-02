/**
 * User profile types based on LoginVSI benchmarks
 */
export type UserProfile = "task_worker" | "knowledge_worker" | "power_user" | "heavy_graphics"

/**
 * User profile specifications from industry benchmarks
 */
export interface UserProfileSpec {
  name: string
  description: string
  vcpus: number
  memoryGb: number
  avgCpuGhz: number
  peakCpuGhz: number
  vcpuRatioMin: number
  vcpuRatioRecommended: number
  vcpuRatioMax: number
  usersPerCore: number
}

/**
 * Infrastructure/Management VM configuration
 */
export interface InfraVm {
  key: string
  label: string
  enabled: boolean
  count: number
  vcpu: number
  ramGb: number
  note?: string
}

/**
 * Hardware configuration for the cluster
 */
export interface HardwareConfig {
  hosts: number
  nPlusRedundancy: number  // N+1, N+2, etc. - how many host failures to tolerate
  coresPerHost: number
  baseGhz: number
  ramPerHostGb: number
}

/**
 * VDI workload profile configuration
 */
export interface WorkloadProfile {
  vmCount: number
  userProfile: UserProfile
  vCpuPerVm: number
  ramGbPerVm: number
  avgCpuGhzPerVm: number
  peakCpuGhzPerVm: number
  concurrencyPercent: number
}

/**
 * CPU demand mode settings
 */
export type CpuMode = "peak" | "average"

/**
 * Capacity view mode - normal operation vs failover scenario
 */
export type CapacityView = "normal" | "failover"

export interface CpuModeSettings {
  cpuMode: CpuMode
  capacityView: CapacityView
}

/**
 * vSAN storage mode
 */
export type VsanMode = "none" | "osa" | "esa"

/**
 * System overhead configuration
 */
export interface SystemOverhead {
  esxiOverheadGbPerHost: number
  vmMemoryOverheadMb: number
  vsanMode: VsanMode
  vsanCpuOverheadPct: number
}

/**
 * DEM Storage configuration
 */
export interface DemStorage {
  profilesEnabled: boolean
  profileSizeGbPerUser: number
  userDataEnabled: boolean
  userDataSizeGbPerUser: number
}

/**
 * Calculated infrastructure totals
 */
export interface InfraTotals {
  infraVmCount: number
  infraVcpu: number
  infraRamGb: number
}

/**
 * Computed cluster resource calculations
 */
export interface ClusterComputed {
  // Host calculations
  totalHosts: number
  hostsForCapacity: number  // All hosts in normal mode, N-X in failover mode
  totalPhysicalCores: number
  capacityView: CapacityView
  
  // VDI VM totals
  concurrentVms: number
  vdiVCpu: number
  vdiRamGb: number
  vdiCpuDemandGhz: number
  
  // Combined totals
  totalVCpu: number
  totalRamDemandGb: number
  totalCpuDemandGhz: number
  
  // Overhead (calculated for capacity hosts)
  systemOverheadGb: number
  vsanOverheadGb: number
  vmOverheadGb: number
  
  // Capacity (based on capacity view)
  memCapacityGb: number
  cpuCapacityGhz: number
  
  // Utilization
  memConsumedGb: number
  memUtil: number
  cpuUtil: number
  vcpuRatio: number
  vmsPerHost: number
  
  // Cluster raw totals (always full cluster)
  clusterMemRawTb: number
  clusterCpuRawThz: number
  
  // Assessment
  cpuAssessment: "OPTIMAL" | "ACCEPTABLE" | "WARNING" | "CRITICAL"
  memAssessment: "OPTIMAL" | "ACCEPTABLE" | "WARNING" | "CRITICAL"
}

/**
 * Complete dashboard state
 */
export interface DashboardState {
  hardware: HardwareConfig
  workload: WorkloadProfile
  cpuMode: CpuModeSettings
  systemOverhead: SystemOverhead
  infraVms: InfraVm[]
}
