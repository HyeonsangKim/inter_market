"use server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/app/utils/supabase/get-user";
import { revalidateTag } from "next/cache";

// 프로덕트 좋아요
export async function likeProduct(productId: number) {
  await new Promise((r) => setTimeout(r, 300)); // 디바운스 시간 줄임
  const session = await getCurrentUser();

  if (!session?.id) {
    throw new Error("Authentication required");
  }

  try {
    await db.plike.create({
      data: {
        productId: productId,
        userId: String(session.id),
      },
    });
    revalidateTag(`product-like-status-${productId}`);
    revalidateTag(`product-detail-${productId}`);
  } catch (e) {
    console.error("Failed to like product:", e);
    throw new Error("Failed to like product");
  }
}

// 프로덕트 좋아요 취소
export async function dislikeProduct(productId: number) {
  await new Promise((r) => setTimeout(r, 300));
  const session = await getCurrentUser();

  if (!session?.id) {
    throw new Error("Authentication required");
  }

  try {
    await db.plike.delete({
      where: {
        id: {
          productId: productId,
          userId: String(session.id),
        },
      },
    });
    revalidateTag(`product-detail-${productId}`);
    revalidateTag(`product-like-status-${productId}`);
  } catch (e) {
    console.error("Failed to dislike product:", e);
    throw new Error("Failed to dislike product");
  }
}

// 포스트 좋아요
export async function likePost(postId: number) {
  await new Promise((r) => setTimeout(r, 300));
  const session = await getCurrentUser();

  if (!session?.id) {
    throw new Error("Authentication required");
  }

  try {
    await db.like.create({
      data: {
        postId: postId,
        userId: String(session.id),
      },
    });
    revalidateTag(`post-like-status-${postId}`);
    revalidateTag(`post-detail-${postId}`);
  } catch (e) {
    console.error("Failed to like post:", e);
    throw new Error("Failed to like post");
  }
}

// 포스트 좋아요 취소
export async function dislikePost(postId: number) {
  await new Promise((r) => setTimeout(r, 300));
  const session = await getCurrentUser();

  if (!session?.id) {
    throw new Error("Authentication required");
  }

  try {
    await db.like.delete({
      where: {
        id: {
          postId: postId,
          userId: String(session.id),
        },
      },
    });
    revalidateTag(`post-detail-${postId}`);
    revalidateTag(`post-like-status-${postId}`);
  } catch (e) {
    console.error("Failed to dislike post:", e);
    throw new Error("Failed to dislike post");
  }
}
