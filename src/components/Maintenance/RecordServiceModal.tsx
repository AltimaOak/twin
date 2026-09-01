import React, { useState } from 'react';
import type { ServiceLogRecord } from '../../types/maintenance';
import { X, Wrench, CheckCircle, Gauge } from 'lucide-react';

interface RecordServiceModalProps {
  currentMileage: number;
  onClose: () => void;
  onSave: (record: Omit<ServiceLogRecord, 'id'>) => void;
}

export const RecordServiceModal: React.FC<RecordServiceModalProps> = ({
  currentMileage,
  onClose,
  onSave
}) => {
  const [serviceType, setServiceType] = useState('Engine Oil & Filter Service');
  const [odometerKm, setOdometerKm] = useState(currentMileage);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [workshopOrMechanic, setWorkshopOrMechanic] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date,
      odometerKm: Number(odometerKm) || currentMileage,
      serviceType,
      serviceCategory: 'Recorded Maintenance',
      workshopOrMechanic: workshopOrMechanic || 'Self / Local Workshop',
      notes: notes || 'Regular preventative maintenance completed.',
      cost: cost ? parseFloat(cost) : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Record Completed Maintenance Service
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Service Type
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="Engine Oil & Filter Service">Engine Oil & Filter Service</option>
              <option value="Front Brake Pad & Rotor Replacement">Front Brake Pad & Rotor Replacement</option>
              <option value="Tyre Rotation & Wheel Balancing">Tyre Rotation & Wheel Balancing</option>
              <option value="Engine Air & Cabin Pollen Filter">Engine Air & Cabin Pollen Filter</option>
              <option value="12V Starter Battery Replacement">12V Starter Battery Replacement</option>
              <option value="Chain Slack Adjustment & Lube">Chain Slack Adjustment & Lube (Bike)</option>
              <option value="3S LiPo Balance & Cycle">3S LiPo Balance & Cycle (RC)</option>
              <option value="Major Comprehensive Vehicle Inspection">Major Comprehensive Vehicle Inspection</option>
              <option value="Other Custom Service">Other Custom Service</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Odometer (KM)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={odometerKm}
                  onChange={(e) => setOdometerKm(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
                <Gauge className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Service Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Service Center / Mechanic
              </label>
              <input
                type="text"
                placeholder="e.g. Metro Honda Authorized"
                value={workshopOrMechanic}
                onChange={(e) => setWorkshopOrMechanic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Total Cost ($ optional)
              </label>
              <input
                type="number"
                placeholder="e.g. 120"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Technician Notes / Parts Replaced
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Synthetic 0W-20 oil replaced, OEM filter installed. Inspected brakes."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-600/30"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save to Service History</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
