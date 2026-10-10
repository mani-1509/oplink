import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "oplink_hackathon_super_secret_jwt_key_2026"
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("oplink_session")?.value;
  const { pathname } = request.nextUrl;

  // Add request header to pass auth context to downstream handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload?.id) {
        requestHeaders.set("x-user-id", payload.id as string);
        requestHeaders.set("x-user-email", (payload.email as string) || "");
        requestHeaders.set("x-user-name", (payload.name as string) || "");
      }
    } catch {
      // Invalid/expired token - clear cookie
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      response.cookies.delete("oplink_session");
      return response;
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (.svg, .png, .jpg, .docx)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|docx|ico)$).*)",
  ],
};
