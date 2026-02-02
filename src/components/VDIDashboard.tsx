import { useDashboardState, useInfraTotals, useClusterCalculations } from "@/hooks"
import {
  DashboardHeader,
  TopTilesSection,
  ResourceUtilizationCard,
  HardwareConfigCard,
  WorkloadProfileCard,
  SystemOverheadCard,
  ManagementVmsCard,
  ServerRackVisualization,
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
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-[1800px] px-4 py-6">
        {/* Header */}
        <DashboardHeader />

        {/* Top Summary Tiles */}
        <TopTilesSection 
          hardware={hardware} 
          computed={computed} 
        />

        {/* Main Content */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-4">
          
          {/* Left Column - Resource Utilization (sticky on large screens) */}
          <div className="xl:col-span-3">
            <div className="xl:sticky xl:top-4">
              <ResourceUtilizationCard
                computed={computed}
                infraTotals={infraTotals}
                cpuModeSettings={cpuModeSettings}
                hardware={hardware}
                vsanMode={systemOverhead.vsanMode}
                vsanCpuOverheadPct={systemOverhead.vsanCpuOverheadPct}
                vmCount={workload.vmCount}
                onRefresh={handleRefresh}
                onUpdateCapacityView={updateCapacityView}
              />
            </div>
          </div>

          {/* Middle Column - Config Cards */}
          <div className="xl:col-span-6 space-y-4">
            {/* Config Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>

            {/* Management VMs - Full width */}
            <ManagementVmsCard
              infraVms={infraVms}
              infraTotals={infraTotals}
              onUpdateInfraVm={updateInfraVm}
            />
          </div>

          {/* Right Column - Server Rack */}
          <div className="xl:col-span-3">
            <ServerRackVisualization
              hardware={hardware}
              computed={computed}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-500">
          VDI Sizing Validator — Powered by TeraSky • Calculations based on LoginVSI benchmarks and Omnissa documentation
        </div>
      </div>
    </div>
  )
}
