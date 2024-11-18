import React from "react";
import { Post, Product } from "@/app/types/common";
import { ProductItem } from "./product-component/ProductItem";
import { PostItem } from "./post-component/PostItem";

interface PopularItemsProps {
  title: string;
  products?: Product[];
  posts?: Post[];
}

const PopularItems: React.FC<PopularItemsProps> = ({
  title,
  products,
  posts,
}) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    {products && products.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    )}
    {posts && posts.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    )}
    {!products?.length && !posts?.length && (
      <p className="text-gray-600">No items available at the moment.</p>
    )}
  </div>
);

export default PopularItems;
