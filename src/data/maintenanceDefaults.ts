import type { MaintenanceScheduleItem, ServiceLogRecord, VehicleTimelineEvent } from '../types/maintenance';

export const CAR_MAINTENANCE_SCHEDULE: MaintenanceScheduleItem[] = [
  {
    id: 'maint-car-oil',
    name: 'Engine Oil & Filter Service',
    category: 'fluids',
    intervalKm: 10000,
    intervalDays: 180,
    lastPerformedKm: 35000,
    lastPerformedDate: '2026-03-15',
    dueKm: 45000,
    remainingKm: 2620,
    status: 'good',
    urgencyDescription: '2,620 km remaining before next oil change',
    recommendedAction: 'Synthetic 0W-20 engine oil replacement with OEM spin-on filter.',
    estimatedCostRange: '₹3,500 – ₹5,500'
  },
  {
    id: 'maint-car-brakes',
    name: 'Front Brake Pad & Rotor Inspection',
    category: 'brakes',
    intervalKm: 20000,
    intervalDays: 365,
    lastPerformedKm: 22000,
    lastPerformedDate: '2025-08-10',
    dueKm: 42000,
    remainingKm: -380, // Overdue by 380 km
    status: 'due_soon',
    urgencyDescription: 'Due soon (approx 3.2mm pad thickness remaining)',
    recommendedAction: 'Inspect front disc pads for wear and measure rotor thickness.',
    estimatedCostRange: '₹4,000 – ₹7,500'
  },
  {
    id: 'maint-car-air-filter',
    name: 'Engine Air & Cabin Pollen Filter',
    category: 'filters',
    intervalKm: 15000,
    intervalDays: 365,
    lastPerformedKm: 30000,
    lastPerformedDate: '2025-11-20',
    dueKm: 45000,
    remainingKm: 2620,
    status: 'good',
    urgencyDescription: 'Clean condition, inspect at 45,000 km',
    recommendedAction: 'Replace pleated engine air intake element and carbon cabin filter.',
    estimatedCostRange: '₹1,200 – ₹2,200'
  },
  {
    id: 'maint-car-tyres',
    name: 'Tyre Rotation & Wheel Balancing',
    category: 'tyres',
    intervalKm: 10000,
    intervalDays: 180,
    lastPerformedKm: 40000,
    lastPerformedDate: '2026-06-05',
    dueKm: 50000,
    remainingKm: 7620,
    status: 'good',
    urgencyDescription: 'Healthy tread depth (5.4mm average)',
    recommendedAction: 'Rotate front-to-rear diagonally to equalize wear.',
    estimatedCostRange: '₹800 – ₹1,500'
  },
  {
    id: 'maint-car-battery',
    name: '12V Battery Health & Terminal Clean',
    category: 'powertrain',
    intervalKm: 20000,
    intervalDays: 365,
    lastPerformedKm: 20000,
    lastPerformedDate: '2025-06-12',
    dueKm: 40000,
    remainingKm: -2380,
    status: 'due_soon',
    urgencyDescription: 'Due for test (cold crank voltage dipping to 10.2V)',
    recommendedAction: 'Perform digital conductance test on battery cell health.',
    estimatedCostRange: '₹0 – ₹4,500'
  },
  {
    id: 'maint-car-general',
    name: '40,000 km Major Vehicle Inspection',
    category: 'general',
    intervalKm: 40000,
    intervalDays: 730,
    lastPerformedKm: 40000,
    lastPerformedDate: '2026-06-05',
    dueKm: 80000,
    remainingKm: 37620,
    status: 'good',
    urgencyDescription: 'Completed recently, in great shape',
    recommendedAction: 'Full 45-point comprehensive suspension, fluid, and belt check.',
    estimatedCostRange: '₹6,500 – ₹12,000'
  }
];

export const BIKE_MAINTENANCE_SCHEDULE: MaintenanceScheduleItem[] = [
  {
    id: 'maint-bike-chain',
    name: 'Chain Slack Adjustment & Lube',
    category: 'powertrain',
    intervalKm: 1000,
    intervalDays: 30,
    lastPerformedKm: 13000,
    lastPerformedDate: '2026-07-10',
    dueKm: 14000,
    remainingKm: -200,
    status: 'due_soon',
    urgencyDescription: 'Slack is 36mm (target: 30mm); needs lube',
    recommendedAction: 'Clean with dedicated chain cleaner, adjust tension, and apply PTFE lube.',
    estimatedCostRange: '₹350 – ₹600'
  },
  {
    id: 'maint-bike-oil',
    name: 'Motorcycle 4T Engine Oil & Filter',
    category: 'fluids',
    intervalKm: 5000,
    intervalDays: 180,
    lastPerformedKm: 10000,
    lastPerformedDate: '2026-04-12',
    dueKm: 15000,
    remainingKm: 800,
    status: 'good',
    urgencyDescription: '800 km remaining before next oil service',
    recommendedAction: 'Yamalube 10W-40 Full Synthetic 4T oil + filter.',
    estimatedCostRange: '₹1,800 – ₹2,800'
  },
  {
    id: 'maint-bike-brakes',
    name: 'Brake Fluid Flush (DOT 4)',
    category: 'brakes',
    intervalKm: 10000,
    intervalDays: 365,
    lastPerformedKm: 10000,
    lastPerformedDate: '2026-04-12',
    dueKm: 20000,
    remainingKm: 5800,
    status: 'good',
    urgencyDescription: 'Fluid clear, moisture content < 2%',
    recommendedAction: 'Hydraulic line bleed and fresh reservoir fluid.',
    estimatedCostRange: '₹800 – ₹1,500'
  }
];

