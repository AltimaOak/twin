import type { VehicleHealthSummary, HealthBreakdown } from '../types/diagnostics';
import type { Vehicle } from '../types/vehicle';
import type { MaintenanceScheduleItem } from '../types/maintenance';
import { DTC_DATABASE } from '../data/dtcDatabase';
import { StorageService } from './storageService';

export class HealthService {
  public static calculateHealth(
    vehicle: Vehicle,
    maintenanceItems: MaintenanceScheduleItem[]
  ): VehicleHealthSummary {
    const clearedDtcs = StorageService.getClearedDtcs();
    const activeDtcs = DTC_DATABASE.filter(d => 
      !clearedDtcs.includes(d.code) &&
      d.affectedComponents.some(compId => vehicle.components.some(c => c.id === compId))
    );

    // Categories breakdown
    const powertrainComponents = vehicle.components.filter(c => c.category === 'powertrain');
    const electricalComponents = vehicle.components.filter(c => c.category === 'electrical');
    const brakingComponents = vehicle.components.filter(c => c.category === 'braking' || c.category === 'chassis');
    const coolingComponents = vehicle.components.filter(c => c.category === 'cooling');

    // 1. Powertrain Score (Weight 30%)
    let powertrainScore = 100;
    const ptDeductions: string[] = [];
    powertrainComponents.forEach(c => {
      if (c.status === 'warning') {
        powertrainScore -= 12;
        ptDeductions.push(`${c.shortName}: Minor parameter deviation`);
      } else if (c.status === 'critical') {
        powertrainScore -= 30;
        ptDeductions.push(`${c.shortName}: Critical parameter out of range`);
      }
    });
    if (activeDtcs.some(d => d.code === 'P0301')) {
      powertrainScore -= 8;
      ptDeductions.push('P0301: Intermittent cylinder 1 misfire logged');
    }
    powertrainScore = Math.max(0, Math.min(100, powertrainScore));

    // 2. Electrical & Battery (Weight 25%)
    let electricalScore = 100;
    const elecDeductions: string[] = [];
    electricalComponents.forEach(c => {
      if (c.status === 'warning') {
        electricalScore -= 15;
        elecDeductions.push(`${c.shortName}: Resting charge / SOH low`);
      } else if (c.status === 'critical') {
        electricalScore -= 35;
        elecDeductions.push(`${c.shortName}: Critical electrical fault`);
      }
    });
    if (activeDtcs.some(d => d.code === 'P0562')) {
      electricalScore -= 10;
      elecDeductions.push('P0562: Cold crank voltage dipped below 10.5V');
    }
    electricalScore = Math.max(0, Math.min(100, electricalScore));

    // 3. Thermal & Cooling (Weight 20%)
    let thermalScore = 100;
    const thermDeductions: string[] = [];
    coolingComponents.forEach(c => {
      if (c.status === 'warning') {
        thermalScore -= 15;
        thermDeductions.push(`${c.shortName}: Elevated operating temp`);
      }
    });
    if (activeDtcs.some(d => d.code === 'P0118')) {
      thermalScore -= 10;
      thermDeductions.push('P0118: Temp sensor spike during extended idle');
    }
    thermalScore = Math.max(0, Math.min(100, thermalScore));

    // 4. Braking & Safety (Weight 15%)
    let brakingScore = 100;
    const brakeDeductions: string[] = [];
    brakingComponents.forEach(c => {
      if (c.status === 'warning') {
        brakingScore -= 15;
        brakeDeductions.push(`${c.shortName}: Wear threshold reached`);
      }
    });
    brakingScore = Math.max(0, Math.min(100, brakingScore));

    // 5. Maintenance Adherence (Weight 10%)
    let maintScore = 100;
    const maintDeductions: string[] = [];
    maintenanceItems.forEach(item => {
      if (item.status === 'overdue') {
        maintScore -= 25;
        maintDeductions.push(`${item.name} is overdue`);
      } else if (item.status === 'due_soon') {
        maintScore -= 10;
        maintDeductions.push(`${item.name} due within next interval`);
      }
    });
    maintScore = Math.max(0, Math.min(100, maintScore));

    // Composite Weighted Score
    const compositeScore = Math.round(
      powertrainScore * 0.30 +
      electricalScore * 0.25 +
      thermalScore * 0.20 +
      brakingScore * 0.15 +
      maintScore * 0.10
    );

    let grade: 'A' | 'B' | 'C' | 'D' = 'A';
    let statusText = 'Optimal Condition';

    if (compositeScore >= 90) {
      grade = 'A';
      statusText = 'Great Overall Health';
    } else if (compositeScore >= 78) {
      grade = 'B';
      statusText = 'Good (Minor Items Due)';
    } else if (compositeScore >= 65) {
      grade = 'C';
      statusText = 'Attention Recommended';
    } else {
      grade = 'D';
      statusText = 'Immediate Inspection Required';
    }

    const breakdown: HealthBreakdown[] = [
      {
        category: 'Powertrain & Engine',
        score: powertrainScore,
        weight: 0.30,
        status: powertrainScore >= 85 ? 'good' : powertrainScore >= 70 ? 'fair' : 'poor',
        summary: powertrainScore >= 90 ? 'Operating smoothly with good combustion' : 'Minor misfire or sensor check recommended',
        deductions: ptDeductions
      },
      {
        category: 'Electrical & Battery',
        score: electricalScore,
        weight: 0.25,
        status: electricalScore >= 85 ? 'good' : electricalScore >= 70 ? 'fair' : 'poor',
        summary: electricalScore >= 85 ? 'Healthy charging system and voltage' : 'Battery resting charge dipping on cold starts',
        deductions: elecDeductions
      },
      {
        category: 'Cooling & Thermal',
        score: thermalScore,
        weight: 0.20,
        status: thermalScore >= 85 ? 'good' : thermalScore >= 70 ? 'fair' : 'poor',
        summary: thermalScore >= 85 ? 'Optimal thermal management and fluid flow' : 'Minor temperature spike recorded during idle',
        deductions: thermDeductions
      },
      {
        category: 'Brakes & Chassis',
        score: brakingScore,
        weight: 0.15,
        status: brakingScore >= 85 ? 'good' : brakingScore >= 70 ? 'fair' : 'poor',
        summary: brakingScore >= 85 ? 'Brake friction material & pressure healthy' : 'Brake pads approaching replacement thickness',
        deductions: brakeDeductions
      },
      {
        category: 'Service Schedules',
        score: maintScore,
        weight: 0.10,
        status: maintScore >= 85 ? 'good' : maintScore >= 70 ? 'fair' : 'poor',
        summary: maintScore >= 85 ? 'All scheduled maintenance up to date' : 'Service intervals due soon',
        deductions: maintDeductions
      }
    ];

    let summaryNote = `${vehicle.make} ${vehicle.model} is running well. Resolving minor battery and brake inspection items will keep your vehicle at 100%.`;
    if (vehicle.type === 'bike') {
      summaryNote = `${vehicle.make} ${vehicle.model} is in great riding shape. Cleaning and adjusting chain slack will restore full score.`;
    } else if (vehicle.type === 'rcCar') {
      summaryNote = `${vehicle.make} ${vehicle.model} telemetry is solid. Battery balance and motor temps are well within safe bounds.`;
    }

    return {
      overallScore: compositeScore,
      grade,
      statusText,
      breakdown,
      summaryNote
    };
  }
}
