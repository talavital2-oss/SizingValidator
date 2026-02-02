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

// CPU database - Intel and AMD with base frequencies
const CPU_DATABASE = {
  intel: [
    { model: "Intel Xeon Platinum 8592+", gen: "5th Gen (Emerald Rapids)", cores: 64, baseGhz: 1.9, turboGhz: 3.9, tdp: 350 },
    { model: "Intel Xeon Platinum 8490H", gen: "4th Gen (Sapphire Rapids)", cores: 60, baseGhz: 1.9, turboGhz: 3.5, tdp: 350 },
    { model: "Intel Xeon Platinum 8480+", gen: "4th Gen (Sapphire Rapids)", cores: 56, baseGhz: 2.0, turboGhz: 3.8, tdp: 350 },
    { model: "Intel Xeon Platinum 8558", gen: "5th Gen (Emerald Rapids)", cores: 48, baseGhz: 2.1, turboGhz: 4.0, tdp: 330 },
    { model: "Intel Xeon Platinum 8470", gen: "4th Gen (Sapphire Rapids)", cores: 52, baseGhz: 2.0, turboGhz: 3.8, tdp: 350 },
    { model: "Intel Xeon Platinum 8460Y+", gen: "4th Gen (Sapphire Rapids)", cores: 40, baseGhz: 2.0, turboGhz: 3.7, tdp: 300 },
    { model: "Intel Xeon Platinum 8452Y", gen: "4th Gen (Sapphire Rapids)", cores: 36, baseGhz: 2.0, turboGhz: 3.2, tdp: 300 },
    { model: "Intel Xeon Gold 6538Y+", gen: "5th Gen (Emerald Rapids)", cores: 32, baseGhz: 2.2, turboGhz: 4.0, tdp: 225 },
    { model: "Intel Xeon Gold 6448Y", gen: "4th Gen (Sapphire Rapids)", cores: 32, baseGhz: 2.1, turboGhz: 4.1, tdp: 225 },
    { model: "Intel Xeon Gold 6448H", gen: "4th Gen (Sapphire Rapids)", cores: 32, baseGhz: 2.4, turboGhz: 4.2, tdp: 250 },
    { model: "Intel Xeon Gold 6430", gen: "4th Gen (Sapphire Rapids)", cores: 32, baseGhz: 2.1, turboGhz: 3.4, tdp: 270 },
    { model: "Intel Xeon Gold 6438Y+", gen: "4th Gen (Sapphire Rapids)", cores: 32, baseGhz: 2.0, turboGhz: 4.0, tdp: 205 },
    { model: "Intel Xeon Gold 5420+", gen: "4th Gen (Sapphire Rapids)", cores: 28, baseGhz: 2.0, turboGhz: 4.1, tdp: 205 },
    { model: "Intel Xeon Gold 6416H", gen: "4th Gen (Sapphire Rapids)", cores: 18, baseGhz: 2.2, turboGhz: 4.2, tdp: 165 },
    { model: "Intel Xeon Gold 6426Y", gen: "4th Gen (Sapphire Rapids)", cores: 16, baseGhz: 2.5, turboGhz: 4.1, tdp: 185 },
    { model: "Intel Xeon Gold 5416S", gen: "4th Gen (Sapphire Rapids)", cores: 16, baseGhz: 2.0, turboGhz: 4.0, tdp: 150 },
    { model: "Intel Xeon Gold 5415+", gen: "4th Gen (Sapphire Rapids)", cores: 8, baseGhz: 2.9, turboGhz: 4.1, tdp: 150 },
  ],
  amd: [
    { model: "AMD EPYC 9754", gen: "4th Gen (Bergamo)", cores: 128, baseGhz: 2.25, turboGhz: 3.1, tdp: 360 },
    { model: "AMD EPYC 9654", gen: "4th Gen (Genoa)", cores: 96, baseGhz: 2.4, turboGhz: 3.55, tdp: 360 },
    { model: "AMD EPYC 9634", gen: "4th Gen (Genoa)", cores: 84, baseGhz: 2.25, turboGhz: 3.7, tdp: 290 },
    { model: "AMD EPYC 9554", gen: "4th Gen (Genoa)", cores: 64, baseGhz: 3.1, turboGhz: 3.75, tdp: 360 },
    { model: "AMD EPYC 9534", gen: "4th Gen (Genoa)", cores: 64, baseGhz: 2.45, turboGhz: 3.7, tdp: 280 },
    { model: "AMD EPYC 9474F", gen: "4th Gen (Genoa)", cores: 48, baseGhz: 3.6, turboGhz: 4.1, tdp: 360 },
    { model: "AMD EPYC 9454", gen: "4th Gen (Genoa)", cores: 48, baseGhz: 2.75, turboGhz: 3.8, tdp: 290 },
    { model: "AMD EPYC 9354", gen: "4th Gen (Genoa)", cores: 32, baseGhz: 3.25, turboGhz: 3.8, tdp: 280 },
    { model: "AMD EPYC 9334", gen: "4th Gen (Genoa)", cores: 32, baseGhz: 2.7, turboGhz: 3.9, tdp: 210 },
    { model: "AMD EPYC 9254", gen: "4th Gen (Genoa)", cores: 24, baseGhz: 2.9, turboGhz: 4.15, tdp: 200 },
    { model: "AMD EPYC 9224", gen: "4th Gen (Genoa)", cores: 24, baseGhz: 2.5, turboGhz: 3.7, tdp: 200 },
    { model: "AMD EPYC 9124", gen: "4th Gen (Genoa)", cores: 16, baseGhz: 3.0, turboGhz: 3.7, tdp: 200 },
  ]
}