export const RC_MAINTENANCE_SCHEDULE: MaintenanceScheduleItem[] = [
  {
    id: 'maint-rc-lipo',
    name: '3S LiPo Storage Charge & Balance',
    category: 'powertrain',
    intervalKm: 25,
    intervalDays: 14,
    lastPerformedKm: 110,
    lastPerformedDate: '2026-08-20',
    dueKm: 135,
    remainingKm: 7,
    status: 'good',
    urgencyDescription: 'Pack in healthy balance (3.94V/cell)',
    recommendedAction: 'Put in Storage mode (3.85V/cell) if unused for > 48 hours.',
    estimatedCostRange: '₹0'
  },
  {
    id: 'maint-rc-diff',
    name: 'Differential & Gear Mesh Check',
    category: 'general',
    intervalKm: 50,
    intervalDays: 60,
    lastPerformedKm: 80,
    lastPerformedDate: '2026-07-28',
    dueKm: 130,
    remainingKm: 2,
    status: 'due_soon',
    urgencyDescription: 'Inspect spur and pinion backlash after rough jumps',
    recommendedAction: 'Check paper-strip gear clearance and lube ring/pinion.',
    estimatedCostRange: '₹500 – ₹1,200'
  }
];

export const DEFAULT_SERVICE_HISTORY: ServiceLogRecord[] = [
  {
    id: 'srv-001',
    date: '2026-06-05',
    odometerKm: 40000,
    serviceType: '40,000 km Scheduled Service',
    serviceCategory: 'Scheduled Maintenance',
    workshopOrMechanic: 'Metro Honda Authorized Service',
    notes: 'Engine oil replaced (0W-20), oil filter replaced, 40k inspection passed, tyres rotated.',
    cost: 5400,
    replacedParts: ['Synthetic Engine Oil 0W-20', 'OEM Oil Filter 15400-RTA-003', 'Crush Washer']
  },
  {
    id: 'srv-002',
    date: '2025-11-20',
    odometerKm: 30000,
    serviceType: 'Air & Cabin Filter Replacement',
    serviceCategory: 'Filters',
    workshopOrMechanic: 'QuickLube Diagnostics',
    notes: 'Cabin pollen filter and engine intake filter replaced due to seasonal dust.',
    cost: 1800,
    replacedParts: ['Engine Air Filter', 'Activated Carbon Cabin Filter']
  },
  {
    id: 'srv-003',
    date: '2025-08-10',
    odometerKm: 22000,
    serviceType: 'Brake Fluid Bleed & Tyre Balance',
    serviceCategory: 'Brakes & Wheels',
    workshopOrMechanic: 'Precision Automotive Service',
    notes: 'Brake fluid flushed with DOT 4 fluid, wheel weights adjusted.',
    cost: 3200,
    replacedParts: ['DOT 4 Synthetic Brake Fluid']
  }
];

export const DEFAULT_TIMELINE_EVENTS: VehicleTimelineEvent[] = [
  {
    id: 'evt-01',
    timestamp: 'Today, 08:42 AM',
    dateStr: '29 Aug',
    type: 'alert',
    title: 'Engine Temperature Anomaly (P0118)',
    description: 'Coolant temp temporarily hit 104°C during 15-minute standing traffic idling before fan cooled it down.',
    severity: 'warning',
    metricSnippet: '104°C at 12 km/h'
  },
  {
    id: 'evt-02',
    timestamp: '27 Aug, 03:15 PM',
    dateStr: '27 Aug',
    type: 'service',
    title: 'Diagnostic Scan: Zero Critical Faults',
    description: 'Routine automated MotoMindX CAN sweep cleared 1 historical soft code.',
    severity: 'success',
    metricSnippet: 'Health Score: 92/100'
  },
  {
    id: 'evt-03',
    timestamp: '21 Aug, 07:18 AM',
    dateStr: '21 Aug',
    type: 'alert',
    title: 'Battery Cranking Voltage Dip (P0562)',
    description: 'Cold crank voltage dropped to 10.2V on first morning start.',
    severity: 'warning',
    metricSnippet: '10.2V Cold Crank'
  },
  {
    id: 'evt-04',
    timestamp: '18 Aug, 05:40 PM',
    dateStr: '18 Aug',
    type: 'trip',
    title: 'Highway Trip Logged (84 km)',
    description: 'Efficient cruising trip. Average speed 78 km/h, average fuel efficiency 18.2 km/L.',
    severity: 'info',
    metricSnippet: '18.2 km/L avg'
  }
];
