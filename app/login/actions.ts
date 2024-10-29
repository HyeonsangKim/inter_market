"use server";

import { db } from "@/lib/db";
import { createClient } from "../utils/supabase/server";
import { cookies } from "next/headers";

interface UserData {
  id: string;
  email: string;
  name: string;
  image: string | null;
}

export async function loginWithEmail(prevState: any, formData: FormData) {
  try {
    const supabase = createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );

    if (signInError) {
      if (signInError.message.includes("Invalid login credentials")) {
        return {
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
          success: false,
        };
      }
      return {
        message: "로그인에 실패했습니다. 다시 시도해주세요.",
        success: false,
      };
    }

    // 로그인 성공 후 세션 확인
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      // 쿠키 설정 (필요한 경우)
      cookies().set("sb-token", session.access_token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return { success: true };
    }

    return {
      message: "세션 생성에 실패했습니다.",
      success: false,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      success: false,
    };
  }
}
export async function handleGoogleUser(user: UserData) {
  try {
    const existingUser = await db.user.findUnique({
      where: { id: user.id },
      select: { id: true },
    });
    console.log("[poasdpasuidpahspidbaipsodnpasndipn");

    console.log(existingUser);

    if (!existingUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error handling user:", error);
    return { success: false, error: "Failed to process user" };
  }
}
