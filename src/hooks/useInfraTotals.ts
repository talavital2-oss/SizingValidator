import { useMemo } from "react"
import type { InfraVm, InfraTotals } from "@/types"

/**
 * Hook to calculate infrastructure VM totals
 */
export function useInfraTotals(infraVms: InfraVm[]): InfraTotals {
  return useMemo(() => {
    const enabled = infraVms.filter((vm) => vm.enabled)
    
    return {
      infraVmCount: enabled.reduce((sum, vm) => sum + vm.count, 0),
      infraVcpu: enabled.reduce((sum, vm) => sum + vm.count * vm.vcpu, 0),
      infraRamGb: enabled.reduce((sum, vm) => sum + vm.count * vm.ramGb, 0),
    }
  }, [infraVms])
}
