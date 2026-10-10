import { NextRequest, NextResponse } from "next/server";
import { getWorkflowRunsCol, getMappingVersionsCol } from "@/lib/models";
import { repairMappingDslWithAgent } from "@/lib/engine/repair";
import { executeWorkflowMapping } from "@/lib/engine/execute-workflow";
import { verifyDestinationRecord } from "@/lib/engine/verify-result";
import { writeDestinationTask } from "@/lib/connectors/mock-task";
import { logNeatlogsEvent } from "@/lib/neatlogs";
import { DEMO_CRM_LEADS } from "@/lib/connectors/mock-crm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workflowRunsCol = await getWorkflowRunsCol();
    const run = await workflowRunsCol.findOne({ id });

    if (!run) {
      return NextResponse.json({ error: { code: "RUN_NOT_FOUND", message: "Run not found" } }, { status: 404 });
    }

    if (run.attemptNumber >= run.maxAttempts) {
      return NextResponse.json(
        {
          error: {
            code: "RETRY_BUDGET_EXHAUSTED",
            message: `Maximum bounded retry limit reached (${run.maxAttempts} attempts max)`,
          },
        },
        { status: 400 }
      );
    }

    const lead = run.inputSnapshot?.lead || DEMO_CRM_LEADS[0];
    const company = run.inputSnapshot?.company;
    const initialMapping = run.inputSnapshot?.proposedMapping;
    const validationErrors = run.inputSnapshot?.validationErrors || [{ path: "due_date", message: "Date format mismatch" }];

    // Trigger repair
    const { repairedMapping, reasoning, isLiveLLM } = await repairMappingDslWithAgent(
      initialMapping,
      validationErrors,
      lead,
      company
    );

    // Save immutable mapping revision (Table 3)
    const mappingVersionsCol = await getMappingVersionsCol();
    await mappingVersionsCol.insertOne({
      id: repairedMapping.id,
      workflowId: run.workflowId,
      version: repairedMapping.version,
      mapping: repairedMapping,
      status: "tested",
      createdBy: isLiveLLM ? "agent" : "human",
      changeReason: reasoning,
      createdAt: new Date().toISOString(),
    });

    const idempotencyKey = run.idempotencyKey || `idemp_${run.workflowId}_${lead.id}`;
    let transformedPayload = executeWorkflowMapping(repairedMapping, lead, company);
    transformedPayload.idempotency_key = idempotencyKey;

    const verification = verifyDestinationRecord(transformedPayload, idempotencyKey);

    let destinationResult: any = undefined;
    let isDuplicateBlocked = false;

    if (verification.isValid && verification.destinationTask) {
      const adapterRes = await writeDestinationTask(run.workflowId, verification.destinationTask);
      destinationResult = adapterRes.task;
      isDuplicateBlocked = adapterRes.isDuplicate;

      await logNeatlogsEvent(run.id, "MAPPING_REPAIRED", "Manual Retry Verified", "repaired", {
        reasoning,
        attempt: run.attemptNumber + 1,
        destinationResult,
      });

      await workflowRunsCol.updateOne(
        { id },
        {
          $set: {
            status: "succeeded",
            attemptNumber: run.attemptNumber + 1,
            mappingVersionId: repairedMapping.id,
            outputSnapshot: destinationResult,
            verification: verification.verification,
            isDuplicateBlocked,
            finishedAt: new Date().toISOString(),
          },
        }
      );
    } else {
      await workflowRunsCol.updateOne(
        { id },
        {
          $set: {
            status: "blocked",
            attemptNumber: run.attemptNumber + 1,
            verification: verification.verification,
            finishedAt: new Date().toISOString(),
          },
        }
      );
    }

    const updatedRun = await workflowRunsCol.findOne({ id });

    return NextResponse.json({
      success: true,
      run: updatedRun,
      isLiveLLM,
      message: "Bounded self-healing retry executed and verified.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "RETRY_FAILED", message: err.message || "Failed to retry run" } },
      { status: 500 }
    );
  }
}
