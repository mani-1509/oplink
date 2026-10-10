"use client";

import { useEffect, useState } from "react";
import { NeatlogsEvent } from "@/lib/neatlogs";
import { Terminal, ExternalLink, ShieldCheck, Layers, Activity, RefreshCw } from "lucide-react";

export default function EvidenceDrawer() {
  const [events, setEvents] = useState<NeatlogsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/telemetry/neatlogs");
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error("Telemetry fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Evidence & Partner Stack Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* neatlogs card */}
        <div className="bg-[#0d0d0d] border-2 border-[#a600ff] p-4 sm:p-5 shadow-[3px_3px_0px_#7a07c5]">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xs font-mono font-bold uppercase text-[#c466ff] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#a600ff]" /> neatlogs Telemetry
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 border border-emerald-500/40">
              LIVE
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-300 font-mono mb-3 sm:mb-4 leading-relaxed">
            All model calls, tool executions, Zod validation rejections, and before/after self-healing traces are recorded into neatlogs.
          </p>
          <a
            href="https://neatlogs.com/hackathon"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-[#c466ff] hover:underline"
          >
            <span>neatlogs.com/hackathon</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Entire Checkpoint card */}
        <div className="bg-[#0d0d0d] border border-[#7a07c5] p-4 sm:p-5 shadow-[3px_3px_0px_#2e1045]">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#a600ff]" /> Entire Checkpoint
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-[#c466ff] bg-[#120024] px-1.5 py-0.5 border border-[#7a07c5] truncate max-w-[140px]">
              chk_oplink_v1
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-300 font-mono mb-3 sm:mb-4 leading-relaxed">
            Repository context snapshot, AST verification graphs, and development commit stages tracked via Entire CLI checkpoints.
          </p>
          <a
            href="https://hack.entire.io/neathacks-2026/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-[#c466ff] hover:underline"
          >
            <span>hack.entire.io/neathacks</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Crustdata card */}
        <div className="bg-[#0d0d0d] border border-[#7a07c5] p-4 sm:p-5 shadow-[3px_3px_0px_#2e1045]">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#a600ff]" /> Crustdata Intel
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-[#c466ff] bg-[#120024] px-1.5 py-0.5 border border-[#7a07c5]">
              VERIFIED
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-300 font-mono mb-3 sm:mb-4 leading-relaxed">
            Company domain lookups enrich destination tasks with validated employee counts, industries, and business descriptions.
          </p>
          <a
            href="https://crustdata.com/company-data-api"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-[#c466ff] hover:underline"
          >
            <span>crustdata.com/api</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Live neatlogs Stream Table */}
      <div className="bg-[#0d0d0d] border-2 border-[#a600ff] p-4 sm:p-5 shadow-[4px_4px_0px_#7a07c5]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#2e1045] mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#a600ff]" />
            <span className="text-xs font-mono font-bold uppercase text-white truncate">
              NEATLOGS EVENT STREAM ({events.length} LOGGED)
            </span>
          </div>
          <button
            onClick={fetchTelemetry}
            className="self-start sm:self-auto text-[10px] sm:text-[11px] font-mono text-[#c466ff] flex items-center gap-1 hover:text-white px-2 py-1 bg-[#120024] border border-[#7a07c5]"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            REFRESH STREAM
          </button>
        </div>

        {events.length === 0 ? (
          <div className="p-6 sm:p-8 text-center text-xs font-mono text-zinc-400">
            No telemetry events recorded yet. Run an integration to start emitting live neatlogs traces.
          </div>
        ) : (
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-left font-mono text-xs border-collapse min-w-[580px]">
              <thead>
                <tr className="border-b border-[#2e1045] text-zinc-400 text-[10px] uppercase">
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Event</th>
                  <th className="pb-2">Step</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Duration</th>
                  <th className="pb-2">Metadata Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f0a33]">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#150029] transition-colors">
                    <td className="py-2 text-[10px] text-zinc-400">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2 text-[#c466ff] font-bold text-[10px] sm:text-[11px]">
                      {ev.eventType}
                    </td>
                    <td className="py-2 text-white text-[11px] sm:text-xs">{ev.stepName}</td>
                    <td className="py-2">
                      <span
                        className={`text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 uppercase font-bold ${
                          ev.status === "success"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500"
                            : ev.status === "error"
                            ? "bg-red-950 text-red-400 border border-red-500"
                            : ev.status === "repaired"
                            ? "bg-[#2a004f] text-[#c466ff] border border-[#a600ff]"
                            : "bg-[#141414] text-zinc-400"
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-2 text-[10px] text-zinc-400">
                      {ev.durationMs ? `${ev.durationMs}ms` : "-"}
                    </td>
                    <td className="py-2 text-[10px] text-zinc-300 max-w-[200px] truncate">
                      {JSON.stringify(ev.metadata)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
