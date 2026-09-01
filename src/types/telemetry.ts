export interface CarTelemetry {
  speedKmh: number;
  engineRpm: number;
  coolantTempC: number;
  batteryVoltageV: number;
  engineLoadPct: number;
  fuelLevelPct: number;
  fuelEfficiencyKmpl: number;
  oilPressureKpa: number;
  intakeAirTempC: number;
  throttlePositionPct: number;
  tirePressurePsi: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
  gear: string;
}

export interface BikeTelemetry {
  speedKmh: number;
  engineRpm: number;
  engineTempC: number;
  batteryVoltageV: number;
  throttlePositionPct: number;
  gear: number | string;
  fuelLevelPct: number;
  leanAngleDeg: number;
  chainSlackMm: number;
  ambientTempC: number;
  tirePressurePsi: {
    front: number;
    rear: number;
  };
}

export interface RcCarTelemetry {
  speedKmh: number;
  motorRpm: number;
  motorTempC: number;
  escTempC: number;
  packVoltageV: number;
  cellVoltagesV: [number, number, number]; // 3S LiPo: Cell 1, 2, 3
  currentDrawAmps: number;
  powerWatts: number;
  signalRssiDbm: number;
  servoAngleDeg: number;
  throttleTrimPct: number;
  batteryCapacityMahRemaining: number;
}

export type TelemetryData = {
  timestamp: number;
  car?: CarTelemetry;
  bike?: BikeTelemetry;
  rcCar?: RcCarTelemetry;
};

export interface TelemetryHistoryPoint {
  time: string;
  speed: number;
  rpm: number;
  temp: number;
  voltage: number;
  loadOrCurrent: number;
}
