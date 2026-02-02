import { Server, Network, Power } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { HardwareConfig, ClusterComputed } from "@/types"
import { formatInt, formatNumber } from "@/lib/utils"

interface ServerRackVisualizationProps {
  hardware: HardwareConfig
  computed: ClusterComputed
}

const RACK_UNITS = 20 // Standard rack size
const SERVER_U = 2 // Each server is 2U

export function ServerRackVisualization({ hardware, computed }: ServerRackVisualizationProps) {
  const isFailoverView = computed.capacityView === "failover"
  const failoverHosts = hardware.nPlusRedundancy
  const maxServersInRack = Math.floor((RACK_UNITS - 2) / SERVER_U) // Reserve 2U for TOR switch

  // Calculate how many racks needed
  const racksNeeded = Math.ceil(hardware.hosts / maxServersInRack)
  
  // Distribute servers across racks
  const racks = Array.from({ length: racksNeeded }, (_, rackIndex) => {
    const startServer = rackIndex * maxServersInRack
    const serversInThisRack = Math.min(maxServersInRack, hardware.hosts - startServer)
    return Array.from({ length: serversInThisRack }, (_, i) => startServer + i)
  })

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
      <CardContent className="pt-0">
        {/* Racks container - horizontal scroll if multiple */}
        <div className={`flex gap-3 ${racksNeeded > 1 ? 'overflow-x-auto pb-2' : ''}`}>
          {racks.map((serverIndices, rackIndex) => (
            <RackUnit
              key={rackIndex}
              rackNumber={rackIndex + 1}
              serverIndices={serverIndices}
              hardware={hardware}
              computed={computed}
              isFailoverView={isFailoverView}
              failoverStartIndex={hardware.hosts - failoverHosts}
              isOnlyRack={racksNeeded === 1}
            />
          ))}
        </div>

        {/* Summary */}
        <div className="mt-3 pt-3 border-t border-slate-700/50 grid grid-cols-4 gap-2 text-[10px]">
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
  isOnlyRack,
}: {
  rackNumber: number
  serverIndices: number[]
  hardware: HardwareConfig
  computed: ClusterComputed
  isFailoverView: boolean
  failoverStartIndex: number
  isOnlyRack: boolean
}) {
  const emptySlots = Math.floor((RACK_UNITS - 2) / SERVER_U) - serverIndices.length

  return (
    <div className={`${isOnlyRack ? 'flex-1' : 'flex-shrink-0 w-48'}`}>
      {/* Rack label */}
      <div className="text-[10px] text-slate-500 text-center mb-1">Rack {rackNumber}</div>
      
      {/* Rack frame */}
      <div className="relative bg-slate-950 rounded-lg border-2 border-slate-600 p-1">
        {/* Rack rails */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-slate-500 via-slate-600 to-slate-500 rounded-l-md flex flex-col justify-between py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-slate-400 rounded-full mx-auto" />
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-slate-500 via-slate-600 to-slate-500 rounded-r-md flex flex-col justify-between py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-slate-400 rounded-full mx-auto" />
          ))}
        </div>

        <div className="px-3 py-1 space-y-1">
          {/* TOR Switch - 2U at top */}
          <div className="bg-slate-800 rounded border border-slate-600 p-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Network className="h-3 w-3 text-blue-400" />
                <span className="text-[9px] font-medium text-slate-300">TOR Switch</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            </div>
            {/* Port indicators */}
            <div className="mt-1 flex gap-px">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-sm ${i < serverIndices.length ? 'bg-green-500/60' : 'bg-slate-700'}`} />
              ))}
            </div>
          </div>

          {/* Servers */}
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

          {/* Empty slots */}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div key={`empty-${i}`} className="h-6 bg-slate-900/50 rounded border border-dashed border-slate-800 flex items-center justify-center">
              <span className="text-[8px] text-slate-700">Empty</span>
            </div>
          ))}

          {/* PDU at bottom */}
          <div className="bg-slate-800 rounded border border-slate-600 px-2 py-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Power className="h-2.5 w-2.5 text-amber-400" />
              <span className="text-[8px] text-slate-400">PDU</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(serverIndices.length, 6) }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500" />
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
        rounded border p-1 transition-all
        ${isActive 
          ? "bg-slate-800/80 border-slate-600" 
          : "bg-slate-900/50 border-amber-500/30 opacity-60"
        }
      `}
    >
      <div className="flex items-center gap-1.5">
        {/* Status LED */}
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-green-500" : "bg-amber-500"}`} />
        
        {/* Server info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className={`text-[9px] font-medium ${isActive ? "text-slate-200" : "text-slate-500"}`}>
              ESXi-{String(index + 1).padStart(2, '0')}
            </span>
            {!isActive && (
              <span className="text-[7px] text-amber-400 bg-amber-500/20 px-1 rounded">HA</span>
            )}
          </div>
          <div className="text-[7px] text-slate-500">
            {hardware.coresPerHost}c • {hardware.ramPerHostGb}G
          </div>
        </div>

        {/* Utilization mini bars */}
        {isActive && (
          <div className="flex flex-col gap-0.5 w-8">
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
