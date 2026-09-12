export type VehicleCategory = 'car' | 'sedan' | 'suv' | 'compact_suv' | 'motorcycle' | 'scooter' | 'rc_car';
export type ComponentHealthStatus = 'good' | 'check_soon' | 'warning' | 'critical';

export interface VehicleComponentData {
  id: string;
  name: string;
  shortName: string;
  category: string;
  status: ComponentHealthStatus;
  healthPct: number;
  position3D: [number, number, number];
  cameraFocusPosition?: [number, number, number];
  cameraPosition?: [number, number, number];
  metrics: {
    label: string;
    value: number | string;
    unit: string;
    nominalRange?: [number, number];
    status: ComponentHealthStatus;
  }[];
  description: string;
  diagnosticFinding: string;
  recommendation: string;
}

export interface VehicleSensorData {
  id: string;
  label: string;
  value: number | string;
  unit: string;
  nominalRange: [number, number];
  status: ComponentHealthStatus;
  category: 'powertrain' | 'electrical' | 'thermal' | 'chassis' | 'telemetry';
  isLiveAnimated?: boolean;
}

export interface VehicleMaintenanceItem {
  id: string;
  name: string;
  intervalValue: string;
  dueValue: string;
  remainingValue: string;
  remainingNumber: number;
  status: 'good' | 'due_soon' | 'overdue';
  action: string;
  lastCompleted: string;
  costRange: string;
}

export interface VehicleAlertItem {
  id: string;
  code?: string;
  title: string;
  subsystem: string;
  urgency: 'check_soon' | 'warning' | 'critical' | 'good';
  whatHappened: string;
  whyItMatters: string;
  whatShouldIDo: string;
  timestamp: string;
  componentId: string;
}

export interface VehicleHealthSubsystem {
  id: string;
  name: string;
  score: number; // 0 - 100
  weight: number; // e.g. 0.30
  status: ComponentHealthStatus;
  iconName: string;
  summary: string;
}

export interface VehicleConfig {
  id?: string;
  type: VehicleCategory;
  categoryLabel: string;
  detectionLabel: string;
  model: {
    name: string;
    year: number;
    make: string;
    variant: string;
    vinOrSerial: string;
    model3D: string;
    icon: string;
  };
  specifications: {
    engineOrMotor: string;
    transmissionOrEsc: string;
    driveType: string;
    fuelOrBatteryType: string;
    mileageOrCycles: string;
    curbWeight: string;
    topSpeed: string;
  };
  hardwareLink: {
    protocol: string;
    medium: string;
    deviceId: string;
    latencyMs: number;
    signalDbm: number;
    baudRateOrFrequency: string;
  };
  healthIndex: {
    overallScore: number;
    grade: 'A' | 'B' | 'C' | 'D';
    statusText: string;
    summary: string;
    subsystems: VehicleHealthSubsystem[];
  };
  components: VehicleComponentData[];
  sensors: VehicleSensorData[];
  maintenance: VehicleMaintenanceItem[];
  alerts: VehicleAlertItem[];
}

