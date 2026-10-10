import { NextRequest, NextResponse } from "next/server";
import { orchestrateIntegrationRun } from "@/lib/engine/orchestrator";
import { getWorkflowRunsCol } from "@/lib/models";
import { getLeadById, DEMO_CRM_LEADS } from "@/lib/connectors/mock-crm";
import { getCurrentUser } from "@/lib/auth";
import { initAndSeedDatabase } from "@/lib/seed";

export async function GET() {
  try {
    await initAndSeedDatabase();
    const workflowRunsCol = await getWorkflowRunsCol();
    const dbRuns = await workflowRunsCol.find({}).sort({ createdAt: -1 }).limit(50).toArray();

    const formattedRuns = dbRuns.map((r) => ({
      id: r.id,
      workflowId: r.workflowId,
      createdAt: r.createdAt,
      status: r.status,
      sourceLead: r.inputSnapshot?.lead || DEMO_CRM_LEADS[0],
      enrichedCompany: r.inputSnapshot?.company,
      proposedMapping: r.inputSnapshot?.proposedMapping,
      repairedMapping: r.inputSnapshot?.repairedMapping,
      validationErrors: r.inputSnapshot?.validationErrors,
      destinationResult: r.outputSnapshot,
      idempotencyKey: r.idempotencyKey || `key_${r.id}`,
      isDuplicateBlocked: r.isDuplicateBlocked,
      attempts: r.attemptNumber || 1,
      maxAttempts: r.maxAttempts || 2,
      steps: r.inputSnapshot?.steps || [],
      verification: r.verification,
      neatlogsTraceId: r.neatlogsTraceId,
      entireCheckpointId: r.entireCheckpointId,
      cfoAiSavedHours: 0.3,
      cfoAiEstimatedSavingsUsd: 22.5,
    }));

    return NextResponse.json({ success: true, runs: formattedRuns });
  } catch (err: any) {
    console.error("Fetch runs error:", err);
    return NextResponse.json(
      { error: { code: "RUN_FETCH_ERROR", message: err.message || "Failed to fetch runs" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await initAndSeedDatabase();
    const user = await getCurrentUser();

    const body = await req.json();
    const { leadId, customLead, deliberateFailure = true, autoSelfHeal = true, workflowId = "wf_crm_lead_to_task" } = body;

    const lead = customLead || (leadId ? getLeadById(leadId) : undefined) || DEMO_CRM_LEADS[0];

    const run = await orchestrateIntegrationRun({
      workflowId,
      lead,
      deliberateFailure,
      autoSelfHeal,
      maxAttempts: 2,
      ownerId: user?.id,
    });

    return NextResponse.json({
      success: true,
      run,
    });
  } catch (err: any) {
    console.error("Run orchestration error:", err);
    return NextResponse.json(
      {
        error: {
          code: "ORCHESTRATION_FAILED",
          message: err.message || "Integration execution failed",
          retryable: true,
        },
      },
      { status: 500 }
    );
  }
}
