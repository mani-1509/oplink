import { NextResponse } from "next/server";
import { getAllTelemetryEvents } from "@/lib/neatlogs";
import { getCollection } from "@/lib/mongodb";
import { RunStepDoc } from "@/lib/models";

export async function GET() {
  try {
    // 1. In-memory neatlogs events
    const memoryEvents = getAllTelemetryEvents(50);

    // 2. Persisted steps from MongoDB to guarantee persistence across server reloads
    let dbEvents: any[] = [];
    try {
      const runStepsCol = await getCollection<RunStepDoc>("run_steps");
      const recentSteps = await runStepsCol
        .find({})
        .sort({ timestamp: -1 })
        .limit(50)
        .toArray();

      dbEvents = recentSteps.map((s) => ({
        id: s._id?.toString() || s.id,
        projectId: "oplink-prod-2026",
        runId: s.runId,
        timestamp: s.timestamp,
        eventType: s.eventType || "TOOL_CALL",
        stepName: s.stepName,
        status: s.status,
        metadata: s.payload || {},
        durationMs: s.durationMs,
      }));
    } catch {
      // Fall back safely to memoryEvents if MongoDB connection is in test environment
    }

    // Merge and deduplicate by runId + stepName + timestamp
    const all = [...memoryEvents];
    for (const dbe of dbEvents) {
      if (!all.some((m) => m.runId === dbe.runId && m.stepName === dbe.stepName)) {
        all.push(dbe);
      }
    }

    all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      success: true,
      events: all.slice(0, 100),
      neatlogsDashboardUrl: "https://neatlogs.com/hackathon",
      entireCheckpointUrl: "https://hack.entire.io/neathacks-2026/",
      cfoAiPlanUrl: "https://cfo.ai/neathacks",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message, events: [] },
      { status: 500 }
    );
  }
}
