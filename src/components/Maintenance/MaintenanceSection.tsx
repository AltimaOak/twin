import React, { useState } from 'react';
import type { VehicleConfig, VehicleMaintenanceItem } from '../../data/vehicleConfigurations';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
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

  const [recordedHistory, setRecordedHistory] = useState<
    Array<{
      id: string;
      name: string;
      date: string;
      cost: string;
      technician: string;
    }>
  >([
    {
      id: 'rec-1',
      name: 'Engine Oil & Filter Replacement',
      date: 'Jun 10, 2026',
      cost: '₹3,500',
      technician: 'Honda Authorized Workshop'
    },
    {
      id: 'rec-2',
      name: 'Tire Rotation & Balance',
      date: 'Mar 22, 2026',
      cost: '₹1,200',
      technician: 'Apex Auto Tire Care'
    },
    {
      id: 'rec-3',
      name: 'Cabin & Engine Air Filters Replaced',
      date: 'Dec 18, 2025',
      cost: '₹1,800',
      technician: 'Owner (DIY)'
    }
  ]);

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    setRecordedHistory([
      {
        id: `rec-${Date.now()}`,
        name: serviceName,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        cost: serviceCost ? `₹${serviceCost}` : '₹2,500',
        technician: technician || 'Self Recorded'
      },
      ...recordedHistory
    ]);

    setServiceName('');
    setServiceCost('');
    setTechnician('');
    setShowRecordModal(false);
  };

  const getStatusBadge = (item: VehicleMaintenanceItem) => {
    if (item.status === 'overdue' || item.remainingNumber < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
          <AlertTriangle className="w-3 h-3 text-red-600" />
          Overdue
        </span>
      );
    }
    if (item.status === 'due_soon' || item.remainingNumber <= 2500) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
          <Clock className="w-3 h-3 text-amber-600" />
          Due Soon
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Good
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Maintenance Schedule
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Service intervals for {vehicleConfig.model.name} ({vehicleConfig.specifications.mileageOrCycles})
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRecordModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Service</span>
        </button>
      </div>

      {/* Next Service Highlight Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-stone-400">Next Scheduled Service</span>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-0.5">
              In 2,350 km or 45 days
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Recommended: Engine Oil &amp; Filter replacement + Multi-point brake inspection.
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-xs text-stone-400 block">Current Odometer</span>
          <span className="text-sm font-bold text-stone-900 font-mono">
            {vehicleConfig.specifications.mileageOrCycles}
          </span>
        </div>
      </div>

      {/* Upcoming Service Checklist */}
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Service Intervals
          </h3>
          <span className="text-xs text-stone-400">
            {vehicleConfig.maintenance.length} items tracked
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {vehicleConfig.maintenance.map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-stone-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                    {item.name}
                  </h4>
                  {getStatusBadge(item)}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Interval: Every {item.intervalValue} • Est: {item.costRange} • Last performed: {item.lastCompleted}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-xs">
                <div className="text-right">
                  <span className="font-semibold text-stone-800">
                    {item.remainingNumber > 0 ? `In ${item.remainingNumber.toLocaleString()} km` : 'Due Now'}
                  </span>
                  <span className="text-[10px] text-stone-400 block">Remaining</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Service History */}
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Past Service History
          </h3>
          <span className="text-xs text-stone-400">
            {recordedHistory.length} records logged
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {recordedHistory.map((rec) => (
            <div
              key={rec.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <span className="font-bold text-stone-900 block sm:inline mr-2">
                  {rec.name}
                </span>
                <span className="text-stone-400">
                  {rec.date} • {rec.technician}
                </span>
              </div>
              <div className="font-bold text-stone-900 font-mono">
                {rec.cost}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Log Service Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">
                Log Completed Service
              </h3>
              <button
                type="button"
                onClick={() => setShowRecordModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="space-y-3 text-xs">
              <div>
                <label htmlFor="maint-service-name" className="font-medium text-stone-700 block mb-1">
                  Service / Task Name
                </label>
                <input
                  id="maint-service-name"
                  name="serviceName"
                  type="text"
                  required
                  placeholder="e.g. Engine Oil & Filter Change"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="maint-service-cost" className="font-medium text-stone-700 block mb-1">
                    Cost (₹)
                  </label>
                  <input
                    id="maint-service-cost"
                    name="serviceCost"
                    type="text"
                    placeholder="e.g. 2500"
                    value={serviceCost}
                    onChange={(e) => setServiceCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="maint-technician" className="font-medium text-stone-700 block mb-1">
                    Service Provider / Shop
                  </label>
                  <input
                    id="maint-technician"
                    name="technician"
                    type="text"
                    placeholder="e.g. Honda Service Center"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-3 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
