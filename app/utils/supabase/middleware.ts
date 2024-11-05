import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

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

  // 전체 공개 경로
  const publicPaths = ["/", "/login", "/create-account", "/auth/callback"];
  // 읽기 전용 경로
  const readOnlyPaths = ["/user/marketplace/products", "/user/community"];

  // 읽기 전용 경로에서 GET 요청은 허용
  if (
    request.method === "GET" &&
    readOnlyPaths.some((path) => pathname.startsWith(path)) &&
    !pathname.includes("/create") &&
    !pathname.includes("/edit") &&
    !pathname.includes("/delete")
  ) {
    return supabaseResponse;
  }

  // 완전 공개 경로는 허용
  if (publicPaths.includes(pathname)) {
    return supabaseResponse;
  }

  // 나머지 경로는 로그인 필요
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && (pathname === "/login" || pathname === "/create-account")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
