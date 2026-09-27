import type { ConnectionState, DeviceMetadata, ConnectionLog, HardwareConfig } from '../types/device';
import type { VehicleType } from '../types/vehicle';
import { TelemetryService } from './telemetryService';

type ConnectionListener = (state: ConnectionState) => void;
type MetadataListener = (metadata: DeviceMetadata) => void;
type LogListener = (log: ConnectionLog) => void;
type HardwareConfigListener = (config: HardwareConfig) => void;

export class DeviceService {
  private static instance: DeviceService;
  private state: ConnectionState = 'disconnected';
  private connectionListeners: Set<ConnectionListener> = new Set();
  private metadataListeners: Set<MetadataListener> = new Set();
  private logListeners: Set<LogListener> = new Set();
  private hardwareConfigListeners: Set<HardwareConfigListener> = new Set();

  private heartbeatTimer: number | null = null;
  private autoConnectTimer: number | null = null;
  private logs: ConnectionLog[] = [];
  private ws: WebSocket | null = null;
  private isAttemptingWs = false;

  private hardwareConfig: HardwareConfig = {
    esp32Host: localStorage.getItem('mmx_esp32_host') || '192.168.4.1:81',
    autoConnect: localStorage.getItem('mmx_esp32_autoconnect') !== 'false',
    isHardwareActive: false,
    lastRawPacket: undefined
  };

  private metadata: DeviceMetadata = {
    deviceId: 'ESP32-Live-Link',
    hardwareVersion: 'ESP32-WROOM-32 / S3 (CAN + Telemetry)',
    firmwareVersion: 'v2.1.0-live',
    protocol: 'ESP32 Real-Time WebSocket Telemetry',
    connectionMedium: 'ESP32 Wi-Fi',
    signalStrengthDbm: -58,
    signalQuality: 'Strong',
    latencyMs: 14,
    packetsReceived: 0,
    packetLossPct: 0,
    vinDetected: 'ESP32-HARDWARE-ONLINE',
    batterySupplyVoltageV: 12.6,
    lastPacketTimestamp: 0,
    isDemoMode: true,
    hardwareHost: '192.168.4.1:81'
  };

  private constructor() {
    this.metadata.hardwareHost = this.hardwareConfig.esp32Host;
    this.addLog('info', `Device Service initialized. Target ESP32 Host: ws://${this.hardwareConfig.esp32Host}`);

    // If autoConnect is enabled, immediately start the background probe loop
    if (this.hardwareConfig.autoConnect) {
      this.startAutoConnectLoop();
    }
  }

  public static getInstance(): DeviceService {
    if (!DeviceService.instance) {
      DeviceService.instance = new DeviceService();
    }
    return DeviceService.instance;
  }

  public setVehicleType(type: VehicleType, vinOrSerial?: string): void {
    if (type === 'car') {
      this.metadata.protocol = this.hardwareConfig.isHardwareActive
        ? 'ESP32 Real-Time WebSocket Telemetry'
        : 'OBD-II (ISO 15765-4 CAN 500kbps)';
      this.metadata.vinDetected = vinOrSerial || 'MAKGM6674NH109823';
      this.addLog('info', 'Vehicle profile switched to Car (Sedan/SUV).');
    } else if (type === 'bike') {
      this.metadata.protocol = this.hardwareConfig.isHardwareActive
        ? 'ESP32 Real-Time WebSocket Telemetry'
        : 'MotoMindX Direct CAN-Bus';
      this.metadata.vinDetected = vinOrSerial || 'JYARN45E8NA009121';
      this.addLog('info', 'Vehicle profile switched to Motorcycle.');
    } else if (type === 'rcCar') {
      this.metadata.protocol = this.hardwareConfig.isHardwareActive
        ? 'ESP32 Real-Time WebSocket Telemetry'
        : 'MotoMindX RC-Telemetry 915MHz LoRa';
      this.metadata.vinDetected = vinOrSerial || 'MMX-RC-88921-TRX';
      this.addLog('info', 'Vehicle profile switched to RC Car / EV.');
    }
    this.notifyMetadata();
  }

  public getHardwareConfig(): HardwareConfig {
    return { ...this.hardwareConfig };
  }

