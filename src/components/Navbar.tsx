import React from "react";
import { Sparkles, Compass } from "lucide-react";
interface NavbarProps {
  onHome: () => void;
}
export default function Navbar({ onHome }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-900/5 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
      <button
        onClick={onHome}
        className="flex items-center gap-3 cursor-pointer shrink-0 whitespace-nowrap transition hover:opacity-90"
      >
        <div className="w-9 h-9 rounded-sm bg-gold-500 flex items-center justify-center font-bold text-black text-xl font-serif italic shadow-[0_0_15px_rgba(163,142,100,0.2)]">
          L
        </div>

        <div className="text-left">
          <span className="text-lg font-light tracking-[0.15em] text-neutral-900 uppercase block leading-none font-sans">
            Launch Lens
            <span className="font-bold text-gold-500"> AI</span>
          </span>

          <span className="text-[9px] text-neutral-900/40 tracking-widest uppercase block mt-1 font-sans font-medium">
            Instant Business Validation Engine
          </span>
        </div>
      </button>
      
      </div>
    </header>
  );
}