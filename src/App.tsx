import { saveReport } from "./firebase/firestore";
import { db, auth } from "./firebase/firebase";
import { signInWithGoogle, logout } from "./firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  serverTimestamp,
  where,
  orderBy,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Compass,
  ArrowRight,
  Loader2,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Zap,
} from "lucide-react";
import Navbar from "./components/Navbar";
import { SAMPLE_IDEAS, SampleIdea } from "./components/SampleIdeas";
import { BusinessAnalysisReport } from "./types/types";
import ReportDashboard from "./components/ReportDashboard";
import ReportHistory from "./components/ReportHistory";

const LOADING_STEPS = [
  "Initiating business validation protocol...",
  "Crawling competitive landscapes for direct & indirect rivals...",
  "Analyzing registered patent catalogs for prior-art risks...",
  "Synthesizing brand-domain variations and TLD availability...",
  "Calculating addressable market size (TAM, SAM, SOM) dimensions...",
  "Formulating robust pricing tiers & subscription models...",
  "Assembling the SWOT (Strengths, Weaknesses, Opportunities, Threats) matrix...",
  "Drafting a phased-out launch strategy and marketing roadmap...",
];

export default function App() {
  const [user, loading] = useAuthState(auth);
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [currentReport, setCurrentReport] = useState<BusinessAnalysisReport | null>(null);
  const [history, setHistory] = useState<BusinessAnalysisReport[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [historyExpanded, setHistoryExpanded] = useState(true);
  useEffect(() => {
  if (!user) {
    setHistory([]);
    setCurrentReport(null);
    return;
  }

  const q = query(
    collection(db, "reports"),
    where("uid", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const reports = snapshot.docs.map((doc) => ({
        ...doc.data().report,
        id: doc.id,
        favorite: doc.data().report.favorite ?? false,
      })) as BusinessAnalysisReport[];

      setHistory(reports);

      if (reports.length > 0) {
        setCurrentReport((current) => {
          if (!current) return null;

          return (
            reports.find((r) => r.id === current.id) ??
            reports[0]
          );
        });
      } else {
        setCurrentReport(null);
      }
    },
    (error) => {
      console.error("Realtime listener error:", error);
    }
  );

  return () => unsubscribe();
}, [user]);

const filteredHistory = history.filter((report) => {
  const search = searchTerm.trim().toLowerCase();

  if (search === "") return true;

  return [
    report.businessName,
    report.inputIdea,
    report.elevatorPitch,
    report.industry,
    report.targetAudience,
  ]
    .filter(Boolean)
    .some((field) => field!.toLowerCase().includes(search));
});

  const handleApplySample = (sample: SampleIdea) => {
    setIdea(sample.idea);
    setIndustry(sample.industry);
    setTargetAudience(sample.audience);
  };

  const handleGoHome = () => {
  setCurrentReport(null);
};

  const handleValidateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentReport(null);

    const API_URL =
  import.meta.env.VITE_API_URL || "https://launchlensai-y28n.onrender.com";

    try {
     const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: idea.trim(),
          industry: industry.trim() || undefined,
          targetAudience: targetAudience.trim() || undefined,
        }),
      });

     let data;

try {
  data = await response.json();
} catch {
  throw new Error(
    "LaunchLensAI couldn't reach the AI server. Please try again in a few moments."
  );
}

