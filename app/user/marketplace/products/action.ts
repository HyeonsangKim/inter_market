"use server";

import { db } from "@/lib/db";
import { regions } from "@/app/utils/address-info";
import { InitialProducts } from "@/app/types/common";
type ProductsResponse = {
  products: InitialProducts;
  hasMore: boolean;
  totalCount: number;
};

export async function getMoreProducts(
  page: number,
  province?: string,
  city?: string,
  district?: string,
  query?: string
): Promise<ProductsResponse> {
  const ITEMS_PER_PAGE = 12;
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

  const [products, totalCount] = await Promise.all([
    db.product.findMany({
      where,
      select: {
        title: true,
        price: true,
        created_at: true,
        soldout: true,
        photos: {
          select: { url: true },
          take: 1,
        },
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            province: true,
            city: true,
            district: true,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
      orderBy: { created_at: "desc" },
      take: ITEMS_PER_PAGE,
      skip,
    }),
    db.product.count({ where }),
  ]);

  return {
    products,
    hasMore: skip + ITEMS_PER_PAGE < totalCount,
    totalCount,
  };
}
