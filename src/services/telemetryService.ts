import type { CarTelemetry, BikeTelemetry, RcCarTelemetry, ElectricScooterTelemetry, TelemetryHistoryPoint, LiveTelemetrySnapshot } from '../types/telemetry';
import type { VehicleType } from '../types/vehicle';
import { DeviceService } from './deviceService';

type TelemetryListener = (data: LiveTelemetrySnapshot) => void;

export class TelemetryService {
  private static instance: TelemetryService;
  private timer: number | null = null;
  private vehicleType: VehicleType = 'car';
  private listeners: Set<TelemetryListener> = new Set();
  private history: TelemetryHistoryPoint[] = [];

  // Simulated internal physics state
  private carState: CarTelemetry = {
    speedKmh: 58,
    engineRpm: 1850,
    coolantTempC: 89,
    batteryVoltageV: 13.9,
    engineLoadPct: 31,
    fuelLevelPct: 68,
    fuelEfficiencyKmpl: 16.4,
    oilPressureKpa: 340,
    intakeAirTempC: 32,
    throttlePositionPct: 24,
    tirePressurePsi: {
      frontLeft: 32.5,
      frontRight: 32.8,
      rearLeft: 32.0,
      rearRight: 32.2
    },
    gear: 'D'
  };

  private bikeState: BikeTelemetry = {
    speedKmh: 64,
    engineRpm: 3400,
    engineTempC: 86,
    batteryVoltageV: 14.1,
    throttlePositionPct: 28,
    gear: 4,
    fuelLevelPct: 74,
    leanAngleDeg: 4.2,
    chainSlackMm: 36,
    ambientTempC: 28,
    tirePressurePsi: {
      front: 33.0,
      rear: 36.5
    }
  };

  private rcState: RcCarTelemetry = {
    speedKmh: 34,
    motorRpm: 28400,
    motorTempC: 58,
    escTempC: 49,
    packVoltageV: 11.82,
    cellVoltagesV: [3.94, 3.94, 3.94],
    currentDrawAmps: 34.2,
    powerWatts: 404,
    signalRssiDbm: -58,
    servoAngleDeg: 0,
    throttleTrimPct: 0,
    batteryCapacityMahRemaining: 3420
  };

  // MOTOMINDX - ELECTRIC OPTIMA CX 5.0 (ESP32 + MPU6050 + A3144 + MAX6675)
  private scooterState: ElectricScooterTelemetry = {
    speedKmh: 42,
    batteryVoltageV: 60.8,
    batteryTempC: 32.0,
    batterySocPct: 63.0,
    motorRpm: 3850,
    motorEfficiencyPct: 81.0,
    vibrationRmsG: 0.000,
    accelX: 0.012,
    accelY: 0.008,
    accelZ: 0.998,
    cellDeltaMv: 28.0,
    bmsTempC: 38.0,
    controllerTempC: 46.5,
    controllerEfficiencyPct: 81.0,
    brakeTempC: 30.0,
    brakeMaterialPct: 85.0,
    tyrePressurePsi: 32.2,
    dashboardResponsePct: 99.6,
    dashboardLatencyMs: 0.6,
    suspensionFirmnessPct: 74.0,
    mpuAvailable: true,
    thermocoupleAvailable: true,
    parts: [
      { name: 'Battery Pack', standard: 100.0, live: 63.0, diff: 37.0, status: 'CHECK SOON' },
      { name: 'PMSM Motor', standard: 100.0, live: 81.0, diff: 19.0, status: 'CHECK SOON' },
      { name: 'Smart BMS', standard: 100.0, live: 63.0, diff: 37.0, status: 'CHECK SOON' },
      { name: 'Motor Controller', standard: 100.0, live: 81.0, diff: 19.0, status: 'CHECK SOON' },
      { name: 'Brakes & Regen', standard: 100.0, live: 85.0, diff: 15.0, status: 'GOOD' },
      { name: 'Tyres (12-inch)', standard: 100.0, live: 92.0, diff: 8.0, status: 'GOOD' },
      { name: 'Smart Dashboard', standard: 100.0, live: 99.9, diff: 0.14, status: 'GOOD' },
      { name: 'Suspension', standard: 100.0, live: 75.2, diff: 24.76, status: 'CHECK SOON' }
    ]
  };

