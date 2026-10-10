"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "What is Oplink and what problem does it solve?",
    answer:
      "Oplink is an AI-powered autonomous integration engineering agent. Small and growing businesses spend hours manually copying lead and company data between disconnected CRMs and task systems. Traditional integrations break silently when schemas evolve. Oplink automatically proposes mapping specs, enriches records with Crustdata, detects schema errors, and self-heals broken fields in real time.",
  },
  {
    question: "How does the Self-Healing Repair loop work?",
    answer:
      "When an integration runs, Oplink applies a dry-run in-memory transformation. The transformed payload is strictly validated using deterministic Zod schemas (e.g. verifying ISO-8601 date formats, email regex, required company attributes). If validation fails, the agent receives the structured AST error diff, diagnoses the exact field discrepancy, generates a repaired mapping spec (version 2), and re-verifies. The maximum retry depth is bounded to 2 attempts.",
  },
  {
    question: "How does Oplink integrate with Nebius Token Factory?",
    answer:
      "Oplink connects to Nebius Token Factory using the OpenAI-compatible SDK (baseURL: https://api.tokenfactory.nebius.com/v1/) with the 120B parameter model (openai/gpt-oss-120b). It formats typed system instructions to produce structured JSON field mapping rules and diagnosis patches.",
  },
  {
    question: "How does Oplink prevent duplicate task creation?",
    answer:
      "Every workflow execution computes a deterministic idempotency key (e.g., oplink_lead_9821_stripe_com). Before committing a write to the destination Task API, Oplink verifies whether a task with that key already exists. If detected, the duplicate write is safely blocked and logged as an idempotency event.",
  },
  {
    question: "What telemetry and audit trails are tracked?",
    answer:
      "Every step—source extraction, Crustdata enrichment latency, Nebius LLM tool calls, validation failures, self-healing diffs, and destination writes—is instrumented with neatlogs telemetry event streams. Development snapshots are anchored to Entire checkpoint IDs, and economic value is quantified in cfo.ai.",
  },
  {
    question: "How is the business value and ROI estimated?",
    answer:
      "Oplink calculates labor savings by modeling (minutes saved per successful run × monthly runs ÷ 60) × loaded hourly labor rate ($75/hr benchmark). When compared against low-latency Nebius inference ($0.0035/run) and Crustdata enrichment ($0.01/lookup), workspaces achieve a 90%+ gross margin and rapid payback.",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-[#7a07c5] bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="text-xs font-mono text-[#c466ff] uppercase tracking-wider mb-2">
            [ FREQUENTLY ASKED QUESTIONS ]
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-mono uppercase text-white tracking-tight flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-[#a600ff]" /> TECHNICAL SPECIFICATION FAQ
          </h2>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-2">
            Everything you need to know about the architecture, partner tooling, safety guards, and verification protocols.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`border transition-all brutalist-border-hover ${
                  isOpen
                    ? "bg-[#140026] border-[#a600ff] shadow-[4px_4px_0px_#7a07c5]"
                    : "bg-[#0d0d0d] border-[#2e1045] hover:border-[#7a07c5]"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-mono text-sm sm:text-base font-bold text-white uppercase cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[#a600ff] text-xs">0{idx + 1}.</span>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#c466ff] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed border-t border-[#2e1045]/60 mt-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
