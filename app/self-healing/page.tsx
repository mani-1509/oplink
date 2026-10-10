"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SelfHealingDiff from "@/components/SelfHealingDiff";
import { IntegrationRun } from "@/lib/schemas";
import Link from "next/link";
import { ShieldCheck, Play, ArrowRight } from "lucide-react";

export default function SelfHealingPage() {
  const [runs, setRuns] = useState<IntegrationRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<IntegrationRun | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/runs")
      .then((res) => res.json())
      .then((data) => {
        if (data.runs && data.runs.length > 0) {
          setRuns(data.runs);
          setSelectedRun(data.runs[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-[#a600ff] selection:text-black">
      <Navbar variant="dashboard" />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7a07c5] mb-8">
          <div>
            <div className="text-xs font-mono text-[#c466ff] uppercase tracking-wider mb-1">
              [ BOUNDED AST REPAIR LOOP ]
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase text-white flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-[#a600ff]" /> SELF-HEALING & DIFF INSPECTOR
            </h1>
          </div>

          <Link
            href="/pipeline"
            className="px-4 py-2 bg-[#a600ff] hover:bg-[#c466ff] text-black font-mono font-bold text-xs uppercase flex items-center gap-2 border border-white shadow-[3px_3px_0px_#7a07c5]"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>TRIGGER NEW RUN</span>
          </Link>
        </div>

        {/* Run Selector */}
        {runs.length > 0 && (
          <div className="mb-6 p-4 bg-[#0d0d0d] border border-[#2e1045] flex items-center justify-between gap-4">
            <span className="text-xs font-mono text-zinc-400 uppercase">
              Select Historical Run Trace:
            </span>
            <select
              value={selectedRun?.id || ""}
              onChange={(e) => {
                const found = runs.find((r) => r.id === e.target.value);
                if (found) setSelectedRun(found);
              }}
              className="bg-[#140026] border border-[#7a07c5] text-[#c466ff] font-mono text-xs px-3 py-1.5 focus:outline-none"
            >
              {runs.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} - {r.sourceLead.name} ({r.sourceLead.companyDomain}) [{r.status.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Diff Viewer Component */}
        <SelfHealingDiff currentRun={selectedRun} />
      </main>

      <footer className="border-t border-[#7a07c5] bg-[#070707] py-6 px-4 text-center text-xs font-mono text-zinc-400">
        OPLINK SELF-HEALING REPAIR ENGINE // AST PATCH LOOP
      </footer>
    </div>
  );
}
