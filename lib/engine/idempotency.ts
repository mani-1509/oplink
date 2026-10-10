import { getIdempotencyRecordsCol, IdempotencyRecordDoc } from "../models";

export interface IdempotencyCheckResult {
  isDuplicate: boolean;
  existingRecord?: IdempotencyRecordDoc;
}

/**
 * Generate a stable, deterministic idempotency key
 */
export function generateIdempotencyKey(
  workflowId: string,
  sourceRecordId: string,
  actionType: string = "create_destination_task"
): string {
  const cleanSource = sourceRecordId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `idemp_${workflowId}_${cleanSource}_${actionType}`;
}

/**
 * Check if an operation has already been executed
 */
export async function checkIdempotency(key: string): Promise<IdempotencyCheckResult> {
  try {
    const col = await getIdempotencyRecordsCol();
    const existing = await col.findOne({ key });
    if (existing && existing.status === "completed") {
      return { isDuplicate: true, existingRecord: existing };
    }
    return { isDuplicate: false, existingRecord: existing || undefined };
  } catch (err) {
    console.warn("Idempotency check warning:", err);
    return { isDuplicate: false };
  }
}

/**
 * Record a completed idempotent destination action
 */
export async function recordIdempotencySuccess(
  key: string,
  workflowId: string,
  sourceRecordId: string,
  actionType: string,
  destinationRecordId: string,
  resultPayload: Record<string, any>
): Promise<void> {
  try {
    const col = await getIdempotencyRecordsCol();
    await col.updateOne(
      { key },
      {
        $set: {
          key,
          workflowId,
          sourceRecordId,
          actionType,
          status: "completed",
          destinationRecordId,
          resultPayload,
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );
  } catch (err) {
    console.warn("Idempotency record persist warning:", err);
  }
}
