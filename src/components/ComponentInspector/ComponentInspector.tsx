import React from 'react';
import type { VehicleComponentData, ComponentHealthStatus } from '../../data/vehicleConfigurations';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Wrench,
  Gauge
} from 'lucide-react';

interface ComponentInspectorProps {
  component: VehicleComponentData | null;
  onClose: () => void;
}

export const ComponentInspector: React.FC<ComponentInspectorProps> = ({
  component,
  onClose
}) => {
  if (!component) return null;

  const getStatusBadge = (status: ComponentHealthStatus) => {
    switch (status) {
      case 'check_soon':
      case 'warning':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800 font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Check Soon
          </span>
        );
      case 'critical':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 border border-red-200 text-red-800 font-mono">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            Attention Required
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Normal Operating Status
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-warm-md space-y-4 animate-in fade-in slide-in-from-top-2">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-orange-600 font-bold px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200">
              Component Telemetry
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] font-mono uppercase text-stone-500 font-semibold">
              {component.category}
            </span>
          </div>
          <h3 className="text-lg font-black text-stone-900 tracking-tight flex items-center gap-2">
            {component.name}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge(component.status)}
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-stone-600 leading-relaxed">
        {component.description}
      </p>

      {/* Live Metrics Grid */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 font-mono">
          <Gauge className="w-3.5 h-3.5 text-orange-600" />
          <span>Component Sensor Readings</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {component.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-3 bg-[#fbf9f4] border border-stone-200 rounded-xl flex flex-col justify-between"
            >
              <div className="text-[11px] text-stone-500 font-medium truncate">
                {metric.label}
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-lg font-black font-mono text-stone-900">
                  {metric.value}
                </span>
                {metric.unit && (
                  <span className="text-xs text-stone-500 font-mono font-semibold">
                    {metric.unit}
                  </span>
                )}
              </div>
              {metric.nominalRange && (
                <div className="text-[10px] text-stone-400 font-mono mt-1">
                  Nominal: {metric.nominalRange[0]}–{metric.nominalRange[1]} {metric.unit}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* "What does this mean?" Plain English Translation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-950 mb-1">
            <HelpCircle className="w-4 h-4 text-orange-600" />
            <span>What Does This Mean?</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            "{component.diagnosticFinding}"
          </p>
        </div>

        {component.recommendation && (
          <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-stone-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 mb-1">
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>Recommended Action</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {component.recommendation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
