import type { VehicleComponent } from '../types/vehicle';

export const carComponents: VehicleComponent[] = [
  {
    id: 'engine',
    name: 'Internal Combustion Engine',
    shortName: 'Engine',
    category: 'powertrain',
    position3D: [0, 0.45, 1.15],
    cameraFocusPosition: [0, 0.45, 1.15],
    cameraPosition: [1.8, 1.2, 2.2],
    status: 'normal',
    metrics: [
      { label: 'Coolant Temp', value: 89, unit: '°C', nominalRange: [80, 98], min: 0, max: 130, status: 'normal' },
      { label: 'Engine Speed', value: 1850, unit: 'RPM', nominalRange: [650, 6000], min: 0, max: 7000, status: 'normal' },
      { label: 'Calculated Load', value: 31, unit: '%', nominalRange: [15, 85], min: 0, max: 100, status: 'normal' },
      { label: 'Oil Pressure', value: 340, unit: 'kPa', nominalRange: [200, 450], min: 0, max: 600, status: 'normal' },
    ],
    description: '1.5L 4-Cylinder DOHC i-VTEC engine delivering power to the front wheels.',
    whatDoesThisMean: 'Your engine is running smoothly at healthy temperatures and normal mechanical loads.',
    recommendedAction: 'No immediate action required. Next regular oil check in 800 km.'
  },
  {
    id: 'battery',
    name: '12V Lead-Acid Starter Battery',
    shortName: 'Battery',
    category: 'electrical',
    position3D: [-0.48, 0.5, 0.95],
    cameraFocusPosition: [-0.48, 0.5, 0.95],
    cameraPosition: [-1.6, 1.4, 1.8],
    status: 'warning',
    metrics: [
      { label: 'Terminal Voltage', value: 12.3, unit: 'V', nominalRange: [12.4, 14.6], min: 10, max: 16, status: 'warning' },
      { label: 'Alternator Charging', value: 13.9, unit: 'V', nominalRange: [13.6, 14.7], min: 11, max: 16, status: 'normal' },
      { label: 'State of Health (SOH)', value: 78, unit: '%', nominalRange: [75, 100], min: 0, max: 100, status: 'warning' },
    ],
    description: 'Supplies electrical power to crank the starter motor and run vehicle electronics when the engine is off.',
    whatDoesThisMean: 'The battery holds a slightly lower resting charge than normal after cold starts, though the alternator is charging properly.',
    recommendedAction: 'Have your battery load tested during your next service visit to prevent unexpected no-start issues.'
  },
  {
    id: 'brakes',
    name: 'Hydraulic Disc Braking System',
    shortName: 'Brakes',
    category: 'braking',
    position3D: [0.88, 0.25, 1.15],
    cameraFocusPosition: [0.88, 0.25, 1.15],
    cameraPosition: [1.8, 0.6, 1.4],
    status: 'warning',
    metrics: [
      { label: 'Front Pad Life', value: 28, unit: '%', nominalRange: [30, 100], min: 0, max: 100, status: 'warning' },
      { label: 'Rear Pad Life', value: 55, unit: '%', nominalRange: [30, 100], min: 0, max: 100, status: 'normal' },
      { label: 'Brake Fluid Moisture', value: 1.8, unit: '%', nominalRange: [0, 3.0], min: 0, max: 5, status: 'normal' },
    ],
    description: 'Front ventilated discs with single-piston sliding calipers and electronic brake-force distribution (EBD).',
    whatDoesThisMean: 'Front brake pads are approaching the replacement threshold (approx 3.2mm remaining).',
    recommendedAction: 'Schedule a brake inspection within the next 1,000–1,500 km.'
  },
  {
    id: 'cooling',
    name: 'Engine Cooling & Radiator Circuit',
    shortName: 'Cooling System',
    category: 'cooling',
    position3D: [0, 0.35, 1.6],
    cameraFocusPosition: [0, 0.35, 1.6],
    cameraPosition: [0, 1.1, 2.5],
    status: 'normal',
    metrics: [
      { label: 'Radiator Out Temp', value: 74, unit: '°C', nominalRange: [60, 85], min: 0, max: 120, status: 'normal' },
      { label: 'Coolant Level Sensor', value: 'OK', unit: '', status: 'normal' },
      { label: 'Thermostat Valve', value: 'Open (Auto)', unit: '', status: 'normal' },
    ],
    description: 'Circulates ethylene-glycol coolant between engine water jackets and front aluminum radiator.',
    whatDoesThisMean: 'The cooling system is maintaining the engine at optimal combustion temperature with no leaks detected.',
    recommendedAction: 'Coolant condition is good. Inspect reservoir level at regular maintenance.'
  },
  {
    id: 'tyres',
    name: 'All-Season Radial Tyres (TPMS)',
    shortName: 'Tyres',
    category: 'chassis',
    position3D: [-0.88, 0.25, -1.05],
    cameraFocusPosition: [-0.88, 0.25, -1.05],
    cameraPosition: [-2.0, 0.6, -1.4],
    status: 'normal',
    metrics: [
      { label: 'Front-Left Pressure', value: 32.5, unit: 'PSI', nominalRange: [30, 35], min: 0, max: 50, status: 'normal' },
      { label: 'Front-Right Pressure', value: 32.8, unit: 'PSI', nominalRange: [30, 35], min: 0, max: 50, status: 'normal' },
      { label: 'Rear-Left Pressure', value: 32.0, unit: 'PSI', nominalRange: [30, 35], min: 0, max: 50, status: 'normal' },
      { label: 'Rear-Right Pressure', value: 32.2, unit: 'PSI', nominalRange: [30, 35], min: 0, max: 50, status: 'normal' },
    ],
    description: '185/55 R16 tyres with direct wheel-speed CAN based TPMS monitoring.',
    whatDoesThisMean: 'All 4 tyres have balanced, healthy air pressures with even rotation wear.',
    recommendedAction: 'Tread depth is healthy. Rotate tyres at the next scheduled 10,000 km mark.'
  },
  {
    id: 'transmission',
    name: 'Continuously Variable Transmission (CVT)',
    shortName: 'Transmission',
    category: 'powertrain',
    position3D: [0.3, 0.35, 0.6],
    cameraFocusPosition: [0.3, 0.35, 0.6],
    cameraPosition: [1.7, 0.9, 1.2],
    status: 'normal',
    metrics: [
      { label: 'Transmission Fluid Temp', value: 76, unit: '°C', nominalRange: [65, 95], min: 0, max: 140, status: 'normal' },
      { label: 'Pulley Ratio', value: 1.42, unit: '', nominalRange: [0.5, 2.5], min: 0, max: 4, status: 'normal' },
      { label: 'Torque Converter Slip', value: 0.8, unit: '%', nominalRange: [0, 4.0], min: 0, max: 10, status: 'normal' },
    ],
    description: 'Electronically controlled CVT delivering seamless gearless acceleration and fuel efficiency.',
    whatDoesThisMean: 'Transmission fluid temperature and hydraulic pulley response are performing as expected.',
    recommendedAction: 'CVT fluid replacement scheduled in 18,000 km.'
  },
  {
    id: 'fuelSystem',
    name: 'Electronic Fuel Injection (EFI)',
    shortName: 'Fuel System',
    category: 'powertrain',
    position3D: [-0.2, 0.4, 0.7],
    cameraFocusPosition: [-0.2, 0.4, 0.7],
    cameraPosition: [-1.4, 1.1, 1.3],
    status: 'normal',
    metrics: [
      { label: 'Fuel Rail Pressure', value: 380, unit: 'kPa', nominalRange: [320, 420], min: 0, max: 600, status: 'normal' },
      { label: 'Short-Term Fuel Trim', value: '+1.5', unit: '%', nominalRange: [-5, 5], min: -25, max: 25, status: 'normal' },
      { label: 'Fuel Tank Remaining', value: 68, unit: '%', nominalRange: [15, 100], min: 0, max: 100, status: 'normal' },
    ],
    description: 'High pressure multi-point fuel injection rail with closed-loop O2 sensor feedback.',
    whatDoesThisMean: 'Fuel metering and air-fuel ratio balance are within optimal factory parameters.',
    recommendedAction: 'Fuel system is in great shape.'
  },
  {
    id: 'exhaust',
    name: 'Exhaust & Catalytic Converter',
    shortName: 'Exhaust',
    category: 'exhaust',
    position3D: [0, 0.18, -1.4],
    cameraFocusPosition: [0, 0.18, -1.4],
    cameraPosition: [0, 0.8, -2.6],
    status: 'normal',
    metrics: [
      { label: 'Catalyst Temp (B1S1)', value: 540, unit: '°C', nominalRange: [400, 800], min: 0, max: 1000, status: 'normal' },
      { label: 'O2 Sensor Voltage', value: 0.72, unit: 'V', nominalRange: [0.1, 0.9], min: 0, max: 1.2, status: 'normal' },
      { label: 'Emissions Status', value: 'Pass (Ready)', unit: '', status: 'normal' },
    ],
    description: 'Three-way catalytic converter and muffler reducing harmful tailpipe emissions.',
    whatDoesThisMean: 'Emissions monitors are fully set and tailpipe exhaust cleansing is functioning properly.',
    recommendedAction: 'No action needed.'
  },
  {
    id: 'suspension',
    name: 'MacPherson Strut & Torsion Beam',
    shortName: 'Suspension',
    category: 'chassis',
    position3D: [0.65, 0.35, 1.1],
    cameraFocusPosition: [0.65, 0.35, 1.1],
    cameraPosition: [1.8, 0.7, 1.6],
    status: 'normal',
    metrics: [
      { label: 'Damper Rebound Rate', value: 'Normal', unit: '', status: 'normal' },
      { label: 'Bushing Integrity', value: 'Good', unit: '', status: 'normal' },
      { label: 'Ride Height Offset', value: 0.2, unit: 'mm', nominalRange: [-5, 5], min: -20, max: 20, status: 'normal' },
    ],
    description: 'Front coil-over struts and rear stabilizer bar absorbing road vibrations and ensuring cornering stability.',
    whatDoesThisMean: 'Chassis alignment and shock absorbers are dampening bumps cleanly without sag.',
    recommendedAction: 'Inspect bushings and ball joints at 50,000 km service.'
  }
];