  public setHardwareHost(host: string): void {
    const cleanHost = host.trim().replace(/^ws:\/\//i, '').replace(/^http:\/\//i, '');
    this.hardwareConfig.esp32Host = cleanHost;
    this.metadata.hardwareHost = cleanHost;
    localStorage.setItem('mmx_esp32_host', cleanHost);
    this.addLog('info', `Updated target ESP32 host to ws://${cleanHost}`);
    this.notifyHardwareConfig();
    this.notifyMetadata();

    // Reconnect to new host
    if (this.ws) {
      this.ws.close();
    }
    this.tryConnectWebSocket();
  }

  public setAutoConnect(enabled: boolean): void {
    this.hardwareConfig.autoConnect = enabled;
    localStorage.setItem('mmx_esp32_autoconnect', String(enabled));
    this.notifyHardwareConfig();

    if (enabled) {
      this.startAutoConnectLoop();
      this.addLog('info', 'Auto-connect enabled. Listening for ESP32 power on...');
    } else {
      if (this.autoConnectTimer) {
        clearInterval(this.autoConnectTimer);
        this.autoConnectTimer = null;
      }
      this.addLog('warn', 'Auto-connect disabled.');
    }
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

  // Auto-connect loop: gently probes ws://${esp32Host} every 2.5s
  private startAutoConnectLoop(): void {
    if (this.autoConnectTimer) clearInterval(this.autoConnectTimer);

    // Initial probe
    this.tryConnectWebSocket();

    this.autoConnectTimer = window.setInterval(() => {
      if (!this.hardwareConfig.autoConnect) return;
      if (this.state === 'connected') return;
      if (this.isAttemptingWs) return;

      this.tryConnectWebSocket();
    }, 2500);
  }

  public tryConnectWebSocket(): void {
    if (this.isAttemptingWs || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    const host = this.hardwareConfig.esp32Host || '192.168.4.1:81';
    const wsUrl = `ws://${host}`;

    this.isAttemptingWs = true;
    if (this.state !== 'connecting' && this.state !== 'connected') {
      this.state = 'connecting';
      this.notifyState();
    }

    try {
      const socket = new WebSocket(wsUrl);

      const connectionTimeout = setTimeout(() => {
        if (socket.readyState !== WebSocket.OPEN) {
          socket.close();
          this.isAttemptingWs = false;
          if (this.state !== 'connected') {
            this.state = 'disconnected';
            this.notifyState();
          }
        }
      }, 2000);

      socket.onopen = () => {
        clearTimeout(connectionTimeout);
        this.isAttemptingWs = false;
        this.ws = socket;
        this.state = 'connected';
        this.hardwareConfig.isHardwareActive = true;
        this.metadata.isDemoMode = false;
        this.metadata.lastPacketTimestamp = Date.now();
        this.metadata.protocol = 'ESP32 Real-Time WebSocket Telemetry';
        this.metadata.connectionMedium = 'ESP32 Wi-Fi';

        this.addLog('success', `⚡ ESP32 Hardware TURNED ON & CONNECTED at ws://${host}!`);
        this.notifyState();
        this.notifyMetadata();
        this.notifyHardwareConfig();
        this.startHeartbeat();
      };

      socket.onmessage = (event) => {
        try {
          const rawText = String(event.data);
          this.hardwareConfig.lastRawPacket = rawText;
          this.metadata.packetsReceived += 1;
          this.metadata.lastPacketTimestamp = Date.now();

          const parsed = JSON.parse(rawText);
          TelemetryService.getInstance().ingestHardwareTelemetry(parsed);

          if (this.metadata.packetsReceived % 20 === 0) {
            this.notifyMetadata();
            this.notifyHardwareConfig();
          }
        } catch {
          // Non-JSON packet
        }
      };

      socket.onerror = () => {
        clearTimeout(connectionTimeout);
        this.isAttemptingWs = false;
        // Don't spam error logs during normal power-off polling
      };

      socket.onclose = () => {
        clearTimeout(connectionTimeout);
        this.isAttemptingWs = false;
        this.ws = null;

        if (this.hardwareConfig.isHardwareActive) {
          this.hardwareConfig.isHardwareActive = false;
          this.metadata.isDemoMode = true;
          this.addLog('warn', 'ESP32 powered off or disconnected. Background listener active...');
        }

        this.state = 'disconnected';
        this.notifyState();
        this.notifyMetadata();
        this.notifyHardwareConfig();
      };
    } catch {
      this.isAttemptingWs = false;
      this.state = 'disconnected';
      this.notifyState();
    }
  }

  public connect(): Promise<void> {
    this.addLog('info', `Probing ESP32 device at ws://${this.hardwareConfig.esp32Host}...`);
    this.tryConnectWebSocket();
    return Promise.resolve();
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.state = 'disconnected';
    this.hardwareConfig.isHardwareActive = false;
    this.notifyState();
    this.notifyHardwareConfig();
    this.addLog('warn', 'Manually disconnected from ESP32.');
  }

  public toggleConnection(): void {
    if (this.state === 'connected') {
      this.disconnect();
    } else {
      this.connect();
    }
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);

    this.heartbeatTimer = window.setInterval(() => {
      if (this.state !== 'connected') return;

      const now = Date.now();
      // If no packet in 3.5 seconds, flag latency
      const elapsedSincePacket = now - this.metadata.lastPacketTimestamp;
      if (elapsedSincePacket > 3500 && this.hardwareConfig.isHardwareActive) {
        this.metadata.latencyMs = Math.min(999, elapsedSincePacket);
        this.metadata.signalQuality = 'Weak';
      } else {
        this.metadata.latencyMs = Math.max(8, Math.min(35, 12 + Math.floor(Math.random() * 8)));
        this.metadata.signalQuality = 'Strong';
      }

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

  public onHardwareConfigChange(cb: HardwareConfigListener): () => void {
    this.hardwareConfigListeners.add(cb);
    cb(this.getHardwareConfig());
    return () => this.hardwareConfigListeners.delete(cb);
  }

  private notifyState(): void {
    this.connectionListeners.forEach(cb => cb(this.state));
  }

  private notifyMetadata(): void {
    const meta = this.getMetadata();
    this.metadataListeners.forEach(cb => cb(meta));
  }

  private notifyHardwareConfig(): void {
    const config = this.getHardwareConfig();
    this.hardwareConfigListeners.forEach(cb => cb(config));
  }
}

