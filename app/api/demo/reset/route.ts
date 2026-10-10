import { NextResponse } from "next/server";
import { initAndSeedDatabase } from "@/lib/seed";

export async function POST() {
  try {
    const result = await initAndSeedDatabase(true);
    return NextResponse.json({ success: true, message: result.message });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