// Find best matching CPU from a vendor based on cores and base GHz
function findBestCpu(cpuList: typeof CPU_DATABASE.intel, coresPerSocket: number, baseGhz: number) {
  // Filter CPUs that have enough cores
  const validCpus = cpuList.filter(cpu => cpu.cores >= coresPerSocket)
  
  if (validCpus.length === 0) {
    return cpuList[0] // Return highest core count if none match
  }

  // Find closest match by base GHz among valid CPUs
  let bestMatch = validCpus[0]
  let bestDiff = Math.abs(validCpus[0].baseGhz - baseGhz)
  
  for (const cpu of validCpus) {
    const diff = Math.abs(cpu.baseGhz - baseGhz)
    // Prefer closer GHz match, but also prefer fewer excess cores
    const coreOverhead = cpu.cores - coresPerSocket
    const score = diff + (coreOverhead * 0.01)
    const bestScore = bestDiff + ((bestMatch.cores - coresPerSocket) * 0.01)
    
    if (score < bestScore) {
      bestDiff = diff
      bestMatch = cpu
    }
  }

  return bestMatch
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

  const coresPerSocket = Math.ceil(hardware.coresPerHost / 2)
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
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Bill of Materials (per host)</div>
          
          {/* CPU Options - Intel and AMD */}
          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-[10px] font-semibold text-white">Processor Options</span>
              <span className="text-[9px] text-slate-500">(2× sockets for {hardware.coresPerHost} cores @ {formatNumber(hardware.baseGhz, 1)} GHz)</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Intel Option */}
              <div className="bg-slate-900/50 rounded p-2 border border-blue-500/20">
                <div className="text-[9px] text-blue-400 font-medium mb-1">Intel Option</div>
                <div className="text-[10px] text-white font-medium">{intelCpu.model}</div>
                <div className="text-[9px] text-slate-400">{intelCpu.gen}</div>
                <div className="text-[9px] text-slate-500 mt-1">
                  {intelCpu.cores}c • {intelCpu.baseGhz}-{intelCpu.turboGhz} GHz • {intelCpu.tdp}W
                </div>
              </div>

              {/* AMD Option */}
              <div className="bg-slate-900/50 rounded p-2 border border-red-500/20">
                <div className="text-[9px] text-red-400 font-medium mb-1">AMD Option</div>
                <div className="text-[10px] text-white font-medium">{amdCpu.model}</div>
                <div className="text-[9px] text-slate-400">{amdCpu.gen}</div>
                <div className="text-[9px] text-slate-500 mt-1">
                  {amdCpu.cores}c • {amdCpu.baseGhz}-{amdCpu.turboGhz} GHz • {amdCpu.tdp}W
                </div>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${showStorage ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-2`}>
            {/* Memory */}
            <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-1.5">
                <MemoryStick className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[10px] font-semibold text-white">Memory</span>
              </div>
              <div className="text-[11px] text-cyan-400 font-medium">DDR5-4800 RDIMM</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                64GB modules • ECC Registered
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                <span className="text-cyan-400">{dimmsNeeded}×</span> DIMMs = {formatInt(hardware.ramPerHostGb)} GB
              </div>
            </div>

            {/* ESXi Boot Disk - RAID 1 */}
            <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-1.5">
                <Database className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[10px] font-semibold text-white">ESXi Boot (RAID 1)</span>
              </div>
              <div className="text-[11px] text-cyan-400 font-medium">240GB SATA SSD</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                M.2 or 2.5" • Mixed-use endurance
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                <span className="text-cyan-400">2×</span> drives in RAID 1 (mirrored)
              </div>
            </div>

            {/* vSAN Storage - Only if vSAN enabled */}
            {showStorage && (
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <HardDrive className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-[10px] font-semibold text-white">vSAN {vsanMode.toUpperCase()}</span>
                </div>
                <div className="text-[11px] text-cyan-400 font-medium">{driveSize} NVMe SSD</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  U.2/U.3 • Mixed-use endurance
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  <span className="text-cyan-400">{nvmeDrives}×</span> drives per host
                </div>
              </div>
            )}
          </div>

          {/* Networking */}
          <div className="mt-2 bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Network className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-[10px] font-semibold text-white">Networking</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="bg-slate-900/50 rounded p-2 border border-slate-700/30">
                <div className="text-slate-400 mb-1">VM Traffic</div>
                <div className="text-cyan-400 font-medium">2× 25GbE</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Intel E810-XXV</div>
              </div>

              <div className="bg-slate-900/50 rounded p-2 border border-slate-700/30">
                <div className="text-slate-400 mb-1">{showStorage ? 'vSAN Traffic' : 'Storage'}</div>
                <div className="text-cyan-400 font-medium">2× 25GbE</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Mellanox CX-6 Lx</div>
              </div>

              <div className="bg-slate-900/50 rounded p-2 border border-slate-700/30">
                <div className="text-slate-400 mb-1">vMotion/Mgmt</div>
                <div className="text-cyan-400 font-medium">2× 25GbE</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Shared/Onboard</div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-700/30 text-[10px] text-slate-400">
              <span className="text-cyan-400 font-medium">3× Dual-port 25GbE NICs</span> = 6 ports total per host
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
