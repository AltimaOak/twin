import React from 'react';
import type { VehicleConfig, ComponentHealthStatus } from '../../data/vehicleConfigurations';
import {
  Cpu,
  Zap,
  Shield,
  Thermometer,
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

interface DiagnosticStatusCardsProps {
  vehicleConfig: VehicleConfig;
}

export const DiagnosticStatusCards: React.FC<DiagnosticStatusCardsProps> = ({ vehicleConfig }) => {
  const getStatusBadge = (status: ComponentHealthStatus) => {
    switch (status) {
      case 'check_soon':
      case 'warning':
        return {
          label: 'CHECK SOON',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          bar: 'bg-amber-500',
          icon: <AlertTriangle className="w-3 h-3 text-amber-600" />
        };
      case 'critical':
        return {
          label: 'CRITICAL',
          bg: 'bg-red-50 text-red-800 border-red-200',
          dot: 'bg-red-500',
          bar: 'bg-red-500',
          icon: <AlertCircle className="w-3 h-3 text-red-600" />
        };
      default:
        return {
          label: 'GOOD',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
          bar: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        };
    }
  };

  const getSubsystemIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'powertrain':
        return <Cpu className="w-4 h-4 text-orange-600" />;
      case 'electrical':
        return <Zap className="w-4 h-4 text-orange-600" />;
      case 'thermal':
        return <Thermometer className="w-4 h-4 text-orange-600" />;
      case 'braking':
        return <Shield className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-orange-600" />;
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-warm-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-600" />
          <h2 className="text-sm font-bold text-stone-900 uppercase font-mono tracking-wider">
            Diagnostic Status Cards
          </h2>
        </div>
        <span className="text-xs font-mono text-stone-400">
          {vehicleConfig.components.length} Monitored Assemblies
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {vehicleConfig.components.map((comp) => {
          const badge = getStatusBadge(comp.status);

          return (
            <div
              key={comp.id}
              className="p-3.5 rounded-xl bg-[#fbf9f4] border border-stone-200 hover:border-orange-300 transition-all shadow-warm-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-white border border-stone-200 shadow-warm-sm">
                      {getSubsystemIcon(comp.category)}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-stone-900 leading-tight">
                        {comp.shortName}
                      </h3>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {comp.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${badge.bg}`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                </div>

                <p className="text-[11px] text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                  {comp.diagnosticFinding}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-200/80">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-stone-500 font-semibold">Integrity Index</span>
                  <span className="font-bold text-stone-900">{comp.healthPct}%</span>
                </div>

                <div className="w-full h-1.5 bg-stone-200 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${badge.bar}`}
                    style={{ width: `${comp.healthPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
