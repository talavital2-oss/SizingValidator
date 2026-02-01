import { useDashboardState, useInfraTotals, useClusterCalculations } from "@/hooks"
import {
  DashboardHeader,
  TopTilesSection,
  ResourceUtilizationCard,
  HardwareConfigCard,
  WorkloadProfileCard,
  SystemOverheadCard,
  ManagementVmsCard,
} from "@/components/dashboard"

export function VDIDashboard() {
  const {
    hardware,
    workload,
    cpuModeSettings,
    systemOverhead,
    infraVms,
    updateHardware,
    updateWorkload,
    updateUserProfile,
    updateCpuMode,
    updateCapacityView,
    updateSystemOverhead,
    updateVsanMode,
    updateInfraVm,
  } = useDashboardState()

  const infraTotals = useInfraTotals(infraVms)

  const computed = useClusterCalculations({
    hardware,
    workload,
    cpuModeSettings,
    systemOverhead,
    infraTotals,
  })

  const handleRefresh = () => {
    console.log("Refreshing cluster data...")
  }

  return (
    <div className="min-h-screen w-full bg-[#F6F7F9]">
      <div className="mx-auto max-w-6xl px-4 py-7">
        {/* Header */}
        <DashboardHeader />

        {/* Top Summary Tiles */}
        <TopTilesSection 
          hardware={hardware} 
          computed={computed} 
        />

        {/* Main Content Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Left Column - Resource Utilization (2 cols) */}
          <ResourceUtilizationCard
            computed={computed}
            infraTotals={infraTotals}
            cpuModeSettings={cpuModeSettings}
            hardware={hardware}
            vsanMode={systemOverhead.vsanMode}
            vsanCpuOverheadPct={systemOverhead.vsanCpuOverheadPct}
            vmCount={workload.vmCount}
            userProfile={workload.userProfile}
            concurrencyPercent={workload.concurrencyPercent}
            onRefresh={handleRefresh}
            onUpdateCapacityView={updateCapacityView}
          />

          {/* Right Column - Configuration Panels */}
          <div className="space-y-4">
            <HardwareConfigCard
              hardware={hardware}
              computed={computed}
              onUpdate={updateHardware}
            />

            <WorkloadProfileCard
              workload={workload}
              hardware={hardware}
              cpuModeSettings={cpuModeSettings}
              onUpdateWorkload={updateWorkload}
              onUpdateUserProfile={updateUserProfile}
              onUpdateCpuMode={updateCpuMode}
              onUpdateNPlusRedundancy={(v) => updateHardware({ nPlusRedundancy: v })}
            />

            <SystemOverheadCard
              systemOverhead={systemOverhead}
              onUpdateSystemOverhead={updateSystemOverhead}
              onUpdateVsanMode={updateVsanMode}
            />

            <ManagementVmsCard
              infraVms={infraVms}
              infraTotals={infraTotals}
              onUpdateInfraVm={updateInfraVm}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-xs text-slate-400">
          VDI Sizing Validator — Calculations based on LoginVSI benchmarks, Cisco UCS VDI Guide, 
          Dell VxRail Guide, and Omnissa documentation. N+1 driven capacity planning.
        </div>
      </div>
    </div>
  )
}
