import React from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import {
  FileText,
  Plus,
  Download,
  Eye
} from 'lucide-react';

interface ReportsTabProps {
  vehicleConfig: VehicleConfig;
  onOpenReportModal: () => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  vehicleConfig,
  onOpenReportModal
}) => {
  const reports = [
    {
      id: 'RPT-2026-0903',
      title: 'Periodic Health & Subsystem Inspection',
      date: 'Today, 10:45 AM',
      type: 'Routine Scan',
      score: vehicleConfig.healthIndex.overallScore,
      status: 'Verified',
      technician: 'Alex Mercer (Owner)'
    },
    {
      id: 'RPT-2026-0815',
      title: 'Pre-Trip Multi-Point Safety Inspection',
      date: 'Aug 15, 2026',
      type: 'Safety Check',
      score: 88,
      status: 'Passed',
      technician: 'Authorized Honda Care'
    },
    {
      id: 'RPT-2026-0610',
      title: '30,000 km Scheduled Service & Diagnostic Audit',
      date: 'Jun 10, 2026',
      type: 'Workshop Service',
      score: 91,
      status: 'Certified',
      technician: 'Apex Auto Service Ltd.'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Diagnostic &amp; Service Reports
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Verified inspection records and exportable mechanic service summaries.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenReportModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate New Report</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-stone-400">Total Reports</span>
          <div className="text-xl font-bold text-stone-900 mt-1">3 Records</div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">Stored in local garage</span>
        </div>
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-stone-400">Latest Health Score</span>
          <div className="text-xl font-bold text-orange-600 mt-1">{vehicleConfig.healthIndex.overallScore}/100</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Good Condition</span>
        </div>
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-stone-400">Last Verified</span>
          <div className="text-xl font-bold text-stone-900 mt-1">Today</div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">Via OBD-II Telemetry</span>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Report Archive
          </h3>
          <span className="text-xs text-stone-400">Showing all 3 reports</span>
        </div>

        <div className="divide-y divide-stone-100">
          {reports.map((rpt) => (
            <div
              key={rpt.id}
              className="p-4 hover:bg-stone-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                      {rpt.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {rpt.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {rpt.id} • {rpt.date} • By {rpt.technician}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <div className="text-right mr-2 hidden sm:block">
                  <span className="text-xs font-bold text-stone-900">{rpt.score}/100</span>
                  <span className="text-[10px] text-stone-400 block">Score</span>
                </div>

                <button
                  type="button"
                  onClick={onOpenReportModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-stone-400" />
                  <span>View</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenReportModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-stone-400" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
