import { Server, Network, Power, Cpu, MemoryStick, HardDrive, Database } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { HardwareConfig, ClusterComputed, VsanMode } from "@/types"
import { formatInt, formatNumber } from "@/lib/utils"

interface ServerRackVisualizationProps {
  hardware: HardwareConfig
  computed: ClusterComputed
  vsanMode?: VsanMode
}

const RACK_UNITS = 20
const SERVER_U = 2

// VERIFIED CPU DATABASE - All specs from Intel ARK and AMD official sources
// Base frequencies are EXACT - no ranges
const CPU_DATABASE = {
  intel: [
    // 5th Gen Emerald Rapids
    { model: "Xeon Platinum 8592+", gen: "5th Gen", cores: 64, baseGhz: 1.9, tdp: 350 },
    { model: "Xeon Platinum 8592V", gen: "5th Gen", cores: 64, baseGhz: 2.0, tdp: 330 },
    { model: "Xeon Platinum 8593Q", gen: "5th Gen", cores: 64, baseGhz: 2.2, tdp: 385 },
    { model: "Xeon Platinum 8580", gen: "5th Gen", cores: 60, baseGhz: 2.0, tdp: 350 },
    { model: "Xeon Platinum 8581V", gen: "5th Gen", cores: 60, baseGhz: 2.0, tdp: 270 },
    { model: "Xeon Platinum 8570", gen: "5th Gen", cores: 56, baseGhz: 2.1, tdp: 350 },
    { model: "Xeon Platinum 8571N", gen: "5th Gen", cores: 52, baseGhz: 2.4, tdp: 300 },
    { model: "Xeon Platinum 8568Y+", gen: "5th Gen", cores: 48, baseGhz: 2.3, tdp: 350 },
    { model: "Xeon Platinum 8558", gen: "5th Gen", cores: 48, baseGhz: 2.1, tdp: 330 },
    { model: "Xeon Platinum 8558P", gen: "5th Gen", cores: 48, baseGhz: 2.7, tdp: 350 },
    { model: "Xeon Platinum 8558U", gen: "5th Gen", cores: 48, baseGhz: 2.0, tdp: 300 },
    { model: "Xeon Platinum 8562Y+", gen: "5th Gen", cores: 32, baseGhz: 2.8, tdp: 300 },
    { model: "Xeon Gold 6558Q", gen: "5th Gen", cores: 32, baseGhz: 3.2, tdp: 350 },
    { model: "Xeon Gold 6554S", gen: "5th Gen", cores: 36, baseGhz: 2.2, tdp: 270 },
    { model: "Xeon Gold 6548Y+", gen: "5th Gen", cores: 32, baseGhz: 2.5, tdp: 250 },
    { model: "Xeon Gold 6548N", gen: "5th Gen", cores: 32, baseGhz: 2.8, tdp: 250 },
    { model: "Xeon Gold 6544Y", gen: "5th Gen", cores: 16, baseGhz: 3.6, tdp: 270 },
    { model: "Xeon Gold 6542Y", gen: "5th Gen", cores: 24, baseGhz: 2.9, tdp: 250 },
    { model: "Xeon Gold 6538Y+", gen: "5th Gen", cores: 32, baseGhz: 2.2, tdp: 225 },
    { model: "Xeon Gold 6538N", gen: "5th Gen", cores: 32, baseGhz: 2.1, tdp: 205 },
    { model: "Xeon Gold 6534", gen: "5th Gen", cores: 8, baseGhz: 3.9, tdp: 195 },
    { model: "Xeon Gold 6530", gen: "5th Gen", cores: 32, baseGhz: 2.1, tdp: 270 },
    { model: "Xeon Gold 6526Y", gen: "5th Gen", cores: 16, baseGhz: 2.8, tdp: 195 },
    { model: "Xeon Gold 5520+", gen: "5th Gen", cores: 28, baseGhz: 2.2, tdp: 205 },
    { model: "Xeon Gold 5515+", gen: "5th Gen", cores: 8, baseGhz: 3.2, tdp: 165 },
    { model: "Xeon Gold 5512U", gen: "5th Gen", cores: 28, baseGhz: 2.1, tdp: 185 },
    // 4th Gen Sapphire Rapids
    { model: "Xeon Platinum 8490H", gen: "4th Gen", cores: 60, baseGhz: 1.9, tdp: 350 },
    { model: "Xeon Platinum 8480+", gen: "4th Gen", cores: 56, baseGhz: 2.0, tdp: 350 },
    { model: "Xeon Platinum 8470Q", gen: "4th Gen", cores: 52, baseGhz: 2.1, tdp: 350 },
    { model: "Xeon Platinum 8470", gen: "4th Gen", cores: 52, baseGhz: 2.0, tdp: 350 },
    { model: "Xeon Platinum 8468", gen: "4th Gen", cores: 48, baseGhz: 2.1, tdp: 350 },
    { model: "Xeon Platinum 8468V", gen: "4th Gen", cores: 48, baseGhz: 2.4, tdp: 330 },
    { model: "Xeon Platinum 8461V", gen: "4th Gen", cores: 48, baseGhz: 2.2, tdp: 300 },
    { model: "Xeon Platinum 8458P", gen: "4th Gen", cores: 44, baseGhz: 2.7, tdp: 350 },
    { model: "Xeon Platinum 8460Y+", gen: "4th Gen", cores: 40, baseGhz: 2.0, tdp: 300 },
    { model: "Xeon Platinum 8460H", gen: "4th Gen", cores: 40, baseGhz: 2.2, tdp: 330 },
    { model: "Xeon Platinum 8452Y", gen: "4th Gen", cores: 36, baseGhz: 2.0, tdp: 300 },
    { model: "Xeon Platinum 8454H", gen: "4th Gen", cores: 32, baseGhz: 2.1, tdp: 270 },
    { model: "Xeon Platinum 8462Y+", gen: "4th Gen", cores: 32, baseGhz: 2.8, tdp: 300 },
    { model: "Xeon Platinum 8444H", gen: "4th Gen", cores: 16, baseGhz: 2.9, tdp: 270 },
    { model: "Xeon Gold 6458Q", gen: "4th Gen", cores: 32, baseGhz: 3.1, tdp: 350 },
    { model: "Xeon Gold 6454S", gen: "4th Gen", cores: 32, baseGhz: 2.2, tdp: 270 },
    { model: "Xeon Gold 6448Y", gen: "4th Gen", cores: 32, baseGhz: 2.1, tdp: 225 },
    { model: "Xeon Gold 6448H", gen: "4th Gen", cores: 32, baseGhz: 2.4, tdp: 250 },
    { model: "Xeon Gold 6444Y", gen: "4th Gen", cores: 16, baseGhz: 3.6, tdp: 270 },
    { model: "Xeon Gold 6442Y", gen: "4th Gen", cores: 24, baseGhz: 2.6, tdp: 225 },
    { model: "Xeon Gold 6438Y+", gen: "4th Gen", cores: 32, baseGhz: 2.0, tdp: 205 },
    { model: "Xeon Gold 6438M", gen: "4th Gen", cores: 32, baseGhz: 2.2, tdp: 205 },
    { model: "Xeon Gold 6434", gen: "4th Gen", cores: 8, baseGhz: 3.7, tdp: 195 },
    { model: "Xeon Gold 6430", gen: "4th Gen", cores: 32, baseGhz: 2.1, tdp: 270 },
    { model: "Xeon Gold 6426Y", gen: "4th Gen", cores: 16, baseGhz: 2.5, tdp: 185 },
    { model: "Xeon Gold 6418H", gen: "4th Gen", cores: 24, baseGhz: 2.1, tdp: 185 },
    { model: "Xeon Gold 6416H", gen: "4th Gen", cores: 18, baseGhz: 2.2, tdp: 165 },
    { model: "Xeon Gold 5420+", gen: "4th Gen", cores: 28, baseGhz: 2.0, tdp: 205 },
    { model: "Xeon Gold 5418Y", gen: "4th Gen", cores: 24, baseGhz: 2.0, tdp: 185 },
    { model: "Xeon Gold 5416S", gen: "4th Gen", cores: 16, baseGhz: 2.0, tdp: 150 },
    { model: "Xeon Gold 5415+", gen: "4th Gen", cores: 8, baseGhz: 2.9, tdp: 150 },
    { model: "Xeon Gold 5412U", gen: "4th Gen", cores: 24, baseGhz: 2.1, tdp: 185 },
  ],
  amd: [
    // EPYC 9004 Genoa/Bergamo - Verified specs
    { model: "EPYC 9754", gen: "4th Gen Bergamo", cores: 128, baseGhz: 2.25, tdp: 360 },
    { model: "EPYC 9654", gen: "4th Gen Genoa", cores: 96, baseGhz: 2.4, tdp: 360 },
    { model: "EPYC 9634", gen: "4th Gen Genoa", cores: 84, baseGhz: 2.25, tdp: 290 },
    { model: "EPYC 9554", gen: "4th Gen Genoa", cores: 64, baseGhz: 3.1, tdp: 360 },
    { model: "EPYC 9534", gen: "4th Gen Genoa", cores: 64, baseGhz: 2.45, tdp: 280 },
    { model: "EPYC 9474F", gen: "4th Gen Genoa", cores: 48, baseGhz: 3.6, tdp: 360 },
    { model: "EPYC 9454", gen: "4th Gen Genoa", cores: 48, baseGhz: 2.75, tdp: 290 },
    { model: "EPYC 9374F", gen: "4th Gen Genoa", cores: 32, baseGhz: 3.85, tdp: 320 },
    { model: "EPYC 9354", gen: "4th Gen Genoa", cores: 32, baseGhz: 3.25, tdp: 280 },
    { model: "EPYC 9334", gen: "4th Gen Genoa", cores: 32, baseGhz: 2.7, tdp: 210 },
    { model: "EPYC 9274F", gen: "4th Gen Genoa", cores: 24, baseGhz: 4.05, tdp: 320 },
    { model: "EPYC 9254", gen: "4th Gen Genoa", cores: 24, baseGhz: 2.9, tdp: 200 },
    { model: "EPYC 9224", gen: "4th Gen Genoa", cores: 24, baseGhz: 2.5, tdp: 200 },
    { model: "EPYC 9174F", gen: "4th Gen Genoa", cores: 16, baseGhz: 4.1, tdp: 320 },
    { model: "EPYC 9124", gen: "4th Gen Genoa", cores: 16, baseGhz: 3.0, tdp: 200 },
  ]
}

