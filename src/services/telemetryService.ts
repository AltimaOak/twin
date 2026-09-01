import type { CarTelemetry, BikeTelemetry, RcCarTelemetry, TelemetryHistoryPoint } from '../types/telemetry';
import type { VehicleType } from '../types/vehicle';
import { DeviceService } from './deviceService';

type TelemetryListener = (data: {
  car?: CarTelemetry;
  bike?: BikeTelemetry;
  rcCar?: RcCarTelemetry;
  history: TelemetryHistoryPoint[];
}) => void;

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

  public getCurrentTelemetry() {
    return {
      car: this.vehicleType === 'car' ? { ...this.carState } : undefined,
      bike: this.vehicleType === 'bike' ? { ...this.bikeState } : undefined,
      rcCar: this.vehicleType === 'rcCar' ? { ...this.rcState } : undefined,
      history: this.getHistory()
    };
  }

  public subscribe(cb: TelemetryListener): () => void {
    this.listeners.add(cb);
    cb(this.getCurrentTelemetry());
    return () => this.listeners.delete(cb);
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
        // Subtle driving fluctuations
        const speedDelta = (Math.random() - 0.48) * 3;
        this.carState.speedKmh = Math.max(0, Math.min(130, Math.round((this.carState.speedKmh + speedDelta) * 10) / 10));
        
        // RPM naturally correlates with speed
        this.carState.engineRpm = Math.max(680, Math.min(4200, Math.round(750 + this.carState.speedKmh * 20 + (Math.random() - 0.5) * 40)));
        
        // Coolant temp fluctuates around 89C
        this.carState.coolantTempC = Math.round((89 + Math.sin(now / 15000) * 1.5 + (Math.random() - 0.5) * 0.3) * 10) / 10;
        
        // Voltage
        this.carState.batteryVoltageV = Math.round((13.9 + (Math.random() - 0.5) * 0.08) * 10) / 10;
        
        // Load
        this.carState.engineLoadPct = Math.max(12, Math.min(85, Math.round(28 + (this.carState.speedKmh / 120) * 20 + (Math.random() - 0.5) * 4)));
        
        // Fuel efficiency
        this.carState.fuelEfficiencyKmpl = Math.round((16.4 + (Math.random() - 0.5) * 0.4) * 10) / 10;

        // Push history
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
      } else {
        // RC Car Telemetry
        const speedDelta = (Math.random() - 0.49) * 6;
        this.rcState.speedKmh = Math.max(0, Math.min(75, Math.round((this.rcState.speedKmh + speedDelta) * 10) / 10));
        this.rcState.motorRpm = Math.max(0, Math.min(48000, Math.round(this.rcState.speedKmh * 850 + (Math.random() - 0.5) * 400)));
        this.rcState.motorTempC = Math.round((58 + Math.sin(now / 20000) * 4 + (this.rcState.speedKmh / 75) * 5) * 10) / 10;
        this.rcState.escTempC = Math.round((49 + Math.sin(now / 25000) * 3) * 10) / 10;
        this.rcState.currentDrawAmps = Math.max(1.2, Math.min(85, Math.round((4 + (this.rcState.speedKmh / 75) * 45 + (Math.random() - 0.5) * 6) * 10) / 10));
        this.rcState.powerWatts = Math.round(this.rcState.currentDrawAmps * this.rcState.packVoltageV);
        
        // 3S cell voltages
        const cellAvg = Math.round((this.rcState.packVoltageV / 3) * 100) / 100;
        this.rcState.cellVoltagesV = [cellAvg, cellAvg, cellAvg];

        this.history.push({
          time: timeStr,
          speed: this.rcState.speedKmh,
          rpm: Math.round(this.rcState.motorRpm / 10), // Scale for chart
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
