import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 현재 경로
  const pathname = request.nextUrl.pathname;
  // HTTP 메서드
  const method = request.method;

  // 완전 공개 경로 (로그인 불필요)
  const publicPaths = ["/", "/login", "/create-account", "/auth/callback"];

  // 읽기 전용 경로 (GET 요청만 허용)
  const readOnlyPaths = [
    "/user/marketplace/products",
    "/user/community",
    "/user",
  ];

  // 인증이 필요한 작업을 포함하는 경로 패턴
  const authRequiredPatterns = [
    "/create",
    "/edit",
    "/delete",
    "/like",
    "/chats",
    "/profile",
  ];

  // 완전 공개 경로는 무조건 허용
  if (publicPaths.includes(pathname)) {
    return supabaseResponse;
  }

  // 읽기 전용 경로에서 GET 요청은 허용
  if (
    method === "GET" &&
    readOnlyPaths.some((path) => pathname.startsWith(path)) &&
    !authRequiredPatterns.some((pattern) => pathname.includes(pattern))
  ) {
    return supabaseResponse;
  }

  // 로그인이 필요한 경우 처리
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // 현재 경로를 리다이렉트 후에 사용하기 위해 저장
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // 이미 로그인한 사용자가 로그인/회원가입 페이지 접근 시 홈으로 리다이렉트
  if (user && (pathname === "/login" || pathname === "/create-account")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/user/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
    "/login",
    "/create-account",
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
