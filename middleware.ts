import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.AUTH_SECRET });
  console.log(session);

  const pathname = req.nextUrl.pathname;

  // 로그인된 유저만 접근가능
  const protectedPaths = ["/user", "/profile", "/dashboard"]; // 보호해야 할 경로들을 배열로 저장

  if (protectedPaths.some((path) => pathname.startsWith(path)) && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 로그인된 유저는 회원가입, 로그인페이지 접근 불가
  if (
    (pathname.startsWith("/login") || pathname.startsWith("/create-account")) &&
    session
  ) {
    return NextResponse.redirect(new URL("/user", req.url));
  }

  return NextResponse.next(); //통과
}
