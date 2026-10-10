"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Plus, ArrowRight, Play, Database, Layers, Activity, RefreshCw, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function WorkspacePage() {
  const { user, openAuthModal } = useAuth();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowDesc, setNewWorkflowDesc] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wfRes, compRes, runsRes] = await Promise.all([
        fetch("/api/workflows").then((r) => r.json()),
        fetch("/api/companies/search").then((r) => r.json()),
        fetch("/api/runs").then((r) => r.json()),
      ]);

      if (wfRes.workflows) setWorkflows(wfRes.workflows);
      if (compRes.companies) setCompanies(compRes.companies);
      if (runsRes.runs) setRuns(runsRes.runs);
    } catch (err) {
      console.error("Fetch workspace error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    setShowCreateModal(true);
  };

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflowName) return;
    setCreating(true);

    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newWorkflowName,
          description: newWorkflowDesc,
        }),
      });

      const data = await res.json();
      if (data.workflow) {
        setWorkflows([data.workflow, ...workflows]);
        setNewWorkflowName("");
        setNewWorkflowDesc("");
        setShowCreateModal(false);
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-[#a600ff] selection:text-black font-mono">
      <Navbar variant="dashboard" />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Workspace Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7a07c5]">
          <div>
            <div className="text-xs text-[#c466ff] uppercase tracking-wider mb-1">
              [ MONGODB WORKSPACE HUB // SECTION 5 ]
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white flex items-center gap-3">
              <Database className="w-7 h-7 text-[#a600ff]" /> WORKSPACE & INTEGRATIONS
            </h1>
            {user ? (
              <p className="text-xs text-zinc-400 mt-1">
                Signed in as <span className="text-white font-bold">{user.name}</span> ({user.email})
              </p>
            ) : (
              <p className="text-xs text-[#c466ff] mt-1 flex items-center gap-1.5">
                <span>Demo Guest Mode</span> • <button onClick={openAuthModal} className="underline hover:text-white cursor-pointer">Sign in / Register</button>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              title="Refresh MongoDB collections"
              className="p-2.5 bg-[#140026] border border-[#7a07c5] text-[#c466ff] hover:text-white cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-[#a600ff] hover:bg-[#c466ff] text-black font-bold text-xs uppercase flex items-center gap-2 border border-white shadow-[3px_3px_0px_#7a07c5] cursor-pointer"
            >
              <Plus className="w-4 h-4" /> CREATE WORKFLOW
            </button>
          </div>
        </div>

        {/* Workflows Grid (Table 2) */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#2e1045] mb-4">
            <h2 className="text-sm font-bold uppercase text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#a600ff]" /> REGISTERED INTEGRATION WORKFLOWS ({workflows.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                className="bg-[#0d0d0d] border-2 border-[#7a07c5] p-5 shadow-[4px_4px_0px_#2e1045] flex flex-col justify-between hover:border-[#a600ff] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2e1045]">
                    <span className="text-[10px] uppercase text-[#c466ff] bg-[#140026] px-2 py-0.5 border border-[#7a07c5]">
                      MAPPING REV: v{wf.currentMappingVersion || 1}
                    </span>
                    <span className="text-[10px] uppercase text-emerald-400 font-bold">
                      {wf.status?.toUpperCase() || "ACTIVE"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{wf.name}</h3>
                  <p className="text-xs text-zinc-400 mb-4 leading-relaxed line-clamp-2">
                    {wf.description || "Inbound CRM Lead to Task API autonomous mapping workflow."}
                  </p>

                  <div className="p-2.5 bg-[#050505] border border-[#2e1045] text-[11px] text-zinc-400 space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>Source:</span>
                      <span className="text-[#c466ff]">{wf.sourceType || "mock_crm"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Destination:</span>
                      <span className="text-[#c466ff]">{wf.destinationType || "mock_task"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-[#2e1045]">
                  <Link
                    href={`/workflows/${wf.id}`}
                    className="flex-1 py-2 bg-[#140026] hover:bg-[#a600ff] hover:text-black text-[#c466ff] text-xs font-bold uppercase text-center border border-[#7a07c5] transition-all"
                  >
                    CONFIG & BUILDER
                  </Link>
                  <Link
                    href={`/workflows/${wf.id}`}
                    className="px-3 py-2 bg-[#a600ff] hover:bg-[#c466ff] text-black text-xs font-bold uppercase flex items-center gap-1 border border-white"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Execution Runs (Table 4) */}
        <div className="bg-[#0d0d0d] border-2 border-[#a600ff] p-6 shadow-[6px_6px_0px_#7a07c5]">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e1045] mb-4">
            <h2 className="text-sm font-bold uppercase text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#a600ff]" /> RECENT EXECUTION RUNS ({runs.length})
            </h2>
            <Link href="/pipeline" className="text-xs text-[#c466ff] hover:underline flex items-center gap-1">
              <span>LIVE RUNNER</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {runs.length === 0 ? (
            <div className="text-xs text-zinc-400 py-6 text-center">
              No executions logged yet. Click &quot;Live Runner&quot; to trigger a run.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2e1045] text-zinc-400 text-[10px] uppercase">
                    <th className="pb-2">Run ID</th>
                    <th className="pb-2">Lead / Target</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Attempts</th>
                    <th className="pb-2">Idempotency Key</th>
                    <th className="pb-2 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a0033]">
                  {runs.slice(0, 8).map((r) => (
                    <tr key={r.id} className="hover:bg-[#120024]">
                      <td className="py-2.5 font-bold text-[#c466ff]">{r.id}</td>
                      <td className="py-2.5 text-white">
                        {r.sourceLead?.name || "Sarah Chen"} ({r.sourceLead?.companyDomain || "stripe.com"})
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 uppercase font-bold ${
                            r.status === "succeeded" || r.status === "success"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-500"
                              : r.status === "repairing" || r.status === "self_healing"
                              ? "bg-[#2a004f] text-[#c466ff] border border-[#a600ff]"
                              : r.status === "blocked"
                              ? "bg-zinc-800 text-zinc-300 border border-zinc-600"
                              : "bg-red-950 text-red-400 border border-red-500"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-zinc-400">{r.attempts || 1}/{r.maxAttempts || 2}</td>
                      <td className="py-2.5 text-zinc-400 text-[10px] truncate max-w-[150px]">
                        {r.idempotencyKey || "-"}
                      </td>
                      <td className="py-2.5 text-right">
                        <Link
                          href={`/runs/${r.id}`}
                          className="px-2.5 py-1 bg-[#140026] hover:bg-[#a600ff] hover:text-black text-[#c466ff] border border-[#7a07c5] text-[10px] font-bold uppercase transition-all"
                        >
                          DETAILS
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Cached Companies (Table 1) */}
        <div className="bg-[#0d0d0d] border border-[#7a07c5] p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e1045] mb-4">
            <h2 className="text-sm font-bold uppercase text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#a600ff]" /> CACHED CRUSTDATA COMPANY PROFILES ({companies.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {companies.map((c) => (
              <div key={c.id || c.domain} className="p-3 bg-[#050505] border border-[#2e1045] text-xs">
                <div className="font-bold text-white mb-1">{c.name}</div>
                <div className="text-[10px] text-[#c466ff] mb-1">{c.domain}</div>
                <div className="text-[11px] text-zinc-400">{c.industry}</div>
                <div className="text-[10px] text-zinc-500 mt-1">Headcount: {c.employeeCount}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0d0d0d] border-2 border-[#a600ff] max-w-md w-full p-6 shadow-[8px_8px_0px_#7a07c5] text-white">
            <h3 className="text-base font-bold uppercase mb-2">CREATE NEW INTEGRATION WORKFLOW</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Stored separately from execution runs to enable repeated testing & regression comparison.
            </p>

            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-zinc-300 mb-1">Workflow Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inbound CRM Lead to Linear Issue"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  className="w-full bg-[#050505] border border-[#2e1045] px-3 py-2 text-xs text-white focus:border-[#a600ff] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe data transformation and target destination..."
                  value={newWorkflowDesc}
                  onChange={(e) => setNewWorkflowDesc(e.target.value)}
                  className="w-full bg-[#050505] border border-[#2e1045] px-3 py-2 text-xs text-white focus:border-[#a600ff] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-[#a600ff] hover:bg-[#c466ff] text-black font-bold text-xs uppercase border border-white cursor-pointer"
                >
                  {creating ? "CREATING..." : "SAVE WORKFLOW"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="border-t border-[#7a07c5] bg-[#070707] py-6 px-4 text-center text-xs text-zinc-400">
        OPLINK MONGODB WORKSPACE // ENTERPRISE HUB
      </footer>
    </div>
  );
}
