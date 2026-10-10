import { NextRequest, NextResponse } from "next/server";
import { enrichCompanyWithCrustdata } from "@/lib/crustdata";

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();
    if (!domain) {
      return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 });
    }

    const company = await enrichCompanyWithCrustdata(domain);
    return NextResponse.json({
      success: true,
      company,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to enrich company" }, { status: 500 });
  }
}
