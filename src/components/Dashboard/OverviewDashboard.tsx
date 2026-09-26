import React, { useState, useEffect } from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import type { SidebarTab } from '../Sidebar/Sidebar';
import { TelemetryService } from '../../services/telemetryService';
import type { LiveTelemetrySnapshot, ElectricScooterTelemetry } from '../../types/telemetry';
import {
  Gauge,
  Thermometer,
  Battery,
  Fuel,
  AlertTriangle,
  Info,
  Calendar,
  Lightbulb,
  FileCheck,
  ChevronRight,
  Headphones,
  Zap,
  Shield,
  Wrench,
  Activity,
  ArrowRight,
  Cpu,
  Terminal,
  CheckCircle2,
  Radio,
  Sliders,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const DEFAULT_SCOOTER_DATA: ElectricScooterTelemetry = {
  speedKmh: 45,
  batteryVoltageV: 60.8,
  batteryTempC: 32.0,
  batterySocPct: 63.0,
  motorRpm: 3850,
  motorEfficiencyPct: 81.0,
  vibrationRmsG: 0.000,
  accelX: 0.012,
  accelY: 0.008,
  accelZ: 0.998,
  cellDeltaMv: 28.0,
  bmsTempC: 38.0,
  controllerTempC: 46.5,
  controllerEfficiencyPct: 81.0,
  brakeTempC: 30.0,
  brakeMaterialPct: 85.0,
  tyrePressurePsi: 32.2,
  dashboardResponsePct: 99.6,
  dashboardLatencyMs: 0.6,
  suspensionFirmnessPct: 74.0,
  mpuAvailable: true,
  thermocoupleAvailable: true,
  parts: [
    { name: 'Battery Pack', standard: 100.0, live: 63.0, diff: 37.0, status: 'CHECK SOON' },
    { name: 'PMSM Motor', standard: 100.0, live: 81.0, diff: 19.0, status: 'CHECK SOON' },
    { name: 'Smart BMS', standard: 100.0, live: 63.0, diff: 37.0, status: 'CHECK SOON' },
    { name: 'Motor Controller', standard: 100.0, live: 81.0, diff: 19.0, status: 'CHECK SOON' },
    { name: 'Brakes & Regen', standard: 100.0, live: 85.0, diff: 15.0, status: 'GOOD' },
    { name: 'Tyres (12-inch)', standard: 100.0, live: 92.0, diff: 8.0, status: 'GOOD' },
    { name: 'Smart Dashboard', standard: 100.0, live: 99.9, diff: 0.14, status: 'GOOD' },
    { name: 'Suspension', standard: 100.0, live: 75.2, diff: 24.76, status: 'CHECK SOON' }
  ]
};

interface OverviewDashboardProps {
  vehicleConfig: VehicleConfig;
  onNavigateTab: (tab: SidebarTab) => void;
  onOpenReportModal: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  vehicleConfig,
  onNavigateTab,
  onOpenReportModal
}) => {
  const isBike = vehicleConfig.type === 'motorcycle';
  const isScooter = vehicleConfig.type === 'scooter';
  const isRC = vehicleConfig.type === 'rc_car';

  const [telemetry, setTelemetry] = useState<LiveTelemetrySnapshot>(() => TelemetryService.getInstance().getCurrentTelemetry());
  const [countdown, setCountdown] = useState(10);
  const [showSerialMonitor, setShowSerialMonitor] = useState(false);

  // Subscribe to live telemetry service
  useEffect(() => {
    TelemetryService.getInstance().setVehicleType(
      isScooter ? 'scooter' : isBike ? 'bike' : isRC ? 'rcCar' : 'car'
    );
    const unsubscribe = TelemetryService.getInstance().subscribe((data) => {
      setTelemetry(data);
    });
    return () => unsubscribe();
  }, [vehicleConfig.type, isScooter, isBike, isRC]);

  // 10-second update interval timer matching #define UPDATE_INTERVAL 10000UL
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 10 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scooterData: ElectricScooterTelemetry = telemetry.scooter || DEFAULT_SCOOTER_DATA;

  const score = isScooter
    ? Math.round(
        scooterData.parts.reduce((acc: number, p) => acc + p.live, 0) / scooterData.parts.length
      )
    : vehicleConfig.healthIndex.overallScore;

  // Circular gauge circumference: radius 38 -> 2 * PI * 38 ≈ 238.76
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Tailored Telemetry per vehicle type
  const liveTelemetry = isRC
    ? [
        { label: 'Motor RPM', value: '8,420 rpm', icon: <Gauge className="w-4 h-4 text-stone-400" /> },
        { label: 'ESC Temp', value: '42 °C', icon: <Thermometer className="w-4 h-4 text-stone-400" /> },
        { label: 'LiPo Voltage', value: '11.8 V', icon: <Battery className="w-4 h-4 text-stone-400" /> },
        { label: 'Battery Level', value: '85 %', icon: <Zap className="w-4 h-4 text-stone-400" /> }
      ]
    : isScooter
    ? [
        { label: 'Battery Voltage', value: `${scooterData.batteryVoltageV.toFixed(1)} V`, icon: <Zap className="w-4 h-4 text-emerald-600" /> },
        { label: 'Motor RPM (A3144)', value: `${Math.round(scooterData.motorRpm).toLocaleString()} rpm`, icon: <Gauge className="w-4 h-4 text-orange-600" /> },
        { label: 'Battery SOC', value: `${scooterData.batterySocPct.toFixed(1)} %`, icon: <Battery className="w-4 h-4 text-amber-500" /> },
        { label: 'Controller Temp', value: `${scooterData.controllerTempC.toFixed(1)} °C`, icon: <Thermometer className="w-4 h-4 text-amber-500" /> },
        { label: 'Tyre Pressure', value: `${scooterData.tyrePressurePsi.toFixed(1)} PSI`, icon: <Sliders className="w-4 h-4 text-stone-500" /> },
        { label: 'Cell Delta', value: `${scooterData.cellDeltaMv.toFixed(1)} mV`, icon: <Zap className="w-4 h-4 text-amber-500" /> },
        { label: 'Vibration RMS', value: `${scooterData.vibrationRmsG.toFixed(3)} g`, icon: <Activity className="w-4 h-4 text-stone-500" /> },
        { label: 'Dashboard Latency', value: `${scooterData.dashboardLatencyMs.toFixed(1)} ms`, icon: <Radio className="w-4 h-4 text-emerald-600" /> }
      ]
    : isBike
    ? [
        { label: 'Engine RPM', value: '1,200 rpm', icon: <Gauge className="w-4 h-4 text-stone-400" /> },
        { label: 'Engine Temp', value: '82 °C', icon: <Thermometer className="w-4 h-4 text-stone-400" /> },
        { label: 'Battery Voltage', value: '14.1 V', icon: <Battery className="w-4 h-4 text-stone-400" /> },
        { label: 'Fuel Level', value: '74 %', icon: <Fuel className="w-4 h-4 text-stone-400" /> }
      ]
    : [
        { label: 'Engine RPM', value: '1,850 rpm', icon: <Gauge className="w-4 h-4 text-stone-400" /> },
        { label: 'Coolant Temp', value: '89 °C', icon: <Thermometer className="w-4 h-4 text-stone-400" /> },
        { label: 'Battery Voltage', value: '14.1 V', icon: <Battery className="w-4 h-4 text-stone-400" /> },
        { label: 'Fuel Level', value: '68 %', icon: <Fuel className="w-4 h-4 text-stone-400" /> }
      ];

  // Tailored Alerts
  const alerts = isRC
    ? [
        {
          id: 'a1',
          title: 'Motor thermal headroom advisory',
          time: 'Today, 10:15 AM',
          severity: 'Moderate',
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />
        },
        {
          id: 'a2',
          title: 'Steering trim alignment recommended',
          time: 'Yesterday, 04:20 PM',
          severity: 'Check soon',
          icon: <Activity className="w-4 h-4 text-orange-500" />
        }
      ]
    : isScooter
    ? [
        {
          id: 'a1',
          title: 'Battery Pack Live Health 63% (Diff: 37.0%)',
          time: 'ESP32 Stream Active',
          severity: 'Check soon',
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />
        },
        {
          id: 'a2',
          title: 'Smart BMS Cell Delta at 28.0 mV (Live 63%)',
          time: 'ESP32 Stream Active',
          severity: 'Check soon',
          icon: <Zap className="w-4 h-4 text-amber-500" />
        },
        {
          id: 'a3',
          title: 'Suspension Firmness 74.0% (Live 75.2%)',
          time: 'MPU6050: 0.000g',
          severity: 'Check soon',
          icon: <Activity className="w-4 h-4 text-orange-500" />
        }
      ]
    : isBike
    ? [
        {
          id: 'a1',
          title: 'Drive chain slack 36mm (spec: 30mm)',
          time: 'Today, 08:45 AM',
          severity: 'Check soon',
          icon: <Activity className="w-4 h-4 text-orange-500" />
        },
        {
          id: 'a2',
          title: 'Rear tyre cold pressure 31 PSI (low)',
          time: 'Yesterday, 06:10 PM',
          severity: 'Moderate',
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />
        }
      ]
    : [
        {
          id: 'a1',
          title: 'Battery voltage low on cold start',
          time: 'Today, 10:32 AM',
          severity: 'Moderate',
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />
        },
        {
          id: 'a2',
          title: 'Cylinder 1 misfire detected',
          time: 'Today, 09:15 AM',
          severity: 'Check soon',
          icon: <Activity className="w-4 h-4 text-orange-500" />
        }
      ];

  // Tailored Systems (8 components matching Arduino sketch)
  const subsystems = isRC
    ? [
        { name: 'Brushless Motor & Rotor', status: 'Good', isDue: false, icon: <Cpu className="w-4 h-4 text-stone-400" /> },
        { name: 'VXL-3s Electronic Speed Control', status: 'Good', isDue: false, icon: <Zap className="w-4 h-4 text-stone-400" /> },
        { name: '3S LiPo Battery Balance', status: 'Good', isDue: false, icon: <Battery className="w-4 h-4 text-stone-400" /> },
        { name: 'Steering Servo & Linkages', status: 'Good', isDue: false, icon: <Shield className="w-4 h-4 text-stone-400" /> },
        { name: 'Drivetrain Pinion Inspection', status: 'Due Soon', isDue: true, icon: <Wrench className="w-4 h-4 text-stone-400" /> }
      ]
    : isScooter
    ? scooterData.parts.map((p) => ({
        name: p.name,
        status: p.status,
        isDue: p.status !== 'GOOD',
        live: p.live,
        diff: p.diff,
        icon: p.name.includes('Battery') || p.name.includes('BMS') ? <Zap className="w-4 h-4 text-stone-400" /> :
              p.name.includes('Motor') || p.name.includes('Controller') ? <Cpu className="w-4 h-4 text-stone-400" /> :
              p.name.includes('Brakes') ? <Shield className="w-4 h-4 text-stone-400" /> :
              p.name.includes('Dashboard') ? <Gauge className="w-4 h-4 text-stone-400" /> :
              <Activity className="w-4 h-4 text-stone-400" />
      }))
    : isBike
    ? [
        { name: 'Engine & Gearbox Assembly', status: 'Good', isDue: false, icon: <Cpu className="w-4 h-4 text-stone-400" /> },
        { name: 'Electrical & Stator Output', status: 'Good', isDue: false, icon: <Zap className="w-4 h-4 text-stone-400" /> },
        { name: 'Cooling & Airflow Fins', status: 'Good', isDue: false, icon: <Thermometer className="w-4 h-4 text-stone-400" /> },
        { name: 'Dual-Channel ABS Brakes', status: 'Good', isDue: false, icon: <Shield className="w-4 h-4 text-stone-400" /> },
        { name: '520 Drive Chain Service', status: 'Due Soon', isDue: true, icon: <Wrench className="w-4 h-4 text-stone-400" /> }
      ]
    : [
        { name: 'Powertrain & Engine', status: 'Good', isDue: false, icon: <Cpu className="w-4 h-4 text-stone-400" /> },
        { name: 'Electrical System', status: 'Good', isDue: false, icon: <Zap className="w-4 h-4 text-stone-400" /> },
        { name: 'Cooling & Thermal', status: 'Good', isDue: false, icon: <Thermometer className="w-4 h-4 text-stone-400" /> },
        { name: 'Brakes & Chassis', status: 'Good', isDue: false, icon: <Shield className="w-4 h-4 text-stone-400" /> },
        { name: 'Service Schedule', status: 'Due Soon', isDue: true, icon: <Wrench className="w-4 h-4 text-stone-400" /> }
      ];

  // Tailored Service Due & Tips
  const serviceDistance = isRC ? '15 cycles' : isScooter ? '360 km' : isBike ? '1,200 km' : '2,350 km';
  const serviceDays = isRC ? '10 days' : isScooter ? '12 days' : isBike ? '25 days' : '45 days';
  const personalizedTip = isRC
    ? 'Always store LiPo batteries at 3.85V per cell nominal storage voltage when unused.'
    : isScooter
    ? 'Hero Electric Optima CX 5.0 tip: Maintain 32.2 PSI cold tyre pressure and complete full overnight AC charging to equalize cell delta (28.0 mV).'
    : isBike
    ? 'Keep drive chain tension within 25–35mm and lube every 500 km for optimal power transfer.'
    : 'Keep your coolant level between MIN and MAX for best engine performance.';

  // Simulated raw Serial Terminal Log matching user's Arduino code exactly
  const serialLogOutput = `==============================================
       MOTOMINDX STANDARD VALUES
       ELECTRIC OPTIMA CX 5.0
==============================================
Component                Standard
----------------------------------------------
Battery Pack               100.0%
PMSM Motor                 100.0%
Smart BMS                  100.0%
Motor Controller           100.0%
Brakes & Regen             100.0%
Tyres (12-inch)            100.0%
Smart Dashboard            100.0%
Suspension                 100.0%
----------------------------------------------
Reference health index: 100%
==============================================

Starting live monitoring...

========== LIVE DIAGNOSTICS ==========

----------------------------------------------
Battery Pack
----------------------------------------------
Standard Health: 100.0%
Live Health:     ${scooterData.parts[0]?.live.toFixed(1)}%
Difference:      ${scooterData.parts[0]?.diff.toFixed(2)}%
Status: ${scooterData.parts[0]?.status}
Voltage: ${scooterData.batteryVoltageV.toFixed(2)} V
Temperature (simulated): ${scooterData.batteryTempC.toFixed(1)} C
Charge (simulated): ${scooterData.batterySocPct.toFixed(1)}%

----------------------------------------------
PMSM Motor
----------------------------------------------
Standard Health: 100.0%
Live Health:     ${scooterData.parts[1]?.live.toFixed(1)}%
Difference:      ${scooterData.parts[1]?.diff.toFixed(2)}%
Status: ${scooterData.parts[1]?.status}
Motor RPM (A3144): ${scooterData.motorRpm.toFixed(1)}
Efficiency (simulated): ${scooterData.motorEfficiencyPct.toFixed(1)}%
Vibration RMS: ${scooterData.vibrationRmsG.toFixed(3)} g
Acceleration X: ${scooterData.accelX.toFixed(3)} g
Acceleration Y: ${scooterData.accelY.toFixed(3)} g
Acceleration Z: ${scooterData.accelZ.toFixed(3)} g

----------------------------------------------
Smart BMS
----------------------------------------------
Standard Health: 100.0%
Live Health:     ${scooterData.parts[2]?.live.toFixed(1)}%
Difference:      ${scooterData.parts[2]?.diff.toFixed(2)}%
Status: ${scooterData.parts[2]?.status}
Cell Delta (simulated): ${scooterData.cellDeltaMv.toFixed(1)} mV
BMS Temperature (simulated): ${scooterData.bmsTempC.toFixed(1)} C

----------------------------------------------
Motor Controller
----------------------------------------------
Standard Health: 100.0%
Live Health:     ${scooterData.parts[3]?.live.toFixed(1)}%
Difference:      ${scooterData.parts[3]?.diff.toFixed(2)}%
Status: ${scooterData.parts[3]?.status}
Controller Temperature: ${scooterData.controllerTempC.toFixed(2)} C
Efficiency (simulated): ${scooterData.controllerEfficiencyPct.toFixed(1)}%

----------------------------------------------
Brakes & Regen
----------------------------------------------
Standard Health: 100.0%
Live Health:     ${scooterData.parts[4]?.live.toFixed(1)}%
Difference:      ${scooterData.parts[4]?.diff.toFixed(2)}%
Status: ${scooterData.parts[4]?.status}
Brake Temperature (simulated): ${scooterData.brakeTempC.toFixed(1)} C
Brake Material (simulated): ${scooterData.brakeMaterialPct.toFixed(1)}%

----------------------------------------------
Tyres (12-inch)
----------------------------------------------
Standard Health: 100.0%
Live Health:     ${scooterData.parts[5]?.live.toFixed(1)}%
Difference:      ${scooterData.parts[5]?.diff.toFixed(2)}%
Status: ${scooterData.parts[5]?.status}
Tyre Pressure (simulated): ${scooterData.tyrePressurePsi.toFixed(1)} PSI

----------------------------------------------
Smart Dashboard
----------------------------------------------
Standard Health: 100.0%
Live Health:     ${scooterData.parts[6]?.live.toFixed(1)}%
Difference:      ${scooterData.parts[6]?.diff.toFixed(2)}%
Status: ${scooterData.parts[6]?.status}
Response (simulated): ${scooterData.dashboardResponsePct.toFixed(1)}%
Latency (simulated): ${scooterData.dashboardLatencyMs.toFixed(1)} ms

----------------------------------------------
Suspension
----------------------------------------------
Standard Health: 100.0%
Live Health:     ${scooterData.parts[7]?.live.toFixed(1)}%
Difference:      ${scooterData.parts[7]?.diff.toFixed(2)}%
Status: ${scooterData.parts[7]?.status}
Vibration RMS: ${scooterData.vibrationRmsG.toFixed(3)} g
Firmness (simulated): ${scooterData.suspensionFirmnessPct.toFixed(1)}%

==============================================
Next update in ${countdown} seconds...`;

  return (
    <div className="space-y-6">
      {/* ── CARD GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* ── CARD 1: VEHICLE HEALTH ── */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-stone-900 font-semibold text-base">Vehicle Health</h2>
              {isScooter && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-50 text-amber-800 border border-amber-200">
                  CHECK SOON
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              {/* Score ring + description */}
              <div className="flex flex-col items-start min-w-0">
                {/* Circular Gauge */}
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="7"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      fill="none"
                      stroke={score >= 85 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="7"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-stone-900">{score}%</span>
                  </div>
                </div>

                <div className={`mt-2.5 flex items-center gap-1 text-xs font-semibold ${score >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  <span>{isScooter ? 'CHECK SOON (<85%)' : vehicleConfig.healthIndex.statusText || 'Optimal Condition'}</span>
                  <Info className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-stone-500 leading-snug mt-1">
                  {isScooter
                    ? 'ESP32 Live Diagnostics: 5 parts flagged CHECK SOON, 3 GOOD. Reference Standard: 100%.'
                    : vehicleConfig.healthIndex.summary || 'Vehicle diagnostics and component integrity monitoring active.'}
                </p>
              </div>

              {/* Vehicle Vector Illustration with soft warm circular glow */}
              <div className="relative w-36 h-28 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#fdf5eb] scale-95" />

                <div className="relative z-10 w-full px-1">
                  {isScooter ? (
                    <svg viewBox="0 0 160 100" className="w-full h-auto text-stone-700 stroke-current" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="36" cy="70" r="16" strokeWidth="2.8" />
                      <circle cx="36" cy="70" r="6" strokeWidth="1.8" />
                      <circle cx="124" cy="70" r="16" strokeWidth="2.8" />
                      <circle cx="124" cy="70" r="6" strokeWidth="1.8" />
                      <path d="M36 70 L52 64 L96 64 L114 44 L118 30 L110 28" />
                      <path d="M52 64 L52 48 C52 44 60 40 76 40 L96 46 L96 64" strokeWidth="2.2" />
                      <path d="M42 42 C48 38 72 38 80 44" strokeWidth="3.2" stroke="#ea580c" />
                      <path d="M118 30 L124 70" strokeWidth="2.8" />
                      <path d="M106 28 L124 30" strokeWidth="3" />
                      <rect x="60" y="60" width="28" height="6" rx="2" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="1.5" />
                      <path d="M120 36 L134 40" strokeWidth="2" stroke="#06b6d4" />
                    </svg>
                  ) : isBike ? (
                    <svg viewBox="0 0 160 100" className="w-full h-auto text-stone-700 stroke-current" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="34" cy="68" r="18" strokeWidth="2.8" />
                      <circle cx="34" cy="68" r="7" strokeWidth="1.8" />
                      <circle cx="126" cy="68" r="18" strokeWidth="2.8" />
                      <circle cx="126" cy="68" r="7" strokeWidth="1.8" />
                      <path d="M34 68 L60 48 L92 48 L108 30 L118 30" />
                      <path d="M60 48 L76 70 L98 52 L126 68" />
                      <path d="M65 44 C72 35 90 35 98 44 Z" fill="#f8fafc" />
                      <path d="M46 44 C54 44 62 48 65 48" strokeWidth="3.5" />
                      <path d="M108 30 L126 68" strokeWidth="2.5" />
                      <path d="M104 26 L114 30" strokeWidth="3" />
                      <path d="M72 68 L50 74 L32 74" strokeWidth="2.5" />
                    </svg>
                  ) : isRC ? (
                    <svg viewBox="0 0 160 100" className="w-full h-auto text-stone-700 stroke-current" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="36" cy="68" r="17" strokeWidth="3.2" />
                      <circle cx="36" cy="68" r="7" strokeWidth="2" />
                      <circle cx="124" cy="68" r="17" strokeWidth="3.2" />
                      <circle cx="124" cy="68" r="7" strokeWidth="2" />
                      <path d="M22 60 L38 52 L54 52 L72 38 L106 38 L124 54 L138 60 L124 64 L36 64 Z" />
                      <path d="M72 38 L94 38 L106 50" />
                      <path d="M24 44 L36 44 L32 54" strokeWidth="2.8" />
                      <path d="M80 38 L84 18" strokeWidth="1.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 180 90" className="w-full h-auto text-stone-700 stroke-current" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="44" cy="62" r="14" strokeWidth="2.8" />
                      <circle cx="44" cy="62" r="6" strokeWidth="1.8" />
                      <circle cx="136" cy="62" r="14" strokeWidth="2.8" />
                      <circle cx="136" cy="62" r="6" strokeWidth="1.8" />
                      <path d="M16 56 C20 54 28 52 36 52 C40 46 48 46 54 52 L126 52 C132 46 140 46 144 52 C152 52 160 54 164 56 C166 60 164 64 160 64 L150 64" />
                      <path d="M130 64 L58 64" />
                      <path d="M30 64 L18 64 C14 64 12 60 16 56" />
                      <path d="M48 52 L68 32 L116 32 L142 52" />
                      <path d="M92 32 L92 52" />
                      <path d="M70 36 L114 36 L136 50 L56 50 Z" strokeWidth="1.5" />
                      <path d="M16 56 L24 57" strokeWidth="2.5" />
                      <path d="M162 56 L158 57" strokeWidth="2.5" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigateTab('diagnostics')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 transition-colors"
            >
              <span>See diagnostic details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {isScooter && (
              <span className="text-[11px] font-mono text-stone-400">
                Loop: 10s
              </span>
            )}
          </div>
        </div>

        {/* ── CARD 2: LIVE STATUS ── */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-stone-900 font-semibold text-base">Live Status</h2>
              {isScooter && (
                <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ESP32 Stream
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {liveTelemetry.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-stone-50/70 border border-stone-100"
                >
                  <div className="flex items-center gap-2 text-stone-600 font-medium truncate mr-1">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="font-bold text-stone-900 font-mono text-xs shrink-0">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigateTab('liveData')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 transition-colors"
            >
              <span>View all live telemetry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {isScooter && (
              <span className="text-[10px] font-mono text-stone-400">
                Update in {countdown}s
              </span>
            )}
          </div>
        </div>

        {/* ── CARD 3: RECENT ALERTS ── */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-stone-900 font-semibold text-base">Recent Alerts</h2>
              <span className="text-xs font-semibold text-orange-600">{alerts.length} Active</span>
            </div>

            <div className="mt-4 space-y-2.5">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl border border-stone-100 bg-white hover:bg-stone-50/60 transition-colors flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-orange-50/80 border border-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                      {alert.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-stone-800 truncate">
                        {alert.title}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {alert.time}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-orange-600 whitespace-nowrap shrink-0">
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => onNavigateTab('alerts')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 transition-colors"
            >
              <span>View all alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── CARD 4: SYSTEM HEALTH (8 Components) ── */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-stone-900 font-semibold text-base">System Health</h2>
              {isScooter && (
                <span className="text-[10px] font-mono text-stone-400 font-semibold">
                  8 Parts Standard: 100%
                </span>
              )}
            </div>

            <div className={`mt-4 space-y-2 ${isScooter ? 'max-h-[220px] overflow-y-auto pr-1' : ''}`}>
              {subsystems.map((sub, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1 px-1 rounded-lg hover:bg-stone-50"
                >
                  <div className="flex items-center gap-2 text-stone-600 font-medium truncate">
                    {sub.icon}
                    <span className="truncate">{sub.name}</span>
                    {isScooter && (sub as { live?: number }).live !== undefined && (
                      <span className="text-[11px] font-mono text-stone-400">
                        ({(sub as { live?: number }).live?.toFixed(1)}%)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        sub.status === 'GOOD' || sub.status === 'Good' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span
                      className={`font-semibold text-[11px] font-mono ${
                        sub.status === 'GOOD' || sub.status === 'Good' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenReportModal}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 transition-colors"
            >
              <span>View full report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {isScooter && (
              <span className="text-[10px] font-mono text-stone-400">
                Threshold: ≥85%
              </span>
            )}
          </div>
        </div>

        {/* ── CARD 5: QUICK ACTIONS ── */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <h2 className="text-stone-900 font-semibold text-base">Quick Actions</h2>

            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => onNavigateTab('diagnostics')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200/80 bg-white hover:border-orange-200 hover:bg-orange-50/20 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-600 group-hover:text-orange-600 transition-colors">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-900 group-hover:text-orange-600 transition-colors">
                      Run Diagnostics
                    </div>
                    <div className="text-[11px] text-stone-400">Check all 8 systems</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-orange-600 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('maintenance')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200/80 bg-white hover:border-orange-200 hover:bg-orange-50/20 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-600 group-hover:text-orange-600 transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-900 group-hover:text-orange-600 transition-colors">
                      Maintenance Schedule
                    </div>
                    <div className="text-[11px] text-stone-400">View upcoming services</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-orange-600 transition-colors" />
              </button>

              {isScooter && (
                <button
                  type="button"
                  onClick={() => setShowSerialMonitor(!showSerialMonitor)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200/80 bg-white hover:border-orange-200 hover:bg-orange-50/20 text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-600 group-hover:text-orange-600 transition-colors">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-stone-900 group-hover:text-orange-600 transition-colors">
                        ESP32 Serial Monitor
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {showSerialMonitor ? 'Hide Serial Console' : 'Show 115200 Baud Console'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-orange-600 transition-colors" />
                </button>
              )}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-center">
            <a
              href="#support"
              onClick={(e) => {
                e.preventDefault();
                alert('MotoMindX Technical Support: Available 24/7 at support@motomindx.io');
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Need Help? Contact Support</span>
            </a>
          </div>
        </div>

        {/* ── CARD 6: MAINTENANCE DUE & TIPS ── */}
        <div className="space-y-5">
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <Calendar className="w-4 h-4 text-stone-600" />
              <span>Maintenance Due</span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-stone-400 font-medium">Next service in</div>
                <div className="text-xl font-bold text-stone-900 tracking-tight mt-0.5">
                  {serviceDistance}
                </div>
                <div className="text-[11px] text-stone-500 font-medium">
                  or <span className="font-bold text-stone-800">{serviceDays}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab('maintenance')}
                className="px-3.5 py-1.5 rounded-xl border border-orange-200/90 bg-orange-50/50 hover:bg-orange-100/60 text-orange-700 text-xs font-semibold transition-colors"
              >
                View Schedule
              </button>
            </div>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Tips for You</span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed mt-2.5">
              {personalizedTip}
            </p>

            <div className="pt-3 mt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => onNavigateTab('diagnostics')}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 transition-colors"
              >
                <span>View more tips</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOTOMINDX ELECTRIC OPTIMA CX 5.0 LIVE ESP32 DIAGNOSTIC SUITE ── */}
      {isScooter && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-6">
          {/* Header Strip with Hardware Pinout & Interval */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono uppercase bg-orange-600 text-white shadow-xs">
                  MOTOMINDX
                </span>
                <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                  Electric Optima CX 5.0 — Live Diagnostics
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Hardware pipeline: ESP32 + MPU6050 (I2C 0x68) + A3144 Hall ISR (Pin 27) + MAX6675 Thermocouple
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Countdown badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-mono font-semibold text-orange-800">
                <RefreshCw className="w-3.5 h-3.5 text-orange-600 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Next update in {countdown}s</span>
              </div>

              {/* Toggle Serial Monitor */}
              <button
                type="button"
                onClick={() => setShowSerialMonitor(!showSerialMonitor)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all border ${
                  showSerialMonitor
                    ? 'bg-slate-900 text-emerald-400 border-slate-700 shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{showSerialMonitor ? 'Hide Serial Console' : 'Serial Monitor'}</span>
              </button>
            </div>
          </div>

          {/* Active Hardware Sensor Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-[#fbf9f4] border border-stone-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-mono block">ESP32 Main MCU</span>
                <span className="font-bold text-stone-800 font-mono text-xs">115200 Baud</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="p-2.5 rounded-xl bg-[#fbf9f4] border border-stone-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-mono block">MPU6050 (SDA 21 / SCL 22)</span>
                <span className="font-bold text-stone-800 font-mono text-xs">Vibration: {scooterData.vibrationRmsG.toFixed(3)}g</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            <div className="p-2.5 rounded-xl bg-[#fbf9f4] border border-stone-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-mono block">A3144 Hall ISR (Pin 27)</span>
                <span className="font-bold text-stone-800 font-mono text-xs">RPM: {Math.round(scooterData.motorRpm)}</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            <div className="p-2.5 rounded-xl bg-[#fbf9f4] border border-stone-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-mono block">MAX6675 (Pins 18/5/19)</span>
                <span className="font-bold text-stone-800 font-mono text-xs">Temp: {scooterData.controllerTempC.toFixed(1)}°C</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* 8 Components Standard vs Live Comparison Table */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Component Standard vs Live Health Comparison (8 Parts)</span>
              </h4>
              <span className="text-[11px] font-mono text-stone-500">
                Rule: Live ≥ 85% ? GOOD : CHECK SOON
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-stone-200 bg-[#fbf9f4]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-mono text-[11px] bg-stone-100/60">
                    <th className="py-2.5 px-3 font-semibold">Component</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Standard Health</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Live Health</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Difference</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                    <th className="py-2.5 px-3 font-semibold">Live Primary Telemetry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/70 font-mono">
                  {scooterData.parts.map((p, idx) => {
                    const isGood = p.status === 'GOOD';
                    const telemetryDetails =
                      idx === 0
                        ? `Voltage: ${scooterData.batteryVoltageV.toFixed(2)}V | Temp: ${scooterData.batteryTempC.toFixed(1)}°C | SOC: ${scooterData.batterySocPct.toFixed(1)}%`
                        : idx === 1
                        ? `Motor RPM: ${scooterData.motorRpm.toFixed(1)} | Efficiency: ${scooterData.motorEfficiencyPct.toFixed(1)}% | Vibration: ${scooterData.vibrationRmsG.toFixed(3)}g`
                        : idx === 2
                        ? `Cell Delta: ${scooterData.cellDeltaMv.toFixed(1)} mV | BMS Temp: ${scooterData.bmsTempC.toFixed(1)}°C`
                        : idx === 3
                        ? `Controller Temp: ${scooterData.controllerTempC.toFixed(2)}°C | Efficiency: ${scooterData.controllerEfficiencyPct.toFixed(1)}%`
                        : idx === 4
                        ? `Brake Temp: ${scooterData.brakeTempC.toFixed(1)}°C | Brake Material: ${scooterData.brakeMaterialPct.toFixed(1)}%`
                        : idx === 5
                        ? `Tyre Pressure: ${scooterData.tyrePressurePsi.toFixed(1)} PSI (12-inch Wheels)`
                        : idx === 6
                        ? `Response: ${scooterData.dashboardResponsePct.toFixed(1)}% | Latency: ${scooterData.dashboardLatencyMs.toFixed(1)} ms`
                        : `Vibration RMS: ${scooterData.vibrationRmsG.toFixed(3)}g | Firmness: ${scooterData.suspensionFirmnessPct.toFixed(1)}%`;

                    return (
                      <tr key={idx} className="hover:bg-white transition-colors">
                        <td className="py-2.5 px-3 font-bold text-stone-900">
                          {p.name}
                        </td>
                        <td className="py-2.5 px-3 text-center text-stone-600 font-semibold">
                          {p.standard.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`font-bold ${isGood ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {p.live.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center text-stone-700">
                          {p.diff.toFixed(2)}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isGood
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {isGood ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-amber-600" />}
                            <span>{p.status}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-stone-600 font-sans truncate max-w-[280px]">
                          {telemetryDetails}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 16 Live Diagnostic Sensor Readings Grid */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-stone-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-orange-600" />
              <span>Full Sensor Telemetry Channels (Live Fluctuation)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">1. Pack Voltage</span>
                <span className="text-base font-bold font-mono text-stone-900">{scooterData.batteryVoltageV.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">V</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">2. Battery Temp</span>
                <span className="text-base font-bold font-mono text-stone-900">{scooterData.batteryTempC.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">°C</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">3. Battery SOC</span>
                <span className="text-base font-bold font-mono text-amber-700">{scooterData.batterySocPct.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">%</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">4. Motor RPM</span>
                <span className="text-base font-bold font-mono text-stone-900">{Math.round(scooterData.motorRpm)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">rpm</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">5. Motor Eff</span>
                <span className="text-base font-bold font-mono text-amber-700">{scooterData.motorEfficiencyPct.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">%</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">6. Vibration RMS</span>
                <span className="text-base font-bold font-mono text-stone-900">{scooterData.vibrationRmsG.toFixed(3)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">g</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">7. Cell Delta</span>
                <span className="text-base font-bold font-mono text-amber-700">{scooterData.cellDeltaMv.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">mV</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">8. BMS Temp</span>
                <span className="text-base font-bold font-mono text-stone-900">{scooterData.bmsTempC.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">°C</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">9. Controller Temp</span>
                <span className="text-base font-bold font-mono text-stone-900">{scooterData.controllerTempC.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">°C</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">10. Controller Eff</span>
                <span className="text-base font-bold font-mono text-amber-700">{scooterData.controllerEfficiencyPct.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">%</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">11. Brake Temp</span>
                <span className="text-base font-bold font-mono text-stone-900">{scooterData.brakeTempC.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">°C</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">12. Brake Material</span>
                <span className="text-base font-bold font-mono text-emerald-700">{scooterData.brakeMaterialPct.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">%</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">13. Tyre Pressure</span>
                <span className="text-base font-bold font-mono text-emerald-700">{scooterData.tyrePressurePsi.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">PSI</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">14. Dash Response</span>
                <span className="text-base font-bold font-mono text-emerald-700">{scooterData.dashboardResponsePct.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">%</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">15. Dash Latency</span>
                <span className="text-base font-bold font-mono text-emerald-700">{scooterData.dashboardLatencyMs.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">ms</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f4] border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 font-medium block truncate">16. Suspension Firm</span>
                <span className="text-base font-bold font-mono text-amber-700">{scooterData.suspensionFirmnessPct.toFixed(1)}</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">%</span>
              </div>
            </div>
          </div>

          {/* Embedded Real-Time ESP32 Serial Monitor Console */}
          {showSerialMonitor && (
            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400 bg-slate-950 px-4 py-2 rounded-t-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-white font-bold">ESP32 Serial Monitor (COM / 115200 Baud)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400">STATUS: STREAMING</span>
                  <span className="text-stone-500">10s UPDATE INTERVAL</span>
                </div>
              </div>

              <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-[11px] leading-relaxed rounded-b-xl border-x border-b border-slate-800 max-h-80 overflow-y-auto whitespace-pre selection:bg-emerald-500/20 selection:text-white shadow-inner">
                {serialLogOutput}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
