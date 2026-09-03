import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { VehicleCategory, VehicleConfig } from '../../data/vehicleConfigurations';
import type { ConnectionState } from '../../types/device';
import {
  Car,
  Bike,
  Gamepad2,
  Bell,
  Check,
  Home,
  LogOut
} from 'lucide-react';
import { useVehicle } from '../../context/VehicleContext';

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
  onOpenReportModal: _onOpenReportModal,
  onOpenConnectionModal: _onOpenConnectionModal,
  alertCount
}) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useVehicle();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const isConnected = connectionState === 'connected';

  // Vehicle Icon outline in orange
  const renderVehicleIcon = () => {
    if (vehicleConfig.type === 'motorcycle') {
      return <Bike className="w-6 h-6 text-orange-600 stroke-[2]" />;
    }
    if (vehicleConfig.type === 'rc_car') {
      return <Gamepad2 className="w-6 h-6 text-orange-600 stroke-[2]" />;
    }
    return (
      /* Outline Car SVG matching reference */
      <svg className="w-6 h-6 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    );
  };

  return (
    <header className="w-full bg-white border-b border-stone-200/90 sticky top-0 z-20 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Home Button + Vehicle Title, Status & Last Updated */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Home Link (Direct way to return to Landing Page on Mobile & Desktop) */}
          <button
            type="button"
            onClick={() => navigate('/')}
            title="Return to Landing Page"
            className="p-1.5 sm:p-2 rounded-xl border border-stone-200/90 bg-white hover:bg-orange-50 hover:border-orange-300 text-stone-600 hover:text-orange-600 transition-colors shadow-xs shrink-0 cursor-pointer"
            aria-label="Return to Landing Page"
          >
            <Home className="w-4 h-4" />
          </button>

          <div className="shrink-0 p-1.5 rounded-xl bg-orange-50/50 hidden xs:block">
            {renderVehicleIcon()}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
              <h1 className="text-sm sm:text-base lg:text-lg font-bold text-stone-900 tracking-tight truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none">
                {vehicleConfig.model.name} <span className="hidden xs:inline text-stone-400 font-normal">{vehicleConfig.model.year}</span>
              </h1>

              {/* Status Pill Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold shrink-0 ${
                  isConnected
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? 'bg-emerald-500' : 'bg-stone-400'
                  }`}
                />
                <span className="hidden xs:inline">{isConnected ? 'Connected' : 'Offline'}</span>
              </span>
            </div>

            <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium mt-0.5 truncate">
              Last updated: Today, 10:45 AM
            </p>
          </div>
        </div>

        {/* Right: Change Vehicle, Notifications, User Avatar */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Change Vehicle Dropdown / Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors shadow-sm"
            >
              <Car className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Change Vehicle</span>
            </button>

            {/* Vehicle Selector Menu */}
            {showVehicleDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                  Switch Vehicle
                </div>

                <div className="space-y-1 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory('car');
                      setShowVehicleDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedCategory === 'car'
                        ? 'bg-orange-50 text-orange-700 font-semibold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-orange-600" />
                      <span>Honda City i-VTEC (Car)</span>
                    </div>
                    {selectedCategory === 'car' && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory('motorcycle');
                      setShowVehicleDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedCategory === 'motorcycle'
                        ? 'bg-orange-50 text-orange-700 font-semibold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Bike className="w-3.5 h-3.5 text-orange-600" />
                      <span>Honda CB350 (Motorcycle)</span>
                    </div>
                    {selectedCategory === 'motorcycle' && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory('rc_car');
                      setShowVehicleDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedCategory === 'rc_car'
                        ? 'bg-orange-50 text-orange-700 font-semibold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-3.5 h-3.5 text-orange-600" />
                      <span>Traxxas Slash (RC Model)</span>
                    </div>
                    {selectedCategory === 'rc_car' && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>
                </div>

                <div className="mt-1.5 pt-1.5 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowVehicleDropdown(false);
                      navigate('/select-vehicle');
                    }}
                    className="w-full text-center py-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Manage Garage &amp; Add New →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-600 transition-colors shadow-sm relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-stone-600" />
              {alertCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-600 ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-stone-200 rounded-2xl p-3 shadow-xl z-50">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-900">Notifications</span>
                  <span className="text-[10px] font-semibold text-orange-600">{alertCount} new</span>
                </div>
                <div className="space-y-2 py-2 text-xs">
                  {vehicleConfig.alerts.slice(0, 2).map((a) => (
                    <div key={a.id} className="p-2 rounded-lg bg-stone-50 text-stone-800">
                      <div className="font-semibold text-xs text-stone-900">{a.title}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{a.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar & Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              title={`User Profile: ${currentUser?.name || 'Driver'}`}
              className="w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center shadow-sm cursor-pointer transition-colors"
            >
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-stone-100">
                  <span className="font-bold text-xs text-stone-900 block truncate">
                    {currentUser?.name || 'Alex Mercer'}
                  </span>
                  <span className="text-[11px] text-stone-400 block truncate">
                    {currentUser?.email || 'alex.mercer@motomindx.io'}
                  </span>
                </div>

                <div className="py-1 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-orange-50 hover:text-orange-700 transition-colors cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5 text-orange-600" />
                    <span>Return to Landing Page</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
