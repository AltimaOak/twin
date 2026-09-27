import { useState, useEffect } from 'react';
import { TelemetryService } from '../services/telemetryService';
import { DeviceService } from '../services/deviceService';
import type { CarTelemetry, BikeTelemetry, RcCarTelemetry, TelemetryHistoryPoint } from '../types/telemetry';
import type { ConnectionState, DeviceMetadata, HardwareConfig } from '../types/device';
import type { VehicleCategory } from '../data/vehicleConfigurations';

export interface DynamicTelemetryState {
  car?: CarTelemetry;
  bike?: BikeTelemetry;
  rcCar?: RcCarTelemetry;
  history: TelemetryHistoryPoint[];
  connectionState: ConnectionState;
  metadata: DeviceMetadata;
  hardwareConfig: HardwareConfig;
  isLiveHardware: boolean;
}

export function useTelemetry(vehicleCategory?: VehicleCategory): DynamicTelemetryState {
  const [telemetry, setTelemetry] = useState<{
    car?: CarTelemetry;
    bike?: BikeTelemetry;
    rcCar?: RcCarTelemetry;
    history: TelemetryHistoryPoint[];
  }>(() => {
    return TelemetryService.getInstance().getCurrentTelemetry();
  });

  const [connectionState, setConnectionState] = useState<ConnectionState>(() => {
    return DeviceService.getInstance().getState();
  });

  const [metadata, setMetadata] = useState<DeviceMetadata>(() => {
    return DeviceService.getInstance().getMetadata();
  });

  const [hardwareConfig, setHardwareConfig] = useState<HardwareConfig>(() => {
    return DeviceService.getInstance().getHardwareConfig();
  });

  useEffect(() => {
    if (vehicleCategory) {
      const vType =
        vehicleCategory === 'motorcycle'
          ? 'bike'
          : vehicleCategory === 'scooter'
          ? 'bike'
          : vehicleCategory === 'rc_car'
          ? 'rcCar'
          : 'car';
      TelemetryService.getInstance().setVehicleType(vType);
      DeviceService.getInstance().setVehicleType(vType);
    }
  }, [vehicleCategory]);

  useEffect(() => {
    const unsubTelemetry = TelemetryService.getInstance().subscribe((data) => {
      setTelemetry(data);
    });

    const unsubConnection = DeviceService.getInstance().onStateChange((state) => {
      setConnectionState(state);
    });

    const unsubMetadata = DeviceService.getInstance().onMetadataChange((meta) => {
      setMetadata(meta);
    });

    const unsubHardware = DeviceService.getInstance().onHardwareConfigChange((cfg) => {
      setHardwareConfig(cfg);
    });

    return () => {
      unsubTelemetry();
      unsubConnection();
      unsubMetadata();
      unsubHardware();
    };
  }, []);

  return {
    car: telemetry.car,
    bike: telemetry.bike,
    rcCar: telemetry.rcCar,
    history: telemetry.history,
    connectionState,
    metadata,
    hardwareConfig,
    isLiveHardware: hardwareConfig.isHardwareActive
  };
}
