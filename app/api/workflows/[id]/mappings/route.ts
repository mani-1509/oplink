import { NextRequest, NextResponse } from "next/server";
import { getMappingVersionsCol, getWorkflowsCol } from "@/lib/models";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const body = await req.json();
    const { mapping, changeReason } = body;

    const workflowsCol = await getWorkflowsCol();
    const workflow = await workflowsCol.findOne({ id });
    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    const mappingVersionsCol = await getMappingVersionsCol();
    const latestMapping = await mappingVersionsCol.find({ workflowId: id }).sort({ version: -1 }).limit(1).toArray();
    const nextVersion = (latestMapping[0]?.version || 0) + 1;

    const mappingVersionId = `mv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newMapping = {
      id: mappingVersionId,
      workflowId: id,
      version: nextVersion,
      mapping: mapping || {},
      status: "tested" as const,
      createdBy: user ? "human" as const : "agent" as const,
      changeReason: changeReason || `Mapping version ${nextVersion} revision`,
      createdAt: new Date().toISOString(),
    };

    await mappingVersionsCol.insertOne(newMapping);
    await workflowsCol.updateOne(
      { id },
      { $set: { currentMappingVersion: nextVersion, updatedAt: new Date().toISOString() } }
    );

    return NextResponse.json({ success: true, mappingVersion: newMapping });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create mapping revision" }, { status: 500 });
  }
}
