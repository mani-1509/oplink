"use client";

import { Activity, ShieldCheck, Terminal, DollarSign, Cpu } from "lucide-react";

interface HeaderProps {
  activeTab: "pipeline" | "diff" | "evidence" | "cfo";
  setActiveTab: (tab: "pipeline" | "diff" | "evidence" | "cfo") => void;
  isExecuting: boolean;
}

export default function Header({ activeTab, setActiveTab, isExecuting }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#7a07c5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#7a07c5] flex items-center justify-center border border-[#a600ff] shadow-[2px_2px_0px_#a600ff]">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-xl tracking-tighter text-white">
                OPLINK<span className="text-[#a600ff]">_</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 border border-[#a600ff] text-[#c466ff] bg-[#120024]">
                v1.0.0-MVP
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono hidden sm:block">
              AI INTEGRATION AGENT • NEBHACK 2026
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`px-3 py-1.5 text-xs font-mono uppercase transition-all flex items-center gap-1.5 border ${
              activeTab === "pipeline"
                ? "bg-[#a600ff] text-black font-bold border-[#c466ff] shadow-[3px_3px_0px_#7a07c5]"
                : "bg-[#0d0d0d] text-zinc-300 border-[#7a07c5]/50 hover:border-[#a600ff] hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden md:inline">01.</span> Pipeline
          </button>

          <button
            onClick={() => setActiveTab("diff")}
            className={`px-3 py-1.5 text-xs font-mono uppercase transition-all flex items-center gap-1.5 border ${
              activeTab === "diff"
                ? "bg-[#a600ff] text-black font-bold border-[#c466ff] shadow-[3px_3px_0px_#7a07c5]"
                : "bg-[#0d0d0d] text-zinc-300 border-[#7a07c5]/50 hover:border-[#a600ff] hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">02.</span> Self-Healing
          </button>

          <button
            onClick={() => setActiveTab("evidence")}
            className={`px-3 py-1.5 text-xs font-mono uppercase transition-all flex items-center gap-1.5 border ${
              activeTab === "evidence"
                ? "bg-[#a600ff] text-black font-bold border-[#c466ff] shadow-[3px_3px_0px_#7a07c5]"
                : "bg-[#0d0d0d] text-zinc-300 border-[#7a07c5]/50 hover:border-[#a600ff] hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">03.</span> neatlogs
          </button>

          <button
            onClick={() => setActiveTab("cfo")}
            className={`px-3 py-1.5 text-xs font-mono uppercase transition-all flex items-center gap-1.5 border ${
              activeTab === "cfo"
                ? "bg-[#a600ff] text-black font-bold border-[#c466ff] shadow-[3px_3px_0px_#7a07c5]"
                : "bg-[#0d0d0d] text-zinc-300 border-[#7a07c5]/50 hover:border-[#a600ff] hover:text-white"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span className="hidden md:inline">04.</span> cfo.ai
          </button>
        </nav>

        {/* Engine Status */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#0d0d0d] border border-[#7a07c5] text-[11px] font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                isExecuting ? "bg-[#c466ff] animate-ping" : "bg-[#a600ff]"
              }`}
            />
            <span className="text-zinc-300">
              {isExecuting ? "ORCHESTRATING..." : "SYSTEM READY"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
