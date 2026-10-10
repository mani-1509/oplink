"use client";

import { useState } from "react";
import { IntegrationRun, RunStep } from "@/lib/schemas";
import { Database, Binary, CheckCircle2, XCircle, Wrench, ArrowDown, ChevronRight, Eye, RefreshCw, Copy, Check } from "lucide-react";

interface PipelineVisualizerProps {
  currentRun: IntegrationRun | null;
  isExecuting: boolean;
  onRetry: () => void;
}

export default function PipelineVisualizer({
  currentRun,
  isExecuting,
  onRetry,
}: PipelineVisualizerProps) {
  const [selectedStep, setSelectedStep] = useState<RunStep | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!currentRun && !isExecuting) {
    return (
      <div className="bg-[#0d0d0d] border border-[#2e1045] p-6 sm:p-12 text-center my-6 sm:my-8 max-w-7xl mx-4 sm:mx-auto">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1a0033] border border-[#a600ff] text-[#c466ff] flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Binary className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h3 className="text-sm sm:text-lg font-mono font-bold uppercase text-white mb-2">
          NO ACTIVE EXECUTION PIPELINE
        </h3>
        <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto mb-4">
          Select a CRM lead from the controller above and click &quot;Trigger Integration Run&quot; to inspect the live execution graph, Crustdata enrichment, and self-healing engine.
        </p>
      </div>
    );
  }

  const steps = currentRun?.steps || [];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      {/* Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 bg-[#120024] border-2 border-[#a600ff] mb-6 sm:mb-8 shadow-[3px_3px_0px_#7a07c5] sm:shadow-[4px_4px_0px_#7a07c5]">
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
          <div className="w-2.5 h-2.5 bg-[#a600ff] animate-ping mt-1 sm:mt-0 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-mono font-bold text-white uppercase flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="truncate">RUN ID: {currentRun?.id || "INITIALIZING..."}</span>
              {currentRun?.status === "repairing" && (
                <span className="px-1.5 sm:px-2 py-0.5 bg-[#a600ff] text-black text-[9px] sm:text-[10px] font-black uppercase">
                  REPAIRING IN PROGRESS
                </span>
              )}
              {currentRun?.status === "succeeded" && (
                <span className="px-1.5 sm:px-2 py-0.5 bg-emerald-500 text-black text-[9px] sm:text-[10px] font-black uppercase">
                  VERIFIED PASS
                </span>
              )}
              {currentRun?.status === "failed" && (
                <span className="px-1.5 sm:px-2 py-0.5 bg-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase">
                  VALIDATION FAILED
                </span>
              )}
              {currentRun?.status === "blocked" && (
                <span className="px-1.5 sm:px-2 py-0.5 bg-zinc-700 text-zinc-300 text-[9px] sm:text-[10px] font-black uppercase">
                  RUN BLOCKED
                </span>
              )}
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#c466ff] font-mono mt-0.5 truncate">
              Key: {currentRun?.idempotencyKey || "evaluating..."}
              {currentRun?.isDuplicateBlocked && " (DUPLICATE BLOCKED)"}
            </div>
          </div>
        </div>

        {currentRun?.status === "failed" && (
          <button
            onClick={onRetry}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-[#a600ff] hover:bg-[#c466ff] text-black font-mono font-bold text-[11px] sm:text-xs uppercase flex items-center justify-center gap-1.5 border border-white shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            RETRY ({currentRun.attempts + 1}/{currentRun.maxAttempts})
          </button>
        )}
      </div>

      {/* Visual Pipeline Graph & Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Step Nodes Column */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2e1045]">
            <h3 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
              <Binary className="w-4 h-4 text-[#a600ff]" /> ORCHESTRATION PIPELINE STEPS
            </h3>
            <span className="text-[10px] font-mono text-zinc-400">
              {steps.length} STAGES LOGGED
            </span>
          </div>

          <div className="space-y-2.5 sm:space-y-3 relative">
            {steps.map((step, idx) => {
              const isSelected = selectedStep?.id === step.id;

              return (
                <div key={step.id} className="relative">
                  {/* Step Card */}
                  <div
                    onClick={() => setSelectedStep(step)}
                    className={`p-3 sm:p-4 border transition-all cursor-pointer brutalist-border-hover ${
                      isSelected
                        ? "bg-[#1c0033] border-2 border-[#c466ff] shadow-[3px_3px_0px_#a600ff]"
                        : step.status === "failed"
                        ? "bg-[#1f0a0a] border-red-500/80 hover:border-red-400"
                        : step.status === "repaired"
                        ? "bg-[#140026] border-[#a600ff] hover:border-[#c466ff]"
                        : "bg-[#0d0d0d] border-[#2e1045] hover:border-[#7a07c5]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                        {step.status === "succeeded" && (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                          </div>
                        )}
                        {step.status === "failed" && (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-950 border border-red-500 text-red-400 flex items-center justify-center animate-bounce shrink-0">
                            <XCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                          </div>
                        )}
                        {step.status === "repaired" && (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#2a004f] border border-[#a600ff] text-[#c466ff] flex items-center justify-center shrink-0">
                            <Wrench className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#c466ff]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-[11px] sm:text-xs font-mono font-bold text-white uppercase truncate">
                            0{idx + 1}. {step.title}
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase">
                            TYPE: {step.type}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[9px] sm:text-[10px] font-mono text-[#c466ff] bg-[#0a0a0a] px-1.5 py-0.5 border border-[#7a07c5]">
                          {step.durationMs ? `${step.durationMs}ms` : "OK"}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] sm:text-xs text-zinc-300 font-mono pl-7 sm:pl-8 leading-relaxed">
                      {step.detail}
                    </p>

                    <div className="mt-2 sm:mt-3 pl-7 sm:pl-8 flex items-center gap-4 text-[10px] sm:text-[11px] font-mono text-zinc-400">
                      <span className="flex items-center gap-1 text-[#c466ff] hover:underline">
                        <Eye className="w-3 h-3" /> Inspect JSON
                      </span>
                    </div>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="flex justify-center py-0.5 sm:py-1">
                      <ArrowDown className="w-3 h-3 text-[#7a07c5]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Payload & Step Inspector */}
        <div className="lg:col-span-5">
          <div className="bg-[#0d0d0d] border-2 border-[#7a07c5] p-4 sm:p-5 shadow-[4px_4px_0px_#2e1045]">
            <div className="flex items-center justify-between pb-3 border-b border-[#2e1045] mb-4">
              <span className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-[#a600ff]" /> STAGE PAYLOAD INSPECTOR
              </span>
              {selectedStep?.payload && (
                <button
                  onClick={() => copyToClipboard(JSON.stringify(selectedStep.payload, null, 2))}
                  className="text-[10px] font-mono text-[#c466ff] flex items-center gap-1 hover:text-white"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? "COPIED" : "COPY JSON"}
                </button>
              )}
            </div>

            {selectedStep ? (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="text-[10px] uppercase font-mono text-zinc-400">Active Stage</div>
                  <div className="text-xs sm:text-sm font-bold font-mono text-white mt-0.5">
                    {selectedStep.title}
                  </div>
                  <div className="text-[11px] sm:text-xs text-zinc-300 font-mono mt-1">
                    {selectedStep.detail}
                  </div>
                </div>

                {selectedStep.error && (
                  <div className="p-2.5 sm:p-3 bg-red-950/40 border border-red-500/60 text-[11px] sm:text-xs font-mono text-red-300">
                    <span className="font-bold uppercase block mb-0.5">Error Diagnostic:</span>
                    {selectedStep.error}
                  </div>
                )}

                <div>
                  <div className="text-[10px] uppercase font-mono text-zinc-400 mb-1.5 flex items-center justify-between">
                    <span>Evaluated JSON State:</span>
                    <span className="text-[#c466ff]">Zod Validated</span>
                  </div>
                  <pre className="p-2.5 sm:p-3 bg-[#070707] border border-[#2e1045] text-[10px] sm:text-[11px] font-mono text-[#c466ff] overflow-x-auto max-h-[340px] leading-relaxed max-w-full">
                    {JSON.stringify(selectedStep.payload, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-8 text-center text-xs font-mono text-zinc-400">
                <ChevronRight className="w-5 h-5 text-[#7a07c5] mx-auto mb-2" />
                Select any step on the left to inspect its live JSON input/output payload and transformation rules.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
