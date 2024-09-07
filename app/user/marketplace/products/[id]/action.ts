"use server";

import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { connect } from "http2";
import { revalidatePath, revalidateTag } from "next/cache";

export async function likePost(postId: number) {
  await new Promise((r) => setTimeout(r, 5000));
  const session = await getCurrentUserId();

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

export async function createComment(
  productId: number,
  parentId?: number,
  content: string
) {
  const session = await getCurrentUserId();
  let depth = 0;
  console.log("parenrapa");
  console.log(parentId);

  if (parentId) {
    const parentComment = await db.pcomment.findUnique({
      where: { id: parentId },
      select: { depth: true },
    });
    console.log(parentComment);

    depth = Number(parentComment?.depth) + 1;
  }
  console.log("asdas");
  console.log(depth);

  const product = await db.pcomment.create({
    data: {
      parentId: parentId,
      payload: content,
      depth: depth,
      user: {
        connect: {
          id: session!.id.toString(),
        },
      },
      product: {
        connect: {
          id: productId,
        },
      },
    },
    select: {
      id: true,
    },
  });
  revalidatePath(`/user/marketplace/products/${productId}`);
}
