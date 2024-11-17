"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Plus } from "lucide-react";
import { RegionFilter, SearchBar } from "../CommonSearch";
import { getMorePosts } from "@/app/user/community/action";
import { PostItem } from "./PostItem";
import { PostListProps } from "@/app/types/props";
import { InitialPosts } from "@/app/types/common";

export default function PostList({
  initialPosts,
  initialLocation,
  isLoggedIn = false,
}: PostListProps) {
  const [posts, setPosts] = useState<InitialPosts>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState(initialLocation.province);
  const [city, setCity] = useState(initialLocation.city || "");
  const [district, setDistrict] = useState(initialLocation.district);

  const { ref, inView } = useInView();

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await getMorePosts(
        page + 1,
        province,
        city,
        district,
        query
      );

      if (response.posts.length > 0) {
        setPosts((prev) => [...prev, ...response.posts]);
        setPage((p) => p + 1);
        setHasMore(response.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, province, city, district, query, loading, hasMore]);

  useEffect(() => {
    if (inView) {
      loadMorePosts();
    }
  }, [inView]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
    setLoading(true);

    try {
      const response = await getMorePosts(
        1,
        province,
        city,
        district,
        searchQuery
      );
      setPosts(response.posts);
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
      const response = await getMorePosts(
        1,
        newProvince,
        newCity,
        newDistrict,
        query
      );
      setPosts(response.posts);
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
        <h1 className="text-3xl font-bold text-gray-900">Community</h1>
        {isLoggedIn ? (
          <Link
            href="/user/community/create"
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

      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/user/community/${post.id}`}
            className="block"
          >
            <PostItem post={post} />
          </Link>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {hasMore && !loading && <div ref={ref} className="h-10" />}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-gray-500 mt-8">
          All posts have been loaded.
        </p>
      )}

      {!hasMore && posts.length === 0 && (
        <div className="text-center mt-8">No more prosts.</div>
      )}
    </div>
  );
}
