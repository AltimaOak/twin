import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicle } from '../context/VehicleContext';
import type { VehicleComponentData } from '../data/vehicleConfigurations';
import type { ConnectionState, ConnectionLog } from '../types/device';
import type { SidebarTab } from '../components/Sidebar/Sidebar';

import { Sidebar } from '../components/Sidebar/Sidebar';
import { Header } from '../components/Header/Header';
import { VehicleViewer } from '../components/VehicleViewer/VehicleViewer';
import { ComponentInspector } from '../components/ComponentInspector/ComponentInspector';
import { DiagnosticStatusCards } from '../components/Diagnostics/DiagnosticStatusCards';
import { LiveDataSection } from '../components/LiveData/LiveDataSection';
import { AlertsSection } from '../components/Alerts/AlertsSection';
import { MaintenanceSection } from '../components/Maintenance/MaintenanceSection';
import { VehicleHistorySection } from '../components/History/VehicleHistorySection';
import { OverviewDashboard } from '../components/Dashboard/OverviewDashboard';
import { ReportsTab } from '../components/Reports/ReportsTab';
import { VehiclesTab } from '../components/Vehicles/VehiclesTab';
import { SettingsTab } from '../components/Settings/SettingsTab';
import { MechanicReportModal } from '../components/MechanicReport/MechanicReportModal';
import { ConnectionModal } from '../components/Header/ConnectionModal';

interface DashboardPageProps {
  initialTab?: SidebarTab;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ initialTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const { activeVehicle, selectedCategory, setSelectedCategory } = useVehicle();

  const [selectedComponent, setSelectedComponent] = useState<VehicleComponentData | null>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>(initialTab);

