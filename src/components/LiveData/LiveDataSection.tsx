import React, { useState } from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import {
  Activity,
  Thermometer,
  Zap,
  Cpu,
  Radio,
  Sliders,
  TrendingUp
} from 'lucide-react';

interface LiveDataSectionProps {
  vehicleConfig: VehicleConfig;
}

export const LiveDataSection: React.FC<LiveDataSectionProps> = ({ vehicleConfig }) => {
  const [activeSparkMetric, setActiveSparkMetric] = useState<string>(
    vehicleConfig.type === 'rc_car' ? 'Motor RPM' : 'Engine RPM'
  );

  const getSensorIcon = (cat: string) => {
    switch (cat) {
      case 'thermal':
        return <Thermometer className="w-3.5 h-3.5 text-sky-600" />;
      case 'electrical':
        return <Zap className="w-3.5 h-3.5 text-amber-600" />;
      case 'telemetry':
        return <Radio className="w-3.5 h-3.5 text-emerald-600" />;
      case 'chassis':
        return <Sliders className="w-3.5 h-3.5 text-stone-600" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-orange-600" />;
    }
  };

  // Generate realistic sparkline wave based on vehicle type
  const sparkPoints = [24, 28, 35, 42, 38, 48, 55, 62, 58, 64, 70, 68, 74, 82, 79, 85];
  const maxSpark = 100;
  const minSpark = 0;
  const polyPoints = sparkPoints
    .map((val, idx) => {
      const x = (idx / (sparkPoints.length - 1)) * 360;
      const y = 60 - ((val - minSpark) / (maxSpark - minSpark)) * 48;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-warm-sm space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-600" />
          <div>
            <h2 className="text-sm font-bold text-stone-900 uppercase font-mono tracking-wider">
              Live Sensor Telemetry
            </h2>
            <div className="text-[11px] text-stone-500 font-medium">
              Real-time parameter stream from {vehicleConfig.hardwareLink.protocol}
            </div>
          </div>
        </div>

        {/* Demo Data Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-mono font-bold shadow-warm-sm">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span>DEMO DATA STREAM</span>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {vehicleConfig.sensors.map((sensor) => (
          <div
            key={sensor.id}
            onClick={() => setActiveSparkMetric(sensor.label)}
            className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
              activeSparkMetric === sensor.label
                ? 'bg-orange-50/70 border-orange-300 ring-2 ring-orange-200/50 shadow-warm-sm'
                : 'bg-[#fbf9f4] hover:bg-stone-50 border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-stone-600 truncate mr-1">
                {sensor.label}
              </span>
              <span className="p-1 rounded-lg bg-white border border-stone-200/80 shadow-warm-sm">
                {getSensorIcon(sensor.category)}
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-stone-900 tracking-tight">
                {sensor.value}
              </span>
              {sensor.unit && (
                <span className="text-xs font-mono font-semibold text-stone-500">
                  {sensor.unit}
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center justify-between text-[10px] text-stone-500 font-mono">
              <span>Nominal: {sensor.nominalRange[0]}–{sensor.nominalRange[1]}</span>
              <span className="text-emerald-700 font-bold">OK</span>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Sparkline Graph Card */}
      <div className="p-4 rounded-xl bg-[#fbf9f4] border border-stone-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 font-mono">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span>Telemetry History — {activeSparkMetric} (Last 60 Seconds)</span>
          </div>
          <span className="text-[10px] font-mono text-stone-400">1.2 Hz Sampling</span>
        </div>

        {/* SVG Sparkline */}
        <div className="h-16 w-full pt-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 360 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id="warmTelemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ea580c" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <polyline
              points={`0,60 ${polyPoints} 360,60`}
              fill="url(#warmTelemGrad)"
            />
            <polyline
              points={polyPoints}
              fill="none"
              stroke="#ea580c"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono pt-1 border-t border-stone-200">
          <span>T-60s</span>
          <span>Buffer Active</span>
          <span>Live (Now)</span>
        </div>
      </div>
    </div>
  );
};
