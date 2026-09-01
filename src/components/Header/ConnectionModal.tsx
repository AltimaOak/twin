import React from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import type { ConnectionState, ConnectionLog } from '../../types/device';
import {
  X,
  Radio,
  Power,
  Terminal,
  RefreshCw
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
  const isConnected = state === 'connected';
  const isConnecting = state === 'connecting';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-2xl p-6 shadow-warm-xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                MotoMindX Hardware Link & Diagnostic Bus
              </h3>
              <p className="text-xs text-stone-500">
                Direct CAN-Bus & Wireless Telemetry Transceiver Configuration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card */}
        <div className="p-4 bg-[#fbf9f4] rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                isConnected
                  ? 'bg-emerald-500 ring-4 ring-emerald-100'
                  : isConnecting
                  ? 'bg-amber-500 animate-ping'
                  : 'bg-stone-300'
              }`}
            />
            <div>
              <div className="text-sm font-bold text-stone-900">
                {isConnected
                  ? 'Connected to MotoMindX Hardware'
                  : isConnecting
                  ? 'Negotiating Diagnostic Handshake...'
                  : 'Hardware Dongle Disconnected'}
              </div>
              <div className="text-xs text-stone-500 font-mono mt-0.5">
                {vehicleConfig.hardwareLink.protocol} • {vehicleConfig.hardwareLink.medium}
              </div>
            </div>
          </div>

          <button
            onClick={onToggleConnection}
            disabled={isConnecting}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isConnected
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/25'
            }`}
          >
            {isConnecting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Power className="w-4 h-4" />
            )}
            <span>
              {isConnected ? 'Disconnect Device' : isConnecting ? 'Connecting...' : 'Connect Hardware'}
            </span>
          </button>
        </div>

        {/* Hardware Spec Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 bg-[#fbf9f4] rounded-xl border border-stone-200">
            <div className="text-stone-400 text-[10px] uppercase font-mono font-bold">Device ID</div>
            <div className="font-mono text-stone-900 font-bold mt-1">{vehicleConfig.hardwareLink.deviceId}</div>
          </div>

          <div className="p-3 bg-[#fbf9f4] rounded-xl border border-stone-200">
            <div className="text-stone-400 text-[10px] uppercase font-mono font-bold">Speed / Freq</div>
            <div className="font-mono text-stone-900 font-bold mt-1">{vehicleConfig.hardwareLink.baudRateOrFrequency}</div>
          </div>

          <div className="p-3 bg-[#fbf9f4] rounded-xl border border-stone-200">
            <div className="text-stone-400 text-[10px] uppercase font-mono font-bold">Latency</div>
            <div className="font-mono text-orange-600 font-bold mt-1">
              {isConnected ? `${vehicleConfig.hardwareLink.latencyMs} ms` : '--'}
            </div>
          </div>

          <div className="p-3 bg-[#fbf9f4] rounded-xl border border-stone-200">
            <div className="text-stone-400 text-[10px] uppercase font-mono font-bold">Signal (RSSI)</div>
            <div className="font-mono text-emerald-700 font-bold mt-1">
              {isConnected ? `${vehicleConfig.hardwareLink.signalDbm} dBm` : '--'}
            </div>
          </div>
        </div>

        {/* Live Terminal Log Stream */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-stone-500 mb-2">
            <div className="flex items-center gap-1.5 font-bold text-stone-700">
              <Terminal className="w-3.5 h-3.5 text-orange-600" />
              <span>Hardware Link Communication Stream</span>
            </div>
            <span>Auto-scrolling buffer</span>
          </div>

          <div className="p-3 bg-stone-900 text-stone-300 rounded-xl h-36 overflow-y-auto font-mono text-xs space-y-1.5 shadow-inner">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2">
                <span className="text-stone-500 select-none">[{log.timestamp}]</span>
                <span
                  className={
                    log.level === 'error'
                      ? 'text-red-400 font-bold'
                      : log.level === 'warn'
                      ? 'text-amber-400 font-bold'
                      : log.level === 'success'
                      ? 'text-emerald-400 font-bold'
                      : 'text-stone-200'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pluggable Architecture Note */}
        <div className="text-[11px] text-stone-500 font-mono text-center">
          Pluggable Diagnostics Engine: Supports direct WebSerial, WebSocket, Bluetooth LE & MQTT 3.1 feeds.
        </div>
      </div>
    </div>
  );
};
