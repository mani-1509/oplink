import { NextRequest, NextResponse } from "next/server";
import { getUsersCol } from "@/lib/models";
import { hashPassword, createSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const usersCol = await getUsersCol();
    const existing = await usersCol.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 });
    }

    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const passwordHash = await hashPassword(password);
    const displayName = name || email.split("@")[0];

    const newUser = {
      id,
      email: email.toLowerCase().trim(),
      passwordHash,
      name: displayName,
      role: "user" as const,
      createdAt: new Date().toISOString(),
    };

    await usersCol.insertOne(newUser);

    const token = await createSessionToken({ id, email: newUser.email, name: displayName });

    const res = NextResponse.json({
      success: true,
      user: { id, email: newUser.email, name: displayName, role: newUser.role },
    });

    res.cookies.set("oplink_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: err.message || "Failed to register" }, { status: 500 });
  }
}
