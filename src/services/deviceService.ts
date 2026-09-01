import type { ConnectionState, DeviceMetadata, ConnectionLog } from '../types/device';
import type { VehicleType } from '../types/vehicle';

type ConnectionListener = (state: ConnectionState) => void;
type MetadataListener = (metadata: DeviceMetadata) => void;
type LogListener = (log: ConnectionLog) => void;

export class DeviceService {
  private static instance: DeviceService;
  private state: ConnectionState = 'connected';
  private connectionListeners: Set<ConnectionListener> = new Set();
  private metadataListeners: Set<MetadataListener> = new Set();
  private logListeners: Set<LogListener> = new Set();
  private timer: number | null = null;
  private logs: ConnectionLog[] = [];

  private metadata: DeviceMetadata = {
    deviceId: 'MMX-00124',
    hardwareVersion: 'v2.4 (STM32 + CAN-FD)',
    firmwareVersion: 'v3.1.8-prod',
    protocol: 'OBD-II (ISO 15765-4 CAN 500kbps)',
    connectionMedium: '4G LTE-M',
    signalStrengthDbm: -68,
    signalQuality: 'Strong',
    latencyMs: 42,
    packetsReceived: 18420,
    packetLossPct: 0.02,
    vinDetected: 'MAKGM6674NH109823',
    batterySupplyVoltageV: 13.8,
    lastPacketTimestamp: Date.now(),
    isDemoMode: true
  };

  private constructor() {
    this.addLog('info', 'MotoMindX Device Service initialized.');
    this.addLog('success', 'OBD-II CAN handshake established on CAN 500kbps.');
    this.startHeartbeat();
  }

  public static getInstance(): DeviceService {
    if (!DeviceService.instance) {
      DeviceService.instance = new DeviceService();
    }
    return DeviceService.instance;
  }

  public setVehicleType(type: VehicleType, vinOrSerial?: string): void {
    if (type === 'car') {
      this.metadata.protocol = 'OBD-II (ISO 15765-4 CAN 500kbps)';
      this.metadata.connectionMedium = '4G LTE-M';
      this.metadata.vinDetected = vinOrSerial || 'MAKGM6674NH109823';
      this.addLog('info', 'Switched to Car mode: ISO 15765-4 CAN active.');
    } else if (type === 'bike') {
      this.metadata.protocol = 'MotoMindX Direct CAN-Bus';
      this.metadata.connectionMedium = '4G LTE-M';
      this.metadata.vinDetected = vinOrSerial || 'JYARN45E8NA009121';
      this.addLog('info', 'Switched to Motorcycle mode: Direct CAN-Bus active.');
    } else if (type === 'rcCar') {
      this.metadata.protocol = 'MotoMindX RC-Telemetry 915MHz LoRa';
      this.metadata.connectionMedium = 'Wi-Fi Telemetry';
      this.metadata.vinDetected = vinOrSerial || 'MMX-RC-88921-TRX';
      this.addLog('info', 'Switched to RC Telemetry mode: 915MHz LoRa direct telemetry active.');
    }
    this.notifyMetadata();
  }

  public getState(): ConnectionState {
    return this.state;
  }

  public getMetadata(): DeviceMetadata {
    return { ...this.metadata };
  }

  public getLogs(): ConnectionLog[] {
    return [...this.logs];
  }

  public connect(): Promise<void> {
    if (this.state === 'connected' || this.state === 'connecting') return Promise.resolve();

    this.state = 'connecting';
    this.notifyState();
    this.addLog('info', 'Initiating connection handshake with MotoMindX hardware...');

    return new Promise((resolve) => {
      setTimeout(() => {
        this.state = 'connected';
        this.metadata.lastPacketTimestamp = Date.now();
        this.metadata.signalStrengthDbm = -65 - Math.floor(Math.random() * 8);
        this.metadata.latencyMs = 38 + Math.floor(Math.random() * 15);
        this.notifyState();
        this.notifyMetadata();
        this.addLog('success', `Connected to ${this.metadata.deviceId} via ${this.metadata.protocol}.`);
        this.startHeartbeat();
        resolve();
      }, 1200);
    });
  }

  public disconnect(): void {
    if (this.state === 'disconnected') return;
    this.state = 'disconnected';
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.notifyState();
    this.addLog('warn', 'Disconnected from MotoMindX device.');
  }

  public toggleConnection(): void {
    if (this.state === 'connected') {
      this.disconnect();
    } else {
      this.connect();
    }
  }

  private startHeartbeat(): void {
    if (this.timer) clearInterval(this.timer);

    this.timer = window.setInterval(() => {
      if (this.state !== 'connected') return;

      this.metadata.packetsReceived += 1;
      this.metadata.lastPacketTimestamp = Date.now();
      // Jitter latency slightly for realism
      const latencyDelta = (Math.random() - 0.5) * 6;
      this.metadata.latencyMs = Math.max(18, Math.min(120, Math.round(this.metadata.latencyMs + latencyDelta)));

      // Signal quality
      const rssiDelta = (Math.random() - 0.5) * 2;
      this.metadata.signalStrengthDbm = Math.round(this.metadata.signalStrengthDbm + rssiDelta);

      if (this.metadata.signalStrengthDbm > -65) this.metadata.signalQuality = 'Excellent';
      else if (this.metadata.signalStrengthDbm > -78) this.metadata.signalQuality = 'Strong';
      else if (this.metadata.signalStrengthDbm > -90) this.metadata.signalQuality = 'Moderate';
      else this.metadata.signalQuality = 'Weak';

      this.notifyMetadata();
    }, 1000);
  }

  private addLog(level: 'info' | 'warn' | 'error' | 'success', message: string): void {
    const log: ConnectionLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    this.logs = [log, ...this.logs.slice(0, 49)];
    this.logListeners.forEach(cb => cb(log));
  }

  public onStateChange(cb: ConnectionListener): () => void {
    this.connectionListeners.add(cb);
    cb(this.state);
    return () => this.connectionListeners.delete(cb);
  }

  public onMetadataChange(cb: MetadataListener): () => void {
    this.metadataListeners.add(cb);
    cb(this.getMetadata());
    return () => this.metadataListeners.delete(cb);
  }

  public onLog(cb: LogListener): () => void {
    this.logListeners.add(cb);
    return () => this.logListeners.delete(cb);
  }

  private notifyState(): void {
    this.connectionListeners.forEach(cb => cb(this.state));
  }

  private notifyMetadata(): void {
    const meta = this.getMetadata();
    this.metadataListeners.forEach(cb => cb(meta));
  }
}
