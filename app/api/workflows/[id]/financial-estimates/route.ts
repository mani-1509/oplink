import { NextRequest, NextResponse } from "next/server";
import { getFinancialEstimatesCol, getWorkflowsCol } from "@/lib/models";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const col = await getFinancialEstimatesCol();
    const estimates = await col.find({ workflowId: id }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, estimates });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch estimates" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      currency = "USD",
      monthlyRuns = 600,
      minutesSavedPerRun = 18,
      laborCostPerHour = 75,
      monthlyInfrastructureCost = 240,
      monthlyModelCost = 8.1,
      monthlyRevenue = 29850,
      assumptions = {},
      cfoaiReference = "https://cfo.ai/neathacks",
    } = body;

    const totalExpense = Number(monthlyInfrastructureCost) + Number(monthlyModelCost);
    const grossMargin = Number(monthlyRevenue) - totalExpense;
    const grossMarginPercentage = Number(monthlyRevenue) > 0 ? (grossMargin / Number(monthlyRevenue)) * 100 : 0;
    const totalMonthlySavingsUsd = (Number(monthlyRuns) * Number(minutesSavedPerRun) * Number(laborCostPerHour)) / 60;

    const estimateId = `fe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newEstimate = {
      id: estimateId,
      workflowId: id,
      currency,
      monthlyRuns: Number(monthlyRuns),
      minutesSavedPerRun: Number(minutesSavedPerRun),
      laborCostPerHour: Number(laborCostPerHour),
      monthlyInfrastructureCost: Number(monthlyInfrastructureCost),
      monthlyModelCost: Number(monthlyModelCost),
      monthlyRevenue: Number(monthlyRevenue),
      annualizedMrr: Number(monthlyRevenue) * 12,
      grossMarginPercentage,
      totalMonthlySavingsUsd,
      assumptions,
      cfoaiReference,
      createdAt: new Date().toISOString(),
    };

    const col = await getFinancialEstimatesCol();
    await col.insertOne(newEstimate);

    return NextResponse.json({ success: true, estimate: newEstimate });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save financial estimate" }, { status: 500 });
  }
}
