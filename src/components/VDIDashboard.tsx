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

  // Calculate how many racks we need for dynamic layout
  const maxServersPerRack = 9
  const racksNeeded = Math.ceil(hardware.hosts / maxServersPerRack)
  
  // Determine right column size based on rack count
  const getRightColSpan = () => {
    if (racksNeeded <= 1) return 'xl:col-span-2'
    if (racksNeeded <= 2) return 'xl:col-span-3'
    if (racksNeeded <= 3) return 'xl:col-span-4'
    return 'xl:col-span-5'
  }
  
  const getMiddleColSpan = () => {
    if (racksNeeded <= 1) return 'xl:col-span-7'
    if (racksNeeded <= 2) return 'xl:col-span-6'
    if (racksNeeded <= 3) return 'xl:col-span-5'
    return 'xl:col-span-4'
  }

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-[1920px] px-4 py-6">
        {/* Header */}
        <DashboardHeader />

        {/* Top Summary Tiles */}
        <TopTilesSection 
          hardware={hardware} 
          computed={computed} 
        />

        {/* Main Content */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-4">
          
          {/* Left Column - Resource Utilization */}
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
          <div className={`${getMiddleColSpan()} space-y-4`}>
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

            {/* Management VMs */}
            <ManagementVmsCard
              infraVms={infraVms}
              infraTotals={infraTotals}
              onUpdateInfraVm={updateInfraVm}
            />
          </div>

          {/* Right Column - Server Rack (dynamic width) */}
          <div className={getRightColSpan()}>
            <ServerRackVisualization
              hardware={hardware}
              computed={computed}
              vsanMode={systemOverhead.vsanMode}
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
