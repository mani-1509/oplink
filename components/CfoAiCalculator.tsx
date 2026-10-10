"use client";

import { useState } from "react";
import { DollarSign, Clock, Calculator, ExternalLink } from "lucide-react";
import { calculateEconomics } from "@/lib/business/roi-calculator";

export default function CfoAiCalculator() {
  const [customers, setCustomers] = useState(150);
  const [runsPerMonth, setRunsPerMonth] = useState(600);
  const [laborCostPerHour, setLaborCostPerHour] = useState(75);
  const [minutesSavedPerRun, setMinutesSavedPerRun] = useState(18);
  const [pricePerMonth, setPricePerMonth] = useState(199);

  const nebiusCostPerRun = 0.0035;
  const crustdataCostPerRun = 0.01;
  const awsMonthlyHosting = 240;

  const result = calculateEconomics({
    customers,
    runsPerMonth,
    laborCostPerHour,
    minutesSavedPerRun,
    pricePerMonth,
    nebiusCostPerRun,
    crustdataCostPerRun,
    awsMonthlyHosting,
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* cfo.ai Integration Header */}
      <div className="bg-[#0d0d0d] border-2 border-[#a600ff] p-4 sm:p-6 shadow-[4px_4px_0px_#7a07c5] sm:shadow-[6px_6px_0px_#7a07c5]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2e1045] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2a004f] border border-[#a600ff] flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-[#c466ff]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-mono font-bold uppercase text-white flex items-center gap-2">
                CFO.AI UNIT ECONOMICS & ROI ENGINE
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400 font-mono">
                Assumptions-based financial model modeled in cfo.ai • Base Currency: USD ($)
              </p>
            </div>
          </div>

          <a
            href="https://cfo.ai/neathacks"
            target="_blank"
            rel="noreferrer"
            className="self-start sm:self-auto px-3 py-1.5 bg-[#120024] hover:bg-[#a600ff] hover:text-black text-[#c466ff] font-mono text-xs uppercase flex items-center gap-1.5 border border-[#7a07c5] transition-all"
          >
            <span>cfo.ai/neathacks</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-[#120024] border border-[#a600ff] p-3 sm:p-4">
            <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase">Annualized MRR (12x)</div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
              ${result.annualizedMrr.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#c466ff] font-mono mt-0.5">
              ${result.monthlyRevenue.toLocaleString()} / mo revenue
            </div>
          </div>

          <div className="bg-[#120024] border border-[#a600ff] p-3 sm:p-4">
            <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase">Gross Margin</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1">
              {result.grossMarginPercentage !== null ? `${result.grossMarginPercentage.toFixed(1)}%` : "N/A"}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
              Direct COGS: ${Math.round(result.totalDirectCosts).toLocaleString()}/mo
            </div>
          </div>

          <div className="bg-[#120024] border border-[#a600ff] p-3 sm:p-4">
            <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase">Customer Labor Savings</div>
            <div className="text-xl sm:text-2xl font-black text-[#c466ff] font-mono mt-1">
              ${Math.round(result.customerMonthlyLaborSavings).toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
              {Math.round(result.customerMonthlyHoursSaved)} hrs/mo per workspace
            </div>
          </div>

          <div className="bg-[#120024] border border-[#a600ff] p-3 sm:p-4">
            <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase">Customer ROI Multiple</div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
              {result.customerRoiMultiple !== null ? `${result.customerRoiMultiple.toFixed(1)}x` : "N/A"}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
              Net value vs subscription
            </div>
          </div>
        </div>

        {/* Interactive Sliders Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pt-4 border-t border-[#2e1045]">
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#a600ff]" /> WORKSPACE & PRICING ASSUMPTIONS (USD)
            </h3>

            {/* Price per month slider */}
            <div>
              <div className="flex justify-between text-xs font-mono text-zinc-300 mb-1.5">
                <span className="text-[11px] sm:text-xs">Monthly Subscription Price:</span>
                <span className="font-bold text-[#c466ff]">${pricePerMonth}/mo</span>
              </div>
              <input
                type="range"
                min="0"
                max="999"
                step="10"
                value={pricePerMonth}
                onChange={(e) => setPricePerMonth(Number(e.target.value))}
                className="w-full accent-[#a600ff] bg-zinc-800"
              />
            </div>

            {/* Customers slider */}
            <div>
              <div className="flex justify-between text-xs font-mono text-zinc-300 mb-1.5">
                <span className="text-[11px] sm:text-xs">Active Business Customers:</span>
                <span className="font-bold text-[#c466ff]">{customers} Workspaces</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={customers}
                onChange={(e) => setCustomers(Number(e.target.value))}
                className="w-full accent-[#a600ff] bg-zinc-800"
              />
            </div>

            {/* Runs per customer slider */}
            <div>
              <div className="flex justify-between text-xs font-mono text-zinc-300 mb-1.5">
                <span className="text-[11px] sm:text-xs">Monthly Runs / Customer:</span>
                <span className="font-bold text-[#c466ff]">{runsPerMonth} runs</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={runsPerMonth}
                onChange={(e) => setRunsPerMonth(Number(e.target.value))}
                className="w-full accent-[#a600ff] bg-zinc-800"
              />
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#a600ff]" /> LABOR & AUTOMATION SAVINGS MODEL
            </h3>

            {/* Labor rate slider */}
            <div>
              <div className="flex justify-between text-xs font-mono text-zinc-300 mb-1.5">
                <span className="text-[11px] sm:text-xs">Loaded Hourly Labor Cost:</span>
                <span className="font-bold text-[#c466ff]">${laborCostPerHour} / hr</span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={laborCostPerHour}
                onChange={(e) => setLaborCostPerHour(Number(e.target.value))}
                className="w-full accent-[#a600ff] bg-zinc-800"
              />
            </div>

            {/* Minutes saved per run slider */}
            <div>
              <div className="flex justify-between text-xs font-mono text-zinc-300 mb-1.5">
                <span className="text-[11px] sm:text-xs">Manual Minutes Saved / Run:</span>
                <span className="font-bold text-[#c466ff]">{minutesSavedPerRun} min</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                step="1"
                value={minutesSavedPerRun}
                onChange={(e) => setMinutesSavedPerRun(Number(e.target.value))}
                className="w-full accent-[#a600ff] bg-zinc-800"
              />
            </div>

            {/* Cost Breakdown Info */}
            <div className="p-3 bg-[#080808] border border-[#2e1045] space-y-1 text-[10px] sm:text-[11px] font-mono text-zinc-400">
              <div className="flex justify-between">
                <span>Nebius Model Inference ($/run):</span>
                <span className="text-white">${nebiusCostPerRun}</span>
              </div>
              <div className="flex justify-between">
                <span>Crustdata Company Lookup ($/run):</span>
                <span className="text-white">${crustdataCostPerRun}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Monthly Direct Costs:</span>
                <span className="text-white">${Math.round(result.totalDirectCosts).toLocaleString()}</span>
              </div>
              <div className="pt-1.5 text-[9px] text-zinc-500 border-t border-[#1a1a1a]">
                * Modeled in USD. Indian enterprise equivalent estimated at ₹86.5/USD. Direct delivery costs include token inference and data API lookups.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
