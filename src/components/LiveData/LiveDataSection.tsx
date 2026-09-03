import React, { useState } from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import {
  Gauge,
  Thermometer,
  Zap,
  Fuel
} from 'lucide-react';

interface LiveDataSectionProps {
  vehicleConfig: VehicleConfig;
}

export const LiveDataSection: React.FC<LiveDataSectionProps> = ({ vehicleConfig }) => {
  const [selectedSensorId, setSelectedSensorId] = useState<string>(
    vehicleConfig.sensors[0]?.id || 'rpm'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const selectedSensor =
    vehicleConfig.sensors.find((s) => s.id === selectedSensorId) ||
    vehicleConfig.sensors[0];

  const getSensorIcon = (cat: string) => {
    switch (cat) {
      case 'thermal':
        return <Thermometer className="w-4 h-4 text-orange-600" />;
      case 'electrical':
        return <Zap className="w-4 h-4 text-orange-600" />;
      case 'fuel':
        return <Fuel className="w-4 h-4 text-orange-600" />;
      default:
        return <Gauge className="w-4 h-4 text-orange-600" />;
    }
  };

  // Filter sensors by category
  const filteredSensors = vehicleConfig.sensors.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  // Clean, realistic 16-point trend data based on selected sensor
  const currentVal = parseFloat(String(selectedSensor?.value).replace(/,/g, '')) || 50;
  const unit = selectedSensor?.unit || '';

  // Generate 12 historical points oscillating smoothly around currentVal
  const trendPoints = [
    currentVal * 0.94,
    currentVal * 0.96,
    currentVal * 0.95,
    currentVal * 0.98,
    currentVal * 0.97,
    currentVal * 1.01,
    currentVal * 0.99,
    currentVal * 1.02,
    currentVal * 1.01,
    currentVal * 0.99,
    currentVal * 1.01,
    currentVal
  ];

  const minVal = Math.min(...trendPoints) * 0.98;
  const maxVal = Math.max(...trendPoints) * 1.02;
  const range = maxVal - minVal || 1;

  // SVG coordinates for clean polyline
  const svgWidth = 460;
  const svgHeight = 120;
  const pointsString = trendPoints
    .map((val, idx) => {
      const x = (idx / (trendPoints.length - 1)) * (svgWidth - 20) + 10;
      const y = svgHeight - 15 - ((val - minVal) / range) * (svgHeight - 35);
      return `${x},${y}`;
    })
    .join(' ');

  const categories = [
    { id: 'all', label: 'All Sensors' },
    { id: 'powertrain', label: 'Powertrain' },
    { id: 'thermal', label: 'Thermal' },
    { id: 'electrical', label: 'Electrical' }
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Live Telemetry
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time sensor parameters streamed from {vehicleConfig.hardwareLink.protocol}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            50 Hz Stream Active
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
              selectedCategory === c.id
                ? 'bg-orange-50 text-orange-700 font-semibold border border-orange-200'
                : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200/90'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredSensors.map((sensor) => {
          const isSelected = selectedSensorId === sensor.id;
          return (
            <button
              key={sensor.id}
              type="button"
              onClick={() => setSelectedSensorId(sensor.id)}
              className={`p-3.5 rounded-2xl text-left transition-all border ${
                isSelected
                  ? 'bg-orange-50/50 border-orange-300 shadow-sm'
                  : 'bg-white hover:bg-stone-50/70 border-stone-200/90 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-xs font-medium text-stone-600 truncate">
                  {sensor.label}
                </span>
                <div className="p-1 rounded-lg bg-orange-50/80">
                  {getSensorIcon(sensor.category)}
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-stone-900 tracking-tight">
                  {sensor.value}
                </span>
                <span className="text-xs font-medium text-stone-400">
                  {sensor.unit}
                </span>
              </div>

              <div className="text-[10px] text-stone-400 mt-1 flex items-center justify-between">
                <span>Status: Normal</span>
                <span className="text-orange-600 font-semibold">
                  {isSelected ? 'Selected' : 'View trend'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Sensor Trend View */}
      {selectedSensor && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-50">
                {getSensorIcon(selectedSensor.category)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  {selectedSensor.label} Stream
                </h3>
                <p className="text-[11px] text-stone-400">
                  Live readings over the last 60 seconds
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-stone-400 text-[11px] block">Current</span>
                <span className="font-bold text-stone-900 font-mono">
                  {selectedSensor.value} {unit}
                </span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Average</span>
                <span className="font-semibold text-stone-700 font-mono">
                  {(currentVal * 0.99).toFixed(1)} {unit}
                </span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Peak</span>
                <span className="font-semibold text-stone-700 font-mono">
                  {(currentVal * 1.02).toFixed(1)} {unit}
                </span>
              </div>
            </div>
          </div>

          {/* Clean Line Chart */}
          <div className="pt-2">
            <div className="w-full h-32 bg-stone-50/60 rounded-xl border border-stone-100 flex items-center justify-center p-2">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                {/* Horizontal reference lines */}
                <line x1="10" y1="20" x2={svgWidth - 10} y2="20" stroke="#e7e5e4" strokeDasharray="3 3" />
                <line x1="10" y1="65" x2={svgWidth - 10} y2="65" stroke="#e7e5e4" strokeDasharray="3 3" />
                <line x1="10" y1="105" x2={svgWidth - 10} y2="105" stroke="#e7e5e4" strokeDasharray="3 3" />

                {/* Line Path */}
                <polyline
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                />

                {/* Last point indicator */}
                {trendPoints.length > 0 && (
                  <circle
                    cx={svgWidth - 10}
                    cy={svgHeight - 15 - ((currentVal - minVal) / range) * (svgHeight - 35)}
                    r="4"
                    fill="#ea580c"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                )}
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 px-1">
              <span>60s ago</span>
              <span>30s ago</span>
              <span>Just now</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
