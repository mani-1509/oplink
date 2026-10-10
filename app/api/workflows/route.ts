import { NextRequest, NextResponse } from "next/server";
import { getWorkflowsCol, getCompaniesCol, getMappingVersionsCol } from "@/lib/models";
import { getCurrentUser } from "@/lib/auth";
import { initAndSeedDatabase } from "@/lib/seed";

export async function GET() {
  try {
    // Auto-seed if empty
    await initAndSeedDatabase();

    const workflowsCol = await getWorkflowsCol();
    const workflows = await workflowsCol.find({}).sort({ updatedAt: -1 }).toArray();

    return NextResponse.json({ success: true, workflows });
  } catch (err: any) {
    console.error("Fetch workflows error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch workflows" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { name, description, companyId, sourceType = "mock_crm", destinationType = "mock_task" } = body;

    if (!name) {
      return NextResponse.json({ error: "Workflow name is required" }, { status: 400 });
    }

    const workflowsCol = await getWorkflowsCol();
    const mappingVersionsCol = await getMappingVersionsCol();

    const workflowId = `wf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newWorkflow = {
      id: workflowId,
      name,
      description: description || "Custom integration workflow",
      companyId: companyId || undefined,
      sourceType,
      destinationType,
      status: "draft" as const,
      currentMappingVersion: 1,
      userId: user?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await workflowsCol.insertOne(newWorkflow);

    // Initial Mapping Version
    const mappingVersionId = `mv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await mappingVersionsCol.insertOne({
      id: mappingVersionId,
      workflowId,
      version: 1,
      mapping: { fields: [] },
      status: "draft",
      createdBy: user ? "human" : "agent",
      changeReason: "Initial empty mapping draft",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, workflow: newWorkflow });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create workflow" }, { status: 500 });
  }
}