export const bikeComponents: VehicleComponent[] = [
  {
    id: 'bike-engine',
    name: '689cc 270° Crossplane Parallel-Twin',
    shortName: 'Engine',
    category: 'powertrain',
    position3D: [0, 0.45, 0.05],
    cameraFocusPosition: [0, 0.45, 0.05],
    cameraPosition: [1.6, 0.8, 0.5],
    status: 'normal',
    metrics: [
      { label: 'Engine Temp', value: 86, unit: '°C', nominalRange: [75, 102], min: 0, max: 130, status: 'normal' },
      { label: 'Idle / Running RPM', value: 2400, unit: 'RPM', nominalRange: [1200, 9500], min: 0, max: 11000, status: 'normal' },
      { label: 'Oil Level Switch', value: 'OK', unit: '', status: 'normal' },
    ],
    description: 'Liquid-cooled 4-stroke CP2 engine known for linear torque and responsive power delivery.',
    whatDoesThisMean: 'Your motorcycle engine is operating at optimal operating temperature with stable combustion.',
    recommendedAction: 'Routine oil and filter change due in 2,400 km.'
  },
  {
    id: 'bike-battery',
    name: '12V 8.6Ah AGM Motorcycle Battery',
    shortName: 'Battery',
    category: 'electrical',
    position3D: [0, 0.58, -0.2],
    cameraFocusPosition: [0, 0.58, -0.2],
    cameraPosition: [1.2, 1.1, -0.1],
    status: 'normal',
    metrics: [
      { label: 'Terminal Voltage', value: 12.8, unit: 'V', nominalRange: [12.6, 14.8], min: 10, max: 16, status: 'normal' },
      { label: 'Charging Output', value: 14.2, unit: 'V', nominalRange: [13.8, 14.8], min: 11, max: 16, status: 'normal' },
    ],
    description: 'Maintenance-free sealed AGM battery nestled below the rider seat.',
    whatDoesThisMean: 'Battery voltage and stator charging output are healthy and ready for cold starts.',
    recommendedAction: 'Keep on a battery maintainer if parking unused for longer than 3 weeks.'
  },
  {
    id: 'bike-fuel',
    name: 'Fuel Delivery & Tank Level',
    shortName: 'Fuel System',
    category: 'powertrain',
    position3D: [0, 0.72, 0.3],
    cameraFocusPosition: [0, 0.72, 0.3],
    cameraPosition: [1.2, 1.2, 0.8],
    status: 'normal',
    metrics: [
      { label: 'Tank Level', value: 74, unit: '%', nominalRange: [10, 100], min: 0, max: 100, status: 'normal' },
      { label: 'Estimated Range', value: 245, unit: 'km', nominalRange: [30, 350], min: 0, max: 400, status: 'normal' },
      { label: 'Throttle Position', value: 18, unit: '%', nominalRange: [0, 100], min: 0, max: 100, status: 'normal' },
    ],
    description: '14-Liter fuel tank with submerged electric fuel pump and digital sender unit.',
    whatDoesThisMean: 'Fuel supply is clear with plenty of riding range.',
    recommendedAction: 'No action needed.'
  },
  {
    id: 'bike-brakes',
    name: 'Dual 298mm Front & 245mm Rear ABS Discs',
    shortName: 'Brakes (ABS)',
    category: 'braking',
    position3D: [0, 0.28, 0.95],
    cameraFocusPosition: [0, 0.28, 0.95],
    cameraPosition: [1.4, 0.5, 1.2],
    status: 'normal',
    metrics: [
      { label: 'Front Sintered Pad', value: 72, unit: '%', nominalRange: [25, 100], min: 0, max: 100, status: 'normal' },
      { label: 'Rear Pad Life', value: 68, unit: '%', nominalRange: [25, 100], min: 0, max: 100, status: 'normal' },
      { label: 'ABS System Status', value: 'Active / Ready', unit: '', status: 'normal' },
    ],
    description: 'Dual 4-pot monoblock front calipers with 2-channel anti-lock braking.',
    whatDoesThisMean: 'Brake pads have generous thickness and ABS sensors detect zero wheel slip errors.',
    recommendedAction: 'Check brake fluid clarity during next seasonal checkup.'
  },
  {
    id: 'bike-chain',
    name: '525 Sealed O-Ring Final Drive Chain',
    shortName: 'Chain / Drive',
    category: 'powertrain',
    position3D: [-0.18, 0.26, -0.65],
    cameraFocusPosition: [-0.18, 0.26, -0.65],
    cameraPosition: [-1.4, 0.5, -0.7],
    status: 'warning',
    metrics: [
      { label: 'Chain Slack', value: 36, unit: 'mm', nominalRange: [25, 35], min: 10, max: 60, status: 'warning' },
      { label: 'Sprocket Wear', value: 'Minor', unit: '', status: 'normal' },
      { label: 'Lube Condition', value: 'Needs Lube', unit: '', status: 'warning' },
    ],
    description: 'Heavy duty steel link chain transferring engine torque to the 180-width rear wheel.',
    whatDoesThisMean: 'The chain has loosened slightly past the recommended 30mm target slack and should be cleaned and lubricated.',
    recommendedAction: 'Clean, lubricate, and adjust chain tension within the next 200 km.'
  },
  {
    id: 'bike-front-tyre',
    name: '120/70 ZR17 Front Radial Tyre',
    shortName: 'Front Tyre',
    category: 'chassis',
    position3D: [0, 0.25, 0.95],
    cameraFocusPosition: [0, 0.25, 0.95],
    cameraPosition: [1.3, 0.5, 1.2],
    status: 'normal',
    metrics: [
      { label: 'Cold Pressure', value: 33.0, unit: 'PSI', nominalRange: [32, 36], min: 0, max: 50, status: 'normal' },
      { label: 'Tread Depth', value: 3.8, unit: 'mm', nominalRange: [2.0, 5.0], min: 0, max: 6, status: 'normal' },
    ],
    description: 'Front steering tire responsible for turn-in grip and front braking traction.',
    whatDoesThisMean: 'Pressure is spot-on with healthy cornering tread.',
    recommendedAction: 'Check cold tyre pressure before weekly long rides.'
  },
  {
    id: 'bike-rear-tyre',
    name: '180/55 ZR17 Rear Radial Tyre',
    shortName: 'Rear Tyre',
    category: 'chassis',
    position3D: [0, 0.28, -0.85],
    cameraFocusPosition: [0, 0.28, -0.85],
    cameraPosition: [1.4, 0.5, -1.0],
    status: 'normal',
    metrics: [
      { label: 'Cold Pressure', value: 36.5, unit: 'PSI', nominalRange: [35, 40], min: 0, max: 50, status: 'normal' },
      { label: 'Tread Depth', value: 4.2, unit: 'mm', nominalRange: [2.0, 6.0], min: 0, max: 8, status: 'normal' },
    ],
    description: 'Wide sport contact patch providing acceleration traction and stability.',
    whatDoesThisMean: 'Optimal contact patch pressure and tread.',
    recommendedAction: 'No action needed.'
  },
  {
    id: 'bike-cooling',
    name: 'Compact Curved Aluminum Radiator',
    shortName: 'Cooling System',
    category: 'cooling',
    position3D: [0, 0.52, 0.6],
    cameraFocusPosition: [0, 0.52, 0.6],
    cameraPosition: [0, 0.9, 1.6],
    status: 'normal',
    metrics: [
      { label: 'Radiator Temp', value: 81, unit: '°C', nominalRange: [70, 98], min: 0, max: 125, status: 'normal' },
      { label: 'Cooling Fan', value: 'OFF (Auto)', unit: '', status: 'normal' },
    ],
    description: 'Front-mounted cooling core with thermostatic bypass valve.',
    whatDoesThisMean: 'Sufficient airflow and fluid flow to manage high engine heat during riding.',
    recommendedAction: 'Inspect radiator fins for debris during periodic washes.'
  },
  {
    id: 'bike-suspension',
    name: '41mm Telescopic Forks & Rear Monoshock',
    shortName: 'Suspension',
    category: 'chassis',
    position3D: [0, 0.55, 0.7],
    cameraFocusPosition: [0, 0.55, 0.7],
    cameraPosition: [1.4, 0.9, 1.0],
    status: 'normal',
    metrics: [
      { label: 'Fork Seal Leakage', value: 'Dry / Clean', unit: '', status: 'normal' },
      { label: 'Rear Preload Setting', value: 'Stage 4 (Medium)', unit: '', status: 'normal' },
    ],
    description: '130mm travel front suspension paired with an asymmetric rear link-type monoshock.',
    whatDoesThisMean: 'Dampers are smooth with zero oil seepage from the fork stanchions.',
    recommendedAction: 'No action required.'
  }
];

