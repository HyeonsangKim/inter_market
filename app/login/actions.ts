"use server";

import { checkEmailExists } from "@/lib/check";
import { db } from "@/lib/db";
import { signIn } from "next-auth/react";
import { z } from "zod";
import bcrypt from "bcryptjs";
interface InputData {
  email: string;
  password: string;
}

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "An account with this email does not exist."),
  password: z.string({
    required_error: "Password is required.",
  }),
});
export async function login(prevState: any, formData: FormData) {
  const data: InputData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const result = await formSchema.spa(data);

  if (!result.success) {
    return {
      isLogin: false,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(result.data.password, user!.password ?? "");
    if (ok) {
      return {
        isLogin: true,
        data: result.data,
      };
    } else {
      return {
        isLogin: false,
        fieldErrors: {
          password: ["Wrong password."],
          email: [],
        },
      };
    }
    // await signIn("credentials", result.data);
  }
}
