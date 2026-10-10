"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft, Activity, CheckCircle2, XCircle, Wrench, RefreshCw, ExternalLink, ShieldCheck, Database, Layers } from "lucide-react";
import confetti from "canvas-confetti";

function RunDetailContent() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [run, setRun] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [selectedStep, setSelectedStep] = useState<any>(null);

  const fetchRun = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/runs/${id}`);
      const json = await res.json();
      if (json.run) {
        setRun(json.run);
        if (json.run.steps?.length > 0) {
          setSelectedStep(json.run.steps[0]);
        }
      }
    } catch (err) {
      console.error("Fetch run error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRun();
  }, [id]);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const res = await fetch(`/api/runs/${id}/retry`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.run) {
        setRun(data.run);
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.8 },
          colors: ["#a600ff", "#c466ff", "#ffffff"],
        });
      }
    } finally {
      setRetrying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-mono">
        <div className="flex items-center gap-2 text-xs uppercase text-[#c466ff]">
          <RefreshCw className="w-4 h-4 animate-spin" /> FETCHING RUN TELEMETRY FROM MONGODB...
        </div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center font-mono p-4">
        <h2 className="text-base font-bold uppercase mb-2">RUN NOT FOUND</h2>
        <Link href="/workspace" className="text-xs text-[#c466ff] underline">
          &larr; Return to Workspace
        </Link>
      </div>
    );
  }

  const steps = run.steps || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-[#a600ff] selection:text-black font-mono">
      <Navbar variant="dashboard" />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Breadcrumb & Run Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7a07c5]">
          <div>
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1.5 text-xs text-[#c466ff] hover:underline mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> BACK TO WORKSPACE
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-white flex items-center gap-2">
                <Activity className="w-7 h-7 text-[#a600ff]" /> RUN: {run.id}
              </h1>
              <span
                className={`text-xs px-2.5 py-1 uppercase font-bold ${
                  run.status === "success"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-500"
                    : run.status === "self_healing"
                    ? "bg-[#2a004f] text-[#c466ff] border border-[#a600ff]"
                    : "bg-red-950 text-red-400 border border-red-500"
                }`}
              >
                {run.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Lead: {run.sourceLead?.name} ({run.sourceLead?.companyDomain}) • Key: {run.idempotencyKey}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {run.status === "failed" && (
              <button
                onClick={handleRetry}
                disabled={retrying || run.attempts >= run.maxAttempts}
                className="px-4 py-2 bg-[#a600ff] hover:bg-[#c466ff] text-black text-xs font-bold uppercase border border-white shadow-[3px_3px_0px_#7a07c5] flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${retrying ? "animate-spin" : ""}`} />
                {retrying ? "REPAIRING..." : `RETRY ATTEMPT (${run.attempts + 1}/${run.maxAttempts})`}
              </button>
            )}

            <button
              onClick={fetchRun}
              className="p-2 bg-[#140026] border border-[#7a07c5] text-[#c466ff] hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telemetry Evidence Bar (Table 6) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#0d0d0d] border border-[#7a07c5]">
            <div className="text-[10px] text-zinc-400 uppercase mb-1">neatlogs Trace</div>
            <div className="text-xs text-white font-bold mb-1 truncate">{run.neatlogsTraceId}</div>
            <a
              href={run.neatlogsTraceUrl || "https://neatlogs.com/hackathon"}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[#c466ff] hover:underline flex items-center gap-1"
            >
              <span>View neatlogs dashboard</span> <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 bg-[#0d0d0d] border border-[#7a07c5]">
            <div className="text-[10px] text-zinc-400 uppercase mb-1">Entire Checkpoint</div>
            <div className="text-xs text-white font-bold mb-1">{run.entireCheckpointId}</div>
            <a
              href="https://hack.entire.io/neathacks-2026/"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[#c466ff] hover:underline flex items-center gap-1"
            >
              <span>Entire AST snapshot</span> <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 bg-[#0d0d0d] border border-[#7a07c5]">
            <div className="text-[10px] text-zinc-400 uppercase mb-1">cfo.ai Modeled Savings</div>
            <div className="text-base text-emerald-400 font-bold mb-1">
              ${run.cfoAiEstimatedSavingsUsd || 22.50}
            </div>
            <span className="text-[10px] text-zinc-400">18 minutes labor saved</span>
          </div>
        </div>

        {/* Run Steps Timeline (Table 5) & Stage Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-bold uppercase text-white pb-2 border-b border-[#2e1045]">
              EXECUTION TIMELINE STEPS ({steps.length})
            </h3>

            <div className="space-y-3">
              {steps.map((step: any, idx: number) => {
                const isSelected = selectedStep?.id === step.id;
                return (
                  <div
                    key={step.id}
                    onClick={() => setSelectedStep(step)}
                    className={`p-4 border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1c0033] border-2 border-[#c466ff] shadow-[4px_4px_0px_#a600ff]"
                        : step.status === "failure"
                        ? "bg-[#1f0a0a] border-red-500/80"
                        : step.status === "repaired"
                        ? "bg-[#140026] border-[#a600ff]"
                        : "bg-[#0d0d0d] border-[#2e1045]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {step.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {step.status === "failure" && <XCircle className="w-4 h-4 text-red-400 animate-bounce" />}
                        {step.status === "repaired" && <Wrench className="w-4 h-4 text-[#c466ff]" />}
                        <span className="text-xs font-bold text-white uppercase">
                          0{idx + 1}. {step.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#c466ff]">{step.durationMs ? `${step.durationMs}ms` : "OK"}</span>
                    </div>
                    <p className="text-xs text-zinc-300 pl-6 leading-relaxed">{step.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-20 bg-[#0d0d0d] border-2 border-[#7a07c5] p-5 shadow-[5px_5px_0px_#2e1045]">
              <h3 className="text-xs font-bold uppercase text-white pb-3 border-b border-[#2e1045] mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-[#a600ff]" /> STAGE PAYLOAD & ERROR LOG
              </h3>

              {selectedStep ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] uppercase text-zinc-400">Step Title</div>
                    <div className="text-xs font-bold text-white mt-0.5">{selectedStep.title}</div>
                  </div>

                  {selectedStep.error && (
                    <div className="p-3 bg-red-950/40 border border-red-500 text-xs text-red-300">
                      {selectedStep.error}
                    </div>
                  )}

                  <div>
                    <div className="text-[10px] uppercase text-zinc-400 mb-1">JSON Payload:</div>
                    <pre className="p-3 bg-[#050505] border border-[#2e1045] text-[11px] text-[#c466ff] overflow-x-auto max-h-[380px]">
                      {JSON.stringify(selectedStep.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-zinc-400 text-center py-8">Select a step on the left to inspect payload</div>
              )}
            </div>
          </div>
        </div>

        {/* Final Destination Output */}
        {run.destinationResult && (
          <div className="bg-[#0d0d0d] border border-emerald-500/80 p-6">
            <h3 className="text-xs font-bold uppercase text-white flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> FINAL OUTPUT TASK RECORD (WRITTEN TO DESTINATION API)
            </h3>
            <pre className="p-4 bg-[#050505] border border-[#2e1045] text-xs text-emerald-300 overflow-x-auto">
              {JSON.stringify(run.destinationResult, null, 2)}
            </pre>
          </div>
        )}
      </main>

      <footer className="border-t border-[#7a07c5] bg-[#070707] py-6 px-4 text-center text-xs text-zinc-400">
        OPLINK EXECUTION RUN TRACE // RUNTIME INSPECTOR
      </footer>
    </div>
  );
}

export default function RunDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-mono text-xs uppercase text-[#c466ff]">
          <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Initializing Run Inspector...
        </div>
      }
    >
      <RunDetailContent />
    </Suspense>
  );
}