export const VEHICLE_CONFIGURATIONS: Record<string, VehicleConfig> = {
  car: {
    id: 'veh-car-default',
    type: 'car',
    categoryLabel: 'Passenger Car',
    detectionLabel: 'Vehicle Detected: Passenger Car (OBD-II CAN)',
    model: {
      name: 'Honda City i-VTEC',
      year: 2023,
      make: 'Honda',
      variant: '1.5L ZX CVT',
      vinOrSerial: 'MAKGM6674NH109823',
      model3D: '/models/cars/honda-city.glb',
      icon: 'Car'
    },
    specifications: {
      engineOrMotor: '1.5L 4-Cyl DOHC i-VTEC',
      transmissionOrEsc: 'CVT with 7-Speed Paddle Shift',
      driveType: 'Front-Wheel Drive (FWD)',
      fuelOrBatteryType: 'Petrol (Gasoline)',
      mileageOrCycles: '42,380 km',
      curbWeight: '1,153 kg',
      topSpeed: '185 km/h'
    },
    hardwareLink: {
      protocol: 'ISO 15765-4 (CAN 11/500)',
      medium: '4G LTE-M / Direct OBD-II',
      deviceId: 'MMX-00124',
      latencyMs: 38,
      signalDbm: -68,
      baudRateOrFrequency: '500 kbps CAN'
    },
    healthIndex: {
      overallScore: 85,
      grade: 'B',
      statusText: 'GOOD',
      summary: 'Engine and chassis are in excellent operational condition. Battery resting voltage and front brake pads require scheduled checkup.',
      subsystems: [
        { id: 'sub-pt', name: 'Powertrain & Engine', score: 92, weight: 0.30, status: 'good', iconName: 'Cpu', summary: 'Optimal combustion & oil pressure' },
        { id: 'sub-elec', name: 'Electrical & Battery', score: 75, weight: 0.25, status: 'check_soon', iconName: 'Zap', summary: 'Resting charge dipping on cold start' },
        { id: 'sub-therm', name: 'Cooling & Thermal', score: 90, weight: 0.20, status: 'good', iconName: 'Thermometer', summary: 'Normal 89°C operating temp' },
        { id: 'sub-brake', name: 'Brakes & Chassis', score: 85, weight: 0.15, status: 'check_soon', iconName: 'Shield', summary: 'Front pads at 28% thickness' },
        { id: 'sub-maint', name: 'Service Schedule', score: 80, weight: 0.10, status: 'check_soon', iconName: 'Wrench', summary: 'Brake inspection due soon' },
        { id: 'sub-tyre', name: 'Tyres & TPMS', score: 88, weight: 0.10, status: 'good', iconName: 'Activity', summary: 'Balanced 32.5 PSI pressure' }
      ]
    },
    components: [
      {
        id: 'engine',
        name: 'Internal Combustion Engine',
        shortName: 'Engine',
        category: 'Powertrain',
        status: 'good',
        healthPct: 92,
        position3D: [0, 0.45, 1.15],
        cameraFocusPosition: [0, 0.45, 1.15],
        cameraPosition: [1.8, 1.2, 2.2],
        metrics: [
          { label: 'Engine Speed', value: 1850, unit: 'RPM', nominalRange: [650, 6000], status: 'good' },
          { label: 'Coolant Temp', value: 89, unit: '°C', nominalRange: [80, 98], status: 'good' },
          { label: 'Calculated Load', value: 31, unit: '%', nominalRange: [15, 85], status: 'good' },
          { label: 'Oil Pressure', value: 340, unit: 'kPa', nominalRange: [200, 450], status: 'good' }
        ],
        description: '1.5L 4-Cylinder DOHC i-VTEC petrol engine with multi-point fuel injection.',
        diagnosticFinding: 'Engine combustion parameters and idle stability are within normal factory thresholds.',
        recommendation: 'No immediate action required. Next regular oil service in 2,620 km.'
      },
      {
        id: 'battery',
        name: '12V Lead-Acid Starter Battery',
        shortName: 'Battery',
        category: 'Electrical',
        status: 'check_soon',
        healthPct: 75,
        position3D: [-0.48, 0.5, 0.95],
        cameraFocusPosition: [-0.48, 0.5, 0.95],
        cameraPosition: [-1.6, 1.4, 1.8],
        metrics: [
          { label: 'Terminal Voltage', value: 12.4, unit: 'V', nominalRange: [12.4, 14.6], status: 'check_soon' },
          { label: 'Alternator Charging', value: 13.9, unit: 'V', nominalRange: [13.6, 14.7], status: 'good' },
          { label: 'State of Health (SOH)', value: 75, unit: '%', nominalRange: [75, 100], status: 'check_soon' }
        ],
        description: 'Supplies electrical power to crank the starter motor and run vehicle electronics when off.',
        diagnosticFinding: 'Cold crank voltage dipped to 10.2V on recent cold morning start. Alternator charging is normal.',
        recommendation: 'Inspect battery terminals and perform a load test before next service.'
      },
      {
        id: 'transmission',
        name: 'Continuously Variable Transmission (CVT)',
        shortName: 'Transmission',
        category: 'Powertrain',
        status: 'good',
        healthPct: 90,
        position3D: [0.3, 0.35, 0.6],
        cameraFocusPosition: [0.3, 0.35, 0.6],
        cameraPosition: [1.7, 0.9, 1.2],
        metrics: [
          { label: 'Fluid Temperature', value: 76, unit: '°C', nominalRange: [65, 95], status: 'good' },
          { label: 'Pulley Ratio', value: 1.42, unit: '', nominalRange: [0.5, 2.5], status: 'good' },
          { label: 'Torque Converter Slip', value: 0.8, unit: '%', nominalRange: [0, 4.0], status: 'good' }
        ],
        description: 'Electronically controlled CVT transmission delivering smooth acceleration.',
        diagnosticFinding: 'Transmission fluid temperature and hydraulic pressure response are optimal.',
        recommendation: 'Next CVT fluid replacement scheduled at 60,000 km.'
      },
      {
        id: 'brakes',
        name: 'Hydraulic Disc Braking System',
        shortName: 'Brakes',
        category: 'Braking',
        status: 'check_soon',
        healthPct: 65,
        position3D: [0.88, 0.25, 1.15],
        cameraFocusPosition: [0.88, 0.25, 1.15],
        cameraPosition: [1.8, 0.6, 1.4],
        metrics: [
          { label: 'Front Pad Life', value: 28, unit: '%', nominalRange: [30, 100], status: 'check_soon' },
          { label: 'Rear Pad Life', value: 55, unit: '%', nominalRange: [30, 100], status: 'good' },
          { label: 'Fluid Moisture', value: 1.8, unit: '%', nominalRange: [0, 3.0], status: 'good' }
        ],
        description: 'Ventilated front discs and rear drum/disc with ABS and Brake Assist.',
        diagnosticFinding: 'Front brake pad friction material is approaching minimum recommended thickness (approx 3.2mm).',
        recommendation: 'Schedule front brake pad inspection within the next 1,000–1,500 km.'
      },
      {
        id: 'cooling',
        name: 'Cooling System & Radiator',
        shortName: 'Cooling System',
        category: 'Thermal',
        status: 'good',
        healthPct: 90,
        position3D: [0, 0.35, 1.6],
        cameraFocusPosition: [0, 0.35, 1.6],
        cameraPosition: [0, 1.1, 2.5],
        metrics: [
          { label: 'Radiator Out Temp', value: 74, unit: '°C', nominalRange: [60, 85], status: 'good' },
          { label: 'Thermostat Valve', value: 'Open (Auto)', unit: '', status: 'good' }
        ],
        description: 'Ethylene-glycol cooling circuit with aluminum core radiator.',
        diagnosticFinding: 'Optimal heat dissipation with zero coolant pressure loss.',
        recommendation: 'Check reservoir coolant level at regular maintenance.'
      },
      {
        id: 'tyres',
        name: 'Radial Tyres (TPMS)',
        shortName: 'Tyres',
        category: 'Chassis',
        status: 'good',
        healthPct: 88,
        position3D: [-0.88, 0.25, -1.05],
        cameraFocusPosition: [-0.88, 0.25, -1.05],
        cameraPosition: [-2.0, 0.6, -1.4],
        metrics: [
          { label: 'Front-Left', value: 32.5, unit: 'PSI', nominalRange: [30, 35], status: 'good' },
          { label: 'Front-Right', value: 32.8, unit: 'PSI', nominalRange: [30, 35], status: 'good' },
          { label: 'Rear-Left', value: 32.0, unit: 'PSI', nominalRange: [30, 35], status: 'good' },
          { label: 'Rear-Right', value: 32.2, unit: 'PSI', nominalRange: [30, 35], status: 'good' }
        ],
        description: '185/55 R16 all-season tyres with CAN-based TPMS monitoring.',
        diagnosticFinding: 'All 4 tyres have balanced cold pressure and uniform tread wear.',
        recommendation: 'Rotate tyres diagonally at 50,000 km mark.'
      },
      {
        id: 'exhaust',
        name: 'Exhaust & Catalytic Converter',
        shortName: 'Exhaust',
        category: 'Emissions',
        status: 'good',
        healthPct: 94,
        position3D: [0, 0.18, -1.4],
        cameraFocusPosition: [0, 0.18, -1.4],
        cameraPosition: [0, 0.8, -2.6],
        metrics: [
          { label: 'Catalyst Temp', value: 540, unit: '°C', nominalRange: [400, 800], status: 'good' },
          { label: 'O2 Sensor Voltage', value: 0.72, unit: 'V', nominalRange: [0.1, 0.9], status: 'good' }
        ],
        description: 'Three-way catalytic converter and stainless steel muffler.',
        diagnosticFinding: 'Emissions monitors are passed and catalyst cleansing is functioning properly.',
        recommendation: 'No action needed.'
      },
      {
        id: 'suspension',
        name: 'MacPherson Strut Suspension',
        shortName: 'Suspension',
        category: 'Chassis',
        status: 'good',
        healthPct: 90,
        position3D: [0.65, 0.35, 1.1],
        cameraFocusPosition: [0.65, 0.35, 1.1],
        cameraPosition: [1.8, 0.7, 1.6],
        metrics: [
          { label: 'Strut Dampening', value: 'Nominal', unit: '', status: 'good' },
          { label: 'Ride Height Offset', value: 0.2, unit: 'mm', nominalRange: [-5, 5], status: 'good' }
        ],
        description: 'Front coil-over struts and rear torsion beam.',
        diagnosticFinding: 'Shock absorbers and stabilizer bushings are firm without leakage.',
        recommendation: 'Inspect suspension bushings at 50,000 km service.'
      }
    ],
    sensors: [
      { id: 's-rpm', label: 'Engine RPM', value: 1850, unit: 'rpm', nominalRange: [650, 6000], status: 'good', category: 'powertrain', isLiveAnimated: true },
      { id: 's-temp', label: 'Coolant Temp', value: 89, unit: '°C', nominalRange: [80, 98], status: 'good', category: 'thermal' },
      { id: 's-volt', label: 'Battery Voltage', value: 14.1, unit: 'V', nominalRange: [13.6, 14.7], status: 'good', category: 'electrical', isLiveAnimated: true },
      { id: 's-speed', label: 'Vehicle Speed', value: 58, unit: 'km/h', nominalRange: [0, 180], status: 'good', category: 'powertrain', isLiveAnimated: true },
      { id: 's-load', label: 'Engine Load', value: 31, unit: '%', nominalRange: [15, 85], status: 'good', category: 'powertrain' },
      { id: 's-throttle', label: 'Throttle Position', value: 24, unit: '%', nominalRange: [0, 100], status: 'good', category: 'powertrain' },
      { id: 's-fuel', label: 'Fuel Level', value: 68, unit: '%', nominalRange: [15, 100], status: 'good', category: 'powertrain' },
      { id: 's-oil', label: 'Oil Pressure', value: 340, unit: 'kPa', nominalRange: [200, 450], status: 'good', category: 'powertrain' }
    ],
    maintenance: [
      { id: 'm-oil', name: 'Engine Oil & Filter', intervalValue: '10,000 km', dueValue: '45,000 km', remainingValue: '2,620 km remaining', remainingNumber: 2620, status: 'good', action: 'Synthetic 0W-20 engine oil & OEM spin-on filter.', lastCompleted: '35,000 km (15 Mar 2026)', costRange: '₹3,500 – ₹5,500' },
      { id: 'm-brake', name: 'Front Brake Inspection', intervalValue: '20,000 km', dueValue: '42,000 km', remainingValue: 'Due Soon (380 km past)', remainingNumber: -380, status: 'due_soon', action: 'Measure front disc thickness and replace brake pads.', lastCompleted: '22,000 km (10 Aug 2025)', costRange: '₹4,000 – ₹7,500' },
      { id: 'm-filter', name: 'Engine Air & Cabin Pollen Filter', intervalValue: '15,000 km', dueValue: '45,000 km', remainingValue: '2,620 km remaining', remainingNumber: 2620, status: 'good', action: 'Replace pleated engine air intake filter.', lastCompleted: '30,000 km (20 Nov 2025)', costRange: '₹1,200 – ₹2,200' },
      { id: 'm-tyres', name: 'Tyre Rotation & Wheel Balancing', intervalValue: '10,000 km', dueValue: '50,000 km', remainingValue: '7,620 km remaining', remainingNumber: 7620, status: 'good', action: 'Rotate tyres diagonally for even wear.', lastCompleted: '40,000 km (05 Jun 2026)', costRange: '₹800 – ₹1,500' },
      { id: 'm-bat', name: '12V Battery Health Test', intervalValue: '20,000 km', dueValue: '40,000 km', remainingValue: 'Due Soon', remainingNumber: -2380, status: 'due_soon', action: 'Perform digital conductance load test.', lastCompleted: '20,000 km (12 Jun 2025)', costRange: '₹0 – ₹4,500' }
    ],
    alerts: [
      {
        id: 'alt-c1',
        code: 'P0562',
        title: 'Battery Voltage Low During Cold Start',
        subsystem: 'Electrical / Battery',
        urgency: 'check_soon',
        whatHappened: 'Battery terminal voltage dropped to 10.2V during cold morning starter cranking.',
        whyItMatters: 'An aging battery may eventually struggle to crank the starter after sitting idle for several days.',
        whatShouldIDo: 'Have the 12V battery conductance tested during your next routine service.',
        timestamp: 'Today, 07:18 AM',
        componentId: 'battery'
      },
      {
        id: 'alt-c2',
        code: 'P0301',
        title: 'Cylinder 1 Misfire Intermittent',
        subsystem: 'Powertrain / Ignition',
        urgency: 'check_soon',
        whatHappened: 'A single misfire was detected in cylinder 1 during high engine load acceleration.',
        whyItMatters: 'Unaddressed misfires cause slight rough idle and can reduce fuel efficiency.',
        whatShouldIDo: 'Inspect the cylinder 1 spark plug and ignition coil pack.',
        timestamp: 'Yesterday, 04:30 PM',
        componentId: 'engine'
      }
    ]
  },

  motorcycle: {
    id: 'veh-bike-default',
    type: 'motorcycle',
    categoryLabel: 'Motorcycle',
    detectionLabel: 'Vehicle Detected: Motorcycle (Motorcycle CAN)',
    model: {
      name: 'Honda CB350 / MT-07',
      year: 2024,
      make: 'Honda',
      variant: 'DLX Pro ABS',
      vinOrSerial: 'JYARN45E8NA009121',
      model3D: '/models/motorcycles/honda-cb350.glb',
      icon: 'Bike'
    },
    specifications: {
      engineOrMotor: '348cc 4-Stroke SI Engine',
      transmissionOrEsc: '5-Speed Manual with Assist & Slipper Clutch',
      driveType: 'O-Ring Final Chain Drive',
      fuelOrBatteryType: 'Petrol (Gasoline)',
      mileageOrCycles: '12,420 km',
      curbWeight: '181 kg',
      topSpeed: '140 km/h'
    },
    hardwareLink: {
      protocol: 'Motorcycle CAN Diagnostic (K-Line / CAN)',
      medium: '4G LTE-M / 6-Pin Diagnostic Cable',
      deviceId: 'MMX-00124',
      latencyMs: 32,
      signalDbm: -64,
      baudRateOrFrequency: '250 kbps CAN'
    },
    healthIndex: {
      overallScore: 88,
      grade: 'B',
      statusText: 'GOOD',
      summary: 'Motorcycle engine compression and ABS braking systems are in great condition. Chain tension needs lubrication and adjustment.',
      subsystems: [
        { id: 'sub-m-pt', name: 'Engine & Gearbox', score: 94, weight: 0.35, status: 'good', iconName: 'Cpu', summary: 'Smooth valve timing and idle' },
        { id: 'sub-m-chain', name: 'Chain & Drive', score: 72, weight: 0.20, status: 'check_soon', iconName: 'Activity', summary: 'Chain slack is 36mm (target: 30)' },
        { id: 'sub-m-brake', name: 'Brakes (ABS)', score: 92, weight: 0.20, status: 'good', iconName: 'Shield', summary: 'Front & rear dual-channel ABS OK' },
        { id: 'sub-m-elec', name: 'Battery & Stator', score: 90, weight: 0.15, status: 'good', iconName: 'Zap', summary: 'Stator output 14.1V charging' },
        { id: 'sub-m-tyre', name: 'Tyres & Grip', score: 86, weight: 0.10, status: 'good', iconName: 'Activity', summary: 'Cold pressure 33 PSI Front, 36.5 Rear' }
      ]
    },
    components: [
      {
        id: 'm-engine',
        name: 'Single Cylinder 348cc 4-Stroke Engine',
        shortName: 'Engine',
        category: 'Powertrain',
        status: 'good',
        healthPct: 94,
        position3D: [0, 0.45, 0.05],
        cameraFocusPosition: [0, 0.45, 0.05],
        cameraPosition: [1.6, 0.8, 0.5],
        metrics: [
          { label: 'Engine Speed', value: 1200, unit: 'RPM', nominalRange: [1100, 7000], status: 'good' },
          { label: 'Engine Temp', value: 82, unit: '°C', nominalRange: [75, 102], status: 'good' },
          { label: 'Oil Pressure', value: 'OK (Switch)', unit: '', status: 'good' }
        ],
        description: 'Single cylinder air/oil-cooled engine tuned for low-end torque.',
        diagnosticFinding: 'Idle RPM and engine oil pressure switches are responding within nominal thresholds.',
        recommendation: 'Routine 4T oil and filter service due in 1,200 km.'
      },
      {
        id: 'm-chain',
        name: '520 Sealed O-Ring Drive Chain',
        shortName: 'Chain / Drive',
        category: 'Powertrain',
        status: 'check_soon',
        healthPct: 72,
        position3D: [-0.18, 0.26, -0.65],
        cameraFocusPosition: [-0.18, 0.26, -0.65],
        cameraPosition: [-1.4, 0.5, -0.7],
        metrics: [
          { label: 'Chain Slack', value: 36, unit: 'mm', nominalRange: [25, 35], status: 'check_soon' },
          { label: 'Sprocket Wear', value: 'Minor', unit: '', status: 'good' },
          { label: 'Lube Status', value: 'Needs Lube', unit: '', status: 'check_soon' }
        ],
        description: 'Heavy duty steel link chain delivering engine torque to the rear wheel.',
        diagnosticFinding: 'Chain slack has loosened to 36mm (recommended specification: 25–35mm).',
        recommendation: 'Clean with dedicated chain cleaner, adjust tension, and apply PTFE lube.'
      },
      {
        id: 'm-brakes',
        name: 'Dual-Channel ABS Disc Brakes',
        shortName: 'Brakes (ABS)',
        category: 'Braking',
        status: 'good',
        healthPct: 92,
        position3D: [0, 0.28, 0.95],
        cameraFocusPosition: [0, 0.28, 0.95],
        cameraPosition: [1.4, 0.5, 1.2],
        metrics: [
          { label: 'Front Pad Life', value: 72, unit: '%', nominalRange: [25, 100], status: 'good' },
          { label: 'Rear Pad Life', value: 68, unit: '%', nominalRange: [25, 100], status: 'good' },
          { label: 'ABS Status', value: 'Active / Ready', unit: '', status: 'good' }
        ],
        description: '310mm front disc with dual-piston caliper and 240mm rear disc.',
        diagnosticFinding: 'Hydraulic line pressure and ABS wheel speed sensors report zero faults.',
        recommendation: 'Inspect brake fluid clarity at next seasonal service.'
      },
      {
        id: 'm-battery',
        name: '12V 8.6Ah AGM Battery',
        shortName: 'Battery',
        category: 'Electrical',
        status: 'good',
        healthPct: 90,
        position3D: [0, 0.58, -0.2],
        cameraFocusPosition: [0, 0.58, -0.2],
        cameraPosition: [1.2, 1.1, -0.1],
        metrics: [
          { label: 'Resting Voltage', value: 12.8, unit: 'V', nominalRange: [12.6, 14.8], status: 'good' },
          { label: 'Stator Output', value: 14.1, unit: 'V', nominalRange: [13.8, 14.8], status: 'good' }
        ],
        description: 'Maintenance-free sealed AGM battery tucked under the seat.',
        diagnosticFinding: 'Stator charging output and resting terminal voltage are healthy.',
        recommendation: 'Keep on trickle charger if storing unused for more than 4 weeks.'
      },
      {
        id: 'm-tyres',
        name: 'Front & Rear Tubeless Tyres',
        shortName: 'Tyres',
        category: 'Chassis',
        status: 'good',
        healthPct: 86,
        position3D: [0, 0.28, -0.85],
        cameraFocusPosition: [0, 0.28, -0.85],
        cameraPosition: [1.4, 0.5, -1.0],
        metrics: [
          { label: 'Front Pressure', value: 33.0, unit: 'PSI', nominalRange: [32, 36], status: 'good' },
          { label: 'Rear Pressure', value: 36.5, unit: 'PSI', nominalRange: [35, 40], status: 'good' }
        ],
        description: '100/90-19 Front and 130/70-18 Rear sport touring tyres.',
        diagnosticFinding: 'Good tread depth with no sidewall micro-cracking.',
        recommendation: 'Check tyre pressure weekly before long weekend rides.'
      }
    ],
    sensors: [
      { id: 'sm-rpm', label: 'Engine RPM', value: 1200, unit: 'rpm', nominalRange: [1100, 7000], status: 'good', category: 'powertrain', isLiveAnimated: true },
      { id: 'sm-temp', label: 'Engine Temp', value: 82, unit: '°C', nominalRange: [75, 102], status: 'good', category: 'thermal' },
      { id: 'sm-volt', label: 'Battery Voltage', value: 13.9, unit: 'V', nominalRange: [13.6, 14.7], status: 'good', category: 'electrical', isLiveAnimated: true },
      { id: 'sm-speed', label: 'Vehicle Speed', value: 0, unit: 'km/h', nominalRange: [0, 140], status: 'good', category: 'powertrain', isLiveAnimated: true },
      { id: 'sm-throttle', label: 'Throttle', value: 12, unit: '%', nominalRange: [0, 100], status: 'good', category: 'powertrain' },
      { id: 'sm-gear', label: 'Gear Indicator', value: 'Neutral', unit: '', nominalRange: [0, 5], status: 'good', category: 'powertrain' },
      { id: 'sm-lean', label: 'Lean Angle', value: '0.0', unit: '°', nominalRange: [-45, 45], status: 'good', category: 'chassis' },
      { id: 'sm-chain', label: 'Chain Slack', value: 36, unit: 'mm', nominalRange: [25, 35], status: 'check_soon', category: 'powertrain' }
    ],
    maintenance: [
      { id: 'mm-oil', name: '4T Engine Oil & Filter', intervalValue: '5,000 km', dueValue: '15,000 km', remainingValue: '1,200 km remaining', remainingNumber: 1200, status: 'good', action: 'Full synthetic 10W-30 motorcycle oil + filter.', lastCompleted: '10,000 km (12 Apr 2026)', costRange: '₹1,800 – ₹2,800' },
      { id: 'mm-chain', name: 'Chain Clean, Lube & Slack Tension', intervalValue: '1,000 km', dueValue: '13,000 km', remainingValue: 'Due Soon (slack 36mm)', remainingNumber: -200, status: 'due_soon', action: 'Clean with kerosene/chain cleaner and adjust tension to 30mm.', lastCompleted: '12,000 km (10 Jul 2026)', costRange: '₹350 – ₹600' },
      { id: 'mm-brake', name: 'Brake Fluid Flush (DOT 4)', intervalValue: '10,000 km', dueValue: '20,000 km', remainingValue: '7,580 km remaining', remainingNumber: 7580, status: 'good', action: 'Bleed front and rear hydraulic lines.', lastCompleted: '10,000 km (12 Apr 2026)', costRange: '₹800 – ₹1,500' },
      { id: 'mm-air', name: 'Engine Intake Air Filter', intervalValue: '10,000 km', dueValue: '20,000 km', remainingValue: '7,580 km remaining', remainingNumber: 7580, status: 'good', action: 'Inspect paper pleated element.', lastCompleted: '10,000 km (12 Apr 2026)', costRange: '₹450 – ₹800' }
    ],
    alerts: [
      {
        id: 'alt-b1',
        title: 'Chain Lubrication & Tension Recommended',
        subsystem: 'Drive / Chain',
        urgency: 'check_soon',
        whatHappened: 'Chain slack sensor measured 36mm, exceeding the optimal 25–35mm tolerance band.',
        whyItMatters: 'Loose chains accelerate sprocket tooth wear and reduce throttle crispness.',
        whatShouldIDo: 'Clean and apply dedicated chain lubricant and adjust axle adjusters.',
        timestamp: 'Yesterday, 02:15 PM',
        componentId: 'm-chain'
      }
    ]
  },

  rc_car: {
    id: 'veh-rc-default',
    type: 'rc_car',
    categoryLabel: 'RC Car (Telemetry Mode)',
    detectionLabel: 'Vehicle Detected: RC Car (Direct Telemetry Link)',
    model: {
      name: 'Traxxas Slash 4x4 Brushless',
      year: 2024,
      make: 'Traxxas',
      variant: '1/10 VXL 3S LiPo',
      vinOrSerial: 'MMX-RC-88921-TRX',
      model3D: '/models/rc-cars/electric-rc-car.glb',
      icon: 'Gamepad2'
    },
    specifications: {
      engineOrMotor: 'Velineon 3500kV 4-Pole Brushless Motor',
      transmissionOrEsc: 'VXL-3s Waterproof ESC (60A Continuous)',
      driveType: 'Shaft-Driven 4WD with Steel Planetary Diffs',
      fuelOrBatteryType: '3S 11.1V 5000mAh 50C Hardcase LiPo',
      mileageOrCycles: '126 battery cycles (128 run km)',
      curbWeight: '2.64 kg',
      topSpeed: '96 km/h (60+ mph)'
    },
    hardwareLink: {
      protocol: 'Direct Telemetry Link (915MHz LoRa / Bluetooth / Wi-Fi / Serial)',
      medium: '915MHz LoRa Long-Range Wireless Bridge',
      deviceId: 'MMX-00124',
      latencyMs: 18,
      signalDbm: -58,
      baudRateOrFrequency: '915 MHz RF / 50 Hz Stream'
    },
    healthIndex: {
      overallScore: 92,
      grade: 'A',
      statusText: 'EXCELLENT',
      summary: 'RC telemetry link is rock solid. 3S LiPo cells are well balanced at 3.94V per cell and ESC temperatures are optimal.',
      subsystems: [
        { id: 'sub-rc-mot', name: 'Brushless Motor', score: 95, weight: 0.30, status: 'good', iconName: 'Cpu', summary: 'Core temp 54°C (Limit: 85°C)' },
        { id: 'sub-rc-esc', name: 'ESC Speed Controller', score: 94, weight: 0.25, status: 'good', iconName: 'Zap', summary: 'MOSFET temp 42°C, BEC 6.0V' },
        { id: 'sub-rc-bat', name: '3S LiPo Battery', score: 88, weight: 0.25, status: 'good', iconName: 'Zap', summary: 'Cells balanced at 3.94V each' },
        { id: 'sub-rc-srv', name: 'Steering Servo & Linkage', score: 92, weight: 0.10, status: 'good', iconName: 'Shield', summary: 'Center trim 0°, 0.35A draw' },
        { id: 'sub-rc-rf', name: 'Radio & RF Link', score: 96, weight: 0.10, status: 'good', iconName: 'Activity', summary: 'RSSI -58 dBm, 18ms latency' }
      ]
    },
    components: [
      {
        id: 'rc-motor',
        name: 'Velineon 3500kV Sensorless Brushless Motor',
        shortName: 'Motor',
        category: 'Powertrain',
        status: 'good',
        healthPct: 95,
        position3D: [-0.18, 0.28, -0.35],
        cameraFocusPosition: [-0.18, 0.28, -0.35],
        cameraPosition: [-1.2, 0.8, -0.2],
        metrics: [
          { label: 'Motor Temperature', value: 54, unit: '°C', nominalRange: [30, 75], status: 'good' },
          { label: 'Motor Speed', value: 8420, unit: 'RPM', nominalRange: [0, 45000], status: 'good' },
          { label: 'Thermal Headroom', value: 31, unit: '°C', nominalRange: [15, 60], status: 'good' }
        ],
        description: 'High RPM 4-pole brushless motor driving the heavy-duty center aluminum driveshaft.',
        diagnosticFinding: 'Motor rotor magnets and bearings are operating well below the 85°C thermal limit.',
        recommendation: 'Keep motor cooling heatsink fins clean of grass and dust.'
      },
      {
        id: 'rc-esc',
        name: 'VXL-3s Waterproof Electronic Speed Control (ESC)',
        shortName: 'ESC',
        category: 'Electrical',
        status: 'good',
        healthPct: 94,
        position3D: [0.18, 0.32, -0.15],
        cameraFocusPosition: [0.18, 0.32, -0.15],
        cameraPosition: [1.2, 0.9, -0.1],
        metrics: [
          { label: 'ESC Temp', value: 42, unit: '°C', nominalRange: [25, 70], status: 'good' },
          { label: 'Peak Current Draw', value: 34.2, unit: 'A', nominalRange: [5, 90], status: 'good' },
          { label: 'BEC Voltage', value: 6.0, unit: 'V', nominalRange: [5.8, 6.2], status: 'good' }
        ],
        description: 'Microprocessor-controlled speed controller with integrated low-voltage detection.',
        diagnosticFinding: 'MOSFET switching temperature and cooling fan are operating within safe bounds.',
        recommendation: 'Low-Voltage Detection (LVD) is armed for LiPo battery protection.'
      },
      {
        id: 'rc-battery',
        name: '3S 11.1V 5000mAh 50C Hardcase LiPo Pack',
        shortName: 'LiPo Battery (3S)',
        category: 'Electrical',
        status: 'good',
        healthPct: 88,
        position3D: [-0.22, 0.24, 0.05],
        cameraFocusPosition: [-0.22, 0.24, 0.05],
        cameraPosition: [-1.3, 0.7, 0.2],
        metrics: [
          { label: 'Pack Voltage', value: 11.7, unit: 'V', nominalRange: [11.1, 12.6], status: 'good' },
          { label: 'Cell 1', value: 3.90, unit: 'V', nominalRange: [3.7, 4.2], status: 'good' },
          { label: 'Cell 2', value: 3.90, unit: 'V', nominalRange: [3.7, 4.2], status: 'good' },
          { label: 'Cell 3', value: 3.90, unit: 'V', nominalRange: [3.7, 4.2], status: 'good' }
        ],
        description: 'Lithium-Polymer battery pack providing burst discharge currents to brushless motor.',
        diagnosticFinding: 'All 3 cells are balanced with zero voltage delta across cells.',
        recommendation: 'Store in Fireproof LiPo bag at 3.85V per cell when not in use for > 48 hrs.'
      },
      {
        id: 'rc-servo',
        name: 'High-Torque Waterproof Digital Steering Servo',
        shortName: 'Servo',
        category: 'Chassis',
        status: 'good',
        healthPct: 92,
        position3D: [0.15, 0.26, 0.45],
        cameraFocusPosition: [0.15, 0.26, 0.45],
        cameraPosition: [1.1, 0.7, 0.6],
        metrics: [
          { label: 'Servo Center', value: '0° (Aligned)', unit: '', status: 'good' },
          { label: 'Servo Current', value: 0.35, unit: 'A', nominalRange: [0.1, 1.8], status: 'good' }
        ],
        description: 'High torque metal gear steering servo providing fast 0.12s response.',
        diagnosticFinding: 'Steering bellcrank and servo-saver spring move freely without binding.',
        recommendation: 'Check tie-rod rod ends after rough bash sessions.'
      }
    ],
    sensors: [
      { id: 'src-rpm', label: 'Motor RPM', value: 8420, unit: 'rpm', nominalRange: [0, 45000], status: 'good', category: 'powertrain', isLiveAnimated: true },
      { id: 'src-mtemp', label: 'Motor Temp', value: 54, unit: '°C', nominalRange: [30, 75], status: 'good', category: 'thermal' },
      { id: 'src-volt', label: 'Battery Voltage', value: 11.7, unit: 'V', nominalRange: [11.1, 12.6], status: 'good', category: 'electrical', isLiveAnimated: true },
      { id: 'src-esctemp', label: 'ESC Temp', value: 42, unit: '°C', nominalRange: [25, 70], status: 'good', category: 'thermal' },
      { id: 'src-throttle', label: 'Throttle', value: 18, unit: '%', nominalRange: [0, 100], status: 'good', category: 'powertrain' },
      { id: 'src-rssi', label: 'Signal Strength', value: 96, unit: '%', nominalRange: [60, 100], status: 'good', category: 'telemetry' },
      { id: 'src-current', label: 'Current Draw', value: 34.2, unit: 'A', nominalRange: [0, 90], status: 'good', category: 'electrical', isLiveAnimated: true },
      { id: 'src-speed', label: 'Vehicle Speed', value: 28, unit: 'km/h', nominalRange: [0, 96], status: 'good', category: 'powertrain', isLiveAnimated: true }
    ],
    maintenance: [
      { id: 'mrc-bat', name: 'LiPo Battery Storage Balance', intervalValue: '25 Cycles', dueValue: '140 Cycles', remainingValue: 'After 14 more cycles', remainingNumber: 14, status: 'good', action: 'Cycle test internal resistance & balance discharge.', lastCompleted: '110 Cycles (20 Aug 2026)', costRange: '₹0' },
      { id: 'mrc-gear', name: 'Pinion & Spur Gear Mesh Check', intervalValue: '50 Runs', dueValue: '130 Runs', remainingValue: 'Due Soon (4 runs left)', remainingNumber: 4, status: 'due_soon', action: 'Inspect nylon spur teeth and pinion set screw.', lastCompleted: '80 Runs (28 Jul 2026)', costRange: '₹500 – ₹1,200' },
      { id: 'mrc-shocks', name: 'Oil-Filled Shock Rebuild', intervalValue: '50 Runs', dueValue: '150 Runs', remainingValue: '24 runs remaining', remainingNumber: 24, status: 'good', action: 'Refill 35wt silicone fluid and inspect bladder seals.', lastCompleted: '100 Runs (15 May 2026)', costRange: '₹400 – ₹900' }
    ],
    alerts: [
      {
        id: 'alt-rc1',
        title: 'Motor Heat Warning (Historical)',
        subsystem: 'Brushless Powertrain',
        urgency: 'check_soon',
        whatHappened: 'Motor core temperature reached 72°C during continuous high-speed bashing.',
        whyItMatters: 'Extended heat above 85°C can weaken neodymium rotor magnets.',
        whatShouldIDo: 'Allow 5 minute cooldown between full packs and check gear mesh.',
        timestamp: '15 mins ago',
        componentId: 'rc-motor'
      }
    ]
  },

  scooter: {
    id: 'veh-scooter-default',
    type: 'scooter',
    categoryLabel: 'Electric Scooter (Smart EV)',
    detectionLabel: 'Vehicle Detected: Smart Electric Scooter (CAN / BLE Diagnostic)',
    model: {
      name: 'Ather 450X Gen 3',
      year: 2024,
      make: 'Ather',
      variant: '450X 3.7 kWh Pro',
      vinOrSerial: 'ME4ATH450XN881920',
      model3D: '/models/scooters/electric-scooter.glb',
      icon: 'Zap'
    },
    specifications: {
      engineOrMotor: '6.4 kW PMSM Mid-Drive Motor (26 Nm)',
      transmissionOrEsc: 'Single-Speed Belt Reduction (Gates Carbon Drive)',
      driveType: 'High-Efficiency Belt Final Drive',
      fuelOrBatteryType: 'Electric (3.7 kWh 21700 Li-ion)',
      mileageOrCycles: '8,640 km (142 full cycles)',
      curbWeight: '108 kg',
      topSpeed: '90 km/h (0-40 in 3.3s)'
    },
    hardwareLink: {
      protocol: 'Smart EV CAN / Bluetooth BLE (ISO 11898)',
      medium: 'Direct BLE Wireless / Diagnostic Connector',
      deviceId: 'MMX-00124',
      latencyMs: 22,
      signalDbm: -62,
      baudRateOrFrequency: '250 kbps CAN / BLE 5.2'
    },
    healthIndex: {
      overallScore: 95,
      grade: 'A',
      statusText: 'EXCELLENT',
      summary: '3.7 kWh high-voltage lithium battery pack and PMSM electric motor are in pristine condition. All 21700 cells balanced with zero voltage delta.',
      subsystems: [
        { id: 'sub-esc-bat', name: 'High-Voltage Battery & BMS', score: 98, weight: 0.35, status: 'good', iconName: 'Zap', summary: 'Pack SOH 98%, 34°C normal temp' },
        { id: 'sub-esc-mot', name: 'PMSM Motor & Inverter', score: 96, weight: 0.25, status: 'good', iconName: 'Cpu', summary: 'Vector control efficiency 94.5%' },
        { id: 'sub-esc-belt', name: 'Gates Carbon Drive Belt', score: 90, weight: 0.15, status: 'good', iconName: 'Activity', summary: 'Tension 45 Hz (Nominal: 40-55 Hz)' },
        { id: 'sub-esc-brk', name: 'Regen Braking & Discs', score: 94, weight: 0.15, status: 'good', iconName: 'Shield', summary: 'Front & rear pads 85%, Regen active' },
        { id: 'sub-esc-tyre', name: '12-inch EV Tyres', score: 92, weight: 0.10, status: 'good', iconName: 'Activity', summary: '30.0 PSI Front, 32.5 PSI Rear' }
      ]
    },
    components: [
      {
        id: 'esc-battery',
        name: '3.7 kWh IP67 High-Voltage Lithium-Ion Battery Pack',
        shortName: 'Battery Pack',
        category: 'Electrical',
        status: 'good',
        healthPct: 98,
        position3D: [0, 0.28, 0.12],
        cameraFocusPosition: [0, 0.28, 0.12],
        cameraPosition: [1.2, 0.65, 0.3],
        metrics: [
          { label: 'State of Charge (SOC)', value: 84, unit: '%', nominalRange: [15, 100], status: 'good' },
          { label: 'Pack Voltage', value: 51.2, unit: 'V', nominalRange: [42.0, 58.8], status: 'good' },
          { label: 'Pack Temperature', value: 34, unit: '°C', nominalRange: [20, 48], status: 'good' },
          { label: 'State of Health (SOH)', value: 98, unit: '%', nominalRange: [80, 100], status: 'good' }
        ],
        description: 'High-density 21700 lithium-ion NMC cell module sealed in IP67 aluminum chassis under the floorboard.',
        diagnosticFinding: 'Active cell voltage balancing is operating with less than 4mV delta between series groups.',
        recommendation: 'Charge to 100% once weekly on standard 5A socket for cell calibration.'
      },
      {
        id: 'esc-motor',
        name: '6.4 kW High-Torque PMSM Mid-Drive Motor',
        shortName: 'PMSM Motor',
        category: 'Powertrain',
        status: 'good',
        healthPct: 96,
        position3D: [0, 0.32, -0.3],
        cameraFocusPosition: [0, 0.32, -0.3],
        cameraPosition: [1.2, 0.6, -0.2],
        metrics: [
          { label: 'Motor Speed', value: 3850, unit: 'RPM', nominalRange: [0, 7500], status: 'good' },
          { label: 'Motor Temperature', value: 48, unit: '°C', nominalRange: [25, 85], status: 'good' },
          { label: 'Instant Torque', value: 26.0, unit: 'Nm', nominalRange: [0, 26.0], status: 'good' },
          { label: 'Efficiency Index', value: 94.5, unit: '%', nominalRange: [85, 98], status: 'good' }
        ],
        description: 'Mid-mounted Permanent Magnet Synchronous Motor delivering 26 Nm instantaneous torque with Gates carbon drive belt.',
        diagnosticFinding: 'Electric motor coils, rotor magnets, and bearings are operating at nominal peak efficiency.',
        recommendation: 'Check carbon drive belt tension at scheduled 10,000 km maintenance.'
      },
      {
        id: 'esc-bms',
        name: 'Smart Battery Management System (BMS)',
        shortName: 'Smart BMS',
        category: 'Electrical',
        status: 'good',
        healthPct: 98,
        position3D: [0, 0.36, 0.32],
        cameraFocusPosition: [0, 0.36, 0.32],
        cameraPosition: [0.9, 0.75, 0.45],
        metrics: [
          { label: 'Max Cell Delta', value: '4 mV (Balanced)', unit: '', status: 'good' },
          { label: 'Thermal Sensors', value: '6/6 Active', unit: '', status: 'good' },
          { label: 'Insulation Resistance', value: '> 500 MΩ', unit: '', status: 'good' }
        ],
        description: 'Automotive-grade micro-controller monitoring individual cell voltages, over-current protection, and thermal throttling.',
        diagnosticFinding: 'Cell balancing is active with zero insulation leakage or thermal hot spots.',
        recommendation: 'Firmware is running latest OTA release v2.4.1.'
      },
      {
        id: 'esc-controller',
        name: 'FOC (Field-Oriented Control) Motor Controller Inverter',
        shortName: 'Motor Controller',
        category: 'Electrical',
        status: 'good',
        healthPct: 96,
        position3D: [0, 0.44, 0.05],
        cameraFocusPosition: [0, 0.44, 0.05],
        cameraPosition: [1.1, 0.8, 0.15],
        metrics: [
          { label: 'MOSFET Inverter Temp', value: 40, unit: '°C', nominalRange: [25, 75], status: 'good' },
          { label: 'Peak Current Output', value: 125, unit: 'A', nominalRange: [0, 150], status: 'good' },
          { label: 'Throttle Response', value: '12 ms', unit: '', status: 'good' }
        ],
        description: 'High frequency vector motor controller managing power delivery and variable regenerative energy recovery.',
        diagnosticFinding: 'Inverter power transistors and heat sink dissipation are completely stable.',
        recommendation: 'No action needed.'
      },
      {
        id: 'esc-brakes',
        name: 'Hydraulic Disc Brakes & Regenerative CBS System',
        shortName: 'Brakes & Regen',
        category: 'Braking',
        status: 'good',
        healthPct: 94,
        position3D: [0, 0.22, 0.82],
        cameraFocusPosition: [0, 0.22, 0.82],
        cameraPosition: [1.2, 0.5, 0.95],
        metrics: [
          { label: 'Front Pad Life', value: 85, unit: '%', nominalRange: [30, 100], status: 'good' },
          { label: 'Rear Pad Life', value: 82, unit: '%', nominalRange: [30, 100], status: 'good' },
          { label: 'Regen Braking Recovery', value: 14.2, unit: 'A', nominalRange: [0, 30], status: 'good' }
        ],
        description: '200mm front & 190mm rear disc brakes with Combined Braking System (CBS) and magnetic regenerative energy recovery.',
        diagnosticFinding: 'Brake pads have generous thickness thanks to regenerative electric engine braking.',
        recommendation: 'Inspect DOT 4 brake fluid level at regular service.'
      },
      {
        id: 'esc-tyres',
        name: '12-Inch Low-Rolling-Resistance Tubeless Tyres',
        shortName: 'Tyres (12-inch)',
        category: 'Chassis',
        status: 'good',
        healthPct: 92,
        position3D: [0, 0.22, -0.72],
        cameraFocusPosition: [0, 0.22, -0.72],
        cameraPosition: [1.3, 0.5, -0.85],
        metrics: [
          { label: 'Front Pressure', value: 30.0, unit: 'PSI', nominalRange: [28, 33], status: 'good' },
          { label: 'Rear Pressure', value: 32.5, unit: 'PSI', nominalRange: [30, 35], status: 'good' },
          { label: 'Tread Depth', value: 4.2, unit: 'mm', nominalRange: [2.0, 5.5], status: 'good' }
        ],
        description: '90/90-12 front and 100/80-12 rear tubeless tyres engineered for low rolling drag and wet road grip.',
        diagnosticFinding: 'Tread depth and cold inflation pressures are optimal for maximum true riding range.',
        recommendation: 'Check tyre pressures weekly with digital gauge.'
      },
      {
        id: 'esc-display',
        name: '7-inch Capacitive Touchscreen TFT Smart Dashboard',
        shortName: 'Smart Dashboard',
        category: 'Telemetry',
        status: 'good',
        healthPct: 97,
        position3D: [0, 0.98, 0.44],
        cameraFocusPosition: [0, 0.98, 0.44],
        cameraPosition: [0.6, 1.25, 0.65],
        metrics: [
          { label: 'LTE / BLE Signal', value: '-62 dBm (Strong)', unit: '', status: 'good' },
          { label: 'TrueRange Estimate', value: 118, unit: 'km', nominalRange: [20, 150], status: 'good' },
          { label: 'Riding Mode', value: 'Ride (Eco/Sport/Warp)', unit: '', status: 'good' }
        ],
        description: 'IP65-rated 7-inch color display running onboard navigation, live telemetry diagnostics, and BLE connectivity.',
        diagnosticFinding: 'Dashboard touch response and cloud telematics sync are active with zero latency.',
        recommendation: 'Keep screen clean with microfiber cloth.'
      },
      {
        id: 'esc-suspension',
        name: 'Front Telescopic Forks & Offset Rear Monoshock',
        shortName: 'Suspension',
        category: 'Chassis',
        status: 'good',
        healthPct: 94,
        position3D: [0, 0.45, 0.65],
        cameraFocusPosition: [0, 0.45, 0.65],
        cameraPosition: [1.2, 0.75, 0.85],
        metrics: [
          { label: 'Front Travel', value: '110 mm', unit: '', status: 'good' },
          { label: 'Rear Preload', value: 'Nominal (Stage 3)', unit: '', status: 'good' }
        ],
        description: 'Telescopic hydraulic front suspension and rear asymmetrical progressive monoshock tuned for urban comfort.',
        diagnosticFinding: 'Dampers absorb potholes smoothly with zero oil seepage from seals.',
        recommendation: 'Inspect fork seals during periodic washes.'
      }
    ],
    sensors: [
      { id: 'sesc-soc', label: 'Battery SOC', value: 84, unit: '%', nominalRange: [15, 100], status: 'good', category: 'electrical', isLiveAnimated: true },
      { id: 'sesc-range', label: 'TrueRange Left', value: 118, unit: 'km', nominalRange: [10, 150], status: 'good', category: 'powertrain', isLiveAnimated: true },
      { id: 'sesc-speed', label: 'Vehicle Speed', value: 42, unit: 'km/h', nominalRange: [0, 90], status: 'good', category: 'powertrain', isLiveAnimated: true },
      { id: 'sesc-rpm', label: 'Motor RPM', value: 3850, unit: 'rpm', nominalRange: [0, 7500], status: 'good', category: 'powertrain', isLiveAnimated: true },
      { id: 'sesc-btemp', label: 'Battery Temp', value: 34, unit: '°C', nominalRange: [20, 48], status: 'good', category: 'thermal' },
      { id: 'sesc-mtemp', label: 'Motor Temp', value: 48, unit: '°C', nominalRange: [25, 85], status: 'good', category: 'thermal' },
      { id: 'sesc-regen', label: 'Regen Current', value: 14.2, unit: 'A', nominalRange: [0, 30], status: 'good', category: 'electrical', isLiveAnimated: true },
      { id: 'sesc-invtemp', label: 'Inverter Temp', value: 40, unit: '°C', nominalRange: [25, 75], status: 'good', category: 'thermal' }
    ],
    maintenance: [
      { id: 'mesc-belt', name: 'Gates Carbon Drive Belt Inspection & Tension', intervalValue: '10,000 km', dueValue: '10,000 km', remainingValue: '1,360 km remaining', remainingNumber: 1360, status: 'good', action: 'Inspect carbon belt teeth and adjust acoustic tension to 45 Hz.', lastCompleted: '5,000 km (15 Jan 2026)', costRange: '₹400 – ₹1,800' },
      { id: 'mesc-brake', name: 'Hydraulic Disc Brake Pads & Fluid Bleed', intervalValue: '10,000 km', dueValue: '10,000 km', remainingValue: '1,360 km remaining', remainingNumber: 1360, status: 'good', action: 'Measure front/rear brake pad thickness and check DOT 4 fluid clarity.', lastCompleted: '5,000 km (15 Jan 2026)', costRange: '₹850 – ₹1,600' },
      { id: 'mesc-bms', name: 'Battery Pack Health & Active Cell Balancing', intervalValue: '15,000 km', dueValue: '15,000 km', remainingValue: '6,360 km remaining', remainingNumber: 6360, status: 'good', action: 'Full high-voltage BMS conductance diagnostic and capacity test.', lastCompleted: 'First Service (01 Sep 2025)', costRange: '₹0 (Under Warranty)' },
      { id: 'mesc-tyres', name: 'Tyre Tread & Wheel Alignment', intervalValue: '8,000 km', dueValue: '10,000 km', remainingValue: '1,360 km remaining', remainingNumber: 1360, status: 'good', action: 'Check 12-inch tubeless tire tread and wheel balance.', lastCompleted: '5,000 km (15 Jan 2026)', costRange: '₹300 – ₹600' }
    ],
    alerts: [
      {
        id: 'alt-sc1',
        title: 'Battery Cell Temperature & Balance Optimal',
        subsystem: 'EV High-Voltage Battery',
        urgency: 'good',
        whatHappened: 'All 21700 lithium battery modules are operating within 34°C with balanced 4mV cell delta.',
        whyItMatters: 'Healthy thermal parameters maximize battery lifespan and preserve 100+ km TrueRange.',
        whatShouldIDo: 'No action needed. Charge with regular home charger for optimal battery longevity.',
        timestamp: 'Today, 08:30 AM',
        componentId: 'esc-battery'
      }
    ]
  }
};