export const rcCarComponents: VehicleComponent[] = [
  {
    id: 'rc-motor',
    name: 'Velineon 3500kV Sensorless Brushless Motor',
    shortName: 'Motor',
    category: 'powertrain',
    position3D: [-0.18, 0.28, -0.35],
    cameraFocusPosition: [-0.18, 0.28, -0.35],
    cameraPosition: [-1.2, 0.8, -0.2],
    status: 'normal',
    metrics: [
      { label: 'Motor Temperature', value: 58, unit: '°C', nominalRange: [30, 75], min: 0, max: 105, status: 'normal' },
      { label: 'Rotor RPM', value: 28400, unit: 'RPM', nominalRange: [0, 45000], min: 0, max: 55000, status: 'normal' },
      { label: 'Thermal Headroom', value: 27, unit: '°C', nominalRange: [15, 60], min: 0, max: 80, status: 'normal' },
    ],
    description: 'High-RPM 4-pole brushless electric motor driving the heavy-duty 4x4 drivetrain shaft.',
    whatDoesThisMean: 'Motor temperature is safe and well below the 85°C magnet thermal limit.',
    recommendedAction: 'Keep cooling fin heat sink clear of gravel and grass.'
  },
  {
    id: 'rc-esc',
    name: 'VXL-3s Waterproof Electronic Speed Control',
    shortName: 'ESC',
    category: 'electrical',
    position3D: [0.18, 0.32, -0.15],
    cameraFocusPosition: [0.18, 0.32, -0.15],
    cameraPosition: [1.2, 0.9, -0.1],
    status: 'normal',
    metrics: [
      { label: 'MOSFET Temperature', value: 49, unit: '°C', nominalRange: [25, 70], min: 0, max: 95, status: 'normal' },
      { label: 'Peak Current Draw', value: 42.5, unit: 'A', nominalRange: [5, 90], min: 0, max: 120, status: 'normal' },
      { label: 'BEC Voltage', value: 6.0, unit: 'V', nominalRange: [5.8, 6.2], min: 4, max: 8, status: 'normal' },
    ],
    description: 'Microprocessor speed controller handling high-amp switching between battery and motor.',
    whatDoesThisMean: 'ESC electronics and cooling fan are running comfortably within current thresholds.',
    recommendedAction: 'No action needed. Low Voltage Detection (LVD) is active.'
  },
  {
    id: 'rc-battery',
    name: '3S 11.1V 5000mAh 50C Hardcase LiPo Pack',
    shortName: 'Battery (3S LiPo)',
    category: 'electrical',
    position3D: [-0.22, 0.24, 0.05],
    cameraFocusPosition: [-0.22, 0.24, 0.05],
    cameraPosition: [-1.3, 0.7, 0.2],
    status: 'normal',
    metrics: [
      { label: 'Total Pack Voltage', value: 11.82, unit: 'V', nominalRange: [11.1, 12.6], min: 9.6, max: 12.6, status: 'normal' },
      { label: 'Cell 1 Voltage', value: 3.94, unit: 'V', nominalRange: [3.7, 4.2], min: 3.0, max: 4.25, status: 'normal' },
      { label: 'Cell 2 Voltage', value: 3.94, unit: 'V', nominalRange: [3.7, 4.2], min: 3.0, max: 4.25, status: 'normal' },
      { label: 'Cell 3 Voltage', value: 3.94, unit: 'V', nominalRange: [3.7, 4.2], min: 3.0, max: 4.25, status: 'normal' },
      { label: 'Internal Delta IR', value: '1.8 mΩ (Balanced)', unit: '', status: 'normal' },
    ],
    description: 'Lithium-Polymer power pack delivering burst discharge current to the brushless power system.',
    whatDoesThisMean: 'All 3 battery cells are in balanced health with zero voltage delta across cells.',
    recommendedAction: 'Charge at 1C (5.0A) balance mode and store at 3.85V per cell when resting.'
  },
  {
    id: 'rc-servo',
    name: 'High-Torque Waterproof Digital Steering Servo',
    shortName: 'Steering Servo',
    category: 'chassis',
    position3D: [0.15, 0.26, 0.45],
    cameraFocusPosition: [0.15, 0.26, 0.45],
    cameraPosition: [1.1, 0.7, 0.6],
    status: 'normal',
    metrics: [
      { label: 'Servo Angle', value: '0° (Centered)', unit: '', status: 'normal' },
      { label: 'Trim Offset', value: '+1.2%', unit: '', status: 'normal' },
      { label: 'Servo Current', value: 0.35, unit: 'A', nominalRange: [0.1, 1.8], min: 0, max: 3, status: 'normal' },
    ],
    description: 'Digital metal-gear steering actuator providing quick 0.12s/60° front wheel steering response.',
    whatDoesThisMean: 'Centering and bellcrank linkages move freely with no binding or gear stripping.',
    recommendedAction: 'Check servo saver spring tension after rough jumping sessions.'
  },
  {
    id: 'rc-front-wheels',
    name: 'Dual Front Independent A-Arms & Wheels',
    shortName: 'Front Wheels',
    category: 'chassis',
    position3D: [0.55, 0.22, 0.55],
    cameraFocusPosition: [0.55, 0.22, 0.55],
    cameraPosition: [1.4, 0.6, 0.8],
    status: 'normal',
    metrics: [
      { label: 'Toe / Camber', value: '-1.0° / -1.5°', unit: '', status: 'normal' },
      { label: 'Bearing Smoothness', value: 'Smooth', unit: '', status: 'normal' },
      { label: 'Hex Drive Pin', value: 'Tight', unit: '', status: 'normal' },
    ],
    description: 'Front beadlock wheels with dual wishbone A-arms and oil-filled composite shocks.',
    whatDoesThisMean: 'Front steering hubs and suspension arms articulate freely without slop.',
    recommendedAction: 'Blow out grit around wheel hexes and rubber seals after track runs.'
  },
  {
    id: 'rc-rear-wheels',
    name: 'Rear Drive Axle & Traction Wheels',
    shortName: 'Rear Wheels',
    category: 'chassis',
    position3D: [0.55, 0.22, -0.55],
    cameraFocusPosition: [0.55, 0.22, -0.55],
    cameraPosition: [1.4, 0.6, -0.8],
    status: 'normal',
    metrics: [
      { label: 'Differential Mesh', value: 'Smooth (Sealed)', unit: '', status: 'normal' },
      { label: 'Slipper Clutch Slip', value: '0% (Locked)', unit: '', status: 'normal' },
    ],
    description: 'Rear drive wheels connected to steel planetary differential and drive hub cups.',
    whatDoesThisMean: 'Rear drive shafts and tire glue beads are solid.',
    recommendedAction: 'Re-oil silicone shock fluid (35wt) after 20 runtime packs.'
  },
  {
    id: 'rc-telemetry',
    name: 'MotoMindX RC-Telemetry 915MHz LoRa Module',
    shortName: 'Telemetry Link',
    category: 'telemetry',
    position3D: [0, 0.48, -0.05],
    cameraFocusPosition: [0, 0.48, -0.05],
    cameraPosition: [0.9, 0.9, 0.1],
    status: 'normal',
    metrics: [
      { label: 'RSSI Link Signal', value: -58, unit: 'dBm', nominalRange: [-90, -30], min: -120, max: 0, status: 'normal' },
      { label: 'Packet Rate', value: 50, unit: 'Hz', nominalRange: [20, 50], min: 0, max: 60, status: 'normal' },
      { label: 'Link Latency', value: 18, unit: 'ms', nominalRange: [10, 45], min: 0, max: 100, status: 'normal' },
    ],
    description: 'Direct CAN/UART hardware sensor bridge transmitting real-time voltage, current, RPM, and temps.',
    whatDoesThisMean: 'Strong direct wireless telemetry uplink with zero packet drops.',
    recommendedAction: 'Ensure antenna tube stays perpendicular to ground for max transmission range.'
  }
];

