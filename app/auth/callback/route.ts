import { db } from "@/lib/db";
import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Get user data
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);

    if (user) {
      // Check if user exists in Prisma DB
      const existingUser = await db.user.findUnique({
        where: { id: user.id },
      });
      console.log(existingUser);

      if (!existingUser) {
        // Create new user in Prisma DB with Google profile image
        await db.user.create({
          data: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata.name || user.email?.split("@")[0],
            image: user.user_metadata.avatar_url || null, // 구글 프로필 이미지 추가
          },
        });
      }
    }
  }

  // Redirect to the home page
  return NextResponse.redirect(new URL("/", request.url));
}
