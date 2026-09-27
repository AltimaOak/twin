export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface HardwareConfig {
  esp32Host: string;
  autoConnect: boolean;
  isHardwareActive: boolean;
  lastRawPacket?: string;
}

export interface DeviceMetadata {
  deviceId: string;
  hardwareVersion: string;
  firmwareVersion: string;
  protocol: 'OBD-II (ISO 15765-4 CAN 500kbps)' | 'MotoMindX Direct CAN-Bus' | 'MotoMindX RC-Telemetry 915MHz LoRa' | 'ESP32 Real-Time WebSocket Telemetry';
  connectionMedium: '4G LTE-M' | 'Bluetooth 5.2' | 'Wi-Fi Telemetry' | 'USB-C Serial' | 'ESP32 Wi-Fi';
  signalStrengthDbm: number;
  signalQuality: 'Excellent' | 'Strong' | 'Moderate' | 'Weak';
  latencyMs: number;
  packetsReceived: number;
  packetLossPct: number;
  vinDetected: string;
  batterySupplyVoltageV: number;
  lastPacketTimestamp: number;
  isDemoMode: boolean;
  hardwareHost?: string;
}

export interface ConnectionLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

