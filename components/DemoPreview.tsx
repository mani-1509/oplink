import { Terminal, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DemoPreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-[#7a07c5] bg-[#070707]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono text-[#c466ff] uppercase tracking-wider mb-2">
              [ HACKATHON LIVE DEMO FLOW ]
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-mono uppercase text-white tracking-tight">
              FROM CRM RECORD TO VERIFIED TASK
            </h2>
            <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-2 max-w-xl">
              Preview the execution trace: intentional schema bug $\to$ Zod rejection $\to$ Nebius diagnosis $\to$ auto-repaired destination task.
            </p>
          </div>

          <Link
            href="/pipeline"
            className="px-5 py-3 bg-[#a600ff] hover:bg-[#c466ff] text-black font-mono font-bold text-xs uppercase flex items-center gap-2 border border-white shadow-[4px_4px_0px_#7a07c5]"
          >
            <span>LAUNCH RUNNER IN APP</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Visual Terminal UI Mockup */}
        <div className="bg-[#0a0a0a] border-2 border-[#a600ff] shadow-[8px_8px_0px_#7a07c5] overflow-hidden">
          {/* Terminal Window Top Bar */}
          <div className="bg-[#140026] px-4 py-2.5 border-b border-[#7a07c5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full inline-block" />
              <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block" />
              <span className="w-3 h-3 bg-green-500 rounded-full inline-block" />
              <span className="text-xs font-mono text-zinc-300 ml-2 font-bold">
                oplink-engine // live-run-inspector.log
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#c466ff] uppercase">
              STATUS: ZERO ERRORS REMAINING
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 font-mono text-xs text-zinc-300 space-y-3 bg-[#080808] overflow-x-auto leading-relaxed">
            <div className="text-zinc-500">[2026-10-10T15:14:04Z] $ oplink execute --lead sarah.chen@stripe.com --enrich crustdata</div>
            
            <div className="text-white flex items-center gap-2">
              <span className="text-[#a600ff]">✔</span> Stage 01: CRM Record fetched: <span className="text-[#c466ff]">Sarah Chen (stripe.com)</span>
            </div>

            <div className="text-white flex items-center gap-2">
              <span className="text-[#a600ff]">✔</span> Stage 02: Crustdata Enrichment: <span className="text-emerald-400">Fintech Infrastructure | 7,000+ Headcount | $1B-$10B Rev</span>
            </div>

            <div className="text-white flex items-center gap-2">
              <span className="text-[#a600ff]">✔</span> Stage 03: Nebius Token Factory Agent generated AST mapping spec v1.0
            </div>

            {/* Error Highlight */}
            <div className="p-3 bg-red-950/40 border-l-4 border-red-500 text-red-300 text-xs">
              <span className="font-bold block">[VALIDATION REJECTED] Zod Schema Issue on field &apos;due_date&apos;</span>
              Reason: &apos;10/24/2026&apos; does not match strict ISO-8601 regex ^\d&#123;4&#125;-\d&#123;2&#125;-\d&#123;2&#125;$
            </div>

            {/* Repair Highlight */}
            <div className="p-3 bg-[#17002e] border-l-4 border-[#a600ff] text-[#c466ff] text-xs">
              <span className="font-bold block text-white">[SELF-HEALING REPAIR LOOP] Triggered Nebius 120B AST Diagnosis</span>
              Applied patch: Converted localized date &apos;10/24/2026&apos; $\to$ ISO standard &apos;2026-10-24&apos;. Re-evaluated Zod schema: 100% PASS.
            </div>

            <div className="text-emerald-400 flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Stage 05: Destination Task Created: &quot;[High Priority] Onboard Stripe, Inc. - Sarah Chen&quot; (Idempotency Key: oplink_lead_9821_stripe_com)
            </div>

            <div className="text-zinc-400 text-[11px] pt-2 border-t border-[#2e1045] flex items-center justify-between">
              <span>Telemetry: neatlogs trace recorded (ID: trace_9821_live)</span>
              <span>cfo.ai Modeled Savings: $22.50 (18 mins saved)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
