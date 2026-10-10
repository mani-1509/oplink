"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import WorkflowBuilder from "@/components/WorkflowBuilder";
import Link from "next/link";
import { ArrowLeft, Layers, ShieldCheck, DollarSign, RefreshCw, Cpu, Activity } from "lucide-react";

function WorkflowDetailContent() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);

  const fetchWorkflow = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/workflows/${id}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error("Workflow fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflow();
  }, [id]);

  const handleSaveMapping = async (mapping: any, changeReason: string) => {
    const res = await fetch(`/api/workflows/${id}/mappings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mapping, changeReason }),
    });
    const result = await res.json();
    if (result.success) {
      fetchWorkflow();
    }
  };

  const handleTriggerRun = async (leadId: string, deliberateFailure: boolean) => {
    setIsExecuting(true);
    try {
      const res = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: id,
          leadId,
          deliberateFailure,
          autoSelfHeal: true,
        }),
      });
      const result = await res.json();
      if (result.run) {
        router.push(`/runs/${result.run.id}`);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-mono">
        <div className="flex items-center gap-2 text-xs uppercase text-[#c466ff]">
          <RefreshCw className="w-4 h-4 animate-spin" /> LOADING WORKFLOW CONFIGURATION FROM MONGODB...
        </div>
      </div>
    );
  }

  if (!data?.workflow) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center font-mono p-4">
        <h2 className="text-base font-bold uppercase mb-2">WORKFLOW NOT FOUND</h2>
        <Link href="/workspace" className="text-xs text-[#c466ff] underline">
          &larr; Return to Workspace
        </Link>
      </div>
    );
  }

  const { workflow, mappings = [], connectors = [], financialEstimates = [], runs = [] } = data;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-[#a600ff] selection:text-black font-mono">
      <Navbar variant="dashboard" />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7a07c5]">
          <div>
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1.5 text-xs text-[#c466ff] hover:underline mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> BACK TO WORKSPACE
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white flex items-center gap-3">
              <Layers className="w-7 h-7 text-[#a600ff]" /> {workflow.name}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">{workflow.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 bg-[#140026] border border-[#7a07c5] text-[#c466ff]">
              STATUS: {workflow.status?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Workflow Builder Component */}
        <WorkflowBuilder
          workflow={workflow}
          mappings={mappings}
          connectors={connectors}
          onSaveMapping={handleSaveMapping}
          onTriggerRun={handleTriggerRun}
          isExecuting={isExecuting}
        />

        {/* Mapping Revision History (Table 3) */}
        <div className="bg-[#0d0d0d] border border-[#7a07c5] p-6">
          <h3 className="text-xs font-bold uppercase text-white flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-[#a600ff]" /> IMMUTABLE MAPPING REVISION HISTORY ({mappings.length})
          </h3>

          <div className="space-y-3">
            {mappings.map((m: any) => (
              <div key={m.id} className="p-3 bg-[#050505] border border-[#2e1045] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#c466ff] mr-3">v{m.version}</span>
                  <span className="text-white">{m.changeReason || "Baseline revision"}</span>
                  <span className="text-[10px] text-zinc-500 ml-3">
                    Created by: {m.createdBy} ({new Date(m.createdAt).toLocaleDateString()})
                  </span>
                </div>
                <span className="text-[10px] uppercase text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 border border-emerald-500">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-[#7a07c5] bg-[#070707] py-6 px-4 text-center text-xs text-zinc-400">
        OPLINK WORKFLOW CONFIG // MAPPING STUDIO
      </footer>
    </div>
  );
}

export default function WorkflowDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-mono text-xs uppercase text-[#c466ff]">
          <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Initializing Workflow...
        </div>
      }
    >
      <WorkflowDetailContent />
    </Suspense>
  );
}
