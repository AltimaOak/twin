import React, { useState } from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import {
  ShieldCheck,
  HelpCircle,
  Cpu,
  Zap,
  Thermometer,
  Shield,
  Wrench,
  Activity,
  Info,
  X
} from 'lucide-react';

interface HealthIndexCardProps {
  vehicleConfig: VehicleConfig;
}

export const HealthIndexCard: React.FC<HealthIndexCardProps> = ({ vehicleConfig }) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const health = vehicleConfig.healthIndex;

  const getSubsystemIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5" />;
      case 'Thermometer':
        return <Thermometer className="w-3.5 h-3.5" />;
      case 'Shield':
        return <Shield className="w-3.5 h-3.5" />;
      case 'Wrench':
        return <Wrench className="w-3.5 h-3.5" />;
      default:
        return <Activity className="w-3.5 h-3.5" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return { text: 'text-emerald-700', stroke: '#16a34a', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 78) return { text: 'text-orange-700', stroke: '#ea580c', bg: 'bg-orange-50', border: 'border-orange-200' };
    if (score >= 65) return { text: 'text-amber-700', stroke: '#d97706', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { text: 'text-red-700', stroke: '#dc2626', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const colorScheme = getScoreColor(health.overallScore);

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (health.overallScore / 100) * circumference;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-warm-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-orange-600" />
          <h2 className="text-sm font-bold text-stone-900 uppercase font-mono tracking-wider">
            Vehicle Health Index
          </h2>
        </div>

        <button
          onClick={() => setShowFormulaModal(true)}
          className="flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-orange-600 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>How is this calculated?</span>
        </button>
      </div>

      {/* Main Score Hero */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-4 rounded-xl bg-[#fbf9f4] border border-stone-200">
        {/* Circular Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#e7e5e4"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke={colorScheme.stroke}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black font-mono text-stone-900 leading-none">
              {health.overallScore}
            </span>
            <span className="text-[10px] font-mono uppercase text-stone-400 font-bold mt-0.5">
              / 100
            </span>
          </div>
        </div>

        {/* Status Description */}
        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${colorScheme.bg} ${colorScheme.text} ${colorScheme.border}`}>
              STATUS: {health.statusText}
            </span>
            <span className="text-xs font-bold font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              GRADE {health.grade}
            </span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed max-w-md">
            {health.summary}
          </p>
        </div>
      </div>

      {/* Subsystem Health Progress Bars */}
      <div className="space-y-2.5 pt-1">
        <div className="text-[11px] font-bold text-stone-400 uppercase font-mono tracking-wider">
          Subsystem Health Breakdown ({vehicleConfig.categoryLabel})
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {health.subsystems.map((sub) => (
            <div
              key={sub.id}
              className="p-3 rounded-xl bg-white border border-stone-200 shadow-warm-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-stone-800">
                  <span className="p-1 rounded-lg bg-stone-100 text-stone-600">
                    {getSubsystemIcon(sub.iconName)}
                  </span>
                  <span>{sub.name}</span>
                </div>
                <span className="font-mono font-bold text-stone-900">
                  {sub.score}%
                </span>
              </div>

              <div className="w-full h-2 bg-stone-100 rounded-full mt-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    sub.score >= 88
                      ? 'bg-emerald-500'
                      : sub.score >= 75
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${sub.score}%` }}
                />
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[10px] text-stone-500">
                <span className="truncate">{sub.summary}</span>
                <span className="font-mono font-semibold ml-1">{(sub.weight * 100).toFixed(0)}% weight</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formula Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-lg p-6 shadow-warm-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-bold text-stone-900">
                  How Vehicle Health is Calculated
                </h3>
              </div>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              MotoMindX calculates the composite health index dynamically based on real-time sensor parameters, active Diagnostic Trouble Codes (DTCs), and scheduled maintenance intervals tailored to this <strong>{vehicleConfig.categoryLabel}</strong>:
            </p>

            <div className="space-y-2 font-mono text-xs">
              {health.subsystems.map((sub) => (
                <div
                  key={sub.id}
                  className="p-2.5 rounded-lg bg-[#fbf9f4] border border-stone-200 flex items-center justify-between"
                >
                  <span className="font-bold text-stone-800">{sub.name}</span>
                  <span className="font-bold text-orange-600">
                    {(sub.weight * 100).toFixed(0)}% Weight Contribution
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setShowFormulaModal(false)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
