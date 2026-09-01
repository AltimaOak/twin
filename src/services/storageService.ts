import type { ServiceLogRecord } from '../types/maintenance';
import { DEFAULT_SERVICE_HISTORY } from '../data/maintenanceDefaults';

const STORAGE_KEYS = {
  SERVICES: 'motomindx_service_records',
  CLEARED_DTCS: 'motomindx_cleared_dtcs',
  SETTINGS: 'motomindx_settings',
  LAST_VEHICLE: 'motomindx_active_vehicle_type'
};

export interface AppSettings {
  tempUnit: 'C' | 'F';
  speedUnit: 'kmh' | 'mph';
  pressureUnit: 'psi' | 'bar';
  simulationRateMs: number;
  autoConnect: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  tempUnit: 'C',
  speedUnit: 'kmh',
  pressureUnit: 'psi',
  simulationRateMs: 800,
  autoConnect: true
};

export class StorageService {
  static getServiceRecords(): ServiceLogRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load services from localStorage:', e);
    }
    return DEFAULT_SERVICE_HISTORY;
  }

  static saveServiceRecords(records: ServiceLogRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(records));
    } catch (e) {
      console.warn('Failed to save services to localStorage:', e);
    }
  }

  static addServiceRecord(record: Omit<ServiceLogRecord, 'id'>): ServiceLogRecord {
    const newRecord: ServiceLogRecord = {
      ...record,
      id: `srv-${Date.now()}`
    };
    const current = this.getServiceRecords();
    const updated = [newRecord, ...current];
    this.saveServiceRecords(updated);
    return newRecord;
  }

  static getClearedDtcs(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLEARED_DTCS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load cleared DTCs:', e);
    }
    return [];
  }

  static clearDtc(code: string): void {
    const cleared = this.getClearedDtcs();
    if (!cleared.includes(code)) {
      cleared.push(code);
      localStorage.setItem(STORAGE_KEYS.CLEARED_DTCS, JSON.stringify(cleared));
    }
  }

  static resetDtcs(): void {
    localStorage.removeItem(STORAGE_KEYS.CLEARED_DTCS);
  }

  static getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      console.warn('Failed to load settings:', e);
    }
    return DEFAULT_SETTINGS;
  }

  static saveSettings(settings: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
    return updated;
  }

  static getActiveVehicleType(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_VEHICLE) || 'car';
  }

  static setActiveVehicleType(type: string): void {
    localStorage.setItem(STORAGE_KEYS.LAST_VEHICLE, type);
  }
}
