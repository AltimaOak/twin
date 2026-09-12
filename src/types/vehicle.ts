export type VehicleType = 'car' | 'bike' | 'rcCar' | 'scooter' | 'electricScooter';

export type ComponentStatus = 'normal' | 'warning' | 'critical' | 'inactive';

export interface VehicleComponentMetric {
  label: string;
  value: number | string;
  unit: string;
  nominalRange?: [number, number];
  min?: number;
  max?: number;
  status: ComponentStatus;
}

export interface VehicleComponent {
  id: string;
  name: string;
  shortName: string;
  category: 'powertrain' | 'electrical' | 'braking' | 'chassis' | 'cooling' | 'exhaust' | 'telemetry';
  position3D: [number, number, number]; // [x, y, z] in Three.js coordinate system
  cameraFocusPosition?: [number, number, number]; // Target position for camera focus
  cameraPosition?: [number, number, number]; // Where camera moves to view this
  status: ComponentStatus;
  metrics: VehicleComponentMetric[];
  description: string;
  whatDoesThisMean: string;
  recommendedAction?: string;
  lastTestedTimestamp?: string;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  fuelType: string;
  mileageKm: number;
  vinOrSerial: string;
  ecuProtocol: string;
  connectionType: string;
  components: VehicleComponent[];
}
