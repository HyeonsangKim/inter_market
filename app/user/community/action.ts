// app/user/community/actions.ts
"use server";

import { db } from "@/lib/db";

export async function getMorePosts(
  page: number,
  city?: string | null,
  district?: string | null,
  query?: string
) {
  const ITEMS_PER_PAGE = 10;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const where = {
    AND: [
      // 검색어 필터
      query
        ? {
            title: {
              contains: query,
              mode: "insensitive" as const,
            },
          }
        : {},
      // 지역 필터
      city
        ? {
            user: {
              si: city,
              ...(district ? { gu: district } : {}),
            },
          }
        : {},
    ],
  };

  // 게시글 데이터와 전체 개수를 동시에 조회
  const [posts, totalCount] = await Promise.all([
    db.post.findMany({
      where,
      select: {
        title: true,
        description: true,
        created_at: true,
        id: true,
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
      },
      orderBy: {
        created_at: "desc",
      },
      take: ITEMS_PER_PAGE,
      skip,
    }),
    db.post.count({ where }),
  ]);

  return {
    posts,
    hasMore: skip + ITEMS_PER_PAGE < totalCount,
    totalCount,
  };
}
