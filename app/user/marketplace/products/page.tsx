import React from "react";
import { db } from "@/lib/db";
import ProductList from "@/components/product-component/product-list";
import { getCurrentUser } from "@/app/utils/supabase/get-user";
import { getMoreProducts } from "./action";

export type Product = {
  user: {
    image: string | null;
    id: string;
    gu: string | null;
    name: string | null;
    si: string | null;
    dong: string | null;
  };
  id: number;
  title: string;
  price: number;
  created_at: Date;
  soldout: boolean | null;
  photos: { url: string }[];
};

export type InitialProducts = Product[];

export default async function ProductListPage() {
  const session = await getCurrentUser();
  const user = session
    ? await db.user.findUnique({
        where: { id: session.id },
        select: { si: true, gu: true },
      })
    : null;

  const { products: initialProducts } = await getMoreProducts(
    1,
    user?.si || "",
    user?.gu || "",
    ""
  );

  return (
    <div className="container mx-auto w-full">
      <div>
        <ProductList
          initialProducts={initialProducts}
          initialLocation={{ city: user?.si || "", district: user?.gu || "" }}
          isLoggedIn={!!session}
        />
      </div>
    </div>
  );
}
