import React, { useEffect, useRef, useState } from 'react';
import type { VehicleConfig, VehicleComponentData } from '../../data/vehicleConfigurations';
import { ThreeScene } from './ThreeScene';
import type { ProjectedCallout, HoveredPartInfo } from './ThreeScene';
import { ComponentCallout } from './ComponentCallout';
import { VEHICLE_PAINT_PALETTES } from './ProceduralVehicles';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
  Palette,
  Radar,
  Box,
  Sliders
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
  const [hoveredPart, setHoveredPart] = useState<HoveredPartInfo | null>(null);
  const [isXRay, setIsXRay] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeViewPreset, setActiveViewPreset] = useState<'iso' | 'top' | 'side' | 'front'>('iso');
  
  // Paint palette state
  const [selectedPaintId, setSelectedPaintId] = useState<string>(
    vehicleConfig.type === 'car' ? 'sapphire' : vehicleConfig.type === 'motorcycle' ? 'apex-orange' : 'apex-orange'
  );
  const [showPaintMenu, setShowPaintMenu] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const initialPaint = VEHICLE_PAINT_PALETTES.find(p => p.id === selectedPaintId) || VEHICLE_PAINT_PALETTES[0];
    const scene = new ThreeScene(containerRef.current);
    sceneRef.current = scene;

    scene.setOnProjectedCalloutsChange((newCallouts) => {
      setCallouts(newCallouts);
    });

    scene.setOnHoverPartChange((info) => {
      setHoveredPart(info);
    });

    scene.setOnSelectPartClick((componentId) => {
      const match = vehicleConfig.components.find(c => c.id === componentId);
      if (match) {
        onSelectComponent(match);
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
      const currentPaint = VEHICLE_PAINT_PALETTES.find(p => p.id === selectedPaintId) || VEHICLE_PAINT_PALETTES[0];
      sceneRef.current.setVehicle(vehicleConfig.type, vehicleConfig.components, isXRay, currentPaint.hex, vehicleConfig.model.name);
    }
  }, [vehicleConfig.type, vehicleConfig.model.name, vehicleConfig.components]);

  useEffect(() => {
    if (sceneRef.current && selectedComponent) {
      sceneRef.current.focusComponent(selectedComponent);
    }
  }, [selectedComponent]);

  const handleXRayToggle = () => {
    const next = !isXRay;
    setIsXRay(next);
    if (next) setIsWireframe(false);
    if (sceneRef.current) {
      sceneRef.current.setXRayMode(next);
    }
  };

  const handleWireframeToggle = () => {
    const next = !isWireframe;
    setIsWireframe(next);
    if (next) setIsXRay(false);
    if (sceneRef.current) {
      sceneRef.current.setWireframeMode(next);
    }
  };

  const handleExplodedToggle = () => {
    const next = !isExploded;
    setIsExploded(next);
    if (sceneRef.current) {
      sceneRef.current.setExplodedMode(next);
    }
  };

  const handleDiagnosticScan = () => {
    setIsScanning(true);
    if (sceneRef.current) {
      sceneRef.current.triggerDiagnosticScan();
    }
    setTimeout(() => {
      setIsScanning(false);
    }, 2600);
  };

  const handleSelectPaint = (paint: typeof VEHICLE_PAINT_PALETTES[0]) => {
    setSelectedPaintId(paint.id);
    if (sceneRef.current) {
      sceneRef.current.setPaintColor(paint.hex);
    }
    setShowPaintMenu(false);
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

  const hoveredComponentData = hoveredPart
    ? vehicleConfig.components.find((c) => c.id === hoveredPart.componentId)
    : null;

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[480px] lg:h-[540px] bg-gradient-to-b from-[#faf7f0] via-[#f4efe4] to-[#ebe3d3] rounded-2xl sm:rounded-3xl border border-stone-300/80 shadow-warm-lg overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onClick={() => onSelectComponent(null)}
      />

      {/* Floating 2D Callouts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {callouts.map((callout) => (
          <ComponentCallout
            key={callout.id}
            callout={callout}
            isSelected={selectedComponent?.id === callout.id}
            onSelect={(comp) => onSelectComponent(comp)}
          />
        ))}
      </div>

      {/* 3D Part Hover Interactive HUD Tooltip */}
      {hoveredPart && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-12 transition-all duration-75 ease-out"
          style={{
            left: `${hoveredPart.screenX}px`,
            top: `${hoveredPart.screenY}px`
          }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-950/90 backdrop-blur-md border border-orange-500/40 text-white shadow-2xl text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span className="font-bold text-orange-400">{hoveredPart.name}</span>
            {hoveredComponentData && (
              <>
                <span className="text-stone-500">|</span>
                <span className="text-[10px] text-emerald-400 font-sans font-bold">
                  {hoveredComponentData.healthPct}% Health
                </span>
              </>
            )}
            <span className="text-[9px] text-stone-400 font-sans">• Click to inspect</span>
          </div>
        </div>
      )}

      {/* Top Left: 3D Digital Twin Badge & Vehicle Info */}
      <div className="absolute top-3.5 left-4 flex flex-wrap items-center gap-2 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200 shadow-warm-sm text-xs font-mono text-stone-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-black tracking-wider text-stone-900">3D DIGITAL TWIN</span>
          <span className="text-stone-300">|</span>
          <span className="text-orange-600 font-bold capitalize font-sans">{vehicleConfig.categoryLabel}</span>
        </div>

        {/* Paint Customizer Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowPaintMenu(!showPaintMenu)}
            title="Custom Paint Finishes"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200 shadow-warm-sm text-xs font-semibold text-stone-700 hover:text-orange-600 hover:border-orange-300 transition-all"
          >
            <Palette className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden sm:inline">Paint</span>
            <span
              className="w-3 h-3 rounded-full border border-stone-300 shadow-sm"
              style={{
                backgroundColor:
                  VEHICLE_PAINT_PALETTES.find((p) => p.id === selectedPaintId)?.cssColor || '#1e3a5f'
              }}
            />
          </button>

          {/* Paint Menu Dropdown */}
          {showPaintMenu && (
            <div className="absolute left-0 mt-1.5 p-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-stone-200 shadow-warm-xl flex flex-col gap-1 z-40 min-w-[170px]">
              <div className="text-[10px] font-mono font-bold text-stone-400 px-2 py-1 uppercase tracking-wider">
                Vehicle Paint Palette
              </div>
              {VEHICLE_PAINT_PALETTES.map((paint) => (
                <button
                  key={paint.id}
                  onClick={() => handleSelectPaint(paint)}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedPaintId === paint.id
                      ? 'bg-orange-50 text-orange-950 font-bold border border-orange-200'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-sm shrink-0"
                    style={{ backgroundColor: paint.cssColor }}
                  />
                  <span>{paint.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Right: Camera View Presets */}
      <div className="absolute top-2.5 sm:top-3.5 right-2.5 sm:right-4 flex items-center gap-0.5 sm:gap-1 bg-white/95 backdrop-blur-md border border-stone-200 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl shadow-warm-sm z-10">
        {(['iso', 'top', 'side', 'front'] as const).map((preset) => (
          <button
            key={preset}
            onClick={() => handleViewPreset(preset)}
            className={`px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-lg sm:rounded-xl capitalize transition-all ${
              activeViewPreset === preset
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Bottom Floating Interactive Toolbar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-warm-xl z-20 max-w-[94vw] overflow-x-auto">
        {/* Zoom Controls */}
        <button
          onClick={() => handleZoom(-0.5)}
          title="Zoom In"
          className="p-1.5 text-stone-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleZoom(0.5)}
          title="Zoom Out"
          className="p-1.5 text-stone-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-stone-200 mx-0.5" />

        {/* Diagnostic Scan Sweep */}
        <button
          onClick={handleDiagnosticScan}
          disabled={isScanning}
          title="Trigger Real-time Laser Diagnostic Scan"
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl font-bold transition-all shadow-sm ${
            isScanning
              ? 'bg-orange-600 text-white animate-pulse'
              : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-95'
          }`}
        >
          <Radar className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning...' : 'Laser Scan'}</span>
        </button>

        {/* Exploded View Toggle */}
        <button
          onClick={handleExplodedToggle}
          title="Explode Subsystems (Powertrain, Suspension, Chassis)"
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-xl font-semibold transition-all ${
            isExploded
              ? 'bg-orange-100 text-orange-900 border border-orange-300 shadow-sm'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exploded</span>
        </button>

        {/* X-Ray / Powertrain Mode */}
        <button
          onClick={handleXRayToggle}
          title="Toggle X-Ray / Powertrain Transparency"
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-xl font-semibold transition-all ${
            isXRay
              ? 'bg-orange-100 text-orange-900 border border-orange-300 shadow-sm'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>X-Ray</span>
        </button>

        {/* Wireframe Mode */}
        <button
          onClick={handleWireframeToggle}
          title="Toggle Holographic Wireframe"
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-xl font-semibold transition-all ${
            isWireframe
              ? 'bg-orange-100 text-orange-900 border border-orange-300 shadow-sm'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Wireframe</span>
        </button>

        {/* Turntable Auto-Rotate */}
        <button
          onClick={handleAutoRotateToggle}
          title="Toggle Studio Auto-Turntable"
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-xl font-semibold transition-all ${
            isAutoRotate
              ? 'bg-orange-100 text-orange-900 border border-orange-300 shadow-sm'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Rotate</span>
        </button>

        <div className="w-[1px] h-4 bg-stone-200 mx-0.5" />

        {/* Reset Camera */}
        <button
          onClick={handleResetCamera}
          title="Reset Camera Angle & Focus"
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Navigation & Interaction Instructions */}
      <div className="absolute bottom-3 left-4 hidden md:flex items-center gap-2.5 text-[11px] text-stone-500 font-mono">
        <span>• Click 3D Parts or Pins to Inspect</span>
        <span>• Drag: Orbit</span>
        <span>• Right-click: Pan</span>
        <span>• Scroll: Zoom</span>
      </div>
    </div>
  );
};
