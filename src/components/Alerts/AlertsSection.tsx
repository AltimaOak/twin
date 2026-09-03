import React, { useState } from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Check,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

interface AlertsSectionProps {
  vehicleConfig: VehicleConfig;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({ vehicleConfig }) => {
  const [resolvedAlertIds, setResolvedAlertIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const handleToggleResolve = (id: string) => {
    if (resolvedAlertIds.includes(id)) {
      setResolvedAlertIds(resolvedAlertIds.filter((item) => item !== id));
    } else {
      setResolvedAlertIds([...resolvedAlertIds, id]);
    }
  };

  const getUrgencyBadge = (urgency: string, isResolved: boolean) => {
    if (isResolved) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Resolved
        </span>
      );
    }
    switch (urgency) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3 text-red-600" />
            Attention Required
          </span>
        );
      case 'warning':
      case 'check_soon':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Check Soon
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-700 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-stone-500" />
            Advisory
          </span>
        );
    }
  };

  const activeCount = vehicleConfig.alerts.filter(
    (a) => !resolvedAlertIds.includes(a.id)
  ).length;

  const filteredAlerts = vehicleConfig.alerts.filter((alert) => {
    const isResolved = resolvedAlertIds.includes(alert.id);
    if (filter === 'active') return !isResolved;
    if (filter === 'resolved') return isResolved;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Alerts &amp; Fault Codes
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Diagnostic trouble codes (DTCs) and active system notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              activeCount > 0
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                activeCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            {activeCount > 0 ? `${activeCount} Active Alerts` : 'All Systems Nominal'}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5">
        {(['all', 'active', 'resolved'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${
              filter === tab
                ? 'bg-orange-50 text-orange-700 font-semibold border border-orange-200'
                : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200/90'
            }`}
          >
            {tab === 'all'
              ? `All (${vehicleConfig.alerts.length})`
              : tab === 'active'
              ? `Active (${activeCount})`
              : `Resolved (${resolvedAlertIds.length})`}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white border border-stone-200/90 rounded-2xl p-8 text-center shadow-sm flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">
              No alerts in this view
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              All monitored subsystems are reporting normal values.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isResolved = resolvedAlertIds.includes(alert.id);
            return (
              <div
                key={alert.id}
                className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-sm transition-all space-y-3 ${
                  isResolved
                    ? 'border-stone-200/80 opacity-75'
                    : 'border-stone-200/90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    {alert.code && (
                      <span className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-800 text-xs font-mono font-bold shrink-0 mt-0.5">
                        {alert.code}
                      </span>
                    )}
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                        {alert.title}
                      </h3>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Subsystem: {alert.subsystem} • Detected {alert.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    {getUrgencyBadge(alert.urgency, isResolved)}
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-stone-50/70 border border-stone-200/60 rounded-xl p-3 text-xs space-y-1.5">
                  <div>
                    <span className="font-semibold text-stone-700">Finding: </span>
                    <span className="text-stone-600">{alert.whatHappened}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Recommended Action: </span>
                    <span className="text-stone-600">{alert.whatShouldIDo}</span>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleToggleResolve(alert.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      isResolved
                        ? 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                    }`}
                  >
                    {isResolved ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reopen Alert</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark as Resolved</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
