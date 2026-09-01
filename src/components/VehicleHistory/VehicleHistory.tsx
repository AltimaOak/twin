import React from 'react';
import type { VehicleTimelineEvent } from '../../types/maintenance';
import {
  History,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Activity,
  Clock
} from 'lucide-react';

interface VehicleHistoryProps {
  events: VehicleTimelineEvent[];
}

export const VehicleHistory: React.FC<VehicleHistoryProps> = ({ events }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'alert':
      case 'dtc':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'service':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'trip':
        return <Navigation className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Vehicle Event & Diagnostic History
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Last 30 Days Activity
        </span>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
        {events.map((evt) => (
          <div key={evt.id} className="relative group">
            <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
              {getEventIcon(evt.type)}
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">
                    {evt.title}
                  </span>
                  {evt.metricSnippet && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                      {evt.metricSnippet}
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{evt.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {evt.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
