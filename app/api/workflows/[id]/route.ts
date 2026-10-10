import { NextRequest, NextResponse } from "next/server";
import {
  getWorkflowsCol,
  getMappingVersionsCol,
  getConnectorConfigsCol,
  getFinancialEstimatesCol,
  getWorkflowRunsCol,
  getCompaniesCol,
} from "@/lib/models";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workflowsCol = await getWorkflowsCol();
    const workflow = await workflowsCol.findOne({ id });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    const mappingVersionsCol = await getMappingVersionsCol();
    const connectorConfigsCol = await getConnectorConfigsCol();
    const financialEstimatesCol = await getFinancialEstimatesCol();
    const workflowRunsCol = await getWorkflowRunsCol();
    const companiesCol = await getCompaniesCol();

    const [mappings, connectors, financialEstimates, runs, company] = await Promise.all([
      mappingVersionsCol.find({ workflowId: id }).sort({ version: -1 }).toArray(),
      connectorConfigsCol.find({ workflowId: id }).toArray(),
      financialEstimatesCol.find({ workflowId: id }).sort({ createdAt: -1 }).toArray(),
      workflowRunsCol.find({ workflowId: id }).sort({ createdAt: -1 }).limit(20).toArray(),
      workflow.companyId ? companiesCol.findOne({ id: workflow.companyId }) : null,
    ]);

    return NextResponse.json({
      success: true,
      workflow,
      company,
      mappings,
      connectors,
      financialEstimates,
      runs,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch workflow" }, { status: 500 });
  }
}
