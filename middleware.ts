import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./app/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // 서버 액션과 정적 리소스는 미들웨어를 건너뛰도록 함

  try {
    if (
      request.method === "POST" ||
      request.nextUrl.pathname.startsWith("/auth/callback") ||
      request.nextUrl.pathname.startsWith("/_next") ||
      request.nextUrl.pathname.includes("/api/") ||
      request.nextUrl.pathname.endsWith(".ico") ||
      request.nextUrl.pathname.endsWith(".png") ||
      request.nextUrl.pathname.endsWith(".svg")
    ) {
      return;
    }

    return await updateSession(request);
  } catch (e) {
    console.error("Middleware error:", e);
    return NextResponse.next({
      request,
    });
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
