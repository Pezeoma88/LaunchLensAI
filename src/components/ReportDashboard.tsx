import React, { useState } from "react";
import {
  TrendingUp,
  ShieldCheck,
  Globe,
  Users,
  DollarSign,
  Grid,
  Rocket,
  Copy,
  Check,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  Zap,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import { BusinessAnalysisReport } from "../types/types";
import MarketChart from "./MarketChart";

interface ReportDashboardProps {
  report: BusinessAnalysisReport;
  onSave: () => void;
  isSaved: boolean;
}

type TabType =
  | "all"
  | "competitors"
  | "patents"
  | "domains"
  | "market"
  | "monetization"
  | "swot"
  | "launch";

export default function ReportDashboard({ report, onSave, isSaved }: ReportDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [copiedPitch, setCopiedPitch] = useState(false);

  const copyPitchToClipboard = () => {
    navigator.clipboard.writeText(`"${report.businessName}" - ${report.elevatorPitch}`);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const getRiskBadgeColor = (level: 'Low' | 'Medium' | 'High' | string) => {
    switch (level) {
      case 'High':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Highly Likely':
        return 'bg-gold-500/10 text-gold-600 border border-gold-500/20';
      case 'Moderately Likely':
        return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
      default:
        return 'bg-slate-800 text-slate-600 border border-neutral-900/5';
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Brand & Elevator Pitch Card */}
      <div className="relative overflow-hidden bg-slate-900 border border-neutral-900/5 rounded-sm p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="bg-gold-500/5 text-gold-600 text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-sm font-bold border border-gold-500/20">
                AI Suggested Brand Name
              </span>
              <span className="text-[10px] font-mono text-neutral-900/30 uppercase tracking-widest">{report.createdAt}</span>
            </div>
          <h2
  className="
    text-5xl
    font-semibold
    tracking-wide
    text-gold-500
    font-serif
  ">
  {report.businessName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()}
</h2>
            <div className="flex items-center gap-2 text-neutral-900/80 max-w-2xl py-1 text-md leading-relaxed font-light">
              <span className="
    mt-3
    text-gray-600
    text-lg
    leading-8
    font-light
  "
                >
  {report.elevatorPitch}</span>
              <button
                onClick={copyPitchToClipboard}
                title="Copy brand suggestion & elevator pitch"
                className="p-1 text-neutral-900/30 hover:text-gold-600 transition-colors rounded-sm hover:bg-neutral-900/5 shrink-0"
              >
                {copiedPitch ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={onSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all border ${
                isSaved
                  ? "bg-gold-500/10 text-gold-600 border-gold-500/30"
                  : "bg-gold-500 text-black border-transparent hover:bg-gold-600"
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-gold-600" />
                  Saved in History
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  Save to History
                </>
              )}
            </button>
          </div>
        </div>

        {/* Query Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-neutral-900/5 text-xs">
          <div>
            <span className="text-neutral-900/40 uppercase tracking-[0.12em] block mb-1">Core Business Idea</span>
            <span className="text-sm text-slate-700 font-normal text-neutral-900 text-sm line-clamp-1" title={report.inputIdea}>
              {report.inputIdea}
            </span>
          </div>
          {report.industry && (
            <div>
              <span className="text-neutral-900/40 uppercase tracking-[0.12em] block mb-1">Industry Segment</span>
              <span className="font-serif italic text-neutral-900 text-sm">{report.industry}</span>
            </div>
          )}
          {report.targetAudience && (
            <div>
              <span className="text-neutral-900/40 uppercase tracking-[0.12em] block mb-1">Target Market Audience</span>
              <span className="font-serif italic text-neutral-900 text-sm">{report.targetAudience}</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation tabs: custom horizontal serif navigation grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-gold-500/15 border border-gold-500/20 rounded-sm overflow-hidden shadow-2xl">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex flex-col items-center justify-center gap-1.5 p-4 transition-all ${
            activeTab === "all"
              ? "bg-slate-900 text-gold-600 font-medium border-b-2 border-gold-500"
              : "bg-slate-950 text-neutral-900/40 hover:text-neutral-900 hover:bg-gold-500/5"
          }`}
        >
          <Zap className={`w-5 h-5 shrink-0 transition-colors ${activeTab === "all" ? "text-gold-500" : "text-neutral-900/25"}`} />
          <span className="
                text-[11px]
    font-medium
    tracking-wide
    text-gray-600
               "
              >
    Overview</span>
        </button>
        <button
          onClick={() => setActiveTab("competitors")}
          className={`flex flex-col items-center justify-center gap-1.5 p-4 transition-all ${
            activeTab === "competitors"
              ? "bg-slate-900 text-gold-600 font-medium border-b-2 border-gold-500"
              : "bg-slate-950 text-neutral-900/40 hover:text-neutral-900 hover:bg-gold-500/5"
          }`}
        >
          <Users className={`w-5 h-5 shrink-0 transition-colors ${activeTab === "competitors" ? "text-gold-500" : "text-neutral-900/25"}`} />
          <span className="
    text-xs
    uppercase
    font-semibold
    tracking-wider
    text-slate-700
  "
>
  competitors</span>
        </button>
        <button
          onClick={() => setActiveTab("patents")}
          className={`flex flex-col items-center justify-center gap-1.5 p-4 transition-all ${
            activeTab === "patents"
              ? "bg-slate-900 text-gold-600 font-medium border-b-2 border-gold-500"
              : "bg-slate-950 text-neutral-900/40 hover:text-neutral-900 hover:bg-gold-500/5"
          }`}
        >
          <ShieldCheck className={`w-5 h-5 shrink-0 transition-colors ${activeTab === "patents" ? "text-gold-500" : "text-neutral-900/25"}`} />
          <span className="
    text-xs
    uppercase
    font-semibold
    tracking-wider
    text-slate-700
  "
  >
    patents</span>
        </button>
        <button
          onClick={() => setActiveTab("domains")}
          className={`flex flex-col items-center justify-center gap-1.5 p-4 transition-all ${
            activeTab === "domains"
              ? "bg-slate-900 text-gold-600 font-medium border-b-2 border-gold-500"
              : "bg-slate-950 text-neutral-900/40 hover:text-neutral-900 hover:bg-gold-500/5"
          }`}
        >
          <Globe className={`w-5 h-5 shrink-0 transition-colors ${activeTab === "domains" ? "text-gold-500" : "text-neutral-900/25"}`} />
          <span className="
    text-xs
    uppercase
    font-semibold
    tracking-wider
    text-slate-700
  "
  > 
  domains</span>
        </button>
        <button
          onClick={() => setActiveTab("market")}
          className={`flex flex-col items-center justify-center gap-1.5 p-4 transition-all ${
            activeTab === "market"
              ? "bg-slate-900 text-gold-600 font-medium border-b-2 border-gold-500"
              : "bg-slate-950 text-neutral-900/40 hover:text-neutral-900 hover:bg-gold-500/5"
          }`}
        >
          <TrendingUp className={`w-5 h-5 shrink-0 transition-colors ${activeTab === "market" ? "text-gold-500" : "text-neutral-900/25"}`} />
          <span className="
    text-xs
    uppercase
    font-semibold
    tracking-wider
    text-slate-700
  "
  >
  market size</span>
        </button>
        <button
          onClick={() => setActiveTab("monetization")}
          className={`flex flex-col items-center justify-center gap-1.5 p-4 transition-all ${
            activeTab === "monetization"
              ? "bg-slate-900 text-gold-600 font-medium border-b-2 border-gold-500"
              : "bg-slate-950 text-neutral-900/40 hover:text-neutral-900 hover:bg-gold-500/5"
          }`}
        >
          <DollarSign className={`w-5 h-5 shrink-0 transition-colors ${activeTab === "monetization" ? "text-gold-500" : "text-neutral-900/25"}`} />
          <span className="
    text-xs
    uppercase
    font-semibold
    tracking-wider
    text-slate-700
  "
  >
    monetization</span>
        </button>
        <button
          onClick={() => setActiveTab("swot")}
          className={`flex flex-col items-center justify-center gap-1.5 p-4 transition-all ${
            activeTab === "swot"
              ? "bg-slate-900 text-gold-600 font-medium border-b-2 border-gold-500"
              : "bg-slate-950 text-neutral-900/40 hover:text-neutral-900 hover:bg-gold-500/5"
          }`}
        >
          <Grid className={`w-5 h-5 shrink-0 transition-colors ${activeTab === "swot" ? "text-gold-500" : "text-neutral-900/25"}`} />
          <span className="
    text-xs
    uppercase
    font-semibold
    tracking-wider
    text-slate-700
  "
  >
    swot analysis</span>
        </button>
        <button
          onClick={() => setActiveTab("launch")}
          className={`flex flex-col items-center justify-center gap-1.5 p-4 transition-all ${
            activeTab === "launch"
              ? "bg-slate-900 text-gold-600 font-medium border-b-2 border-gold-500"
              : "bg-slate-950 text-neutral-900/40 hover:text-neutral-900 hover:bg-gold-500/5"
          }`}
        >
          <Rocket className={`w-5 h-5 shrink-0 transition-colors ${activeTab === "launch" ? "text-gold-500" : "text-neutral-900/25"}`} />
          <span className="
    text-xs
    uppercase
    font-semibold
    tracking-wider
    text-slate-700
  "
  >
    launch roadmap</span>
        </button>
      </div>

      {/* Render Contents */}
      {/* ----------------- 1. EXECUTIVE SUMMARY (ALL) ----------------- */}
      {activeTab === "all" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats Block */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market size brief */}
            <div className="bg-slate-900 p-6 rounded-sm border border-neutral-900/5 shadow-inner space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-neutral-900 flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
                  <TrendingUp className="w-4 h-4 text-gold-500" />
                  Target Addressable Market (TAM) Analysis
                </h3>
                <span className="text-2xl font-serif italic text-gold-500 font-bold">
                  {report.marketSize.tamValue}
                </span>
              </div>
              <p className="text-neutral-900/70 text-xs leading-relaxed font-light">
                {report.marketSize.tamDesc}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-900/5">
                <div>
                  <span className="text-neutral-900/40 text-[9px] block font-bold uppercase tracking-widest">SAM (Serviceable Addressable)</span>
                  <span className="font-bold text-gold-600 font-serif italic text-md mt-1 block">{report.marketSize.samValue}</span>
                </div>
                <div>
                  <span className="text-neutral-900/40 text-[9px] block font-bold uppercase tracking-widest">SOM (Serviceable Obtainable)</span>
                  <span className="font-bold text-gold-600 font-serif italic text-md mt-1 block">{report.marketSize.somValue}</span>
                </div>
              </div>
            </div>

            {/* Launch Roadmap Summary */}
            <div className="bg-slate-900 p-6 rounded-sm border border-neutral-900/5 shadow-inner space-y-4">
              <h3 className="font-bold text-neutral-900 flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
                <Rocket className="w-4 h-4 text-gold-500" />
                Launch Strategy Outline
              </h3>
              <div className="space-y-4">
                {report.launchStrategy.map((phase, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="w-6 h-6 rounded-sm bg-gold-500/10 text-gold-600 flex items-center justify-center font-bold font-serif italic text-[11px] mt-0.5 shrink-0 border border-gold-500/20">
                      0{idx + 1}
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2.5">
                        <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">{phase.phase}</h4>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-900/40">{phase.timeline}</span>
                      </div>
                      <p className="text-neutral-900/60 text-[11px] line-clamp-1 italic">
                        First Milestone: {phase.milestones[0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab("launch")}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-500 hover:text-gold-600 transition-all mt-2 cursor-pointer"
              >
                View Complete Strategic Roadmap <ArrowRight className="w-3.5 h-3.5 text-gold-500" />
              </button>
            </div>
          </div>

          {/* SWOT Overview Matrix */}
          <div className="bg-slate-900 p-6 rounded-sm border border-neutral-900/5 shadow-inner flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-neutral-900 flex items-center gap-2 text-xs uppercase tracking-[0.15em] mb-4">
                <Grid className="w-4 h-4 text-gold-500" />
                SWOT Matrix Summary
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-slate-950 p-3 rounded-sm border border-neutral-900/5">
                  <span className="font-bold text-emerald-600 block mb-1 uppercase tracking-wider text-[8px]">Strengths</span>
                  <ul className="text-neutral-900/60 space-y-1">
                    <li className="line-clamp-2 leading-relaxed">✔ {report.swot.strengths[0]}</li>
                  </ul>
                </div>
                <div className="bg-slate-950 p-3 rounded-sm border border-neutral-900/5">
                  <span className="font-bold text-rose-600 block mb-1 uppercase tracking-wider text-[8px]">Weaknesses</span>
                  <ul className="text-neutral-900/60 space-y-1">
                    <li className="line-clamp-2 leading-relaxed">✗ {report.swot.weaknesses[0]}</li>
                  </ul>
                </div>
                <div className="bg-slate-950 p-3 rounded-sm border border-neutral-900/5">
                  <span className="font-bold text-blue-600 block mb-1 uppercase tracking-wider text-[8px]">Opportunities</span>
                  <ul className="text-neutral-900/60 space-y-1">
                    <li className="line-clamp-2 leading-relaxed">✦ {report.swot.opportunities[0]}</li>
                  </ul>
                </div>
                <div className="bg-slate-950 p-3 rounded-sm border border-neutral-900/5">
                  <span className="font-bold text-amber-600 block mb-1 uppercase tracking-wider text-[8px]">Threats</span>
                  <ul className="text-neutral-900/60 space-y-1">
                    <li className="line-clamp-2 leading-relaxed">⚠ {report.swot.threats[0]}</li>
                  </ul>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("swot")}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-500 hover:text-gold-600 transition-all mt-4 pt-3 border-t border-neutral-900/5 cursor-pointer"
            >
              Analyze SWOT Matrix <ArrowRight className="w-3.5 h-3.5 text-gold-500" />
            </button>
          </div>

          {/* Competitors & Patents Quick Check */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Competitors Summary list */}
            <div className="bg-slate-900 p-6 rounded-sm border border-neutral-900/5 shadow-inner space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-neutral-900 flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
                  <Users className="w-4 h-4 text-gold-500" />
                  Key Competitors
                </h3>
                <span className="text-[10px] font-mono text-neutral-900/40 uppercase tracking-widest">{report.competitors.length} Found</span>
              </div>
              <div className="space-y-3">
                {report.competitors.map((comp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-950 border border-neutral-900/5 rounded-sm">
                    <div>
                      <span className="font-bold text-neutral-900 text-xs block tracking-wide">{comp.name}</span>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-900/40">Competitor Edge Required</span>
                    </div>
                    <span className="text-[9px] font-bold bg-gold-500/10 text-gold-600 px-2.5 py-1 rounded-sm border border-gold-500/20 uppercase tracking-wider">
                      {comp.marketShare} Share
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab("competitors")}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-500 hover:text-gold-600 transition-all mt-1 cursor-pointer"
              >
                Analyze Market Differentiation <ArrowRight className="w-3.5 h-3.5 text-gold-500" />
              </button>
            </div>

            {/* Domains suggestions list */}
            <div className="bg-slate-900 p-6 rounded-sm border border-neutral-900/5 shadow-inner space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-neutral-900 flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
                  <Globe className="w-4 h-4 text-gold-500" />
                  Suggested Domain Names
                </h3>
                <span className="text-[10px] font-mono text-neutral-900/40 uppercase tracking-widest">Availability predictions</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {report.domains.slice(0, 4).map((domain, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-sm border border-neutral-900/5">
                    <span className="font-bold text-neutral-900 text-xs block font-mono truncate tracking-tight">
                      {domain.domainName}
                    </span>
                    <div className="flex items-center justify-between mt-1.5 text-[9px] uppercase tracking-wider font-semibold">
                      <span className={`font-bold ${
                        domain.status === "Highly Likely" ? "text-gold-600" : domain.status === "Moderately Likely" ? "text-blue-600" : "text-neutral-900/40"
                      }`}>
                        {domain.status}
                      </span>
                      <span className="text-neutral-900/30">Score: {domain.suitabilityScore}/10</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab("domains")}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-500 hover:text-gold-600 transition-all mt-1 cursor-pointer"
              >
                View Full Domain Intelligence <ArrowRight className="w-3.5 h-3.5 text-gold-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- 2. COMPETITORS TAB ----------------- */}
      {activeTab === "competitors" && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-sm border border-neutral-900/5 shadow-inner">
            <h3 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2 font-serif italic">
              <Users className="w-5 h-5 text-gold-500" />
              Competitor Landscape Check
            </h3>
            <p className="text-neutral-900/50 text-xs mb-6 leading-relaxed uppercase tracking-wider">
              Analyze your key direct or indirect competitor services, understand their relative market footprint, identify product gaps, and construct strong strategic defensive positioning.
            </p>

            <div className="space-y-6">
              {report.competitors.map((competitor, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-neutral-900/5 rounded-sm p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-900/5 pb-3">
                    <div>
                      <h4 className="text-md font-bold text-neutral-900 uppercase tracking-wider font-serif">
                        {competitor.name}
                      </h4>
                      <span className="text-[10px] uppercase tracking-widest text-neutral-900/40">Direct Competitor</span>
                    </div>
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm bg-gold-500/10 text-gold-600 border border-gold-500/20 self-start sm:self-center">
                      Estimated Presence: {competitor.marketShare}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 bg-emerald-50 p-4 rounded-sm border border-emerald-200">
                      <span className="font-bold text-emerald-600 flex items-center gap-1.5 uppercase text-[9px] tracking-[0.15em]">
                        <span className="w-2 h-2 bg-emerald-500"></span>
                        Competitor Strengths
                      </span>
                      <ul className="list-disc pl-4 text-neutral-900/70 space-y-1.5 leading-relaxed font-light">
                        {competitor.strengths.map((str, sIdx) => (
                          <li key={sIdx}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 bg-rose-50 p-4 rounded-sm border border-rose-200">
                      <span className="font-bold text-rose-600 flex items-center gap-1.5 uppercase text-[9px] tracking-[0.15em]">
                        <span className="w-2 h-2 bg-rose-500"></span>
                        Competitor Weaknesses
                      </span>
                      <ul className="list-disc pl-4 text-neutral-900/70 space-y-1.5 leading-relaxed font-light">
                        {competitor.weaknesses.map((weak, wIdx) => (
                          <li key={wIdx}>{weak}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gold-500/5 p-4 rounded-sm border border-gold-500/10 space-y-1 text-xs">
                    <span className="font-bold text-gold-600 flex items-center gap-1.5 uppercase text-[9px] tracking-[0.15em]">
                      <Zap className="w-3.5 h-3.5 text-gold-500" />
                      Our Differentiation Strategy
                    </span>
                    <p className="text-neutral-900/80 leading-relaxed font-light italic">
                      {competitor.differentiation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- 3. PATENTS TAB ----------------- */}
      {activeTab === "patents" && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-sm border border-neutral-900/5 shadow-inner">
            <h3 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2 font-serif italic">
              <ShieldCheck className="w-5 h-5 text-gold-500" />
              Similar Patents & Prior Art Review
            </h3>
            <p className="text-neutral-900/50 text-xs mb-6 leading-relaxed uppercase tracking-wider">
              Verify similar patents or active conceptual registries. Understand legal infringement/prior art risks, look up technical dependencies, and prepare functional engineering workarounds to differentiate.
            </p>

            {report.patents.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 border border-neutral-900/5 rounded-sm text-neutral-900/40 text-xs">
                No similar patents or prior art blockages detected for this specific idea category.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.patents.map((patent, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 border border-neutral-900/5 rounded-sm p-6 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4 border-b border-neutral-900/5 pb-3">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-neutral-900 font-serif uppercase tracking-wide">
                            {patent.title}
                          </h4>
                          <span className="text-[9px] font-mono text-gold-600 uppercase tracking-widest bg-neutral-900/5 px-2 py-0.5 rounded-sm border border-neutral-900/5">
                            ID: {patent.numberOrRef}
                          </span>
                        </div>
                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold border rounded-sm shrink-0 ${getRiskBadgeColor(patent.riskLevel)}`}>
                          {patent.riskLevel} Risk
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <span className="text-[9px] font-bold text-neutral-900/40 uppercase block tracking-wider">
                          Relationship to Your Business
                        </span>
                        <p className="text-neutral-900/80 leading-relaxed bg-slate-900 p-3.5 rounded-sm border border-neutral-900/5 font-light italic">
                          {patent.relation}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gold-500/5 p-4 rounded-sm border border-gold-500/10 space-y-1 text-xs">
                      <span className="font-bold text-gold-600 flex items-center gap-1.5 uppercase text-[9px] tracking-[0.15em]">
                        <Lightbulb className="w-3.5 h-3.5 text-gold-500" />
                        Engineering Workaround Advice
                      </span>
                      <p className="text-neutral-900/80 leading-relaxed font-light">
                        {patent.workaround}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- 4. DOMAINS TAB ----------------- */}
      {activeTab === "domains" && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-sm border border-neutral-900/5 shadow-inner">
            <h3 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2 font-serif italic">
              <Globe className="w-5 h-5 text-gold-500" />
              Domain Name Intelligence Suggestions
            </h3>
            <p className="text-neutral-900/50 text-xs mb-6 leading-relaxed uppercase tracking-wider">
              Explore dynamic brand domain variations across key TLD extensions, see predicted registry availability status, and review brand suitability scores.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.domains.map((domain, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-neutral-900/5 rounded-sm p-5 flex items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-neutral-900 select-all">
                        {domain.domainName}
                      </span>
                      <span className="text-[9px] font-bold font-mono text-gold-600 bg-gold-500/10 border border-gold-500/20 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        {domain.tld}
                      </span>
                    </div>
                    <p className="text-neutral-900/60 text-[11px] leading-relaxed font-light">
                      {domain.why}
                    </p>
                  </div>

                  <div className="flex flex-col items-end shrink-0 gap-2">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest ${getStatusBadgeColor(domain.status)}`}>
                      {domain.status}
                    </span>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-neutral-900/30 block">Suitability</span>
                      <span className="text-sm font-bold font-serif text-neutral-900 italic">
                        {domain.suitabilityScore}
                        <span className="text-neutral-900/40 text-[10px] font-normal font-sans not-italic"> /10</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gold-500/5 rounded-sm border border-gold-500/10 flex items-start gap-3 text-xs leading-relaxed text-neutral-900/70">
              <span className="text-gold-600 font-bold uppercase tracking-wider shrink-0 text-[10px] mt-0.5">Advice:</span>
              <p className="font-light">
                We recommend securing multiple TLD formats (e.g. both the premium <strong>.com</strong> for legal defensive protection and local TLDs like <strong>.ai</strong> or <strong>.io</strong> for active product positioning) as early as possible to protect your brand identity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- 5. MARKET SIZE TAB ----------------- */}
      {activeTab === "market" && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-sm border border-neutral-900/5 shadow-inner">
            <h3 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2 font-serif italic">
              <TrendingUp className="w-5 h-5 text-gold-500" />
              TAM, SAM, SOM Market Projections
            </h3>
            <p className="text-neutral-900/50 text-xs mb-6 leading-relaxed uppercase tracking-wider">
              Understand the scale of your business opportunities with rigorous estimates: TAM represents the overall addressable value, SAM is your target geographic or technical segment, and SOM is the realistic portion you expect to capture over the first years.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
              {/* Chart Side */}
              <div className="lg:col-span-3 w-full">
                <MarketChart chartData={report.marketSize.chartData} />
              </div>

              {/* Data Cards Side */}
              <div className="lg:col-span-2 space-y-4">
                {/* TAM card */}
                <div className="p-5 rounded-sm border border-neutral-900/5 bg-slate-950 flex items-start gap-4 shadow-md">
                  <div className="w-9 h-9 rounded-sm bg-[#544630] text-gold-200 font-bold font-serif italic flex items-center justify-center shrink-0 text-sm border border-neutral-900/5">
                    T
                  </div>
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                        Total Addressable Market (TAM)
                      </span>
                      <span className="text-sm font-serif italic font-bold text-gold-600">
                        {report.marketSize.tamValue}
                      </span>
                    </div>
                    <p className="text-neutral-900/60 text-[11px] leading-relaxed font-light">
                      {report.marketSize.tamDesc}
                    </p>
                  </div>
                </div>

                {/* SAM card */}
                <div className="p-5 rounded-sm border border-neutral-900/5 bg-slate-950 flex items-start gap-4 shadow-md">
                  <div className="w-9 h-9 rounded-sm bg-[#8b7651] text-gold-100 font-bold font-serif italic flex items-center justify-center shrink-0 text-sm border border-neutral-900/5">
                    S
                  </div>
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                        Serviceable Addressable Market (SAM)
                      </span>
                      <span className="text-sm font-serif italic font-bold text-gold-600">
                        {report.marketSize.samValue}
                      </span>
                    </div>
                    <p className="text-neutral-900/60 text-[11px] leading-relaxed font-light">
                      {report.marketSize.samDesc}
                    </p>
                  </div>
                </div>

                {/* SOM card */}
                <div className="p-5 rounded-sm border border-neutral-900/5 bg-slate-950 flex items-start gap-4 shadow-md">
                  <div className="w-9 h-9 rounded-sm bg-[#a38e64] text-black font-bold font-serif italic flex items-center justify-center shrink-0 text-sm border border-neutral-900/5">
                    S
                  </div>
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                        Serviceable Obtainable Market (SOM)
                      </span>
                      <span className="text-sm font-serif italic font-bold text-gold-500">
                        {report.marketSize.somValue}
                      </span>
                    </div>
                    <p className="text-neutral-900/60 text-[11px] leading-relaxed font-light">
                      {report.marketSize.somDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- 6. MONETIZATION TAB ----------------- */}
      {activeTab === "monetization" && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-sm border border-neutral-900/5 shadow-inner">
            <h3 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2 font-serif italic">
              <DollarSign className="w-5 h-5 text-gold-500" />
              Strategic Monetization & Pricing Suggestions
            </h3>
            <p className="text-neutral-900/50 text-xs mb-6 leading-relaxed uppercase tracking-wider">
              Explore dynamic pricing models, suggested payment tiers, transaction frequencies, and transactional pros and cons optimized for your business.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {report.monetization.map((strategy, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-neutral-900/5 rounded-sm p-6 flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="space-y-1 border-b border-neutral-900/5 pb-3">
                      <span className="text-[9px] uppercase font-mono tracking-widest font-bold text-gold-600">
                        Option 0{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider font-serif">
                        {strategy.strategyName}
                      </h4>
                    </div>

                    <p className="text-neutral-900/70 text-xs leading-relaxed font-light">
                      {strategy.description}
                    </p>

                    <div className="bg-slate-900 p-4 rounded-sm border border-neutral-900/5">
                      <span className="text-[8px] uppercase font-mono tracking-widest font-bold text-neutral-900/30 block mb-1">
                        Suggested Price Node
                      </span>
                      <span className="text-xs font-bold text-gold-600 font-mono">
                        {strategy.pricingSuggestion}
                      </span>
                    </div>

                    {/* Pros and cons list */}
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2 text-[11px]">
                        <span className="font-bold text-emerald-600 block uppercase text-[8px] tracking-[0.15em]">Pros</span>
                        <ul className="space-y-1.5 text-neutral-900/60 pl-1 font-light">
                          {strategy.pros.map((p, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-1.5">
                              <span className="text-emerald-500 select-none shrink-0 font-bold">✓</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2 text-[11px]">
                        <span className="font-bold text-rose-600 block uppercase text-[8px] tracking-[0.15em]">Cons</span>
                        <ul className="space-y-1.5 text-neutral-900/60 pl-1 font-light">
                          {strategy.cons.map((c, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-1.5">
                              <span className="text-rose-600 select-none shrink-0 font-bold">✗</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- 7. SWOT TAB ----------------- */}
      {activeTab === "swot" && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-sm border border-neutral-900/5 shadow-inner">
            <h3 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2 font-serif italic">
              <Grid className="w-5 h-5 text-gold-500" />
              SWOT Analysis Matrix
            </h3>
            <p className="text-neutral-900/50 text-xs mb-6 leading-relaxed uppercase tracking-wider">
              Identify strategic elements inside and outside the company: internal Strengths and Weaknesses to address, and external Opportunities and Threats to navigate.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-slate-950 border border-neutral-900/5 p-6 rounded-sm space-y-4">
                <div className="flex items-center gap-3 text-emerald-600">
                  <span className="w-8 h-8 rounded-sm bg-emerald-500/10 border border-emerald-500/30 font-bold font-serif italic flex items-center justify-center">S</span>
                  <h4 className="font-bold text-xs uppercase tracking-wider">Strengths (Internal)</h4>
                </div>
                <ul className="list-disc pl-5 text-neutral-900/70 text-xs space-y-2 leading-relaxed font-light">
                  {report.swot.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-slate-950 border border-neutral-900/5 p-6 rounded-sm space-y-4">
                <div className="flex items-center gap-3 text-rose-600">
                  <span className="w-8 h-8 rounded-sm bg-rose-500/10 border border-rose-500/30 font-bold font-serif italic flex items-center justify-center">W</span>
                  <h4 className="font-bold text-xs uppercase tracking-wider">Weaknesses (Internal)</h4>
                </div>
                <ul className="list-disc pl-5 text-neutral-900/70 text-xs space-y-2 leading-relaxed font-light">
                  {report.swot.weaknesses.map((weak, idx) => (
                    <li key={idx}>{weak}</li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="bg-slate-950 border border-neutral-900/5 p-6 rounded-sm space-y-4">
                <div className="flex items-center gap-3 text-blue-600">
                  <span className="w-8 h-8 rounded-sm bg-blue-500/10 border border-blue-500/30 font-bold font-serif italic flex items-center justify-center">O</span>
                  <h4 className="font-bold text-xs uppercase tracking-wider">Opportunities (External)</h4>
                </div>
                <ul className="list-disc pl-5 text-neutral-900/70 text-xs space-y-2 leading-relaxed font-light">
                  {report.swot.opportunities.map((opp, idx) => (
                    <li key={idx}>{opp}</li>
                  ))}
                </ul>
              </div>

              {/* Threats */}
              <div className="bg-slate-950 border border-neutral-900/5 p-6 rounded-sm space-y-4">
                <div className="flex items-center gap-3 text-amber-600">
                  <span className="w-8 h-8 rounded-sm bg-amber-500/10 border border-amber-500/30 font-bold font-serif italic flex items-center justify-center">T</span>
                  <h4 className="font-bold text-xs uppercase tracking-wider">Threats (External)</h4>
                </div>
                <ul className="list-disc pl-5 text-neutral-900/70 text-xs space-y-2 leading-relaxed font-light">
                  {report.swot.threats.map((thr, idx) => (
                    <li key={idx}>{thr}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- 8. LAUNCH STRATEGY TAB ----------------- */}
      {activeTab === "launch" && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-sm border border-neutral-900/5 shadow-inner">
            <h3 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2 font-serif italic">
              <Rocket className="w-5 h-5 text-gold-500" />
              Launch Strategy & Growth Roadmap
            </h3>
            <p className="text-neutral-900/50 text-xs mb-8 leading-relaxed uppercase tracking-wider">
              Explore your systematic market launch plan divided into 3 execution phases, designed to prove feasibility, validate marketing channels, and capture core user interest efficiently.
            </p>

            <div className="relative border-l border-neutral-900/5 ml-4 pl-6 space-y-8">
              {report.launchStrategy.map((phase, idx) => (
                <div key={idx} className="relative">
                  {/* Point icon */}
                  <span className="absolute -left-[37px] top-1.5 w-6 h-6 rounded-sm bg-gold-500 text-black font-bold font-serif italic text-xs flex items-center justify-center shadow-lg">
                    {idx + 1}
                  </span>

                  <div className="bg-slate-950 border border-neutral-900/5 rounded-sm p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-neutral-900/5">
                      <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-serif">
                        {phase.phase}
                      </h4>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gold-600 font-bold bg-gold-500/10 border border-gold-500/20 px-2.5 py-0.5 rounded-sm self-start">
                        Timeline: {phase.timeline}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      {/* Milestones list */}
                      <div className="space-y-3">
                        <span className="font-bold text-neutral-900/40 uppercase text-[8px] block tracking-widest">
                          Key Milestones to Achieve
                        </span>
                        <ul className="space-y-2 text-neutral-900/70 pl-1 font-light">
                          {phase.milestones.map((mile, mIdx) => (
                            <li key={mIdx} className="flex items-start gap-2">
                              <span className="text-gold-500 select-none shrink-0 font-bold">✔</span>
                              <span>{mile}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tactics list */}
                      <div className="space-y-3">
                        <span className="font-bold text-neutral-900/40 uppercase text-[8px] block tracking-widest">
                          Recommended Marketing & GTM Tactics
                        </span>
                        <ul className="space-y-2 text-neutral-900/70 pl-1 font-light">
                          {phase.tactics.map((tac, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-2">
                              <span className="text-gold-600 select-none shrink-0 font-bold">✦</span>
                              <span>{tac}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}