if (!response.ok) {
  throw new Error(data.error || "An error occurred during verification.");
}

      // Prepare complete report object
      const newReport: BusinessAnalysisReport = {
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        inputIdea: idea,
        industry: industry || undefined,
        targetAudience: targetAudience || undefined,
        ...data,
      };

      setCurrentReport(newReport);
    } catch (err: any) {
      console.error("Validation error:", err);
      setError(
        err.message ||
          "We ran into a connection issue with our analytical servers. Please verify your internet connection or check your API key secrets configuration."
      );
    } finally {
      setIsLoading(false);
    }
  };


  const handleSaveToHistory = async () => {
  if (!currentReport || !user) return;

  try {
   const reportToSave = {
  ...currentReport,
  favorite: currentReport.favorite ?? false,
  industry: currentReport.industry ?? "",
  targetAudience: currentReport.targetAudience ?? "",
};

 console.log(reportToSave);

const docRef = await addDoc(collection(db, "reports"), {
  uid: user.uid,
  favorite: false,
  report: reportToSave,
  createdAt: serverTimestamp(),
});

const savedReport = {
  ...reportToSave,
  id: docRef.id,
};

setHistory((prev) => [savedReport, ...prev]);
setCurrentReport(savedReport);

alert("Report saved!");

} catch (err: any) {
  console.error("Firestore Error:", err);
  alert(err.message);
  }
};



  const handleToggleFavorite = async (
  id: string,
  e: React.MouseEvent
) => {
  e.stopPropagation();

  try {
    const updatedHistory = history.map((report) =>
      report.id === id
        ? {
            ...report,
            favorite: !report.favorite,
          }
        : report
    );

    setHistory(updatedHistory);

    if (currentReport?.id === id) {
      const updated = updatedHistory.find((r) => r.id === id);
      if (updated) {
        setCurrentReport(updated);
      }
    }

    const updatedReport = updatedHistory.find((r) => r.id === id);

    if (updatedReport) {
      await updateDoc(doc(db, "reports", id), {
        report: updatedReport,
      });
    }
  } catch (err) {
    console.error("Favorite Error:", err);
  }
};

