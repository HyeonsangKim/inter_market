"use server";

import { db } from "@/lib/db";

export async function getLikedItems(
  userId: string,
  productPage = 1,
  postPage = 1
) {
  const ITEMS_PER_PAGE = 6;
  const productSkip = (productPage - 1) * ITEMS_PER_PAGE;
  const postSkip = (postPage - 1) * ITEMS_PER_PAGE;

  const [productsWithCount, postsWithCount, totalProducts, totalPosts] =
    await Promise.all([
      db.plike
        .findMany({
          where: { userId },
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
                photos: {
                  select: { url: true },
                  take: 1,
                },
              },
            },
            created_at: true,
          },
          orderBy: { created_at: "desc" },
          skip: productSkip,
          take: ITEMS_PER_PAGE,
        })
        .then(async (likes) => {
          return Promise.all(
            likes.map(async (like) => {
              const likeCount = await db.plike.count({
                where: { productId: like.product.id },
              });
              return { ...like.product, likeCount };
            })
          );
        }),

      db.like
        .findMany({
          where: { userId },
          select: {
            post: {
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
            created_at: true,
          },
          orderBy: { created_at: "desc" },
          skip: postSkip,
          take: ITEMS_PER_PAGE,
        })
        .then(async (likes) => {
          return Promise.all(
            likes.map(async (like) => {
              const likeCount = await db.like.count({
                where: { postId: like.post.id },
              });
              return { ...like.post, likeCount };
            })
          );
        }),

      db.plike.count({ where: { userId } }),
      db.like.count({ where: { userId } }),
    ]);

  return {
    products: productsWithCount,
    posts: postsWithCount,
    productPages: Math.ceil(totalProducts / ITEMS_PER_PAGE),
    postPages: Math.ceil(totalPosts / ITEMS_PER_PAGE),
  };
}
