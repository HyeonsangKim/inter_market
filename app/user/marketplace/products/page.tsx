import React from "react";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import ProductList from "@/components/product-component/product-list";

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      soldout: true,
      photos: {
        select: {
          url: true,
        },
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
    orderBy: {
      created_at: "desc",
    },
  });

  return products.map((product) => ({
    ...product,
    firstPhoto: product.photos[0]?.url || null,
  }));
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function ProductListPage() {
  const initialProducts = await getInitialProducts();

  return (
    <div className="container mx-auto w-full">
      <div>
        <ProductList initialProducts={initialProducts} />
      </div>
    </div>
  );
}
