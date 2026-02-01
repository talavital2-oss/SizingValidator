# VDI Sizing Validator

A React-based VDI (Virtual Desktop Infrastructure) cluster resource sizing dashboard styled like VMware vCenter.

## Features

- **Cluster Resource Visualization**: Real-time CPU and memory utilization calculations
- **Hardware Configuration**: Configurable hosts, cores, RAM, and clock speeds
- **Workload Profiling**: Define VM counts, vCPU allocation, and memory per VM
- **vSAN Support**: OSA and ESA mode overhead calculations
- **Management VM Tracking**: Built-in sizing for common infrastructure components:
  - vCenter Server Appliance
  - Horizon Connection Server
  - Unified Access Gateway
  - SQL Server
  - App Volumes Manager
  - Horizon Enrollment Server (True SSO)
- **HA Compliance**: N+X failover calculations
- **CPU Demand Modes**: Peak vs. typical (day-to-day) resource estimation

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component patterns
- **Lucide React** for icons

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Base UI components (Card, Button, Separator)
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── DashboardHeader.tsx
│   │   ├── TopTile.tsx
│   │   ├── TopTilesSection.tsx
│   │   ├── ResourceUtilizationCard.tsx
│   │   ├── HardwareConfigCard.tsx
│   │   ├── WorkloadProfileCard.tsx
│   │   ├── SystemOverheadCard.tsx
│   │   ├── ManagementVmsCard.tsx
│   │   └── ...
│   └── VDIDashboard.tsx    # Main dashboard assembly
├── hooks/                  # Custom React hooks
│   ├── useClusterCalculations.ts
│   ├── useDashboardState.ts
│   └── useInfraTotals.ts
├── types/                  # TypeScript interfaces
│   └── index.ts
├── constants/              # Default values and limits
│   └── index.ts
├── lib/                    # Utility functions
│   └── utils.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

The dashboard allows you to configure:

1. **Hardware**: Number of hosts, RAM per host, cores per host, base GHz
2. **Workload**: VM count, vCPU per VM, RAM per VM, peak GHz demand
3. **System Overhead**: ESXi overhead, vSAN mode (None/OSA/ESA)
4. **Management VMs**: Enable/disable and size infrastructure components

The dashboard automatically calculates:
- Memory and CPU utilization percentages
- vCPU consolidation ratio
- HA-adjusted capacity (accounting for failover hosts)

## License

MIT
