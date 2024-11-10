import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase credentials missing:", {
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseKey,
    });
    return NextResponse.next({
      request,
    });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
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
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    const publicPaths = ["/", "/login", "/create-account", "/auth/callback"];
    const readOnlyPaths = ["/user/marketplace/products", "/user/community"];

    if (
      request.method === "GET" &&
      readOnlyPaths.some((path) => pathname.startsWith(path)) &&
      !pathname.includes("/create") &&
      !pathname.includes("/edit") &&
      !pathname.includes("/delete")
    ) {
      return supabaseResponse;
    }

    if (publicPaths.includes(pathname)) {
      return supabaseResponse;
    }

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
  } catch (error) {
    console.error("Supabase client creation failed:", error);
    return NextResponse.next({
      request,
    });
  }
}
