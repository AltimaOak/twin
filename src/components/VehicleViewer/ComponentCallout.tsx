import React from 'react';
import type { ProjectedCallout } from './ThreeScene';
import type { VehicleComponentData } from '../../data/vehicleConfigurations';

interface ComponentCalloutProps {
  callout: ProjectedCallout;
  isSelected: boolean;
  onSelect: (component: VehicleComponentData) => void;
}

export const ComponentCallout: React.FC<ComponentCalloutProps> = ({
  callout,
  isSelected,
  onSelect
}) => {
  if (!callout.visible) return null;

  const { component, x, y } = callout;

  const getStatusBadge = () => {
    switch (component.status) {
      case 'check_soon':
      case 'warning':
        return {
          dot: 'bg-amber-500 ring-4 ring-amber-100',
          pin: 'bg-amber-500 border-white',
          badge: 'Check Soon',
          badgeClass: 'text-amber-700 bg-amber-50 border-amber-200'
        };
      case 'critical':
        return {
          dot: 'bg-red-500 ring-4 ring-red-100 animate-pulse',
          pin: 'bg-red-500 border-white',
          badge: 'Attention',
          badgeClass: 'text-red-700 bg-red-50 border-red-200'
        };
      default:
        return {
          dot: 'bg-emerald-600 ring-4 ring-emerald-100',
          pin: 'bg-emerald-600 border-white',
          badge: 'Good',
          badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200'
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div
      className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-full transition-all duration-150 ease-out z-20 cursor-pointer group"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component);
      }}
    >
      {/* Floating Badge */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 select-none shadow-warm-md ${
          isSelected
            ? 'bg-white border-orange-500 text-orange-950 ring-2 ring-orange-400/40 scale-105 -translate-y-1'
            : 'bg-white/95 hover:bg-white border-stone-200/90 hover:border-orange-300 text-stone-800 hover:scale-105'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${status.dot}`} />
        <span className="tracking-tight whitespace-nowrap text-[11px] font-bold">{component.shortName}</span>
        <span className={`text-[9px] px-1 py-0.2 rounded border font-medium ${status.badgeClass}`}>
          {status.badge}
        </span>
      </div>

      {/* Target Pin Marker on 3D geometry */}
      <div className="flex flex-col items-center justify-center -mt-0.5">
        <div className="w-[1.5px] h-3 bg-gradient-to-b from-stone-400 to-orange-500" />
        <div className={`w-2.5 h-2.5 rounded-full border-2 shadow-sm ${status.pin}`} />
      </div>
    </div>
  );
};
