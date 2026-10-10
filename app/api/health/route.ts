import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";
  let dbLatencyMs = 0;

  try {
    const db = await getDb();
    const dbStart = Date.now();
    await db.command({ ping: 1 });
    dbLatencyMs = Date.now() - dbStart;
  } catch (err: any) {
    dbStatus = "unreachable";
  }

  const isHealthy = dbStatus === "healthy";

  return NextResponse.json(
    {
      status: isHealthy ? "operational" : "degraded",
      service: "oplink-runtime",
      version: "2.4.0",
      timestamp: new Date().toISOString(),
      uptimeSeconds: process.uptime ? Math.floor(process.uptime()) : 0,
      environment: process.env.NODE_ENV || "production",
      checks: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
        engine: {
          status: "ready",
          allowedTransforms: [
            "direct",
            "trim",
            "lowercase",
            "uppercase",
            "date_iso",
            "lookup",
            "template",
          ],
        },
      },
      durationMs: Date.now() - startTime,
    },
    { status: isHealthy ? 200 : 503 }
  );
}