  // Hardware Connection State
  const [connectionState, setConnectionState] = useState<ConnectionState>('connected');
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showMechanicReport, setShowMechanicReport] = useState(false);

  // Connection Logs
  const [connectionLogs, setConnectionLogs] = useState<ConnectionLog[]>([
    { id: '1', timestamp: '08:30:12', level: 'info', message: 'Diagnostic transceiver initialized on ISO 15765-4.' },
    { id: '2', timestamp: '08:30:14', level: 'success', message: 'CAN bus handshake successful (500 kbps).' },
    { id: '3', timestamp: '08:30:15', level: 'info', message: 'Read ECU ID: HONDA-PGM-FI v4.2. Streaming PIDs active.' }
  ]);

  const vehicleConfig = activeVehicle;

  // Category change handler
  const handleSelectCategory = (cat: typeof selectedCategory) => {
    setSelectedCategory(cat);
    setSelectedComponent(null);

    const newLog: ConnectionLog = {
      id: `${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: `Switched target profile to ${cat.toUpperCase()} (${vehicleConfig.hardwareLink.protocol}).`
    };
    setConnectionLogs((prev) => [newLog, ...prev.slice(0, 20)]);
  };

  // Toggle Connection
  const handleToggleConnection = () => {
    if (connectionState === 'connected') {
      setConnectionState('disconnected');
    } else {
      setConnectionState('connecting');
      setTimeout(() => {
        setConnectionState('connected');
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-stone-900 flex flex-col md:flex-row font-sans selection:bg-orange-500/20 selection:text-orange-950">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        vehicleConfig={vehicleConfig}
        connectionState={connectionState}
        onToggleConnection={handleToggleConnection}
        onOpenConnectionModal={() => setShowConnectionModal(true)}
        alertCount={vehicleConfig.alerts.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <Header
          vehicleConfig={vehicleConfig}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          connectionState={connectionState}
          onOpenReportModal={() => setShowMechanicReport(true)}
          onOpenConnectionModal={() => setShowConnectionModal(true)}
          alertCount={vehicleConfig.alerts.length}
        />

        {/* Dashboard Content — pb-20 md:pb-0 gives room for mobile bottom tab bar */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-7 space-y-4 sm:space-y-6 pb-20 md:pb-7">
          {/* Active Tab View Rendering */}
          {activeTab === 'dashboard' && (
            <OverviewDashboard
              vehicleConfig={vehicleConfig}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenReportModal={() => setShowMechanicReport(true)}
            />
          )}

          {activeTab === 'digitalTwin' && (
            <div className="space-y-5">
              {/* Header Bar for 3D View */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                    3D Digital Twin View
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Rotate, zoom, and inspect mechanical assemblies and live sensor telemetry.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="px-2.5 py-1 rounded-xl bg-orange-50 text-orange-700 border border-orange-200">
                    {vehicleConfig.model.name}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-600">
                    {vehicleConfig.components.length} Components
                  </span>
                </div>
              </div>

              {/* 3D Viewer & Component Selector Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* 3D Canvas (8 cols on desktop) */}
                <div className="lg:col-span-8 space-y-4">
                  <VehicleViewer
                    vehicleConfig={vehicleConfig}
                    selectedComponent={selectedComponent}
                    onSelectComponent={(comp) => setSelectedComponent(comp)}
                  />

                  {/* Component Inspector Card (when a component is active) */}
                  {selectedComponent && (
                    <ComponentInspector
                      component={selectedComponent}
                      onClose={() => setSelectedComponent(null)}
                    />
                  )}
                </div>

                {/* Subsystem & Parts Sidebar (4 cols on desktop) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-stone-900">
                        Subsystems &amp; Parts
                      </h3>
                      {selectedComponent && (
                        <button
                          type="button"
                          onClick={() => setSelectedComponent(null)}
                          className="text-[11px] font-semibold text-orange-600 hover:text-orange-700"
                        >
                          Reset Focus
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-stone-500">
                      Click any component to highlight and focus in 3D:
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {vehicleConfig.components.map((comp) => {
                        const isSelected = selectedComponent?.id === comp.id;
                        return (
                          <button
                            key={comp.id}
                            type="button"
                            onClick={() => setSelectedComponent(isSelected ? null : comp)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                              isSelected
                                ? 'bg-orange-50 border border-orange-300 text-orange-950 font-semibold shadow-sm'
                                : 'bg-stone-50/70 hover:bg-stone-100/80 border border-stone-200/60 text-stone-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  comp.status === 'good'
                                    ? 'bg-emerald-500'
                                    : 'bg-amber-500'
                                }`}
                              />
                              <span className="truncate">{comp.name}</span>
                            </div>
                            <span className="font-mono text-[11px] text-stone-500 shrink-0 ml-2">
                              {comp.healthPct}%
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specifications Card */}
                  <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-sm space-y-2.5 text-xs">
                    <h4 className="font-bold text-stone-900">Quick Specifications</h4>
                    <div className="space-y-1.5 text-stone-600 text-[11px]">
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-400">Powertrain</span>
                        <span className="font-semibold text-stone-800 text-right truncate max-w-[180px]">
                          {vehicleConfig.specifications.engineOrMotor}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-400">Drive Type</span>
                        <span className="font-semibold text-stone-800">
                          {vehicleConfig.specifications.driveType}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-400">Mileage / Runtime</span>
                        <span className="font-semibold text-stone-800 font-mono">
                          {vehicleConfig.specifications.mileageOrCycles}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-stone-400">Telemetry Link</span>
                        <span className="font-semibold text-stone-800">
                          {vehicleConfig.hardwareLink.protocol.split('(')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diagnostics' && (
            <div className="space-y-6">
              <DiagnosticStatusCards vehicleConfig={vehicleConfig} />
              <AlertsSection vehicleConfig={vehicleConfig} />
            </div>
          )}

          {activeTab === 'liveData' && (
            <LiveDataSection vehicleConfig={vehicleConfig} />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceSection vehicleConfig={vehicleConfig} />
          )}

          {activeTab === 'alerts' && (
            <AlertsSection vehicleConfig={vehicleConfig} />
          )}

          {activeTab === 'history' && (
            <VehicleHistorySection vehicleConfig={vehicleConfig} />
          )}

          {activeTab === 'reports' && (
            <ReportsTab
              vehicleConfig={vehicleConfig}
              onOpenReportModal={() => setShowMechanicReport(true)}
            />
          )}

          {activeTab === 'vehicles' && (
            <VehiclesTab onNavigateToSetup={() => navigate('/select-vehicle')} />
          )}

          {activeTab === 'settings' && (
            <SettingsTab vehicleConfig={vehicleConfig} />
          )}
        </main>

        {/* Footer */}
        <footer className="w-full py-6 text-center text-xs text-stone-400 font-sans">
          © 2024 MotoMindX. All rights reserved.
        </footer>
      </div>

      {/* Mechanic Report Modal */}
      {showMechanicReport && (
        <MechanicReportModal
          vehicleConfig={vehicleConfig}
          onClose={() => setShowMechanicReport(false)}
        />
      )}

      {/* Hardware Connection Modal */}
      {showConnectionModal && (
        <ConnectionModal
          vehicleConfig={vehicleConfig}
          state={connectionState}
          logs={connectionLogs}
          onToggleConnection={handleToggleConnection}
          onClose={() => setShowConnectionModal(false)}
        />
      )}
    </div>
  );
};
