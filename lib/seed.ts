import {
  getCompaniesCol,
  getWorkflowsCol,
  getMappingVersionsCol,
  getConnectorConfigsCol,
  getFinancialEstimatesCol,
  getUsersCol,
  getIdempotencyRecordsCol,
} from "./models";
import { hashPassword } from "./auth";

let isDbInitialized = false;

export async function initAndSeedDatabase() {
  if (isDbInitialized) return { success: true, message: "Database already initialized in memory." };

  const usersCol = await getUsersCol();
  const companiesCol = await getCompaniesCol();
  const workflowsCol = await getWorkflowsCol();
  const mappingVersionsCol = await getMappingVersionsCol();
  const connectorConfigsCol = await getConnectorConfigsCol();
  const financialEstimatesCol = await getFinancialEstimatesCol();
  const idempotencyCol = await getIdempotencyRecordsCol();

  // Create Operational Indexes Safely
  try {
    await usersCol.createIndex({ email: 1 }, { unique: true });
    await companiesCol.createIndex({ domain: 1 }, { unique: true });
    await workflowsCol.createIndex({ status: 1, updatedAt: -1 });
    await mappingVersionsCol.createIndex({ workflowId: 1, version: 1 }, { unique: true });
    await idempotencyCol.createIndex({ key: 1 }, { unique: true });
  } catch (err) {
    console.warn("Index setup notice:", err);
  }

  // Idempotent Upsert for Demo Admin Account
  const defaultPasswordHash = await hashPassword("oplink2026");
  await usersCol.updateOne(
    { email: "admin@oplink.ai" },
    {
      $set: {
        id: "usr_admin_default",
        email: "admin@oplink.ai",
        passwordHash: defaultPasswordHash,
        name: "Oplink Admin",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    },
    { upsert: true }
  );

  // Idempotent Upsert for Synthetic Companies (with .example domains)
  const syntheticCompanies = [
    {
      id: "comp_stripe_demo",
      name: "Stripe Demo Infrastructure",
      domain: "stripe.example",
      industry: "Financial Services / Fintech Infrastructure",
      employeeCount: 7000,
      revenueRange: "$1B - $10B",
      source: "fixture" as const,
      externalId: "ext_stripe_fixture",
      rawData: { location: "South San Francisco, CA", description: "Synthetic demo fixture for hackathon." },
      isDemo: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "comp_linear_demo",
      name: "Linear Demo Tools",
      domain: "linear.example",
      industry: "Software Development Tools",
      employeeCount: 100,
      revenueRange: "$10M - $50M",
      source: "fixture" as const,
      externalId: "ext_linear_fixture",
      rawData: { location: "San Francisco, CA", description: "Synthetic demo fixture for hackathon." },
      isDemo: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "comp_supabase_demo",
      name: "Supabase Demo Database",
      domain: "supabase.example",
      industry: "Developer Infrastructure & Database",
      employeeCount: 200,
      revenueRange: "$20M - $80M",
      source: "fixture" as const,
      externalId: "ext_supabase_fixture",
      rawData: { location: "Global / Remote", description: "Synthetic demo fixture for hackathon." },
      isDemo: true,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const comp of syntheticCompanies) {
    await companiesCol.updateOne(
      { domain: comp.domain },
      { $set: comp },
      { upsert: true }
    );
  }

  // Idempotent Upsert for Default Workflow (Table 2)
  const defaultWorkflowId = "wf_crm_lead_to_task";
  await workflowsCol.updateOne(
    { id: defaultWorkflowId },
    {
      $set: {
        id: defaultWorkflowId,
        name: "CRM Lead to Sales Task Integration",
        description: "Extracts inbound qualified leads from CRM, enriches firmographics via Crustdata, proposes structured DSL field mapping, and publishes tasks to destination API with idempotency checks.",
        companyId: "comp_stripe_demo",
        sourceType: "mock_crm",
        destinationType: "mock_task",
        status: "active",
        currentMappingVersion: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    { upsert: true }
  );

  // Idempotent Upsert for Initial Mapping Version (Table 3)
  await mappingVersionsCol.updateOne(
    { workflowId: defaultWorkflowId, version: 1 },
    {
      $set: {
        id: "mv_crm_to_task_v1",
        workflowId: defaultWorkflowId,
        version: 1,
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
        status: "approved",
        createdBy: "agent",
        changeReason: "Initial baseline mapping DSL spec.",
        createdAt: new Date().toISOString(),
      },
    },
    { upsert: true }
  );

  // Idempotent Upsert for Connector Configs (Table 8)
  const connectors = [
    {
      id: "conn_src_crm",
      workflowId: defaultWorkflowId,
      role: "source" as const,
      connectorType: "mock_crm" as const,
      displayName: "Inbound CRM Leads Adapter",
      config: { pollIntervalMs: 5000, schemaVersion: "v1.2" },
      status: "active" as const,
      createdAt: new Date().toISOString(),
    },
    {
      id: "conn_dest_task",
      workflowId: defaultWorkflowId,
      role: "destination" as const,
      connectorType: "mock_task" as const,
      displayName: "Destination Sales Task API",
      config: { deduplication: true, enforceZod: true },
      status: "active" as const,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const conn of connectors) {
    await connectorConfigsCol.updateOne(
      { id: conn.id },
      { $set: conn },
      { upsert: true }
    );
  }

  // Idempotent Upsert for Financial Estimate (Table 7)
  await financialEstimatesCol.updateOne(
    { workflowId: defaultWorkflowId },
    {
      $set: {
        id: "fe_default_model",
        workflowId: defaultWorkflowId,
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
    },
    { upsert: true }
  );

  isDbInitialized = true;
  return { success: true, message: "Database verified and idempotently seeded with synthetic fixtures." };
}
