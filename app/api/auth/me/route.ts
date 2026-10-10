import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({
      success: true,
      user: user || null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch user" }, { status: 500 });
  }
}
