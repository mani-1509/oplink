import Navbar from "@/components/Navbar";
import CfoAiCalculator from "@/components/CfoAiCalculator";
import { DollarSign } from "lucide-react";

export default function EconomicsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-[#a600ff] selection:text-black">
      <Navbar variant="dashboard" />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="pb-6 border-b border-[#7a07c5] mb-8">
          <div className="text-xs font-mono text-[#c466ff] uppercase tracking-wider mb-1">
            [ CFO.AI FINANCIAL JUSTIFICATION // UNIT ECONOMICS ]
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase text-white flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-[#a600ff]" /> CFO.AI UNIT ECONOMICS & ROI SIMULATOR
          </h1>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-2">
            Simulate monthly SaaS pricing, inference COGS (Nebius + Crustdata + AWS), and labor hours saved per customer workspace.
          </p>
        </div>

        <CfoAiCalculator />
      </main>

      <footer className="border-t border-[#7a07c5] bg-[#070707] py-6 px-4 text-center text-xs font-mono text-zinc-400">
        OPLINK CFO.AI UNIT ECONOMICS MODEL // ROI ENGINE
      </footer>
    </div>
  );
}
