import React, { useState } from 'react';
import type { VehicleHealthSummary } from '../../types/diagnostics';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface HealthScoreProps {
  health: VehicleHealthSummary;
}

export const HealthScore: React.FC<HealthScoreProps> = ({ health }) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
    if (score >= 78) return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20';
    if (score >= 65) return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/20';
  };

  const getSubsystemStatusBadge = (status: 'good' | 'fair' | 'poor') => {
    switch (status) {
      case 'poor':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
            <AlertCircle className="w-3 h-3" />
            Check Now
          </span>
        );
      case 'fair':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            Check Soon
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Good
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Vehicle Health Index
          </h2>
        </div>

        <button
          onClick={() => setShowFormulaModal(!showFormulaModal)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>How is this calculated?</span>
        </button>
      </div>

      {/* Main Score Overview */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border ${getGradeColor(
              health.overallScore
            )}`}
          >
            <span className="text-2xl font-black font-mono leading-none">
              {health.overallScore}
            </span>
            <span className="text-[10px] uppercase font-mono opacity-80 mt-0.5">
              / 100
            </span>
          </div>

          <div>
            <div className="text-base font-bold text-white flex items-center gap-2">
              <span>{health.statusText}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Grade {health.grade}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
              {health.summaryNote}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors self-end sm:self-center"
        >
          <span>{isExpanded ? 'Hide Breakdown' : 'View Subsystems'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Subsystem Health Breakdown */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {health.breakdown.map((item, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-950/50 border border-slate-800/70 rounded-lg flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                {item.category}
              </span>
              {getSubsystemStatusBadge(item.status)}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] truncate mr-2">{item.summary}</span>
              <span className="font-mono font-bold text-slate-200">
                {item.score}%
              </span>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  item.score >= 85
                    ? 'bg-emerald-400'
                    : item.score >= 70
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
                style={{ width: `${item.score}%` }}
              />
            </div>

            {/* Deduction notes if expanded */}
            {isExpanded && item.deductions.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-amber-300/90 font-mono space-y-0.5">
                {item.deductions.map((d, dIdx) => (
                  <div key={dIdx}>• {d}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Formula Explanation Note */}
      {showFormulaModal && (
        <div className="mt-4 p-3.5 rounded-lg bg-slate-950 border border-cyan-800/40 text-xs text-slate-300 animate-in fade-in">
          <div className="flex items-center gap-1.5 font-semibold text-cyan-300 mb-1">
            <Info className="w-4 h-4" />
            <span>Transparent Health Scoring Formula</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            MotoMindX calculates vehicle health by aggregating live sensor ranges, active diagnostic trouble codes (DTCs), and scheduled service intervals with weighted contributions:
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 font-mono text-[11px] text-slate-300">
            <li className="p-1.5 bg-slate-900 rounded border border-slate-800">
              Powertrain / Engine: <span className="text-cyan-400 font-bold">30%</span>
            </li>
            <li className="p-1.5 bg-slate-900 rounded border border-slate-800">
              Electrical / Battery: <span className="text-cyan-400 font-bold">25%</span>
            </li>
            <li className="p-1.5 bg-slate-900 rounded border border-slate-800">
              Thermal / Cooling: <span className="text-cyan-400 font-bold">20%</span>
            </li>
            <li className="p-1.5 bg-slate-900 rounded border border-slate-800">
              Braking / Chassis: <span className="text-cyan-400 font-bold">15%</span>
            </li>
            <li className="p-1.5 bg-slate-900 rounded border border-slate-800">
              Service Adherence: <span className="text-cyan-400 font-bold">10%</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
