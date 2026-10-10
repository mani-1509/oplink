"use client";

import { useState } from "react";
import { Plus, ArrowRight, Save, ShieldAlert, Cpu } from "lucide-react";

interface WorkflowBuilderProps {
  workflow: any;
  mappings: any[];
  connectors: any[];
  onSaveMapping: (mapping: any, changeReason: string) => Promise<void>;
  onTriggerRun: (leadId: string, deliberateFailure: boolean) => Promise<void>;
  isExecuting: boolean;
}

export default function WorkflowBuilder({
  workflow,
  mappings,
  connectors,
  onSaveMapping,
  onTriggerRun,
  isExecuting,
}: WorkflowBuilderProps) {
  const currentMapping = mappings[0] || { version: 1, mapping: { fields: [] } };
  const [fields, setFields] = useState<any[]>(
    currentMapping.mapping?.fields || [
      { source: "lead.name", destination: "lead_name", transform: "direct", required: true },
      { source: "lead.email", destination: "lead_email", transform: "direct", required: true },
      { source: "company.name", destination: "company_name", transform: "direct", required: true },
      { source: "company.domain", destination: "company_domain", transform: "direct", required: true },
      { source: "company.industry", destination: "industry", transform: "direct", required: true },
      { source: "company.headcount", destination: "headcount_range", transform: "template", required: true },
      { source: "created_at", destination: "due_date", transform: "date_format", required: true },
      { source: "id", destination: "idempotency_key", transform: "template", required: true },
    ]
  );
  const [changeReason, setChangeReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState("lead_9821");
  const [deliberateFailure, setDeliberateFailure] = useState(true);

  const handleAddField = () => {
    setFields([
      ...fields,
      { source: "lead.custom", destination: "custom_field", transform: "direct", required: false },
    ]);
  };

  const handleUpdateField = (index: number, key: string, value: any) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const handleDeleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveMapping({ fields }, changeReason || `Manual field revision v${mappings.length + 1}`);
      setChangeReason("");
    } finally {
      setSaving(false);
    }
  };

  const sourceConn = connectors.find((c) => c.role === "source");
  const destConn = connectors.find((c) => c.role === "destination");

  return (
    <div className="space-y-8 font-mono">
      {/* Connector Header Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Adapter Card */}
        <div className="bg-[#0d0d0d] border-2 border-[#7a07c5] p-5 shadow-[4px_4px_0px_#2e1045]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2e1045]">
            <span className="text-xs font-bold uppercase text-[#c466ff] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#a600ff]" /> SOURCE ADAPTER
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 border border-emerald-500">
              {sourceConn?.status?.toUpperCase() || "ACTIVE"}
            </span>
          </div>
          <div className="text-sm font-bold text-white mb-1">
            {sourceConn?.displayName || "Inbound CRM Leads Adapter"}
          </div>
          <p className="text-xs text-zinc-400 mb-3">
            Connector Type: <code className="text-[#c466ff]">{sourceConn?.connectorType || "mock_crm"}</code>
          </p>
          <div className="p-2.5 bg-[#050505] border border-[#2e1045] text-[11px] text-zinc-400">
            Schema: Inbound Lead Object (id, name, email, companyDomain, status)
          </div>
        </div>

        {/* Destination Adapter Card */}
        <div className="bg-[#0d0d0d] border-2 border-[#a600ff] p-5 shadow-[4px_4px_0px_#7a07c5]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2e1045]">
            <span className="text-xs font-bold uppercase text-[#c466ff] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#c466ff]" /> DESTINATION ADAPTER
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 border border-emerald-500">
              {destConn?.status?.toUpperCase() || "ACTIVE"}
            </span>
          </div>
          <div className="text-sm font-bold text-white mb-1">
            {destConn?.displayName || "Destination Sales Task API"}
          </div>
          <p className="text-xs text-zinc-400 mb-3">
            Connector Type: <code className="text-[#c466ff]">{destConn?.connectorType || "mock_task"}</code>
          </p>
          <div className="p-2.5 bg-[#050505] border border-[#2e1045] text-[11px] text-zinc-400">
            Guards: Idempotency Key deduplication & Zod ISO-8601 validation
          </div>
        </div>
      </div>

      {/* Field Mapping Editor Table */}
      <div className="bg-[#0d0d0d] border-2 border-[#a600ff] p-6 shadow-[6px_6px_0px_#7a07c5]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2e1045] mb-6">
          <div>
            <h3 className="text-sm sm:text-base font-bold uppercase text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#a600ff]" /> FIELD MAPPING SPECIFICATION (VERSION {currentMapping.version || 1})
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Defines transformation AST rules from Source Lead + Crustdata to Destination Task
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddField}
              className="px-3 py-1.5 bg-[#140026] hover:bg-[#a600ff] hover:text-black text-[#c466ff] border border-[#7a07c5] text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> ADD FIELD
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 bg-[#a600ff] hover:bg-[#c466ff] text-black border border-white text-xs font-bold uppercase flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#7a07c5] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> {saving ? "SAVING..." : "SAVE VERSION"}
            </button>
          </div>
        </div>

        {/* Change Reason Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Revision change note (e.g. Added custom lookup or normalized date format)..."
            value={changeReason}
            onChange={(e) => setChangeReason(e.target.value)}
            className="w-full bg-[#050505] border border-[#2e1045] focus:border-[#a600ff] px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        {/* Fields Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2e1045] text-zinc-400 text-[10px] uppercase">
                <th className="pb-2">Source Field</th>
                <th className="pb-2">Destination Field</th>
                <th className="pb-2">Transformation</th>
                <th className="pb-2 text-center">Required</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a0033]">
              {fields.map((f, i) => (
                <tr key={i} className="hover:bg-[#120024]">
                  <td className="py-2.5 pr-2">
                    <input
                      type="text"
                      value={f.source}
                      onChange={(e) => handleUpdateField(i, "source", e.target.value)}
                      className="w-full bg-[#070707] border border-[#2e1045] px-2 py-1 text-xs text-white focus:border-[#a600ff] focus:outline-none"
                    />
                  </td>
                  <td className="py-2.5 pr-2">
                    <input
                      type="text"
                      value={f.destination}
                      onChange={(e) => handleUpdateField(i, "destination", e.target.value)}
                      className="w-full bg-[#070707] border border-[#2e1045] px-2 py-1 text-xs text-[#c466ff] focus:border-[#a600ff] focus:outline-none"
                    />
                  </td>
                  <td className="py-2.5 pr-2">
                    <select
                      value={f.transform}
                      onChange={(e) => handleUpdateField(i, "transform", e.target.value)}
                      className="w-full bg-[#070707] border border-[#2e1045] px-2 py-1 text-xs text-zinc-300 focus:border-[#a600ff] focus:outline-none"
                    >
                      <option value="direct">direct</option>
                      <option value="trim">trim</option>
                      <option value="lowercase">lowercase</option>
                      <option value="uppercase">uppercase</option>
                      <option value="date_iso">date_iso</option>
                      <option value="lookup">lookup</option>
                      <option value="template">template</option>
                    </select>
                  </td>
                  <td className="py-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={f.required}
                      onChange={(e) => handleUpdateField(i, "required", e.target.checked)}
                      className="accent-[#a600ff]"
                    />
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => handleDeleteField(i)}
                      className="text-red-400 hover:text-red-300 text-[10px] px-2 py-0.5 border border-red-500/40"
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Execution Launcher Console */}
      <div className="bg-[#120024] border-2 border-[#a600ff] p-6 shadow-[6px_6px_0px_#7a07c5]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#7a07c5] mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase text-white">
              RUN WORKFLOW EXECUTION ORCHESTRATOR
            </h3>
            <p className="text-xs text-zinc-300 mt-0.5">
              Runs CRM extraction, Crustdata enrichment, Nebius mapping, and self-healing verification
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={deliberateFailure}
                onChange={(e) => setDeliberateFailure(e.target.checked)}
                className="accent-[#a600ff]"
              />
              <span className="flex items-center gap-1 text-[#c466ff]">
                <ShieldAlert className="w-3.5 h-3.5" /> Inject Schema Bug (Tests Self-Healing)
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1">
            <label className="block text-[10px] text-zinc-400 uppercase mb-1">Select Lead:</label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full bg-[#050505] border border-[#7a07c5] text-white px-3 py-2 text-xs focus:outline-none"
            >
              <option value="lead_9821">Sarah Chen (stripe.example) - Qualified</option>
              <option value="lead_4419">Alex Rivera (linear.example) - Qualified</option>
              <option value="lead_3310">Marcus Vance (supabase.example) - Lead</option>
              <option value="lead_7712">Elena Rostova (acme.example) - Qualified</option>
            </select>
          </div>

          <button
            onClick={() => onTriggerRun(selectedLeadId, deliberateFailure)}
            disabled={isExecuting}
            className="sm:self-end px-6 py-2.5 bg-[#a600ff] hover:bg-[#c466ff] text-black font-bold uppercase text-xs tracking-wider border-2 border-white shadow-[3px_3px_0px_#7a07c5] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExecuting ? (
              <span>ORCHESTRATING...</span>
            ) : (
              <>
                <span>EXECUTE RUN NOW</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
