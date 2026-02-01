import type { HardwareConfig, WorkloadProfile, CpuModeSettings, SystemOverhead, InfraVm, UserProfile, UserProfileSpec } from "@/types"

/**
 * User profile specifications from LoginVSI benchmarks and vendor guides
 * Sources: Login VSI, Cisco UCS VDI Guide, Dell VxRail Guide, Lenovo ThinkAgile
 */
export const USER_PROFILES: Record<UserProfile, UserProfileSpec> = {
  task_worker: {
    name: "Task Worker",
    description: "Basic users: kiosk, data entry, call center, single app focus",
    vcpus: 1,
    memoryGb: 4,
    avgCpuGhz: 0.3,
    peakCpuGhz: 0.6,
    vcpuRatioMin: 8,
    vcpuRatioRecommended: 10,
    vcpuRatioMax: 12,
    usersPerCore: 5.0,
  },
  knowledge_worker: {
    name: "Knowledge Worker",
    description: "Office 365, Teams/Zoom, email, web apps, light multitasking",
    vcpus: 2,
    memoryGb: 8,
    avgCpuGhz: 0.5,
    peakCpuGhz: 1.2,
    vcpuRatioMin: 5,
    vcpuRatioRecommended: 6,
    vcpuRatioMax: 8,
    usersPerCore: 3.125,
  },
  power_user: {
    name: "Power User",
    description: "Developers, analysts, heavy multitaskers, IDEs, databases",
    vcpus: 4,
    memoryGb: 16,
    avgCpuGhz: 0.8,
    peakCpuGhz: 2.0,
    vcpuRatioMin: 3,
    vcpuRatioRecommended: 4,
    vcpuRatioMax: 5,
    usersPerCore: 2.5,
  },
  heavy_graphics: {
    name: "Heavy Graphics",
    description: "CAD, video editing, 3D rendering (requires GPU)",
    vcpus: 4,
    memoryGb: 32,
    avgCpuGhz: 1.2,
    peakCpuGhz: 3.0,
    vcpuRatioMin: 2,
    vcpuRatioRecommended: 3,
    vcpuRatioMax: 4,
    usersPerCore: 1.5,
  },
}

/**
 * Default hardware configuration
 */
export const DEFAULT_HARDWARE: HardwareConfig = {
  hosts: 4,
  nPlusRedundancy: 1,  // N+1 = tolerate 1 host failure
  coresPerHost: 48,
  baseGhz: 2.9,
  ramPerHostGb: 512,
}

/**
 * Default workload profile - Knowledge Worker
 */
export const DEFAULT_WORKLOAD: WorkloadProfile = {
  vmCount: 100,
  userProfile: "knowledge_worker",
  vCpuPerVm: USER_PROFILES.knowledge_worker.vcpus,
  ramGbPerVm: USER_PROFILES.knowledge_worker.memoryGb,
  avgCpuGhzPerVm: USER_PROFILES.knowledge_worker.avgCpuGhz,
  peakCpuGhzPerVm: USER_PROFILES.knowledge_worker.peakCpuGhz,
  concurrencyPercent: 100,
}

/**
 * Default CPU mode settings
 */
export const DEFAULT_CPU_MODE: CpuModeSettings = {
  cpuMode: "average",
  capacityView: "normal",  // Show normal operation by default
}

/**
 * Default system overhead settings
 * ESXi overhead: 16GB typical for small hosts (scale up for 512GB+ hosts)
 * VM overhead: ~100MB per VM average (varies by vCPU count)
 */
export const DEFAULT_SYSTEM_OVERHEAD: SystemOverhead = {
  esxiOverheadGbPerHost: 16,
  vmMemoryOverheadMb: 100,
  vsanMode: "none",
  vsanCpuOverheadPct: 10,
}

/**
 * Default infrastructure/management VMs based on Omnissa documentation
 */
export const DEFAULT_INFRA_VMS: InfraVm[] = [
  {
    key: "vcsa",
    label: "vCenter Server Appliance (Tiny)",
    enabled: true,
    count: 1,
    vcpu: 2,
    ramGb: 14,
    note: "Tiny (up to ~10 hosts / 100 VMs)",
  },
  {
    key: "cs",
    label: "Horizon Connection Server",
    enabled: true,
    count: 2,
    vcpu: 4,
    ramGb: 10,
    note: "2 for redundancy (10GB standard, 16GB large)",
  },
  {
    key: "uag",
    label: "Unified Access Gateway (Standard)",
    enabled: true,
    count: 2,
    vcpu: 2,
    ramGb: 4,
    note: "2 for redundancy",
  },
  {
    key: "sql",
    label: "SQL Server (events / AV DB)",
    enabled: true,
    count: 1,
    vcpu: 4,
    ramGb: 16,
    note: "Per Omnissa SQL requirements",
  },
  {
    key: "avm",
    label: "App Volumes Manager",
    enabled: false,
    count: 1,
    vcpu: 4,
    ramGb: 4,
    note: "Per Omnissa sizing docs",
  },
  {
    key: "enroll",
    label: "Horizon Enrollment Server (True SSO)",
    enabled: false,
    count: 1,
    vcpu: 2,
    ramGb: 4,
    note: "4GB minimum per Omnissa docs",
  },
]

/**
 * vSAN memory overhead per host by mode
 * OSA: ~10GB typical (formula-based, varies by disk groups)
 * ESA: 128GB minimum requirement
 */
export const VSAN_MEM_OVERHEAD: Record<string, number> = {
  none: 0,
  osa: 10,
  esa: 128,
}

/**
 * Hardware configuration limits
 */
export const HARDWARE_LIMITS = {
  hosts: { min: 2, max: 32 },
  ramPerHostGb: { min: 256, max: 2048, step: 128 },
  coresPerHost: { min: 16, max: 128, step: 8 },
  baseGhz: { min: 2.0, max: 4.0, step: 0.1 },
}

/**
 * Workload configuration limits
 */
export const WORKLOAD_LIMITS = {
  vmCount: { min: 1, max: 10000 },
  vCpuPerVm: { min: 1, max: 16 },
  ramGbPerVm: { min: 2, max: 64 },
  avgCpuGhzPerVm: { min: 0.1, max: 3.0, step: 0.05 },
  peakCpuGhzPerVm: { min: 0.2, max: 4.0, step: 0.1 },
  concurrencyPercent: { min: 50, max: 100 },
}

/**
 * Utilization thresholds for assessments
 */
export const UTILIZATION_THRESHOLDS = {
  cpu: {
    optimal: 60,
    acceptable: 75,
    warning: 85,
  },
  memory: {
    optimal: 70,
    acceptable: 80,
    warning: 90,
  },
}
