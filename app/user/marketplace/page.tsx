import React, { useState, useEffect } from "react";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import ProductList from "@/components/ProductList";
import Link from "next/link";

// 기존에 제공된 getInitialProducts 함수와 타입 정의
async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
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

export default async function Page() {
  const initialProducts = await getInitialProducts();
  return (
    <div className='container mx-auto w-full'>
      <Link href='/user/marketplace/create'>New</Link>
      <div>
        <ProductList initialProducts={initialProducts} />
      </div>
    </div>
  );
}
