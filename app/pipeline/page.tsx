"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PipelineVisualizer from "@/components/PipelineVisualizer";
import { Lead, IntegrationRun } from "@/lib/schemas";
import { SAMPLE_LEADS } from "@/lib/mockDb";
import confetti from "canvas-confetti";

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>(SAMPLE_LEADS);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(SAMPLE_LEADS[0].id);
  const [customLead, setCustomLead] = useState<Lead | null>(null);
  const [deliberateFailure, setDeliberateFailure] = useState(true);
  const [autoSelfHeal, setAutoSelfHeal] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentRun, setCurrentRun] = useState<IntegrationRun | null>(null);

  useEffect(() => {
    fetch("/api/demo/leads")
      .then((res) => res.json())
      .then((data) => {
        if (data.leads && data.leads.length > 0) {
          setLeads(data.leads);
        }
      })
      .catch(() => {});
  }, []);

  const handleRunIntegration = async () => {
    setIsExecuting(true);
    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLeadId,
          customLead: customLead || undefined,
          deliberateFailure,
          autoSelfHeal,
        }),
      });

      const data = await response.json();
      if (data.run) {
        setCurrentRun(data.run);
        if (data.run.status === "self_healing" || data.run.status === "succeeded" || data.run.status === "success") {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ["#a600ff", "#c466ff", "#ffffff", "#7a07c5"],
          });
        }
      }
    } catch (err) {
      console.error("Run error:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleRetry = async () => {
    if (!currentRun) return;
    setIsExecuting(true);
    try {
      const response = await fetch(`/api/runs/${currentRun.id}/retry`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.run) {
        setCurrentRun(data.run);
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.8 },
          colors: ["#a600ff", "#c466ff", "#ffffff"],
        });
      }
    } catch (err) {
      console.error("Retry error:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-[#a600ff] selection:text-black font-mono">
      <Navbar variant="dashboard" />

      {/* Controller Header */}
      <Hero
        leads={leads}
        selectedLeadId={selectedLeadId}
        setSelectedLeadId={setSelectedLeadId}
        customLead={customLead}
        setCustomLead={setCustomLead}
        deliberateFailure={deliberateFailure}
        setDeliberateFailure={setDeliberateFailure}
        autoSelfHeal={autoSelfHeal}
        setAutoSelfHeal={setAutoSelfHeal}
        onRunIntegration={handleRunIntegration}
        isExecuting={isExecuting}
      />

      {/* Live Visualizer */}
      <div className="flex-1">
        <PipelineVisualizer
          currentRun={currentRun}
          isExecuting={isExecuting}
          onRetry={handleRetry}
        />
      </div>

      <footer className="border-t border-[#7a07c5] bg-[#070707] py-6 px-4 text-center text-xs font-mono text-zinc-400">
        OPLINK LIVE PIPELINE RUNNER // EXECUTION ENGINE
      </footer>
    </div>
  );
}
