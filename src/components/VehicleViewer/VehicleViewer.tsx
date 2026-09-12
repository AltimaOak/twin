import React, { useEffect, useRef, useState } from 'react';
import type { VehicleConfig, VehicleComponentData } from '../../data/vehicleConfigurations';
import { ThreeScene } from './ThreeScene';
import type { ProjectedCallout, HoveredPartInfo } from './ThreeScene';
import { ComponentCallout } from './ComponentCallout';
import type { LabelDisplayMode } from './ComponentCallout';
import { VEHICLE_PAINT_PALETTES } from './ProceduralVehicles';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
  Sliders,
  Tag,
  Radio,
  AlertTriangle
} from 'lucide-react';

interface VehicleViewerProps {
  vehicleConfig: VehicleConfig;
  selectedComponent: VehicleComponentData | null;
  onSelectComponent: (component: VehicleComponentData | null) => void;
}

export const VehicleViewer: React.FC<VehicleViewerProps> = ({
  vehicleConfig,
  selectedComponent,
  onSelectComponent
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ThreeScene | null>(null);

  const [callouts, setCallouts] = useState<ProjectedCallout[]>([]);
  const [_hoveredPart, setHoveredPart] = useState<HoveredPartInfo | null>(null);
  const [isXRay, setIsXRay] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [activeViewPreset, setActiveViewPreset] = useState<'iso' | 'top' | 'side' | 'front'>('iso');
  const [labelDisplayMode, setLabelDisplayMode] = useState<LabelDisplayMode>('smart');

  const defaultPaintId = vehicleConfig.type === 'car' ? 'sapphire' : 'apex-orange';

  useEffect(() => {
    if (!containerRef.current) return;

    const initialPaint = VEHICLE_PAINT_PALETTES.find(p => p.id === defaultPaintId) || VEHICLE_PAINT_PALETTES[0];
    const scene = new ThreeScene(containerRef.current);
    sceneRef.current = scene;

    scene.setOnProjectedCalloutsChange((newCallouts) => {
      setCallouts(newCallouts);
    });

    scene.setOnHoverPartChange((info) => {
      setHoveredPart(info);
    });

    scene.setOnSelectPartClick((componentId) => {
      if (!componentId) {
        onSelectComponent(null);
        return;
      }
      const match = vehicleConfig.components.find(c => c.id === componentId);
      if (match) {
        onSelectComponent(match);
      } else {
        onSelectComponent(null);
      }
    });

    scene.setVehicle(vehicleConfig.type, vehicleConfig.components, isXRay, initialPaint.hex, vehicleConfig.model.name);

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      const currentPaint = VEHICLE_PAINT_PALETTES.find(p => p.id === defaultPaintId) || VEHICLE_PAINT_PALETTES[0];
      sceneRef.current.setVehicle(vehicleConfig.type, vehicleConfig.components, isXRay, currentPaint.hex, vehicleConfig.model.name);
    }
  }, [vehicleConfig.type, vehicleConfig.model.name, vehicleConfig.components]);

  useEffect(() => {
    if (sceneRef.current && selectedComponent) {
      sceneRef.current.focusComponent(selectedComponent);
    } else if (sceneRef.current && !selectedComponent) {
      sceneRef.current.clearHighlight();
    }
  }, [selectedComponent]);

  const handleXRayToggle = () => {
    const next = !isXRay;
    setIsXRay(next);
    if (sceneRef.current) {
      sceneRef.current.setXRayMode(next);
    }
  };

  const handleExplodedToggle = () => {
    const next = !isExploded;
    setIsExploded(next);
    if (sceneRef.current) {
      sceneRef.current.setExplodedMode(next);
    }
  };

  const handleAutoRotateToggle = () => {
    const next = !isAutoRotate;
    setIsAutoRotate(next);
    if (sceneRef.current) {
      sceneRef.current.setAutoRotate(next);
    }
  };

  const handleResetCamera = () => {
    setActiveViewPreset('iso');
    if (sceneRef.current) {
      sceneRef.current.resetCamera();
    }
    onSelectComponent(null);
  };

  const handleViewPreset = (view: 'iso' | 'top' | 'side' | 'front') => {
    setActiveViewPreset(view);
    if (sceneRef.current) {
      sceneRef.current.setPresetView(view);
    }
  };

  const handleZoom = (delta: number) => {
    if (sceneRef.current) {
      sceneRef.current.zoom(delta);
    }
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[440px] lg:h-[500px] bg-gradient-to-b from-[#faf8f5] to-[#ece7dc] rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Floating 2D Callouts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {callouts.map((callout) => (
          <ComponentCallout
            key={callout.id}
            callout={callout}
            displayMode={labelDisplayMode}
            isSelected={selectedComponent?.id === callout.id}
            onSelect={(comp) => onSelectComponent(comp)}
          />
        ))}
      </div>

      {/* Top Left: Model Badge */}
      <div className="absolute top-3 left-3 z-10 hidden xs:flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-sm text-xs font-medium text-stone-700">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-stone-900">{vehicleConfig.model.name}</span>
        <span className="text-stone-300 hidden sm:inline">•</span>
        <span className="text-stone-500 hidden sm:inline">3D Twin</span>
      </div>

      {/* Top Right: Label Mode & Camera View Presets */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        {/* Label Density / Mode Switcher */}
        <div className="flex items-center bg-white/90 backdrop-blur-md border border-stone-200/80 p-0.5 rounded-xl shadow-sm text-xs">
          <button
            type="button"
            onClick={() => setLabelDisplayMode('smart')}
            title="Smart Staggered Labels (Uncongested)"
            className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg transition-colors ${
              labelDisplayMode === 'smart'
                ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200/60'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Tag className="w-3 h-3 text-orange-600" />
            <span className="hidden sm:inline">Labels</span>
          </button>
          <button
            type="button"
            onClick={() => setLabelDisplayMode('hotspots')}
            title="Minimal Hotspot Beacons"
            className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg transition-colors ${
              labelDisplayMode === 'hotspots'
                ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200/60'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Radio className="w-3 h-3 text-orange-600" />
            <span className="hidden sm:inline">Hotspots</span>
          </button>
          <button
            type="button"
            onClick={() => setLabelDisplayMode('alerts_only')}
            title="Show Alerts Only"
            className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg transition-colors ${
              labelDisplayMode === 'alerts_only'
                ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200/60'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span className="hidden sm:inline">Alerts Only</span>
          </button>
        </div>

        {/* Camera View Presets */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-white/90 backdrop-blur-md border border-stone-200/80 p-0.5 sm:p-1 rounded-xl shadow-sm text-xs">
          {(['iso', 'top', 'side', 'front'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => handleViewPreset(preset)}
              className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-colors ${
                activeViewPreset === preset
                  ? 'bg-orange-600 text-white font-semibold shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {preset === 'iso' ? '3D' : preset}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Floating Simple Controls */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-md z-20 max-w-[95%] overflow-x-auto">
        {/* X-Ray */}
        <button
          type="button"
          onClick={handleXRayToggle}
          title="Toggle X-Ray Transparency"
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
            isXRay
              ? 'bg-orange-100 text-orange-800 font-semibold'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>X-Ray</span>
        </button>

        {/* Exploded */}
        <button
          type="button"
          onClick={handleExplodedToggle}
          title="Exploded Assemblies"
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
            isExploded
              ? 'bg-orange-100 text-orange-800 font-semibold'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Exploded</span>
        </button>

        {/* Turntable Auto-Rotate */}
        <button
          type="button"
          onClick={handleAutoRotateToggle}
          title="Auto-Rotate Turntable"
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
            isAutoRotate
              ? 'bg-orange-100 text-orange-800 font-semibold'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Rotate</span>
        </button>

        <div className="w-[1px] h-4 bg-stone-200 mx-1" />

        {/* Zoom Controls */}
        <button
          type="button"
          onClick={() => handleZoom(-0.4)}
          title="Zoom In"
          className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => handleZoom(0.4)}
          title="Zoom Out"
          className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-stone-200 mx-1" />

        {/* Reset Camera */}
        <button
          type="button"
          onClick={handleResetCamera}
          title="Reset Camera"
          className="flex items-center gap-1 px-2 py-1 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Interaction Help Hint */}
      <div className="absolute bottom-3 left-4 hidden sm:flex items-center gap-2 text-[11px] text-stone-400 font-medium">
        <span>Drag to rotate</span>
        <span>•</span>
        <span>Scroll to zoom</span>
        <span>•</span>
        <span>Click parts to inspect</span>
      </div>
    </div>
  );
};
