import type { VehicleConfig } from '../../data/vehicleConfigurations';
import type { SidebarTab } from '../Sidebar/Sidebar';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    tab: SidebarTab;
  };
}

export const getInitialSuggestedPrompts = (vehicleConfig: VehicleConfig): string[] => {
  const isRC = vehicleConfig.type === 'rc_car';
  const isBike = vehicleConfig.type === 'motorcycle';

  if (isRC) {
    return [
      'Explain active warnings',
      'What is my LiPo voltage health?',
      'How do I calibrate steering trim?',
      'Check motor ESC temperatures'
    ];
  }

  if (isBike) {
    return [
      'Explain active alerts',
      'What is the recommended tyre pressure?',
      'When is my next chain service due?',
      'Estimate brake pad replacement in ₹'
    ];
  }

  return [
    'Explain active warning codes',
    'When is my next service due?',
    'Is my coolant temperature normal?',
    'Estimate routine maintenance cost in ₹'
  ];
};

export const generateDiagnosticResponse = (
  userPrompt: string,
  vehicleConfig: VehicleConfig
): { reply: string; action?: { label: string; tab: SidebarTab } } => {
  const query = userPrompt.toLowerCase().trim();
  const isRC = vehicleConfig.type === 'rc_car';
  const isBike = vehicleConfig.type === 'motorcycle';
  const vehicleName = vehicleConfig.model.name;

  // 1. ACTIVE ALERTS / FAULT CODES / WARNINGS
  if (
    query.includes('alert') ||
    query.includes('fault') ||
    query.includes('code') ||
    query.includes('warning') ||
    query.includes('dtc') ||
    query.includes('check engine')
  ) {
    if (vehicleConfig.alerts.length === 0) {
      return {
        reply: `Great news! There are **0 active diagnostic trouble codes** on your ${vehicleName}. All powertrain, braking, and electrical sub-controllers are operating within factory nominal thresholds.`,
        action: { label: 'View Diagnostics Tab', tab: 'diagnostics' }
      };
    }

    const alertSummaries = vehicleConfig.alerts
      .map(
        (a, i) =>
          `**${i + 1}. ${a.code ? `[${a.code}] ` : ''}${a.title}**\n` +
          `• **Subsystem:** ${a.subsystem}\n` +
          `• **Urgency:** ${a.urgency.toUpperCase()}\n` +
          `• **Diagnostic Finding:** ${a.whatHappened}\n` +
          `• **Next Step:** ${a.whatShouldIDo}`
      )
      .join('\n\n');

    return {
      reply: `Your **${vehicleName}** currently has **${vehicleConfig.alerts.length} active alert(s)**:\n\n${alertSummaries}\n\n💡 **Driver Safety Tip:** Unless a warning light is flashing red, you can drive gently to your trusted service center. Avoid aggressive acceleration.`,
      action: { label: 'Inspect Alerts & Codes', tab: 'alerts' }
    };
  }

  // 2. MAINTENANCE / SERVICE SCHEDULE / COSTS IN RUPEES
  if (
    query.includes('service') ||
    query.includes('maintenance') ||
    query.includes('cost') ||
    query.includes('rupee') ||
    query.includes('₹') ||
    query.includes('oil') ||
    query.includes('brake pad') ||
    query.includes('schedule')
  ) {
    if (isRC) {
      return {
        reply: `### Maintenance Schedule for ${vehicleName}:\n` +
          `• **Shock Oil Rebuild (35wt Silicone):** Recommended every 25 battery packs (~10 packs remaining). Estimated cost: **₹650** for fluid.\n` +
          `• **Slipper Clutch & Spur Gear Mesh:** Clean and check tension every 15 runs. Estimated spur gear replacement: **₹850**.\n` +
          `• **LiPo Battery Care:** Always balance-charge at 1C (typically 5.0A) and store at 3.85V per cell.`,
        action: { label: 'Open Maintenance Tab', tab: 'maintenance' }
      };
    }

    if (isBike) {
      return {
        reply: `### Service Advisory for ${vehicleName}:\n` +
          `• **Next Scheduled Service:** In **1,200 km** or **25 days**.\n` +
          `• **Engine Oil & Filter (10W-30 Full Synthetic):** Estimated cost **₹1,650 – ₹2,100**.\n` +
          `• **520 Drive Chain Clean & Lube:** Check slack (25–35mm) and lubricate every 500 km. Chain kit replacement: **₹2,800 – ₹3,400**.\n` +
          `• **Brake Fluid (DOT 4):** Due in 8 months (~₹450).\n\n` +
          `All maintenance items are tracked with Indian Rupee (₹) estimates to prevent dealer overcharging.`,
        action: { label: 'View Service Schedule', tab: 'maintenance' }
      };
    }

    return {
      reply: `### Service Schedule & Estimates for ${vehicleName} (Odometer: ${vehicleConfig.specifications.mileageOrCycles}):\n` +
        `• **Next Service Due:** In **2,350 km** or **45 days**.\n` +
        `• **Engine Oil & O.E. Filter (0W-20 Synthetic):** Estimated **₹3,200 – ₹4,100**.\n` +
        `• **Brake Pads (Front Ceramic):** ~60% life remaining (~12,000 km left). Replacement estimate: **₹2,600**.\n` +
        `• **Cabin Air & Engine Filter:** Inspection recommended next visit (~₹850).\n` +
        `• **Coolant Flush:** Normal level and condition; due at 100,000 km.\n\n` +
        `Would you like to log a service record or generate a mechanic handover sheet?`,
      action: { label: 'View Maintenance & Costs', tab: 'maintenance' }
    };
  }

  // 3. BATTERY / VOLTAGE / CHARGING / ELECTRICAL
  if (
    query.includes('battery') ||
    query.includes('voltage') ||
    query.includes('charging') ||
    query.includes('alternator') ||
    query.includes('stator') ||
    query.includes('lipo')
  ) {
    if (isRC) {
      return {
        reply: `### LiPo Battery Telemetry:\n` +
          `• **Current Pack Voltage:** **11.8 V** (Nominal 3S pack is 11.1V, fully charged is 12.6V).\n` +
          `• **Individual Cell Status:** ~3.93V per cell — balanced within 15mV.\n` +
          `• **Battery Health:** 88% remaining health (126 cycles completed).\n` +
          `• **Recommendation:** If you are not driving in the next 48 hours, put the battery in **Storage Mode (11.55V / 3.85V per cell)** to prevent swelling.`,
        action: { label: 'View Live Battery Sensor', tab: 'liveData' }
      };
    }

    const voltage = isBike ? '14.1 V' : '14.1 V';
    return {
      reply: `### 12V Electrical & Battery Health:\n` +
        `• **Current Telemetry:** **${voltage}** (Alternator charging is active and healthy).\n` +
        `• **Health Score:** 92% (Cold cranking capacity tested good).\n` +
        `• **Key Rules of Thumb:**\n` +
        `  - **Engine OFF:** Normal resting voltage should be **12.4V – 12.7V**.\n` +
        `  - **Engine RUNNING:** Alternator output should be **13.8V – 14.4V**.\n` +
        `  - Under 12.0V indicates a degraded battery needing charging or replacement (~₹4,500 – ₹6,000).`,
      action: { label: 'Inspect Live Telemetry', tab: 'liveData' }
    };
  }

  // 4. COOLANT / TEMPERATURE / OVERHEATING / ESC TEMP
  if (
    query.includes('temp') ||
    query.includes('coolant') ||
    query.includes('heat') ||
    query.includes('overheating') ||
    query.includes('radiator')
  ) {
    if (isRC) {
      return {
        reply: `### Brushless Motor & ESC Thermal Status:\n` +
          `• **ESC Temperature:** **42 °C** (Thermal cutoff is set at 95 °C — plenty of headroom).\n` +
          `• **Motor Can Temp:** **48 °C**.\n` +
          `• **Recommendation:** Running on tall grass or loose sand will increase thermal load. If temperatures exceed 75°C, consider gearing down 2 teeth on the pinion.`,
        action: { label: 'View Live Telemetry', tab: 'liveData' }
      };
    }

    const temp = isBike ? '82 °C' : '89 °C';
    return {
      reply: `### Cooling System Health for ${vehicleName}:\n` +
        `• **Current Engine Temp:** **${temp}** (Optimal operating temperature is between **85°C – 95°C**).\n` +
        `• **Thermostat & Water Pump:** Functioning nominally with continuous thermal loop circulation.\n` +
        `• **Radiator Fan:** Disengaged; activates automatically if temperature rises above 98°C in slow traffic.\n\n` +
        `Your cooling system is in excellent condition. No risk of overheating detected.`,
      action: { label: 'Inspect Cooling Subsystem in 3D', tab: 'digitalTwin' }
    };
  }

  // 5. RPM / ENGINE / POWERTRAIN / TRANSMISSION
  if (
    query.includes('rpm') ||
    query.includes('engine') ||
    query.includes('motor') ||
    query.includes('powertrain') ||
    query.includes('gear') ||
    query.includes('transmission')
  ) {
    if (isRC) {
      return {
        reply: `### RC Powertrain Status:\n` +
          `• **Motor:** Velineon 3500kV 4-Pole Brushless.\n` +
          `• **Telemetry RPM:** ~8,420 RPM at 35% throttle.\n` +
          `• **Drive:** 4WD Shaft-Driven steel outdrives.\n` +
          `• **Recommendation:** Check front & rear diff lube every 25 runs.`,
        action: { label: 'Inspect 3D Twin', tab: 'digitalTwin' }
      };
    }

    const rpm = isBike ? '1,200 rpm (Warm Idle)' : '1,850 rpm (Cruising)';
    return {
      reply: `### Powertrain & Engine Status:\n` +
        `• **Engine Speed:** **${rpm}**.\n` +
        `• **Idle Stability:** Steady with zero detected misfires.\n` +
        `• **Transmission:** Smooth torque conversion with normal fluid pressure telemetry.\n` +
        `• **Throttle Response:** Calibrated with 14ms bus latency.`,
      action: { label: 'View Powertrain in 3D', tab: 'digitalTwin' }
    };
  }

  // 6. 3D DIGITAL TWIN / PARTS LOOKUP
  if (
    query.includes('3d') ||
    query.includes('twin') ||
    query.includes('part') ||
    query.includes('assembly') ||
    query.includes('look') ||
    query.includes('show me')
  ) {
    return {
      reply: `I can show you your **${vehicleName}** in our interactive 3D viewer!\n\n` +
        `• You can rotate 360°, zoom, and switch camera angles.\n` +
        `• Toggle **X-Ray mode** to see hidden internal parts like the engine, brake calipers, cooling channels, and battery.\n` +
        `• Tap any subsystem to highlight it and view live sensor health.`,
      action: { label: 'Open 3D Digital Twin', tab: 'digitalTwin' }
    };
  }

  // 7. MECHANIC REPORT / INSPECTION HANDOVER
  if (
    query.includes('report') ||
    query.includes('mechanic') ||
    query.includes('pdf') ||
    query.includes('export') ||
    query.includes('handover')
  ) {
    return {
      reply: `### Verified Mechanic Inspection Report:\n` +
        `You can generate an official, exportable 1-page health report for your **${vehicleName}** (Health Index: **${vehicleConfig.healthIndex.overallScore}/100**).\n\n` +
        `• Summarizes all sensor monitors and diagnostic codes in plain language.\n` +
        `• Includes repair cost estimates in Indian Rupees (₹) to prevent unnecessary garage upsells.\n` +
        `• Ready for PDF download or WhatsApp sharing with your mechanic.`,
      action: { label: 'View Reports & Exports', tab: 'reports' }
    };
  }

  // 8. DEFAULT / GENERAL AUTOMOTIVE INQUIRY
  return {
    reply: `I'm **MotoMind Copilot**, your real-time vehicle diagnostic assistant for your **${vehicleName}**.\n\n` +
      `Here is a summary of your vehicle's current status:\n` +
      `• **Overall Health Score:** **${vehicleConfig.healthIndex.overallScore}/100** (Good Condition)\n` +
      `• **Active Fault Codes:** ${vehicleConfig.alerts.length} active issue(s)\n` +
      `• **Next Service:** Due in ${isRC ? '10 cycles' : isBike ? '1,200 km' : '2,350 km'}\n\n` +
      `You can ask me questions such as:\n` +
      `• *"Explain my active warning codes"*\n` +
      `• *"When is my next oil change and how much will it cost in ₹?"*\n` +
      `• *"Is my 12V battery voltage healthy?"*\n` +
      `• *"Show me the cooling system in 3D"*`,
    action: { label: 'View Overview Dashboard', tab: 'dashboard' }
  };
};
