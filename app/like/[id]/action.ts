"use server";
import { db } from "@/lib/db";

export async function getLikedProducts(userId: string) {
  const likedProducts = await db.plike.findMany({
    where: {
      userId,
    },
    select: {
      product: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
              si: true,
              gu: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const productWithLikeCount = await Promise.all(
    likedProducts.map(async (like) => {
      const likeCount = await db.like.count({
        where: {
          postId: like.product.id,
        },
      });
      return { ...like.product, likeCount };
    })
  );

  return productWithLikeCount;
}
