import React, { useState } from 'react';
import type { VehicleConfig, VehicleMaintenanceItem } from '../../data/vehicleConfigurations';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  X
} from 'lucide-react';

interface MaintenanceSectionProps {
  vehicleConfig: VehicleConfig;
}

export const MaintenanceSection: React.FC<MaintenanceSectionProps> = ({ vehicleConfig }) => {
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceCost, setServiceCost] = useState('');
  const [technician, setTechnician] = useState('');
  const [notes, setNotes] = useState('');

  // Local recorded items
  const [recordedHistory, setRecordedHistory] = useState<{
    id: string;
    name: string;
    date: string;
    cost: string;
    technician: string;
  }[]>([]);

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName) return;

    setRecordedHistory([
      {
        id: `rec-${Date.now()}`,
        name: serviceName,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        cost: serviceCost ? `$${serviceCost}` : '$85',
        technician: technician || 'Authorized Service'
      },
      ...recordedHistory
    ]);

    setServiceName('');
    setServiceCost('');
    setTechnician('');
    setNotes('');
    setShowRecordModal(false);
  };

  const getStatusBadge = (item: VehicleMaintenanceItem) => {
    if (item.status === 'overdue' || item.remainingNumber < 0) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-mono uppercase">
          <AlertTriangle className="w-3 h-3 text-red-600" />
          Attention
        </span>
      );
    }
    if (item.status === 'due_soon' || item.remainingNumber <= 1500) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-mono uppercase">
          <Clock className="w-3 h-3 text-amber-600" />
          Due Soon
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono uppercase">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Good
      </span>
    );
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-warm-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-orange-600" />
          <div>
            <h2 className="text-sm font-bold text-stone-900 uppercase font-mono tracking-wider">
              Maintenance & Scheduled Service
            </h2>
            <div className="text-[11px] text-stone-500 font-medium">
              Preventative schedule for {vehicleConfig.model.name} ({vehicleConfig.specifications.mileageOrCycles})
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowRecordModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold transition-colors shadow-warm-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Record Service</span>
        </button>
      </div>

      {/* Maintenance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {vehicleConfig.maintenance.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-[#fbf9f4] border border-stone-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-stone-900">{item.name}</h3>
                {getStatusBadge(item)}
              </div>

              <div className="mt-2 text-xs font-mono text-stone-700 flex items-center justify-between">
                <span>{item.remainingValue}</span>
                <span className="text-[11px] text-stone-400">Target: {item.dueValue}</span>
              </div>

              <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                {item.action}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-stone-200/80 flex items-center justify-between text-[10px] text-stone-400 font-mono">
              <span>Last: {item.lastCompleted}</span>
              <span className="font-semibold text-stone-600">{item.costRange}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recorded History Preview if any */}
      {recordedHistory.length > 0 && (
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <div className="text-[11px] font-bold text-stone-500 uppercase font-mono">
            Recently Recorded Work Orders ({recordedHistory.length})
          </div>
          <div className="space-y-1.5">
            {recordedHistory.map((rec) => (
              <div
                key={rec.id}
                className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-emerald-950">{rec.name}</span>
                  <span className="text-[11px] text-emerald-800 ml-2">({rec.technician})</span>
                </div>
                <div className="font-mono text-emerald-900 font-bold">
                  {rec.cost} • {rec.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Record Service Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-md p-6 shadow-warm-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-bold text-stone-900">
                  Record Completed Service
                </h3>
              </div>
              <button
                onClick={() => setShowRecordModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Service Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Engine Oil & Filter Service"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Cost ($ USD)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 75"
                    value={serviceCost}
                    onChange={(e) => setServiceCost(e.target.value)}
                    className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Workshop / Mechanic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Authorized Workshop"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Technician Notes / Parts
                </label>
                <textarea
                  rows={3}
                  placeholder="Synthetic oil replaced, filter sealed, multi-point check OK."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-md shadow-orange-600/20"
                >
                  Save Service Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
