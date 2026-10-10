import { NextResponse } from "next/server";
import { SAMPLE_LEADS } from "@/lib/mockDb";

export async function GET() {
  return NextResponse.json({
    success: true,
    leads: SAMPLE_LEADS,
  });
}
