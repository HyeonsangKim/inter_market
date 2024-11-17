import React from "react";
import { db } from "@/lib/db";
import ProductList from "@/components/product-component/ProductList";
import { getCurrentUser } from "@/app/utils/supabase/get-user";
import { getMoreProducts } from "./action";

export default async function ProductListPage() {
  const session = await getCurrentUser();
  const user = session
    ? await db.user.findUnique({
        where: { id: session.id },
        select: {
          province: true,
          city: true,
          district: true,
        },
      })
    : null;

  const { products: initialProducts } = await getMoreProducts(
    1,
    user?.province || undefined,
    user?.city || undefined,
    user?.district || undefined,
    ""
  );

  return (
    <div className="container mx-auto w-full">
      <div>
        <ProductList
          initialProducts={initialProducts}
          initialLocation={{
            province: user?.province || "",
            city: user?.city || "",
            district: user?.district || "",
          }}
          isLoggedIn={!!session}
        />
      </div>
    </div>
  );
}
