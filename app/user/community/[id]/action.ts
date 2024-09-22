"use server";

import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { revalidatePath, revalidateTag } from "next/cache";

export async function likePost(postId: number) {
  await new Promise((r) => setTimeout(r, 5000));
  const session = await getCurrentUserId();

  try {
    await db.like.create({
      data: {
        postId,
        userId: String(session!.id!),
      },
    });
    revalidateTag(`post-like-status-${postId}`);
    revalidateTag(`post-detail-${postId}`);
  } catch (e) {
    console.log(e);
  }
}
export async function dislikePost(postId: number) {
  await new Promise((r) => setTimeout(r, 5000));

  const session = await getCurrentUserId();
  try {
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: String(session!.id!),
        },
      },
    });
    // revalidatePath(`/posts/${id}`);
    revalidateTag(`post-detail-${postId}`);
    revalidateTag(`post-like-status-${postId}`);
  } catch (e) {}
}
export async function getPost(id: number) {
  try {
    const post = await db.post.findUnique({
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  } catch (e) {
    console.error("Error fetching product:", e);
    return null;
  }
}
// 조회수만 증가시키는 함수
export async function incrementPostViews(id: number) {
  try {
    await db.post.update({
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
export async function getComments(postId: number) {
  try {
    const comments = await db.comment.findMany({
      where: {
        postId,
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
export async function deletePostComment(commentId: number, postId: number) {
  try {
    await db.comment.delete({
      where: { id: commentId },
    });

    revalidatePath(`/user/community/${postId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return { success: false, error: "Failed to delete comment" };
  }
}
export async function getLikeStatus(postId: number, userId: string) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: String(userId),
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}
export async function createPostComment(
  postId: number,
  parentId: number | null,
  content: string
) {
  try {
    const session = await getCurrentUserId();

    const comment = await db.comment.create({
      data: {
        payload: content,
        user: { connect: { id: session!.id.toString() } },
        post: { connect: { id: postId } },
        parent: parentId ? { connect: { id: parentId } } : undefined,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    revalidateTag(`post-comments-${postId}`);
    return comment;
  } catch (e) {
    console.log(e);

    return null;
  }
}
export async function updatePostComment(
  commentId: number,
  postId: number,
  newContent: string
) {
  try {
    await db.comment.update({
      where: { id: commentId },
      data: { payload: newContent },
    });
    revalidateTag(`post-comments-${postId}`);
    return { success: true };
  } catch (error) {
    console.error("댓글 수정 중 오류 발생:", error);
    return { success: false, error: "댓글 수정에 실패했습니다." };
  }
}
export async function deletePost(postId: number) {
  try {
    await db.post.delete({
      where: { id: postId },
    });

    return true;
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}
