"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { formatToTimeAgo } from "@/app/utils/utils";
import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { InitialProducts } from "@/app/user/marketplace/products/page";
import { regions } from "@/app/utils/address-info";
import { RegionFilter, SearchBar } from "../search";

const PRODUCTS_PER_PAGE = 12; // 한 페이지당 표시할 제품 수 증가

interface ProductListProps {
  initialProducts: InitialProducts;
}

const ProductCard: React.FC<{ product: InitialProducts[number] }> = ({
  product,
}) => (
  <Link
    href={`/user/marketplace/products/${product.id}`}
    className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
  >
    <div className="relative">
      <div className="relative h-48 w-full">
        {product.photos[0] && (
          <>
            <Image
              fill
              src={product.photos[0].url}
              alt={product.title}
              className={`object-cover ${
                product.soldout ? "filter blur-[2px]" : ""
              }`}
            />
            {product.soldout && (
              <Image
                fill
                src={"/img/soldout.png"}
                alt={product.title}
                className="object-contain"
              />
            )}
          </>
        )}
      </div>
    </div>
    <div className="p-4 flex-grow flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.title}
        </h2>
        <p className="text-xl font-bold text-indigo-600 mb-2">
          {product.price.toLocaleString()} Won
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600 flex items-center">
          <MapPin size={14} className="mr-1" />
          {product.user.si} {product.user.gu}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatToTimeAgo(product.created_at.toString())}
        </p>
      </div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        <Link
          href="/user/marketplace/products/create"
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          <Plus size={20} className="mr-2" />
          New Product
        </Link>
      </div>
      <SearchBar onSearch={handleSearch} />
      <RegionFilter regions={regions} onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {hasMore && (
        <div ref={ref} className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      )}
    </div>
  );
}