const handleDeleteHistoryItem = async (
  id: string,
  e: React.MouseEvent
) => {
  e.stopPropagation();

  try {
    await deleteDoc(doc(db, "reports", id));

    const updated = history.filter((item) => item.id !== id);

    setHistory(updated);

    if (currentReport?.id === id) {
      setCurrentReport(updated.length > 0 ? updated[0] : null);
    }
  } catch (err) {
    console.error("Delete Error:", err);
  }
};

  const handleClearAllHistory = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to clear your saved business reports history? This cannot be undone."
  );

  if (!confirmed) return;

  try {
    await Promise.all(
      history.map((report) =>
        deleteDoc(doc(db, "reports", report.id))
      )
    );

    setHistory([]);
    setCurrentReport(null);

    alert("All reports deleted.");
  } catch (err) {
    console.error("Clear All Error:", err);
    alert("Failed to clear reports.");
  }
};

  const isCurrentReportSaved = currentReport
    ? history.some((item) => item.id === currentReport.id)
    : false;

  return (
      <div className="
    relative
    min-h-screen
    overflow-hidden
    bg-[#F6F5F3]
    font-sans
    text-neutral-900
    selection:bg-yellow-400
    selection:text-black">

    {/* Background Glow Effects */}
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-yellow-500/5 blur-[140px]" />

      <div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[180px]" />

      <div className="absolute bottom-0 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[160px]" />
    </div>

    {/* subtle grid */}
    <div
      className="absolute inset-0 -z-10 opacity-[0.015]"
      style={{
        backgroundImage:
          "linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />

    <Navbar onHome={handleGoHome} />
  



<div className="max-w-7xl mx-auto px-6 pt-6 flex justify-end">
  {user ? (
    <div className="flex items-center gap-4 bg-slate-900/70 backdrop-blur-xl border border-slate-200 rounded-2xl px-3.5 py-1.5 shadow-xl">

      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt={user.displayName || "User"}
          className="w-10 h-10 rounded-full border border-gold-500/30"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center font-bold text-black">
          {user.displayName?.charAt(0)}
        </div>
      )}

      <div className="flex flex-col">
        <span className="text-sm font-semibold">
          {user.displayName}
        </span>

        <span className="text-xs text-neutral-900/50">
          Signed in
        </span>
      </div>

      <button
        onClick={logout}
        className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-700 transition hover:bg-red-500/20"
      >
        Logout
      </button>

    </div>
  ) : (
    <button
      onClick={signInWithGoogle}
      className="rounded-2xl bg-white border border-slate-200 px-6 py-3 font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100"
    >
      Continue with Google
    </button>
  )}
</div>

      <main className="max-w-[1500px] mx-auto px-8 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT: Idea Input Panel */}
          <div className="lg:col-span-1 space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900/70 backdrop-blur-2xl shadow-xl border border-[#E8E1D6] bg-[#FCFBF9] p-8">
  {/* Background Glow */}
  <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-yellow-500/5 blur-3xl" />

  <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-blue-500/5 blur-3xl" />

  <div className="relative space-y-6"></div>
              <div className="space-y-1">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-neutral-900">
                  <Compass className="w-5 h-5 text-gold-500" />
                  AI Startup Validator
                </h2>
                <p className="text-neutral-600 text-[11px] leading-relaxed uppercase tracking-wider">
                  Describe your startup idea below and LaunchLensAI will instantly generate a complete investor-style validation report including competitors, patents, market size, monetization, SWOT analysis, and launch strategy.
                </p>
              </div>

              <form onSubmit={handleValidateIdea} className="space-y-4">
                {/* Idea text-area */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gold-600 uppercase tracking-widest block">
                    1. Describe Your Business Idea
                  </label>
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    required
                    placeholder="E.g., An on-demand laundry subscription box where customers get clean folded clothes picked up and delivered within 24 hours..."
                    rows={4}
                    className="w-full text-xs p-4 rounded-xl border border-slate-200 bg-slate-950/60 backdrop-blur-md focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 text-neutral-900 placeholder-slate-400/30 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                {/* Optional Industry */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gold-600 uppercase tracking-widest block">
                    2. Industry Segment <span className="text-[9px] text-neutral-900/30 font-normal normal-case">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="E.g., Consumer Services, LegalTech, FinTech"
                    className="w-full text-xs p-3.5 rounded-sm border border-gold-500/20 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/10 bg-slate-950 text-neutral-900 placeholder-slate-400/20 outline-none transition-all font-light"
                  />
                </div>

                {/* Optional Audience */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gold-600 uppercase tracking-widest block">
                    3. Target Market segment <span className="text-[9px] text-neutral-900/30 font-normal normal-case">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="E.g., Busy urban professionals, college students"
                    className="w-full text-xs p-3.5 rounded-sm border border-gold-500/20 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/10 bg-slate-950 text-neutral-900 placeholder-slate-400/20 outline-none transition-all font-light"
                  />
                </div>

                {/* Validation Button */}
                <button
                  type="submit"
                  disabled={isLoading || !idea.trim()}
                  className="
w-full
rounded-2xl
bg-gradient-to-r
from-yellow-400
via-amber-400
to-orange-400
py-4
font-bold
text-black
transition-all
duration-300
hover:scale-[1.02]
hover:shadow-[0_0_35px_rgba(255,215,0,.35)]
active:scale-95
disabled:opacity-50
disabled:cursor-not-allowed
flex
items-center
justify-center
gap-5 mt-10
"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      Analyzing Idea...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-black" />
                      Inspect & Validate Idea
                    </>
                  )}
                </button>
              </form>

              {/* Sample Starters */}
              <div className="pt-4 border-t border-neutral-900/5 space-y-2.5">
                <span className="text-[10px] font-bold text-neutral-600 flex items-center gap-1.5 uppercase tracking-wider">
                  <Lightbulb className="w-3.5 h-3.5 text-gold-500" />
                  Or Apply a Sample Concept:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {SAMPLE_IDEAS.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplySample(sample)}
                      className="
                      group
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-950/40
                      p-4
                      transition-all
                      duration-300
                     hover:-translate-y-1
                     hover:border-yellow-400/40
                     hover:bg-slate-900
                     hover:shadow-lg
                     hover:shadow-yellow-500/10
                    text-left"
  >
                      <span className="font-semibold text-neutral-900 group-hover:text-gold-700 transition">
                        {sample.title}
                      </span>

                      <span className="text-neutral-600 line-clamp-1 text-[9px] uppercase tracking-wide">
                        {sample.industry}
                        </span>
                    </button>

                  ))}
                </div>
              </div>
            </div>

            {/* History component */}
          <ReportHistory
            historyList={filteredHistory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedReportId={currentReport?.id || null}
            onSelect={(rep) => {
              setCurrentReport(rep);
              setIdea(rep.inputIdea);
              setIndustry(rep.industry || "");
              setTargetAudience(rep.targetAudience || "");
            }}
            onDelete={handleDeleteHistoryItem}
            onToggleFavorite={handleToggleFavorite}
            onClearAll={handleClearAllHistory}
            expanded={historyExpanded}
            setExpanded={setHistoryExpanded}
          />
          </div>

          {/* RIGHT: Results / Validation Report */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Loading State */}
            {isLoading && (
             <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-200 rounded-xl p-12 text-center shadow-2xl ...">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-600/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-gold-500/10 border-t-gold-500 animate-spin flex items-center justify-center"></div>
                  <Sparkles className="w-6 h-6 text-gold-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                </div>
                <div className="space-y-3 max-w-sm">
                  <h3 className="font-light font-serif text-2xl text-neutral-900 tracking-wide">
                    Running Validation Checks
                  </h3>
                  <p className="text-neutral-900/70 text-xs leading-relaxed font-mono min-h-[36px] bg-slate-950 p-3 rounded-sm border border-gold-500/20">
                    {LOADING_STEPS[loadingStepIdx]}
                  </p>
                </div>
                <span className="text-[9px] text-neutral-900/30 uppercase tracking-widest font-mono">
                  LaunchLensAI Engine v1.0
                </span>
              </div>
            )}

            {/* 2. Error State */}
            {error && (
                <div className="bg-red-50 backdrop-blur-xl border border-red-200 rounded-xl p-6 shadow-2xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">
                      Analysis Blocked
                    </h3>
                    <p className="text-xs text-red-700 leading-relaxed">
                      {error}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-white/60 rounded-sm text-xs space-y-2 border border-red-200">
                  <span className="font-bold text-neutral-900/90 uppercase tracking-wider">How to resolve this:</span>
                  <ul className="list-decimal pl-4 text-neutral-900/60 space-y-1">
                    <li>Confirm that your Gemini API Key is configured in the <strong>Settings &gt; Secrets</strong> panel of the AI Studio workspace.</li>
                    <li>If the key was recently added, retry the validation action.</li>
                    <li>Ensure your startup description does not contain prohibited content.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. Empty State (Prompt user to analyze) */}
            {!isLoading && !error && !currentReport && (
                <div className="
bg-slate-900/80
backdrop-blur-xl
border
border-slate-200
rounded-3xl
p-16
min-h-[560px]
flex
flex-col
justify-center
items-center
text-center
">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-600/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="
w-24
h-24
rounded-full
bg-gold-500/5
border
border-gold-500/15
flex
items-center
justify-center
mb-8
">
                  <Zap className="w-10 h-100 text-gold-500" />
                </div>
                <div className="text-lg leading-9 text-neutral-600 max-w-2xl mb-10">
                 <h3 className="
font-serif
text-5xl
font-light
tracking-wide
mb-6
text-neutral-800
">
                    Launch Your Searchlight

                  </h3>
                  <p className="text-neutral-900/60 text-xs leading-relaxed font-light">
                    No startup evaluation is currently active. Describe your business idea on the left pane and run the validation checks to inspect competitor lists, similar patent references, TLD availability, market caps, and structured launch milestones.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-3 text-[9px] text-neutral-600 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1.5 bg-slate-950 px-3.5 py-1.5 rounded-sm border border-neutral-900/5">
                    ✔ Competitors Check
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-950 px-3.5 py-1.5 rounded-sm border border-neutral-900/5">
                    ✔ Similar Patents
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-950 px-3.5 py-1.5 rounded-sm border border-neutral-900/5">
                    ✔ Domain TLD Estimates
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-950 px-3.5 py-1.5 rounded-sm border border-neutral-900/5">
                    ✔ TAM / SAM / SOM Charts
                  </span>
                </div>
              </div>
            )}

            {/* 4. Validation Report Dashboard */}
            {!isLoading && !error && currentReport && (
              <ReportDashboard
                report={currentReport}
                onSave={handleSaveToHistory}
                isSaved={isCurrentReportSaved}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}