"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { db } from "@/lib/db";
import { z } from "zod";
import { createClient } from "@/app/utils/supabase/server";
import { getSupabaseErrorMessage } from "@/lib/errors";
import { cookies } from "next/headers";

const checkPassword = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const formSchema = z
  .object({
    name: z
      .string({
        invalid_type_error: "name must be a string!",
        required_error: "Where is my name?",
      })
      .min(3, "wat too short!")
      .trim(),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        "Password must contain at least 10 character(s)"
      )
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string(),
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPassword, {
    message: "Both passwords should be the same!",
    path: ["confirmPassword"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  try {
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const result = await formSchema.safeParseAsync(data);

    if (!result.success) {
      return {
        fieldErrors: result.error.flatten().fieldErrors,
        success: false,
      };
    }

    const supabase = createClient();
    const { email, password, name } = result.data;

    // 1. Sign up the user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (signUpError) {
      console.log("SignUp Error:", signUpError);
      return {
        formError: getSupabaseErrorMessage(signUpError),
        success: false,
      };
    }

    if (authData.user) {
      // 2. Create user in database
      await db.user.create({
        data: {
          id: authData.user.id,
          name: result.data.name,
          email: result.data.email,
          image: null,
        },
      });

      // 3. Auto login after signup
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        console.log("SignIn Error:", signInError);
        return {
          message: "Registration was completed, but automatic login failed.",
          success: false,
        };
      }

      // 4. Set session cookie if login successful
      if (signInData.session) {
        cookies().set("sb-token", signInData.session.access_token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        return {
          success: true,
          redirect: "/user", // 리다이렉트 경로를 반환
        };
      }
    }

    return {
      message: "An error occurred during the registration process.",
      success: false,
    };
  } catch (error) {
    console.error("Account creation error:", error);
    return {
      message: "A server error occurred. Please try again later.",
      success: false,
    };
  }
}
