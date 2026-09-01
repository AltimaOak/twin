import React, { useState } from 'react';
import type { VehicleType } from '../../types/vehicle';
import type { CarTelemetry, BikeTelemetry, RcCarTelemetry, TelemetryHistoryPoint } from '../../types/telemetry';
import { GaugeCluster } from './GaugeCluster';
import {
  Activity,
  Thermometer,
  Zap,
  Fuel,
  Gauge,
  Cpu,
  Radio,
  Sliders,
  TrendingUp,
  Flame
} from 'lucide-react';

interface LiveDataPanelProps {
  vehicleType: VehicleType;
  car?: CarTelemetry;
  bike?: BikeTelemetry;
  rcCar?: RcCarTelemetry;
  history: TelemetryHistoryPoint[];
}

export const LiveDataPanel: React.FC<LiveDataPanelProps> = ({
  vehicleType,
  car,
  bike,
  rcCar,
  history
}) => {
  const [activeChartMetric, setActiveChartMetric] = useState<'speed' | 'rpm' | 'temp' | 'load'>('speed');

  const renderMetricCard = (
    title: string,
    value: string | number,
    unit: string,
    icon: React.ReactNode,
    statusText: string = 'Normal',
    isWarning: boolean = false,
    subtitle?: string
  ) => (
    <div className="p-3.5 bg-slate-900/80 border border-slate-800/90 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 truncate">{title}</span>
        <span className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300">{icon}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-xl font-bold font-mono text-white tracking-tight">
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[11px]">
        <span className={isWarning ? 'text-amber-400 font-semibold' : 'text-slate-500'}>
          {statusText}
        </span>
        {subtitle && <span className="text-slate-500 font-mono">{subtitle}</span>}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Top Banner with Demo Data Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold tracking-tight text-white uppercase font-mono">
            {vehicleType === 'rcCar' ? 'RC Live Telemetry Stream' : 'OBD-II Live Telemetry Stream'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-700/50 text-[11px] font-mono text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Demo Data Stream (Active)</span>
          </div>
        </div>
      </div>

      {/* Primary Gauges */}
      <GaugeCluster vehicleType={vehicleType} car={car} bike={bike} rcCar={rcCar} />

      {/* Specific Telemetry Grid */}
      {vehicleType === 'car' && car && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {renderMetricCard('Coolant Temp', car.coolantTempC, '°C', <Thermometer className="w-4 h-4 text-cyan-400" />, 'Optimal range (80–98°C)')}
          {renderMetricCard('Battery Voltage', car.batteryVoltageV, 'V', <Zap className="w-4 h-4 text-amber-400" />, 'Cold crank was 10.2V', true, '13.9V alt')}
          {renderMetricCard('Engine Load', `${car.engineLoadPct}%`, '', <Cpu className="w-4 h-4 text-emerald-400" />, 'Cruising load')}
          {renderMetricCard('Fuel Tank Level', `${car.fuelLevelPct}%`, '', <Fuel className="w-4 h-4 text-cyan-400" />, 'Approx 380 km left')}
          {renderMetricCard('Fuel Efficiency', car.fuelEfficiencyKmpl, 'km/L', <TrendingUp className="w-4 h-4 text-emerald-400" />, 'Recent trip avg')}
          {renderMetricCard('Oil Pressure', car.oilPressureKpa, 'kPa', <Gauge className="w-4 h-4 text-slate-300" />, 'Nominal 340 kPa')}
          {renderMetricCard('Intake Air Temp', car.intakeAirTempC, '°C', <Thermometer className="w-4 h-4 text-slate-400" />, 'Ambient +4°C')}
          {renderMetricCard('Tire Pressures', `${car.tirePressurePsi.frontLeft} PSI`, '', <Sliders className="w-4 h-4 text-cyan-400" />, 'All 4 tires balanced')}
        </div>
      )}

      {vehicleType === 'bike' && bike && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {renderMetricCard('Engine Temp', bike.engineTempC, '°C', <Thermometer className="w-4 h-4 text-cyan-400" />, 'Optimal (75–102°C)')}
          {renderMetricCard('Battery Voltage', bike.batteryVoltageV, 'V', <Zap className="w-4 h-4 text-emerald-400" />, 'Stator charging 14.1V')}
          {renderMetricCard('Throttle Position', `${bike.throttlePositionPct}%`, '', <Gauge className="w-4 h-4 text-cyan-400" />, 'Direct sensor')}
          {renderMetricCard('Fuel Level', `${bike.fuelLevelPct}%`, '', <Fuel className="w-4 h-4 text-cyan-400" />, '245 km range')}
          {renderMetricCard('Chain Slack', `${bike.chainSlackMm} mm`, '', <Sliders className="w-4 h-4 text-amber-400" />, 'Slight slack (target: 30)', true)}
          {renderMetricCard('Lean Angle', `${bike.leanAngleDeg}°`, '', <Activity className="w-4 h-4 text-emerald-400" />, 'IMU active')}
          {renderMetricCard('Front Tyre', `${bike.tirePressurePsi.front} PSI`, '', <Sliders className="w-4 h-4 text-slate-300" />, 'Cold pressure OK')}
          {renderMetricCard('Rear Tyre', `${bike.tirePressurePsi.rear} PSI`, '', <Sliders className="w-4 h-4 text-slate-300" />, 'Cold pressure OK')}
        </div>
      )}

      {vehicleType === 'rcCar' && rcCar && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {renderMetricCard('Motor Temp', rcCar.motorTempC, '°C', <Flame className="w-4 h-4 text-cyan-400" />, 'Safe limit < 85°C')}
          {renderMetricCard('ESC Temp', rcCar.escTempC, '°C', <Thermometer className="w-4 h-4 text-cyan-400" />, 'Fins fan active')}
          {renderMetricCard('3S LiPo Voltage', rcCar.packVoltageV, 'V', <Zap className="w-4 h-4 text-emerald-400" />, `Cell: ${rcCar.cellVoltagesV[0]}V (Balanced)`)}
          {renderMetricCard('Current Draw', rcCar.currentDrawAmps, 'A', <Zap className="w-4 h-4 text-amber-400" />, `Power: ${rcCar.powerWatts} W`)}
          {renderMetricCard('Capacity Left', `${rcCar.batteryCapacityMahRemaining} mAh`, '', <Fuel className="w-4 h-4 text-cyan-400" />, '68% capacity left')}
          {renderMetricCard('RF Link RSSI', `${rcCar.signalRssiDbm} dBm`, '', <Radio className="w-4 h-4 text-emerald-400" />, '915MHz LoRa Strong')}
          {renderMetricCard('Steering Trim', `${rcCar.throttleTrimPct}%`, '', <Sliders className="w-4 h-4 text-slate-400" />, 'Centered 0°')}
          {renderMetricCard('Top Run Speed', `${rcCar.speedKmh} km/h`, '', <Gauge className="w-4 h-4 text-cyan-400" />, '4x4 telemetry')}
        </div>
      )}

      {/* Real-time Trend Sparkline Chart */}
      <div className="p-4 bg-slate-900/80 border border-slate-800/90 rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
              Temporal Sensor Trends (Last 60 Seconds)
            </h3>
            <p className="text-[11px] text-slate-400">
              Live buffered telemetry stream from MotoMindX hardware
            </p>
          </div>

          {/* Metric Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {(['speed', 'rpm', 'temp', 'load'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveChartMetric(m)}
                className={`px-2.5 py-1 rounded capitalize font-medium transition-all ${
                  activeChartMetric === m
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m === 'load' && vehicleType === 'rcCar' ? 'Current (A)' : m}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Sparkline / Temporal Area Graph */}
        <div className="h-32 w-full pt-2 flex items-end">
          {history.length > 1 ? (
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="telemetryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00c3ff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00c3ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="25" x2="400" y2="25" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="0" y1="50" x2="400" y2="50" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="0" y1="75" x2="400" y2="75" stroke="#1e293b" strokeDasharray="3,3" />

              {(() => {
                const values = history.map(h => {
                  if (activeChartMetric === 'speed') return h.speed;
                  if (activeChartMetric === 'rpm') return h.rpm;
                  if (activeChartMetric === 'temp') return h.temp;
                  return h.loadOrCurrent;
                });
                const minVal = Math.min(...values);
                const maxVal = Math.max(...values);
                const range = (maxVal - minVal) || 1;

                const points = values.map((val, idx) => {
                  const x = (idx / (values.length - 1)) * 400;
                  const y = 90 - ((val - minVal) / range) * 75;
                  return `${x},${y}`;
                });

                const polyPoints = `0,100 ${points.join(' ')} 400,100`;

                return (
                  <>
                    <polygon points={polyPoints} fill="url(#telemetryGrad)" />
                    <polyline
                      points={points.join(' ')}
                      fill="none"
                      stroke="#00c3ff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {points.length > 0 && (() => {
                      const lastPt = points[points.length - 1].split(',');
                      return (
                        <circle
                          cx={lastPt[0]}
                          cy={lastPt[1]}
                          r="4"
                          className="fill-cyan-400 stroke-slate-900 stroke-2"
                        />
                      );
                    })()}
                  </>
                );
              })()}
            </svg>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-mono">
              Buffering live telemetry packets...
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-800/80">
          <span>T-60s</span>
          <span>Sample Rate: 1.2 Hz</span>
          <span>Now (Live)</span>
        </div>
      </div>
    </div>
  );
};
