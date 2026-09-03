import React from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import type { SidebarTab } from '../Sidebar/Sidebar';
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
  FileText,
  ChevronRight,
  Headphones,
  Zap,
  Shield,
  Wrench,
  Activity,
  ArrowRight,
  Cpu
} from 'lucide-react';

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
  const isRC = vehicleConfig.type === 'rc_car';

  const score = vehicleConfig.healthIndex.overallScore;
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

  // Tailored Systems
  const subsystems = isRC
    ? [
        { name: 'Brushless Motor & Rotor', status: 'Good', isDue: false, icon: <Cpu className="w-4 h-4 text-stone-400" /> },
        { name: 'VXL-3s Electronic Speed Control', status: 'Good', isDue: false, icon: <Zap className="w-4 h-4 text-stone-400" /> },
        { name: '3S LiPo Battery Balance', status: 'Good', isDue: false, icon: <Battery className="w-4 h-4 text-stone-400" /> },
        { name: 'Steering Servo & Linkages', status: 'Good', isDue: false, icon: <Shield className="w-4 h-4 text-stone-400" /> },
        { name: 'Drivetrain Pinion Inspection', status: 'Due Soon', isDue: true, icon: <Wrench className="w-4 h-4 text-stone-400" /> }
      ]
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
  const serviceDistance = isRC ? '15 cycles' : isBike ? '1,200 km' : '2,350 km';
  const serviceDays = isRC ? '10 days' : isBike ? '25 days' : '45 days';
  const personalizedTip = isRC
    ? 'Always store LiPo batteries at 3.85V per cell nominal storage voltage when unused.'
    : isBike
    ? 'Keep drive chain tension within 25–35mm and lube every 500 km for optimal power transfer.'
    : 'Keep your coolant level between MIN and MAX for best engine performance.';

  return (
    <div className="space-y-6">
      {/* 6-Card Grid: 3 columns x 2 rows on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* ── CARD 1: VEHICLE HEALTH ── */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <h2 className="text-stone-900 font-semibold text-base">Vehicle Health</h2>

            <div className="mt-4 flex items-center justify-between gap-4">
              {/* Score ring + description */}
              <div className="flex flex-col items-start min-w-0">
                {/* Circular Gauge */}
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                    {/* Background Ring */}
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="7"
                    />
                    {/* Active Green Ring */}
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="7"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-stone-900">{score}</span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <span>Good Condition</span>
                  <Info className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <p className="text-[11px] text-stone-500 leading-snug mt-1">
                  Your vehicle is running smoothly. No immediate action required.
                </p>
              </div>

              {/* Vehicle Vector Illustration with soft warm circular glow */}
              <div className="relative w-36 h-28 flex items-center justify-center shrink-0">
                {/* Soft backdrop circle */}
                <div className="absolute inset-0 rounded-full bg-[#fdf5eb] scale-95" />

                {/* Vector illustration matching category */}
                <div className="relative z-10 w-full px-1">
                  {isBike ? (
                    /* Motorcycle Outline SVG */
                    <svg viewBox="0 0 160 100" className="w-full h-auto text-stone-700 stroke-current" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {/* Rear Wheel */}
                      <circle cx="34" cy="68" r="18" strokeWidth="2.8" />
                      <circle cx="34" cy="68" r="7" strokeWidth="1.8" />
                      {/* Front Wheel */}
                      <circle cx="126" cy="68" r="18" strokeWidth="2.8" />
                      <circle cx="126" cy="68" r="7" strokeWidth="1.8" />
                      {/* Frame & Tank */}
                      <path d="M34 68 L60 48 L92 48 L108 30 L118 30" />
                      <path d="M60 48 L76 70 L98 52 L126 68" />
                      <path d="M65 44 C72 35 90 35 98 44 Z" fill="#f8fafc" />
                      {/* Seat */}
                      <path d="M46 44 C54 44 62 48 65 48" strokeWidth="3.5" />
                      {/* Handlebar & Fork */}
                      <path d="M108 30 L126 68" strokeWidth="2.5" />
                      <path d="M104 26 L114 30" strokeWidth="3" />
                      {/* Exhaust */}
                      <path d="M72 68 L50 74 L32 74" strokeWidth="2.5" />
                    </svg>
                  ) : isRC ? (
                    /* RC Car / Offroad Buggy SVG */
                    <svg viewBox="0 0 160 100" className="w-full h-auto text-stone-700 stroke-current" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {/* Wheels */}
                      <circle cx="36" cy="68" r="17" strokeWidth="3.2" />
                      <circle cx="36" cy="68" r="7" strokeWidth="2" />
                      <circle cx="124" cy="68" r="17" strokeWidth="3.2" />
                      <circle cx="124" cy="68" r="7" strokeWidth="2" />
                      {/* Buggy Body & Cage */}
                      <path d="M22 60 L38 52 L54 52 L72 38 L106 38 L124 54 L138 60 L124 64 L36 64 Z" />
                      {/* Roof Cage */}
                      <path d="M72 38 L94 38 L106 50" />
                      {/* Rear Spoiler */}
                      <path d="M24 44 L36 44 L32 54" strokeWidth="2.8" />
                      {/* Antenna */}
                      <path d="M80 38 L84 18" strokeWidth="1.5" />
                    </svg>
                  ) : (
                    /* Sedan Line Art SVG matching reference */
                    <svg viewBox="0 0 180 90" className="w-full h-auto text-stone-700 stroke-current" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      {/* Wheels */}
                      <circle cx="44" cy="62" r="14" strokeWidth="2.8" />
                      <circle cx="44" cy="62" r="6" strokeWidth="1.8" />
                      <circle cx="136" cy="62" r="14" strokeWidth="2.8" />
                      <circle cx="136" cy="62" r="6" strokeWidth="1.8" />
                      {/* Body Outline */}
                      <path d="M16 56 C20 54 28 52 36 52 C40 46 48 46 54 52 L126 52 C132 46 140 46 144 52 C152 52 160 54 164 56 C166 60 164 64 160 64 L150 64" />
                      <path d="M130 64 L58 64" />
                      <path d="M30 64 L18 64 C14 64 12 60 16 56" />
                      {/* Roof & Pillars */}
                      <path d="M48 52 L68 32 L116 32 L142 52" />
                      {/* Window divider */}
                      <path d="M92 32 L92 52" />
                      <path d="M70 36 L114 36 L136 50 L56 50 Z" strokeWidth="1.5" />
                      {/* Headlights & Tail Lights */}
                      <path d="M16 56 L24 57" strokeWidth="2.5" />
                      <path d="M162 56 L158 57" strokeWidth="2.5" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => onNavigateTab('diagnostics')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 transition-colors"
            >
              <span>See details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── CARD 2: LIVE STATUS ── */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <h2 className="text-stone-900 font-semibold text-base">Live Status</h2>

            <div className="mt-4 space-y-3">
              {liveTelemetry.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1"
                >
                  <div className="flex items-center gap-2.5 text-stone-600 font-medium">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="font-bold text-stone-900 font-mono text-xs">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => onNavigateTab('liveData')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 transition-colors"
            >
              <span>View all live data</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── CARD 3: RECENT ALERTS ── */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-stone-900 font-semibold text-base">Recent Alerts</h2>
              <span className="text-xs font-semibold text-orange-600">2 Active</span>
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

        {/* ── CARD 4: SYSTEM HEALTH ── */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <h2 className="text-stone-900 font-semibold text-base">System Health</h2>

            <div className="mt-4 space-y-2.5">
              {subsystems.map((sub, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1"
                >
                  <div className="flex items-center gap-2.5 text-stone-600 font-medium">
                    {sub.icon}
                    <span className="truncate">{sub.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        sub.isDue ? 'bg-orange-500' : 'bg-emerald-500'
                      }`}
                    />
                    <span
                      className={`font-semibold text-xs ${
                        sub.isDue ? 'text-orange-600' : 'text-emerald-700'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onOpenReportModal}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 transition-colors"
            >
              <span>View full report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
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
                    <div className="text-[11px] text-stone-400">Check all systems</div>
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

              <button
                type="button"
                onClick={() => onNavigateTab('reports')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200/80 bg-white hover:border-orange-200 hover:bg-orange-50/20 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-600 group-hover:text-orange-600 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-900 group-hover:text-orange-600 transition-colors">
                      View Reports
                    </div>
                    <div className="text-[11px] text-stone-400">See history &amp; trends</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-orange-600 transition-colors" />
              </button>
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
          {/* Subcard A: Maintenance Due */}
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

          {/* Subcard B: Tips for You */}
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
    </div>
  );
};
