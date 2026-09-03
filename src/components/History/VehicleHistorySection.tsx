import React, { useState } from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Radio,
  FileCheck
} from 'lucide-react';

interface VehicleHistorySectionProps {
  vehicleConfig: VehicleConfig;
}

export const VehicleHistorySection: React.FC<VehicleHistorySectionProps> = ({ vehicleConfig }) => {
  const [filter, setFilter] = useState<'all' | 'diagnostic' | 'service' | 'system'>('all');

  const historyItems = [
    {
      id: 'h-1',
      type: 'system',
      badge: 'System',
      title: 'OBD-II Link Connected',
      description: `Telemetry stream active via ${vehicleConfig.hardwareLink.protocol} (${vehicleConfig.hardwareLink.latencyMs}ms latency).`,
      time: 'Today, 10:45 AM',
      icon: <Radio className="w-4 h-4 text-emerald-600" />,
      bg: 'bg-emerald-50'
    },
    {
      id: 'h-2',
      type: 'diagnostic',
      badge: 'Diagnostics',
      title: 'System Health Check Completed',
      description: `All electronic monitors and sensors checked. Overall health verified at ${vehicleConfig.healthIndex.overallScore}/100.`,
      time: 'Today, 08:30 AM',
      icon: <Activity className="w-4 h-4 text-orange-600" />,
      bg: 'bg-orange-50'
    },
    {
      id: 'h-3',
      type: 'diagnostic',
      badge: 'Alert',
      title: vehicleConfig.alerts[0] ? vehicleConfig.alerts[0].title : 'Diagnostic Advisory Logged',
      description: vehicleConfig.alerts[0] ? vehicleConfig.alerts[0].whatHappened : 'Sensor parameter flagged for inspection.',
      time: 'Yesterday, 04:15 PM',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      bg: 'bg-amber-50'
    },
    {
      id: 'h-4',
      type: 'service',
      badge: 'Report',
      title: 'Vehicle Health Report Generated',
      description: 'Periodic inspection summary compiled and saved to local archive.',
      time: 'Aug 30, 2026',
      icon: <FileCheck className="w-4 h-4 text-sky-600" />,
      bg: 'bg-sky-50'
    },
    {
      id: 'h-5',
      type: 'service',
      badge: 'Service',
      title: 'Engine Oil & Filter Service',
      description: 'Scheduled maintenance logged: Synthetic 0W-20 oil replaced at Honda Service Center (Cost: ₹3,500).',
      time: 'Jun 10, 2026',
      icon: <Wrench className="w-4 h-4 text-stone-600" />,
      bg: 'bg-stone-100'
    },
    {
      id: 'h-6',
      type: 'system',
      badge: 'System',
      title: 'Hardware Firmware Updated',
      description: 'OBD-II adapter firmware upgraded to version v2.4.1.',
      time: 'May 14, 2026',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      bg: 'bg-emerald-50'
    }
  ];

  const filtered = historyItems.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            History &amp; Activity
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Recent connections, diagnostic scans, and maintenance records.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'diagnostic', label: 'Diagnostics' },
            { id: 'service', label: 'Service' },
            { id: 'system', label: 'System' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                filter === tab.id
                  ? 'bg-orange-50 text-orange-700 font-semibold border border-orange-200'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200/90'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simple History List */}
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-sm divide-y divide-stone-100 overflow-hidden">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 hover:bg-stone-50/60 transition-colors flex items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl ${item.bg} shrink-0 mt-0.5 sm:mt-0`}>
                {item.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900">
                    {item.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200/60">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-stone-400 font-medium whitespace-nowrap">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
