import React from "react";
import {
  Briefcase,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Star,
} from "lucide-react";

import { BusinessAnalysisReport } from "../types/types";

interface ReportHistoryProps {
  historyList: BusinessAnalysisReport[];
  selectedReportId: string | null;

  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;

  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;

  onSelect: (report: BusinessAnalysisReport) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

export default function ReportHistory({
  historyList,
  searchTerm,
  setSearchTerm,
  expanded,
  setExpanded,
  selectedReportId,
  onSelect,
  onDelete,
  onToggleFavorite,
  onClearAll,
}: ReportHistoryProps) {
  // Live Search
  const filteredHistory = historyList.filter((report) => {
    const query = searchTerm.toLowerCase();

    return (
      report.businessName.toLowerCase().includes(query) ||
      report.elevatorPitch.toLowerCase().includes(query) ||
      report.createdAt.toLowerCase().includes(query)
    );
  });

  if (historyList.length === 0) {
    return (
      <div className="bg-slate-900 border border-neutral-900/5 rounded-sm p-6 text-center space-y-3 shadow-inner">
        <div className="w-10 h-10 rounded-sm bg-neutral-900/5 flex items-center justify-center mx-auto">
          <Briefcase className="w-5 h-5 text-gold-500/60" />
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900/80">
            No Saved Audits Yet
          </h4>

          <p className="text-[10px] text-neutral-900/40 uppercase tracking-wide max-w-[200px] mx-auto leading-normal">
            Validate startup ideas above and click "Save to History" to persist
            them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-neutral-900/5 rounded-sm shadow-xl overflow-hidden flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-neutral-900/5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-gold-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gold-500" />
            )}

            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-500">
              Saved Analyses
            </span>
          </div>

          <span className="text-xs text-neutral-500">
            {historyList.length} Reports
          </span>
        </button>
      </div>

      {expanded && (
        <>

          {/* Search */}
          <div className="p-3 border-b border-neutral-900/5">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-200 rounded-sm px-3 py-2 text-xs text-neutral-900 placeholder-slate-400/40 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Clear All */}
          <div className="flex justify-end px-3 py-2 border-b border-neutral-900/5">
            <button
              onClick={onClearAll}
              className="text-[9px] uppercase tracking-wider font-semibold text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          </div>

          {/* Reports */}
          <div className="divide-y divide-white/5 max-h-[360px] overflow-y-auto scrollbar-none">

            {filteredHistory.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-500">
                No reports found.
              </div>
            ) : (
              filteredHistory.map((report) => {
                const isSelected = selectedReportId === report.id;

                return (
                  <div
                    key={report.id}
                    onClick={() => onSelect(report)}
                    className={`p-4 flex justify-between items-start gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-gold-500/10 border-l-2 border-gold-500"
                        : "hover:bg-neutral-900/5 border-l-2 border-transparent"
                    }`}
                  >
                    {/* Left Side */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4
                        className={`truncate font-bold ${
                          isSelected
                            ? "text-gold-600 text-sm"
                            : "text-neutral-900 text-xs"
                        }`}
                      >
                        {report.businessName}
                      </h4>

                      <p className="text-[10px] text-neutral-900/50 truncate italic">
                        "{report.elevatorPitch}"
                      </p>

                      <div className="flex items-center gap-1 text-[9px] text-neutral-900/30 uppercase tracking-wider">
                        <Calendar className="w-3 h-3" />
                        <span>{report.createdAt}</span>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-1">

                      <button
                        onClick={(e) => onToggleFavorite(report.id, e)}
                        title="Favorite"
                        className="p-1 rounded hover:bg-neutral-900/5 transition"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            report.favorite
                              ? "fill-yellow-400 text-gold-700"
                              : "text-neutral-900/30"
                          }`}
                        />
                      </button>

                      <button
                        onClick={(e) => onDelete(report.id, e)}
                        title="Delete"
                        className="p-1 rounded hover:bg-neutral-900/5 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <ChevronRight
                        className={`w-4 h-4 ${
                          isSelected
                            ? "text-gold-600"
                            : "text-neutral-900/20"
                        }`}
                      />

                    </div>
                  </div>
                );
              })
            )}

          </div>

        </>
      )}

    </div>
  );
}