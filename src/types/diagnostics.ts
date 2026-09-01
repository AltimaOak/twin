export type AlertUrgency = 'normal' | 'check_soon' | 'attention_required';

export interface DiagnosticCode {
  code: string;
  title: string;
  subsystem: string;
  urgency: AlertUrgency;
  description: string;
  whatHappened: string;
  whyItMatters: string;
  whatShouldIDo: string;
  affectedComponents: string[];
  freezeFrame?: Record<string, string | number>;
  timestamp: string;
  isCleared?: boolean;
}

export interface VehicleAlert {
  id: string;
  code?: string;
  title: string;
  subsystem: string;
  urgency: AlertUrgency;
  whatHappened: string;
  whyItMatters: string;
  whatShouldIDo: string;
  timestamp: string;
  componentId?: string;
}

export interface HealthBreakdown {
  category: string;
  score: number; // 0 - 100
  weight: number; // e.g. 0.30
  status: 'good' | 'fair' | 'poor';
  summary: string;
  deductions: string[];
}

export interface VehicleHealthSummary {
  overallScore: number; // 0 - 100
  grade: 'A' | 'B' | 'C' | 'D';
  statusText: string;
  breakdown: HealthBreakdown[];
  summaryNote: string;
}
