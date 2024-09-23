"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { productSchema } from "../../create/shema";
import { revalidateTag } from "next/cache";

export async function getPost(id: number) {
  const post = await db.post.findUnique({
    where: { id },
  });
  return post;
}

export async function updatePost(_: any, formData: FormData) {
  const data = {
    id: formData.get("id"),
    title: formData.get("title"),
    content: formData.get("content"),
  };

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getCurrentUserId();

    if (session?.id) {
      await db.post.update({
        where: { id: Number(data.id) },
        data: {
          title: result.data.title,
          description: result.data.content,
        },
      });
      revalidateTag(`post-detail-${data.id}`);
      redirect(`/user/community`);
    }
  }
}