/**
 * Helper to construct a customized VehicleConfig based on setup form inputs
 */
export function createCustomVehicleConfig(
  type: VehicleCategory,
  custom: {
    make?: string;
    model?: string;
    year?: number | string;
    fuelOrBatteryType?: string;
    transmissionOrEsc?: string;
    mileageOrCycles?: string;
    engineOrMotor?: string;
    driveType?: string;
  }
): VehicleConfig {
  const baseKey = (type === 'scooter' || (type as string) === 'electric_scooter') ? 'scooter' : type;
  const base = JSON.parse(JSON.stringify(VEHICLE_CONFIGURATIONS[baseKey] || VEHICLE_CONFIGURATIONS.car)) as VehicleConfig;
  base.id = `veh-${type}-${Date.now()}`;

  if (custom.make || custom.model) {
    const make = custom.make || base.model.make;
    const model = custom.model || base.model.name;
    base.model.make = make;
    base.model.name = model.includes(make) ? model : `${make} ${model}`;
  }

  if (custom.year) {
    base.model.year = Number(custom.year) || base.model.year;
  }

  if (custom.fuelOrBatteryType) {
    base.specifications.fuelOrBatteryType = custom.fuelOrBatteryType;
  }

  if (custom.transmissionOrEsc) {
    base.specifications.transmissionOrEsc = custom.transmissionOrEsc;
  }

  if (custom.mileageOrCycles) {
    base.specifications.mileageOrCycles = custom.mileageOrCycles.includes('km') || custom.mileageOrCycles.includes('cycle')
      ? custom.mileageOrCycles
      : type === 'rc_car'
      ? `${custom.mileageOrCycles} cycles`
      : `${custom.mileageOrCycles} km`;
  }

  if (custom.engineOrMotor) {
    base.specifications.engineOrMotor = custom.engineOrMotor;
  }

  if (custom.driveType) {
    base.specifications.driveType = custom.driveType;
  }

  // Adjust component 3D pin coordinates based on body geometry
  const fullName = (base.model.name || '').toLowerCase();
  if (type === 'car') {
    if (fullName.includes('compact') || fullName.includes('creta') || fullName.includes('seltos') || fullName.includes('crossover')) {
      base.components.forEach(comp => {
        if (comp.id === 'engine') comp.position3D = [0, 0.52, 1.18];
        if (comp.id === 'battery') comp.position3D = [-0.5, 0.56, 0.98];
        if (comp.id === 'transmission') comp.position3D = [0.32, 0.4, 0.58];
        if (comp.id === 'brakes') comp.position3D = [0.92, 0.28, 1.18];
        if (comp.id === 'cooling') comp.position3D = [0, 0.42, 1.65];
        if (comp.id === 'tyres') comp.position3D = [-0.92, 0.28, -1.08];
        if (comp.id === 'exhaust') comp.position3D = [0, 0.22, -1.45];
        if (comp.id === 'suspension') comp.position3D = [0.7, 0.42, 1.15];
      });
    } else if (fullName.includes('suv') || fullName.includes('fortuner') || fullName.includes('everest') || fullName.includes('land cruiser')) {
      base.components.forEach(comp => {
        if (comp.id === 'engine') comp.position3D = [0, 0.62, 1.25];
        if (comp.id === 'battery') comp.position3D = [-0.55, 0.68, 1.05];
        if (comp.id === 'transmission') comp.position3D = [0.46, 0.46, 0.4];
        if (comp.id === 'brakes') comp.position3D = [0.98, 0.36, 1.25];
        if (comp.id === 'cooling') comp.position3D = [0, 0.52, 1.75];
        if (comp.id === 'tyres') comp.position3D = [-0.98, 0.36, -1.15];
        if (comp.id === 'exhaust') comp.position3D = [0.2, 0.28, -1.5];
        if (comp.id === 'suspension') comp.position3D = [0.78, 0.5, 1.2];
      });
    }
  } else if (type === 'motorcycle' && (fullName.includes('scooter') || fullName.includes('pcx') || fullName.includes('activa') || fullName.includes('vespa'))) {
    base.components.forEach(comp => {
      if (comp.id === 'm-engine') comp.position3D = [0, 0.32, -0.25];
      if (comp.id === 'm-battery') comp.position3D = [0, 0.46, 0.35];
      if (comp.id === 'm-chain') {
        comp.name = 'V-Matic CVT Belt Drive';
        comp.shortName = 'CVT / Drive';
        comp.position3D = [-0.18, 0.26, -0.45];
      }
      if (comp.id === 'm-brakes') comp.position3D = [0, 0.22, 0.82];
      if (comp.id === 'm-tyres') comp.position3D = [0, 0.22, -0.72];
    });
  }

  return base;
}
