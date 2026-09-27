import type { CarTelemetry, BikeTelemetry, RcCarTelemetry, TelemetryHistoryPoint } from '../types/telemetry';
import type { VehicleType } from '../types/vehicle';

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
  private isSimulationEnabled = false;

  // Real Dynamic Telemetry State (Starts at 0 / standby, updated dynamically by hardware)
  private carState: CarTelemetry = {
    speedKmh: 0,
    engineRpm: 0,
    coolantTempC: 0,
    batteryVoltageV: 0,
    engineLoadPct: 0,
    fuelLevelPct: 0,
    fuelEfficiencyKmpl: 0,
    oilPressureKpa: 0,
    intakeAirTempC: 0,
    throttlePositionPct: 0,
    tirePressurePsi: {
      frontLeft: 0,
      frontRight: 0,
      rearLeft: 0,
      rearRight: 0
    },
    gear: 'P'
  };

  private bikeState: BikeTelemetry = {
    speedKmh: 0,
    engineRpm: 0,
    engineTempC: 0,
    batteryVoltageV: 0,
    throttlePositionPct: 0,
    gear: 0,
    fuelLevelPct: 0,
    leanAngleDeg: 0,
    chainSlackMm: 0,
    ambientTempC: 0,
    tirePressurePsi: {
      front: 0,
      rear: 0
    }
  };

  private rcState: RcCarTelemetry = {
    speedKmh: 0,
    motorRpm: 0,
    motorTempC: 0,
    escTempC: 0,
    packVoltageV: 0,
    cellVoltagesV: [0, 0, 0],
    currentDrawAmps: 0,
    powerWatts: 0,
    signalRssiDbm: 0,
    servoAngleDeg: 0,
    throttleTrimPct: 0,
    batteryCapacityMahRemaining: 0
  };

  private constructor() {
    // Dynamic initialization without fake demo data
    this.initCleanHistory();
  }

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  public setVehicleType(type: VehicleType): void {
    this.vehicleType = type;
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

  // Ingest raw or parsed live telemetry from real ESP32 hardware
  public ingestHardwareTelemetry(payload: any): void {
    if (!payload || typeof payload !== 'object') return;

    const now = Date.now();
    const timeStr = new Date(now).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    if (this.vehicleType === 'car') {
      if (typeof payload.speedKmh === 'number') this.carState.speedKmh = payload.speedKmh;
      if (typeof payload.speed === 'number') this.carState.speedKmh = payload.speed;
      if (typeof payload.engineRpm === 'number') this.carState.engineRpm = payload.engineRpm;
      if (typeof payload.rpm === 'number') this.carState.engineRpm = payload.rpm;
      if (typeof payload.coolantTempC === 'number') this.carState.coolantTempC = payload.coolantTempC;
      if (typeof payload.temp === 'number') this.carState.coolantTempC = payload.temp;
      if (typeof payload.batteryVoltageV === 'number') this.carState.batteryVoltageV = payload.batteryVoltageV;
      if (typeof payload.voltage === 'number') this.carState.batteryVoltageV = payload.voltage;
      if (typeof payload.engineLoadPct === 'number') this.carState.engineLoadPct = payload.engineLoadPct;
      if (typeof payload.fuelLevelPct === 'number') this.carState.fuelLevelPct = payload.fuelLevelPct;
      if (typeof payload.oilPressureKpa === 'number') this.carState.oilPressureKpa = payload.oilPressureKpa;
      if (payload.tirePressurePsi) {
        this.carState.tirePressurePsi = { ...this.carState.tirePressurePsi, ...payload.tirePressurePsi };
      }

      this.history.push({
        time: timeStr,
        speed: this.carState.speedKmh,
        rpm: this.carState.engineRpm,
        temp: this.carState.coolantTempC,
        voltage: this.carState.batteryVoltageV,
        loadOrCurrent: this.carState.engineLoadPct
      });
    } else if (this.vehicleType === 'bike') {
      if (typeof payload.speedKmh === 'number') this.bikeState.speedKmh = payload.speedKmh;
      if (typeof payload.speed === 'number') this.bikeState.speedKmh = payload.speed;
      if (typeof payload.engineRpm === 'number') this.bikeState.engineRpm = payload.engineRpm;
      if (typeof payload.rpm === 'number') this.bikeState.engineRpm = payload.rpm;
      if (typeof payload.engineTempC === 'number') this.bikeState.engineTempC = payload.engineTempC;
      if (typeof payload.temp === 'number') this.bikeState.engineTempC = payload.temp;
      if (typeof payload.batteryVoltageV === 'number') this.bikeState.batteryVoltageV = payload.batteryVoltageV;
      if (typeof payload.voltage === 'number') this.bikeState.batteryVoltageV = payload.voltage;
      if (typeof payload.leanAngleDeg === 'number') this.bikeState.leanAngleDeg = payload.leanAngleDeg;
      if (typeof payload.throttlePositionPct === 'number') this.bikeState.throttlePositionPct = payload.throttlePositionPct;

      this.history.push({
        time: timeStr,
        speed: this.bikeState.speedKmh,
        rpm: this.bikeState.engineRpm,
        temp: this.bikeState.engineTempC,
        voltage: this.bikeState.batteryVoltageV,
        loadOrCurrent: this.bikeState.throttlePositionPct
      });
    } else {
      // RC Car / Electric
      if (typeof payload.speedKmh === 'number') this.rcState.speedKmh = payload.speedKmh;
      if (typeof payload.speed === 'number') this.rcState.speedKmh = payload.speed;
      if (typeof payload.motorRpm === 'number') this.rcState.motorRpm = payload.motorRpm;
      if (typeof payload.rpm === 'number') this.rcState.motorRpm = payload.rpm;
      if (typeof payload.motorTempC === 'number') this.rcState.motorTempC = payload.motorTempC;
      if (typeof payload.temp === 'number') this.rcState.motorTempC = payload.temp;
      if (typeof payload.escTempC === 'number') this.rcState.escTempC = payload.escTempC;
      if (typeof payload.packVoltageV === 'number') this.rcState.packVoltageV = payload.packVoltageV;
      if (typeof payload.voltage === 'number') this.rcState.packVoltageV = payload.voltage;
      if (typeof payload.currentDrawAmps === 'number') this.rcState.currentDrawAmps = payload.currentDrawAmps;
      if (typeof payload.current === 'number') this.rcState.currentDrawAmps = payload.current;
      if (typeof payload.powerWatts === 'number') this.rcState.powerWatts = payload.powerWatts;
      if (Array.isArray(payload.cellVoltagesV)) this.rcState.cellVoltagesV = payload.cellVoltagesV;

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
  }


  public subscribe(cb: TelemetryListener): () => void {
    this.listeners.add(cb);
    cb(this.getCurrentTelemetry());
    return () => this.listeners.delete(cb);
  }

  private initCleanHistory(): void {
    this.history = [];
    const now = Date.now();
    for (let i = 10; i >= 0; i--) {
      const timeStr = new Date(now - i * 3000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      this.history.push({
        time: timeStr,
        speed: 0,
        rpm: 0,
        temp: 0,
        voltage: 0,
        loadOrCurrent: 0
      });
    }
  }

  public setSimulationEnabled(enabled: boolean): void {
    this.isSimulationEnabled = enabled;
    if (!enabled && this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  public getIsSimulationEnabled(): boolean {
    return this.isSimulationEnabled;
  }

  private notify(): void {
    const data = this.getCurrentTelemetry();
    this.listeners.forEach(cb => cb(data));
  }
}

