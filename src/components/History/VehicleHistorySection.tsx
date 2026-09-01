import React from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import {
  History,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Clock
} from 'lucide-react';

interface VehicleHistorySectionProps {
  vehicleConfig: VehicleConfig;
}

export const VehicleHistorySection: React.FC<VehicleHistorySectionProps> = ({ vehicleConfig }) => {
  const events = [
    {
      id: 'ev-1',
      title: 'OBD-II Telemetry Link Synchronized',
      timestamp: 'Today, 08:30 AM',
      description: `ECU connection verified on ${vehicleConfig.hardwareLink.protocol}. All monitors active.`,
      icon: <Activity className="w-3.5 h-3.5 text-orange-600" />
    },
    {
      id: 'ev-2',
      title: vehicleConfig.alerts.length > 0 ? vehicleConfig.alerts[0].title : 'Routine Electronic Health Scan Passed',
      timestamp: 'Yesterday, 04:30 PM',
      description: vehicleConfig.alerts.length > 0 ? vehicleConfig.alerts[0].whatHappened : 'No diagnostic trouble codes found across powertrain or chassis systems.',
      icon: vehicleConfig.alerts.length > 0 ? <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
    },
    {
      id: 'ev-3',
      title: 'Full Vehicle Preventative Inspection Logged',
      timestamp: 'Last Week, 10:15 AM',
      description: 'Scheduled multi-point visual and electronic diagnostic checkup completed.',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
    }
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-warm-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-orange-600" />
          <h2 className="text-sm font-bold text-stone-900 uppercase font-mono tracking-wider">
            Vehicle Diagnostic & Activity History
          </h2>
        </div>
        <span className="text-xs font-mono text-stone-400">
          Last 30 Days Log
        </span>
      </div>

      <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-200">
        {events.map((evt) => (
          <div key={evt.id} className="relative group">
            <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border border-stone-300 shadow-warm-sm flex items-center justify-center group-hover:border-orange-500 transition-colors">
              {evt.icon}
            </div>

            <div className="p-3.5 bg-[#fbf9f4] border border-stone-200 rounded-xl hover:border-orange-300 transition-all shadow-warm-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-stone-900">
                  {evt.title}
                </h3>
                <div className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{evt.timestamp}</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                {evt.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
