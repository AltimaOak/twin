import React, { useState } from 'react';
import type { ProjectedCallout } from './ThreeScene';
import type { VehicleComponentData } from '../../data/vehicleConfigurations';
import { ChevronRight } from 'lucide-react';

export type LabelDisplayMode = 'smart' | 'hotspots' | 'alerts_only';

interface ComponentCalloutProps {
  callout: ProjectedCallout;
  isSelected: boolean;
  displayMode?: LabelDisplayMode;
  onSelect: (component: VehicleComponentData) => void;
}

export const ComponentCallout: React.FC<ComponentCalloutProps> = ({
  callout,
  isSelected,
  displayMode = 'smart',
  onSelect
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!callout.visible) return null;

  const { component, x, y, staggerLevel = 0 } = callout;
  const isAlert = component.status === 'check_soon' || component.status === 'warning' || component.status === 'critical';

  // If alerts_only mode is active and this component has normal status and isn't selected, show miniature ghost dot
  if (displayMode === 'alerts_only' && !isAlert && !isSelected && !isHovered) {
    return (
      <div
        className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 z-10 cursor-pointer"
        style={{ left: `${x}px`, top: `${y}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(component);
        }}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-stone-400/40 hover:bg-emerald-500 border border-white shadow-xs transition-colors" />
      </div>
    );
  }

  const getStatusConfig = () => {
    switch (component.status) {
      case 'check_soon':
      case 'warning':
        return {
          dotBg: 'bg-amber-500',
          dotRing: 'ring-amber-300/40',
          pinBg: 'bg-amber-500',
          badgeText: 'Check Soon',
          badgeStyle: 'text-amber-800 bg-amber-50 border-amber-200/80',
          glowBorder: 'border-amber-400/60 shadow-amber-500/10'
        };
      case 'critical':
        return {
          dotBg: 'bg-red-500 animate-pulse',
          dotRing: 'ring-red-300/50',
          pinBg: 'bg-red-500',
          badgeText: 'Attention',
          badgeStyle: 'text-red-800 bg-red-50 border-red-200/80',
          glowBorder: 'border-red-400/60 shadow-red-500/15'
        };
      default:
        return {
          dotBg: 'bg-emerald-500',
          dotRing: 'ring-emerald-300/40',
          pinBg: 'bg-emerald-600',
          badgeText: 'Good',
          badgeStyle: 'text-emerald-800 bg-emerald-50 border-emerald-200/80',
          glowBorder: 'border-stone-200/90 shadow-stone-900/5'
        };
    }
  };

  const status = getStatusConfig();
  const isExpanded = isSelected || isHovered;

  // Stagger leader line height based on calculated collision layer
  // Stagger: 0 => 12px, 1 => 22px, 2 => 32px
  const leaderHeight = isSelected ? 24 : staggerLevel === 2 ? 32 : staggerLevel === 1 ? 22 : 12;

  // Primary metric preview
  const primaryMetric = component.metrics && component.metrics[0];

  return (
    <div
      className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-full transition-all duration-200 ease-out cursor-pointer ${
        isExpanded ? 'z-40' : 'z-20'
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component);
      }}
    >
      {/* 1. HOTSPOTS MODE (Minimal glowing circular radar dot) */}
      {displayMode === 'hotspots' && !isExpanded ? (
        <div className="flex flex-col items-center group -translate-y-1">
          <div className="relative flex items-center justify-center p-1 rounded-full bg-white/90 backdrop-blur-md border border-stone-300 shadow-md transition-transform group-hover:scale-110">
            <span className={`w-2.5 h-2.5 rounded-full ${status.dotBg}`} />
            <span className={`absolute inset-0 rounded-full animate-ping opacity-30 ${status.dotBg}`} />
          </div>
          {/* Target anchor on 3D geometry */}
          <div className="w-[1.5px] h-2 bg-stone-400" />
          <div className={`w-2 h-2 rounded-full border border-white shadow-xs ${status.pinBg}`} />
        </div>
      ) : isExpanded ? (
        /* 2. EXPANDED HUD CARD (On Hover or Selection) */
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-150 -translate-y-1">
          <div
            className={`w-52 p-3 rounded-2xl bg-white/98 backdrop-blur-xl border shadow-xl transition-all ${
              isSelected
                ? 'border-orange-500 ring-4 ring-orange-500/15 shadow-orange-500/10'
                : `${status.glowBorder} hover:border-orange-300`
            }`}
          >
            {/* Top Bar: Short Name & Category */}
            <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-stone-100">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${status.dotBg}`} />
                <span className="text-xs font-bold text-stone-900 tracking-tight truncate">
                  {component.shortName}
                </span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border shrink-0 uppercase font-mono ${status.badgeStyle}`}>
                {status.badgeText}
              </span>
            </div>

            {/* Live Metric Snippet if available */}
            {primaryMetric && (
              <div className="mt-2 py-1 px-2 rounded-lg bg-[#fbf9f4] border border-stone-200/80 flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-stone-500 font-medium truncate">{primaryMetric.label}</span>
                <span className="font-bold text-stone-900 ml-1 shrink-0">
                  {primaryMetric.value} {primaryMetric.unit}
                </span>
              </div>
            )}

            {/* Prompt */}
            <div className="mt-2 flex items-center justify-between text-[10px] text-orange-600 font-semibold pt-1 border-t border-stone-100">
              <span>Inspect Telemetry</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Dynamic Leader Stem */}
          <div
            className="w-[1.5px] bg-gradient-to-b from-orange-400 to-orange-600 transition-all"
            style={{ height: `${leaderHeight + 6}px` }}
          />
          <div className="w-2.5 h-2.5 rounded-full border-2 border-white bg-orange-600 shadow-md ring-2 ring-orange-400/40" />
        </div>
      ) : (
        /* 3. SMART COMPACT PILL (Clean, uncluttered, non-overlapping) */
        <div className="flex flex-col items-center group">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md select-none transition-all duration-150 shadow-xs ${
              isAlert
                ? 'bg-amber-50/95 border-amber-300 text-amber-950 font-bold hover:scale-105'
                : 'bg-white/95 border-stone-200/90 text-stone-800 hover:bg-white hover:border-orange-300 hover:scale-105 hover:shadow-sm'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dotBg}`} />
            <span className="tracking-tight whitespace-nowrap">{component.shortName}</span>
            {isAlert && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
            )}
          </div>

          {/* Staggered Vertical Leader Line */}
          <div
            className="w-[1.5px] bg-gradient-to-b from-stone-400 to-stone-600 opacity-60 group-hover:opacity-100 transition-all"
            style={{ height: `${leaderHeight}px` }}
          />
          {/* Target Dot on 3D Geometry */}
          <div className={`w-2 h-2 rounded-full border border-white shadow-xs ${status.pinBg}`} />
        </div>
      )}
    </div>
  );
};
