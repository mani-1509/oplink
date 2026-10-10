import { DestinationTask, DestinationTaskSchema } from "../schemas";
import { checkIdempotency, recordIdempotencySuccess } from "../engine/idempotency";

export interface TaskAdapterResponse {
  success: boolean;
  isDuplicate: boolean;
  taskId: string;
  task?: DestinationTask;
  error?: string;
}

/**
 * Destination Sales Task API Adapter with strict idempotency verification
 */
export async function writeDestinationTask(
  workflowId: string,
  payload: DestinationTask
): Promise<TaskAdapterResponse> {
  // Validate schema before attempting write
  const validation = DestinationTaskSchema.safeParse(payload);
  if (!validation.success) {
    return {
      success: false,
      isDuplicate: false,
      taskId: "",
      error: `Destination task validation failed: ${validation.error.issues.map((i) => i.message).join("; ")}`,
    };
  }

  const idempotencyKey = payload.idempotency_key;

  // Check persisted idempotency records
  const { isDuplicate, existingRecord } = await checkIdempotency(idempotencyKey);
  if (isDuplicate && existingRecord) {
    return {
      success: true,
      isDuplicate: true,
      taskId: existingRecord.destinationRecordId || `task_${idempotencyKey}`,
      task: existingRecord.resultPayload as DestinationTask,
    };
  }

  const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Record successful idempotent write
  await recordIdempotencySuccess(
    idempotencyKey,
    workflowId,
    payload.lead_email,
    "create_destination_task",
    taskId,
    payload
  );

  return {
    success: true,
    isDuplicate: false,
    taskId,
    task: payload,
  };
}
