import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getUsersCol, UserDoc } from "./models";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "oplink_hackathon_super_secret_jwt_key_2026"
);

const TOKEN_COOKIE_NAME = "oplink_session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: { id: string; email: string; name: string }): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<{ id: string; email: string; name: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<Omit<UserDoc, "passwordHash"> | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload) return null;

    const usersCol = await getUsersCol();
    const user = await usersCol.findOne({ id: payload.id });
    if (!user) return null;

    const { passwordHash: _, ...safeUser } = user;
    return safeUser as Omit<UserDoc, "passwordHash">;
  } catch {
    return null;
  }
}
