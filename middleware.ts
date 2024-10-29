import { type NextRequest } from "next/server";
import { updateSession } from "./app/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // auth callback 경로는 미들웨어를 건너뛰도록 함
  if (request.nextUrl.pathname.startsWith("/auth/callback")) {
    return;
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    // 인증이 필요한 경로들
    "/user/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
    "/login",
    "/create-account",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
