import Navbar from "@/components/Navbar";
import EvidenceDrawer from "@/components/EvidenceDrawer";
import { Terminal } from "lucide-react";

export default function EvidencePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-[#a600ff] selection:text-black">
      <Navbar variant="dashboard" />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="pb-6 border-b border-[#7a07c5] mb-8">
          <div className="text-xs font-mono text-[#c466ff] uppercase tracking-wider mb-1">
            [ SYSTEM TELEMETRY & AUDIT PROOF // REALTIME STREAM ]
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase text-white flex items-center gap-3">
            <Terminal className="w-7 h-7 text-[#a600ff]" /> TELEMETRY & AUDIT PROOF HUB
          </h1>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-2">
            Inspect live neatlogs traces, Entire checkpoint snapshots, and Crustdata enrichment verifications.
          </p>
        </div>

        <EvidenceDrawer />
      </main>

      <footer className="border-t border-[#7a07c5] bg-[#070707] py-6 px-4 text-center text-xs font-mono text-zinc-400">
        OPLINK TELEMETRY & AUDIT PROOF // PRODUCTION LOGS
      </footer>
    </div>
  );
}
