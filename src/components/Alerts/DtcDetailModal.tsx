import React from 'react';
import type { DiagnosticCode } from '../../types/diagnostics';
import { X, Activity, Wrench } from 'lucide-react';

interface DtcDetailModalProps {
  dtc: DiagnosticCode;
  onClose: () => void;
  onClear: () => void;
}

export const DtcDetailModal: React.FC<DtcDetailModalProps> = ({
  dtc,
  onClose,
  onClear
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-cyan-300">
                {dtc.code}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {dtc.subsystem}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {dtc.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technical Description */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-200">OBD-II Definition: </span>
          {dtc.description}
        </div>

        {/* Freeze Frame Data (Snapshot at time of fault) */}
        {dtc.freezeFrame && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>ECU Freeze-Frame Sensor Snapshot</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(dtc.freezeFrame).map(([key, val], idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg"
                >
                  <div className="text-[10px] text-slate-400 font-mono truncate">{key}</div>
                  <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Technician Steps */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-800/40">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 mb-1">
            <Wrench className="w-4 h-4" />
            <span>Inspection Guidance for Technician</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {dtc.whatShouldIDo}
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={onClear}
            className="px-4 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-medium transition-colors"
          >
            Clear Code & Reset DTC Monitor
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
