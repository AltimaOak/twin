import React from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import {
  Car,
  Bike,
  Gamepad2,
  Gauge,
  Cpu,
  Sliders,
  Radio,
  Fuel
} from 'lucide-react';

interface VehicleProfileCardProps {
  vehicleConfig: VehicleConfig;
}

export const VehicleProfileCard: React.FC<VehicleProfileCardProps> = ({ vehicleConfig }) => {
  const getVehicleIcon = () => {
    switch (vehicleConfig.type) {
      case 'motorcycle':
        return <Bike className="w-6 h-6 text-orange-600" />;
      case 'rc_car':
        return <Gamepad2 className="w-6 h-6 text-orange-600" />;
      default:
        return <Car className="w-6 h-6 text-orange-600" />;
    }
  };

  const specs = vehicleConfig.specifications;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-warm-sm space-y-4">
      {/* Header with Title & Icon */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center shadow-warm-sm">
            {getVehicleIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-orange-600 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200">
                {vehicleConfig.categoryLabel}
              </span>
              <span className="text-xs font-mono text-stone-400">
                {vehicleConfig.model.vinOrSerial}
              </span>
            </div>
            <h2 className="text-lg font-black text-stone-900 tracking-tight mt-0.5">
              {vehicleConfig.model.name} {vehicleConfig.model.year}
            </h2>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-bold text-stone-900 font-mono">
            {specs.mileageOrCycles}
          </div>
          <div className="text-[11px] text-stone-500 font-medium">
            Distance / Cycles Logged
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 uppercase font-mono">
            <Cpu className="w-3.5 h-3.5 text-stone-500" />
            <span>{vehicleConfig.type === 'rc_car' ? 'Motor' : 'Engine'}</span>
          </div>
          <div className="mt-1 text-xs font-bold text-stone-900 leading-snug">
            {specs.engineOrMotor}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 uppercase font-mono">
            <Sliders className="w-3.5 h-3.5 text-stone-500" />
            <span>{vehicleConfig.type === 'rc_car' ? 'ESC Controller' : 'Transmission'}</span>
          </div>
          <div className="mt-1 text-xs font-bold text-stone-900 leading-snug">
            {specs.transmissionOrEsc}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 uppercase font-mono">
            <Gauge className="w-3.5 h-3.5 text-stone-500" />
            <span>Drivetrain</span>
          </div>
          <div className="mt-1 text-xs font-bold text-stone-900 leading-snug">
            {specs.driveType}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 uppercase font-mono">
            <Fuel className="w-3.5 h-3.5 text-stone-500" />
            <span>{vehicleConfig.type === 'rc_car' ? 'Battery Pack' : 'Fuel Type'}</span>
          </div>
          <div className="mt-1 text-xs font-bold text-stone-900 leading-snug">
            {specs.fuelOrBatteryType}
          </div>
        </div>
      </div>

      {/* Hardware Link Protocol Info */}
      <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/80 flex items-center justify-between text-xs font-mono text-orange-950">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-orange-600" />
          <span>Protocol: <strong>{vehicleConfig.hardwareLink.protocol}</strong></span>
        </div>
        <div>
          <span>Device ID: <strong>{vehicleConfig.hardwareLink.deviceId}</strong></span>
        </div>
      </div>
    </div>
  );
};
