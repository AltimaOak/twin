import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import type { VehicleComponentData } from '../data/vehicleConfigurations';
import type { ConnectionState, ConnectionLog } from '../types/device';
import type { SidebarTab } from '../components/Sidebar/Sidebar';

import { Sidebar } from '../components/Sidebar/Sidebar';
import { Header } from '../components/Header/Header';
import { VehicleProfileCard } from '../components/VehicleProfile/VehicleProfileCard';
import { VehicleViewer } from '../components/VehicleViewer/VehicleViewer';
import { ComponentInspector } from '../components/ComponentInspector/ComponentInspector';
import { HealthIndexCard } from '../components/HealthIndex/HealthIndexCard';
import { DiagnosticStatusCards } from '../components/Diagnostics/DiagnosticStatusCards';
import { LiveDataSection } from '../components/LiveData/LiveDataSection';
import { AlertsSection } from '../components/Alerts/AlertsSection';
import { MaintenanceSection } from '../components/Maintenance/MaintenanceSection';
import { VehicleHistorySection } from '../components/History/VehicleHistorySection';
import { MechanicReportModal } from '../components/MechanicReport/MechanicReportModal';
import { ConnectionModal } from '../components/Header/ConnectionModal';

interface DashboardPageProps {
  initialTab?: SidebarTab;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ initialTab = 'dashboard' }) => {
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
          {(activeTab === 'dashboard' || activeTab === 'digitalTwin') && (
            <>
              {/* Top Row: Vehicle Profile & Quick Specifications */}
              <VehicleProfileCard vehicleConfig={vehicleConfig} />

              {/* Core Layout Grid: 3D Twin & Health/Telemetry */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT 7 COLUMNS: 3D Digital Twin, Component Inspector & Live Sensor Grid */}
                <div className="lg:col-span-7 space-y-6">
                  {/* 3D Digital Twin Visualizer */}
                  <VehicleViewer
                    vehicleConfig={vehicleConfig}
                    selectedComponent={selectedComponent}
                    onSelectComponent={(comp) => setSelectedComponent(comp)}
                  />

                  {/* Component Inspector (Opens when pin clicked) */}
                  {selectedComponent && (
                    <ComponentInspector
                      component={selectedComponent}
                      onClose={() => setSelectedComponent(null)}
                    />
                  )}

                  {/* Live Sensor Telemetry */}
                  <LiveDataSection vehicleConfig={vehicleConfig} />

                  {/* Diagnostic Status Cards */}
                  <DiagnosticStatusCards vehicleConfig={vehicleConfig} />
                </div>

                {/* RIGHT 5 COLUMNS: Health Index, Alerts & Maintenance */}
                <div className="lg:col-span-5 space-y-6">
                  {/* 1. Vehicle Health Index Card */}
                  <HealthIndexCard vehicleConfig={vehicleConfig} />

                  {/* 2. Recent Alerts & Diagnostic Codes */}
                  <AlertsSection vehicleConfig={vehicleConfig} />

                  {/* 3. Maintenance & Service Schedule */}
                  <MaintenanceSection vehicleConfig={vehicleConfig} />

                  {/* 4. Event & Diagnostic History */}
                  <VehicleHistorySection vehicleConfig={vehicleConfig} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'diagnostics' && (
            <div className="space-y-6">
              <DiagnosticStatusCards vehicleConfig={vehicleConfig} />
              <AlertsSection vehicleConfig={vehicleConfig} />
            </div>
          )}

          {activeTab === 'liveData' && (
            <div className="space-y-6">
              <LiveDataSection vehicleConfig={vehicleConfig} />
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <MaintenanceSection vehicleConfig={vehicleConfig} />
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <AlertsSection vehicleConfig={vehicleConfig} />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <VehicleHistorySection vehicleConfig={vehicleConfig} />
            </div>
          )}

          {(activeTab === 'reports' || activeTab === 'vehicles' || activeTab === 'settings') && (
            <div className="p-8 bg-white border border-stone-200 rounded-2xl shadow-warm-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-600" />
                <h2 className="text-lg font-black text-stone-900 uppercase font-mono tracking-tight">
                  {activeTab === 'reports' ? 'Diagnostic Reports Archive' : activeTab === 'vehicles' ? 'Connected Garage & Fleet' : 'Hardware & System Settings'}
                </h2>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                {activeTab === 'reports'
                  ? 'Generate, print, or export verified mechanic service reports for insurance, warranty validation, and scheduled workshop maintenance.'
                  : activeTab === 'vehicles'
                  ? 'Manage multiple vehicles in your MotoMindX account. Switch between passenger cars, motorcycles, and RC telemetry rigs.'
                  : 'Configure baud rates, CAN bus masks, LoRa telemetry frequencies, and alert notification thresholds.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setShowMechanicReport(true)}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20"
                >
                  Open Mechanic Report Modal
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="w-full bg-white border-t border-stone-200 py-4 px-6 mt-8 shadow-warm-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-800">MotoMindX Pro Telematics</span>
              <span>• {vehicleConfig.hardwareLink.protocol}</span>
            </div>
            <div>
              <span>Connected to {vehicleConfig.hardwareLink.deviceId} • Demo Mode Active</span>
            </div>
          </div>
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