// Find best matching CPU: EXACT core match first, then closest base frequency
function findBestCpu(cpuList: typeof CPU_DATABASE.intel, coresPerSocket: number, targetBaseGhz: number) {
  // PRIORITY 1: Find CPUs with EXACT core count match
  const exactCoreMatches = cpuList.filter(cpu => cpu.cores === coresPerSocket)
  
  if (exactCoreMatches.length > 0) {
    // Among exact matches, find closest GHz
    return exactCoreMatches.reduce((best, cpu) => {
      const bestDiff = Math.abs(best.baseGhz - targetBaseGhz)
      const cpuDiff = Math.abs(cpu.baseGhz - targetBaseGhz)
      return cpuDiff < bestDiff ? cpu : best
    }, exactCoreMatches[0])
  }

  // PRIORITY 2: No exact match - find closest core count, then closest GHz
  const sortedByCoreDiff = [...cpuList].sort((a, b) => {
    const aDiff = Math.abs(a.cores - coresPerSocket)
    const bDiff = Math.abs(b.cores - coresPerSocket)
    if (aDiff !== bDiff) return aDiff - bDiff
    // If same core diff, prefer closer GHz
    return Math.abs(a.baseGhz - targetBaseGhz) - Math.abs(b.baseGhz - targetBaseGhz)
  })

  return sortedByCoreDiff[0]
}

