"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { InitialProducts } from "@/app/user/marketplace/page";
import { formatToTimeAgo } from "@/app/utils/utils";

const PRODUCTS_PER_PAGE = 9; // 한 페이지당 표시할 제품 수
interface ProductListProps {
  initialProducts: InitialProducts;
}
const ProductCard: React.FC<{ product: InitialProducts[number] }> = ({
  product,
}) => (
  <div className='bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer'>
    <div className='relative h-40'>
      {product.photos[0] && (
        <Image
          fill
          src={product.photos[0].url}
          alt={product.title}
          className='object-cover'
        />
      )}
    </div>
    <div className='p-3'>
      <h2 className='text-sm font-semibold mb-1 truncate'>{product.title}</h2>
      <p className='text-lg font-bold text-indigo-600'>{product.price}</p>
      <p className='text-xs text-gray-500 mt-1'>
        {formatToTimeAgo(product.created_at.toString())}
      </p>
    </div>
  </div>
);

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<InitialProducts>(
    initialProducts.slice(0, PRODUCTS_PER_PAGE)
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const loadMoreProducts = useCallback(() => {
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const newProducts = initialProducts.slice(startIndex, endIndex);

    if (newProducts.length > 0) {
      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setPage(nextPage);
    } else {
      setHasMore(false);
    }
  }, [page, initialProducts]);

  useEffect(() => {
    if (inView && hasMore) {
      loadMoreProducts();
    }
  }, [inView, hasMore, loadMoreProducts]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {hasMore && (
        <div ref={ref} className='text-center mt-8'>
          <p className='text-gray-500'>Loading more products...</p>
        </div>
      )}
    </div>
  );
}
