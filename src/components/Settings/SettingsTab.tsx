import React, { useState } from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import {
  Radio,
  Sliders,
  Bell,
  Check
} from 'lucide-react';

interface SettingsTabProps {
  vehicleConfig: VehicleConfig;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ vehicleConfig }) => {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [tempUnit, setTempUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [pressureUnit, setPressureUnit] = useState<'psi' | 'bar'>('psi');
  const [autoConnect, setAutoConnect] = useState(true);
  const [dtcPushAlerts, setDtcPushAlerts] = useState(true);
  const [serviceReminders, setServiceReminders] = useState(true);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Settings &amp; Preferences
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Hardware telemetry links, measurement units, and alert notifications.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          {savedNotification ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Saved!</span>
            </>
          ) : (
            <span>Save Changes</span>
          )}
        </button>
      </div>

      {/* 1. Units of Measurement */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
          <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-stone-900">
              Units of Measurement
            </h3>
            <p className="text-[11px] text-stone-400">
              Display format for gauges, speed, and telemetry readings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-stone-700 block mb-1.5">
              Distance &amp; Speed
            </label>
            <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setUnitSystem('metric')}
                className={`py-1.5 rounded-lg font-medium transition-colors ${
                  unitSystem === 'metric'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Metric (km)
              </button>
              <button
                type="button"
                onClick={() => setUnitSystem('imperial')}
                className={`py-1.5 rounded-lg font-medium transition-colors ${
                  unitSystem === 'imperial'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Imperial (mi)
              </button>
            </div>
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1.5">
              Temperature
            </label>
            <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTempUnit('celsius')}
                className={`py-1.5 rounded-lg font-medium transition-colors ${
                  tempUnit === 'celsius'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                type="button"
                onClick={() => setTempUnit('fahrenheit')}
                className={`py-1.5 rounded-lg font-medium transition-colors ${
                  tempUnit === 'fahrenheit'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1.5">
              Tire Pressure
            </label>
            <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPressureUnit('psi')}
                className={`py-1.5 rounded-lg font-medium transition-colors ${
                  pressureUnit === 'psi'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                PSI
              </button>
              <button
                type="button"
                onClick={() => setPressureUnit('bar')}
                className={`py-1.5 rounded-lg font-medium transition-colors ${
                  pressureUnit === 'bar'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Bar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Telemetry & Hardware Connection */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
          <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-stone-900">
              Hardware Telemetry Link
            </h3>
            <p className="text-[11px] text-stone-400">
              OBD-II and serial communication bus settings
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <label htmlFor="settings-auto-connect" className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/70 cursor-pointer">
            <div>
              <span className="font-semibold text-stone-900 block">
                Automatic Reconnection
              </span>
              <span className="text-stone-500 text-[11px]">
                Attempt to reconnect to vehicle hardware automatically on app start.
              </span>
            </div>
            <input
              id="settings-auto-connect"
              name="autoConnect"
              type="checkbox"
              checked={autoConnect}
              onChange={(e) => setAutoConnect(e.target.checked)}
              className="w-4 h-4 accent-orange-600 rounded ml-4 cursor-pointer"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-stone-200/80 bg-white">
              <span className="text-stone-400 text-[11px] block">Active Protocol</span>
              <span className="font-semibold text-stone-900 block mt-0.5">
                {vehicleConfig.hardwareLink.protocol}
              </span>
              <span className="text-[10px] text-stone-400 mt-1 block">
                Latency: {vehicleConfig.hardwareLink.latencyMs} ms
              </span>
            </div>

            <div className="p-3 rounded-xl border border-stone-200/80 bg-white">
              <span className="text-stone-400 text-[11px] block">Adapter Device ID</span>
              <span className="font-semibold text-stone-900 font-mono block mt-0.5">
                {vehicleConfig.hardwareLink.deviceId}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
                Firmware v2.4.1 (Up to date)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Notifications */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
          <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-stone-900">
              Notification Preferences
            </h3>
            <p className="text-[11px] text-stone-400">
              Manage alerts for trouble codes and maintenance windows
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <label htmlFor="settings-dtc-push" className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/70 cursor-pointer">
            <div>
              <span className="font-semibold text-stone-900 block">
                Diagnostic Trouble Code Warnings
              </span>
              <span className="text-stone-500 text-[11px]">
                Notify immediately when an active fault or DTC is detected on the CAN bus.
              </span>
            </div>
            <input
              id="settings-dtc-push"
              name="dtcPushAlerts"
              type="checkbox"
              checked={dtcPushAlerts}
              onChange={(e) => setDtcPushAlerts(e.target.checked)}
              className="w-4 h-4 accent-orange-600 rounded ml-4 cursor-pointer"
            />
          </label>

          <label htmlFor="settings-service-reminders" className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/70 cursor-pointer">
            <div>
              <span className="font-semibold text-stone-900 block">
                Scheduled Maintenance Reminders
              </span>
              <span className="text-stone-500 text-[11px]">
                Notify 30 days or 1,500 km before scheduled service is due.
              </span>
            </div>
            <input
              id="settings-service-reminders"
              name="serviceReminders"
              type="checkbox"
              checked={serviceReminders}
              onChange={(e) => setServiceReminders(e.target.checked)}
              className="w-4 h-4 accent-orange-600 rounded ml-4 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
