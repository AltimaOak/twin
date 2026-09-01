export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface DeviceMetadata {
  deviceId: string;
  hardwareVersion: string;
  firmwareVersion: string;
  protocol: 'OBD-II (ISO 15765-4 CAN 500kbps)' | 'MotoMindX Direct CAN-Bus' | 'MotoMindX RC-Telemetry 915MHz LoRa';
  connectionMedium: '4G LTE-M' | 'Bluetooth 5.2' | 'Wi-Fi Telemetry' | 'USB-C Serial';
  signalStrengthDbm: number;
  signalQuality: 'Excellent' | 'Strong' | 'Moderate' | 'Weak';
  latencyMs: number;
  packetsReceived: number;
  packetLossPct: number;
  vinDetected: string;
  batterySupplyVoltageV: number;
  lastPacketTimestamp: number;
  isDemoMode: boolean;
}

export interface ConnectionLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}
