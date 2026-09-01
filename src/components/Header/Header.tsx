import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { VehicleCategory, VehicleConfig } from '../../data/vehicleConfigurations';
import type { ConnectionState } from '../../types/device';
import {
  Car,
  Bike,
  Gamepad2,
  Bell,
  FileText,
  User,
  RotateCcw
} from 'lucide-react';

interface HeaderProps {
  vehicleConfig: VehicleConfig;
  selectedCategory: VehicleCategory;
  onSelectCategory: (cat: VehicleCategory) => void;
  connectionState: ConnectionState;
  onOpenReportModal: () => void;
  onOpenConnectionModal: () => void;
  alertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  vehicleConfig,
  selectedCategory,
  onSelectCategory,
  connectionState,
  onOpenReportModal,
  onOpenConnectionModal,
  alertCount
}) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const isConnected = connectionState === 'connected';

  const categoryButtons: { id: VehicleCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'car', label: 'Car', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'motorcycle', label: 'Motorcycle', icon: <Bike className="w-3.5 h-3.5" /> },
    { id: 'rc_car', label: 'RC Car', icon: <Gamepad2 className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="w-full bg-white border-b border-stone-200 sticky top-0 z-20 px-3 sm:px-6 py-2.5 sm:py-3 shadow-warm-sm">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Vehicle Category Selector */}
        <div className="flex items-center gap-2 min-w-0 overflow-x-auto no-scrollbar">
          {/* Category Switcher — compact on mobile */}
          <div className="flex items-center p-0.5 sm:p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs shrink-0">
            {categoryButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => onSelectCategory(btn.id)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedCategory === btn.id
                    ? 'bg-white text-orange-600 shadow-warm-sm border border-stone-200/80'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {btn.icon}
                <span className="hidden sm:inline">{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Change Vehicle — icon only on smallest screens */}
          <button
            onClick={() => navigate('/select-vehicle')}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-orange-50 hover:text-orange-700 text-stone-700 border border-stone-200 text-xs font-bold transition-colors shadow-warm-sm shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Change Vehicle</span>
          </button>

          {/* Detection banner — only on xl+ */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50/70 border border-orange-200/70 text-xs">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
            <span className="font-mono text-orange-900 font-semibold truncate">
              {vehicleConfig.detectionLabel}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Vehicle Info Pill — hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#fbf9f4] border border-stone-200 text-xs">
            <span className="text-[10px] uppercase font-mono text-stone-400 font-bold">Active:</span>
            <span className="font-bold text-stone-900 truncate max-w-[140px]">{vehicleConfig.model.name}</span>
            <span className="text-stone-300">•</span>
            <span className="font-mono text-stone-700 font-semibold truncate">{vehicleConfig.specifications.mileageOrCycles}</span>
          </div>

          {/* Connection Pill */}
          <button
            onClick={onOpenConnectionModal}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs shadow-warm-sm transition-colors shrink-0"
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              isConnected ? 'bg-emerald-500'
              : connectionState === 'connecting' ? 'bg-amber-500 animate-ping'
              : 'bg-stone-300'
            }`} />
            <span className="font-mono font-bold text-stone-800 hidden sm:inline">
              {isConnected ? 'Connected' : connectionState === 'connecting' ? '...' : 'Off'}
            </span>
            {isConnected && (
              <span className="text-stone-400 text-[10px] hidden md:inline">
                {vehicleConfig.hardwareLink.latencyMs}ms
              </span>
            )}
          </button>

          {/* Report Button */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/25 transition-all shrink-0"
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Report</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 sm:p-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 relative shadow-warm-sm transition-colors"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-amber-500 text-white rounded-full text-[8px] sm:text-[9px] font-bold flex items-center justify-center border-2 border-white">
                  {alertCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-stone-200 rounded-2xl p-4 shadow-warm-xl z-50">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-900 uppercase font-mono">
                    Recent Alerts ({vehicleConfig.alerts.length})
                  </span>
                  <button onClick={() => setShowNotifications(false)} className="text-[11px] text-stone-400 hover:text-stone-700">
                    Close
                  </button>
                </div>
                <div className="mt-2.5 space-y-2">
                  {vehicleConfig.alerts.map((alt) => (
                    <div key={alt.id} className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs">
                      <div className="font-bold text-amber-950">{alt.title}</div>
                      <div className="text-[11px] text-amber-800 mt-0.5">{alt.whatHappened}</div>
                      <div className="text-[10px] text-amber-600 font-mono mt-1">{alt.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 shadow-warm-sm shrink-0">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
