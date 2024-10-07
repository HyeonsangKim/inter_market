"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
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
    message: "Both passwords shoudl be the same!",
    path: ["confirmPassword"],
  });
export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    const user = await db.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    // await saveSession(user.id, "profile");
    return redirect(`/login`);
  }
}
