"use server";

import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { revalidateTag } from "next/cache";

export async function likePost(postId: number) {
  await new Promise((r) => setTimeout(r, 5000));
  const session = await getCurrentUserId();
  console.log(postId);
  console.log(session?.id);

  try {
    await db.plike.create({
      data: {
        productId: postId,
        userId: String(session!.id!),
      },
    });
    revalidateTag(`product-like-status-${postId}`);
  } catch (e) {
    console.log(e);
  }
}
export async function dislikePost(postId: number) {
  await new Promise((r) => setTimeout(r, 5000));

  const session = await getCurrentUserId();
  try {
    await db.plike.delete({
      where: {
        id: {
          productId: postId,
          userId: String(session!.id!),
        },
      },
    });
    // revalidatePath(`/posts/${id}`);
    revalidateTag(`product-status-${postId}`);
  } catch (e) {}
}