  private constructor() {
    this.seedHistory();
    this.startSimulation();
  }

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  public setVehicleType(type: VehicleType): void {
    this.vehicleType = type;
    this.seedHistory();
    this.notify();
  }

  public getHistory(): TelemetryHistoryPoint[] {
    return [...this.history];
  }

  public getCurrentTelemetry(): LiveTelemetrySnapshot {
    const isScooter = this.vehicleType === 'scooter' || (this.vehicleType as string) === 'electricScooter';
    return {
      car: this.vehicleType === 'car' ? { ...this.carState } : undefined,
      bike: this.vehicleType === 'bike' ? { ...this.bikeState } : undefined,
      rcCar: this.vehicleType === 'rcCar' ? { ...this.rcState } : undefined,
      scooter: isScooter ? { ...this.scooterState } : undefined,
      history: this.getHistory()
    };
  }

  public subscribe(cb: TelemetryListener): () => void {
    this.listeners.add(cb);
    cb(this.getCurrentTelemetry());
    return () => this.listeners.delete(cb);
  }

  // Exact fluctuation algorithm from the Arduino sketch:
  // float fluctuate(float value, float amount, float minimum, float maximum)
  private fluctuate(value: number, amount: number, minimum: number, maximum: number): number {
    value += ((Math.floor(Math.random() * 201) - 100) / 100.0) * amount;
    if (value < minimum) value = minimum;
    if (value > maximum) value = maximum;
    return Math.round(value * 100) / 100;
  }

  private percentageDifference(standard: number, live: number): number {
    if (standard === 0) return 0;
    return Math.round((Math.abs(standard - live) / Math.abs(standard)) * 10000) / 100;
  }

  private seedHistory(): void {
    this.history = [];
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      const timeStr = new Date(now - i * 3000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (this.vehicleType === 'car') {
        this.history.push({
          time: timeStr,
          speed: 55 + Math.sin(i * 0.4) * 8 + (Math.random() - 0.5) * 3,
          rpm: 1800 + Math.sin(i * 0.4) * 200 + (Math.random() - 0.5) * 50,
          temp: 88 + Math.sin(i * 0.1) * 2,
          voltage: 13.9 + (Math.random() - 0.5) * 0.1,
          loadOrCurrent: 30 + Math.sin(i * 0.4) * 6
        });
      } else if (this.vehicleType === 'bike') {
        this.history.push({
          time: timeStr,
          speed: 60 + Math.sin(i * 0.5) * 12 + (Math.random() - 0.5) * 4,
          rpm: 3200 + Math.sin(i * 0.5) * 450 + (Math.random() - 0.5) * 80,
          temp: 85 + Math.sin(i * 0.1) * 2,
          voltage: 14.1 + (Math.random() - 0.5) * 0.1,
          loadOrCurrent: 28 + Math.sin(i * 0.5) * 10
        });
      } else if (this.vehicleType === 'scooter' || (this.vehicleType as string) === 'electricScooter') {
        this.history.push({
          time: timeStr,
          speed: 40 + Math.sin(i * 0.4) * 6 + (Math.random() - 0.5) * 2,
          rpm: 3850 + Math.sin(i * 0.4) * 120 + (Math.random() - 0.5) * 30,
          temp: 32 + Math.sin(i * 0.1) * 1.5,
          voltage: 60.8 + (Math.random() - 0.5) * 0.2,
          loadOrCurrent: 63 + (Math.random() - 0.5) * 2
        });
      } else {
        this.history.push({
          time: timeStr,
          speed: 30 + Math.sin(i * 0.6) * 15 + (Math.random() - 0.5) * 5,
          rpm: 25000 + Math.sin(i * 0.6) * 8000 + (Math.random() - 0.5) * 1000,
          temp: 56 + Math.sin(i * 0.1) * 4,
          voltage: 11.8 - (20 - i) * 0.01,
          loadOrCurrent: 32 + Math.sin(i * 0.6) * 18
        });
      }
    }
  }

