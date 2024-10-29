import { db } from "@/lib/db";
import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";
import { error } from "console";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  console.log("Auth Callback Started", { code: !!code });

  if (!code) {
    throw new Error("No code provided");
  }

  const supabase = createClient();
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.exchangeCodeForSession(code);

  if (!authError && session?.user) {
    try {
      // 기존 유저 확인
      const existingUser = await db.user.findUnique({
        where: { id: session.user.id },
      });

      // 새로운 유저만 생성
      if (!existingUser) {
        await db.user.create({
          data: {
            id: session.user.id,
            email: session.user.email!,
            name:
              session.user.user_metadata.name ||
              session.user.email?.split("@")[0],
            image: session.user.user_metadata.avatar_url || null,
          },
        });
        console.log("New user created");
      } else {
        console.log("Existing user logged in");
      }
    } catch (error) {
      console.error("Error handling user:", error);
    }
  }

  // Redirect to the home page
  return NextResponse.redirect(new URL("/", request.url));
}
