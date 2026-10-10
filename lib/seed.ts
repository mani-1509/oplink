import {
  getCompaniesCol,
  getWorkflowsCol,
  getMappingVersionsCol,
  getConnectorConfigsCol,
  getFinancialEstimatesCol,
  getUsersCol,
  getIdempotencyRecordsCol,
  getWorkflowRunsCol,
  getRunStepsCol,
} from "./models";
import { hashPassword } from "./auth";

let isDbInitialized = false;

export async function initAndSeedDatabase(forceReset: boolean = false) {
  if (isDbInitialized && !forceReset) {
    return { success: true, message: "Database already initialized in memory." };
  }

  const usersCol = await getUsersCol();
  const companiesCol = await getCompaniesCol();
  const workflowsCol = await getWorkflowsCol();
  const mappingVersionsCol = await getMappingVersionsCol();
  const connectorConfigsCol = await getConnectorConfigsCol();
  const financialEstimatesCol = await getFinancialEstimatesCol();
  const idempotencyCol = await getIdempotencyRecordsCol();
  const workflowRunsCol = await getWorkflowRunsCol();
  const runStepsCol = await getRunStepsCol();

  // Create Operational Indexes Safely (handling any prior index conflicts)
  async function safeIndex(col: any, key: any, options: any = {}) {
    try {
      await col.createIndex(key, options);
    } catch (err: any) {
      if (err.code === 86 || err.codeName === "IndexKeySpecsConflict") {
        try {
          // Drop conflicting non-unique index and re-create
          const indexName = Object.keys(key).map((k) => `${k}_${key[k]}`).join("_");
          await col.dropIndex(indexName);
          await col.createIndex(key, options);
        } catch {
          // Fallback silently if drop not permitted
        }
      }
    }
  }

  await safeIndex(usersCol, { email: 1 }, { unique: true });
  await safeIndex(companiesCol, { domain: 1 }, { unique: true });
  await safeIndex(workflowsCol, { status: 1, updatedAt: -1 });
  await safeIndex(mappingVersionsCol, { workflowId: 1, version: 1 }, { unique: true });
  await safeIndex(idempotencyCol, { key: 1 }, { unique: true });
  await safeIndex(workflowRunsCol, { workflowId: 1, createdAt: -1 });
  await safeIndex(runStepsCol, { runId: 1, stepNumber: 1 });

  // 1. Seed Production & Demo Accounts
  const adminHash = await hashPassword("oplink2026");
  const users = [
    {
      id: "usr_admin_default",
      email: "admin@oplink.ai",
      passwordHash: adminHash,
      name: "Oplink Admin",
      role: "admin" as const,
      createdAt: new Date().toISOString(),
    },
    {
      id: "usr_sarah_chen",
      email: "sarah.chen@enterprise.example",
      passwordHash: adminHash,
      name: "Sarah Chen",
      role: "user" as const,
      createdAt: new Date().toISOString(),
    },
    {
      id: "usr_alex_rivera",
      email: "alex.rivera@linear.example",
      passwordHash: adminHash,
      name: "Alex Rivera",
      role: "user" as const,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const user of users) {
    await usersCol.updateOne({ email: user.email }, { $set: user }, { upsert: true });
  }

  // 2. Seed Realistic Enterprise Companies
  const companies = [
    {
      id: "comp_stripe_demo",
      name: "Stripe Demo Infrastructure",
      domain: "stripe.example",
      industry: "Financial Services / Fintech Infrastructure",
      employeeCount: "7,000+",
      revenueRange: "$1B - $10B",
      source: "fixture" as const,
      externalId: "ext_stripe_fixture",
      rawData: { location: "South San Francisco, CA", description: "Global financial infrastructure and developer payment APIs." },
      isDemo: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "comp_linear_demo",
      name: "Linear Demo Tools",
      domain: "linear.example",
      industry: "Software Engineering & Issue Tracking",
      employeeCount: "120",
      revenueRange: "$10M - $50M",
      source: "fixture" as const,
      externalId: "ext_linear_fixture",
      rawData: { location: "San Francisco, CA", description: "Streamlined project management and issue tracking tool for high-velocity teams." },
      isDemo: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "comp_supabase_demo",
      name: "Supabase Demo Database",
      domain: "supabase.example",
      industry: "Developer Infrastructure & PostgreSQL",
      employeeCount: "250",
      revenueRange: "$20M - $80M",
      source: "fixture" as const,
      externalId: "ext_supabase_fixture",
      rawData: { location: "Global / Remote", description: "Open source developer data platform, authentication, and database cluster." },
      isDemo: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "comp_vercel_demo",
      name: "Vercel Edge Cloud",
      domain: "vercel.example",
      industry: "Cloud Infrastructure & Frontend Platforms",
      employeeCount: "600",
      revenueRange: "$50M - $150M",
      source: "fixture" as const,
      externalId: "ext_vercel_fixture",
      rawData: { location: "San Francisco, CA", description: "Frontend cloud and serverless edge deployment platform for modern web apps." },
      isDemo: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "comp_retool_demo",
      name: "Retool Enterprise Apps",
      domain: "retool.example",
      industry: "Internal Developer Platforms & Low-Code",
      employeeCount: "350",
      revenueRange: "$40M - $100M",
      source: "fixture" as const,
      externalId: "ext_retool_fixture",
      rawData: { location: "San Francisco, CA", description: "Custom internal tooling and business operations software builder." },
      isDemo: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "comp_cursor_demo",
      name: "Anysphere Cursor AI",
      domain: "cursor.example",
      industry: "AI Developer Tooling & IDEs",
      employeeCount: "85",
      revenueRange: "$15M - $60M",
      source: "fixture" as const,
      externalId: "ext_cursor_fixture",
      rawData: { location: "San Francisco, CA", description: "AI-native code editor designed for pair programming with foundational LLMs." },
      isDemo: true,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const comp of companies) {
    await companiesCol.updateOne({ domain: comp.domain }, { $set: comp }, { upsert: true });
  }

  // 3. Seed 4 Production Integration Workflows
  const workflows = [
    {
      id: "wf_crm_lead_to_task",
      name: "Inbound CRM Lead to Task Sync",
      description: "Extracts inbound qualified leads from CRM, enriches firmographics via Crustdata, proposes structured DSL field mapping, and publishes tasks to destination API with idempotency checks.",
      companyId: "comp_stripe_demo",
      sourceType: "mock_crm",
      destinationType: "mock_task",
      status: "active" as const,
      currentMappingVersion: 2,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "wf_stripe_charge_to_hubspot",
      name: "Stripe Enterprise Deal to HubSpot Account Enrichment",
      description: "Captures high-value Stripe subscription events ($10k+), queries Crustdata for executive headcount and industry tags, and updates HubSpot deals.",
      companyId: "comp_vercel_demo",
      sourceType: "mock_crm",
      destinationType: "mock_task",
      status: "active" as const,
      currentMappingVersion: 1,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "wf_github_pr_to_jira",
      name: "GitHub Release to Jira Engineering Ticket",
      description: "Listens for merged pull requests with release tags, parses changelogs, maps issues to Jira Epics, and alerts engineering leads.",
      companyId: "comp_linear_demo",
      sourceType: "mock_crm",
      destinationType: "mock_task",
      status: "active" as const,
      currentMappingVersion: 1,
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "wf_zendesk_to_slack",
      name: "VIP Zendesk Escalation to Slack Incident Hub",
      description: "Detects enterprise severity-1 customer tickets, validates SLA bounds, enriches account contract tier, and creates dedicated incident channels.",
      companyId: "comp_supabase_demo",
      sourceType: "mock_crm",
      destinationType: "mock_task",
      status: "active" as const,
      currentMappingVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  for (const wf of workflows) {
    await workflowsCol.updateOne({ id: wf.id }, { $set: wf }, { upsert: true });
  }

  // 4. Seed Immutable Mapping Versions
  const mappings = [
    {
      id: "mv_crm_to_task_v1",
      workflowId: "wf_crm_lead_to_task",
      version: 1,
      mapping: {
        rules: [
          { source: "name", destination: "lead_name", transform: "direct", required: true },
          { source: "email", destination: "lead_email", transform: "lowercase", required: true },
          { source: "company.name", destination: "company_name", transform: "direct", required: true },
          { source: "created_at", destination: "due_date", transform: "direct", required: true },
        ],
      },
      status: "tested" as const,
      createdBy: "human" as const,
      changeReason: "Initial baseline field mapping spec (un-normalized date format).",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "mv_crm_to_task_v2",
      workflowId: "wf_crm_lead_to_task",
      version: 2,
      mapping: {
        rules: [
          { source: "name", destination: "lead_name", transform: "direct", required: true },
          { source: "email", destination: "lead_email", transform: "lowercase", required: true },
          { source: "company.name", destination: "company_name", transform: "direct", required: true },
          { source: "company.domain", destination: "company_domain", transform: "lowercase", required: true },
          { source: "company.industry", destination: "industry", transform: "direct", required: true },
          { source: "company.headcount", destination: "headcount_range", transform: "template", templateString: "{headcount} employees", required: true },
          { source: "created_at", destination: "due_date", transform: "date_iso", defaultValue: "2026-10-24", required: true },
          { source: "id", destination: "idempotency_key", transform: "template", templateString: "idemp_{id}_{company_domain}", required: true },
        ],
      },
      status: "approved" as const,
      createdBy: "agent" as const,
      changeReason: "Self-healing patch: applied date_iso transformation to normalize localized dates to strict YYYY-MM-DD format.",
      createdAt: new Date().toISOString(),
    },
  ];

  for (const m of mappings) {
    await mappingVersionsCol.updateOne(
      { workflowId: m.workflowId, version: m.version },
      { $set: m },
      { upsert: true }
    );
  }

  // 5. Seed Connector Configurations
  const connectors = [
    {
      id: "conn_src_crm",
      workflowId: "wf_crm_lead_to_task",
      role: "source" as const,
      connectorType: "mock_crm" as const,
      displayName: "Inbound CRM Leads Adapter",
      config: { pollIntervalMs: 5000, schemaVersion: "v1.2" },
      status: "active" as const,
      createdAt: new Date().toISOString(),
    },
    {
      id: "conn_dest_task",
      workflowId: "wf_crm_lead_to_task",
      role: "destination" as const,
      connectorType: "mock_task" as const,
      displayName: "Destination Sales Task API",
      config: { deduplication: true, enforceZod: true },
      status: "active" as const,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const conn of connectors) {
    await connectorConfigsCol.updateOne({ id: conn.id }, { $set: conn }, { upsert: true });
  }

  // 6. Seed Financial ROI Estimates
  const financialEstimates = [
    {
      id: "fe_default_model",
      workflowId: "wf_crm_lead_to_task",
      currency: "USD",
      monthlyRuns: 600,
      minutesSavedPerRun: 18,
      laborCostPerHour: 75,
      monthlyInfrastructureCost: 240,
      monthlyModelCost: 8.1,
      monthlyRevenue: 29850,
      annualizedMrr: 358200,
      grossMarginPercentage: 91.7,
      totalMonthlySavingsUsd: 13500,
      assumptions: {
        workspaceCount: 150,
        hourlyRate: 75,
        runsPerCustomer: 600,
      },
      cfoaiReference: "https://cfo.ai/neathacks",
      createdAt: new Date().toISOString(),
    },
  ];

  for (const fe of financialEstimates) {
    await financialEstimatesCol.updateOne({ workflowId: fe.workflowId }, { $set: fe }, { upsert: true });
  }

  // 7. Seed Sample Executed Runs & Step Traces for Instant Rich Dashboard
  const sampleRuns = [
    {
      id: "run_seeded_stripe_success",
      workflowId: "wf_crm_lead_to_task",
      ownerId: "usr_admin_default",
      companyId: "comp_stripe_demo",
      mappingVersionId: "mv_crm_to_task_v2",
      status: "succeeded" as const,
      triggerType: "demo" as const,
      attemptNumber: 1,
      maxAttempts: 2,
      inputSnapshot: {
        lead: {
          id: "lead_9821",
          name: "Sarah Chen",
          email: "sarah.chen@stripe.example",
          companyDomain: "stripe.example",
          status: "qualified",
          estimatedValue: 120000,
        },
        company: {
          domain: "stripe.example",
          name: "Stripe Demo Infrastructure",
          industry: "Financial Services / Fintech Infrastructure",
          headcount: "7,000+",
          revenueRange: "$1B - $10B",
          enrichmentSource: "fixture",
          isDemo: true,
        },
        steps: [
          { id: "st_1", title: "Inspect Source CRM Lead", type: "inspect", status: "succeeded", durationMs: 14, detail: "Ingested lead record: Sarah Chen (stripe.example)" },
          { id: "st_2", title: "Crustdata Account Enrichment", type: "enrich", status: "succeeded", durationMs: 38, detail: "Enriched firmographics: 7,000+ headcount, $1B-$10B rev" },
          { id: "st_3", title: "Propose Safe Mapping DSL Spec", type: "map", status: "succeeded", durationMs: 110, detail: "Nebius 120B proposed mapping v2" },
          { id: "st_4", title: "Write Destination Task API", type: "destination_write", status: "succeeded", durationMs: 45, detail: "Task written with idempotency key oplink:wf_crm_lead_to_task:lead_9821" },
        ],
      },
      outputSnapshot: {
        lead_name: "Sarah Chen",
        lead_email: "sarah.chen@stripe.example",
        company_name: "Stripe Demo Infrastructure",
        company_domain: "stripe.example",
        industry: "Financial Services / Fintech Infrastructure",
        headcount_range: "7,000+ employees",
        priority: "HIGH",
        due_date: "2026-10-24",
        idempotency_key: "oplink:wf_crm_lead_to_task:lead_9821:create_destination_task",
        task_title: "[High Priority] Onboard Stripe Demo Infrastructure - Sarah Chen",
      },
      idempotencyKey: "oplink:wf_crm_lead_to_task:lead_9821:create_destination_task",
      neatlogsTraceId: "trace_stripe_success_live",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: "run_seeded_linear_healed",
      workflowId: "wf_crm_lead_to_task",
      ownerId: "usr_admin_default",
      companyId: "comp_linear_demo",
      mappingVersionId: "mv_crm_to_task_v2",
      status: "succeeded" as const,
      triggerType: "demo" as const,
      attemptNumber: 2,
      maxAttempts: 2,
      inputSnapshot: {
        lead: {
          id: "lead_4419",
          name: "Alex Rivera",
          email: "alex@linear.example",
          companyDomain: "linear.example",
          status: "qualified",
          estimatedValue: 45000,
        },
        company: {
          domain: "linear.example",
          name: "Linear Demo Tools",
          industry: "Software Engineering & Issue Tracking",
          headcount: "120",
          revenueRange: "$10M - $50M",
          enrichmentSource: "fixture",
          isDemo: true,
        },
        steps: [
          { id: "st_1", title: "Inspect Source CRM Lead", type: "inspect", status: "succeeded", durationMs: 12, detail: "Ingested lead: Alex Rivera (linear.example)" },
          { id: "st_2", title: "Crustdata Account Enrichment", type: "enrich", status: "succeeded", durationMs: 32, detail: "Enriched Linear Demo Tools profile" },
          { id: "st_3", title: "Initial Validation Rejection", type: "map", status: "failed", durationMs: 25, detail: "Field 'due_date' failed ISO-8601 regex assertion" },
          { id: "st_4", title: "Nebius 120B Self-Healing Repair", type: "repair", status: "repaired", durationMs: 140, detail: "Repaired date transformation to date_iso. Re-evaluated: 100% PASS" },
          { id: "st_5", title: "Destination Task Write", type: "destination_write", status: "succeeded", durationMs: 38, detail: "Created Linear onboarding task successfully" },
        ],
      },
      outputSnapshot: {
        lead_name: "Alex Rivera",
        lead_email: "alex@linear.example",
        company_name: "Linear Demo Tools",
        company_domain: "linear.example",
        industry: "Software Engineering & Issue Tracking",
        headcount_range: "120 employees",
        priority: "HIGH",
        due_date: "2026-10-24",
        idempotency_key: "oplink:wf_crm_lead_to_task:lead_4419:create_destination_task",
        task_title: "[High Priority] Onboard Linear Demo Tools - Alex Rivera",
      },
      idempotencyKey: "oplink:wf_crm_lead_to_task:lead_4419:create_destination_task",
      neatlogsTraceId: "trace_linear_healed_live",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ];

  for (const r of sampleRuns) {
    await workflowRunsCol.updateOne({ id: r.id }, { $set: r }, { upsert: true });
  }

  isDbInitialized = true;
  return { success: true, message: "Database refreshed with rich enterprise workflows, companies, mapping versions, and historical runs." };
}
