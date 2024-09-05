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
    revalidateTag(`product-like-status-${postId}`);
  } catch (e) {}
}
export async function getProduct(id: number) {
  try {
    const product = await db.product.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            si: true,
            gu: true,
            dong: true,
          },
        },
        comments: {
          select: {
            id: true,
            payload: true,
            created_at: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        photos: {
          select: {
            id: true,
            url: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return product;
  } catch (e) {
    return null;
  }
}
export async function getLikeStatus(productId: number, userId: string) {
  const isLiked = await db.plike.findUnique({
    where: {
      id: {
        productId,
        userId: String(userId),
      },
    },
  });
  const likeCount = await db.plike.count({
    where: {
      productId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}