  private startSimulation(): void {
    if (this.timer) clearInterval(this.timer);

    this.timer = window.setInterval(() => {
      const deviceState = DeviceService.getInstance().getState();
      if (deviceState !== 'connected') return;

      const now = Date.now();
      const timeStr = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      if (this.vehicleType === 'car') {
        const speedDelta = (Math.random() - 0.48) * 3;
        this.carState.speedKmh = Math.max(0, Math.min(130, Math.round((this.carState.speedKmh + speedDelta) * 10) / 10));
        this.carState.engineRpm = Math.max(680, Math.min(4200, Math.round(750 + this.carState.speedKmh * 20 + (Math.random() - 0.5) * 40)));
        this.carState.coolantTempC = Math.round((89 + Math.sin(now / 15000) * 1.5 + (Math.random() - 0.5) * 0.3) * 10) / 10;
        this.carState.batteryVoltageV = Math.round((13.9 + (Math.random() - 0.5) * 0.08) * 10) / 10;
        this.carState.engineLoadPct = Math.max(12, Math.min(85, Math.round(28 + (this.carState.speedKmh / 120) * 20 + (Math.random() - 0.5) * 4)));
        this.carState.fuelEfficiencyKmpl = Math.round((16.4 + (Math.random() - 0.5) * 0.4) * 10) / 10;

        this.history.push({
          time: timeStr,
          speed: this.carState.speedKmh,
          rpm: this.carState.engineRpm,
          temp: this.carState.coolantTempC,
          voltage: this.carState.batteryVoltageV,
          loadOrCurrent: this.carState.engineLoadPct
        });
      } else if (this.vehicleType === 'bike') {
        const speedDelta = (Math.random() - 0.48) * 4;
        this.bikeState.speedKmh = Math.max(0, Math.min(140, Math.round((this.bikeState.speedKmh + speedDelta) * 10) / 10));
        this.bikeState.engineRpm = Math.max(1200, Math.min(6500, Math.round(1200 + this.bikeState.speedKmh * 35 + (Math.random() - 0.5) * 60)));
        this.bikeState.engineTempC = Math.round((86 + Math.sin(now / 12000) * 1.8) * 10) / 10;
        this.bikeState.batteryVoltageV = Math.round((14.1 + (Math.random() - 0.5) * 0.06) * 10) / 10;
        this.bikeState.throttlePositionPct = Math.max(0, Math.min(100, Math.round(24 + (this.bikeState.speedKmh / 140) * 25 + (Math.random() - 0.5) * 5)));
        this.bikeState.leanAngleDeg = Math.round((Math.sin(now / 4000) * 8) * 10) / 10;

        this.history.push({
          time: timeStr,
          speed: this.bikeState.speedKmh,
          rpm: this.bikeState.engineRpm,
          temp: this.bikeState.engineTempC,
          voltage: this.bikeState.batteryVoltageV,
          loadOrCurrent: this.bikeState.throttlePositionPct
        });
      } else if (this.vehicleType === 'scooter' || (this.vehicleType as string) === 'electricScooter') {
        // Exact ESP32 updateSimulatedValues() from Arduino sketch:
        this.scooterState.batteryVoltageV = this.fluctuate(this.scooterState.batteryVoltageV, 0.2, 59.5, 62.0);
        this.scooterState.batteryTempC = this.fluctuate(this.scooterState.batteryTempC, 0.5, 29, 38);
        this.scooterState.batterySocPct = this.fluctuate(this.scooterState.batterySocPct, 0.3, 60, 66);
        this.scooterState.motorEfficiencyPct = this.fluctuate(this.scooterState.motorEfficiencyPct, 0.5, 80, 82);
        this.scooterState.cellDeltaMv = this.fluctuate(this.scooterState.cellDeltaMv, 1.0, 26, 30);
        this.scooterState.bmsTempC = this.fluctuate(this.scooterState.bmsTempC, 0.5, 36, 40);
        this.scooterState.controllerEfficiencyPct = this.fluctuate(this.scooterState.controllerEfficiencyPct, 0.5, 80, 82);
        this.scooterState.controllerTempC = this.fluctuate(this.scooterState.controllerTempC, 0.4, 44, 49);
        this.scooterState.brakeMaterialPct = this.fluctuate(this.scooterState.brakeMaterialPct, 0.2, 84, 86);
        this.scooterState.brakeTempC = this.fluctuate(this.scooterState.brakeTempC, 0.5, 28, 35);
        this.scooterState.tyrePressurePsi = this.fluctuate(this.scooterState.tyrePressurePsi, 0.2, 31, 33);
        this.scooterState.dashboardLatencyMs = this.fluctuate(this.scooterState.dashboardLatencyMs, 0.2, 0, 2);
        this.scooterState.dashboardResponsePct = this.fluctuate(this.scooterState.dashboardResponsePct, 0.2, 99, 100);
        this.scooterState.suspensionFirmnessPct = this.fluctuate(this.scooterState.suspensionFirmnessPct, 0.5, 74, 76);
        this.scooterState.vibrationRmsG = this.fluctuate(this.scooterState.vibrationRmsG, 0.004, 0.000, 0.035);

        // A3144 Hall ISR Motor RPM correlated with speed
        this.scooterState.motorRpm = Math.round(this.fluctuate(this.scooterState.motorRpm, 15, 3750, 4100));
        this.scooterState.speedKmh = Math.round((this.scooterState.motorRpm / 3850) * 42 * 10) / 10;

        // 8 Components Live Health fluctuation from Arduino parts[]:
        const partBounds = [
          { min: 62, max: 64, fluc: 0.3 }, // Battery Pack
          { min: 80, max: 82, fluc: 0.3 }, // PMSM Motor
          { min: 62, max: 64, fluc: 0.3 }, // Smart BMS
          { min: 80, max: 82, fluc: 0.3 }, // Motor Controller
          { min: 84, max: 86, fluc: 0.2 }, // Brakes & Regen
          { min: 91, max: 93, fluc: 0.2 }, // Tyres (12-inch)
          { min: 99, max: 100, fluc: 0.2 }, // Smart Dashboard
          { min: 74, max: 76, fluc: 0.3 }  // Suspension
        ];

        this.scooterState.parts.forEach((p, idx) => {
          const b = partBounds[idx];
          if (b) {
            p.live = this.fluctuate(p.live, b.fluc, b.min, b.max);
            p.diff = this.percentageDifference(p.standard, p.live);
            p.status = p.live >= 85 ? 'GOOD' : 'CHECK SOON';
          }
        });

        this.history.push({
          time: timeStr,
          speed: this.scooterState.speedKmh,
          rpm: Math.round(this.scooterState.motorRpm / 10),
          temp: this.scooterState.batteryTempC,
          voltage: this.scooterState.batteryVoltageV,
          loadOrCurrent: this.scooterState.batterySocPct
        });
      } else {
        const speedDelta = (Math.random() - 0.49) * 6;
        this.rcState.speedKmh = Math.max(0, Math.min(75, Math.round((this.rcState.speedKmh + speedDelta) * 10) / 10));
        this.rcState.motorRpm = Math.max(0, Math.min(48000, Math.round(this.rcState.speedKmh * 850 + (Math.random() - 0.5) * 400)));
        this.rcState.motorTempC = Math.round((58 + Math.sin(now / 20000) * 4 + (this.rcState.speedKmh / 75) * 5) * 10) / 10;
        this.rcState.escTempC = Math.round((49 + Math.sin(now / 25000) * 3) * 10) / 10;
        this.rcState.currentDrawAmps = Math.max(1.2, Math.min(85, Math.round((4 + (this.rcState.speedKmh / 75) * 45 + (Math.random() - 0.5) * 6) * 10) / 10));
        this.rcState.powerWatts = Math.round(this.rcState.currentDrawAmps * this.rcState.packVoltageV);
        
        const cellAvg = Math.round((this.rcState.packVoltageV / 3) * 100) / 100;
        this.rcState.cellVoltagesV = [cellAvg, cellAvg, cellAvg];

        this.history.push({
          time: timeStr,
          speed: this.rcState.speedKmh,
          rpm: Math.round(this.rcState.motorRpm / 10),
          temp: this.rcState.motorTempC,
          voltage: this.rcState.packVoltageV,
          loadOrCurrent: this.rcState.currentDrawAmps
        });
      }

      if (this.history.length > 25) {
        this.history.shift();
      }

      this.notify();
    }, 1200);
  }

  private notify(): void {
    const data = this.getCurrentTelemetry();
    this.listeners.forEach(cb => cb(data));
  }
}
