import React from 'react';
import { useVehicle } from '../../context/VehicleContext';
import type { VehicleCategory } from '../../data/vehicleConfigurations';
import { VEHICLE_CONFIGURATIONS } from '../../data/vehicleConfigurations';
import {
  Car,
  Bike,
  Zap,
  Gamepad2,
  Check,
  Plus,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface VehiclesTabProps {
  onNavigateToSetup?: () => void;
}

export const VehiclesTab: React.FC<VehiclesTabProps> = ({ onNavigateToSetup }) => {
  const { selectedCategory, setSelectedCategory } = useVehicle();

  const getVehicleIcon = (type: VehicleCategory) => {
    switch (type) {
      case 'motorcycle':
        return <Bike className="w-5 h-5 text-orange-600" />;
      case 'scooter':
        return <Zap className="w-5 h-5 text-emerald-600" />;
      case 'rc_car':
        return <Gamepad2 className="w-5 h-5 text-orange-600" />;
      default:
        return <Car className="w-5 h-5 text-orange-600" />;
    }
  };

  const vehicleList: Array<{
    category: VehicleCategory;
    name: string;
    year: number;
    typeLabel: string;
    mileage: string;
    score: number;
    protocol: string;
  }> = [
    {
      category: 'car',
      name: VEHICLE_CONFIGURATIONS.car.model.name,
      year: VEHICLE_CONFIGURATIONS.car.model.year,
      typeLabel: 'Passenger Sedan',
      mileage: VEHICLE_CONFIGURATIONS.car.specifications.mileageOrCycles,
      score: VEHICLE_CONFIGURATIONS.car.healthIndex.overallScore,
      protocol: 'OBD-II CAN'
    },
    {
      category: 'motorcycle',
      name: VEHICLE_CONFIGURATIONS.motorcycle.model.name,
      year: VEHICLE_CONFIGURATIONS.motorcycle.model.year,
      typeLabel: 'Motorcycle',
      mileage: VEHICLE_CONFIGURATIONS.motorcycle.specifications.mileageOrCycles,
      score: VEHICLE_CONFIGURATIONS.motorcycle.healthIndex.overallScore,
      protocol: 'Bluetooth BLE'
    },
    {
      category: 'scooter',
      name: VEHICLE_CONFIGURATIONS.scooter.model.name,
      year: VEHICLE_CONFIGURATIONS.scooter.model.year,
      typeLabel: 'Smart EV Scooter',
      mileage: VEHICLE_CONFIGURATIONS.scooter.specifications.mileageOrCycles,
      score: VEHICLE_CONFIGURATIONS.scooter.healthIndex.overallScore,
      protocol: 'EV CAN / BLE'
    },
    {
      category: 'rc_car',
      name: VEHICLE_CONFIGURATIONS.rc_car.model.name,
      year: VEHICLE_CONFIGURATIONS.rc_car.model.year,
      typeLabel: 'RC Telemetry Rig',
      mileage: VEHICLE_CONFIGURATIONS.rc_car.specifications.mileageOrCycles,
      score: VEHICLE_CONFIGURATIONS.rc_car.healthIndex.overallScore,
      protocol: '2.4 GHz LoRa'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Garage &amp; Fleet
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Switch between active vehicles or connect additional hardware.
          </p>
        </div>

        {onNavigateToSetup && (
          <button
            type="button"
            onClick={onNavigateToSetup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vehicle</span>
          </button>
        )}
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vehicleList.map((veh) => {
          const isActive = selectedCategory === veh.category;
          return (
            <div
              key={veh.category}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                isActive
                  ? 'border-orange-400 ring-2 ring-orange-100 shadow-sm'
                  : 'border-stone-200/90 hover:border-stone-300 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-orange-50/80">
                    {getVehicleIcon(veh.category)}
                  </div>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-400 font-medium">
                      Connected
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-stone-900 leading-tight">
                  {veh.name}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {veh.year} • {veh.typeLabel}
                </p>

                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Health Score</span>
                    <span className="font-bold text-stone-900">{veh.score}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Odometer</span>
                    <span className="font-semibold text-stone-700 font-mono">{veh.mileage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Telemetry</span>
                    <span className="font-medium text-stone-600">{veh.protocol}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                {isActive ? (
                  <div className="w-full py-2 text-center text-xs font-semibold text-emerald-700 bg-emerald-50/80 rounded-xl border border-emerald-200/60">
                    Currently Selected
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(veh.category)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors shadow-sm"
                  >
                    <span>Switch to Vehicle</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hardware Connection Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-stone-100 text-stone-700">
            <ShieldCheck className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">
              Hardware Compatibility
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Supports standard OBD-II (ISO 15765-4 CAN), ELM327, BLE adapters, and serial telemetry links.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
