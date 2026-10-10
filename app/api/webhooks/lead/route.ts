import { NextRequest, NextResponse } from "next/server";
import { orchestrateIntegrationRun } from "@/lib/engine/orchestrator";
import { LeadSchema } from "@/lib/schemas";

/**
 * Webhook Ingest Endpoint for Real CRM & Web Leads
 * POST /api/webhooks/lead
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      companyDomain,
      status = "lead",
      estimatedValue,
      workflowId = "wf_crm_lead_to_task",
      autoSelfHeal = true,
    } = body;

    const leadPayload = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name || "New Inbound Prospect",
      email: email || `contact@${companyDomain || "company.com"}`,
      companyDomain: companyDomain || (email ? email.split("@")[1] : "example.com"),
      status: status || "lead",
      estimatedValue: estimatedValue ? Number(estimatedValue) : undefined,
      isDemo: false,
    };

    const validation = LeadSchema.safeParse(leadPayload);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid lead payload",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    // Execute real pipeline run
    const run = await orchestrateIntegrationRun({
      workflowId,
      lead: validation.data,
      deliberateFailure: false, // real data runs without artificial failures
      autoSelfHeal,
    });

    return NextResponse.json({
      success: true,
      message: "Lead processed and mapped successfully",
      runId: run.id,
      status: run.status,
      destinationTaskId: run.destinationResult?.idempotency_key,
      run,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
