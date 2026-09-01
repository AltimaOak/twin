export type MaintenanceStatus = 'good' | 'due_soon' | 'overdue';

export interface MaintenanceScheduleItem {
  id: string;
  name: string;
  category: 'powertrain' | 'fluids' | 'brakes' | 'tyres' | 'filters' | 'general';
  intervalKm: number;
  intervalDays?: number;
  lastPerformedKm: number;
  lastPerformedDate: string;
  dueKm: number;
  remainingKm: number;
  status: MaintenanceStatus;
  urgencyDescription: string;
  recommendedAction: string;
  estimatedCostRange: string;
}

export interface ServiceLogRecord {
  id: string;
  date: string;
  odometerKm: number;
  serviceType: string;
  serviceCategory: string;
  workshopOrMechanic: string;
  notes: string;
  cost?: number;
  replacedParts?: string[];
}

export interface VehicleTimelineEvent {
  id: string;
  timestamp: string;
  dateStr: string;
  type: 'alert' | 'service' | 'health_change' | 'trip' | 'dtc';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  metricSnippet?: string;
}
