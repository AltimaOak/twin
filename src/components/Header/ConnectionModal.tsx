import React, { useState, useEffect } from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import type { ConnectionState, ConnectionLog, HardwareConfig } from '../../types/device';
import { DeviceService } from '../../services/deviceService';
import {
  X,
  Power,
  Terminal,
  RefreshCw,
  Cpu,
  Check,
  Copy,
  Sliders,
  Code2,
  Wifi,
  Sparkles
} from 'lucide-react';

interface ConnectionModalProps {
  vehicleConfig: VehicleConfig;
  state: ConnectionState;
  logs: ConnectionLog[];
  onToggleConnection: () => void;
  onClose: () => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  vehicleConfig,
  state,
  logs,
  onToggleConnection,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'esp32_code'>('status');
  const [hardwareConfig, setHardwareConfig] = useState<HardwareConfig>(
    DeviceService.getInstance().getHardwareConfig()
  );
  const [hostInput, setHostInput] = useState(hardwareConfig.esp32Host);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const unsub = DeviceService.getInstance().onHardwareConfigChange((cfg) => {
      setHardwareConfig(cfg);
      setHostInput(cfg.esp32Host);
    });
    return unsub;
  }, []);

  const isConnected = state === 'connected';
  const isConnecting = state === 'connecting';
  const isHardwareLive = hardwareConfig.isHardwareActive;

  const handleSaveHost = (e: React.FormEvent) => {
    e.preventDefault();
    DeviceService.getInstance().setHardwareHost(hostInput);
  };

  const handleToggleAutoConnect = () => {
    DeviceService.getInstance().setAutoConnect(!hardwareConfig.autoConnect);
  };

  const esp32CodeSnippet = `// ====================================================================
// ESP32 Telemetry Firmware for Digital Twin Web App
// Required Libraries: WiFi, WebSocketsServer (by Markus Sattler), ArduinoJson
// ====================================================================

#include <WiFi.h>
#include <ESPmDNS.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

// 1. Wi-Fi Credentials (or use WiFi.softAP("DigitalTwin_AP", "12345678"))
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WebSocketsServer webSocket = WebSocketsServer(81);
unsigned long lastTelemetrySend = 0;

void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println("\\n[ESP32] Powering on Telemetry Transceiver...");

  // Connect to Wi-Fi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(400);
    Serial.print(".");
  }
  
  Serial.println("\\n[ESP32] Connected to Wi-Fi!");
  Serial.print("[ESP32] IP Address: ");
  Serial.println(WiFi.localIP());

  // Setup mDNS so web app can connect via "ws://esp32-telemetry.local:81"
  if (MDNS.begin("esp32-telemetry")) {
    Serial.println("[ESP32] mDNS responder started: esp32-telemetry.local");
  }

  // Start WebSocket Server on Port 81
  webSocket.begin();
  webSocket.onEvent([](uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
    if (type == WStype_CONNECTED) {
      Serial.printf("[ESP32] Digital Twin Web App connected on client #%u!\\n", num);
    }
  });
}

void loop() {
  webSocket.loop();

  // Broadcast live sensor telemetry every 100ms (10Hz)
  if (millis() - lastTelemetrySend >= 100) {
    lastTelemetrySend = millis();

    // -------------------------------------------------------------
    // REPLACE WITH YOUR ACTUAL SENSOR READINGS:
    // -------------------------------------------------------------
    float speed = analogRead(34) * (140.0 / 4095.0); // Pin 34 Speed
    float batteryVoltage = (analogRead(35) / 4095.0) * 3.3 * 4.2; // Pin 35 Battery
    float engineTemp = 40.0 + (analogRead(32) * (50.0 / 4095.0)); // Pin 32 Temp
    int rpm = (int)(speed * 42);

    // Build JSON payload
    StaticJsonDocument<256> doc;
    doc["speedKmh"] = speed;
    doc["engineRpm"] = rpm;
    doc["coolantTempC"] = engineTemp;
    doc["batteryVoltageV"] = batteryVoltage;
    doc["engineLoadPct"] = 32;

    String jsonBuffer;
    serializeJson(doc, jsonBuffer);

    // Stream directly to Digital Twin Web App
    webSocket.broadcastTXT(jsonBuffer);
  }
}
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(esp32CodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-2xl p-4 sm:p-6 shadow-warm-xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                ESP32 Hardware Auto-Connect & Telemetry Link
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500">
                Turns on real hardware sensing automatically when your device is powered on
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'status'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-orange-600" />
            <span>Connection & Controls</span>
          </button>
          <button
            onClick={() => setActiveTab('esp32_code')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'esp32_code'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>ESP32 Arduino Firmware</span>
          </button>
        </div>

        {activeTab === 'status' ? (
          <div className="space-y-4">
            {/* Status Card */}
            <div className="p-4 bg-[#fbf9f4] rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                    isConnected
                      ? isHardwareLive
                        ? 'bg-emerald-500 ring-4 ring-emerald-100 animate-pulse'
                        : 'bg-emerald-500 ring-4 ring-emerald-100'
                      : isConnecting
                      ? 'bg-amber-500 animate-ping'
                      : 'bg-stone-300'
                  }`}
                />
                <div>
                  <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5 flex-wrap">
                    <span>
                      {isConnected
                        ? isHardwareLive
                          ? '⚡ ESP32 Live Hardware Connected'
                          : 'Connected (Simulated Stream)'
                        : isConnecting
                        ? 'Listening for ESP32 Power On...'
                        : 'ESP32 Hardware Disconnected / Powered Off'}
                    </span>
                    {isHardwareLive && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded-md font-mono font-bold">
                        LIVE SENSORS
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-stone-500 font-mono mt-0.5">
                    Target: ws://{hardwareConfig.esp32Host} • Auto-Reconnect: {hardwareConfig.autoConnect ? 'ON (Active)' : 'OFF'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleConnection}
                  disabled={isConnecting}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                    isConnected
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
                      : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/25'
                  }`}
                >
                  {isConnecting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Power className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isConnected ? 'Disconnect' : isConnecting ? 'Connecting...' : 'Probe Now'}
                  </span>
                </button>
              </div>
            </div>

            {/* Auto-Connect & IP Setting Configuration Card */}
            <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-bold text-stone-800">
                    ESP32 Device Address & Auto-Detection
                  </span>
                </div>

                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hardwareConfig.autoConnect}
                    onChange={handleToggleAutoConnect}
                    className="accent-orange-600 rounded cursor-pointer"
                  />
                  <span className="font-semibold">Auto-Connect on Device Turn-On</span>
                </label>
              </div>

              <form onSubmit={handleSaveHost} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-mono select-none">
                    ws://
                  </span>
                  <input
                    type="text"
                    value={hostInput}
                    onChange={(e) => setHostInput(e.target.value)}
                    placeholder="192.168.4.1:81 or esp32-telemetry.local:81"
                    className="w-full pl-12 pr-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500 text-stone-800"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Save & Connect
                </button>
              </form>

              <p className="text-[11px] text-stone-500">
                💡 <strong>Tip:</strong> The default ESP32 Wi-Fi Hotspot is usually <code className="bg-stone-100 px-1 rounded text-stone-700">192.168.4.1:81</code>, or on your home Wi-Fi use <code className="bg-stone-100 px-1 rounded text-stone-700">esp32-telemetry.local:81</code>.
              </p>
            </div>

            {/* Hardware Spec Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-[#fbf9f4] rounded-xl border border-stone-200">
                <div className="text-stone-400 text-[10px] uppercase font-mono font-bold">Hardware</div>
                <div className="font-mono text-stone-900 font-bold mt-0.5 truncate">ESP32 SoC</div>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] rounded-xl border border-stone-200">
                <div className="text-stone-400 text-[10px] uppercase font-mono font-bold">Packets Recv</div>
                <div className="font-mono text-stone-900 font-bold mt-0.5">
                  {DeviceService.getInstance().getMetadata().packetsReceived}
                </div>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] rounded-xl border border-stone-200">
                <div className="text-stone-400 text-[10px] uppercase font-mono font-bold">Latency</div>
                <div className="font-mono text-orange-600 font-bold mt-0.5">
                  {isConnected ? `${DeviceService.getInstance().getMetadata().latencyMs} ms` : '--'}
                </div>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] rounded-xl border border-stone-200">
                <div className="text-stone-400 text-[10px] uppercase font-mono font-bold">Signal (RSSI)</div>
                <div className="font-mono text-emerald-700 font-bold mt-0.5">
                  {isConnected ? `${vehicleConfig.hardwareLink.signalDbm} dBm` : '--'}
                </div>
              </div>
            </div>

            {/* Live Raw JSON Payload Preview if active */}
            {hardwareConfig.lastRawPacket && (
              <div className="p-2.5 bg-stone-900 rounded-xl text-xs font-mono text-emerald-400 border border-stone-800">
                <div className="text-[10px] text-stone-400 uppercase mb-1 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Incoming Live ESP32 JSON Stream:</span>
                </div>
                <div className="truncate">{hardwareConfig.lastRawPacket}</div>
              </div>
            )}

            {/* Live Terminal Log Stream */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-stone-500 mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-stone-700">
                  <Terminal className="w-3.5 h-3.5 text-orange-600" />
                  <span>Connection Event Stream</span>
                </div>
                <span>Auto-scrolling</span>
              </div>

              <div className="p-2.5 bg-stone-950 text-stone-300 rounded-xl h-28 overflow-y-auto font-mono text-[11px] space-y-1 shadow-inner">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2">
                    <span className="text-stone-600 select-none shrink-0">[{log.timestamp}]</span>
                    <span
                      className={
                        log.level === 'error'
                          ? 'text-red-400 font-bold'
                          : log.level === 'warn'
                          ? 'text-amber-400 font-bold'
                          : log.level === 'success'
                          ? 'text-emerald-400 font-bold'
                          : 'text-stone-300'
                      }
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ESP32 Arduino Code Guide Tab */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-600 font-medium">
                Flash this Arduino C++ sketch to your ESP32 board:
              </span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-orange-200"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Code Copied!' : 'Copy Sketch'}</span>
              </button>
            </div>

            <pre className="p-3 bg-stone-950 text-emerald-400 text-[11px] font-mono rounded-xl h-72 overflow-y-auto border border-stone-800 leading-relaxed select-all">
              {esp32CodeSnippet}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

