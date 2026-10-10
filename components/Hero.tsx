"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Play, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert, Plus, Globe, User } from "lucide-react";
import { Lead } from "@/lib/schemas";

interface HeroProps {
  leads: Lead[];
  selectedLeadId: string;
  setSelectedLeadId: (id: string) => void;
  customLead: Lead | null;
  setCustomLead: (lead: Lead | null) => void;
  deliberateFailure: boolean;
  setDeliberateFailure: (val: boolean) => void;
  autoSelfHeal: boolean;
  setAutoSelfHeal: (val: boolean) => void;
  onRunIntegration: () => void;
  isExecuting: boolean;
}

export default function Hero({
  leads,
  selectedLeadId,
  setSelectedLeadId,
  customLead,
  setCustomLead,
  deliberateFailure,
  setDeliberateFailure,
  autoSelfHeal,
  setAutoSelfHeal,
  onRunIntegration,
  isExecuting,
}: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState("Sam Altman");
  const [customEmail, setCustomEmail] = useState("sam@openai.com");
  const [customDomain, setCustomDomain] = useState("openai.com");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(badgeRef.current, {
        y: -15,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
      gsap.from(headlineRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.1,
        ease: "power4.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleApplyCustomLead = () => {
    if (!customDomain) return;
    const cleanDomain = customDomain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const newLead: Lead = {
      id: `lead_custom_${Date.now()}`,
      name: customName || "Real Business Prospect",
      email: customEmail || `contact@${cleanDomain}`,
      companyDomain: cleanDomain,
      status: "qualified",
      estimatedValue: 150000,
      isDemo: false,
    };
    setCustomLead(newLead);
    setSelectedLeadId(newLead.id);
  };

  return (
    <section ref={heroRef} className="relative pt-6 sm:pt-10 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#2e1045] overflow-hidden">
      {/* Background Matrix Grid Pattern */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Tag */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-[#120024] border border-[#a600ff] text-[11px] sm:text-xs font-mono text-[#c466ff] mb-4 sm:mb-6 shadow-[3px_3px_0px_#7a07c5]">
          <Sparkles className="w-3.5 h-3.5 text-[#a600ff] animate-spin" />
          <span className="truncate">OPLINK ENGINE • AUTONOMOUS INTEGRATION RUNTIME</span>
        </div>

        {/* Brutalist Main Headline & Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-7">
            <h1
              ref={headlineRef}
              className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-tight font-mono text-white mb-4 sm:mb-6"
            >
              AUTONOMOUS <br />
              <span className="text-[#c466ff] bg-[#1a0033] px-2 py-0.5 sm:py-1 border border-[#a600ff] inline-block mt-1">
                INTEGRATION
              </span> <br />
              ENGINEERING<span className="text-[#a600ff]">.</span>
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-zinc-300 font-mono max-w-xl mb-6 sm:mb-8 leading-relaxed">
              Connect disconnected business tools. Oplink extracts CRM leads, fetches live company intelligence via <span className="text-[#c466ff] font-bold underline">Crustdata</span>, generates zero-shot mappings via <span className="text-[#c466ff] font-bold underline">Nebius Token Factory</span>, and self-heals schema rejections in real time with auditable <span className="text-[#c466ff] font-bold underline">neatlogs</span> telemetry.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg mb-6 sm:mb-8">
              <div className="bg-[#0d0d0d] border border-[#7a07c5] p-2 sm:p-3">
                <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase">Recovery Loop</div>
                <div className="text-sm sm:text-lg font-bold text-white font-mono flex items-center gap-1 sm:gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#a600ff]" /> 100% PASS
                </div>
              </div>
              <div className="bg-[#0d0d0d] border border-[#7a07c5] p-2 sm:p-3">
                <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase">Avg Execution</div>
                <div className="text-sm sm:text-lg font-bold text-[#c466ff] font-mono mt-0.5">&lt; 420 ms</div>
              </div>
              <div className="bg-[#0d0d0d] border border-[#7a07c5] p-2 sm:p-3">
                <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase">Dedup Protocol</div>
                <div className="text-sm sm:text-lg font-bold text-white font-mono mt-0.5">IDEMPOTENT</div>
              </div>
            </div>
          </div>

          {/* Right Control Console */}
          <div className="lg:col-span-5">
            <div className="bg-[#0d0d0d] border-2 border-[#a600ff] p-4 sm:p-5 shadow-[4px_4px_0px_#7a07c5] sm:shadow-[6px_6px_0px_#7a07c5] relative">
              <div className="flex items-center justify-between pb-3 border-b border-[#2e1045] mb-4">
                <span className="text-xs font-mono uppercase font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#a600ff] inline-block" /> RUNTIME CONTROLLER
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsCustomMode(!isCustomMode);
                      if (isCustomMode) setCustomLead(null);
                    }}
                    className="text-[10px] font-mono text-[#c466ff] hover:text-white bg-[#1a0033] px-2 py-0.5 border border-[#7a07c5] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> {isCustomMode ? "FIXTURES" : "+ REAL DOMAIN"}
                  </button>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 border border-emerald-500">
                    LIVE
                  </span>
                </div>
              </div>

              {/* Real Lead / Custom Input or Preset Fixtures */}
              {isCustomMode ? (
                <div className="mb-4 p-3 bg-[#120024] border border-[#a600ff] space-y-2.5">
                  <div className="text-[11px] font-bold text-white uppercase flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#a600ff]" /> Live Real Domain Ingest
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 uppercase mb-1">Company Domain:</label>
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="e.g. openai.com or linear.app"
                      className="w-full bg-[#070707] border border-[#7a07c5] text-white px-2 py-1 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase mb-1">Prospect Name:</label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full bg-[#070707] border border-[#7a07c5] text-white px-2 py-1 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 uppercase mb-1">Email:</label>
                      <input
                        type="email"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        className="w-full bg-[#070707] border border-[#7a07c5] text-white px-2 py-1 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleApplyCustomLead}
                    className="w-full py-1.5 bg-[#a600ff] hover:bg-[#c466ff] text-black font-bold uppercase text-[10px] border border-white cursor-pointer"
                  >
                    SET AS ACTIVE TARGET
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                    1. Select Source CRM Lead:
                  </label>
                  <div className="space-y-1.5">
                    {leads.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => {
                          setCustomLead(null);
                          setSelectedLeadId(lead.id);
                        }}
                        className={`w-full text-left p-2 sm:p-2.5 text-xs font-mono border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          selectedLeadId === lead.id && !customLead
                            ? "bg-[#1f0038] border-[#c466ff] text-white shadow-[2px_2px_0px_#a600ff]"
                            : "bg-[#141414] border-[#2e1045] text-zinc-400 hover:border-[#7a07c5] hover:text-zinc-200"
                        }`}
                      >
                        <div className="truncate">
                          <span className="font-bold text-white">{lead.name}</span>
                          <span className="text-[10px] text-zinc-400 ml-1.5 truncate">({lead.companyDomain})</span>
                        </div>
                        <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-[#0a0a0a] border border-[#7a07c5] text-[#c466ff] shrink-0">
                          {lead.status.toUpperCase()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Scenario Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 sm:mb-5">
                <div
                  onClick={() => setDeliberateFailure(!deliberateFailure)}
                  className={`p-2 sm:p-2.5 border cursor-pointer select-none transition-all ${
                    deliberateFailure
                      ? "bg-[#1a0033] border-[#a600ff] text-white"
                      : "bg-[#141414] border-[#2e1045] text-zinc-400"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#c466ff]" /> Inject Schema Bug
                    </span>
                    <span className="text-[9px] uppercase font-bold text-[#c466ff]">
                      {deliberateFailure ? "ON" : "OFF"}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Tests date regex validation rejection
                  </p>
                </div>

                <div
                  onClick={() => setAutoSelfHeal(!autoSelfHeal)}
                  className={`p-2 sm:p-2.5 border cursor-pointer select-none transition-all ${
                    autoSelfHeal
                      ? "bg-[#1a0033] border-[#a600ff] text-white"
                      : "bg-[#141414] border-[#2e1045] text-zinc-400"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#a600ff]" /> Auto-Self-Heal
                    </span>
                    <span className="text-[9px] uppercase font-bold text-[#a600ff]">
                      {autoSelfHeal ? "ON" : "OFF"}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Triggers bounded LLM patch repair loop
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onRunIntegration}
                disabled={isExecuting}
                className="w-full py-3 sm:py-3.5 bg-[#a600ff] hover:bg-[#c466ff] text-black font-black uppercase text-xs sm:text-sm font-mono tracking-wider transition-all flex items-center justify-center gap-2 border-2 border-white shadow-[3px_3px_0px_#7a07c5] hover:shadow-[5px_5px_0px_white] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isExecuting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    EXECUTING ORCHESTRATION...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-black" />
                    TRIGGER INTEGRATION RUN
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
