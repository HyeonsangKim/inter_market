"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "../utils/supabase/server";

async function checkEmailExists(email: string) {
  const user = await db.user.findUnique({
    where: { email },
  });
  return !!user;
}

const formSchema = z.object({
  email: z
    .string()
    .email("올바른 이메일 형식이 아닙니다.")
    .toLowerCase()
    .refine(checkEmailExists, "존재하지 않는 이메일입니다."),
  password: z.string({
    required_error: "비밀번호를 입력해주세요.",
  }),
});

interface State {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
  success?: boolean;
}

export async function loginWithEmail(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  try {
    const validatedFields = await formSchema.safeParseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    const { email, password } = validatedFields.data;

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );
    console.log(data);

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

    // 로그인 성공 시 리다이렉트 대신 상태 반환
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      success: false,
    };
  }
}
