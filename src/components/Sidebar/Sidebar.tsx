import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  Activity,
  Box,
  CarFront,
  FileText,
  Wrench,
  AlertTriangle,
  History,
  Settings,
  Power,
  RefreshCw,
  Radio,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import type { ConnectionState } from '../../types/device';

export type SidebarTab =
  | 'dashboard'
  | 'diagnostics'
  | 'liveData'
  | 'digitalTwin'
  | 'vehicles'
  | 'reports'
  | 'maintenance'
  | 'alerts'
  | 'history'
  | 'settings';

interface SidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  vehicleConfig: VehicleConfig;
  connectionState: ConnectionState;
  onToggleConnection: () => void;
  onOpenConnectionModal: () => void;
  alertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  vehicleConfig,
  connectionState,
  onToggleConnection,
  onOpenConnectionModal,
  alertCount
}) => {
  const navigate = useNavigate();
  const isConnected = connectionState === 'connected';
  const isConnecting = connectionState === 'connecting';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'diagnostics' as const, label: 'Diagnostics', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'liveData' as const, label: 'Live Data', icon: <Activity className="w-4 h-4" /> },
    { id: 'digitalTwin' as const, label: '3D Twin', icon: <Box className="w-4 h-4" /> },
    { id: 'vehicles' as const, label: 'Vehicles', icon: <CarFront className="w-4 h-4" /> },
    { id: 'reports' as const, label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'maintenance' as const, label: 'Maintenance', icon: <Wrench className="w-4 h-4" /> },
    {
      id: 'alerts' as const,
      label: 'Alerts',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: alertCount > 0 ? alertCount : undefined
    },
    { id: 'history' as const, label: 'History', icon: <History className="w-4 h-4" /> },
    { id: 'settings' as const, label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  // Bottom tab bar shows these primary tabs on mobile
  const primaryTabs: SidebarTab[] = ['dashboard', 'diagnostics', 'liveData', 'digitalTwin', 'alerts'];

  const handleNavClick = (id: SidebarTab) => {
    if (id === 'vehicles') {
      navigate('/select-vehicle');
    } else {
      onSelectTab(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ─────────────────────────────── DESKTOP SIDEBAR ─────────────────────────────── */}
      <aside className="hidden md:flex w-56 lg:w-64 bg-white border-r border-stone-200 flex-col justify-between h-screen sticky top-0 shadow-warm-sm z-30 select-none shrink-0">
        {/* Brand Header */}
        <div>
          <div
            className="p-4 lg:p-5 border-b border-stone-100 flex items-center gap-3 cursor-pointer hover:bg-stone-50 transition-colors"
            onClick={() => navigate('/')}
          >
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30 shrink-0">
              <Activity className="w-4 h-4 lg:w-5 lg:h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg lg:text-xl font-black font-display tracking-tight text-stone-900 leading-none truncate">
                  MotoMind<span className="text-orange-600">X</span>
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium tracking-tight mt-0.5 truncate">
                Vehicle Health &amp; Diagnostics
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-2 lg:p-3 space-y-0.5 lg:space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 lg:px-3.5 py-2 lg:py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200/80 shadow-warm-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-orange-600' : 'text-stone-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Connection Status */}
        <div className="p-3 lg:p-3.5 border-t border-stone-200 bg-[#fbf9f4]">
          <div className="p-2.5 lg:p-3 rounded-xl bg-white border border-stone-200 shadow-warm-sm space-y-2 lg:space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full shrink-0 ${
                  isConnected ? 'bg-emerald-500 ring-2 ring-emerald-100'
                  : isConnecting ? 'bg-amber-500 animate-ping'
                  : 'bg-stone-300'
                }`} />
                <span className="text-xs font-bold text-stone-900 truncate">
                  {isConnected ? 'Device Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
                </span>
              </div>
              <button onClick={onOpenConnectionModal} title="Connection Details" className="text-stone-400 hover:text-orange-600 p-1 shrink-0">
                <Radio className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[11px] text-stone-600 font-medium">
              <div className="font-bold text-stone-900 truncate">{vehicleConfig.model.name}</div>
              <div className="font-mono text-stone-400 text-[10px] truncate mt-0.5">
                ID: {vehicleConfig.hardwareLink.deviceId} • {vehicleConfig.hardwareLink.latencyMs}ms
              </div>
            </div>

            <button
              onClick={onToggleConnection}
              disabled={isConnecting}
              className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                isConnected
                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                  : 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
              }`}
            >
              {isConnecting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Power className="w-3.5 h-3.5" />
              )}
              <span>{isConnected ? 'Disconnect' : 'Connect Device'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────── MOBILE BOTTOM TAB BAR ─────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="flex items-stretch">
          {/* Primary 4 tabs + a "More" trigger */}
          {primaryTabs.slice(0, 4).map((tabId) => {
            const item = navItems.find(n => n.id === tabId)!;
            const isActive = activeTab === tabId;
            return (
              <button
                key={tabId}
                onClick={() => handleNavClick(tabId)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors relative ${
                  isActive ? 'text-orange-600' : 'text-stone-500'
                }`}
              >
                <span className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-[9px] font-semibold leading-none">{item.label}</span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-orange-600 rounded-full" />
                )}
                {item.badge !== undefined && (
                  <span className="absolute top-1.5 right-1/4 w-4 h-4 flex items-center justify-center rounded-full bg-amber-500 text-white text-[8px] font-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-stone-500"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[9px] font-semibold leading-none">More</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────── MOBILE SLIDE-UP DRAWER ─────────────────────────────── */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl pb-safe">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-stone-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100">
              <div>
                <div className="text-base font-black font-display text-stone-900">
                  MotoMind<span className="text-orange-600">X</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isConnected ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <span className="text-xs text-stone-500 font-medium truncate">
                    {vehicleConfig.model.name}
                  </span>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl text-stone-500 hover:bg-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Items Grid */}
            <div className="p-4 grid grid-cols-3 gap-2 max-h-[55vh] overflow-y-auto">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl text-xs font-bold transition-all relative ${
                      isActive
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-stone-50 text-stone-600 border border-stone-100 hover:border-stone-200'
                    }`}
                  >
                    <span className={`${isActive ? 'text-orange-600' : 'text-stone-400'}`}>
                      {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' })}
                    </span>
                    <span className="text-center leading-tight">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center rounded-full bg-amber-500 text-white text-[8px] font-black">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Connection & Actions */}
            <div className="px-4 pb-6 pt-2 border-t border-stone-100 space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isConnected ? 'bg-emerald-500 ring-2 ring-emerald-100' : isConnecting ? 'bg-amber-500 animate-ping' : 'bg-stone-300'}`} />
                <span className="text-xs font-bold text-stone-900 flex-1 truncate">
                  {isConnected ? 'Device Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
                </span>
                <span className="text-[10px] font-mono text-stone-400">{vehicleConfig.hardwareLink.latencyMs}ms</span>
                <button onClick={onOpenConnectionModal} className="text-stone-400 hover:text-orange-600">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => { onToggleConnection(); setMobileMenuOpen(false); }}
                disabled={isConnecting}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-colors ${
                  isConnected
                    ? 'bg-stone-100 text-stone-700 border border-stone-200'
                    : 'bg-orange-600 text-white shadow-sm'
                }`}
              >
                {isConnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Power className="w-3.5 h-3.5" />}
                {isConnected ? 'Disconnect Device' : 'Connect Device'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
