import React from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import {
  FileText,
  Printer,
  X,
  AlertTriangle,
  Wrench,
  Gauge,
  ShieldCheck
} from 'lucide-react';

interface MechanicReportModalProps {
  vehicleConfig: VehicleConfig;
  onClose: () => void;
}

export const MechanicReportModal: React.FC<MechanicReportModalProps> = ({
  vehicleConfig,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-warm-xl overflow-hidden my-auto">
        {/* Modal Top Bar (Hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-stone-900 uppercase font-mono tracking-wider">
                Official MotoMindX Mechanic Diagnostic Report
              </h2>
              <p className="text-xs text-stone-500">
                Ready to show your technician or print as an automotive service work order
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/25 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Sheet Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-900 bg-white mechanic-report-sheet">
          {/* Header Branding */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b-2 border-stone-200">
            <div>
              <div className="text-2xl font-black font-display tracking-tight text-stone-900">
                MotoMind<span className="text-orange-600">X</span>
              </div>
              <div className="text-xs uppercase font-mono tracking-widest text-stone-500 mt-0.5">
                Automotive Telematics & Health Diagnostics Summary
              </div>
            </div>

            <div className="text-right text-xs font-mono text-stone-600 space-y-0.5">
              <div>Report Date: <strong>{reportDate}</strong></div>
              <div>Diagnostic Link: <strong>{vehicleConfig.hardwareLink.protocol}</strong></div>
              <div>Device ID: <strong>{vehicleConfig.hardwareLink.deviceId}</strong></div>
            </div>
          </div>

          {/* Vehicle Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#fbf9f4] rounded-xl border border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-mono font-bold">
                Vehicle
              </span>
              <span className="font-bold text-stone-900 text-sm">
                {vehicleConfig.model.name} {vehicleConfig.model.year}
              </span>
            </div>

            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-mono font-bold">
                Odometer / Cycles
              </span>
              <span className="font-bold text-stone-900 text-sm font-mono">
                {vehicleConfig.specifications.mileageOrCycles}
              </span>
            </div>

            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-mono font-bold">
                Identifier / VIN
              </span>
              <span className="font-mono text-stone-900 text-xs font-bold truncate block">
                {vehicleConfig.model.vinOrSerial}
              </span>
            </div>

            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-mono font-bold">
                Health Score
              </span>
              <span className="font-bold text-orange-600 text-sm font-mono">
                {vehicleConfig.healthIndex.overallScore} / 100 ({vehicleConfig.healthIndex.grade})
              </span>
            </div>
          </div>

          {/* Section 1: Subsystem Health Index */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase font-mono tracking-wider text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>1. Subsystem Health Index</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {vehicleConfig.healthIndex.subsystems.map((sub) => (
                <div key={sub.id} className="p-3 bg-[#fbf9f4] rounded-lg border border-stone-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-stone-900">{sub.name}</div>
                    <div className="text-[10px] text-stone-500">{sub.summary}</div>
                  </div>
                  <div className="font-mono font-black text-stone-900 text-sm">{sub.score}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Active Alerts & DTCs */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase font-mono tracking-wider text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>2. Active Fault Codes & Diagnostic Findings</span>
            </div>

            {vehicleConfig.alerts.length === 0 ? (
              <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-800 font-mono">
                No active DTCs present. All ECU onboard monitors passed readiness checks.
              </div>
            ) : (
              <div className="space-y-2.5">
                {vehicleConfig.alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-3.5 bg-[#fbf9f4] rounded-xl border border-stone-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {alt.code && (
                          <span className="px-2 py-0.5 rounded bg-stone-200 font-mono font-bold text-stone-800">
                            {alt.code}
                          </span>
                        )}
                        <span className="font-bold text-stone-900 text-sm">
                          {alt.title}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-amber-700 uppercase font-bold">
                        Urgency: {alt.urgency}
                      </span>
                    </div>

                    <p className="text-stone-700 leading-relaxed">
                      <strong>Observation: </strong>{alt.whatHappened}
                    </p>

                    <div className="p-2 rounded bg-orange-50/60 border border-orange-200 text-[11px] text-orange-950">
                      <strong>Technician Guidance: </strong>{alt.whatShouldIDo}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Live Telemetry Readings */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase font-mono tracking-wider text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
              <Gauge className="w-4 h-4 text-sky-600" />
              <span>3. Live Telemetry Readings</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {vehicleConfig.sensors.map((s) => (
                <div key={s.id} className="p-2.5 bg-[#fbf9f4] rounded-lg border border-stone-200">
                  <div className="text-[10px] text-stone-500 font-medium">{s.label}</div>
                  <div className="font-mono font-bold text-stone-900 mt-0.5">
                    {s.value} {s.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Scheduled Maintenance Checklist */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase font-mono tracking-wider text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>4. Scheduled Maintenance Checklist</span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-mono">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Status / Remaining</th>
                  <th className="py-2">Action / Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {vehicleConfig.maintenance.map((m) => (
                  <tr key={m.id}>
                    <td className="py-2 font-bold text-stone-900">{m.name}</td>
                    <td className="py-2 font-mono text-stone-700">{m.remainingValue}</td>
                    <td className="py-2 text-stone-600 text-[11px]">{m.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Technician Sign-Off Box */}
          <div className="mt-6 pt-4 border-t-2 border-stone-200 grid grid-cols-2 gap-6 text-xs text-stone-600 font-mono">
            <div>
              <div>Technician Signature: _______________________</div>
              <div className="mt-3">Workshop Name: __________________________</div>
            </div>
            <div className="text-right">
              <div>Date of Inspection: _______________________</div>
              <div className="mt-3">Work Order #: ___________________________</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
