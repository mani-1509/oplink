import { NextRequest, NextResponse } from "next/server";
import { getWorkflowRunsCol, getRunStepsCol, getRunArtifactsCol } from "@/lib/models";
import { DEMO_CRM_LEADS } from "@/lib/connectors/mock-crm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workflowRunsCol = await getWorkflowRunsCol();
    const runDoc = await workflowRunsCol.findOne({ id });

    if (!runDoc) {
      return NextResponse.json(
        { error: { code: "RUN_NOT_FOUND", message: `Run with ID '${id}' was not found.` } },
        { status: 404 }
      );
    }

    const runStepsCol = await getRunStepsCol();
    const runArtifactsCol = await getRunArtifactsCol();

    const [stepsDocs, artifactDocs] = await Promise.all([
      runStepsCol.find({ runId: id }).sort({ stepNumber: 1 }).toArray(),
      runArtifactsCol.find({ runId: id }).toArray(),
    ]);

    const formattedRun = {
      id: runDoc.id,
      workflowId: runDoc.workflowId,
      createdAt: runDoc.createdAt,
      status: runDoc.status,
      sourceLead: runDoc.inputSnapshot?.lead || DEMO_CRM_LEADS[0],
      enrichedCompany: runDoc.inputSnapshot?.company,
      proposedMapping: runDoc.inputSnapshot?.proposedMapping,
      repairedMapping: runDoc.inputSnapshot?.repairedMapping,
      validationErrors: runDoc.inputSnapshot?.validationErrors,
      destinationResult: runDoc.outputSnapshot,
      idempotencyKey: runDoc.idempotencyKey || `key_${runDoc.id}`,
      isDuplicateBlocked: runDoc.isDuplicateBlocked,
      attempts: runDoc.attemptNumber || 1,
      maxAttempts: runDoc.maxAttempts || 2,
      steps: stepsDocs.map((s) => ({
        id: s.id,
        timestamp: s.createdAt,
        type: s.stepType,
        status: s.status,
        title: s.title || s.toolName || "Step",
        detail: s.detail || "",
        payload: s.inputData || s.outputData,
        error: s.errorMessage,
        durationMs: s.durationMs,
      })),
      artifacts: artifactDocs,
      verification: runDoc.verification,
      neatlogsTraceId: runDoc.neatlogsTraceId,
      neatlogsTraceUrl: `https://neatlogs.com/traces/${runDoc.id}`,
      entireCheckpointId: runDoc.entireCheckpointId || "chk_oplink_v1_live_mvp",
      cfoAiSavedHours: 0.3,
      cfoAiEstimatedSavingsUsd: 22.5,
    };

    return NextResponse.json({ success: true, run: formattedRun });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "RUN_FETCH_ERROR", message: err.message || "Failed to fetch run" } },
      { status: 500 }
    );
  }
}
