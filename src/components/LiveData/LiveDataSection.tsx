import React, { useState } from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import { useTelemetry } from '../../hooks/useTelemetry';
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
  const { car, bike, rcCar, history, isLiveHardware } = useTelemetry(vehicleConfig.type);
  const [selectedSensorId, setSelectedSensorId] = useState<string>('rpm');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Build dynamic sensor list based on active vehicle telemetry
  const isRC = vehicleConfig.type === 'rc_car';
  const isBike = vehicleConfig.type === 'motorcycle';
  const isScooter = vehicleConfig.type === 'scooter';

  const dynamicSensors = isRC
    ? [
        { id: 'rpm', name: 'Motor RPM', value: rcCar?.motorRpm ?? 0, unit: 'RPM', category: 'powertrain' },
        { id: 'speed', name: 'Vehicle Speed', value: rcCar?.speedKmh ?? 0, unit: 'km/h', category: 'powertrain' },
        { id: 'motor_temp', name: 'Motor Temp', value: rcCar?.motorTempC ?? 0, unit: '°C', category: 'thermal' },
        { id: 'esc_temp', name: 'ESC Inverter Temp', value: rcCar?.escTempC ?? 0, unit: '°C', category: 'thermal' },
        { id: 'voltage', name: 'LiPo Pack Voltage', value: rcCar?.packVoltageV.toFixed(2) ?? '0.00', unit: 'V', category: 'electrical' },
        { id: 'current', name: 'Current Draw', value: rcCar?.currentDrawAmps.toFixed(1) ?? '0.0', unit: 'A', category: 'electrical' }
      ]
    : isScooter
    ? [
        { id: 'speed', name: 'Scooter Speed', value: bike?.speedKmh ?? 0, unit: 'km/h', category: 'powertrain' },
        { id: 'rpm', name: 'Motor Speed', value: bike?.engineRpm ?? 0, unit: 'RPM', category: 'powertrain' },
        { id: 'temp', name: 'Battery Temp', value: bike?.engineTempC ?? 0, unit: '°C', category: 'thermal' },
        { id: 'voltage', name: 'Pack Voltage', value: bike?.batteryVoltageV.toFixed(1) ?? '0.0', unit: 'V', category: 'electrical' },
        { id: 'throttle', name: 'Throttle Input', value: bike?.throttlePositionPct ?? 0, unit: '%', category: 'powertrain' }
      ]
    : isBike
    ? [
        { id: 'rpm', name: 'Engine RPM', value: bike?.engineRpm ?? 0, unit: 'RPM', category: 'powertrain' },
        { id: 'speed', name: 'Road Speed', value: bike?.speedKmh ?? 0, unit: 'km/h', category: 'powertrain' },
        { id: 'temp', name: 'Engine Temp', value: bike?.engineTempC ?? 0, unit: '°C', category: 'thermal' },
        { id: 'voltage', name: 'Battery Voltage', value: bike?.batteryVoltageV.toFixed(1) ?? '0.0', unit: 'V', category: 'electrical' },
        { id: 'lean', name: 'Lean Angle', value: bike?.leanAngleDeg ?? 0, unit: '°', category: 'powertrain' },
        { id: 'fuel', name: 'Fuel Level', value: bike?.fuelLevelPct ?? 0, unit: '%', category: 'fuel' }
      ]
    : [
        { id: 'rpm', name: 'Engine RPM', value: car?.engineRpm ?? 0, unit: 'RPM', category: 'powertrain' },
        { id: 'speed', name: 'Vehicle Speed', value: car?.speedKmh ?? 0, unit: 'km/h', category: 'powertrain' },
        { id: 'temp', name: 'Coolant Temp', value: car?.coolantTempC ?? 0, unit: '°C', category: 'thermal' },
        { id: 'voltage', name: 'Battery Voltage', value: car?.batteryVoltageV.toFixed(1) ?? '0.0', unit: 'V', category: 'electrical' },
        { id: 'load', name: 'Engine Load', value: car?.engineLoadPct ?? 0, unit: '%', category: 'powertrain' },
        { id: 'fuel', name: 'Fuel Level', value: car?.fuelLevelPct ?? 0, unit: '%', category: 'fuel' },
        { id: 'oil', name: 'Oil Pressure', value: car?.oilPressureKpa ?? 0, unit: 'kPa', category: 'powertrain' }
      ];

  const selectedSensor = dynamicSensors.find((s) => s.id === selectedSensorId) || dynamicSensors[0];

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
  const filteredSensors = dynamicSensors.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  // Dynamic history points from actual incoming telemetry
  const trendPoints = history.length > 0
    ? history.map((pt) => {
        if (selectedSensor.id === 'rpm') return pt.rpm;
        if (selectedSensor.id === 'speed') return pt.speed;
        if (selectedSensor.id === 'temp' || selectedSensor.id === 'motor_temp' || selectedSensor.id === 'esc_temp') return pt.temp;
        if (selectedSensor.id === 'voltage') return pt.voltage;
        return pt.loadOrCurrent;
      })
    : [0, 0, 0, 0, 0, 0, 0, 0];

  const minVal = Math.min(...trendPoints);
  const maxVal = Math.max(...trendPoints);
  const range = maxVal - minVal || 1;

  // SVG coordinates for clean dynamic polyline
  const svgWidth = 460;
  const svgHeight = 120;
  const pointsString = trendPoints
    .map((val, idx) => {
      const x = (idx / Math.max(1, trendPoints.length - 1)) * (svgWidth - 20) + 10;
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
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Live Telemetry</span>
            {isLiveHardware && (
              <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded-md font-mono font-bold">
                ESP32 SENSORS
              </span>
            )}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {isLiveHardware
              ? 'Real hardware telemetry streaming live from ESP32 transceiver'
              : 'Standby mode • Waiting for hardware sensor packets'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isLiveHardware
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-stone-100 text-stone-600 border border-stone-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isLiveHardware ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
            }`} />
            {isLiveHardware ? 'Live Stream Active' : 'Standby'}
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
                  {sensor.name}
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
                  {selectedSensor.name} Stream
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
                  {selectedSensor.value} {selectedSensor.unit}
                </span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Average</span>
                <span className="font-semibold text-stone-700 font-mono">
                  {(trendPoints.reduce((a, b) => a + b, 0) / Math.max(1, trendPoints.length)).toFixed(1)} {selectedSensor.unit}
                </span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Peak</span>
                <span className="font-semibold text-stone-700 font-mono">
                  {maxVal.toFixed(1)} {selectedSensor.unit}
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
                    cy={svgHeight - 15 - (((trendPoints[trendPoints.length - 1] ?? 0) - minVal) / range) * (svgHeight - 35)}
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
