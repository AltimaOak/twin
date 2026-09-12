import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVehicle } from '../context/VehicleContext';
import {
  Activity,
  Car,
  Bike,
  Zap,
  Gamepad2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const VehicleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCategory } = useVehicle();

  const handleSelect = (type: 'car' | 'motorcycle' | 'scooter' | 'rc_car') => {
    setSelectedCategory(type);
    navigate(`/vehicle-setup?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-stone-900 font-sans flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 selection:bg-orange-500/20 selection:text-orange-950">
      {/* Header Bar */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6 border-b border-stone-200">
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
          <span className="text-xs font-mono text-stone-500 hidden sm:inline">Step 1 of 2</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-orange-50 border border-orange-200 text-orange-800">
            Select Category
          </span>
        </div>
      </header>

      {/* Main Selection Body */}
      <main className="max-w-7xl mx-auto w-full my-auto py-8 space-y-8">
        {/* Title & Subtitle */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-stone-950">
            Select Your Vehicle
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
            Choose the vehicle category you want to monitor. MotoMindX will load the dedicated 3D digital twin, diagnostic parameters, and telemetry stream.
          </p>
        </div>

        {/* 4 Distinct Vehicle Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* Card 1: CAR */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-stone-200 hover:border-orange-500 shadow-warm-md hover:shadow-warm-xl transition-all flex flex-col justify-between group space-y-5">
            <div className="space-y-3.5">
              {/* Preview Graphic / Icon Badge */}
              <div className="h-32 rounded-2xl bg-gradient-to-b from-stone-50 to-[#f4eee2] border border-stone-200 flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-orange-50/50 transition-colors">
                <Car className="w-14 h-14 text-orange-600 transform group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/90 text-stone-700 border border-stone-200 shadow-warm-sm">
                  ISO 15765-4 OBD-II
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-orange-600 tracking-wider">
                  Passenger &amp; SUV
                </span>
                <h2 className="text-xl font-black font-display text-stone-900 tracking-tight mt-0.5">
                  CAR
                </h2>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  Cars &amp; passenger vehicles. Connects via standard OBD-II port for engine PIDs, fuel trim, transmission, and emissions monitors.
                </p>
              </div>

              <div className="pt-2 space-y-1.5 text-xs text-stone-600 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Engine &amp; Battery Sensors</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sedan 3D Digital Twin</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelect('car')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-900 hover:bg-orange-600 text-white text-xs font-bold shadow-md transition-all group-hover:bg-orange-600 group-hover:shadow-orange-600/30 cursor-pointer"
            >
              <span>Select Car</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: MOTORCYCLE */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-stone-200 hover:border-orange-500 shadow-warm-md hover:shadow-warm-xl transition-all flex flex-col justify-between group space-y-5">
            <div className="space-y-3.5">
              {/* Preview Graphic / Icon Badge */}
              <div className="h-32 rounded-2xl bg-gradient-to-b from-stone-50 to-[#f4eee2] border border-stone-200 flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-orange-50/50 transition-colors">
                <Bike className="w-14 h-14 text-orange-600 transform group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/90 text-stone-700 border border-stone-200 shadow-warm-sm">
                  Motorcycle CAN / K-Line
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-orange-600 tracking-wider">
                  Two-Wheel Performance
                </span>
                <h2 className="text-xl font-black font-display text-stone-900 tracking-tight mt-0.5">
                  MOTORCYCLE
                </h2>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  Sport bikes &amp; cruisers. Monitor engine temps, dual ABS line pressures, stator charging, IMU lean angle, and chain slack.
                </p>
              </div>

              <div className="pt-2 space-y-1.5 text-xs text-stone-600 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chain, ABS &amp; Lean Sensors</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sport Bike 3D Digital Twin</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelect('motorcycle')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-900 hover:bg-orange-600 text-white text-xs font-bold shadow-md transition-all group-hover:bg-orange-600 group-hover:shadow-orange-600/30 cursor-pointer"
            >
              <span>Select Motorcycle</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: ELECTRIC SCOOTER */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-stone-200 hover:border-cyan-500 shadow-warm-md hover:shadow-warm-xl transition-all flex flex-col justify-between group space-y-5">
            <div className="space-y-3.5">
              {/* Preview Graphic / Icon Badge */}
              <div className="h-32 rounded-2xl bg-gradient-to-b from-cyan-50 to-[#e6f8fa] border border-cyan-200/80 flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-cyan-100/50 transition-colors">
                <Zap className="w-14 h-14 text-cyan-600 transform group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/90 text-cyan-800 border border-cyan-200 shadow-warm-sm">
                  Smart EV CAN / BLE
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-600 tracking-wider">
                  Smart Urban EV
                </span>
                <h2 className="text-xl font-black font-display text-stone-900 tracking-tight mt-0.5">
                  ELECTRIC SCOOTER
                </h2>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  Electric scooters &amp; urban EVs. Track 3.7 kWh Li-ion pack health, PMSM mid-motor torque, active BMS cell delta, TrueRange &amp; regen.
                </p>
              </div>

              <div className="pt-2 space-y-1.5 text-xs text-stone-600 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Battery Pack, BMS &amp; Motor</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Smart EV 3D Digital Twin</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelect('scooter')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-900 hover:bg-cyan-600 text-white text-xs font-bold shadow-md transition-all group-hover:bg-cyan-600 group-hover:shadow-cyan-600/30 cursor-pointer"
            >
              <span>Select Electric Scooter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 4: RC CAR */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-stone-200 hover:border-orange-500 shadow-warm-md hover:shadow-warm-xl transition-all flex flex-col justify-between group space-y-5">
            <div className="space-y-3.5">
              {/* Preview Graphic / Icon Badge */}
              <div className="h-32 rounded-2xl bg-gradient-to-b from-stone-50 to-[#f4eee2] border border-stone-200 flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-orange-50/50 transition-colors">
                <Gamepad2 className="w-14 h-14 text-orange-600 transform group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/90 text-stone-700 border border-stone-200 shadow-warm-sm">
                  915MHz LoRa Telemetry
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-orange-600 tracking-wider">
                  Electric &amp; Hobby Rigs
                </span>
                <h2 className="text-xl font-black font-display text-stone-900 tracking-tight mt-0.5">
                  RC CAR
                </h2>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  Electric and hobby RC vehicles. High-speed brushless RPM telemetry, ESC FET temperatures, per-cell 3S LiPo balance, and RF signal RSSI.
                </p>
              </div>

              <div className="pt-2 space-y-1.5 text-xs text-stone-600 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Brushless Motor &amp; LiPo Cells</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1/10 Chassis 3D Digital Twin</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelect('rc_car')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-900 hover:bg-orange-600 text-white text-xs font-bold shadow-md transition-all group-hover:bg-orange-600 group-hover:shadow-orange-600/30 cursor-pointer"
            >
              <span>Select RC Car</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full pt-6 border-t border-stone-200 text-center text-xs text-stone-500 font-mono">
        MotoMindX Hardware Link Platform • Multi-Protocol Diagnostics Engine
      </footer>
    </div>
  );
};
