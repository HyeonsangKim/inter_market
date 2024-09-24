"use server";

import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/getCurrentUser";
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
    revalidateTag(`product-detail-${postId}`);
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
    revalidateTag(`product-detail-${postId}`);
    revalidateTag(`product-like-status-${postId}`);
  } catch (e) {}
}
export async function getProduct(id: number) {
  try {
    const product = await db.product.findUnique({
      where: { id },
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
    console.error("Error fetching product:", e);
    return null;
  }
}
// 조회수만 증가시키는 함수
export async function incrementProductViews(id: number) {
  try {
    await db.product.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  } catch (e) {
    console.error("Error incrementing product views:", e);
  }
}
export async function getComments(productId: number) {
  try {
    const comments = await db.pcomment.findMany({
      where: {
        productId,
        parentId: null, // Only fetch top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { created_at: "asc" },
        },
      },
      orderBy: { created_at: "asc" },
    });
    return comments;
  } catch (e) {
    return null;
  }
}
export async function deleteComment(commentId: number, productId: number) {
  try {
    await db.pcomment.delete({
      where: { id: commentId },
    });

    revalidatePath(`/user/marketplace/products/${productId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return { success: false, error: "Failed to delete comment" };
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
  parentId: number | null,
  content: string
) {
  try {
    const session = await getCurrentUserId();

    const comment = await db.pcomment.create({
      data: {
        payload: content,
        user: { connect: { id: session!.id.toString() } },
        product: { connect: { id: productId } },
        parent: parentId ? { connect: { id: parentId } } : undefined,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    revalidateTag(`product-comments-${productId}`);
    return comment;
  } catch (e) {
    console.log(e);

    return null;
  }
}
export async function updateComment(
  commentId: number,
  postId: number,
  newContent: string
) {
  try {
    await db.pcomment.update({
      where: { id: commentId },
      data: { payload: newContent },
    });
    revalidateTag(`product-comments-${postId}`);
    return { success: true };
  } catch (error) {
    console.error("댓글 수정 중 오류 발생:", error);
    return { success: false, error: "댓글 수정에 실패했습니다." };
  }
}
export async function deleteProduct(productId: number) {
  try {
    await db.product.delete({
      where: { id: productId },
    });

    return true;
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function markProductAsSoldOut(
  productId: number,
  soldout: boolean
) {
  try {
    const updatedProduct = await db.product.update({
      where: {
        id: productId,
      },
      data: {
        soldout: !soldout,
      },
    });

    revalidateTag(`product-detail-${productId}`);
    revalidatePath(`/user/marketplace/products/${productId}`);
    return updatedProduct;
  } catch (error) {
    console.error("Error marking product as sold out:", error);
    throw error;
  }
}
