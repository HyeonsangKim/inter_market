"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { formatToTimeAgo } from "@/app/utils/utils";
import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { InitialProducts } from "@/app/user/marketplace/products/page";
import { regions } from "@/app/utils/address-info";
import { RegionFilter, SearchBar } from "../Search";
import { getMoreProducts } from "@/app/user/marketplace/products/action";

interface ProductListProps {
  initialProducts: InitialProducts;
  initialLocation: {
    city: string;
    district: string;
  };
  isLoggedIn?: boolean;
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

export default function ProductList({
  initialProducts,
  initialLocation,
  isLoggedIn = false,
}: ProductListProps) {
  const [products, setProducts] = useState<InitialProducts>(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState(initialLocation.city);
  const [district, setDistrict] = useState(initialLocation.district);

  const { ref, inView } = useInView();

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await getMoreProducts(page + 1, city, district, query);

      if (response.products.length > 0) {
        setProducts((prev) => [...prev, ...response.products]);
        setPage((p) => p + 1);
        setHasMore(response.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, city, district, query, loading, hasMore]);

  useEffect(() => {
    if (inView) {
      loadMoreProducts();
    }
  }, [inView]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
    setLoading(true);

    try {
      const response = await getMoreProducts(1, city, district, searchQuery);
      setProducts(response.products);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newCity: string, newDistrict: string) => {
    setCity(newCity);
    setDistrict(newDistrict);
    setPage(1);
    setLoading(true);

    try {
      const response = await getMoreProducts(1, newCity, newDistrict, query);
      setProducts(response.products);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Filter failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        {isLoggedIn ? (
          <Link
            href="/user/marketplace/products/create"
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <Plus size={20} className="mr-2" />
            New Product
          </Link>
        ) : (
          <></>
        )}
      </div>

      <SearchBar onSearch={handleSearch} />
      <RegionFilter
        regions={regions}
        onFilterChange={handleFilterChange}
        initialCity={initialLocation.city}
        initialDistrict={initialLocation.district}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {hasMore && !loading && <div ref={ref} className="h-10" />}

      {!hasMore && products.length > 0 && (
        <p className="text-center text-gray-500 mt-8">
          모든 상품을 불러왔습니다.
        </p>
      )}
      {!hasMore && products.length === 0 && (
        <div className="text-center mt-8">상품이 없습니다.</div>
      )}
    </div>
  );
}
