import React, { createContext, useContext, useState, useEffect } from 'react';
import type { VehicleCategory, VehicleConfig } from '../data/vehicleConfigurations';
import { VEHICLE_CONFIGURATIONS } from '../data/vehicleConfigurations';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

interface VehicleContextType {
  currentUser: UserProfile | null;
  userVehicles: VehicleConfig[];
  activeVehicle: VehicleConfig;
  selectedCategory: VehicleCategory;
  login: (email: string, password?: string, name?: string) => boolean;
  signup: (name: string, email: string, password?: string) => boolean;
  logout: () => void;
  setSelectedCategory: (cat: VehicleCategory) => void;
  saveConfiguredVehicle: (config: VehicleConfig) => void;
  switchActiveVehicle: (vehicleId: string) => void;
}

const STORAGE_KEYS = {
  USER: 'motomindx_user',
  VEHICLES: 'motomindx_user_vehicles',
  ACTIVE_ID: 'motomindx_active_vehicle_id',
  ACTIVE_CAT: 'motomindx_active_cat'
};

const defaultFallbackValue: VehicleContextType = {
  currentUser: {
    id: 'usr-demo-01',
    name: 'Alex Mercer',
    email: 'alex.mercer@motomindx.io',
    isAuthenticated: true
  },
  userVehicles: [
    VEHICLE_CONFIGURATIONS.car,
    VEHICLE_CONFIGURATIONS.motorcycle,
    VEHICLE_CONFIGURATIONS.scooter,
    VEHICLE_CONFIGURATIONS.rc_car
  ],
  activeVehicle: VEHICLE_CONFIGURATIONS.car,
  selectedCategory: 'car',
  login: () => true,
  signup: () => true,
  logout: () => {},
  setSelectedCategory: () => {},
  saveConfiguredVehicle: () => {},
  switchActiveVehicle: () => {}
};

const VehicleContext = createContext<VehicleContextType>(defaultFallbackValue);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Current Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (_e) {
      // ignore
    }
    // Default demo user so if directly accessed it works
    return {
      id: 'usr-demo-01',
      name: 'Alex Mercer',
      email: 'alex.mercer@motomindx.io',
      isAuthenticated: true
    };
  });

  // 2. Selected Category
  const [selectedCategory, setSelectedCategoryState] = useState<VehicleCategory>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_CAT);
      if (saved && (saved === 'car' || saved === 'motorcycle' || saved === 'scooter' || saved === 'rc_car')) {
        return saved as VehicleCategory;
      }
    } catch (_e) {
      // ignore
    }
    return 'car';
  });

  // 3. User Vehicles
  const [userVehicles, setUserVehicles] = useState<VehicleConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_e) {
      // ignore
    }
    return [
      VEHICLE_CONFIGURATIONS.car,
      VEHICLE_CONFIGURATIONS.motorcycle,
      VEHICLE_CONFIGURATIONS.scooter,
      VEHICLE_CONFIGURATIONS.rc_car
    ];
  });

  // 4. Active Vehicle
  const [activeVehicle, setActiveVehicle] = useState<VehicleConfig>(() => {
    return VEHICLE_CONFIGURATIONS[selectedCategory] || VEHICLE_CONFIGURATIONS.car;
  });

  // Sync to local storage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (_e) {
      // ignore
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(userVehicles));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CAT, selectedCategory);
    } catch (_e) {
      // ignore
    }
  }, [userVehicles, selectedCategory]);

  const login = (email: string, _password?: string, name?: string): boolean => {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || (email.split('@')[0].replace(/[._]/g, ' ') || 'Diagnostic Tech'),
      email,
      isAuthenticated: true
    };
    setCurrentUser(user);
    return true;
  };

  const signup = (name: string, email: string, _password?: string): boolean => {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || 'Vehicle Owner',
      email,
      isAuthenticated: true
    };
    setCurrentUser(user);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const setSelectedCategory = (cat: VehicleCategory) => {
    setSelectedCategoryState(cat);
    // Find matching vehicle or fallback to default preset
    const match = userVehicles.find((v) => v.type === cat) || VEHICLE_CONFIGURATIONS[cat];
    setActiveVehicle(match);
  };

  const saveConfiguredVehicle = (newConfig: VehicleConfig) => {
    // Replace or append
    setUserVehicles((prev) => {
      const existingIdx = prev.findIndex((v) => v.id === newConfig.id || v.type === newConfig.type);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newConfig;
        return updated;
      }
      return [newConfig, ...prev];
    });

    setSelectedCategoryState(newConfig.type);
    setActiveVehicle(newConfig);
  };

  const switchActiveVehicle = (vehicleId: string) => {
    const match = userVehicles.find((v) => v.id === vehicleId);
    if (match) {
      setSelectedCategoryState(match.type);
      setActiveVehicle(match);
    }
  };

  return (
    <VehicleContext.Provider
      value={{
        currentUser,
        userVehicles,
        activeVehicle,
        selectedCategory,
        login,
        signup,
        logout,
        setSelectedCategory,
        saveConfiguredVehicle,
        switchActiveVehicle
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  return context || defaultFallbackValue;
};
