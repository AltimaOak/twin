import React, { useState } from 'react';
import type { DiagnosticCode, AlertUrgency } from '../../types/diagnostics';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Wrench,
  RotateCcw,
  Info
} from 'lucide-react';
import { DtcDetailModal } from './DtcDetailModal';

interface AlertsPanelProps {
  activeCodes: DiagnosticCode[];
  onClearCode: (code: string) => void;
  onResetAllCodes: () => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  activeCodes,
  onClearCode,
  onResetAllCodes
}) => {
  const [selectedDtc, setSelectedDtc] = useState<DiagnosticCode | null>(null);

  const getUrgencyBadge = (urgency: AlertUrgency) => {
    switch (urgency) {
      case 'attention_required':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full uppercase">
            <AlertCircle className="w-3.5 h-3.5" />
            Attention Required
          </span>
        );
      case 'check_soon':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase">
            <AlertTriangle className="w-3.5 h-3.5" />
            Check Soon
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 rounded-full uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Advisory
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Diagnostic Alerts & "What Should I Do?"
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
            {activeCodes.length} Active
          </span>
        </div>

        {activeCodes.length > 0 && (
          <button
            onClick={onResetAllCodes}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Codes</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {activeCodes.length === 0 ? (
        <div className="p-6 bg-slate-950/50 rounded-xl border border-slate-800/80 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">
            No Active Diagnostic Faults
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            All powertrain, sensor, and CAN bus monitors are within nominal manufacturer specifications.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeCodes.map((dtc) => (
            <div
              key={dtc.code}
              className="p-4 bg-slate-950/70 border border-slate-800/90 hover:border-slate-700/90 rounded-xl transition-all shadow-sm"
            >
              {/* Alert Title & Status */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-cyan-300">
                    {dtc.code}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {dtc.title}
                    </h3>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Subsystem: {dtc.subsystem} • Detected {dtc.timestamp}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getUrgencyBadge(dtc.urgency)}
                </div>
              </div>

              {/* Friendly "What Should I Do?" Action Grid */}
              <div className="mt-3.5 grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-3 border-t border-slate-900">
                {/* 1. What Happened */}
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  <div className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    <span>What happened?</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {dtc.whatHappened}
                  </p>
                </div>

                {/* 2. Why Does It Matter */}
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  <div className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Why does it matter?</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {dtc.whyItMatters}
                  </p>
                </div>

                {/* 3. What Should I Do */}
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  <div className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                    <span>What should I do?</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {dtc.whatShouldIDo}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center justify-between pt-2">
                <button
                  onClick={() => setSelectedDtc(dtc)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <span>Inspect Freeze-Frame Sensor Data</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onClearCode(dtc.code)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded border border-slate-800 transition-colors"
                >
                  Dismiss / Clear Code
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Freeze-Frame Modal */}
      {selectedDtc && (
        <DtcDetailModal
          dtc={selectedDtc}
          onClose={() => setSelectedDtc(null)}
          onClear={() => {
            onClearCode(selectedDtc.code);
            setSelectedDtc(null);
          }}
        />
      )}
    </div>
  );
};
