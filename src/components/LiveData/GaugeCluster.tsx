import React from 'react';
import type { VehicleType } from '../../types/vehicle';
import type { CarTelemetry, BikeTelemetry, RcCarTelemetry } from '../../types/telemetry';

interface GaugeClusterProps {
  vehicleType: VehicleType;
  car?: CarTelemetry;
  bike?: BikeTelemetry;
  rcCar?: RcCarTelemetry;
}

export const GaugeCluster: React.FC<GaugeClusterProps> = ({
  vehicleType,
  car,
  bike,
  rcCar
}) => {
  let speed = 0;
  let rpm = 0;
  let maxSpeed = 220;
  let maxRpm = 8000;
  let rpmLabel = 'RPM × 1000';
  let speedUnit = 'km/h';
  let gearOrMode = 'D';

  if (vehicleType === 'car' && car) {
    speed = car.speedKmh;
    rpm = car.engineRpm;
    maxSpeed = 220;
    maxRpm = 7000;
    gearOrMode = car.gear;
  } else if (vehicleType === 'bike' && bike) {
    speed = bike.speedKmh;
    rpm = bike.engineRpm;
    maxSpeed = 240;
    maxRpm = 11000;
    gearOrMode = `GEAR ${bike.gear}`;
  } else if (vehicleType === 'rcCar' && rcCar) {
    speed = rcCar.speedKmh;
    rpm = rcCar.motorRpm;
    maxSpeed = 80;
    maxRpm = 50000;
    rpmLabel = 'MOTOR RPM';
    gearOrMode = '3S LiPo';
  }

  const speedPct = Math.min(1, Math.max(0, speed / maxSpeed));
  const rpmPct = Math.min(1, Math.max(0, rpm / maxRpm));

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffsetSpeed = circumference - (speedPct * 0.75 * circumference);
  const strokeDashoffsetRpm = circumference - (rpmPct * 0.75 * circumference);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
      {/* Speedometer Gauge */}
      <div className="flex flex-col items-center justify-center p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-2.5 left-3 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Vehicle Speed
        </div>
        <div className="absolute top-2.5 right-3 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-semibold">
          {gearOrMode}
        </div>

        <div className="relative w-36 h-36 flex items-center justify-center my-1">
          <svg className="w-full h-full transform -rotate-135" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * 0.25}
              className="text-slate-800"
              strokeLinecap="round"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffsetSpeed}
              className="text-cyan-400 transition-all duration-300 ease-out"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black font-mono tracking-tighter text-white">
              {Math.round(speed)}
            </span>
            <span className="text-[11px] font-mono uppercase text-slate-400 -mt-1 font-semibold">
              {speedUnit}
            </span>
          </div>
        </div>

        <div className="flex justify-between w-full px-4 text-[10px] font-mono text-slate-500">
          <span>0</span>
          <span>{Math.round(maxSpeed / 2)}</span>
          <span>{maxSpeed}</span>
        </div>
      </div>

      {/* Tachometer / RPM / Power Gauge */}
      <div className="flex flex-col items-center justify-center p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-2.5 left-3 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          {rpmLabel}
        </div>
        <div className="absolute top-2.5 right-3 text-[10px] font-mono text-slate-400">
          {vehicleType === 'rcCar' ? 'Brushless KV' : 'Tachometer'}
        </div>

        <div className="relative w-36 h-36 flex items-center justify-center my-1">
          <svg className="w-full h-full transform -rotate-135" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * 0.25}
              className="text-slate-800"
              strokeLinecap="round"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffsetRpm}
              className={`transition-all duration-300 ease-out ${
                rpmPct > 0.85 ? 'text-rose-500' : rpmPct > 0.65 ? 'text-amber-400' : 'text-cyan-400'
              }`}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black font-mono tracking-tighter text-white">
              {vehicleType === 'rcCar' ? (rpm / 1000).toFixed(1) + 'k' : rpm.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono uppercase text-slate-400 -mt-1 font-semibold">
              RPM
            </span>
          </div>
        </div>

        <div className="flex justify-between w-full px-4 text-[10px] font-mono text-slate-500">
          <span>0</span>
          <span>{vehicleType === 'rcCar' ? '25k' : Math.round(maxRpm / 2000) * 1000}</span>
          <span>{vehicleType === 'rcCar' ? '50k' : maxRpm}</span>
        </div>
      </div>
    </div>
  );
};
