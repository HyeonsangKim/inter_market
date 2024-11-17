"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Plus } from "lucide-react";
import { RegionFilter, SearchBar } from "../CommonSearch";
import { getMoreProducts } from "@/app/user/marketplace/products/action";
import { InitialProducts } from "@/app/types/common";
import { ProductListProps } from "@/app/types/props";
import { ProductItem } from "./ProductItem";

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
  const [province, setProvince] = useState(initialLocation.province);
  const [city, setCity] = useState(initialLocation.city || "");
  const [district, setDistrict] = useState(initialLocation.district);

  const { ref, inView } = useInView();

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await getMoreProducts(
        page + 1,
        province,
        city,
        district,
        query
      );

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
  }, [page, province, city, district, query, loading, hasMore]);

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
      const response = await getMoreProducts(
        1,
        province,
        city,
        district,
        searchQuery
      );
      setProducts(response.products);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (
    newProvince: string,
    newCity: string,
    newDistrict: string
  ) => {
    setProvince(newProvince);
    setCity(newCity);
    setDistrict(newDistrict);
    setPage(1);
    setLoading(true);

    try {
      const response = await getMoreProducts(
        1,
        newProvince,
        newCity,
        newDistrict,
        query
      );
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
            className="flex items-center btn-custom"
          >
            <Plus size={20} className="mr-2" />
            New
          </Link>
        ) : (
          <></>
        )}
      </div>

      <SearchBar onSearch={handleSearch} />
      <RegionFilter
        onFilterChange={handleFilterChange}
        initialProvince={initialLocation.province}
        initialCity={initialLocation.city}
        initialDistrict={initialLocation.district}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
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
          All products have been loaded.
        </p>
      )}
      {!hasMore && products.length === 0 && (
        <div className="text-center mt-8">No more products.</div>
      )}
    </div>
  );
}
