// app/user/community/actions.ts
"use server";

import { regions } from "@/app/utils/address-info";
import { db } from "@/lib/db";

export async function getMorePosts(
  page: number,
  province?: string,
  city?: string,
  district?: string,
  query?: string
) {
  const ITEMS_PER_PAGE = 10;
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const regionData = province
    ? regions.find((r) => r.province === province)
    : null;
  let locationFilter = {};

  if (regionData) {
    if (regionData.type === "metropolitan") {
      // 광역시의 경우
      locationFilter = {
        user: {
          province: province,
          city: null,
          ...(district ? { district } : {}),
        },
      };
    } else {
      // 도의 경우
      locationFilter = {
        user: {
          province: province,
          ...(city ? { city } : {}),
          ...(district ? { district } : {}),
        },
      };
    }
  }

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
      locationFilter,
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
            email: true,
            image: true,
            province: true,
            city: true,
            district: true,
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
