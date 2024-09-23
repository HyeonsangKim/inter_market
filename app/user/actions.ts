import { db } from "@/lib/db";

export async function fetchPopularProducts(limit = 5) {
  return await db.product.findMany({
    take: limit,
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
    include: {
      user: true,
      photos: {
        select: {
          id: true,
          url: true,
        },
      },
      _count: {
        select: { likes: true },
      },
    },
  });
}

export async function fetchPopularPosts(limit = 5) {
  return await db.post.findMany({
    take: limit,
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
    include: {
      user: true,
      _count: {
        select: { likes: true },
      },
    },
  });
}
