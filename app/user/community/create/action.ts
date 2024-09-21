"use server";

import { redirect } from "next/navigation";
import { productSchema } from "./shema";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/getCurrentUser";

export async function uploadPost(_: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    content: formData.get("content"),
  };

  const result = productSchema.safeParse(data);
  console.log(result);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getCurrentUserId();

    if (session!.id) {
      const product = await db.post.create({
        data: {
          title: result.data.title,
          description: result.data.content,
          user: {
            connect: {
              id: session!.id.toString(),
            },
          },
        },
        select: {
          id: true,
        },
      });

      redirect(`/user/community`);
    }
  }
}
