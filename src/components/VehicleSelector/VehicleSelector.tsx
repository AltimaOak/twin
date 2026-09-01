import React from 'react';
import type { Vehicle, VehicleType } from '../../types/vehicle';
import { Car, Bike, Gamepad2, Radio, Info } from 'lucide-react';

interface VehicleSelectorProps {
  activeVehicle: Vehicle;
  onSelectVehicleType: (type: VehicleType) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  activeVehicle,
  onSelectVehicleType
}) => {
  const vehicleOptions: {
    type: VehicleType;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    protocol: string;
  }[] = [
    {
      type: 'car',
      label: 'Car',
      sublabel: 'Honda City i-VTEC (2023)',
      icon: <Car className="w-4 h-4" />,
      protocol: 'OBD-II CAN'
    },
    {
      type: 'bike',
      label: 'Motorcycle',
      sublabel: 'Yamaha MT-07 ABS (2022)',
      icon: <Bike className="w-4 h-4" />,
      protocol: 'Motorcycle CAN'
    },
    {
      type: 'rcCar',
      label: 'RC Car',
      sublabel: 'Traxxas Slash 4x4 Brushless',
      icon: <Gamepad2 className="w-4 h-4" />,
      protocol: 'RC Telemetry 915MHz'
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Top row: Auto-Detect Status & Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Detection Pill */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <div className="text-xs font-mono">
            <span className="text-slate-400 uppercase">Auto-Detection: </span>
            <span className="font-bold text-cyan-300">
              Vehicle Detected: {activeVehicle.type === 'car' ? 'Passenger Car' : activeVehicle.type === 'bike' ? 'Motorcycle' : 'RC Telemetry Vehicle'}
            </span>
          </div>
        </div>

        {/* Switcher Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {vehicleOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => onSelectVehicleType(opt.type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-all ${
                activeVehicle.type === opt.type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Specification Strip */}
      <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
            {activeVehicle.type === 'car' ? (
              <Car className="w-6 h-6" />
            ) : activeVehicle.type === 'bike' ? (
              <Bike className="w-6 h-6" />
            ) : (
              <Gamepad2 className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>
                {activeVehicle.make} {activeVehicle.model} {activeVehicle.year}
              </span>
              {activeVehicle.type === 'rcCar' && (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  RC TELEMETRY MODE
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              <span>{activeVehicle.fuelType}</span>
              <span className="mx-2 text-slate-600">•</span>
              <span>{activeVehicle.mileageKm.toLocaleString()} km logged</span>
              <span className="mx-2 text-slate-600">•</span>
              <span className="text-slate-500">ID: {activeVehicle.vinOrSerial}</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Protocol Indicator */}
        <div className="text-right font-mono text-xs">
          <div className="text-[10px] uppercase text-slate-500">Hardware Link</div>
          <div className="text-slate-300 font-semibold flex items-center gap-1.5 justify-end mt-0.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>{activeVehicle.ecuProtocol}</span>
          </div>
        </div>
      </div>

      {/* Important RC Notice */}
      {activeVehicle.type === 'rcCar' && (
        <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0 text-cyan-400" />
          <span>
            <strong>RC Telemetry Mode Active:</strong> Reading high-speed brushless motor RPM, 3S LiPo cell balance, ESC FET temperatures, and current draw via MotoMindX LoRa wireless bridge.
          </span>
        </div>
      )}
    </div>
  );
};
