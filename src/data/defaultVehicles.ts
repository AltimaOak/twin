import type { Vehicle } from '../types/vehicle';
import { carComponents, bikeComponents, rcCarComponents, electricScooterComponents } from './vehicleComponents';

export const DEFAULT_VEHICLES: Record<string, Vehicle> = {
  car: {
    id: 'veh-car-01',
    type: 'car',
    make: 'Honda',
    model: 'City i-VTEC',
    year: 2023,
    fuelType: 'Petrol (Gasoline)',
    mileageKm: 42380,
    vinOrSerial: 'MAKGM6674NH109823',
    ecuProtocol: 'ISO 15765-4 (CAN 11/500)',
    connectionType: 'OBD-II Port (MotoMindX MMX-00124)',
    components: carComponents
  },
  bike: {
    id: 'veh-bike-02',
    type: 'bike',
    make: 'Yamaha',
    model: 'MT-07 ABS',
    year: 2022,
    fuelType: 'Petrol (Gasoline)',
    mileageKm: 14200,
    vinOrSerial: 'JYARN45E8NA009121',
    ecuProtocol: 'Yamaha CAN Diagnostic (K-Line / CAN)',
    connectionType: '6-Pin Diagnostic Connector (MMX-00124)',
    components: bikeComponents
  },
  scooter: {
    id: 'veh-scooter-04',
    type: 'scooter',
    make: 'Ather',
    model: '450X Gen 3',
    year: 2024,
    fuelType: 'Electric (3.7 kWh Li-ion)',
    mileageKm: 8640,
    vinOrSerial: 'ME4ATH450XN881920',
    ecuProtocol: 'Smart EV CAN / Bluetooth BLE (ISO 11898)',
    connectionType: 'Direct BLE Wireless / Diagnostic Connector',
    components: electricScooterComponents
  },
  rcCar: {
    id: 'veh-rc-03',
    type: 'rcCar',
    make: 'Traxxas',
    model: 'Slash VXL 4x4 Brushless',
    year: 2024,
    fuelType: 'Electric (3S 11.1V LiPo)',
    mileageKm: 128,
    vinOrSerial: 'MMX-RC-88921-TRX',
    ecuProtocol: 'MotoMindX RC-Telemetry Protocol (UART/I2C)',
    connectionType: 'Direct Telemetry Link (915MHz LoRa / MMX-Dongle)',
    components: rcCarComponents
  }
};