export const electricScooterComponents: VehicleComponent[] = [
  {
    id: 'esc-battery',
    name: '3.7 kWh IP67 High-Voltage Lithium-Ion Battery Pack',
    shortName: 'Battery Pack',
    category: 'electrical',
    position3D: [0, 0.28, 0.12],
    cameraFocusPosition: [0, 0.28, 0.12],
    cameraPosition: [1.2, 0.65, 0.3],
    status: 'normal',
    metrics: [
      { label: 'State of Charge (SOC)', value: 84, unit: '%', nominalRange: [15, 100], min: 0, max: 100, status: 'normal' },
      { label: 'Pack Voltage', value: 51.2, unit: 'V', nominalRange: [42.0, 58.8], min: 38, max: 62, status: 'normal' },
      { label: 'Pack Temperature', value: 34, unit: '°C', nominalRange: [20, 48], min: 0, max: 65, status: 'normal' },
      { label: 'State of Health (SOH)', value: 98, unit: '%', nominalRange: [80, 100], min: 0, max: 100, status: 'normal' }
    ],
    description: 'High-density 21700 lithium-ion NMC cell module with die-cast aluminum enclosure and smart thermal monitoring.',
    whatDoesThisMean: 'Your battery pack is at 84% charge with perfectly balanced cell voltages and healthy operating temperature.',
    recommendedAction: 'No action needed. Charge on standard home socket (5A) to keep battery conditioned.'
  },
  {
    id: 'esc-motor',
    name: '6.4 kW High-Torque PMSM Mid-Drive Motor',
    shortName: 'PMSM Motor',
    category: 'powertrain',
    position3D: [0, 0.32, -0.3],
    cameraFocusPosition: [0, 0.32, -0.3],
    cameraPosition: [1.2, 0.6, -0.2],
    status: 'normal',
    metrics: [
      { label: 'Motor Speed', value: 3850, unit: 'RPM', nominalRange: [0, 7500], min: 0, max: 8000, status: 'normal' },
      { label: 'Motor Temperature', value: 48, unit: '°C', nominalRange: [25, 85], min: 0, max: 115, status: 'normal' },
      { label: 'Instant Torque', value: 26.0, unit: 'Nm', nominalRange: [0, 26.0], min: 0, max: 32, status: 'normal' },
      { label: 'Efficiency Index', value: 94.5, unit: '%', nominalRange: [85, 98], min: 0, max: 100, status: 'normal' }
    ],
    description: 'Permanent Magnet Synchronous Motor delivering 26 Nm instantaneous torque with Gates carbon belt final drive.',
    whatDoesThisMean: 'Electric motor coils, rotor magnets, and bearings are operating at maximum efficiency with zero vibration.',
    recommendedAction: 'Check carbon drive belt tension at scheduled 10,000 km maintenance.'
  },
  {
    id: 'esc-bms',
    name: 'Smart Battery Management System (BMS)',
    shortName: 'Smart BMS',
    category: 'electrical',
    position3D: [0, 0.36, 0.32],
    cameraFocusPosition: [0, 0.36, 0.32],
    cameraPosition: [0.9, 0.75, 0.45],
    status: 'normal',
    metrics: [
      { label: 'Max Cell Delta', value: '4 mV (Balanced)', unit: '', status: 'normal' },
      { label: 'Thermal Sensors', value: '6/6 Active', unit: '', status: 'normal' },
      { label: 'Insulation Resistance', value: '> 500 MΩ', unit: '', status: 'normal' }
    ],
    description: 'Automotive-grade micro-controller monitoring individual cell voltages, over-current protection, and thermal throttling.',
    whatDoesThisMean: 'Active cell balancing is operational with zero insulation leakage or thermal hot spots.',
    recommendedAction: 'Firmware is running latest OTA release v2.4.1.'
  },
  {
    id: 'esc-controller',
    name: 'FOC (Field-Oriented Control) Motor Controller Inverter',
    shortName: 'Motor Controller',
    category: 'electrical',
    position3D: [0, 0.44, 0.05],
    cameraFocusPosition: [0, 0.44, 0.05],
    cameraPosition: [1.1, 0.8, 0.15],
    status: 'normal',
    metrics: [
      { label: 'MOSFET Inverter Temp', value: 40, unit: '°C', nominalRange: [25, 75], min: 0, max: 95, status: 'normal' },
      { label: 'Peak Current Output', value: 125, unit: 'A', nominalRange: [0, 150], min: 0, max: 180, status: 'normal' },
      { label: 'Throttle Response', value: '12 ms', unit: '', status: 'normal' }
    ],
    description: 'High frequency vector motor controller managing power delivery and variable regenerative energy recovery.',
    whatDoesThisMean: 'Inverter transistors and heatsink heat dissipation are completely stable.',
    recommendedAction: 'No action needed.'
  },
  {
    id: 'esc-brakes',
    name: 'Hydraulic Disc Brakes & Regenerative CBS System',
    shortName: 'Brakes & Regen',
    category: 'braking',
    position3D: [0, 0.22, 0.82],
    cameraFocusPosition: [0, 0.22, 0.82],
    cameraPosition: [1.2, 0.5, 0.95],
    status: 'normal',
    metrics: [
      { label: 'Front 200mm Pad Life', value: 85, unit: '%', nominalRange: [30, 100], min: 0, max: 100, status: 'normal' },
      { label: 'Rear 190mm Pad Life', value: 82, unit: '%', nominalRange: [30, 100], min: 0, max: 100, status: 'normal' },
      { label: 'Regen Braking Recovery', value: 14.2, unit: 'A', nominalRange: [0, 30], min: 0, max: 35, status: 'normal' }
    ],
    description: '200mm front & 190mm rear disc brakes with Combined Braking System (CBS) and magnetic regenerative energy recovery.',
    whatDoesThisMean: 'Mechanical brake pads have generous life thanks to regenerative electronic engine braking.',
    recommendedAction: 'Inspect DOT 4 brake fluid level at regular service.'
  },
  {
    id: 'esc-tyres',
    name: '12-Inch Low-Rolling-Resistance Tubeless Tyres',
    shortName: 'Tyres (12-inch)',
    category: 'chassis',
    position3D: [0, 0.22, -0.72],
    cameraFocusPosition: [0, 0.22, -0.72],
    cameraPosition: [1.3, 0.5, -0.85],
    status: 'normal',
    metrics: [
      { label: 'Front Pressure', value: 30.0, unit: 'PSI', nominalRange: [28, 33], min: 0, max: 45, status: 'normal' },
      { label: 'Rear Pressure', value: 32.5, unit: 'PSI', nominalRange: [30, 35], min: 0, max: 45, status: 'normal' },
      { label: 'Tread Depth', value: 4.2, unit: 'mm', nominalRange: [2.0, 5.5], min: 0, max: 6, status: 'normal' }
    ],
    description: '90/90-12 front and 100/80-12 rear tubeless tyres engineered for low rolling drag and wet road grip.',
    whatDoesThisMean: 'Tread depth and cold inflation pressures are optimal for maximum true riding range.',
    recommendedAction: 'Check tire pressures weekly with digital gauge.'
  },
  {
    id: 'esc-display',
    name: '7-inch Capacitive Touchscreen TFT Smart Dashboard',
    shortName: 'Smart Dashboard',
    category: 'telemetry',
    position3D: [0, 0.98, 0.44],
    cameraFocusPosition: [0, 0.98, 0.44],
    cameraPosition: [0.6, 1.25, 0.65],
    status: 'normal',
    metrics: [
      { label: 'LTE / BLE Signal', value: '-62 dBm (Strong)', unit: '', status: 'normal' },
      { label: 'TrueRange Estimate', value: 118, unit: 'km', nominalRange: [20, 150], min: 0, max: 160, status: 'normal' },
      { label: 'Riding Mode', value: 'Ride (Eco/Sport/Warp)', unit: '', status: 'normal' }
    ],
    description: 'IP65-rated 7-inch color display running onboard navigation, live telemetry diagnostics, and BLE connectivity.',
    whatDoesThisMean: 'Dashboard touch response and cloud telematics sync are active with zero latency.',
    recommendedAction: 'Keep screen clean with microfiber cloth.'
  },
  {
    id: 'esc-suspension',
    name: 'Front Telescopic Forks & Offset Rear Monoshock',
    shortName: 'Suspension',
    category: 'chassis',
    position3D: [0, 0.45, 0.65],
    cameraFocusPosition: [0, 0.45, 0.65],
    cameraPosition: [1.2, 0.75, 0.85],
    status: 'normal',
    metrics: [
      { label: 'Front Travel', value: '110 mm', unit: '', status: 'normal' },
      { label: 'Rear Preload', value: 'Nominal (Stage 3)', unit: '', status: 'normal' }
    ],
    description: 'Telescopic hydraulic front suspension and rear asymmetrical progressive monoshock tuned for urban comfort.',
    whatDoesThisMean: 'Dampers absorb potholes smoothly with zero oil seepage from seals.',
    recommendedAction: 'Inspect fork seals during periodic washes.'
  }
];
