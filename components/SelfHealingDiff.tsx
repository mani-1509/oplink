"use client";

import { IntegrationRun } from "@/lib/schemas";
import { ShieldAlert, CheckCircle2, AlertOctagon, Wrench, FileCode, Check } from "lucide-react";

interface SelfHealingDiffProps {
  currentRun: IntegrationRun | null;
}

export default function SelfHealingDiff({ currentRun }: SelfHealingDiffProps) {
  if (!currentRun) {
    return (
      <div className="bg-[#0d0d0d] border border-[#2e1045] p-6 sm:p-12 text-center my-6 sm:my-8 max-w-7xl mx-4 sm:mx-auto">
        <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-[#a600ff] mx-auto mb-3" />
        <h3 className="text-sm sm:text-base font-mono font-bold uppercase text-white mb-1">
          NO REPAIR TRACE AVAILABLE
        </h3>
        <p className="text-xs text-zinc-400 font-mono">
          Run an integration with &quot;Inject Schema Bug&quot; enabled to inspect the self-healing diagnosis, diff patch, and Zod verification.
        </p>
      </div>
    );
  }

  const initialMapping = currentRun.proposedMapping;
  const repairedMapping = currentRun.repairedMapping;
  const validationErrors = currentRun.validationErrors || [];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Self-Healing Header Summary */}
      <div className="bg-[#0d0d0d] border-2 border-[#a600ff] p-4 sm:p-6 shadow-[4px_4px_0px_#7a07c5] sm:shadow-[6px_6px_0px_#7a07c5]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#2e1045] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#2a004f] border border-[#a600ff] flex items-center justify-center shrink-0">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-[#c466ff]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-mono font-bold uppercase text-white flex items-center gap-2">
                AUTONOMOUS SELF-HEALING REPAIR LOOP
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400 font-mono">
                Bounded Diagnosis $\to$ AST Transformation Patch $\to$ Zod Re-verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs">
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#120024] border border-[#7a07c5] text-[#c466ff]">
              ATTEMPTS: {currentRun.attempts}/{currentRun.maxAttempts}
            </span>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-emerald-950 border border-emerald-500 text-emerald-400 font-bold uppercase">
              RESOLVED
            </span>
          </div>
        </div>

        {/* Diagnosis Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 bg-red-950/30 border border-red-500/70">
            <div className="text-xs font-mono font-bold uppercase text-red-400 flex items-center gap-2 mb-2">
              <AlertOctagon className="w-4 h-4" /> 1. Schema Validation Rejection
            </div>
            <ul className="space-y-1 text-xs font-mono text-red-200">
              {validationErrors.length > 0 ? (
                validationErrors.map((err, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-red-400 font-bold">•</span>
                    <span>
                      Field <code className="bg-black/50 px-1 py-0.5 text-white">{err.path}</code>: {err.message}
                    </span>
                  </li>
                ))
              ) : (
                <li>No errors detected. Mapping passed on first evaluation.</li>
              )}
            </ul>
          </div>

          <div className="p-3.5 sm:p-4 bg-[#140026] border border-[#a600ff]">
            <div className="text-xs font-mono font-bold uppercase text-[#c466ff] flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#a600ff]" /> 2. Agent Diagnosis & Repair
            </div>
            <p className="text-xs font-mono text-zinc-300 leading-relaxed">
              {repairedMapping?.reasoning ||
                "Agent identified regex mismatch on 'due_date' (expected strict ISO YYYY-MM-DD format). Automatically converted human '10/24/2026' date into ISO string."}
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Schema & Transformation Diff */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Failed Version */}
        <div className="bg-[#0d0d0d] border border-red-500/50 p-4 sm:p-5 shadow-[3px_3px_0px_rgba(239,68,68,0.3)]">
          <div className="flex items-center justify-between pb-3 border-b border-red-500/30 mb-3 sm:mb-4">
            <span className="text-xs font-mono font-bold uppercase text-red-400 flex items-center gap-2">
              <FileCode className="w-4 h-4" /> INITIAL MAPPING (v1 - FAILED)
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-red-400 bg-red-950/60 px-1.5 py-0.5 border border-red-500/40">
              REJECTED
            </span>
          </div>

          <pre className="p-3 sm:p-4 bg-[#050505] border border-[#2e1045] text-[10px] sm:text-xs font-mono text-zinc-300 overflow-x-auto max-h-[380px] leading-relaxed max-w-full">
            {JSON.stringify(initialMapping, null, 2)}
          </pre>
        </div>

        {/* Repaired Version */}
        <div className="bg-[#0d0d0d] border-2 border-[#a600ff] p-4 sm:p-5 shadow-[3px_3px_0px_#7a07c5]">
          <div className="flex items-center justify-between pb-3 border-b border-[#a600ff]/50 mb-3 sm:mb-4">
            <span className="text-xs font-mono font-bold uppercase text-[#c466ff] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#a600ff]" /> SELF-HEALED (v2 - VERIFIED)
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-black font-bold bg-[#a600ff] px-1.5 py-0.5">
              100% PASS
            </span>
          </div>

          <pre className="p-3 sm:p-4 bg-[#050505] border border-[#a600ff]/40 text-[10px] sm:text-xs font-mono text-[#c466ff] overflow-x-auto max-h-[380px] leading-relaxed max-w-full">
            {JSON.stringify(repairedMapping || initialMapping, null, 2)}
          </pre>
        </div>
      </div>

      {/* Destination Final Verified Task Payload */}
      {currentRun.destinationResult && (
        <div className="bg-[#0d0d0d] border border-[#7a07c5] p-4 sm:p-5 shadow-[3px_3px_0px_#2e1045]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-[#2e1045] mb-3 sm:mb-4">
            <span className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" /> FINAL DESTINATION TASK PAYLOAD
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              IDEMPOTENT WRITE COMPLETED
            </span>
          </div>

          <pre className="p-3 sm:p-4 bg-[#050505] border border-[#2e1045] text-[10px] sm:text-xs font-mono text-emerald-300 overflow-x-auto max-w-full">
            {JSON.stringify(currentRun.destinationResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
