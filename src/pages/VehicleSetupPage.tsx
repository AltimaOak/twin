import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useVehicle } from '../context/VehicleContext';
import { createCustomVehicleConfig } from '../data/vehicleConfigurations';
import type { VehicleCategory } from '../data/vehicleConfigurations';
import {
  Activity,
  Car,
  Bike,
  Gamepad2,
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';

export const VehicleSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { selectedCategory, setSelectedCategory, saveConfiguredVehicle } = useVehicle();

  // Read query param if present
  const typeParam = (searchParams.get('type') as VehicleCategory) || selectedCategory || 'car';

  const [activeType, setActiveType] = useState<VehicleCategory>(typeParam);

  // Form states per vehicle type
  // CAR state
  const [carMake, setCarMake] = useState('Honda');
  const [carModel, setCarModel] = useState('City i-VTEC');
  const [carYear, setCarYear] = useState('2023');
  const [carFuel, setCarFuel] = useState('Petrol');
  const [carTrans, setCarTrans] = useState('Automatic (CVT)');
  const [carKm, setCarKm] = useState('42380');

  // MOTORCYCLE state
  const [bikeMake, setBikeMake] = useState('Honda');
  const [bikeModel, setBikeModel] = useState('CB350');
  const [bikeYear, setBikeYear] = useState('2024');
  const [bikeCapacity, setBikeCapacity] = useState('348 cc');
  const [bikeFuel, setBikeFuel] = useState('Petrol');
  const [bikeKm, setBikeKm] = useState('12420');

  // RC CAR state
  const [rcName, setRcName] = useState('Traxxas Slash 4x4 Brushless');
  const [rcMotor, setRcMotor] = useState('Velineon 3500kV Brushless');
  const [rcBattery, setRcBattery] = useState('3S 11.1V LiPo');
  const [rcDrive, setRcDrive] = useState('4WD Shaft-Driven');
  const [rcCycles, setRcCycles] = useState('126');

  useEffect(() => {
    if (typeParam && (typeParam === 'car' || typeParam === 'motorcycle' || typeParam === 'rc_car')) {
      setActiveType(typeParam);
      setSelectedCategory(typeParam);
    }
  }, [typeParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newConfig;
    if (activeType === 'car') {
      newConfig = createCustomVehicleConfig('car', {
        make: carMake,
        model: carModel,
        year: carYear,
        fuelOrBatteryType: carFuel,
        transmissionOrEsc: carTrans,
        mileageOrCycles: `${Number(carKm).toLocaleString()} km`
      });
    } else if (activeType === 'motorcycle') {
      newConfig = createCustomVehicleConfig('motorcycle', {
        make: bikeMake,
        model: bikeModel,
        year: bikeYear,
        engineOrMotor: `${bikeCapacity} 4-Stroke Engine`,
        fuelOrBatteryType: bikeFuel,
        mileageOrCycles: `${Number(bikeKm).toLocaleString()} km`
      });
    } else {
      newConfig = createCustomVehicleConfig('rc_car', {
        model: rcName,
        engineOrMotor: rcMotor,
        fuelOrBatteryType: rcBattery,
        driveType: rcDrive,
        mileageOrCycles: `${rcCycles} battery cycles`
      });
    }

    saveConfiguredVehicle(newConfig);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-stone-900 font-sans flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 selection:bg-orange-500/20 selection:text-orange-950">
      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-stone-200">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xl font-black font-display tracking-tight text-stone-900 leading-none">
              MotoMind<span className="text-orange-600">X</span>
            </div>
            <p className="text-[10px] text-stone-500 font-medium tracking-tight mt-0.5">
              Vehicle Health & Diagnostics
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-stone-500 hidden sm:inline">Step 2 of 2</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-orange-50 border border-orange-200 text-orange-800">
            Vehicle Setup
          </span>
        </div>
      </header>

      {/* Main Setup Card */}
      <main className="max-w-2xl mx-auto w-full my-auto py-8">
        <div className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-10 shadow-warm-xl space-y-6">
          {/* Top Bar with Back & Category Switcher */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/select-vehicle')}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Selection</span>
            </button>

            {/* Type Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf9f4] border border-stone-200 text-xs font-bold text-stone-800 font-mono">
              {activeType === 'car' ? (
                <Car className="w-3.5 h-3.5 text-orange-600" />
              ) : activeType === 'motorcycle' ? (
                <Bike className="w-3.5 h-3.5 text-orange-600" />
              ) : (
                <Gamepad2 className="w-3.5 h-3.5 text-orange-600" />
              )}
              <span className="capitalize">{activeType.replace('_', ' ')} Profile</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-stone-900">
              Configure Your {activeType === 'car' ? 'Passenger Car' : activeType === 'motorcycle' ? 'Motorcycle' : 'RC Vehicle'}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Enter your vehicle specifications to initialize the diagnostic telemetry monitors.
            </p>
          </div>

          {/* Dynamic Setup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* CAR FORM */}
            {activeType === 'car' && (
              <div className="space-y-3.5 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                      Make / Manufacturer
                    </label>
                    <input
                      type="text"
                      value={carMake}
                      onChange={(e) => setCarMake(e.target.value)}
                      placeholder="e.g. Honda, Toyota, BMW"
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                      Model / Variant
                    </label>
                    <input
                      type="text"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="e.g. City i-VTEC, Civic, Accord"
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                      Manufacturing Year
                    </label>
                    <input
                      type="number"
                      value={carYear}
                      onChange={(e) => setCarYear(e.target.value)}
                      placeholder="2023"
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                      Fuel Type
                    </label>
                    <select
                      value={carFuel}
                      onChange={(e) => setCarFuel(e.target.value)}
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric (EV)">Electric (EV)</option>
                      <option value="Hybrid (e:HEV)">Hybrid</option>
                      <option value="CNG / LPG">CNG / LPG</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                      Transmission
                    </label>
                    <select
                      value={carTrans}
                      onChange={(e) => setCarTrans(e.target.value)}
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="Automatic (CVT)">Automatic (CVT)</option>
                      <option value="Automatic (Torque Converter)">Automatic (AT)</option>
                      <option value="Dual-Clutch (DCT)">Dual-Clutch (DCT)</option>
                      <option value="Manual 6-Speed">Manual (MT)</option>
                      <option value="Single-Speed Direct (EV)">Single Speed (EV)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                    Current Odometer (Kilometres)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={carKm}
                      onChange={(e) => setCarKm(e.target.value)}
                      placeholder="e.g. 42380"
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500 font-mono"
                      required
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-mono font-bold text-stone-400">
                      KM
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* MOTORCYCLE FORM */}
            {activeType === 'motorcycle' && (
              <div className="space-y-3.5 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                      Make / Brand
                    </label>
                    <input
                      type="text"
                      value={bikeMake}
                      onChange={(e) => setBikeMake(e.target.value)}
                      placeholder="e.g. Honda, Yamaha, Royal Enfield"
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                      Model Name
                    </label>
                    <input
                      type="text"
                      value={bikeModel}
                      onChange={(e) => setBikeModel(e.target.value)}
                      placeholder="e.g. CB350, MT-15, Classic 350"
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      value={bikeYear}
                      onChange={(e) => setBikeYear(e.target.value)}
                      placeholder="2024"
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                      Engine Capacity
                    </label>
                    <input
                      type="text"
                      value={bikeCapacity}
                      onChange={(e) => setBikeCapacity(e.target.value)}
                      placeholder="e.g. 348 cc, 689 cc"
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                      Fuel Type
                    </label>
                    <select
                      value={bikeFuel}
                      onChange={(e) => setBikeFuel(e.target.value)}
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Electric">Electric (EV)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                    Current Odometer (Kilometres)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={bikeKm}
                      onChange={(e) => setBikeKm(e.target.value)}
                      placeholder="e.g. 12420"
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500 font-mono"
                      required
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-mono font-bold text-stone-400">
                      KM
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* RC CAR FORM */}
            {activeType === 'rc_car' && (
              <div className="space-y-3.5 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                    RC Vehicle Model Name
                  </label>
                  <input
                    type="text"
                    value={rcName}
                    onChange={(e) => setRcName(e.target.value)}
                    placeholder="e.g. Traxxas Slash 4x4 Brushless, Arrma Typhon"
                    className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                      Motor Type
                    </label>
                    <select
                      value={rcMotor}
                      onChange={(e) => setRcMotor(e.target.value)}
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="Velineon 3500kV Brushless">Velineon 3500kV Brushless</option>
                      <option value="Hobbywing 2050kV Brushless">Hobbywing 2050kV Brushless</option>
                      <option value="Castle Creations 4600kV">Castle Creations 4600kV</option>
                      <option value="Brushed 550 Motor">Brushed 550 Motor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                      Battery Chemistry & Voltage
                    </label>
                    <select
                      value={rcBattery}
                      onChange={(e) => setRcBattery(e.target.value)}
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="3S 11.1V 5000mAh LiPo">3S 11.1V LiPo Pack</option>
                      <option value="2S 7.4V 5200mAh LiPo">2S 7.4V LiPo Pack</option>
                      <option value="4S 14.8V 5000mAh LiPo">4S 14.8V LiPo Pack</option>
                      <option value="6S 22.2V 5000mAh LiPo">6S 22.2V LiPo Pack</option>
                      <option value="7.2V NiMH 3000mAh">7.2V NiMH Pack</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                      Drivetrain
                    </label>
                    <select
                      value={rcDrive}
                      onChange={(e) => setRcDrive(e.target.value)}
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="Shaft-Driven 4WD">Shaft-Driven 4WD</option>
                      <option value="Belt-Driven 4WD">Belt-Driven 4WD</option>
                      <option value="2WD Rear-Wheel Drive">2WD Rear-Wheel Drive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                      Logged Battery Cycles
                    </label>
                    <input
                      type="number"
                      value={rcCycles}
                      onChange={(e) => setRcCycles(e.target.value)}
                      placeholder="126"
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Telemetry Hardware Link Tip */}
            <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-orange-950 flex items-center gap-2 mt-4">
              <Info className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span>
                <strong>Hardware Telemetry:</strong> MotoMindX will bind to the{' '}
                {activeType === 'car'
                  ? 'ISO 15765-4 OBD-II CAN bus'
                  : activeType === 'motorcycle'
                  ? 'Motorcycle CAN bus'
                  : '915MHz LoRa direct telemetry receiver'}
                .
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/30 transition-all mt-4"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full pt-6 border-t border-stone-200 text-center text-xs text-stone-500 font-mono">
        MotoMindX Hardware Link Platform • Step 2 of 2
      </footer>
    </div>
  );
};
