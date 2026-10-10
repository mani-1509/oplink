export interface NeatlogsEvent {
  id: string;
  projectId: string;
  runId: string;
  timestamp: string;
  eventType: "RUN_STARTED" | "TOOL_CALL" | "VALIDATION_FAILED" | "SELF_HEALING_TRIGGERED" | "MAPPING_REPAIRED" | "VERIFIED_SUCCESS" | "DUPLICATE_PREVENTED";
  stepName: string;
  status: "success" | "error" | "repaired" | "info";
  metadata: Record<string, any>;
  durationMs?: number;
}

const NEATLOGS_API_KEY = process.env.NEATLOGS_API_KEY || "";
const NEATLOGS_PROJECT_ID = process.env.NEATLOGS_PROJECT_ID || "oplink-prod-2026";

// In-memory telemetry buffer for live dashboard inspection
const telemetryStore: NeatlogsEvent[] = [];

/**
 * Dispatch a telemetry event to neatlogs service (or local telemetry buffer)
 */
export async function logNeatlogsEvent(
  runId: string,
  eventType: NeatlogsEvent["eventType"],
  stepName: string,
  status: NeatlogsEvent["status"],
  metadata: Record<string, any> = {},
  durationMs?: number
): Promise<NeatlogsEvent> {
  const event: NeatlogsEvent = {
    id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    projectId: NEATLOGS_PROJECT_ID,
    runId,
    timestamp: new Date().toISOString(),
    eventType,
    stepName,
    status,
    metadata,
    durationMs,
  };

  telemetryStore.unshift(event);
  if (telemetryStore.length > 500) {
    telemetryStore.pop();
  }

  // If live neatlogs API key is present, forward event
  if (NEATLOGS_API_KEY) {
    try {
      await fetch("https://api.neatlogs.com/v1/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NEATLOGS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    } catch (err) {
      console.warn("neatlogs live telemetry forward error:", err);
    }
  }

  return event;
}

export function getTelemetryForRun(runId: string): NeatlogsEvent[] {
  return telemetryStore.filter((ev) => ev.runId === runId);
}

export function getAllTelemetryEvents(limit: number = 50): NeatlogsEvent[] {
  return telemetryStore.slice(0, limit);
}
