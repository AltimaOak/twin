import type { DiagnosticCode } from '../types/diagnostics';

export const DTC_DATABASE: DiagnosticCode[] = [
  {
    code: 'P0301',
    title: 'Cylinder 1 Misfire Detected',
    subsystem: 'Powertrain / Ignition',
    urgency: 'check_soon',
    description: 'The engine control module (ECM) detected that cylinder number 1 is not firing with full combustion consistency.',
    whatHappened: 'The vehicle detected that cylinder 1 in your engine skipped a combustion cycle during recent driving.',
    whyItMatters: 'A misfire can cause rough idling, a slight drop in fuel efficiency, and may slowly stress the catalytic converter if unaddressed.',
    whatShouldIDo: 'Have a technician inspect the spark plug and ignition coil for cylinder 1 during your next service.',
    affectedComponents: ['engine', 'battery'],
    freezeFrame: {
      'Engine RPM': '1,920 RPM',
      'Calculated Load': '42%',
      'Coolant Temp': '88°C',
      'Short Term Fuel Trim': '+3.2%',
      'Vehicle Speed': '54 km/h'
    },
    timestamp: '2 hours ago'
  },
  {
    code: 'P0118',
    title: 'Engine Coolant Temperature Sensor 1 Circuit High',
    subsystem: 'Cooling / Electrical',
    urgency: 'check_soon',
    description: 'The engine coolant temperature sensor reading has occasionally spiked near upper threshold.',
    whatHappened: 'Engine temperature readings were slightly above normal operating range during extended idling.',
    whyItMatters: 'If the coolant temp gets too high, the engine could overheat or run inefficiently.',
    whatShouldIDo: 'Check the coolant reservoir level and make sure the radiator fan is spinning freely.',
    affectedComponents: ['cooling', 'engine'],
    freezeFrame: {
      'Coolant Temp': '104°C',
      'Ambient Temp': '34°C',
      'Radiator Fan State': 'ON (High)',
      'Vehicle Speed': '12 km/h'
    },
    timestamp: 'Yesterday'
  },
  {
    code: 'P0562',
    title: 'System Voltage Low / Resting Drop',
    subsystem: 'Electrical / Charging',
    urgency: 'check_soon',
    description: 'The battery supply voltage dropped below 11.9V before initial engine starter engagement.',
    whatHappened: 'Battery voltage was lower than normal when the engine was cranked after resting overnight.',
    whyItMatters: 'An aging battery may eventually struggle to start your vehicle on chilly mornings or after sitting parked for several days.',
    whatShouldIDo: 'Have the 12V battery tested and terminals cleaned. It may be due for replacement in the next 3–6 months.',
    affectedComponents: ['battery'],
    freezeFrame: {
      'Cranking Voltage': '10.2V',
      'Resting Voltage': '11.8V',
      'Alternator Output': '14.1V (Charging OK)'
    },
    timestamp: '3 days ago'
  },
  {
    code: 'P0420',
    title: 'Catalyst System Efficiency Below Threshold (Bank 1)',
    subsystem: 'Exhaust & Emissions',
    urgency: 'check_soon',
    description: 'The downstream oxygen sensor indicates reduced catalytic cleaning efficiency compared to nominal factory levels.',
    whatHappened: 'The catalytic converter is filtering exhaust gases slightly less efficiently than expected.',
    whyItMatters: 'Your vehicle may emit slightly higher emissions and might not pass strict tailpipe smog testing.',
    whatShouldIDo: 'Have a mechanic check the downstream oxygen sensor and check for any minor exhaust leaks before replacing parts.',
    affectedComponents: ['exhaust'],
    timestamp: '5 days ago'
  },
  {
    code: 'MMX-RC-01',
    title: 'Brushless Motor High Temperature Throttle',
    subsystem: 'RC Powertrain',
    urgency: 'check_soon',
    description: 'Motor core temperature exceeded 75°C threshold during prolonged high-speed running.',
    whatHappened: 'The brushless motor got warm after continuous full-throttle bashing.',
    whyItMatters: 'High heat can weaken rotor neodymium magnets over time and reduce top speed.',
    whatShouldIDo: 'Let the RC vehicle rest for 5–10 minutes and check gear mesh / pinion teeth for proper clearance.',
    affectedComponents: ['rc-motor', 'rc-esc'],
    timestamp: '15 mins ago'
  },
  {
    code: 'MMX-EV-01',
    title: 'BMS Cell Balance & Voltage Symmetry',
    subsystem: 'EV High-Voltage Battery',
    urgency: 'normal',
    description: 'Battery management system reports nominal cell delta under 5mV across all 14 series groups.',
    whatHappened: 'All 21700 lithium cells are uniformly balanced with 3.92V per cell at 88% SOC.',
    whyItMatters: 'Proper cell balancing extends lithium pack lifespan and preserves TrueRange distance.',
    whatShouldIDo: 'No action needed. Periodic slow charging ensures continued cell balance.',
    affectedComponents: ['esc-battery', 'esc-bms'],
    freezeFrame: {
      'Pack Voltage': '51.4V',
      'Cell Delta': '4mV',
      'Pack Temp': '34°C',
      'State of Health': '98%'
    },
    timestamp: '1 hour ago'
  }
];
