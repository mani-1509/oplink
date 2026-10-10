import { Database, Sparkles, Binary, ShieldAlert, CheckCircle2, Layers, FileCode } from "lucide-react";

export default function ArchitectureDiagram() {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#7a07c5] bg-[#070707] relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <div className="text-xs font-mono text-[#c466ff] uppercase tracking-wider mb-2">
            [ ARCHITECTURE SPECIFICATION // SECTION 7 ]
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-mono uppercase text-white tracking-tight">
            DATA FLOW & AGENT PIPELINE
          </h2>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-2 max-w-2xl">
            A deterministic verifier—not the model alone—decides success. Every transition emits neatlogs events with Entire checkpoint references.
          </p>
        </div>

        {/* Visual Pipeline Map */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {/* Node 1: Source */}
          <div className="bg-[#0d0d0d] border border-[#7a07c5] p-4 sm:p-5 shadow-[3px_3px_0px_#2e1045]">
            <div className="w-8 h-8 bg-[#1a0033] border border-[#a600ff] text-[#c466ff] flex items-center justify-center mb-3">
              <Database className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Stage 01</div>
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white mt-0.5 mb-1.5">
              CRM SOURCE DB
            </h3>
            <p className="text-[11px] sm:text-xs font-mono text-zinc-400 leading-relaxed">
              Extracts lead record: name, email, company domain, and pipeline status.
            </p>
          </div>

          {/* Node 2: Crustdata */}
          <div className="bg-[#0d0d0d] border border-[#7a07c5] p-4 sm:p-5 shadow-[3px_3px_0px_#2e1045]">
            <div className="w-8 h-8 bg-[#1a0033] border border-[#a600ff] text-[#c466ff] flex items-center justify-center mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Stage 02</div>
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white mt-0.5 mb-1.5">
              CRUSTDATA ENRICH
            </h3>
            <p className="text-[11px] sm:text-xs font-mono text-zinc-400 leading-relaxed">
              Fetches verified company attributes: employee count, sector, and revenue tier.
            </p>
          </div>

          {/* Node 3: Nebius LLM */}
          <div className="bg-[#0d0d0d] border border-[#a600ff] p-4 sm:p-5 shadow-[3px_3px_0px_#7a07c5]">
            <div className="w-8 h-8 bg-[#2a004f] border border-[#c466ff] text-white flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4 text-[#c466ff]" />
            </div>
            <div className="text-[10px] font-mono text-[#c466ff] uppercase">Stage 03</div>
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white mt-0.5 mb-1.5">
              NEBIUS TOKEN FACTORY
            </h3>
            <p className="text-[11px] sm:text-xs font-mono text-zinc-300 leading-relaxed">
              120B reasoning agent produces typed AST field mapping and transformation rules.
            </p>
          </div>

          {/* Node 4: Zod & Self-Healing */}
          <div className="bg-[#0d0d0d] border border-[#7a07c5] p-4 sm:p-5 shadow-[3px_3px_0px_#2e1045]">
            <div className="w-8 h-8 bg-[#1a0033] border border-red-500 text-red-400 flex items-center justify-center mb-3">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Stage 04</div>
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white mt-0.5 mb-1.5">
              ZOD & SELF-HEAL
            </h3>
            <p className="text-[11px] sm:text-xs font-mono text-zinc-400 leading-relaxed">
              Catches regex date errors $\to$ triggers bounded repair loop $\to$ re-verifies.
            </p>
          </div>

          {/* Node 5: Destination API */}
          <div className="bg-[#0d0d0d] border border-emerald-500/80 p-4 sm:p-5 shadow-[3px_3px_0px_rgba(16,185,129,0.3)]">
            <div className="w-8 h-8 bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono text-emerald-400 uppercase">Stage 05</div>
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white mt-0.5 mb-1.5">
              DESTINATION TASK API
            </h3>
            <p className="text-[11px] sm:text-xs font-mono text-zinc-400 leading-relaxed">
              Writes validated task with idempotency key deduplication guarantee.
            </p>
          </div>
        </div>

        {/* Technical Stack Matrix */}
        <div className="bg-[#0d0d0d] border border-[#2e1045] p-4 sm:p-6">
          <div className="text-xs font-mono font-bold uppercase text-white mb-3 sm:mb-4 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#a600ff]" /> HACKATHON PARTNER RESPONSIBILITIES & EVIDENCE
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs font-mono">
            <div className="p-3 bg-[#080808] border border-[#2e1045]">
              <span className="text-[#c466ff] font-bold block mb-1">neatlogs</span>
              <span className="text-zinc-400 text-[11px]">
                Instruments model calls, validation failures, retries, and before/after comparisons.
              </span>
            </div>

            <div className="p-3 bg-[#080808] border border-[#2e1045]">
              <span className="text-[#c466ff] font-bold block mb-1">Entire</span>
              <span className="text-zinc-400 text-[11px]">
                Tracks development history snapshots and immutable AST checkpoints.
              </span>
            </div>

            <div className="p-3 bg-[#080808] border border-[#2e1045]">
              <span className="text-[#c466ff] font-bold block mb-1">cfo.ai</span>
              <span className="text-zinc-400 text-[11px]">
                Models pricing tiers, gross margins, runway, and customer labor hours saved.
              </span>
            </div>

            <div className="p-3 bg-[#080808] border border-[#2e1045]">
              <span className="text-[#c466ff] font-bold block mb-1">Crustdata</span>
              <span className="text-zinc-400 text-[11px]">
                Real-time company firmographic enrichment powering destination payloads.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
