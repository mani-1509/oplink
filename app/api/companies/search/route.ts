import { NextRequest, NextResponse } from "next/server";
import { getCompaniesCol } from "@/lib/models";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const companiesCol = await getCompaniesCol();
    let query: any = {};
    if (q) {
      query = {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { domain: { $regex: q, $options: "i" } },
          { industry: { $regex: q, $options: "i" } },
        ],
      };
    }

    const companies = await companiesCol.find(query).limit(20).toArray();
    return NextResponse.json({ success: true, companies });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to search companies" }, { status: 500 });
  }
}
