"use server";

import { db } from "@/lib/db";
import { InitialProducts } from "./page";
type ProductsResponse = {
  products: InitialProducts;
  hasMore: boolean;
  totalCount: number;
};

export async function getMoreProducts(
  page: number,
  city?: string,
  district?: string,
  query?: string
): Promise<ProductsResponse> {
  const ITEMS_PER_PAGE = 12;
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
            si: true,
            gu: true,
            dong: true,
          },
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
