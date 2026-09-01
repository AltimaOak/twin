import React, { useState } from 'react';
import type { MaintenanceScheduleItem, ServiceLogRecord } from '../../types/maintenance';
import {
  Wrench,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { RecordServiceModal } from './RecordServiceModal';

interface MaintenanceTrackerProps {
  schedule: MaintenanceScheduleItem[];
  serviceHistory: ServiceLogRecord[];
  currentMileage: number;
  onAddServiceRecord: (record: Omit<ServiceLogRecord, 'id'>) => void;
}

export const MaintenanceTracker: React.FC<MaintenanceTrackerProps> = ({
  schedule,
  serviceHistory,
  currentMileage,
  onAddServiceRecord
}) => {
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'schedule' | 'history'>('schedule');

  const getStatusIndicator = (item: MaintenanceScheduleItem) => {
    if (item.remainingKm <= 0 || item.status === 'overdue') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded uppercase">
          <AlertTriangle className="w-3 h-3" />
          Overdue
        </span>
      );
    }
    if (item.remainingKm <= 1000 || item.status === 'due_soon') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded uppercase">
          <Clock className="w-3 h-3" />
          Due Soon
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
        <CheckCircle2 className="w-3 h-3" />
        Good
      </span>
    );
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Maintenance & Service Schedule
            </h2>
            <div className="text-[11px] text-slate-400 font-mono">
              Odometer: {currentMileage.toLocaleString()} km
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1 rounded font-medium transition-all ${
                activeTab === 'schedule'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Upcoming ({schedule.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1 rounded font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Service Log ({serviceHistory.length})
            </button>
          </div>

          <button
            onClick={() => setShowRecordModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Service</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      {activeTab === 'schedule' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {schedule.map((item) => {
            const progressPct = Math.max(
              0,
              Math.min(
                100,
                Math.round(
                  ((item.intervalKm - Math.max(0, item.remainingKm)) / item.intervalKm) * 100
                )
              )
            );

            return (
              <div
                key={item.id}
                className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-200">
                      {item.name}
                    </h3>
                    {getStatusIndicator(item)}
                  </div>

                  <div className="mt-2 flex items-baseline justify-between text-xs">
                    <span className="text-slate-400">
                      {item.remainingKm > 0
                        ? `${item.remainingKm.toLocaleString()} km remaining`
                        : `${Math.abs(item.remainingKm).toLocaleString()} km overdue`}
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      Due at {item.dueKm.toLocaleString()} km
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.remainingKm <= 0
                          ? 'bg-rose-500'
                          : item.remainingKm <= 1000
                          ? 'bg-amber-400'
                          : 'bg-cyan-400'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Last: {item.lastPerformedDate}</span>
                  <span className="font-mono text-slate-400">{item.estimatedCostRange}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2.5">
          {serviceHistory.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              No historical service records logged yet.
            </div>
          ) : (
            serviceHistory.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-200">
                      {rec.serviceType}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {rec.odometerKm.toLocaleString()} km
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{rec.notes}</p>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {rec.date}
                    </span>
                    <span>• {rec.workshopOrMechanic}</span>
                  </div>
                </div>

                {rec.cost && (
                  <div className="text-right sm:self-center font-mono font-bold text-emerald-400 text-sm">
                    ${rec.cost.toFixed(2)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {showRecordModal && (
        <RecordServiceModal
          currentMileage={currentMileage}
          onClose={() => setShowRecordModal(false)}
          onSave={onAddServiceRecord}
        />
      )}
    </div>
  );
};
