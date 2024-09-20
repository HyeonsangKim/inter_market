"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { formatToTimeAgo } from "@/app/utils/utils";
import Link from "next/link";
import { Search, MapPin, ChevronDown, Plus } from "lucide-react";
import { InitialProducts } from "@/app/user/marketplace/products/page";

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
    <div className="relative h-48 w-full">
      {product.photos[0] && (
        <Image
          fill
          src={product.photos[0].url}
          alt={product.title}
          className="object-cover"
        />
      )}
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

const SearchBar: React.FC<{ onSearch: (query: string) => void }> = ({
  onSearch,
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
    </form>
  );
};

const RegionFilter: React.FC<{
  regions: { city: string; districts: string[] }[];
  onFilterChange: (city: string, district: string) => void;
}> = ({ regions, onFilterChange }) => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict("");
    onFilterChange(city, "");
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    onFilterChange(selectedCity, district);
  };

  return (
    <div className="flex space-x-4 mb-6">
      <div className="relative">
        <select
          value={selectedCity}
          onChange={(e) => handleCityChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All cities</option>
          {regions.map((region) => (
            <option key={region.city} value={region.city}>
              {region.city}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      {selectedCity && (
        <div className="relative">
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All districts</option>
            {regions
              .find((region) => region.city === selectedCity)
              ?.districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      )}
    </div>
  );
};

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
