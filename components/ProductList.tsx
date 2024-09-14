"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { InitialProducts } from "@/app/user/marketplace/products/page";
import { formatToTimeAgo } from "@/app/utils/utils";
import Link from "next/link";
import { RegionFilter, SearchBar } from "./search";

const PRODUCTS_PER_PAGE = 9; // 한 페이지당 표시할 제품 수
interface ProductListProps {
  initialProducts: InitialProducts;
}
const ProductCard: React.FC<{ product: InitialProducts[number] }> = ({
  product,
}) => (
  <Link
    href={`/user/marketplace/products/${product.id}`}
    className='bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer'
  >
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
      <h2 className='text-lg font-semibold text-black mb-1 truncate'>
        {product.title}
      </h2>
      <p className='text-sm text-black'>{product.price} 원</p>
      <p className='text-sm text-black'>
        {product.user.si}&nbsp;{product.user.gu}
      </p>
      <p className='text-xs text-gray-500 mt-1'>
        {formatToTimeAgo(product.created_at.toString())}
      </p>
    </div>
  </Link>
);

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<InitialProducts>(
    initialProducts.slice(0, PRODUCTS_PER_PAGE)
  );
  const [filteredProducts, setFilteredProducts] =
    useState<InitialProducts>(initialProducts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const regions = [
    {
      city: "Seoul",
      districts: ["Gangnam-gu", "Seocho-gu", "Songpa-gu", "Mapo-gu"],
    },
    { city: "Busan", districts: ["Haeundae-gu", "Suyeong-gu", "Nam-gu"] },
    // Add other regions
  ];

  const loadMoreProducts = useCallback(() => {
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const newProducts = filteredProducts.slice(startIndex, endIndex);

    if (newProducts.length > 0) {
      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setPage(nextPage);
    } else {
      setHasMore(false);
    }
  }, [page, filteredProducts]);

  useEffect(() => {
    if (inView && hasMore) {
      loadMoreProducts();
    }
  }, [inView, hasMore, loadMoreProducts]);

  const handleSearch = (query: string) => {
    const filtered = initialProducts.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
    setProducts(filtered.slice(0, PRODUCTS_PER_PAGE));
    setPage(1);
    setHasMore(true);
  };

  const handleFilterChange = (city: string, district: string) => {
    const filtered = initialProducts.filter((product) => {
      if (city && district) {
        return product.user.si === city && product.user.gu === district;
      } else if (city) {
        return product.user.si === city;
      }
      return true;
    });
    setFilteredProducts(filtered);
    setProducts(filtered.slice(0, PRODUCTS_PER_PAGE));
    setPage(1);
    setHasMore(true);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <SearchBar onSearch={handleSearch} />
      <RegionFilter regions={regions} onFilterChange={handleFilterChange} />
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
