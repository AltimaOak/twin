import React, { useState } from 'react';
import type { VehicleConfig, VehicleAlertItem } from '../../data/vehicleConfigurations';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Wrench,
  Info,
  X
} from 'lucide-react';

interface AlertsSectionProps {
  vehicleConfig: VehicleConfig;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({ vehicleConfig }) => {
  const [selectedAlert, setSelectedAlert] = useState<VehicleAlertItem | null>(null);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full uppercase">
            <AlertCircle className="w-3 h-3 text-red-600" />
            Critical Action
          </span>
        );
      case 'warning':
      case 'check_soon':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Check Soon
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Advisory
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-warm-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h2 className="text-sm font-bold text-stone-900 uppercase font-mono tracking-wider">
            Recent Alerts & Action Items
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold">
          {vehicleConfig.alerts.length} Active
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {vehicleConfig.alerts.length === 0 ? (
          <div className="p-6 rounded-xl bg-emerald-50/50 border border-emerald-200 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />
            <div className="text-sm font-bold text-emerald-950">No Active Faults or DTCs</div>
            <div className="text-xs text-emerald-800 mt-0.5">
              All sensors and onboard monitors are operating within nominal thresholds.
            </div>
          </div>
        ) : (
          vehicleConfig.alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className="p-4 rounded-xl bg-[#fbf9f4] hover:bg-white border border-stone-200 hover:border-orange-300 shadow-warm-sm transition-all cursor-pointer space-y-3"
            >
              {/* Alert Top */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {alert.code && (
                    <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 text-xs font-mono font-bold">
                      {alert.code}
                    </span>
                  )}
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 leading-snug">
                      {alert.title}
                    </h3>
                    <div className="text-[10px] text-stone-500 font-mono">
                      Subsystem: {alert.subsystem} • {alert.timestamp}
                    </div>
                  </div>
                </div>

                {getUrgencyBadge(alert.urgency)}
              </div>

              {/* What Should I Do Preview */}
              <div className="p-2.5 rounded-lg bg-white border border-stone-200/80 text-xs text-stone-700 flex items-start gap-2">
                <Wrench className="w-3.5 h-3.5 text-orange-600 flex-shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  <strong>Recommendation:</strong> {alert.whatShouldIDo}
                </span>
              </div>

              <div className="flex justify-end">
                <span className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                  <span>View Diagnostic Breakdown</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-lg p-6 shadow-warm-xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {selectedAlert.code && (
                    <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-xs font-mono font-bold text-stone-800">
                      {selectedAlert.code}
                    </span>
                  )}
                  <span className="text-xs font-mono text-stone-500">
                    {selectedAlert.subsystem}
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  {selectedAlert.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-200/80">
                <div className="flex items-center gap-1.5 font-bold text-orange-950 mb-1">
                  <Info className="w-4 h-4 text-orange-600" />
                  <span>What Happened?</span>
                </div>
                <p className="text-stone-700 leading-relaxed">
                  {selectedAlert.whatHappened}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80">
                <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Why Does It Matter?</span>
                </div>
                <p className="text-stone-700 leading-relaxed">
                  {selectedAlert.whyItMatters}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-stone-200">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-1">
                  <Wrench className="w-4 h-4 text-emerald-600" />
                  <span>What Should I Do?</span>
                </div>
                <p className="text-stone-700 leading-relaxed">
                  {selectedAlert.whatShouldIDo}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