export function ServerRackVisualization({ hardware, computed, vsanMode = "none" }: ServerRackVisualizationProps) {
  const isFailoverView = computed.capacityView === "failover"
  const failoverHosts = hardware.nPlusRedundancy
  const maxServersInRack = Math.floor((RACK_UNITS - 2) / SERVER_U)

  const racksNeeded = Math.ceil(hardware.hosts / maxServersInRack)
  
  const racks = Array.from({ length: racksNeeded }, (_, rackIndex) => {
    const startServer = rackIndex * maxServersInRack
    const serversInThisRack = Math.min(maxServersInRack, hardware.hosts - startServer)
    return Array.from({ length: serversInThisRack }, (_, i) => startServer + i)
  })

  // Calculate cores per socket (dual socket config)
  const coresPerSocket = Math.ceil(hardware.coresPerHost / 2)
  
  // Find best matching CPUs for both Intel and AMD
  const intelCpu = findBestCpu(CPU_DATABASE.intel, coresPerSocket, hardware.baseGhz)
  const amdCpu = findBestCpu(CPU_DATABASE.amd, coresPerSocket, hardware.baseGhz)
  
  // Memory calculation
  const dimmsNeeded = Math.ceil(hardware.ramPerHostGb / 64)
  
  // Storage calculation (only if vSAN enabled)
  const showStorage = vsanMode !== "none"
  const nvmeDrives = hardware.coresPerHost >= 64 ? 8 : hardware.coresPerHost >= 32 ? 6 : 4
  const driveSize = hardware.ramPerHostGb > 1024 ? "7.68TB" : hardware.ramPerHostGb > 512 ? "3.84TB" : "1.92TB"

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Server className="h-4 w-4 text-cyan-400" />
          Infrastructure
        </CardTitle>
        <div className="text-xs text-slate-400">
          {formatInt(hardware.hosts)} hosts • {racksNeeded} rack{racksNeeded > 1 ? 's' : ''} • N+{hardware.nPlusRedundancy}
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Racks container */}
        <div className="flex flex-wrap gap-2 justify-center">
          {racks.map((serverIndices, rackIndex) => (
            <RackUnit
              key={rackIndex}
              rackNumber={rackIndex + 1}
              serverIndices={serverIndices}
              hardware={hardware}
              computed={computed}
              isFailoverView={isFailoverView}
              failoverStartIndex={hardware.hosts - failoverHosts}
              totalRacks={racksNeeded}
            />
          ))}
        </div>

        {/* BOM Section */}
        <div className="border-t border-slate-700/50 pt-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
            Bill of Materials — {hardware.coresPerHost} cores @ {formatNumber(hardware.baseGhz, 2)} GHz per host
          </div>
          
          {/* CPU Options */}
          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-[10px] font-semibold text-white">Processor Options (2× sockets)</span>
              <span className="text-[9px] text-slate-500">for {coresPerSocket}c/socket</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Intel Option */}
              <div className="bg-slate-900/50 rounded p-2 border border-blue-500/20">
                <div className="text-[9px] text-blue-400 font-medium mb-1">Intel</div>
                <div className="text-[10px] text-white font-medium">{intelCpu.model}</div>
                <div className="text-[9px] text-slate-400">{intelCpu.gen}</div>
                <div className="text-[9px] mt-1">
                  <span className={intelCpu.cores === coresPerSocket ? "text-green-400" : "text-amber-400"}>
                    {intelCpu.cores}c × 2 = {intelCpu.cores * 2}c
                  </span>
                  {intelCpu.cores !== coresPerSocket && (
                    <span className="text-amber-400/70"> (closest)</span>
                  )}
                </div>
                <div className="text-[9px] text-slate-500">
                  Base: <span className="text-cyan-400 font-medium">{intelCpu.baseGhz} GHz</span> • {intelCpu.tdp}W TDP
                </div>
              </div>

              {/* AMD Option */}
              <div className="bg-slate-900/50 rounded p-2 border border-red-500/20">
                <div className="text-[9px] text-red-400 font-medium mb-1">AMD</div>
                <div className="text-[10px] text-white font-medium">{amdCpu.model}</div>
                <div className="text-[9px] text-slate-400">{amdCpu.gen}</div>
                <div className="text-[9px] mt-1">
                  <span className={amdCpu.cores === coresPerSocket ? "text-green-400" : "text-amber-400"}>
                    {amdCpu.cores}c × 2 = {amdCpu.cores * 2}c
                  </span>
                  {amdCpu.cores !== coresPerSocket && (
                    <span className="text-amber-400/70"> (closest)</span>
                  )}
                </div>
                <div className="text-[9px] text-slate-500">
                  Base: <span className="text-cyan-400 font-medium">{amdCpu.baseGhz} GHz</span> • {amdCpu.tdp}W TDP
                </div>
              </div>
            </div>
            
            {/* GHz mismatch warning */}
            {(Math.abs(intelCpu.baseGhz - hardware.baseGhz) > 0.2 || Math.abs(amdCpu.baseGhz - hardware.baseGhz) > 0.2) && (
              <div className="mt-2 text-[9px] text-amber-400/80 bg-amber-500/10 rounded px-2 py-1">
                ⚠ Your input ({formatNumber(hardware.baseGhz, 2)} GHz) doesn't match available CPUs. 
                Consider adjusting to Intel {intelCpu.baseGhz} GHz or AMD {amdCpu.baseGhz} GHz.
              </div>
            )}
          </div>

          <div className={`grid grid-cols-1 ${showStorage ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-2`}>
            {/* Memory */}
            <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-1.5">
                <MemoryStick className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[10px] font-semibold text-white">Memory</span>
              </div>
              <div className="text-[11px] text-cyan-400 font-medium">DDR5-4800 RDIMM</div>
              <div className="text-[10px] text-slate-400 mt-0.5">64GB modules • ECC</div>
              <div className="text-[10px] text-slate-500 mt-1">
                <span className="text-cyan-400">{dimmsNeeded}×</span> = {formatInt(hardware.ramPerHostGb)} GB
              </div>
            </div>

            {/* ESXi Boot Disk */}
            <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-1.5">
                <Database className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[10px] font-semibold text-white">ESXi Boot (RAID 1)</span>
              </div>
              <div className="text-[11px] text-cyan-400 font-medium">240GB M.2 SATA SSD</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Mixed-use endurance</div>
              <div className="text-[10px] text-slate-500 mt-1">
                <span className="text-cyan-400">2×</span> mirrored
              </div>
            </div>

            {/* vSAN Storage */}
            {showStorage && (
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <HardDrive className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-[10px] font-semibold text-white">vSAN {vsanMode.toUpperCase()}</span>
                </div>
                <div className="text-[11px] text-cyan-400 font-medium">{driveSize} NVMe U.2</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Mixed-use endurance</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  <span className="text-cyan-400">{nvmeDrives}×</span> per host
                </div>
              </div>
            )}
          </div>

          {/* Networking */}
          <div className="mt-2 bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Network className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-[10px] font-semibold text-white">Networking (6 ports per host)</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="bg-slate-900/50 rounded p-2 border border-slate-700/30">
                <div className="text-slate-400 mb-1">VM Traffic</div>
                <div className="text-cyan-400 font-medium">2× 25GbE</div>
                <div className="text-[9px] text-slate-500">Intel E810-XXV</div>
              </div>
              <div className="bg-slate-900/50 rounded p-2 border border-slate-700/30">
                <div className="text-slate-400 mb-1">{showStorage ? 'vSAN' : 'Storage'}</div>
                <div className="text-cyan-400 font-medium">2× 25GbE</div>
                <div className="text-[9px] text-slate-500">Mellanox CX-6 Lx</div>
              </div>
              <div className="bg-slate-900/50 rounded p-2 border border-slate-700/30">
                <div className="text-slate-400 mb-1">vMotion/Mgmt</div>
                <div className="text-cyan-400 font-medium">2× 25GbE</div>
                <div className="text-[9px] text-slate-500">Onboard/Shared</div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-700/30 text-[10px] text-slate-400">
              <span className="text-cyan-400">3× Dual-port 25GbE NICs</span> per host
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="pt-2 border-t border-slate-700/50 grid grid-cols-4 gap-2 text-[10px]">
          <div className="text-center">
            <div className="text-slate-500">Active</div>
            <div className="font-bold text-cyan-400">{computed.hostsForCapacity}</div>
          </div>
          <div className="text-center">
            <div className="text-slate-500">Cores</div>
            <div className="font-bold text-cyan-400">{formatInt(computed.totalPhysicalCores)}</div>
          </div>
          <div className="text-center">
            <div className="text-slate-500">CPU</div>
            <div className="font-bold text-cyan-400">{formatNumber(computed.cpuCapacityGhz / 1000, 1)}T</div>
          </div>
          <div className="text-center">
            <div className="text-slate-500">RAM</div>
            <div className="font-bold text-cyan-400">{formatNumber(computed.memCapacityGb / 1024, 1)}T</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RackUnit({
  rackNumber,
  serverIndices,
  hardware,
  computed,
  isFailoverView,
  failoverStartIndex,
  totalRacks,
}: {
  rackNumber: number
  serverIndices: number[]
  hardware: HardwareConfig
  computed: ClusterComputed
  isFailoverView: boolean
  failoverStartIndex: number
  totalRacks: number
}) {
  const rackWidth = totalRacks === 1 ? 'w-full max-w-[180px]' : totalRacks === 2 ? 'w-[48%] max-w-[160px]' : totalRacks === 3 ? 'w-[32%] max-w-[140px]' : 'w-[24%] max-w-[120px]'

  return (
    <div className={`${rackWidth} min-w-[100px]`}>
      <div className="text-[9px] text-slate-500 text-center mb-1">Rack {rackNumber}</div>
      
      <div className="relative bg-slate-950 rounded border border-slate-600 p-0.5">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-slate-500 via-slate-600 to-slate-500 rounded-l flex flex-col justify-between py-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-0.5 h-0.5 bg-slate-400 rounded-full mx-auto" />
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-slate-500 via-slate-600 to-slate-500 rounded-r flex flex-col justify-between py-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-0.5 h-0.5 bg-slate-400 rounded-full mx-auto" />
          ))}
        </div>

        <div className="px-2 py-0.5 space-y-0.5">
          <div className="bg-slate-800 rounded border border-slate-600 px-1 py-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Network className="h-2.5 w-2.5 text-blue-400" />
                <span className="text-[8px] font-medium text-slate-300">TOR</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            </div>
          </div>

          {serverIndices.map((serverIndex) => {
            const isStandby = isFailoverView && serverIndex >= failoverStartIndex
            return (
              <ServerSlot
                key={serverIndex}
                index={serverIndex}
                isActive={!isStandby}
                hardware={hardware}
                cpuUtil={computed.cpuUtil}
                memUtil={computed.memUtil}
              />
            )
          })}

          <div className="bg-slate-800 rounded border border-slate-600 px-1 py-0.5 flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <Power className="h-2 w-2 text-amber-400" />
              <span className="text-[7px] text-slate-400">PDU</span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: Math.min(serverIndices.length, 4) }).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-amber-500" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ServerSlot({
  index,
  isActive,
  hardware,
  cpuUtil,
  memUtil,
}: {
  index: number
  isActive: boolean
  hardware: HardwareConfig
  cpuUtil: number
  memUtil: number
}) {
  return (
    <div 
      className={`
        rounded border px-1 py-0.5 transition-all
        ${isActive 
          ? "bg-slate-800/80 border-slate-600" 
          : "bg-slate-900/50 border-amber-500/30 opacity-60"
        }
      `}
    >
      <div className="flex items-center gap-1">
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-green-500" : "bg-amber-500"}`} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className={`text-[8px] font-medium ${isActive ? "text-slate-200" : "text-slate-500"}`}>
              ESXi-{String(index + 1).padStart(2, '0')}
            </span>
            {!isActive && (
              <span className="text-[6px] text-amber-400 bg-amber-500/20 px-0.5 rounded">HA</span>
            )}
          </div>
          <div className="text-[6px] text-slate-500">
            {hardware.coresPerHost}c • {hardware.ramPerHostGb}G
          </div>
        </div>

        {isActive && (
          <div className="flex flex-col gap-px w-6">
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${cpuUtil > 85 ? "bg-red-500" : cpuUtil > 70 ? "bg-amber-500" : "bg-cyan-500"}`}
                style={{ width: `${Math.min(cpuUtil, 100)}%` }}
              />
            </div>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${memUtil > 85 ? "bg-red-500" : memUtil > 70 ? "bg-amber-500" : "bg-cyan-500"}`}
                style={{ width: `${Math.min(memUtil, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
