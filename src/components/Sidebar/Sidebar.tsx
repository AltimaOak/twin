import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  Activity,
  Box,
  Car,
  FileText,
  Wrench,
  AlertTriangle,
  History,
  Settings,
  Power,
  RefreshCw,
  Menu,
  X,
  ChevronRight,
  Home
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
    { id: 'digitalTwin' as const, label: '3D View', icon: <Box className="w-4 h-4" /> },
    { id: 'vehicles' as const, label: 'Vehicles', icon: <Car className="w-4 h-4" /> },
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
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ─────────────────────────────── DESKTOP SIDEBAR ─────────────────────────────── */}
      <aside className="hidden md:flex w-56 lg:w-60 bg-white border-r border-stone-200 flex-col justify-between h-screen sticky top-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)] z-30 select-none shrink-0">
        {/* Brand Header */}
        <div>
          <div
            className="p-4 lg:p-5 border-b border-stone-100 flex items-center gap-3 cursor-pointer hover:bg-stone-50/60 transition-colors"
            onClick={() => navigate('/')}
          >
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="text-base lg:text-lg font-bold tracking-tight text-stone-900 leading-tight block">
                MotoMindX
              </span>
              <p className="text-[11px] text-stone-400 font-medium tracking-tight mt-0.5 truncate">
                Vehicle Health at a Glance
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-2 lg:p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-orange-50/90 text-orange-600 font-semibold shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-orange-600' : 'text-stone-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Connection Status Card */}
        <div className="p-3 lg:p-4 border-t border-stone-100">
          <div className="p-3 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                isConnected ? 'bg-emerald-500 ring-2 ring-emerald-100'
                : isConnecting ? 'bg-amber-500 animate-ping'
                : 'bg-stone-300'
              }`} />
              <span className="text-xs font-semibold text-stone-800 truncate">
                {isConnected ? 'Device Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>

            <div className="text-xs">
              <div className="font-semibold text-stone-900 truncate">{vehicleConfig.model.name}</div>
              <div className="text-stone-400 text-[11px] truncate mt-0.5">
                4G Signal - Good
              </div>
            </div>

            <button
              onClick={onToggleConnection}
              disabled={isConnecting}
              className="w-full mt-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors shadow-sm"
            >
              {isConnecting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : null}
              <span>{isConnected ? 'Disconnect' : 'Connect'}</span>
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
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="text-left group cursor-pointer"
                title="Return to Landing Page"
              >
                <div className="flex items-center gap-1.5 text-base font-black font-display text-stone-900 group-hover:text-orange-600 transition-colors">
                  <Home className="w-4 h-4 text-orange-600" />
                  <span>MotoMind<span className="text-orange-600">X</span></span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-orange-600 font-semibold underline">
                    ← Return to Home
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500 font-medium truncate max-w-[130px]">
                    {vehicleConfig.model.name}
                  </span>
                </div>
              </button>
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
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isConnected
                    ? 'bg-stone-100 text-stone-700 border border-stone-200'
                    : 'bg-orange-600 text-white shadow-sm'
                }`}
              >
                {isConnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Power className="w-3.5 h-3.5" />}
                {isConnected ? 'Disconnect Device' : 'Connect Device'}
              </button>

              {/* Return to Landing Page Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-orange-50 hover:border-orange-300 text-stone-800 hover:text-orange-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-orange-600" />
                <span>Return to Landing Page</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
