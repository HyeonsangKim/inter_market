"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Plus } from "lucide-react";
import { InitialPosts } from "@/app/user/community/page";
import { regions } from "@/app/utils/address-info";
import { RegionFilter, SearchBar } from "./search";
import { format } from "date-fns";
const POSTS_PER_PAGE = 10;

interface PostListProps {
  initialPosts: InitialPosts;
}

export default function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<InitialPosts>([]);
  const [filteredPosts, setFilteredPosts] =
    useState<InitialPosts>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  const loadMorePosts = useCallback(() => {
    if (!hasMore || loading) return;

    setLoading(true);
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const newPosts = filteredPosts.slice(startIndex, endIndex);

    if (newPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  }, [page, filteredPosts, hasMore, loading]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMorePosts();
    }
  }, [inView, hasMore, loading, loadMorePosts]);

  const resetPostList = useCallback(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
  }, []);

  const handleSearch = (query: string) => {
    const filtered = initialPosts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
    resetPostList();
  };

  const handleFilterChange = (city: string, district: string) => {
    const filtered = initialPosts.filter((post) => {
      if (city && district) {
        return post.user.si === city && post.user.gu === district;
      } else if (city) {
        return post.user.si === city;
      }
      return true;
    });
    setFilteredPosts(filtered);
    resetPostList();
  };

  if (loading && posts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Community</h1>
        <Link
          href="/user/community/create"
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          <Plus size={20} className="mr-2" />
          New Post
        </Link>
      </div>

      <SearchBar onSearch={handleSearch} />
      <RegionFilter regions={regions} onFilterChange={handleFilterChange} />

      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/user/community/${post.id}`}
            className="text-xl font-semibold hover:shadow-lg transition"
          >
            <div className="border p-4 rounded">
              {post.title}

              <p className="text-gray-600">
                {post.description!.substring(0, 100)}...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                writer: {post.user.name} | date:{" "}
                {format(new Date(post.created_at), "yyyy-MM-dd")}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div ref={ref} className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!hasMore && posts.length === 0 && (
        <div className="text-center mt-8">No post.</div>
      )}
    </div>
  );
}
